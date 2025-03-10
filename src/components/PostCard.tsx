import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Post, Comment } from '../types';
import { supabase } from '../lib/supabase';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);

  const loadComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('*, user:users(*)')
      .eq('post_id', post.id)
      .order('created_at', { ascending: true });
    
    if (data) setComments(data as Comment[]);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const user = (await supabase.auth.getUser()).data.user;
    
    try {
      await supabase.from('comments').insert({
        content: newComment,
        post_id: post.id,
        user_id: user?.id
      });
      setNewComment('');
      loadComments();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="card p-6 mb-6">
      <div className="flex items-center mb-4">
        <Link 
          to={`/profile/${post.user_id}`}
          className="shrink-0"
        >
          <img
            src={"/avatar.png"}
            alt={post.user.full_name}
            className="w-12 h-12 rounded-full ring-2 ring-gray-200"
          />
        </Link>
        <div className="ml-4">
          <Link 
            to={`/profile/${post.user_id}`}
            className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
          >
            {post.user.full_name}
          </Link>
          <p className="text-sm text-gray-500">
            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
          </p>
        </div>
      </div>

      <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.content}</p>

      <div className="border-t pt-4">
        <button
          onClick={() => {
            setShowComments(!showComments);
            if (!showComments) loadComments();
          }}
          className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
        >
          {showComments ? 'Hide Comments' : 'Show Comments'}
        </button>

        {showComments && (
          <div className="mt-4 space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-3">
                <Link to={`/profile/${comment.user_id}`} className="shrink-0">
                  <img
                    src={"/avatar.png"}
                    alt={comment.user.full_name}
                    className="w-8 h-8 rounded-full ring-2 ring-gray-200"
                  />
                </Link>
                <div className="flex-1 bg-gray-50 rounded-2xl p-3">
                  <Link 
                    to={`/profile/${comment.user_id}`}
                    className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
                  >
                    {comment.user.full_name}
                  </Link>
                  <p className="text-gray-800 mt-1">{comment.content}</p>
                </div>
              </div>
            ))}

            <form onSubmit={handleAddComment} className="mt-4 flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="input flex-1"
              />
              <button type="submit" className="btn btn-primary">
                Post
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}