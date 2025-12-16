
-- Skills and Tags for Profile Intelligence
CREATE TABLE public.skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text,
  is_system boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE(name)
);

CREATE TABLE public.user_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  skill_id uuid REFERENCES public.skills(id) ON DELETE CASCADE NOT NULL,
  is_self_reported boolean DEFAULT false,
  verified boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE(user_id, skill_id)
);

-- Roster Management
CREATE TABLE public.roster_uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  uploaded_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  file_name text NOT NULL,
  file_path text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  total_records integer DEFAULT 0,
  new_users integer DEFAULT 0,
  updated_users integer DEFAULT 0,
  deactivated_users integer DEFAULT 0,
  errors jsonb DEFAULT '[]',
  diff_preview jsonb,
  processed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Retiree Marketplace
CREATE TYPE public.retiree_status AS ENUM ('pending', 'active', 'inactive', 'suspended');

CREATE TABLE public.retirees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  personal_email text,
  identity_verified boolean DEFAULT false,
  verification_document text,
  status retiree_status DEFAULT 'pending',
  guild_member boolean DEFAULT false,
  available_for_work boolean DEFAULT true,
  hourly_rate decimal(10,2),
  bio text,
  expertise text[],
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Organizations for Onboarding
CREATE TABLE public.organizations_registry (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  domain text,
  domain_verified boolean DEFAULT false,
  plan_type text DEFAULT 'freemium' CHECK (plan_type IN ('freemium', 'basic', 'professional', 'enterprise')),
  external_collab_enabled boolean DEFAULT false,
  admin_email text,
  verified_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Sponsor Analytics
CREATE TABLE public.sponsor_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sponsor_id uuid NOT NULL,
  period_start date NOT NULL,
  period_end date NOT NULL,
  impressions integer DEFAULT 0,
  content_downloads integer DEFAULT 0,
  engagement_clicks integer DEFAULT 0,
  unique_viewers integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.sponsor_visibility_contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sponsor_id uuid NOT NULL,
  contract_start date NOT NULL,
  contract_end date NOT NULL,
  guaranteed_impressions integer,
  actual_impressions integer DEFAULT 0,
  status text DEFAULT 'active' CHECK (status IN ('draft', 'active', 'completed', 'cancelled')),
  terms jsonb,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- City Collaborations
CREATE TYPE public.collaboration_status AS ENUM ('pending', 'active', 'suspended', 'ended');

CREATE TABLE public.city_collaborations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  initiator_org_id uuid REFERENCES public.organizations_registry(id) ON DELETE CASCADE,
  partner_org_id uuid REFERENCES public.organizations_registry(id) ON DELETE CASCADE,
  collaboration_name text NOT NULL,
  scope text[] DEFAULT '{}',
  status collaboration_status DEFAULT 'pending',
  invitation_sent_at timestamp with time zone,
  accepted_at timestamp with time zone,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.shared_workspaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collaboration_id uuid REFERENCES public.city_collaborations(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  data_sharing_scope jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.workspace_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid REFERENCES public.shared_workspaces(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  access_level text DEFAULT 'viewer' CHECK (access_level IN ('viewer', 'contributor', 'admin')),
  granted_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE(workspace_id, user_id)
);

-- GovBot Librarian
CREATE TABLE public.govbot_trusted_urls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL UNIQUE,
  domain text NOT NULL,
  category text,
  is_active boolean DEFAULT true,
  last_crawled_at timestamp with time zone,
  crawl_frequency_hours integer DEFAULT 24,
  added_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.govbot_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_url_id uuid REFERENCES public.govbot_trusted_urls(id) ON DELETE CASCADE,
  title text NOT NULL,
  summary text,
  full_content text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at timestamp with time zone,
  rejection_reason text,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS on all new tables
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roster_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.retirees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsor_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsor_visibility_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.city_collaborations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.govbot_trusted_urls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.govbot_content ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Everyone can view skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Admins can manage skills" ON public.skills FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view own skills" ON public.user_skills FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can manage own skills" ON public.user_skills FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Admins can manage all skills" ON public.user_skills FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roster uploads" ON public.roster_uploads FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view own retiree profile" ON public.retirees FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own retiree profile" ON public.retirees FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Admins can manage all retirees" ON public.retirees FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Everyone can view organizations" ON public.organizations_registry FOR SELECT USING (true);
CREATE POLICY "Admins can manage organizations" ON public.organizations_registry FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage sponsor analytics" ON public.sponsor_analytics FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage sponsor contracts" ON public.sponsor_visibility_contracts FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Everyone can view collaborations" ON public.city_collaborations FOR SELECT USING (true);
CREATE POLICY "Admins can manage collaborations" ON public.city_collaborations FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Everyone can view shared workspaces" ON public.shared_workspaces FOR SELECT USING (true);
CREATE POLICY "Admins can manage shared workspaces" ON public.shared_workspaces FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view own workspace access" ON public.workspace_access FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins can manage workspace access" ON public.workspace_access FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Everyone can view trusted URLs" ON public.govbot_trusted_urls FOR SELECT USING (true);
CREATE POLICY "Admins can manage trusted URLs" ON public.govbot_trusted_urls FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Everyone can view approved content" ON public.govbot_content FOR SELECT USING (status = 'approved');
CREATE POLICY "Admins can manage all content" ON public.govbot_content FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Triggers for updated_at
CREATE TRIGGER update_retirees_updated_at BEFORE UPDATE ON public.retirees FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_organizations_registry_updated_at BEFORE UPDATE ON public.organizations_registry FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_sponsor_visibility_contracts_updated_at BEFORE UPDATE ON public.sponsor_visibility_contracts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_city_collaborations_updated_at BEFORE UPDATE ON public.city_collaborations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_shared_workspaces_updated_at BEFORE UPDATE ON public.shared_workspaces FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
