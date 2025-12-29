# Spur AI Chat Agent

A full-stack AI customer support agent built for the Spur founding engineer take-home assignment.

## Tech Stack
- **Backend**: Node.js, Express, TypeScript
- **Frontend**: Next.js 15 (React), Tailwind CSS, Shadcn UI
- **Database**: SQLite (via Prisma ORM) - *Easily swappable to PostgreSQL*
- **LLM**: Groq (`llama3-8b-8192`) - *Compatible with OpenAI SDK, used for speed and efficiency.*

## Features
- Real-time chat interface with optimistic UI updates.
- AI Agent with domain knowledge (Shipping, Returns, etc.) powered by **Llama 3**.
- Persistent conversations (stored in SQLite/Postgres).
- Polished UI using Shadcn components.
- Fully responsive, one-screen layout.

## Prerequisites
- Node.js 18+
- NPM
- Groq API Key

## Setup Instructions

### 1. Backend Setup

The backend handles the chat logic, LLM integration, and database persistence.

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Setup Database:
    - Run migrations to create the SQLite database (`dev.db`):
      ```bash
      npx prisma migrate dev --name init
      ```
    - (Optional) Seed the database with demo data:
      ```bash
      npx prisma db seed
      ```

4.  Configure Environment Variables:
    - Copy `.env.example` to `.env`:
      ```bash
      cp .env.example .env
      ```
    - **Crucial**: Update `GROQ_API_KEY` in `.env` with your actual key (from Groq Cloud).

5.  Start the Development Server:
    ```bash
    npm run dev
    ```
    *The server will run on `http://localhost:4000`.*

### 2. Frontend Setup

The frontend is a Next.js application providing the chat interface.

1.  Open a new terminal and navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the Development Server:
    ```bash
    npm run dev
    ```
    *The app will be available at `http://localhost:3000`.*

## Architecture Overview

### Backend Structure (`/backend`)
-   **`src/controllers`**: Handles incoming HTTP requests and validation (Zod).
-   **`src/services`**: Contains business logic.
    -   `ChatService`: Manages conversation state and DB interactions.
    -   `LLMService`: Encapsulates the OpenAI API interaction, including system prompts and error handling.
-   **`src/routes`**: Defines API endpoints (`/api/chat/message`).
-   **`prisma/schema.prisma`**: Defines the data model (Conversations, Messages).

### Frontend Structure (`/frontend`)
-   **`src/components/chat`**: logic for the chat widget.
-   **`src/hooks/use-chat-ui.ts`**: Custom hook managing chat state, API calls, and optimistic updates.
-   **`src/app`**: Next.js App Router pages.

### Design Decisions
-   **SQLite for Dev**: I chose SQLite for the submission to ensure the reviewer can run the project locally without needing to spin up a Docker container or local Postgres instance. Prisma makes it trivial to switch to Postgres for production by just changing the provider in `schema.prisma`.
-   **Optimistic UI**: The chat interface shows the user's message immediately and a "Thinking..." state to make the app feel responsive.
-   **Service Layer Pattern**: Separated logic from controllers to make the code testable and modular.

## LLM Integration
-   **Provider**: Groq
-   **Model**: `llama3-8b-8192` (Extremely fast, open-source model).
-   **Prompting**: A system prompt is injected into every call with specific domain knowledge (Shipping policies, return windows, etc.) to simulate a real store agent.

## Trade-offs & Future Improvements
-   **Streaming**: Currently, the API waits for the full response. For a better UX, I would implement Server-Sent Events (SSE) or AI SDK streaming to show the response character-by-character.
-   **Authentication**: There is no auth currently; sessions are tracked via a simple ID in local storage. Real production apps would require JWT/Session auth.
-   **Vector Search (RAG)**: For a larger knowledge base, hardcoding context in the system prompt hits limits. I would implement RAG using `pgvector` or Pinecone to fetch relevant policy documents dynamically.

---
Built for Spur.
