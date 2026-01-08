# Production Deployment Guide

## Prerequisites

- Node.js 18+ and npm
- Python 3.14+ (for backend)
- PostgreSQL or SQLite (for database)
- Redis (optional, for caching)

## Frontend Production Build

### 1. Environment Variables

Create a `.env.production` file in the `frontend` directory:

```env
VITE_API_URL=https://api.yourdomain.com
VITE_ENV=production
```

### 2. Build the Application

```bash
cd frontend
npm install
npm run build:prod
```

This will create an optimized production build in the `frontend/dist` directory.

### 3. Preview Production Build (Optional)

```bash
npm run preview:prod
```

### 4. Deploy Frontend

#### Option A: Static Hosting (Vercel, Netlify, GitHub Pages)

1. Connect your repository to the hosting service
2. Set build command: `npm run build:prod`
3. Set output directory: `dist`
4. Add environment variable: `VITE_API_URL` with your backend URL

#### Option B: Nginx

1. Copy `dist` folder to your server
2. Configure Nginx:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Option C: Docker

Create `frontend/Dockerfile`:

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build:prod

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Backend Production Setup

### 1. Environment Variables

Create a `.env` file in the `backend` directory:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/stockpredict
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REDIS_URL=redis://localhost:6379
ALPHA_VANTAGE_API_KEY=your-api-key
EXCHANGE_RATE_API_KEY=your-api-key
```

### 2. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 3. Database Setup

```bash
# For PostgreSQL
createdb stockpredict
python -m app.db.init_db

# For SQLite (development only)
python -m app.db.init_db
```

### 4. Run with Production Server

```bash
# Using Gunicorn (recommended)
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000

# Or using Uvicorn directly
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### 5. Docker Deployment

Create `backend/Dockerfile`:

```dockerfile
FROM python:3.14-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["gunicorn", "app.main:app", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "-b", "0.0.0.0:8000"]
```

## Pre-Deployment Checklist

### Environment Variables

**Frontend** (`frontend/.env.production`):
```env
VITE_API_URL=https://api.yourdomain.com
VITE_ENV=production
```

**Backend** (`backend/.env`):
```env
DATABASE_URL=postgresql://user:pass@host:5432/dbname
JWT_SECRET_KEY=<generate-strong-random-key>
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
ALPHA_VANTAGE_API_KEY=your-key
EXCHANGE_RATE_API_KEY=your-key
REDIS_URL=redis://host:6379/0
```

### Security Checklist

- [ ] Generate strong `JWT_SECRET_KEY`:
  ```python
  import secrets
  print(secrets.token_urlsafe(32))
  ```
- [ ] Update CORS origins to production domains only
- [ ] Enable HTTPS (SSL/TLS certificates)
- [ ] Review and update all API keys
- [ ] Remove any hardcoded secrets
- [ ] Set up rate limiting
- [ ] Configure firewall rules
- [ ] Use HTTPS in production
- [ ] Use environment variables for all secrets
- [ ] Remove debug mode
- [ ] Set up proper logging

### Database

- [ ] Use PostgreSQL (not SQLite) for production
- [ ] Set up database backups
- [ ] Configure connection pooling
- [ ] Run migrations
- [ ] Test database connectivity

### Testing

- [ ] Test all authentication flows
- [ ] Test stock search and data fetching
- [ ] Test predictions
- [ ] Test watchlist and portfolio features
- [ ] Load testing (optional but recommended)
- [ ] Cross-browser testing

### Post-Deployment

- [ ] Verify all endpoints are working
- [ ] Check error logs
- [ ] Monitor performance metrics
- [ ] Test user registration/login
- [ ] Verify email functionality (if implemented)
- [ ] Check API rate limits
- [ ] Monitor database performance

## Performance Optimization

### Frontend
- ✅ Code splitting (already configured)
- ✅ Tree shaking (enabled by default)
- ✅ Minification (enabled in production)
- ✅ Asset compression (configure in server)
- ✅ CDN for static assets (optional)

### Backend
- ✅ Use connection pooling for database
- ✅ Enable Redis caching
- ✅ Use async/await for I/O operations
- ✅ Implement rate limiting
- ✅ Use production WSGI server (Gunicorn)

## Monitoring

### Recommended Tools
- **Error Tracking**: Sentry, LogRocket
- **Analytics**: Google Analytics, Plausible
- **Uptime Monitoring**: UptimeRobot, Pingdom
- **Performance**: New Relic, Datadog

### Logging

Set up structured logging:

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
```

## CI/CD Pipeline

Example GitHub Actions workflow (`.github/workflows/deploy.yml`):

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd frontend && npm ci && npm run build:prod
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.14'
      - run: cd backend && pip install -r requirements.txt
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /path/to/app
            git pull
            pip install -r requirements.txt
            systemctl restart stockpredict
```

## Troubleshooting

### Frontend Issues
- **Blank page**: Check browser console, verify API URL
- **Build errors**: Check Node version, clear node_modules
- **Slow loading**: Enable compression, use CDN

### Backend Issues
- **Database errors**: Check connection string, verify database exists
- **CORS errors**: Update CORS settings in `main.py`
- **Rate limiting**: Check API keys, implement backoff

## Support

For issues or questions, please check:
1. Application logs
2. Browser console (F12)
3. Server logs
4. Error tracking service (if configured)

