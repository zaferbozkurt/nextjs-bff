import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllPosts,
  fetchPostById,
  createPost,
  type Post,
  type CreatePostData,
} from "@/api/requests/posts";

// GET: Tüm postları getir
export const usePosts = () => {
  return useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: fetchAllPosts,
  });
};

// GET: Belirli bir postu getir
export const usePost = (postId: number) => {
  return useQuery<Post>({
    queryKey: ["post", postId],
    queryFn: () => fetchPostById(postId),
    enabled: Boolean(postId),
  });
};

// POST: Yeni post oluştur
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation<Post, Error, CreatePostData>({
    mutationFn: createPost,
    onSuccess: () => {
      // Post listesini yenile
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

