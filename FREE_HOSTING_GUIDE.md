# 🆓 Free Hosting Guide - Stock Analysis Platform

Complete guide to deploy your application **100% FREE** using free tier services.

---

## 🎯 Free Hosting Strategy

### Recommended Stack (All Free)

| Service | Purpose | Free Tier Limits |
|---------|---------|-----------------|
| **Vercel** | Frontend hosting | Unlimited requests, 100GB bandwidth |
| **Render** | Backend API | 750 hours/month, spins down after 15min inactivity |
| **Supabase** | PostgreSQL Database | 500MB database, 2GB bandwidth |
| **Upstash** | Redis Cache | 10,000 commands/day (already configured) |

**Alternative Options:**
- **Frontend**: Cloudflare Pages, Netlify (both free)
- **Backend**: Railway ($5 free credit), Fly.io (free tier)
- **Database**: Neon (PostgreSQL), PlanetScale (MySQL)

---

## 📋 Prerequisites

Before starting, ensure you have:

- ✅ GitHub account (free)
- ✅ Email address for account creation
- ✅ Your project pushed to GitHub (already done ✅)

---

## 🚀 Step 1: Deploy Frontend (Vercel) - FREE

### 1.1 Create Vercel Account

1. Go to: https://vercel.com
2. Click **"Sign Up"**
3. Sign up with **GitHub** (recommended)
4. Authorize Vercel to access your repositories

### 1.2 Import Your Project

1. Click **"Add New..."** → **"Project"**
2. Select your repository: `aakash688/stockpredict002`
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 1.3 Add Environment Variables

In Vercel project settings, add:

```
VITE_API_URL=https://your-backend-url.onrender.com
```

**Note**: We'll get the backend URL after deploying backend.

### 1.4 Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. ✅ Your frontend will be live at: `https://your-project.vercel.app`

**✅ Frontend deployed!** Save this URL.

---

## 🐍 Step 2: Deploy Backend (Render) - FREE

### 2.1 Create Render Account

1. Go to: https://render.com
2. Click **"Get Started for Free"**
3. Sign up with **GitHub**
4. Verify your email

### 2.2 Create New Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `aakash688/stockpredict002`
3. Configure the service:

   **Basic Settings:**
   - **Name**: `stockpredict-backend` (or any name)
   - **Region**: Choose closest to you (Oregon, Frankfurt, etc.)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

   **Plan:**
   - Select **"Free"** plan

### 2.3 Add Environment Variables

In Render dashboard, go to **"Environment"** tab and add:

```env
DATABASE_URL=postgresql://user:pass@host:5432/dbname
REDIS_URL=redis://default:AV6bAAIncDI2NGE0Yzk1ZWFiMmE0NzY4YmNlYWI1N2Q3ZTYwZGZhNHAyMjQyMTk@lucky-gator-24219.upstash.io:6379
JWT_SECRET_KEY=your-secret-key-generate-random-32-chars
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
ALPHA_VANTAGE_API_KEY=7U9BJM0SLP5IT8J4
FINNHUB_API_KEY=d5dvikhr01qqgu50ldagd5dvikhr01qqgu50ldb0
EXCHANGE_RATE_API_KEY=530fdd86dc2ca16c6cc7dfa6
CORS_ORIGINS=https://your-frontend.vercel.app,https://your-frontend.vercel.app
```

**Important**: 
- Replace `DATABASE_URL` with Supabase connection string (Step 3)
- Generate `JWT_SECRET_KEY` using: `python -c "import secrets; print(secrets.token_urlsafe(32))"`
- Update `CORS_ORIGINS` with your Vercel frontend URL

### 2.4 Deploy

1. Click **"Create Web Service"**
2. Wait 5-10 minutes for first deployment
3. ✅ Your backend will be live at: `https://your-backend.onrender.com`

**✅ Backend deployed!** Save this URL.

**Note**: Free tier spins down after 15 minutes of inactivity. First request after spin-down takes ~30 seconds.

---

## 🗄️ Step 3: Setup Database (Supabase) - FREE

### 3.1 Create Supabase Account

1. Go to: https://supabase.com
2. Click **"Start your project"**
3. Sign up with **GitHub** or **Email**
4. Verify your email

### 3.2 Create New Project

1. Click **"New Project"**
2. Fill in:
   - **Name**: `stockpredict-db`
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free

3. Click **"Create new project"**
4. Wait 2-3 minutes for project setup

### 3.3 Get Connection String

1. Go to **Settings** → **Database**
2. Scroll to **"Connection string"**
3. Copy the **"URI"** connection string
4. It looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
5. Replace `[YOUR-PASSWORD]` with your database password

### 3.4 Update Backend Environment

1. Go back to Render dashboard
2. Update `DATABASE_URL` environment variable with Supabase connection string
3. Render will automatically redeploy

### 3.5 Verify Tables Created

1. Go to Supabase dashboard → **Table Editor**
2. Tables should be created automatically when backend starts
3. You should see: `users`, `watchlist`, `portfolio`, `predictions`

**✅ Database ready!**

---

## 🔄 Step 4: Update Frontend with Backend URL

### 4.1 Update Vercel Environment Variable

1. Go to Vercel dashboard → Your project → **Settings** → **Environment Variables**
2. Update `VITE_API_URL` with your Render backend URL:
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```
3. Go to **Deployments** tab
4. Click **"Redeploy"** → **"Redeploy"** (to apply new env variable)

**✅ Frontend updated!**

---

## ✅ Step 5: Test Your Live Application

### 5.1 Test Frontend

1. Open your Vercel URL: `https://your-project.vercel.app`
2. ✅ Should load the landing page

