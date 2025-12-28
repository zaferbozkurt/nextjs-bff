import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllPosts,
  fetchPostById,
  createPost,
  type Post,
  type CreatePostData,
} from "@/api/requests/posts";

// GET: Fetch all posts
export const usePosts = () => {
  return useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: fetchAllPosts,
  });
};

// GET: Fetch a specific post
export const usePost = (postId: number) => {
  return useQuery<Post>({
    queryKey: ["post", postId],
    queryFn: () => fetchPostById(postId),
    enabled: Boolean(postId),
  });
};

// POST: Create a new post
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation<Post, Error, CreatePostData>({
    mutationFn: createPost,
    onSuccess: () => {
      // Refresh post list
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

