"use client";

import { useTodos, useCreateTodo, useDeleteTodo } from "@/hooks/useTodos";
import { useState } from "react";

export function TodosList() {
  const { data: todos, isLoading, error } = useTodos();
  const createTodoMutation = useCreateTodo();
  const deleteTodoMutation = useDeleteTodo();
  const [todo, setTodo] = useState("");
  const [completed, setCompleted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!todo.trim()) return;

    createTodoMutation.mutate(
      {
        todo: todo.trim(),
        completed,
        userId: 1,
      },
      {
        onSuccess: () => {
          setTodo("");
          setCompleted(false);
        },
      }
    );
  };

  const handleDelete = async (todoId: number) => {
    if (confirm("Bu todo'yu silmek istediğinize emin misiniz?")) {
      deleteTodoMutation.mutate(todoId);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Yükleniyor...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Hata: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4 text-black dark:text-zinc-50">
          Yeni Todo Ekle
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="todo"
              className="block text-sm font-medium mb-2 text-black dark:text-zinc-50"
            >
              Todo
            </label>
            <input
              id="todo"
              type="text"
              value={todo}
              onChange={(e) => setTodo(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
              placeholder="Yapılacak bir şey yazın..."
              required
            />
          </div>
          <div className="flex items-center">
            <input
              id="completed"
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-zinc-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="completed"
              className="ml-2 text-sm font-medium text-black dark:text-zinc-50"
            >
              Tamamlandı olarak işaretle
            </label>
          </div>
          <button
            type="submit"
            disabled={createTodoMutation.isPending}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createTodoMutation.isPending ? "Ekleniyor..." : "Todo Ekle"}
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4 text-black dark:text-zinc-50">
          Todo'lar ({todos?.length || 0})
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {todos?.slice(0, 9).map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-zinc-900 p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      readOnly
                      className="w-4 h-4 text-blue-600 border-zinc-300 rounded"
                    />
                    <span
                      className={`font-medium text-black dark:text-zinc-50 ${
                        item.completed
                          ? "line-through text-zinc-500"
                          : ""
                      }`}
                    >
                      {item.todo}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-500">
                    User ID: {item.userId}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={deleteTodoMutation.isPending}
                  className="ml-2 px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

