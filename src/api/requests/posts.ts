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

// GET: Tüm postları getir
export const fetchAllPosts = async (): Promise<Post[]> => {
  const { data } = await api.get("/posts");
  return data.posts || data; // DummyJSON posts array'i içinde döner
};

// GET: Belirli bir postun detaylarını getir
export const fetchPostById = async (postId: number): Promise<Post> => {
  const { data } = await api.get(`/posts/${postId}`);
  return data;
};

// POST: Yeni post oluştur
export const createPost = async (
  postData: CreatePostData
): Promise<Post> => {
  const { data } = await api.post("/posts/add", postData);
  return data;
};

