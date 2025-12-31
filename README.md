# Spur AI Chat Agent

A robust, full-stack customer support agent built with React, Node.js, and Llama 3 (via Groq). This agent assists "SpurStore" customers with shipping, returns, and product queries using a retrieval-augmented style approach with embedded knowledge.

## Features

- **Smart Responses**: Uses Llama 3.1-8b for instant, contextual answers.
- **Persistence**: PostgreSQL database stores full conversation history.
- **Robustness**: Efficient error recovery, rate limit handling, and network timeout management.
- **Modern UI**: Clean, responsive chat interface with sticky controls and auto-scroll.

---

## How to Run Locally

### Prerequisites

- Node.js (v18+)
- PostgreSQL

### 1. Clone & Install

```bash
git clone https://github.com/sumitttt4/Spur.git
cd Spur
npm install
```

### 2. Environment Setup

Create a `.env` file in the `backend/` directory:

```env
PORT=4000
DATABASE_URL="postgresql://user:password@localhost:5432/spur_chat"
GROQ_API_KEY="gsk_..."
```

### 3. Database Setup

Run the database migrations to set up the schema:

```bash
# Inside backend/ directory
npx prisma migrate dev --name init
```

### 4. Start the Application

You can run both services concurrently from the root directory:

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

Visit `http://localhost:3000` to verify the application is running.

---

## Architecture Overview

The project follows a Service-Oriented Architecture within a monorepo structure:

### Backend (`/backend`)

- **Controllers**: Handle HTTP requests and validation (Zod).
- **Services**: Contain business logic.
  - `ChatService`: Manages conversation state and DB persistence.
  - `LLMService`: Encapsulates the AI provider logic.
- **Data Layer**: Prisma ORM with PostgreSQL.

### Frontend (`/frontend`)

- **Next.js (App Router)**: For server-side rendering and routing.
- **Components**: Modular chat UI components (`ChatWidget`).
- **Hooks**: Custom `useChatUI` hook to separate UI logic from state management.

### Key Design Decisions

- **Singleton Prisma Client**: Implemented to prevent connection pool exhaustion in serverless or development environments.
- **Abstraction**: The LLM provider is encapsulated behind a generic interface, allowing for easy interchangeability between providers (e.g., swapping Groq for OpenAI or Anthropic).

---

## LLM Strategy

- **Provider**: Groq (using `llama-3.1-8b-instant`).
  - *Reasoning*: Selected for extremely low latency (critical for chat) and cost-efficiency.
- **Prompting**:
  - Utilizes a System Prompt injected with specific "Store Knowledge" (Policies, Hours, etc.).
  - The model is instructed to provide concise responses to improve readability.
- **Context Management**:
  - The system passes the last 10 messages to balance context retention with token usage.

---

## Trade-offs & Future Improvements

1.  **Vector Search (RAG)**:
    - *Current*: Knowledge is static within the system prompt.
    - *Future*: Implement a vector database (e.g., Pinecone or pgvector) to dynamically fetch relevant policy documents, allowing scalability for larger knowledge bases.

2.  **Streaming Responses**:
    - *Current*: Full response is awaited before display.
    - *Future*: Implement Server-Sent Events (SSE) to stream text token-by-token for reduced perceived latency.

3.  **Authentication**:
    - *Current*: Session-based access.
    - *Future*: Integrate JWT authentication to persist history against specific user accounts.

4.  **Testing**:
    - *Future*: Add unit tests (Jest) specifically for the `LLMService` error handling logic to ensure reliability under failure conditions.
