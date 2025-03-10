/*
  # Initial Schema Setup

  1. New Tables
    - `users` (extends auth.users)
      - `id` (uuid, primary key)
      - `email` (text)
      - `full_name` (text)
      - `avatar_url` (text, optional)
      - `created_at` (timestamp)

    - `posts`
      - `id` (uuid, primary key)
      - `content` (text)
      - `user_id` (uuid, foreign key to users.id)
      - `created_at` (timestamp)

    - `comments`
      - `id` (uuid, primary key)
      - `content` (text)
      - `post_id` (uuid, foreign key to posts.id)
      - `user_id` (uuid, foreign key to users.id)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create users table that extends the auth.users
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text NOT NULL,
  full_name text NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can read all users" 
  ON users
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Users can update their own data" 
  ON users
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = id);

-- Create policies for posts table
CREATE POLICY "Anyone can read posts" 
  ON posts
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Users can create posts" 
  ON posts
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts" 
  ON posts
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts" 
  ON posts
  FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Create policies for comments table
CREATE POLICY "Anyone can read comments" 
  ON comments
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Users can create comments" 
  ON comments
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
  ON comments
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
  ON comments
  FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);