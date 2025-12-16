export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      channel_ownership: {
        Row: {
          channel_id: string
          created_at: string
          id: string
          is_primary: boolean | null
          ownership_date: string
          user_id: string
        }
        Insert: {
          channel_id: string
          created_at?: string
          id?: string
          is_primary?: boolean | null
          ownership_date?: string
          user_id: string
        }
        Update: {
          channel_id?: string
          created_at?: string
          id?: string
          is_primary?: boolean | null
          ownership_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "channel_ownership_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "channel_ownership_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      channels: {
        Row: {
          created_at: string
          created_by: string | null
          department_id: string | null
          description: string | null
          id: string
          name: string
          permissions: Json | null
          type: Database["public"]["Enums"]["channel_type"] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          department_id?: string | null
          description?: string | null
          id?: string
          name: string
          permissions?: Json | null
          type?: Database["public"]["Enums"]["channel_type"] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          department_id?: string | null
          description?: string | null
          id?: string
          name?: string
          permissions?: Json | null
          type?: Database["public"]["Enums"]["channel_type"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "channels_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "channels_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      city_collaborations: {
        Row: {
          accepted_at: string | null
          collaboration_name: string
          created_at: string
          created_by: string | null
          id: string
          initiator_org_id: string | null
          invitation_sent_at: string | null
          partner_org_id: string | null
          scope: string[] | null
          status: Database["public"]["Enums"]["collaboration_status"] | null
          updated_at: string
        }
        Insert: {
          accepted_at?: string | null
          collaboration_name: string
          created_at?: string
          created_by?: string | null
          id?: string
          initiator_org_id?: string | null
          invitation_sent_at?: string | null
          partner_org_id?: string | null
          scope?: string[] | null
          status?: Database["public"]["Enums"]["collaboration_status"] | null
          updated_at?: string
        }
        Update: {
          accepted_at?: string | null
          collaboration_name?: string
          created_at?: string
          created_by?: string | null
          id?: string
          initiator_org_id?: string | null
          invitation_sent_at?: string | null
          partner_org_id?: string | null
          scope?: string[] | null
          status?: Database["public"]["Enums"]["collaboration_status"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "city_collaborations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "city_collaborations_initiator_org_id_fkey"
            columns: ["initiator_org_id"]
            isOneToOne: false
            referencedRelation: "organizations_registry"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "city_collaborations_partner_org_id_fkey"
            columns: ["partner_org_id"]
            isOneToOne: false
            referencedRelation: "organizations_registry"
            referencedColumns: ["id"]
          },
        ]
      }
      content: {
        Row: {
          channel_id: string | null
          content: string
          content_type: string | null
          created_at: string
          id: string
          moderated_at: string | null
          moderated_by: string | null
          status: Database["public"]["Enums"]["content_status"] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          channel_id?: string | null
          content: string
          content_type?: string | null
          created_at?: string
          id?: string
          moderated_at?: string | null
          moderated_by?: string | null
          status?: Database["public"]["Enums"]["content_status"] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          channel_id?: string | null
          content?: string
          content_type?: string | null
          created_at?: string
          id?: string
          moderated_at?: string | null
          moderated_by?: string | null
          status?: Database["public"]["Enums"]["content_status"] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_moderated_by_fkey"
            columns: ["moderated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      content_removal_logs: {
        Row: {
          content_id: string
          created_at: string
          id: string
          original_content: string | null
          reason: string | null
          removal_date: string
          removed_by: string | null
        }
        Insert: {
          content_id: string
          created_at?: string
          id?: string
          original_content?: string | null
          reason?: string | null
          removal_date?: string
          removed_by?: string | null
        }
        Update: {
          content_id?: string
          created_at?: string
          id?: string
          original_content?: string | null
          reason?: string | null
          removal_date?: string
          removed_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_removal_logs_removed_by_fkey"
            columns: ["removed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      file_upload_restrictions: {
        Row: {
          allowed_file_types: string[] | null
          channel_id: string
          created_at: string
          id: string
          max_file_size_mb: number | null
          updated_at: string
        }
        Insert: {
          allowed_file_types?: string[] | null
          channel_id: string
          created_at?: string
          id?: string
          max_file_size_mb?: number | null
          updated_at?: string
        }
        Update: {
          allowed_file_types?: string[] | null
          channel_id?: string
          created_at?: string
          id?: string
          max_file_size_mb?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "file_upload_restrictions_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: true
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
        ]
      }
      govbot_content: {
        Row: {
          created_at: string
          full_content: string | null
          id: string
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          source_url_id: string | null
          status: string | null
          summary: string | null
          title: string
        }
        Insert: {
          created_at?: string
          full_content?: string | null
          id?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          source_url_id?: string | null
          status?: string | null
          summary?: string | null
          title: string
        }
        Update: {
          created_at?: string
          full_content?: string | null
          id?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          source_url_id?: string | null
          status?: string | null
          summary?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "govbot_content_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "govbot_content_source_url_id_fkey"
            columns: ["source_url_id"]
            isOneToOne: false
            referencedRelation: "govbot_trusted_urls"
            referencedColumns: ["id"]
          },
        ]
      }
      govbot_trusted_urls: {
        Row: {
          added_by: string | null
          category: string | null
          crawl_frequency_hours: number | null
          created_at: string
          domain: string
          id: string
          is_active: boolean | null
          last_crawled_at: string | null
          url: string
        }
        Insert: {
          added_by?: string | null
          category?: string | null
          crawl_frequency_hours?: number | null
          created_at?: string
          domain: string
          id?: string
          is_active?: boolean | null
          last_crawled_at?: string | null
          url: string
        }
        Update: {
          added_by?: string | null
          category?: string | null
          crawl_frequency_hours?: number | null
          created_at?: string
          domain?: string
          id?: string
          is_active?: boolean | null
          last_crawled_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "govbot_trusted_urls_added_by_fkey"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      legal_disclaimers: {
        Row: {
          content: string
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean | null
          requires_acceptance: boolean | null
          title: string
          updated_at: string
          version: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          requires_acceptance?: boolean | null
          title: string
          updated_at?: string
          version: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          requires_acceptance?: boolean | null
          title?: string
          updated_at?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "legal_disclaimers_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          channel_id: string
          content: string
          created_at: string
          file_name: string | null
          file_path: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          channel_id: string
          content: string
          created_at?: string
          file_name?: string | null
          file_path?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          channel_id?: string
          content?: string
          created_at?: string
          file_name?: string | null
          file_path?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations_registry: {
        Row: {
          admin_email: string | null
          created_at: string
          domain: string | null
          domain_verified: boolean | null
          external_collab_enabled: boolean | null
          id: string
          name: string
          plan_type: string | null
          updated_at: string
          verified_at: string | null
        }
        Insert: {
          admin_email?: string | null
          created_at?: string
          domain?: string | null
          domain_verified?: boolean | null
          external_collab_enabled?: boolean | null
          id?: string
          name: string
          plan_type?: string | null
          updated_at?: string
          verified_at?: string | null
        }
        Update: {
          admin_email?: string | null
          created_at?: string
          domain?: string | null
          domain_verified?: boolean | null
          external_collab_enabled?: boolean | null
          id?: string
          name?: string
          plan_type?: string | null
          updated_at?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      retirees: {
        Row: {
          available_for_work: boolean | null
          bio: string | null
          created_at: string
          expertise: string[] | null
          guild_member: boolean | null
          hourly_rate: number | null
          id: string
          identity_verified: boolean | null
          personal_email: string | null
          status: Database["public"]["Enums"]["retiree_status"] | null
          updated_at: string
          user_id: string | null
          verification_document: string | null
        }
        Insert: {
          available_for_work?: boolean | null
          bio?: string | null
          created_at?: string
          expertise?: string[] | null
          guild_member?: boolean | null
          hourly_rate?: number | null
          id?: string
          identity_verified?: boolean | null
          personal_email?: string | null
          status?: Database["public"]["Enums"]["retiree_status"] | null
          updated_at?: string
          user_id?: string | null
          verification_document?: string | null
        }
        Update: {
          available_for_work?: boolean | null
          bio?: string | null
          created_at?: string
          expertise?: string[] | null
          guild_member?: boolean | null
          hourly_rate?: number | null
          id?: string
          identity_verified?: boolean | null
          personal_email?: string | null
          status?: Database["public"]["Enums"]["retiree_status"] | null
          updated_at?: string
          user_id?: string | null
          verification_document?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "retirees_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      roster_uploads: {
        Row: {
          created_at: string
          deactivated_users: number | null
          diff_preview: Json | null
          errors: Json | null
          file_name: string
          file_path: string | null
          id: string
          new_users: number | null
          processed_at: string | null
          status: string | null
          total_records: number | null
          updated_users: number | null
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          deactivated_users?: number | null
          diff_preview?: Json | null
          errors?: Json | null
          file_name: string
          file_path?: string | null
          id?: string
          new_users?: number | null
          processed_at?: string | null
          status?: string | null
          total_records?: number | null
          updated_users?: number | null
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          deactivated_users?: number | null
          diff_preview?: Json | null
          errors?: Json | null
          file_name?: string
          file_path?: string | null
          id?: string
          new_users?: number | null
          processed_at?: string | null
          status?: string | null
          total_records?: number | null
          updated_users?: number | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "roster_uploads_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      shared_workspaces: {
        Row: {
          collaboration_id: string
          created_at: string
          data_sharing_scope: Json | null
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          collaboration_id: string
          created_at?: string
          data_sharing_scope?: Json | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          collaboration_id?: string
          created_at?: string
          data_sharing_scope?: Json | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shared_workspaces_collaboration_id_fkey"
            columns: ["collaboration_id"]
            isOneToOne: false
            referencedRelation: "city_collaborations"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          category: string | null
          created_at: string
          id: string
          is_system: boolean | null
          name: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          is_system?: boolean | null
          name: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          is_system?: boolean | null
          name?: string
        }
        Relationships: []
      }
      sops: {
        Row: {
          category_id: string | null
          created_at: string
          created_by: string | null
          department_id: string | null
          description: string | null
          file_name: string | null
          file_path: string | null
          file_size: number | null
          id: string
          tags: string[] | null
          title: string
          updated_at: string
          version: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          department_id?: string | null
          description?: string | null
          file_name?: string | null
          file_path?: string | null
          file_size?: number | null
          id?: string
          tags?: string[] | null
          title: string
          updated_at?: string
          version?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          department_id?: string | null
          description?: string | null
          file_name?: string | null
          file_path?: string | null
          file_size?: number | null
          id?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "sops_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sops_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sops_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsor_analytics: {
        Row: {
          content_downloads: number | null
          created_at: string
          engagement_clicks: number | null
          id: string
          impressions: number | null
          period_end: string
          period_start: string
          sponsor_id: string
          unique_viewers: number | null
        }
        Insert: {
          content_downloads?: number | null
          created_at?: string
          engagement_clicks?: number | null
          id?: string
          impressions?: number | null
          period_end: string
          period_start: string
          sponsor_id: string
          unique_viewers?: number | null
        }
        Update: {
          content_downloads?: number | null
          created_at?: string
          engagement_clicks?: number | null
          id?: string
          impressions?: number | null
          period_end?: string
          period_start?: string
          sponsor_id?: string
          unique_viewers?: number | null
        }
        Relationships: []
      }
      sponsor_visibility_contracts: {
        Row: {
          actual_impressions: number | null
          contract_end: string
          contract_start: string
          created_at: string
          guaranteed_impressions: number | null
          id: string
          sponsor_id: string
          status: string | null
          terms: Json | null
          updated_at: string
        }
        Insert: {
          actual_impressions?: number | null
          contract_end: string
          contract_start: string
          created_at?: string
          guaranteed_impressions?: number | null
          id?: string
          sponsor_id: string
          status?: string | null
          terms?: Json | null
          updated_at?: string
        }
        Update: {
          actual_impressions?: number | null
          contract_end?: string
          contract_start?: string
          created_at?: string
          guaranteed_impressions?: number | null
          id?: string
          sponsor_id?: string
          status?: string | null
          terms?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      user_bans: {
        Row: {
          ban_date: string
          banned_by: string | null
          channel_id: string | null
          created_at: string
          expires_at: string | null
          id: string
          is_global: boolean | null
          reason: string | null
          user_id: string
        }
        Insert: {
          ban_date?: string
          banned_by?: string | null
          channel_id?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_global?: boolean | null
          reason?: string | null
          user_id: string
        }
        Update: {
          ban_date?: string
          banned_by?: string | null
          channel_id?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_global?: boolean | null
          reason?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_bans_banned_by_fkey"
            columns: ["banned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_bans_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_bans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          created_at: string
          disclaimer_accepted: boolean | null
          disclaimer_accepted_at: string | null
          email_notifications: boolean | null
          id: string
          profile_visibility:
            | Database["public"]["Enums"]["profile_visibility"]
            | null
          sponsor_posting_enabled: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          disclaimer_accepted?: boolean | null
          disclaimer_accepted_at?: string | null
          email_notifications?: boolean | null
          id?: string
          profile_visibility?:
            | Database["public"]["Enums"]["profile_visibility"]
            | null
          sponsor_posting_enabled?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          disclaimer_accepted?: boolean | null
          disclaimer_accepted_at?: string | null
          email_notifications?: boolean | null
          id?: string
          profile_visibility?:
            | Database["public"]["Enums"]["profile_visibility"]
            | null
          sponsor_posting_enabled?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_skills: {
        Row: {
          created_at: string
          id: string
          is_self_reported: boolean | null
          skill_id: string
          user_id: string
          verified: boolean | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_self_reported?: boolean | null
          skill_id: string
          user_id: string
          verified?: boolean | null
        }
        Update: {
          created_at?: string
          id?: string
          is_self_reported?: boolean | null
          skill_id?: string
          user_id?: string
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "user_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_skills_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      violation_logs: {
        Row: {
          action_by: string | null
          action_taken: Database["public"]["Enums"]["moderation_action"]
          content_id: string | null
          created_at: string
          id: string
          notes: string | null
          user_id: string
          violation_type: Database["public"]["Enums"]["violation_type"]
        }
        Insert: {
          action_by?: string | null
          action_taken: Database["public"]["Enums"]["moderation_action"]
          content_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          user_id: string
          violation_type: Database["public"]["Enums"]["violation_type"]
        }
        Update: {
          action_by?: string | null
          action_taken?: Database["public"]["Enums"]["moderation_action"]
          content_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          user_id?: string
          violation_type?: Database["public"]["Enums"]["violation_type"]
        }
        Relationships: [
          {
            foreignKeyName: "violation_logs_action_by_fkey"
            columns: ["action_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "violation_logs_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "violation_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_access: {
        Row: {
          access_level: string | null
          created_at: string
          granted_by: string | null
          id: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          access_level?: string | null
          created_at?: string
          granted_by?: string | null
          id?: string
          user_id: string
          workspace_id: string
        }
        Update: {
          access_level?: string | null
          created_at?: string
          granted_by?: string | null
          id?: string
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_access_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspace_access_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspace_access_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "shared_workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_channel_owner: {
        Args: { _channel_id: string; _user_id: string }
        Returns: boolean
      }
      is_user_banned: {
        Args: { _channel_id?: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "department_manager" | "staff"
      channel_type: "organization" | "topic" | "private" | "public"
      collaboration_status: "pending" | "active" | "suspended" | "ended"
      content_status: "pending" | "approved" | "rejected" | "flagged"
      moderation_action:
        | "warning"
        | "content_removal"
        | "temp_ban"
        | "perm_ban"
        | "mute"
      profile_visibility: "public" | "members_only" | "private"
      retiree_status: "pending" | "active" | "inactive" | "suspended"
      violation_type:
        | "spam"
        | "harassment"
        | "hate_speech"
        | "misinformation"
        | "inappropriate_content"
        | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "department_manager", "staff"],
      channel_type: ["organization", "topic", "private", "public"],
      collaboration_status: ["pending", "active", "suspended", "ended"],
      content_status: ["pending", "approved", "rejected", "flagged"],
      moderation_action: [
        "warning",
        "content_removal",
        "temp_ban",
        "perm_ban",
        "mute",
      ],
      profile_visibility: ["public", "members_only", "private"],
      retiree_status: ["pending", "active", "inactive", "suspended"],
      violation_type: [
        "spam",
        "harassment",
        "hate_speech",
        "misinformation",
        "inappropriate_content",
        "other",
      ],
    },
  },
} as const
