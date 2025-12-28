import { api } from "../serverConnections/api";

export interface Todo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

export interface CreateTodoData {
  todo: string;
  completed: boolean;
  userId: number;
}

// GET: Tüm todo'ları getir
export const fetchAllTodos = async (): Promise<Todo[]> => {
  const { data } = await api.get("/todos");
  return data.todos || data; // DummyJSON todos array'i içinde döner
};

// GET: Belirli bir todo'nun detaylarını getir
export const fetchTodoById = async (todoId: number): Promise<Todo> => {
  const { data } = await api.get(`/todos/${todoId}`);
  return data;
};

// POST: Yeni todo oluştur
export const createTodo = async (
  todoData: CreateTodoData
): Promise<Todo> => {
  const { data } = await api.post("/todos/add", todoData);
  return data;
};

// DELETE: Todo sil
export const deleteTodo = async (todoId: number): Promise<Todo> => {
  const { data } = await api.delete(`/todos/${todoId}`);
  return data;
};

