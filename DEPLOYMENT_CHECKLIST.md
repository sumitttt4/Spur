# Vercel Deployment Checklist

Use this checklist to track your deployment progress!

## ✅ Pre-Deployment Checklist

- [ ] **GitHub Account Created** - Sign up at [github.com](https://github.com)
- [ ] **Vercel Account Created** - Sign up at [vercel.com](https://vercel.com)
- [ ] **GROQ API Key Ready** - Check your `backend/.env` file
- [ ] **Code is Ready** - Your Prisma schema is already set to PostgreSQL ✅

---

## 📦 Step 1: Push to GitHub

- [ ] Created new repository on GitHub
- [ ] Repository name: ________________
- [ ] Ran `git init` (if needed)
- [ ] Ran `git add .`
- [ ] Ran `git commit -m "Initial commit - ready for deployment"`
- [ ] Ran `git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git`
- [ ] Ran `git push -u origin main`
- [ ] ✅ Code is visible on GitHub

---

## 🗄️ Step 2: Create PostgreSQL Database

- [ ] Logged into Vercel Dashboard
- [ ] Clicked "Storage" → "Create Database"
- [ ] Selected "Postgres"
- [ ] Database name: ________________
- [ ] Database created successfully
- [ ] Copied `DATABASE_URL` from .env.local tab
- [ ] ✅ DATABASE_URL saved: `postgres://...`

---

## 🔧 Step 3: Deploy Backend

- [ ] Clicked "Add New" → "Project" in Vercel
- [ ] Imported GitHub repository
- [ ] Project name: `spur-backend`
- [ ] Framework: "Other"
- [ ] Root directory: `backend`
- [ ] Added environment variable: `GROQ_API_KEY`
- [ ] Added environment variable: `DATABASE_URL` (with `?pgbouncer=true&connection_limit=1`)
- [ ] Clicked "Deploy"
- [ ] ✅ Backend deployed successfully
- [ ] Backend URL: ________________________________

### Database Migration
- [ ] Opened terminal in `backend` folder
- [ ] Set DATABASE_URL: `$env:DATABASE_URL="your_postgres_url"`
- [ ] Ran: `npx prisma migrate deploy`
- [ ] ✅ Database tables created

---

## 🎨 Step 4: Deploy Frontend

- [ ] Clicked "Add New" → "Project" in Vercel (again)
- [ ] Imported same GitHub repository
- [ ] Project name: `spur-frontend`
- [ ] Framework: "Next.js"
- [ ] Root directory: `frontend`
- [ ] Added environment variable: `NEXT_PUBLIC_API_URL` = `https://your-backend-url.vercel.app/api/chat`
- [ ] Clicked "Deploy"
- [ ] ✅ Frontend deployed successfully
- [ ] Frontend URL: ________________________________

---

## 🧪 Step 5: Test Your Deployment

- [ ] Visited frontend URL
- [ ] Sent a test chat message
- [ ] Received AI response
- [ ] ✅ **DEPLOYMENT SUCCESSFUL!** 🎉

---

## 🐛 Troubleshooting (If Needed)

### Chat Not Working?
- [ ] Checked `NEXT_PUBLIC_API_URL` in frontend settings
- [ ] Verified backend URL is correct
- [ ] Checked browser console for errors (F12)

### Database Errors?
- [ ] Verified `DATABASE_URL` has `?pgbouncer=true&connection_limit=1`
- [ ] Confirmed `npx prisma migrate deploy` was run
- [ ] Checked Vercel logs for backend

### Build Errors?
- [ ] Checked deployment logs in Vercel
- [ ] Verified all dependencies in `package.json`
- [ ] Tried redeploying

---

## 🔄 Future Updates

When you make code changes:

```bash
git add .
git commit -m "Description of changes"
git push
```

Vercel will automatically redeploy! 🚀

---

## 📝 Important URLs to Save

| Item | URL |
|------|-----|
| GitHub Repo | https://github.com/________________/________________ |
| Vercel Dashboard | https://vercel.com/dashboard |
| Backend URL | https://________________________________ |
| Frontend URL | https://________________________________ |
| Database Dashboard | https://vercel.com/storage/________________ |

---

## 🎓 You're All Set!

Once all checkboxes are complete, your app is live on the internet! 🌐

Need help? Check the detailed guide in `.agent/workflows/deploy-to-vercel.md`
