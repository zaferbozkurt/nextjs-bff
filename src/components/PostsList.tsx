"use client";

import { usePosts, useCreatePost } from "@/hooks/usePosts";
import { useState } from "react";

export function PostsList() {
  const { data: posts, isLoading, error } = usePosts();
  const createPostMutation = useCreatePost();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [showAll, setShowAll] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !body) return;

    createPostMutation.mutate(
      {
        title,
        body,
        userId: 1,
      },
      {
        onSuccess: () => {
          setTitle("");
          setBody("");
        },
      }
    );
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4 text-black dark:text-zinc-50">
          Create New Post
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium mb-2 text-black dark:text-zinc-50"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
              required
            />
          </div>
          <div>
            <label
              htmlFor="body"
              className="block text-sm font-medium mb-2 text-black dark:text-zinc-50"
            >
              Content
            </label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
              required
            />
          </div>
          <button
            type="submit"
            disabled={createPostMutation.isPending}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createPostMutation.isPending ? "Creating..." : "Create Post"}
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4 text-black dark:text-zinc-50">
          Posts ({posts?.length || 0})
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts
            ?.slice(0, showAll ? posts.length : 6)
            .map((post) => (
              <div
                key={post.id}
                className="bg-white dark:bg-zinc-900 p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
              >
                <h3 className="font-semibold text-lg mb-2 text-black dark:text-zinc-50">
                  {post.title}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3">
                  {post.body}
                </p>
                <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">
                  User ID: {post.userId}
                </div>
              </div>
            ))}
        </div>
        {posts && posts.length > 6 && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              {showAll ? "Show Less" : "Show All"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

