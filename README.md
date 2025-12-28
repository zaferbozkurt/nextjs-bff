# Next.js BFF Pattern Example

This project demonstrates how to implement the BFF (Backend-for-Frontend) pattern using Next.js API Routes.

## Features

- ✅ BFF pattern implementation with Next.js API Routes
- ✅ DummyJSON API integration
- ✅ Data fetching with React Query
- ✅ Type-safe API clients with TypeScript
- ✅ Domain-specific code organization (Posts)
- ✅ Modern UI with Tailwind CSS

## Installation

1. Clone or download the project
2. Install dependencies:

```bash
npm install
```

3. Create environment variables file:

Create a `.env.local` file and add the following content:

```env
API_URL=https://dummyjson.com
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
nextjs-bff/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── server/
│   │   │       └── [...endpoint]/
│   │   │           └── route.ts          # BFF API Handler
│   │   ├── layout.tsx                    # Root Layout
│   │   └── page.tsx                      # Home Page
│   ├── api/
│   │   ├── client/
│   │   │   └── api.ts                    # Axios Instance
│   │   └── requests/
│   │       └── posts.ts                  # Posts API Functions
│   ├── hooks/
│   │   └── usePosts.ts                   # Posts React Query Hooks
│   ├── components/
│   │   └── PostsList.tsx                 # Posts Component
│   └── providers/
│       └── QueryProvider.tsx             # React Query Provider
└── .env.local                            # Environment Variables
```

## Technologies Used

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Axios** - HTTP client
- **React Query** - Data fetching and caching
- **Tailwind CSS** - Styling

## API Endpoints

This project uses the [DummyJSON](https://dummyjson.com/) Posts API:

- `GET /posts` - Fetch all posts (returns 30 posts)
- `GET /posts/:id` - Fetch a specific post
- `POST /posts/add` - Create a new post

**Note:** DummyJSON is free to use without rate limits. For more information, visit [dummyjson.com/docs/posts](https://dummyjson.com/docs/posts).

## How Does the BFF Pattern Work?

1. **Frontend Component** → Calls React Query hook
2. **React Query Hook** → Calls API request function
3. **API Request Function** → Sends request to `/api/server` endpoint using Axios instance
4. **Next.js API Route** → Acts as a proxy to the backend API
5. **Backend API** → Processes the request and returns response

This architecture provides:
- API URLs are not exposed on the client-side
- CORS issues are eliminated
- Centralized error handling
- Frontend is isolated from backend changes

## Learn More

For detailed explanation, check the `BFF_PATTERN_MEDIUM_ARTICLE.md` file.

## License

MIT
