# BFF (Backend-for-Frontend) Pattern with Next.js API Routes: Secure and Scalable Dashboard Architecture

Managing communication between frontend and backend securely and efficiently is crucial in modern web applications. For dashboard applications dealing with sensitive data and user authentication, using an intermediary layer instead of direct client-side access to backend APIs provides a more robust solution from both security and architectural perspectives.

In this article, we'll explore how to implement the BFF (Backend-for-Frontend) pattern using Next.js API Routes through a real-world project example.

## What is the BFF Pattern?

The BFF (Backend-for-Frontend) pattern is an architectural approach that suggests creating a customized backend layer for each frontend application. Key advantages of this pattern include:

- **Security**: API keys and sensitive information are not exposed on the client-side
- **Flexibility**: Data transformation can be performed according to frontend requirements
- **Centralized Error Handling**: All API errors can be managed from a single point
- **Rate Limiting and Caching**: Can be implemented at a central location
- **Isolation from Backend Changes**: Backend API changes don't directly affect the frontend

## Project Architecture

In our example project, the BFF pattern is implemented as follows:

```
Frontend (React Components)
    ↓
API Helper (Client-side)
    ↓
Next.js API Routes "/api/server/[...endpoint]" - (Server-side)
    ↓
Backend API (External Service)
```

### 1. Next.js API Route Handler

The core of the project is an API handler created using Next.js's catch-all route feature:

```typescript
// app/api/server/[...endpoint]/route.ts
import axios, { AxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";

async function handler(request: NextRequest): Promise<NextResponse> {
  const { pathname, search } = request.nextUrl;
  const endpoint = `${pathname.replace("/api/server", "")}${search}`;

  if (endpoint) {
    const headers: any = {
      "Content-Type": "application/json",
    };

    // Parse request body
    let body = {};
    try {
      body = await request.json();
    } catch (error) {
      // Use empty object if body is missing or cannot be parsed
    }

    try {
      // Send request to backend API
      const response = await axios.request({
        url: endpoint,
        method: request.method,
        data: body,
        baseURL: process.env.API_URL,
        headers: headers,
      });

      return NextResponse.json(response.data, { status: 200 });
    } catch (e) {
      const axiosError = e as AxiosError;

      // Return appropriate status code on error
      return NextResponse.json(
        axiosError.response?.data || { error: "Internal Server Error" },
        {
          status: axiosError.response?.status || 500,
        }
      );
    }
  } else {
    return NextResponse.json({ data: "Api Not Found" }, { status: 404 });
  }
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };
```

**Key Points:**

1. **Catch-all Route**: All API endpoints are captured in a single handler using the `[...endpoint]` syntax
2. **Environment Variables**: Backend API URL is securely retrieved using `process.env.API_URL` (not exposed to client-side)
3. **Error Handling**: Errors from the backend are forwarded to the frontend with appropriate HTTP status codes
4. **Flexibility**: All HTTP methods (GET, POST, PUT, DELETE) are managed by a single handler

### 2. Client-side API Instance

On the frontend, a simple Axios instance is used to route requests to the BFF endpoint:

```typescript
// src/api/serverConnections/api.ts
import axios from "axios";

export const api = axios.create({
  baseURL: "/api/server",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});
```

This simple structure routes all API calls to the BFF layer through the `/api/server` endpoint.

### 3. Request Functions

API calls are organized as domain-specific functions. These functions send requests to BFF endpoints using the Axios instance. In our example project, we've created a file for Todos using the DummyJSON API:

**Todos API:**

```typescript
// src/api/requests/todos.ts
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

// GET: Fetch all todos
export const fetchAllTodos = async (): Promise<Todo[]> => {
  const { data } = await api.get("/todos");
  return data.todos || data; // DummyJSON returns todos in an array
};

// GET: Fetch a specific todo
export const fetchTodoById = async (todoId: number): Promise<Todo> => {
  const { data } = await api.get(`/todos/${todoId}`);
  return data;
};

// POST: Create a new todo
export const createTodo = async (
  todoData: CreateTodoData
): Promise<Todo> => {
  const { data } = await api.post("/todos/add", todoData);
  return data;
};

// DELETE: Delete a todo
export const deleteTodo = async (todoId: number): Promise<Todo> => {
  const { data } = await api.delete(`/todos/${todoId}`);
  return data;
};
```

