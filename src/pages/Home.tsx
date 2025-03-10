import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Post } from '../types';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostAdded, setNewPostAdded] = useState<number>(0);

  useEffect(() => {
    loadPosts();
  }, [newPostAdded]);

  const loadPosts = async () => {
    const { data } = await supabase
      .from('posts')
      .select('*, user:users(*)')
      .order('created_at', { ascending: false });
    
    if (data) setPosts(data as Post[]);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Home Feed</h1>
      <CreatePost setNewPostAdded={setNewPostAdded}/>
      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}