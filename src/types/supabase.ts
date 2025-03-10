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
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string | null
          created_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          content: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          content: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          content?: string
          user_id?: string
          created_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          content: string
          post_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          content: string
          post_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          content?: string
          post_id?: string
          user_id?: string
          created_at?: string
        }
      }
    }
  }
}