This structure allows API calls to be managed centrally, separated by domain, and reused across components.

### 4. React Query Integration

API calls are managed with React Query. Separate hook files are created for each domain:

**Todos Hooks:**

```typescript
// src/hooks/useTodos.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllTodos,
  fetchTodoById,
  createTodo,
  deleteTodo,
  type Todo,
  type CreateTodoData,
} from "@/api/requests/todos";

// GET: Fetch all todos
export const useTodos = () => {
  return useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: fetchAllTodos,
  });
};

// GET: Fetch a specific todo
export const useTodo = (todoId: number) => {
  return useQuery<Todo>({
    queryKey: ["todo", todoId],
    queryFn: () => fetchTodoById(todoId),
    enabled: Boolean(todoId),
  });
};

// POST: Create a new todo
export const useCreateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation<Todo, Error, CreateTodoData>({
    mutationFn: createTodo,
    onSuccess: () => {
      // Refresh todo list
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
};

// DELETE: Delete a todo
export const useDeleteTodo = () => {
  const queryClient = useQueryClient();

  return useMutation<Todo, Error, number>({
    mutationFn: deleteTodo,
    onSuccess: () => {
      // Refresh todo list
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
};
```

React Query Provider'ı root layout'a eklenmelidir:

```typescript
// src/providers/QueryProvider.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
```

## Security Advantages

### 1. API URL Protection

The backend API URL is stored in environment variables (without the `NEXT_PUBLIC_` prefix) and is not exposed to the client-side. This ensures API endpoints remain invisible to the client:

```typescript
// .env.local
API_URL=https://dummyjson.com

// In API route handler
baseURL: process.env.API_URL, // Not accessible on client-side
```

### 2. CORS Issue Resolution

Since all requests pass through the Next.js server, CORS issues are eliminated. Browser CORS policies don't come into play because requests aren't sent directly from the client-side to external APIs.

### 3. Error Handling

Sensitive error messages can be filtered or transformed before being sent to the client. Errors from the backend are managed from a central point:

```typescript
catch (e) {
  const axiosError = e as AxiosError;
  return NextResponse.json(
    axiosError.response?.data || { error: "Internal Server Error" },
    {
      status: axiosError.response?.status || 500,
    }
  );
}
```

### 4. Token Management (with Authentication)

If you're using authentication, tokens should not be stored on the client-side. You can manage tokens server-side using NextAuth or similar solutions:

```typescript
// Example: Token management with NextAuth
const session = await getServerSession(authOptions);
if (session?.accessToken) {
  headers.Authorization = `Bearer ${session?.accessToken}`;
}
```

## Scalability

### 1. Caching Strategy

Caching can be added to Next.js API Routes:

```typescript
async function handler(request: NextRequest): Promise<NextResponse> {
  // ... handler logic ...
  
  return NextResponse.json(response.data, {
    status: 200,
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
    },
  });
}
```

### 2. Rate Limiting

Rate limiting middleware can be added to the API route handler:

```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
});

async function handler(request: NextRequest): Promise<NextResponse> {
  const ip = request.ip ?? "127.0.0.1";
  const { success } = await ratelimit.limit(ip);
  
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }
  
  // ... handler logic
}
```

### 3. Request Batching

Multiple API calls can be combined into a single request:

