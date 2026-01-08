# 🚀 Render Deployment Guide - Step by Step

Complete step-by-step guide to deploy your backend on Render (100% FREE).

---

## 📋 Prerequisites

Before starting, make sure you have:

- ✅ GitHub account (or GitLab/Bitbucket as alternative)
- ✅ Your project pushed to GitHub: `https://github.com/aakash688/stockpredict002`
- ✅ Supabase account (for database) - [See Supabase Setup](#supabase-setup)
- ✅ Upstash Redis URL (already have it)

**⚠️ GitHub Account Flagged?** See [RENDER_MANUAL_DEPLOY.md](RENDER_MANUAL_DEPLOY.md) for alternatives.

---

## 🗄️ Step 1: Setup Supabase Database (If Not Done)

### 1.1 Create Supabase Account

1. Go to: https://supabase.com
2. Click **"Start your project"**
3. Sign up with GitHub or Email
4. Verify your email

### 1.2 Create New Project

1. Click **"New Project"**
2. Fill in:
   - **Name**: `stockpredict-db`
   - **Database Password**: Create a strong password (SAVE IT!)
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free
3. Click **"Create new project"**
4. Wait 2-3 minutes for setup

### 1.3 Get Connection String

1. Go to **Settings** → **Database**
2. Scroll to **"Connection string"**
3. Click **"URI"** tab
4. Copy the connection string
5. It looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
6. **Replace `[YOUR-PASSWORD]`** with your actual database password
7. **SAVE THIS** - you'll need it for Render

**✅ Database ready!**

---

## 🐍 Step 2: Create Render Account

### 2.1 Sign Up

1. Go to: https://render.com
2. Click **"Get Started for Free"**
3. Click **"Sign up with GitHub"** (recommended)
4. Authorize Render to access your repositories
5. Verify your email if prompted

**✅ Render account created!**

---

## 🚀 Step 3: Create Web Service on Render

### 3.1 Start New Service

1. In Render dashboard, click **"New +"** button (top right)
2. Select **"Web Service"**

### 3.2 Connect GitHub Repository

1. You'll see **"Connect a repository"** section
2. If your repo is listed:
   - Click on **`aakash688/stockpredict002`**
3. If not listed:
   - Click **"Configure account"**
   - Select repositories to give access
   - Find and select **`aakash688/stockpredict002`**
   - Click **"Connect"**

**✅ Repository connected!**

---

## ⚙️ Step 4: Configure Service Settings

### 4.1 Basic Settings

Fill in these fields:

- **Name**: `stockpredict-backend` (or any name you like)
- **Region**: Choose closest to you:
  - `Oregon (US West)` - Good for US
  - `Frankfurt (EU)` - Good for Europe
  - `Singapore (Asia)` - Good for Asia
- **Branch**: `main` (or `master` if that's your branch)
- **Root Directory**: `backend` ⚠️ **IMPORTANT!**

### 4.2 Build & Start Commands

**Build Command:**
```
pip install -r requirements.txt
```

**Start Command:**
```
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

⚠️ **Important**: Render automatically sets `$PORT` environment variable

### 4.3 Plan Selection

- Select **"Free"** plan
- This gives you:
  - 750 hours/month (enough for always-on)
  - 512MB RAM
  - Spins down after 15 min inactivity

**✅ Basic configuration done!**

---

## 🔐 Step 5: Add Environment Variables

### 5.1 Open Environment Section

1. Scroll down to **"Environment Variables"** section
2. Click **"Add Environment Variable"** for each one

### 5.2 Add Each Variable

Add these one by one:

#### 1. Database URL
- **Key**: `DATABASE_URL`
- **Value**: Your Supabase connection string
  ```
  postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres
  ```
- Click **"Add"**

#### 2. Redis URL
- **Key**: `REDIS_URL`
- **Value**: Your Upstash Redis URL
  ```
  redis://default:AV6bAAIncDI2NGE0Yzk1ZWFiMmE0NzY4YmNlYWI1N2Q3ZTYwZGZhNHAyMjQyMTk@lucky-gator-24219.upstash.io:6379
  ```
- Click **"Add"**

#### 3. JWT Secret Key
- **Key**: `JWT_SECRET_KEY`
- **Value**: Generate a random string
  - Run this locally: `python -c "import secrets; print(secrets.token_urlsafe(32))"`
  - Or use: Any random 32+ character string
- Click **"Add"**

#### 4. JWT Algorithm
- **Key**: `JWT_ALGORITHM`
- **Value**: `HS256`
- Click **"Add"**

#### 5. Token Expiry
- **Key**: `ACCESS_TOKEN_EXPIRE_MINUTES`
- **Value**: `1440` (24 hours)
- Click **"Add"**

#### 6. Alpha Vantage API Key
- **Key**: `ALPHA_VANTAGE_API_KEY`
- **Value**: `7U9BJM0SLP5IT8J4`
- Click **"Add"**

#### 7. Finnhub API Key
- **Key**: `FINNHUB_API_KEY`
- **Value**: `d5dvikhr01qqgu50ldagd5dvikhr01qqgu50ldb0`
- Click **"Add"**

#### 8. Exchange Rate API Key
- **Key**: `EXCHANGE_RATE_API_KEY`
- **Value**: `530fdd86dc2ca16c6cc7dfa6`
- Click **"Add"**

#### 9. CORS Origins
- **Key**: `CORS_ORIGINS`
- **Value**: Your frontend URL (we'll update this after deploying frontend)
  - For now, use: `http://localhost:5173,https://your-frontend.vercel.app`
  - Replace `your-frontend.vercel.app` with your actual Vercel URL later
- Click **"Add"**

### 5.3 Verify All Variables

You should have **9 environment variables**:
- ✅ DATABASE_URL
- ✅ REDIS_URL
- ✅ JWT_SECRET_KEY
- ✅ JWT_ALGORITHM
- ✅ ACCESS_TOKEN_EXPIRE_MINUTES
- ✅ ALPHA_VANTAGE_API_KEY
- ✅ FINNHUB_API_KEY
- ✅ EXCHANGE_RATE_API_KEY
- ✅ CORS_ORIGINS

**✅ Environment variables configured!**

---

## 🚀 Step 6: Deploy the Service

### 6.1 Create and Deploy

1. Scroll to the bottom
2. Click **"Create Web Service"**
3. Render will start building your service
4. You'll see build logs in real-time

### 6.2 Monitor Deployment

Watch the build process:
- **Building**: Installing dependencies
- **Starting**: Starting the application
- **Live**: Service is running! ✅

**Expected build time**: 5-10 minutes for first deployment

### 6.3 Check Build Logs

If there are errors:
1. Click on the deployment
2. Check **"Logs"** tab
3. Look for error messages
4. Common issues:
   - Missing dependencies → Check `requirements.txt`
   - Database connection error → Check `DATABASE_URL`
   - Port error → Make sure start command uses `$PORT`

**✅ Backend deployed!**

---

## 🔗 Step 7: Get Your Backend URL

### 7.1 Find Your URL

1. Once deployed, you'll see your service dashboard
2. At the top, you'll see your service URL:
   ```
   https://stockpredict-backend.onrender.com
   ```
   (Your URL will be different)

3. **Copy this URL** - you'll need it for frontend

### 7.2 Test Your Backend

1. Open: `https://your-backend.onrender.com/docs`
2. ✅ You should see Swagger API documentation
3. ✅ This confirms backend is working!

**✅ Backend URL ready!**

---

## 🔄 Step 8: Update CORS Origins

### 8.1 Update Environment Variable

1. Go back to Render dashboard
2. Click on your service
3. Go to **"Environment"** tab
4. Find `CORS_ORIGINS` variable
5. Click **"Edit"**
6. Update value with your frontend URL:
   ```
   https://your-frontend.vercel.app,http://localhost:5173
   ```
7. Click **"Save Changes"**
8. Render will automatically redeploy

**✅ CORS updated!**

---

## ✅ Step 9: Verify Everything Works

### 9.1 Test API Endpoints

1. Go to: `https://your-backend.onrender.com/docs`
2. Try the `/health` endpoint
3. Try `/stocks/search?q=AAPL` (public endpoint)
4. ✅ Should return data

### 9.2 Check Database Connection

1. Go to Supabase dashboard
2. Go to **"Table Editor"**
3. ✅ You should see tables created:
   - `users`
   - `watchlist`
   - `portfolio`
   - `predictions`

**✅ Everything working!**

---

## 🐛 Troubleshooting

### Issue: Build Fails

**Error**: `ModuleNotFoundError` or `pip install` fails

**Solution**:
1. Check `backend/requirements.txt` exists
2. Verify all dependencies are listed
3. Check build logs for specific error

### Issue: Service Won't Start

**Error**: `Application failed to respond`

**Solution**:
1. Check start command uses `$PORT`
2. Verify `uvicorn` is in requirements.txt
3. Check logs for Python errors

### Issue: Database Connection Error

**Error**: `Connection refused` or `Authentication failed`

**Solution**:
1. Verify `DATABASE_URL` is correct
2. Check password in connection string
3. Ensure Supabase project is active
4. Check IP restrictions in Supabase (should allow all)

### Issue: CORS Errors

**Error**: `CORS policy: No 'Access-Control-Allow-Origin'`

**Solution**:
1. Update `CORS_ORIGINS` with exact frontend URL
2. Include `https://` prefix
3. Redeploy after updating

### Issue: Service Spins Down

**Symptom**: First request takes 30+ seconds

**Solution**:
- This is normal for free tier
- Service spins down after 15 min inactivity
- First request wakes it up (~30 seconds)
- Consider upgrading for always-on

---

## 📊 Render Dashboard Overview

### Service Dashboard Shows:

- **Status**: Live, Building, or Error
- **URL**: Your backend API URL
- **Logs**: Real-time application logs
- **Metrics**: CPU, Memory usage
- **Events**: Deployment history
- **Settings**: Configuration options

### Useful Tabs:

- **Logs**: View application output
- **Metrics**: Monitor performance
- **Environment**: Manage environment variables
- **Settings**: Change configuration
- **Events**: See deployment history

---

## 🔄 Updating Your Backend

### Automatic Deployments

Render automatically deploys when you:
- Push to `main` branch
- Merge pull requests

### Manual Deploy

1. Go to service dashboard
2. Click **"Manual Deploy"**
3. Select branch
4. Click **"Deploy"**

### Rollback

1. Go to **"Events"** tab
2. Find previous successful deployment
3. Click **"Redeploy"**

---

## 💰 Free Tier Limits

### What You Get (FREE):

- ✅ 750 hours/month (enough for always-on)
- ✅ 512MB RAM
- ✅ Automatic HTTPS
- ✅ Custom domain support
- ✅ Auto-deploy from GitHub

### Limitations:

- ⚠️ Spins down after 15 min inactivity
- ⚠️ 512MB RAM limit
- ⚠️ No persistent storage (use database)

### When to Upgrade:

- Need always-on (no spin-down)
- Need more RAM
- Need persistent storage
- High traffic

---

## 🎯 Quick Reference

### Your Backend URL:
```
https://your-backend.onrender.com
```

### API Documentation:
```
https://your-backend.onrender.com/docs
```

### Health Check:
```
https://your-backend.onrender.com/health
```

### Environment Variables Needed:
- `DATABASE_URL` - Supabase PostgreSQL
- `REDIS_URL` - Upstash Redis
- `JWT_SECRET_KEY` - Random 32+ char string
- `JWT_ALGORITHM` - `HS256`
- `ACCESS_TOKEN_EXPIRE_MINUTES` - `1440`
- `ALPHA_VANTAGE_API_KEY` - Your API key
- `FINNHUB_API_KEY` - Your API key
- `EXCHANGE_RATE_API_KEY` - Your API key
- `CORS_ORIGINS` - Frontend URL(s)

---

## ✅ Success Checklist

- [ ] Render account created
- [ ] GitHub repository connected
- [ ] Web service created
- [ ] Root directory set to `backend`
- [ ] Build command: `pip install -r requirements.txt`
- [ ] Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- [ ] All 9 environment variables added
- [ ] Service deployed successfully
- [ ] Backend URL obtained
- [ ] API docs accessible at `/docs`
- [ ] Database tables created
- [ ] CORS origins updated

---

## 🎉 Next Steps

After backend is deployed:

1. ✅ **Deploy Frontend** on Vercel (see FREE_HOSTING_GUIDE.md)
2. ✅ **Update Frontend** with backend URL
3. ✅ **Test Full Application**
4. ✅ **Update CORS** with frontend URL

---

**Your backend is now live and ready! 🚀**

**Backend URL**: `https://your-backend.onrender.com`  
**API Docs**: `https://your-backend.onrender.com/docs`

---

**Last Updated**: January 2026  
**Status**: ✅ Free tier available
