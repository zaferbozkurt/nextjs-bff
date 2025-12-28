import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllUsers,
  fetchUserById,
  createUser,
  type User,
  type CreateUserData,
} from "@/api/requests/users";

// GET: Tüm kullanıcıları getir
export const useUsers = () => {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: fetchAllUsers,
  });
};

// GET: Belirli bir kullanıcıyı getir
export const useUser = (userId: number) => {
  return useQuery<User>({
    queryKey: ["user", userId],
    queryFn: () => fetchUserById(userId),
    enabled: Boolean(userId),
  });
};

// POST: Yeni kullanıcı oluştur
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, CreateUserData>({
    mutationFn: createUser,
    onSuccess: () => {
      // Kullanıcı listesini yenile
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

