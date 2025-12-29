# 🏗️ Deployment Architecture

## Current Setup (Local Development)

```
┌─────────────────────────────────────────────────────┐
│  Your Computer                                      │
│                                                     │
│  ┌──────────────┐         ┌──────────────┐        │
│  │   Frontend   │────────▶│   Backend    │        │
│  │  (Next.js)   │         │  (Express)   │        │
│  │ localhost:   │         │ localhost:   │        │
│  │   3000       │         │   4000       │        │
│  └──────────────┘         └──────┬───────┘        │
│                                  │                 │
│                           ┌──────▼───────┐        │
│                           │   SQLite     │        │
│                           │   (dev.db)   │        │
│                           └──────────────┘        │
└─────────────────────────────────────────────────────┘
```

---

## Production Setup (After Vercel Deployment)

```
┌─────────────────────────────────────────────────────────────┐
│  Vercel Cloud                                               │
│                                                             │
│  ┌────────────────────┐         ┌────────────────────┐    │
│  │  Frontend Project  │────────▶│  Backend Project   │    │
│  │    (Next.js)       │         │    (Express)       │    │
│  │                    │         │                    │    │
│  │ spur-frontend      │         │ spur-backend       │    │
│  │ .vercel.app        │         │ .vercel.app        │    │
│  └────────────────────┘         └─────────┬──────────┘    │
│                                            │               │
│                                     ┌──────▼──────────┐    │
│                                     │  PostgreSQL DB  │    │
│                                     │  (Vercel DB)    │    │
│                                     └─────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                    ▲
                    │
                    │ HTTPS
                    │
         ┌──────────┴──────────┐
         │   Users Worldwide   │
         │  (Your Friends!)    │
         └─────────────────────┘
```

---

## What Changes During Deployment?

| Component | Local Development | Production (Vercel) |
|-----------|------------------|---------------------|
| **Frontend URL** | `http://localhost:3000` | `https://spur-frontend.vercel.app` |
| **Backend URL** | `http://localhost:4000` | `https://spur-backend.vercel.app` |
| **Database** | SQLite (file: `dev.db`) | PostgreSQL (cloud) |
| **Environment** | `.env` files | Vercel Environment Variables |
| **HTTPS** | ❌ No | ✅ Yes (automatic) |
| **Public Access** | ❌ Only you | ✅ Anyone with URL |

---

## How They Connect

### Local Development
```javascript
// Frontend calls backend
fetch('http://localhost:4000/api/chat/message')
```

### Production
```javascript
// Frontend calls backend using environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL; 
// = 'https://spur-backend.vercel.app/api/chat'
fetch(`${API_URL}/message`)
```

---

## Environment Variables Flow

### Backend Environment Variables
```
┌─────────────────────────────────┐
│  Vercel Dashboard               │
│  (Backend Project Settings)     │
│                                 │
│  GROQ_API_KEY = gsk_...         │
│  DATABASE_URL = postgres://...  │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Backend Code                   │
│  process.env.GROQ_API_KEY       │
│  process.env.DATABASE_URL       │
└─────────────────────────────────┘
```

### Frontend Environment Variables
```
┌─────────────────────────────────────────┐
│  Vercel Dashboard                       │
│  (Frontend Project Settings)            │
│                                         │
│  NEXT_PUBLIC_API_URL =                  │
│    https://spur-backend.vercel.app/...  │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  Frontend Code                          │
│  process.env.NEXT_PUBLIC_API_URL        │
└─────────────────────────────────────────┘
```

---

## Deployment Workflow

```
1. Write Code
   │
   ▼
2. Git Commit & Push
   │
   ▼
3. GitHub Repository
   │
   ▼
4. Vercel Detects Changes
   │
   ▼
5. Vercel Builds Project
   │
   ├─▶ Frontend Build (Next.js)
   │   └─▶ Generates static files
   │
   └─▶ Backend Build (TypeScript)
       └─▶ Compiles to JavaScript
   │
   ▼
6. Vercel Deploys
   │
   ├─▶ Frontend: https://spur-frontend.vercel.app
   └─▶ Backend:  https://spur-backend.vercel.app
   │
   ▼
7. Live & Accessible! 🎉
```

---

## Database Migration Flow

```
1. Create PostgreSQL DB on Vercel
   │
   ▼
2. Get DATABASE_URL
   (postgres://user:pass@host/db)
   │
   ▼
3. Set in Backend Environment Variables
   (Add ?pgbouncer=true&connection_limit=1)
   │
   ▼
4. Run Migration from Local Machine
   $ npx prisma migrate deploy
   │
   ▼
5. Tables Created in Production DB
   (Conversation, Message)
   │
   ▼
6. Backend Can Now Store Data! ✅
```

---

## Why Two Separate Projects?

**Frontend Project:**
- Serves the user interface
- Handles routing, pages, components
- Runs on Vercel's edge network (fast!)
- Static files + server-side rendering

**Backend Project:**
- Handles API requests
- Connects to database
- Processes AI chat logic
- Runs as serverless functions

**Benefits:**
- ✅ Independent scaling
- ✅ Separate environment variables
- ✅ Better security (database credentials only in backend)
- ✅ Easier debugging

---

## Security Notes

🔒 **Never commit these to Git:**
- `.env` files
- `DATABASE_URL`
- `GROQ_API_KEY`

✅ **Safe to commit:**
- `vercel.json`
- `.env.example` (without actual values)
- Source code

🛡️ **Vercel handles:**
- HTTPS certificates (automatic)
- Environment variable encryption
- Secure database connections

---

## What Happens When User Visits Your App?

```
1. User types: https://spur-frontend.vercel.app
   │
   ▼
2. Vercel serves Next.js frontend
   │
   ▼
3. User sends chat message
   │
   ▼
4. Frontend calls: https://spur-backend.vercel.app/api/chat/message
   │
   ▼
5. Backend receives request
   │
   ▼
6. Backend calls Groq API (AI)
   │
   ▼
7. Backend saves to PostgreSQL
   │
   ▼
8. Backend sends response to Frontend
   │
   ▼
9. User sees AI reply! 🤖
```

---

## Monitoring Your Deployment

### Vercel Dashboard Shows:
- 📊 Deployment status
- 📈 Analytics (page views, etc.)
- 🐛 Error logs
- ⚡ Performance metrics
- 💾 Database usage

### How to Check Logs:
1. Go to Vercel Dashboard
2. Click on your project
3. Click "Deployments"
4. Click on latest deployment
5. View "Build Logs" or "Function Logs"

---

## Cost Breakdown (Free Tier)

| Resource | Free Tier Limit | Your Usage |
|----------|----------------|------------|
| Vercel Hosting | 100 GB bandwidth/month | ~1-5 GB |
| Vercel Functions | 100 GB-hours/month | ~1-10 GB-hours |
| PostgreSQL DB | 256 MB storage | ~1-50 MB |
| Groq API | Free tier varies | Depends on usage |

**Estimated Cost:** $0/month (within free tier) 💰

---

## Next Steps After Deployment

1. **Custom Domain** (Optional)
   - Buy domain (e.g., `spur-ai.com`)
   - Connect in Vercel settings
   - Automatic HTTPS

2. **Monitoring**
   - Set up error alerts
   - Monitor API usage
   - Track user analytics

3. **Improvements**
   - Add authentication
   - Implement rate limiting
   - Add more AI features

---

**Ready to deploy?** Follow the guide in `.agent/workflows/deploy-to-vercel.md`
