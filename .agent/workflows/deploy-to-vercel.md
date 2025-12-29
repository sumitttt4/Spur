---
description: Complete beginner's guide to deploy on Vercel
---

# Complete Beginner's Guide: Deploy Your Spur App to Vercel

This guide will walk you through deploying your full-stack application (Frontend + Backend) to Vercel from scratch. No prior deployment experience needed!

---

## 📋 Prerequisites (What You Need Before Starting)

1. **GitHub Account** - Free account at [github.com](https://github.com)
2. **Vercel Account** - Free account at [vercel.com](https://vercel.com) (you can sign up with GitHub)
3. **Your Code** - The Spur project on your computer
4. **API Keys** - Your GROQ_API_KEY (you should already have this in your `.env` files)

---

## 🎯 Overview: What We'll Do

Your app has two parts:
- **Frontend** (Next.js) - The user interface
- **Backend** (Express + Prisma) - The API and database

We'll deploy both separately on Vercel and connect them together.

**Important**: Vercel doesn't support SQLite (your current database). We'll switch to PostgreSQL (a cloud database that Vercel provides for free).

---

## Step 1: Push Your Code to GitHub

### 1.1 Create a New Repository on GitHub
1. Go to [github.com](https://github.com) and log in
2. Click the **"+"** button (top right) → **"New repository"**
3. Fill in:
   - **Repository name**: `spur` (or any name you like)
   - **Description**: "AI Chat Application with Groq"
   - **Visibility**: Choose "Public" or "Private"
   - **DO NOT** check "Initialize with README" (you already have code)
4. Click **"Create repository"**

### 1.2 Push Your Local Code to GitHub
Open your terminal/PowerShell in the Spur folder and run these commands:

```bash
# If you haven't initialized git yet
git init

# Add all your files
git add .

# Commit your files
git commit -m "Initial commit - ready for deployment"

# Connect to your GitHub repository (replace YOUR_USERNAME and YOUR_REPO)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push your code
git branch -M main
git push -u origin main
```

**Note**: Replace `YOUR_USERNAME` with your GitHub username and `YOUR_REPO` with your repository name.

---

## Step 2: Update Database Configuration (SQLite → PostgreSQL)

Before deploying, we need to update your database configuration.

### 2.1 Update Prisma Schema
1. Open `backend/prisma/schema.prisma`
2. Find the line that says `provider = "sqlite"`
3. Change it to `provider = "postgresql"`
4. Save the file

### 2.2 Regenerate Prisma Client
Run this command in your terminal from the `backend` folder:

```bash
cd backend
npx prisma generate
cd ..
```

### 2.3 Commit These Changes
```bash
git add .
git commit -m "Switch to PostgreSQL for deployment"
git push
```

---

## Step 3: Create Vercel Account & Connect GitHub

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account
5. You'll be redirected to your Vercel Dashboard

---

## Step 4: Create PostgreSQL Database on Vercel

1. In Vercel Dashboard, click **"Storage"** (left sidebar)
2. Click **"Create Database"**
3. Select **"Postgres"**
4. Fill in:
   - **Database Name**: `spur-database` (or any name)
   - **Region**: Choose closest to you
5. Click **"Create"**
6. Once created, click on your database
7. Go to **".env.local"** tab
8. Copy the **`DATABASE_URL`** value (starts with `postgres://...`)
   - **IMPORTANT**: Keep this safe! You'll need it in the next steps

---

## Step 5: Deploy Backend to Vercel

### 5.1 Create Backend Project
1. In Vercel Dashboard, click **"Add New..."** → **"Project"**
2. Find your GitHub repository (`spur`) and click **"Import"**
3. **Configure Project**:
   - **Project Name**: `spur-backend`
   - **Framework Preset**: Select **"Other"**
   - **Root Directory**: Click **"Edit"** → Select **`backend`** folder → Click **"Continue"**

### 5.2 Add Environment Variables
In the **"Environment Variables"** section:

1. Add **GROQ_API_KEY**:
   - Name: `GROQ_API_KEY`
   - Value: (paste your Groq API key)
   - Click **"Add"**

2. Add **DATABASE_URL**:
   - Name: `DATABASE_URL`
   - Value: (paste the PostgreSQL connection string from Step 4)
   - **IMPORTANT**: Add `?pgbouncer=true&connection_limit=1` at the end of the URL
   - Example: `postgres://user:pass@host/db?pgbouncer=true&connection_limit=1`
   - Click **"Add"**

### 5.3 Deploy Backend
1. Click **"Deploy"**
2. Wait for deployment to complete (usually 1-3 minutes)
3. Once done, you'll see "🎉 Congratulations!"
4. **Copy your backend URL** (e.g., `https://spur-backend.vercel.app`)
   - You'll need this for the frontend!

### 5.4 Run Database Migrations
After backend is deployed, you need to set up the database tables.

**Option A: From Vercel Dashboard**
1. Go to your backend project in Vercel
2. Click **"Settings"** → **"Functions"**
3. Add a new function or use the terminal in Vercel

**Option B: From Your Local Machine** (Recommended)
1. Open terminal in your `backend` folder
2. Temporarily set the production database URL:
   ```bash
   # Windows PowerShell
   $env:DATABASE_URL="your_postgres_url_from_step_4"
   
   # Then run migration
   npx prisma migrate deploy
   ```
3. This creates all necessary tables in your production database

---

## Step 6: Deploy Frontend to Vercel

### 6.1 Update Frontend Code to Use Environment Variable
Before deploying, we need to make the frontend use the backend URL dynamically.

1. Open `frontend/src/hooks/use-chat-ui.ts`
2. Find the line with `fetch('http://localhost:4000/api/chat/message'...)`
3. We'll update this in the next step (or I can do it for you!)

### 6.2 Create Frontend Project
1. In Vercel Dashboard, click **"Add New..."** → **"Project"**
2. Find your GitHub repository (`spur`) again and click **"Import"**
3. **Configure Project**:
   - **Project Name**: `spur-frontend`
   - **Framework Preset**: **"Next.js"** (should auto-detect)
   - **Root Directory**: Click **"Edit"** → Select **`frontend`** folder → Click **"Continue"**

### 6.3 Add Environment Variables
In the **"Environment Variables"** section:

1. Add **NEXT_PUBLIC_API_URL**:
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: `https://your-backend-url.vercel.app/api/chat` (use your backend URL from Step 5.3)
   - Click **"Add"**

### 6.4 Deploy Frontend
1. Click **"Deploy"**
2. Wait for deployment to complete (usually 1-3 minutes)
3. Once done, click **"Visit"** to see your live app!

---

## Step 7: Test Your Deployment

1. Visit your frontend URL (e.g., `https://spur-frontend.vercel.app`)
2. Try sending a chat message
3. If it works - **Congratulations! You've successfully deployed your app!** 🎉

### Common Issues & Solutions:

**Issue**: Chat not working / "Failed to get response"
- **Solution**: Check that `NEXT_PUBLIC_API_URL` in frontend points to correct backend URL
- **Solution**: Check that `GROQ_API_KEY` is set correctly in backend

**Issue**: Database errors
- **Solution**: Make sure you ran `npx prisma migrate deploy` (Step 5.4)
- **Solution**: Verify `DATABASE_URL` has `?pgbouncer=true&connection_limit=1` at the end

**Issue**: Build fails
- **Solution**: Check the build logs in Vercel dashboard
- **Solution**: Make sure all dependencies are in `package.json`

---

## Step 8: Future Updates

When you make changes to your code:

1. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your update message"
   git push
   ```

2. Vercel will **automatically redeploy** both frontend and backend! 🚀

---

## 🎓 What You've Learned

- ✅ How to push code to GitHub
- ✅ How to create and configure Vercel projects
- ✅ How to set up PostgreSQL database
- ✅ How to deploy full-stack applications
- ✅ How to connect frontend and backend
- ✅ How to manage environment variables

---

## 📚 Helpful Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Prisma with PostgreSQL](https://www.prisma.io/docs/concepts/database-connectors/postgresql)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

## 🆘 Need Help?

If you get stuck:
1. Check the Vercel build logs (in your project → Deployments → Click on deployment → View logs)
2. Check browser console for frontend errors (F12 → Console tab)
3. Ask me for help with specific error messages!

Good luck with your deployment! 🚀
