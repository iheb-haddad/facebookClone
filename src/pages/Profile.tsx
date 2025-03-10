import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Post, User } from '../types';
import PostCard from '../components/PostCard';

export default function Profile() {
  const { userId } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (userId) {
      loadUserData();
      loadUserPosts();
    }
  }, [userId]);

  const loadUserData = async () => {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (data) setUser(data as User);
  };

  const loadUserPosts = async () => {
    const { data } = await supabase
      .from('posts')
      .select('*, user:users(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (data) setPosts(data as Post[]);
  };

  if (!user) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6">
      <div className="card p-8 mb-8">
        <div className="flex items-center gap-6">
          <img
            src={user.avatar_url || "/avatar.png"}
            alt={user.full_name}
            className="w-32 h-32 rounded-full ring-4 ring-gray-200"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{user.full_name}</h1>
            <p className="text-lg text-gray-600 mt-1">{user.email}</p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-6">Posts</h2>
      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
        {posts.length === 0 && (
          <p className="text-center text-gray-500 py-8">No posts yet</p>
        )}
      </div>
    </div>
  );
}