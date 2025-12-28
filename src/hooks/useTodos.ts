import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllTodos,
  fetchTodoById,
  createTodo,
  deleteTodo,
  type Todo,
  type CreateTodoData,
} from "@/api/requests/todos";

// GET: Tüm todo'ları getir
export const useTodos = () => {
  return useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: fetchAllTodos,
  });
};

// GET: Belirli bir todo'yu getir
export const useTodo = (todoId: number) => {
  return useQuery<Todo>({
    queryKey: ["todo", todoId],
    queryFn: () => fetchTodoById(todoId),
    enabled: Boolean(todoId),
  });
};

// POST: Yeni todo oluştur
export const useCreateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation<Todo, Error, CreateTodoData>({
    mutationFn: createTodo,
    onSuccess: () => {
      // Todo listesini yenile
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
};

// DELETE: Todo sil
export const useDeleteTodo = () => {
  const queryClient = useQueryClient();

  return useMutation<Todo, Error, number>({
    mutationFn: deleteTodo,
    onSuccess: () => {
      // Todo listesini yenile
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
};

