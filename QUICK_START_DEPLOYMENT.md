# 🚀 Quick Start: Deploy to Vercel

## What You Have
✅ **Backend**: Express + Prisma + Groq AI  
✅ **Frontend**: Next.js + React  
✅ **Database**: Already configured for PostgreSQL  
✅ **API Key**: GROQ_API_KEY ready

---

## 🎯 Deployment Overview

You'll deploy **2 separate projects** on Vercel:
1. **Backend** (`backend` folder) → API server
2. **Frontend** (`frontend` folder) → User interface

---

## 📚 Where to Start

### Option 1: Detailed Step-by-Step Guide
Open: `.agent/workflows/deploy-to-vercel.md`

This guide walks you through:
- Creating GitHub account
- Pushing code to GitHub
- Setting up PostgreSQL database
- Deploying backend
- Deploying frontend
- Testing everything

### Option 2: Quick Checklist
Open: `DEPLOYMENT_CHECKLIST.md`

Use this to track your progress as you deploy.

---

## ⚡ Quick Command Reference

### Push to GitHub (First Time)
```bash
git init
git add .
git commit -m "Initial commit - ready for deployment"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Database Migration (After Backend Deployed)
```bash
cd backend
$env:DATABASE_URL="your_postgres_connection_string"
npx prisma migrate deploy
```

### Future Updates
```bash
git add .
git commit -m "Your changes"
git push
```
*Vercel auto-deploys on push!*

---

## 🔑 Environment Variables You'll Need

### Backend (Vercel)
- `GROQ_API_KEY` = (your Groq API key from `backend/.env`)
- `DATABASE_URL` = (from Neon Postgres - the POSTGRES_PRISMA_URL you copied)

### Frontend (Vercel)
- `NEXT_PUBLIC_API_URL` = `https://your-backend-url.vercel.app/api/chat`

---

## 📋 Deployment Order

1. **Create GitHub repo** → Push code
2. **Create Vercel account** → Connect GitHub
3. **Create PostgreSQL database** → Get connection string
4. **Deploy backend** → Get backend URL
5. **Run database migration** → Set up tables
6. **Deploy frontend** → Use backend URL
7. **Test** → Send a chat message!

---

## 🆘 Common Issues

| Problem | Solution |
|---------|----------|
| "Failed to get response" | Check `NEXT_PUBLIC_API_URL` in frontend |
| Database errors | Add `?pgbouncer=true&connection_limit=1` to DATABASE_URL |
| Build fails | Check Vercel deployment logs |
| Chat history not saving | Verify database migration ran successfully |

---

## 📞 Need Help?

1. Check the detailed guide: `.agent/workflows/deploy-to-vercel.md`
2. Review deployment logs in Vercel dashboard
3. Check browser console (F12) for frontend errors
4. Ask me with specific error messages!

---

## ✨ What Happens After Deployment?

- ✅ Your app is live on the internet
- ✅ You get a public URL to share
- ✅ Automatic HTTPS (secure)
- ✅ Auto-deploys when you push to GitHub
- ✅ Free hosting (Vercel free tier)

---

**Ready to deploy?** Start with the detailed guide in `.agent/workflows/deploy-to-vercel.md`

Good luck! 🎉