### 5.2 Test Backend

1. Open: `https://your-backend.onrender.com/docs`
2. ✅ Should see Swagger API documentation

### 5.3 Test Full Flow

1. Go to frontend URL
2. Sign up with your email
3. Search for stocks
4. ✅ Everything should work!

---

## 🆓 Alternative Free Hosting Options

### Frontend Alternatives

#### Option A: Cloudflare Pages (FREE)

1. Go to: https://pages.cloudflare.com
2. Sign up with GitHub
3. Connect repository
4. Build settings:
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `frontend`
5. Add environment variable: `VITE_API_URL`
6. Deploy!

**Pros**: Fast CDN, unlimited bandwidth  
**Cons**: Slightly more complex setup

#### Option B: Netlify (FREE)

1. Go to: https://netlify.com
2. Sign up with GitHub
3. Import repository
4. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Add environment variable: `VITE_API_URL`
6. Deploy!

**Pros**: Easy setup, good free tier  
**Cons**: Limited build minutes on free tier

### Backend Alternatives

#### Option A: Railway (FREE - $5 Credit)

1. Go to: https://railway.app
2. Sign up with GitHub
3. Create new project
4. Add PostgreSQL database (free)
5. Deploy from GitHub
6. Configure environment variables

**Pros**: No spin-down, $5 free credit  
**Cons**: Credit expires after use

#### Option B: Fly.io (FREE)

1. Go to: https://fly.io
2. Sign up
3. Install Fly CLI
4. Deploy with: `fly launch`
5. Configure environment variables

**Pros**: Good free tier, no spin-down  
**Cons**: Requires CLI setup

---

## 🔧 Troubleshooting

### Backend Not Starting?

**Issue**: Build fails on Render

**Solution**:
1. Check build logs in Render dashboard
2. Ensure `requirements.txt` is in `backend/` directory
3. Verify Python version (should be 3.10+)

### Database Connection Error?

**Issue**: Cannot connect to Supabase

**Solution**:
1. Check connection string format
2. Verify password is correct
3. Check Supabase project is active
4. Ensure IP is allowed (Supabase allows all by default)

### CORS Errors?

**Issue**: Frontend can't call backend API

**Solution**:
1. Update `CORS_ORIGINS` in Render with your Vercel URL
2. Include both `https://` and `http://` if testing locally
3. Redeploy backend after updating

### Frontend Shows Blank Page?

**Issue**: Frontend loads but shows nothing

**Solution**:
1. Check browser console (F12)
2. Verify `VITE_API_URL` is set correctly
3. Check network tab for API errors
4. Redeploy frontend

### Backend Spins Down?

**Issue**: First request takes 30+ seconds

**Solution**:
- This is normal for Render free tier
- Backend spins down after 15 min inactivity
- First request wakes it up (takes ~30 seconds)
- Consider upgrading to paid plan for always-on

---

## 📊 Free Tier Limits Summary

### Vercel (Frontend)
- ✅ Unlimited requests
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Global CDN

### Render (Backend)
- ⚠️ 750 hours/month (enough for always-on)
- ⚠️ Spins down after 15 min inactivity
- ✅ 512MB RAM
- ✅ Automatic HTTPS

### Supabase (Database)
- ✅ 500MB database storage
- ✅ 2GB bandwidth/month
- ✅ Unlimited API requests
- ✅ Automatic backups

### Upstash (Redis)
- ✅ 10,000 commands/day
- ✅ 256MB storage
- ✅ Already configured

---

## 🎯 Recommended Deployment Order

1. ✅ **Supabase** (Database) - Setup first
2. ✅ **Render** (Backend) - Deploy with database URL
3. ✅ **Vercel** (Frontend) - Deploy with backend URL
4. ✅ **Test** - Verify everything works

---

## 🔐 Security Checklist

- [ ] Use strong `JWT_SECRET_KEY` (32+ characters)
- [ ] Update `CORS_ORIGINS` with your actual domain
- [ ] Use HTTPS (automatic on Vercel/Render)
- [ ] Keep API keys secure (in environment variables)
- [ ] Don't commit `.env` files to GitHub

---

## 📝 Quick Reference

### Your URLs (After Deployment)

- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://your-backend.onrender.com`
- **API Docs**: `https://your-backend.onrender.com/docs`
- **Database**: Supabase Dashboard

### Environment Variables Needed

**Frontend (Vercel)**:
```
VITE_API_URL=https://your-backend.onrender.com
```

**Backend (Render)**:
```
DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres
REDIS_URL=redis://default:token@host:6379
JWT_SECRET_KEY=your-secret-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
ALPHA_VANTAGE_API_KEY=your-key
FINNHUB_API_KEY=your-key
EXCHANGE_RATE_API_KEY=your-key
CORS_ORIGINS=https://your-frontend.vercel.app
```

---

## 🎉 Success!

Once deployed, your application will be:
- ✅ **100% Free** to host
- ✅ **Accessible worldwide**
- ✅ **Production-ready**
- ✅ **Auto-scaling** (within free limits)

**Your app URL**: `https://your-project.vercel.app`

---

## 💡 Tips

1. **Monitor Usage**: Check Render/Supabase dashboards regularly
2. **Backup Database**: Supabase auto-backups, but export important data
3. **Custom Domain**: Vercel allows free custom domains
4. **Upgrade Path**: All services offer paid plans if you need more

---

**Last Updated**: January 2026  
**Status**: ✅ All services offer free tiers
