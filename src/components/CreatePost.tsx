import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function CreatePost({ setNewPostAdded }: { setNewPostAdded: (n: number) => void }) {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsLoading(true);
    const user = (await supabase.auth.getUser()).data.user;
    console.log(user);

    try {
      await supabase.from('posts').insert({
        content,
        user_id: user?.id
      });
      setContent('');
      setNewPostAdded(Math.random());
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card p-6 mb-8">
      <form onSubmit={handleSubmit}>
        <textarea
          className="input resize-none mb-4"
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || !content.trim()}
            className="btn btn-primary"
          >
            {isLoading ? 'Posting...' : 'Share Post'}
          </button>
        </div>
      </form>
    </div>
  );
}