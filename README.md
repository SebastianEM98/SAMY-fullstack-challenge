# 🗂️ User & Posts Management Portal

![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=flat-square&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-15.x-000000?style=flat-square&logo=next.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma&logoColor=white)
![AWS Lambda](https://img.shields.io/badge/AWS-Lambda-FF9900?style=flat-square&logo=amazon-aws&logoColor=white)
![Deployed on Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)
![Backend Coverage](https://img.shields.io/badge/Backend%20Coverage-89%25-brightgreen?style=flat-square)
![Frontend Coverage](https://img.shields.io/badge/Frontend%20Coverage-85%25-brightgreen?style=flat-square)

A full-stack User & Posts Management Portal built with Next.js, Node.js/Express, PostgreSQL on Neon, and deployed on AWS Lambda + Vercel.

---

## 🔗 Live URLs

| Service | URL |
|---------|-----|
| Frontend | `https://your-app.vercel.app` |
| Backend (AWS Lambda) | `https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod` |

---

## ✨ Features

- 🔐 **Authentication** via ReqRes API — token stored in `httpOnly` cookie
- 👥 **Users Module** — paginated list, search across all pages, user detail, import to local DB
- 📝 **Posts Module** — full CRUD with pagination, form validation, author linking
- 🛡️ **Protected routes** — middleware guards all dashboard pages
- 🧪 **Tests** — backend (Jest + Supertest) and frontend (Vitest + React Testing Library)

---

## 🏗️ Architecture

![Architecture](./docs/architecture.svg)

---

## 📁 Project Structure

```
.
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # DB schema (User + Post models)
│   │   └── migrations/            # SQL migration history
│   ├── src/
│   │   ├── __tests__/             # Jest tests
│   │   │   ├── auth.test.ts
│   │   │   ├── users.test.ts
│   │   │   └── posts.test.ts
│   │   ├── config/
│   │   │   ├── cors.ts            # CORS whitelist config
│   │   │   ├── env.ts             # Typed environment variables
│   │   │   ├── prisma.ts          # Prisma singleton client
│   │   │   └── reqresClient.ts    # Axios instance with x-api-key
│   │   ├── generated/prisma/      # Prisma generated client
│   │   ├── middleware/
│   │   │   ├── authenticate.ts    # Token validation from cookie/header
│   │   │   ├── errorHandler.ts    # Centralized error handler
│   │   │   └── notFound.ts        # 404 handler
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.routes.ts
│   │   │   │   └── auth.service.ts
│   │   │   ├── users/
│   │   │   │   ├── users.controller.ts
│   │   │   │   ├── users.repository.ts
│   │   │   │   ├── users.routes.ts
│   │   │   │   ├── users.service.ts
│   │   │   │   └── users.types.ts
│   │   │   └── posts/
│   │   │       ├── posts.controller.ts
│   │   │       ├── posts.repository.ts
│   │   │       ├── posts.routes.ts
│   │   │       ├── posts.service.ts
│   │   │       └── posts.types.ts
│   │   ├── types/
│   │   │   └── express.d.ts       # Express Request type extension
│   │   ├── app.ts                 # Express app factory
│   │   └── server.ts              # Entry point
│   ├── .env.example
│   ├── jest.config.ts
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── (auth)/
    │   │   │   └── login/page.tsx
    │   │   ├── (dashboard)/
    │   │   │   ├── layout.tsx     # Sidebar + topbar
    │   │   │   ├── users/
    │   │   │   │   ├── page.tsx          # Users list (ReqRes)
    │   │   │   │   ├── saved/page.tsx    # Locally saved users
    │   │   │   │   └── [id]/page.tsx     # User detail
    │   │   │   └── posts/
    │   │   │       ├── page.tsx          # Posts list + CRUD
    │   │   │       └── [id]/page.tsx     # Post detail
    │   │   ├── layout.tsx         # Root layout (Sonner toaster)
    │   │   └── page.tsx           # Redirects to /login
    │   ├── components/
    │   │   ├── ui/                # Button, Input, Card, Badge, Spinner, EmptyState
    │   │   ├── users/             # UserCard
    │   │   └── posts/             # PostCard, PostForm
    │   ├── hooks/
    │   ├── lib/
    │   │   ├── api/
    │   │   │   ├── auth.ts        # Auth API calls
    │   │   │   ├── users.ts       # Users API calls
    │   │   │   └── posts.ts       # Posts API calls
    │   │   └── apiClient.ts       # Fetch wrapper with error handling
    │   ├── proxy.ts               # Next.js route protection middleware
    │   ├── test/
    │   │   ├── setup.ts
    │   │   ├── smoke.test.tsx
    │   │   └── components/
    │   │       ├── Button.test.tsx
    │   │       ├── UserCard.test.tsx
    │   │       └── PostForm.test.tsx
    │   └── types/
    │       ├── user.ts
    │       └── post.ts
    ├── .env.local.example
    ├── next.config.ts
    ├── vitest.config.ts
    └── package.json
```

---

## 🛠️ Tech Stack

### Backend
| Tool | Purpose |
|------|---------|
| Node.js + Express | HTTP server |
| TypeScript | Type safety |
| Prisma ORM | Database access layer |
| PostgreSQL (Neon) | Serverless database |
| Zod | Input validation |
| Jest + Supertest | Testing |
| Serverless Framework | AWS Lambda deployment |

### Frontend
| Tool | Purpose |
|------|---------|
| Next.js 15 (App Router) | React framework |
| TypeScript | Type safety |
| Tailwind CSS v4 | Styling |
| React Hook Form + Zod | Form validation |
| Sonner | Toast notifications |
| Lucide React | Icons |
| Motion | Sidebar animations |
| Vitest + RTL | Testing |

---

## ⚙️ Environment Variables

### Backend — `backend/.env`

```env
PORT=4000
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
FRONTEND_URL="http://localhost:3000"
REQRES_API_KEY="your_reqres_api_key"
```

### Frontend — `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

> Get your ReqRes API key at [app.reqres.in/api-keys](https://app.reqres.in/api-keys)

---

## 🚀 Running Locally

### Prerequisites

- Node.js 20+
- npm 9+
- A [Neon](https://neon.tech) PostgreSQL database
- A ReqRes API key

### 1. Clone the repository

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

### 2. Setup the Backend

```bash
cd backend
npm install
```

Create the `.env` file from the example:

```bash
# Linux/Mac
cp .env.example .env

# Windows
copy .env.example .env
```

Then fill in your values in `.env`.


Run database migrations:

```bash
npx prisma migrate dev
```

Start the development server:

```bash
npm run dev
# Server running at http://localhost:4000
```

Verify it works:

```bash
curl http://localhost:4000/health
# { "status": "ok", "timestamp": "..." }
```

### 3. Setup the Frontend

```bash
cd ../frontend
npm install
```

Create the `.env.local` file from the example:

```bash
# Linux/Mac
cp .env.local.example .env.local

# Windows
copy .env.local.example .env.local
```

Then fill in your values in `.env.local`.


Start the development server:

```bash
npm run dev
# App running at http://localhost:3000
```

### 4. Login credentials (ReqRes demo)

```
Email:    eve.holt@reqres.in
Password: cityslicka
```

---

## 🧪 Running Tests

### Backend tests (Jest)

```bash
cd backend
npm test                  # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # With coverage report
```

### Frontend tests (Vitest)

```bash
cd frontend
npm test                  # Run all tests (watch mode)
npm run test:ui           # Visual test UI in browser
npm run test:coverage     # With coverage report
```

---

## 🌐 API Endpoints

All endpoints except `POST /auth/login` require authentication via `httpOnly` cookie.

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Login via ReqRes, sets cookie |
| POST | `/auth/logout` | Clears session cookie |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/reqres?page=1` | Paginated list from ReqRes |
| GET | `/users/reqres/:id` | Single user from ReqRes |
| POST | `/users/import/:id` | Import user from ReqRes to local DB |
| GET | `/users/saved` | List locally saved users |
| GET | `/users/saved/:id` | Get locally saved user |
| DELETE | `/users/saved/:id` | Delete locally saved user |

### Posts
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/posts` | Create post |
| GET | `/posts?page=1&limit=10` | Paginated posts list |
| GET | `/posts/:id` | Get post by ID |
| PUT | `/posts/:id` | Update post |
| DELETE | `/posts/:id` | Delete post |

---

## ☁️ Deployment

### Backend — AWS Lambda (Serverless Framework)

#### Prerequisites

```bash
npm install -g serverless
aws configure   # Set up AWS credentials
```

#### Setup

```bash
cd backend
npm install
```

Create `serverless.yml` in the backend root:

```yaml
service: user-posts-portal-api

provider:
  name: aws
  runtime: nodejs20.x
  region: us-east-1
  environment:
    NODE_ENV: production
    DATABASE_URL: ${env:DATABASE_URL}
    FRONTEND_URL: ${env:FRONTEND_URL}
    REQRES_API_KEY: ${env:REQRES_API_KEY}

functions:
  api:
    handler: dist/lambda.handler
    events:
      - httpApi:
          path: /{proxy+}
          method: ANY
      - httpApi:
          path: /
          method: ANY

plugins:
  - serverless-offline
```

Create `src/lambda.ts`:

```typescript
import serverless from 'serverless-http';
import { createApp } from './app';

const app = createApp();
export const handler = serverless(app);
```

Install Lambda dependencies:

```bash
npm install serverless-http
npm install -D serverless-offline @types/serverless
```

#### Deploy

```bash
npm run build
serverless deploy
```

After deploy, the CLI outputs the API Gateway URL:

```
endpoint: https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod
```

### Frontend — Vercel

```bash
cd frontend
npx vercel
```

Set environment variable in Vercel dashboard:

```
NEXT_PUBLIC_API_URL = https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod
```

---

## 🗄️ Database Schema

```prisma
model User {
  id        Int      @id          # ReqRes user ID (no auto-increment)
  email     String   @unique
  firstName String
  lastName  String
  avatar    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  posts     Post[]

  @@map("users")
}

model Post {
  id           String   @id @default(cuid())
  title        String
  content      String
  authorUserId Int
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  author       User     @relation(fields: [authorUserId], references: [id])

  @@map("posts")
}
```

---

## 🔒 Security

- Tokens stored in `httpOnly` cookies (not accessible via JavaScript)
- CORS restricted to allowed origins
- Helmet.js security headers
- Zod input validation on all endpoints
- No stack traces exposed in production responses
- `sameSite: lax` cookie policy

---

## 🔮 Future Improvements

- Server Components for data fetching (eliminate `useEffect` waterfalls)
- Role-based access control (admin can delete any post)
- OpenAPI/Swagger documentation
- Rate limiting
- Structured logging with request IDs
- Refresh token flow