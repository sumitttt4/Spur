# Spur AI Chat Agent 🚀

A robust, full-stack customer support agent built with **React, Node.js, and Llama 3 (via Groq)**. This agent helps "SpurStore" customers with shipping, returns, and product queries using a retrieval-augmented style approach (embedded knowledge).

## ✨ Features
- **Smart Responses**: Uses Llama 3.1-8b for instant, human-like answers.
- **Persistence**: PostgreSql database stores full conversation history.
- **Robustness**: Handles efficient error recovery, rate limits, and network timeouts.
- **Modern UI**: Clean, responsive chat interface with sticky controls and auto-scroll.

---

## 🛠️ How to Run Locally

### Prerequisites
- Node.js (v18+)
- PostgreSQL (or a Neon/Supabase connection string)

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
DATABASE_URL="postgresql://user:password@localhost:5432/spur_chat" # Your Postgres URL
GROQ_API_KEY="gsk_..." # Get free key from console.groq.com
```

### 3. Database Setup
Run the database migrations to set up the schema:
```bash
# Inside backend/ directory
npx prisma migrate dev --name init
```

### 4. Start the Application
You can run both services concurrently from the root:
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

Visit `http://localhost:3000` to chat!

---

## 🏗️ Architecture Overview

The project follows a **Service-Oriented Architecture** within a monorepo structure:

### Backend (`/backend`)
- **Controllers**: Handle HTTP requests and validation (Zod).
- **Services**: Contain business logic.
  - `ChatService`: Manages conversation state and DB persistence.
  - `LLMService`: Encapsulates the AI provider logic (Groq/OpenAI).
- **Data Layer**: Prisma ORM with PostgreSQL.

### Frontend (`/frontend`)
- **Next.js (App Router)**: For fast rendering and routing.
- **Components**: specific chat UI components (`ChatWidget`).
- **Hooks**: Custom `useChatUI` hook to separate UI logic from state management.

### Key Design Decisions
- **Singleton Prisma Client**: Implemented to prevent connection exhaustion in serverless/dev environments.
- **Abstraction**: The LLM provider is hidden behind a generic `generateReply` interface, making it trivial to swap Groq for OpenAI or Anthropic later.

---

## 🧠 LLM Strategy

- **Provider**: **Groq** (using `llama-3.1-8b-instant`).
  - *Reasoning*: Extremely low latency (critical for chat) and low cost compared to GPT-4.
- **Prompting**:
  - We use a **System Prompt** injected with "Store Knowledge" (Policies, Hours, etc.).
  - The model is instructed to form concise, bulleted responses to avoid "Wall of Text" fatigue.
- **Context Management**:
  - We pass the last **10 messages** to balance context retention with token costs.

---

## ⚖️ Trade-offs & Future Improvements (If I had more time...)

1.  **Vector Search (RAG)**:
    - *Current*: Knowledge is hardcoded in the system prompt.
    - *Future*: Use a vector DB (Pinecone/pgvector) to fetch relevant policy documents dynamically. This would scale to thousands of products.

2.  **Streaming Responses**:
    - *Current*: We wait for the full response before displaying.
    - *Future*: Implement Server-Sent Events (SSE) to stream text token-by-token for a faster perceived latency.

3.  **Authentication**:
    - *Current*: Session-based (Guest).
    - *Future*: Integrate JWT auth to save history against a real user account.

4.  **Testing**:
    - Add Unit tests (Jest) for the `LLMService` error handling logic.

---

**Built by Sumit for Spur.**
