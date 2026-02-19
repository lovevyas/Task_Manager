# Task Management System (Track A)

Production-ready full-stack starter using **Node.js + TypeScript + Express + Prisma** and **Next.js App Router + TypeScript + Tailwind**.

## Project Structure

```txt
Task-Manager/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── app.ts
│   │   ├── server.ts
│   │   ├── config/env.ts
│   │   ├── controllers/
│   │   │   ├── ai.controller.ts
│   │   │   ├── auth.controller.ts
│   │   │   └── task.controller.ts
│   │   ├── lib/prisma.ts
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   └── validate.middleware.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   └── task.routes.ts
│   │   ├── services/
│   │   │   ├── ai.service.ts
│   │   │   ├── auth.service.ts
│   │   │   └── task.service.ts
│   │   ├── types/express.d.ts
│   │   └── utils/
│   │       ├── httpError.ts
│   │       └── jwt.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── dashboard/page.tsx
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/
│   │   │   ├── tasks/TaskDashboard.tsx
│   │   │   └── ui/Button.tsx
│   │   ├── lib/
│   │   │   ├── api/{auth.ts,client.ts,tasks.ts}
│   │   │   └── validators/auth.ts
│   │   └── types/index.ts
│   ├── package.json
│   ├── tailwind.config.ts
│   └── tsconfig.json
```

## Step-by-step Implementation (1-day plan)

### Step 1: Backend setup
```bash
cd backend
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run dev
```

### Step 2: Prisma schema
- `User` and `Task` models with one-to-many relationship.
- Task status values: `PENDING`, `IN_PROGRESS`, `DONE` (validated in API layer).

### Step 3: Auth implementation
- Endpoints:
  - `POST /auth/register`
  - `POST /auth/login`
  - `POST /auth/refresh`
  - `POST /auth/logout`
- bcrypt hashing, JWT access/refresh flow.
- refresh token stored in HTTP-only cookie.

### Step 4: Task CRUD
- Endpoints:
  - `GET /tasks`
  - `POST /tasks`
  - `GET /tasks/:id`
  - `PATCH /tasks/:id`
  - `DELETE /tasks/:id`
  - `PATCH /tasks/:id/toggle`
- All routes protected with `requireAuth` middleware.
- User isolation enforced (`userId` filter in all task queries).

### Step 5: Pagination + filtering + search
- Query params on `GET /tasks`:
  - `page` (default 1)
  - `pageSize` (default 10)
  - `status` (optional enum)
  - `search` (title contains)

### Step 6: Frontend setup
```bash
cd frontend
npm install
npm run dev
```
- Next.js App Router + TailwindCSS.
- Login, Register, Dashboard pages.

### Step 7: Auth integration
- Axios client with request interceptor adds Bearer token.
- Response interceptor auto-calls `/auth/refresh` on 401 and retries request.

### Step 8: Dashboard
- Task list with search, status filtering, pagination controls.
- Add/Delete/Toggle actions.
- Toast notifications.
- Responsive utility classes.

### Step 9: Polish
- Zod validation (frontend and backend).
- Proper status codes and centralized error middleware.
- Clear layered architecture (routes/controllers/services).

### Step 10: Deployment guide
- Backend: deploy to Render/Railway/Fly (set env vars + run migrations).
- Frontend: deploy to Vercel (`NEXT_PUBLIC_API_URL` set to backend URL).
- In production set secure cookie + HTTPS.

## Optional AI enhancement (included)
- Endpoint: `POST /tasks/ai/rewrite`
- Rewrites short task title into a clearer professional sentence.
- Uses Gemini API if `GEMINI_API_KEY` exists; otherwise graceful local fallback.


## Architecture Decisions
- **Refresh tokens in httpOnly cookie + DB persistence**: token is inaccessible to JS, can be revoked on logout, and rotated on refresh for better session security.
- **Access token in memory only**: frontend keeps access token in runtime memory via Axios client state to reduce persistence risk.
- **Service layer**: business logic stays in services while controllers remain thin and route wiring stays clean.
- **User isolation**: every task query is filtered by `userId`, preventing cross-user access by design.


## Migration note after pulling latest changes
Because refresh tokens are now persisted in DB, run migrations before auth testing:

```bash
cd backend
npx prisma migrate dev --name add_refresh_tokens
npx prisma generate
```
