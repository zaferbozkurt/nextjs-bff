"use client";

import { useUsers, useCreateUser } from "@/hooks/useUsers";
import { useState } from "react";

export function UsersList() {
  const { data: users, isLoading, error } = useUsers();
  const createUserMutation = useCreateUser();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !username || !email) return;

    createUserMutation.mutate(
      {
        firstName,
        lastName,
        username,
        email,
      },
      {
        onSuccess: () => {
          setFirstName("");
          setLastName("");
          setUsername("");
          setEmail("");
        },
      }
    );
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
          Yeni Kullanıcı Oluştur
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium mb-2 text-black dark:text-zinc-50"
            >
              Ad
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
              required
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium mb-2 text-black dark:text-zinc-50"
            >
              Soyad
            </label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
              required
            />
          </div>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium mb-2 text-black dark:text-zinc-50"
            >
              Kullanıcı Adı
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-2 text-black dark:text-zinc-50"
            >
              E-posta
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
              required
            />
          </div>
          <button
            type="submit"
            disabled={createUserMutation.isPending}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createUserMutation.isPending
              ? "Oluşturuluyor..."
              : "Kullanıcı Oluştur"}
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4 text-black dark:text-zinc-50">
          Kullanıcılar ({users?.length || 0})
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {users?.slice(0, 6).map((user) => (
            <div
              key={user.id}
              className="bg-white dark:bg-zinc-900 p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-lg mb-2 text-black dark:text-zinc-50">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                @{user.username}
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {user.email}
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {user.phone}
              </p>
              {user.domain && (
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {user.domain}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

