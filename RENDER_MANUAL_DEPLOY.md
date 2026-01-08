# 🚀 Render Manual Deployment (Without GitHub)

If your GitHub account is flagged, you can still deploy to Render manually.

## Method 1: Use Render CLI

### Step 1: Install Render CLI

```bash
# Windows (PowerShell)
iwr https://render.com/install -useb | iex

# Or download from: https://render.com/docs/cli
```

### Step 2: Login to Render

```bash
render login
```

### Step 3: Create Service

```bash
cd backend
render services:create \
  --name stockpredict-backend \
  --type web \
  --region oregon \
  --build-command "pip install -r requirements.txt" \
  --start-command "uvicorn app.main:app --host 0.0.0.0 --port $PORT" \
  --plan free
```

### Step 4: Set Environment Variables

```bash
render env:set DATABASE_URL="your-database-url"
render env:set REDIS_URL="your-redis-url"
# ... add all other variables
```

---

## Method 2: Use GitLab or Bitbucket

### Option A: GitLab (Free)

1. Create account: https://gitlab.com
2. Create new project
3. Push your code:
   ```bash
   git remote add gitlab https://gitlab.com/yourusername/stockpredict002.git
   git push gitlab main
   ```
4. Connect GitLab to Render (Render supports GitLab)

### Option B: Bitbucket (Free)

1. Create account: https://bitbucket.org
2. Create repository
3. Push code
4. Connect to Render

---

## Method 3: Use Alternative Hosting

### Railway (Alternative to Render)

1. Go to: https://railway.app
2. Sign up with email (no GitHub needed)
3. Deploy from local folder or GitLab/Bitbucket
4. Free tier: $5 credit

### Fly.io (Alternative)

1. Go to: https://fly.io
2. Sign up with email
3. Use CLI to deploy
4. Free tier available

---

## Method 4: Temporary Workaround

### Use Different GitHub Account

1. Create new GitHub account with different email
2. Push code to new account
3. Connect to Render
4. Transfer ownership later when main account is restored

---

## Recommended: Contact GitHub Support

The best solution is to resolve the flagged account:

1. **Email**: support@github.com
2. **Support Form**: https://support.github.com/contact
3. **Explain**: Legitimate project, educational use
4. **Provide**: Account details, project description

---

**Note**: Most hosting services require Git repository access. If GitHub is blocked, GitLab or Bitbucket are good alternatives.
