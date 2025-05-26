export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      job_preferences: {
        Row: {
          created_at: string
          employment_types: string[] | null
          id: string
          industries: string[] | null
          job_titles: string[] | null
          locations: string[] | null
          remote_preference: boolean | null
          salary_max: number | null
          salary_min: number | null
          skills: string[] | null
          updated_at: string
          user_id: string
          years_experience: number | null
        }
        Insert: {
          created_at?: string
          employment_types?: string[] | null
          id?: string
          industries?: string[] | null
          job_titles?: string[] | null
          locations?: string[] | null
          remote_preference?: boolean | null
          salary_max?: number | null
          salary_min?: number | null
          skills?: string[] | null
          updated_at?: string
          user_id: string
          years_experience?: number | null
        }
        Update: {
          created_at?: string
          employment_types?: string[] | null
          id?: string
          industries?: string[] | null
          job_titles?: string[] | null
          locations?: string[] | null
          remote_preference?: boolean | null
          salary_max?: number | null
          salary_min?: number | null
          skills?: string[] | null
          updated_at?: string
          user_id?: string
          years_experience?: number | null
        }
        Relationships: []
      }
      job_searches: {
        Row: {
          created_at: string
          id: string
          results_count: number
          search_query: Json
          search_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          results_count?: number
          search_query: Json
          search_type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          results_count?: number
          search_query?: Json
          search_type?: string
          user_id?: string
        }
        Relationships: []
      }
      job_views: {
        Row: {
          apply_url: string | null
          company: string
          created_at: string
          id: string
          job_title: string
          user_id: string
          viewed_at: string
        }
        Insert: {
          apply_url?: string | null
          company: string
          created_at?: string
          id?: string
          job_title: string
          user_id: string
          viewed_at?: string
        }
        Update: {
          apply_url?: string | null
          company?: string
          created_at?: string
          id?: string
          job_title?: string
          user_id?: string
          viewed_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: string
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      saved_jobs: {
        Row: {
          applied_at: string | null
          applied_status: boolean
          apply_url: string | null
          company: string
          created_at: string
          description: string
          id: string
          job_title: string
          location: string
          salary: string | null
          saved_at: string
          source: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          applied_at?: string | null
          applied_status?: boolean
          apply_url?: string | null
          company: string
          created_at?: string
          description: string
          id?: string
          job_title: string
          location: string
          salary?: string | null
          saved_at?: string
          source?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          applied_at?: string | null
          applied_status?: boolean
          apply_url?: string | null
          company?: string
          created_at?: string
          description?: string
          id?: string
          job_title?: string
          location?: string
          salary?: string | null
          saved_at?: string
          source?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_search_limits: {
        Row: {
          created_at: string | null
          id: string
          max_searches: number | null
          searches_used: number | null
          subscription_active: boolean | null
          subscription_type: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          max_searches?: number | null
          searches_used?: number | null
          subscription_active?: boolean | null
          subscription_type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          max_searches?: number | null
          searches_used?: number | null
          subscription_active?: boolean | null
          subscription_type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
