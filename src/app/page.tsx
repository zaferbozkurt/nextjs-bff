import { TodosList } from "@/components/TodosList";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans">
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-black dark:text-zinc-50">
            Next.js BFF Pattern Örneği
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Backend-for-Frontend pattern'i ile DummyJSON Todos API kullanımı
          </p>
        </div>

        <div className="space-y-12">
          <section>
            <TodosList />
          </section>
        </div>
      </main>
    </div>
  );
}

