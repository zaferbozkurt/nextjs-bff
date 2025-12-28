import { api } from "../serverConnections/api";

export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

export interface CreatePostData {
  title: string;
  body: string;
  userId: number;
}

// GET: Fetch all posts
export const fetchAllPosts = async (): Promise<Post[]> => {
  const { data } = await api.get("/posts");
  return data.posts || data; // DummyJSON returns posts in an array
};

// GET: Fetch a specific post
export const fetchPostById = async (postId: number): Promise<Post> => {
  const { data } = await api.get(`/posts/${postId}`);
  return data;
};

// POST: Create a new post
export const createPost = async (
  postData: CreatePostData
): Promise<Post> => {
  const { data } = await api.post("/posts/add", postData);
  return data;
};

