# Deployment Guide (Vercel)

Deploying this monorepo to Vercel requires two separate Vercel projects: one for the Frontend and one for the Backend.

**IMPORTANT**: Vercel does NOT support SQLite (file-based DB). You MUST switch to PostgreSQL (e.g., Vercel Postgres or Neon) for the deployed version.

---

## 1. Prepare Database (PostgreSQL)

1.  Create a repository on GitHub and push your code.
2.  Go to Vercel Dashboard -> Storage -> Create **Vercel Postgres** database.
3.  Copy the connection string (e.g., `postgres://...`).
4.  **Update Code**:
    *   Open `backend/prisma/schema.prisma`.
    *   Change `provider = "sqlite"` to `provider = "postgresql"`.
    *   Run `npx prisma generate` in `backend/`.
    *   Commit and push these changes.

---

## 2. Deploy Backend

1.  In Vercel, "Add New" -> "Project" -> Import your GitHub Repo.
2.  **Configure Project**:
    *   **Project Name**: `spur-backend`
    *   **Root Directory**: Click "Edit" and select `backend`.
    *   **Framework Preset**: Select "Other".
    *   **Environment Variables**:
        *   `GROQ_API_KEY`: Your key.
        *   `DATABASE_URL`: Your Vercel Postgres connection string (ensure it ends with `?pgbouncer=true` if required by Vercel).
3.  Click **Deploy**.
4.  Once deployed, copy the **Domain** (e.g., `https://spur-backend.vercel.app`).

---

## 3. Deploy Frontend

1.  In Vercel, "Add New" -> "Project" -> Import your GitHub Repo (again).
2.  **Configure Project**:
    *   **Project Name**: `spur-frontend`
    *   **Root Directory**: Click "Edit" and select `frontend`.
    *   **Framework Preset**: Next.js (Auto-detected).
    *   **Environment Variables**:
        *   `NEXT_PUBLIC_API_URL`: The URL of your backend (e.g., `https://spur-backend.vercel.app/api/chat`).
3.  Click **Deploy**.

---

## 4. Connect Frontend to Backend

1.  The frontend needs to know where the backend is.
2.  Go to `frontend/src/hooks/use-chat-ui.ts` line 26:
    *   Currently hardcoded: `fetch('http://localhost:4000/api/chat/message'...)`.
    *   Update this to use the environment variable:
        ```typescript
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/chat';
        // Use ${API_URL}/message
        ```
    *   Wait, I (the AI) should assume you want this code change done automatically. (See next step in chat).

## 5. Finalize Database
1.  Once the backend is deployed, Vercel limits running migrations automatically.
2.  You may need to run migrations against the production DB from your *local* machine:
    ```bash
    # In backend/ folder locally
    # Temporarily set DATABASE_URL to your prod connection string
    export DATABASE_URL="postgres://..."
    npx prisma migrate deploy
    ```