```typescript
// src/app/api/server/batch/route.ts
import axios from "axios";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib-configs/auth";

async function handler(request: NextRequest): Promise<NextResponse> {
  const { requests } = await request.json();
  const session = await getServerSession(authOptions);
  
  const headers: any = {
    "Content-Type": "application/json",
  };
  if (session?.accessToken) {
    headers.Authorization = `Bearer ${session?.accessToken}`;
  }
  
  const results = await Promise.all(
    requests.map((req: { url: string; method: string; data?: any }) =>
      axios.request({
        url: req.url,
        method: req.method,
        data: req.data,
        baseURL: process.env.API_URL,
        headers: headers,
      })
    )
  );
  
  return NextResponse.json({ 
    results: results.map(r => r.data) 
  });
}
```

## Best Practices

### 1. Environment Variables

Sensitive information should be stored in environment variables. Variables defined without the `NEXT_PUBLIC_` prefix are only accessible server-side:

```env
# .env.local
API_URL=https://dummyjson.com
```

### 2. Type Safety

Create type-safe API functions using TypeScript. Define interfaces for each domain:

```typescript
// src/api/requests/todos.ts
export interface Todo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

export const fetchTodoById = async (todoId: number): Promise<Todo> => {
  const { data } = await api.get(`/todos/${todoId}`);
  return data;
};
```

### 3. Domain Separation

Create separate files for different domains. This approach simplifies code organization and maintenance:

```
src/api/requests/
  ├── todos.ts      # API calls related to Todos
  └── ...           # Separate files for other domains
```

### 4. Error Boundaries

Catch API errors with React Error Boundaries:

```typescript
<ErrorBoundary fallback={<ErrorFallback />}>
  <YourComponent />
</ErrorBoundary>
```

### 5. Logging

Add logging to API routes:

```typescript
async function handler(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();
  const { pathname } = request.nextUrl;
  const endpoint = pathname.replace("/api/server", "");
  
  // ... handler logic ...
  
  const responseTime = Date.now() - startTime;
  console.log(`[API] ${request.method} ${endpoint} - ${responseTime}ms`);
  
  return NextResponse.json(response.data);
}
```

## Example Project Structure

The project structure is organized as follows:

```
nextjs-bff/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── server/
│   │   │       └── [...endpoint]/
│   │   │           └── route.ts          # BFF API Handler
│   │   ├── layout.tsx                    # Root Layout (with QueryProvider)
│   │   └── page.tsx                      # Home Page
│   ├── api/
│   │   ├── serverConnections/
│   │   │   └── api.ts                    # Axios Instance
│   │   └── requests/
│   │       └── todos.ts                  # Todos API Functions
│   ├── hooks/
│   │   └── useTodos.ts                   # Todos React Query Hooks
│   ├── components/
│   │   └── TodosList.tsx                 # Todos Component
│   └── providers/
│       └── QueryProvider.tsx             # React Query Provider
└── .env.local                            # Environment Variables
```

## API Used

This example project uses the [DummyJSON](https://dummyjson.com/) Todos API. This API provides a free REST API for testing and prototyping:

- **GET** `/todos` - Fetch all todos (returns 30 todos)
- **GET** `/todos/:id` - Fetch a specific todo
- **POST** `/todos/add` - Create a new todo
- **DELETE** `/todos/:id` - Delete a todo

For more information, visit the [DummyJSON Todos Documentation](https://dummyjson.com/docs/todos).

## Conclusion

The BFF pattern plays a critical role in security and scalability, especially for dashboard and enterprise applications. Implementing this pattern using Next.js API Routes simplifies the development process and provides a production-ready architecture.

**Key Advantages:**

✅ API URLs are not exposed on the client-side  
✅ Centralized error handling  
✅ Isolation from backend changes  
✅ Type-safe API clients  
✅ Scalable architecture  
✅ CORS issues eliminated  
✅ Domain-specific code organization  
✅ Optimized data fetching with React Query  

When implementing this architecture in your own projects, you can add additional features such as caching, rate limiting, authentication, and monitoring based on your needs.

---

**Source Code:** [GitHub Repository](https://github.com/your-repo)

**Contact:** Feel free to leave comments or reach out with questions.

