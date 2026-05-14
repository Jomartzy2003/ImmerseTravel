export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      destinations: {
        Row: {
          id: string
          title: string
          bg_layer_url: string
          fg_layer_url: string
          description: string
          location: string | null
          country: string | null
          category: string | null
          featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          bg_layer_url: string
          fg_layer_url: string
          description: string
          location?: string | null
          country?: string | null
          category?: string | null
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          bg_layer_url?: string
          fg_layer_url?: string
          description?: string
          location?: string | null
          country?: string | null
          category?: string | null
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_saves: {
        Row: {
          id: string
          user_id: string
          destination_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          destination_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          destination_id?: string
          created_at?: string
        }
      }
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Destination = Database['public']['Tables']['destinations']['Row']
export type UserSave = Database['public']['Tables']['user_saves']['Row']
