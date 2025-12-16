
-- Create enum for channel types
CREATE TYPE public.channel_type AS ENUM ('organization', 'topic', 'private', 'public');

-- Create enum for moderation action types
CREATE TYPE public.moderation_action AS ENUM ('warning', 'content_removal', 'temp_ban', 'perm_ban', 'mute');

-- Create enum for violation types
CREATE TYPE public.violation_type AS ENUM ('spam', 'harassment', 'hate_speech', 'misinformation', 'inappropriate_content', 'other');

-- Create enum for content status
CREATE TYPE public.content_status AS ENUM ('pending', 'approved', 'rejected', 'flagged');

-- Create enum for profile visibility
CREATE TYPE public.profile_visibility AS ENUM ('public', 'members_only', 'private');

-- Add new columns to channels table
ALTER TABLE public.channels 
ADD COLUMN IF NOT EXISTS type channel_type DEFAULT 'public',
ADD COLUMN IF NOT EXISTS permissions jsonb DEFAULT '{}';

-- Channel Ownership Table
CREATE TABLE public.channel_ownership (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id uuid REFERENCES public.channels(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  ownership_date timestamp with time zone DEFAULT now() NOT NULL,
  is_primary boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE(channel_id, user_id)
);

-- User Bans Table
CREATE TABLE public.user_bans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  channel_id uuid REFERENCES public.channels(id) ON DELETE CASCADE,
  banned_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  ban_date timestamp with time zone DEFAULT now() NOT NULL,
  expires_at timestamp with time zone,
  reason text,
  is_global boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Content Table for moderated content
CREATE TABLE public.content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  channel_id uuid REFERENCES public.channels(id) ON DELETE CASCADE,
  content text NOT NULL,
  content_type text DEFAULT 'post',
  status content_status DEFAULT 'pending',
  moderated_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  moderated_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Content Removal Logs Table
CREATE TABLE public.content_removal_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid NOT NULL,
  removed_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  removal_date timestamp with time zone DEFAULT now() NOT NULL,
  reason text,
  original_content text,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Violation Logs Table
CREATE TABLE public.violation_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content_id uuid REFERENCES public.content(id) ON DELETE SET NULL,
  violation_type violation_type NOT NULL,
  action_taken moderation_action NOT NULL,
  action_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  notes text,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- File Upload Restrictions Table
CREATE TABLE public.file_upload_restrictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id uuid REFERENCES public.channels(id) ON DELETE CASCADE NOT NULL,
  allowed_file_types text[] DEFAULT ARRAY['image/jpeg', 'image/png', 'application/pdf'],
  max_file_size_mb integer DEFAULT 10,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE(channel_id)
);

-- User Visibility Preferences Table
CREATE TABLE public.user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  profile_visibility profile_visibility DEFAULT 'public',
  sponsor_posting_enabled boolean DEFAULT false,
  disclaimer_accepted boolean DEFAULT false,
  disclaimer_accepted_at timestamp with time zone,
  email_notifications boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE(user_id)
);

-- Legal Disclaimers Table (for admin management)
CREATE TABLE public.legal_disclaimers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  version text NOT NULL,
  is_active boolean DEFAULT true,
  requires_acceptance boolean DEFAULT true,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS on all new tables
ALTER TABLE public.channel_ownership ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_bans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_removal_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.violation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_upload_restrictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_disclaimers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for channel_ownership
CREATE POLICY "Everyone can view channel ownership" ON public.channel_ownership FOR SELECT USING (true);
CREATE POLICY "Admins can manage channel ownership" ON public.channel_ownership FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for user_bans
CREATE POLICY "Admins can manage all bans" ON public.user_bans FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can view their own bans" ON public.user_bans FOR SELECT USING (user_id = auth.uid());

-- RLS Policies for content
CREATE POLICY "Everyone can view approved content" ON public.content FOR SELECT USING (status = 'approved' OR user_id = auth.uid());
CREATE POLICY "Users can create content" ON public.content FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own content" ON public.content FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Admins can manage all content" ON public.content FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for content_removal_logs
CREATE POLICY "Admins can manage removal logs" ON public.content_removal_logs FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for violation_logs
CREATE POLICY "Admins can manage violation logs" ON public.violation_logs FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can view their own violations" ON public.violation_logs FOR SELECT USING (user_id = auth.uid());

-- RLS Policies for file_upload_restrictions
CREATE POLICY "Everyone can view file restrictions" ON public.file_upload_restrictions FOR SELECT USING (true);
CREATE POLICY "Admins can manage file restrictions" ON public.file_upload_restrictions FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for user_preferences
CREATE POLICY "Users can manage own preferences" ON public.user_preferences FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Admins can view all preferences" ON public.user_preferences FOR SELECT USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for legal_disclaimers
CREATE POLICY "Everyone can view active disclaimers" ON public.legal_disclaimers FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage disclaimers" ON public.legal_disclaimers FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at on new tables
CREATE TRIGGER update_content_updated_at BEFORE UPDATE ON public.content FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_file_upload_restrictions_updated_at BEFORE UPDATE ON public.file_upload_restrictions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON public.user_preferences FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_legal_disclaimers_updated_at BEFORE UPDATE ON public.legal_disclaimers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to check if user is channel owner
CREATE OR REPLACE FUNCTION public.is_channel_owner(_user_id uuid, _channel_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.channel_ownership
    WHERE user_id = _user_id AND channel_id = _channel_id
  )
$$;

-- Function to check if user is banned from channel
CREATE OR REPLACE FUNCTION public.is_user_banned(_user_id uuid, _channel_id uuid DEFAULT NULL)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_bans
    WHERE user_id = _user_id
      AND (is_global = true OR channel_id = _channel_id)
      AND (expires_at IS NULL OR expires_at > now())
  )
$$;
