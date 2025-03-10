export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
}

export interface Post {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  user: User;
}

export interface Comment {
  id: string;
  content: string;
  created_at: string;
  post_id: string;
  user_id: string;
  user: User;
}