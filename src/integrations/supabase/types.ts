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
      content_status: "pending" | "approved" | "rejected" | "flagged"
      moderation_action:
        | "warning"
        | "content_removal"
        | "temp_ban"
        | "perm_ban"
        | "mute"
      profile_visibility: "public" | "members_only" | "private"
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
      content_status: ["pending", "approved", "rejected", "flagged"],
      moderation_action: [
        "warning",
        "content_removal",
        "temp_ban",
        "perm_ban",
        "mute",
      ],
      profile_visibility: ["public", "members_only", "private"],
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
