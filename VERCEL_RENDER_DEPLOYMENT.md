# SmartSeason on Vercel + Render Deployment

Deploy SmartSeason using **Vercel for frontend** and **Render for backend** - both free tier available!

## Architecture Overview

```
┌──────────────────────┐         ┌──────────────────────┐
│   Vercel (Frontend)  │         │  Render (Backend)    │
├──────────────────────┤         ├──────────────────────┤
│                      │         │                      │
│  React App           │  HTTP   │  Express API         │
│  (Static Build)      │◄────────│  Node.js Server      │
│  CSS/JS/Images       │         │  Port handling       │
│                      │         │                      │
└──────────────────────┘         └──────────────────────┘
                                           │
                                           │
                                  ┌────────▼──────────┐
                                  │ Render PostgreSQL  │
                                  │ Database           │
                                  └────────────────────┘
```

## Prerequisites

- Vercel account: https://vercel.com (sign up with GitHub)
- Render account: https://render.com (sign up with GitHub)
- GitHub account with SmartSeason repository
- Git configured

## Part 1: Deploy Frontend to Vercel (5 minutes)

### Step 1: Connect GitHub to Vercel

1. Go to https://vercel.com
2. Click "Import Project"
3. Select "Import Git Repository"
4. Authorize Vercel to access your GitHub repos
5. Select your SmartSeason repository

### Step 2: Configure Vercel Project

1. **Framework Preset**: Select "Create React App"
2. **Root Directory**: Set to `frontend`
3. **Build Command**: `npm run build`
4. **Output Directory**: `build`
5. **Environment Variables**: Add
   ```
   REACT_APP_API_URL=https://your-render-api-url.onrender.com/api
   ```
   (You'll get the Render URL in Part 2)

### Step 3: Deploy

Click "Deploy" and Vercel will:
1. Build React app
2. Optimize assets
3. Deploy to global CDN
4. Give you a URL (e.g., `smartseason.vercel.app`)

**Your frontend is now live!**

## Part 2: Deploy Backend to Render (10 minutes)

### Step 1: Create New Service on Render

1. Go to https://render.com
2. Click "New +"
3. Select "Web Service"
4. Select "Deploy an existing repository"
5. Choose your SmartSeason repo
6. Click "Connect"

### Step 2: Configure Service

Fill in the settings:

**Basic Settings:**
- **Name**: `smartseason-api`
- **Environment**: `Node`
- **Region**: Choose closest to users (e.g., US)
- **Branch**: `main` (or your default)

**Build Settings:**
- **Build Command**: 
  ```
  npm install && npm install --prefix backend && npm run build --prefix frontend
  ```
- **Start Command**: 
  ```
  node backend/src/index.js
  ```

### Step 3: Add Environment Variables

Click "Add Environment Variable" for each:

```
JWT_SECRET = your-random-secret-key-here
NODE_ENV = production
DATABASE_URL = (Leave empty, will be set below)
```

### Step 4: Add PostgreSQL Database

In the same Render project:

1. Click "Add PostgreSQL"
2. Name it: `smartseason-db`
3. Render automatically sets `DATABASE_URL` env var
4. Database is automatically connected!

### Step 5: Deploy

Click "Create Web Service"

Render will:
1. Build your app
2. Create PostgreSQL database
3. Set DATABASE_URL environment variable
4. Start the server
5. Give you a URL (e.g., `smartseason-api.onrender.com`)

**Your backend is now live!**

## Part 3: Connect Frontend to Backend

### Update Vercel Environment Variable

1. Go to your Vercel project settings
2. Find "Environment Variables"
3. Set:
   ```
   REACT_APP_API_URL=https://your-render-api-url.onrender.com/api
   ```
4. Redeploy (push a commit or click "Redeploy")

### Verify Connection

Frontend should now call: `https://smartseason-api.onrender.com/api`

## Part 4: Initialize Database

### Seed Demo Users

Option 1 - Via Render shell:
```bash
# On Render dashboard, click your service
# Click "Shell" tab
# Run:
npm run seed-db
```

Option 2 - Via curl (if available):
```bash
curl -X POST https://your-render-api-url.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@smartseason.com",
    "password": "password123",
    "firstName": "Admin",
    "lastName": "User",
    "role": "admin"
  }'
```

## Testing Your Deployment

### Test Frontend
1. Visit your Vercel URL
2. Should see landing page with professional design
3. All links should work

### Test Backend API
```bash
curl https://your-render-api-url.onrender.com/api/health
# Should return: {"status":"ok"}
```

### Test Full Workflow
1. Click "Sign In" on landing page
2. Login as: admin@smartseason.com / password123
3. Create a field
4. View fields list
5. Data should persist

## Important Notes

### Vercel
- **Strengths**: Fast, free tier generous, automatic deployments
- **Limitations**: Frontend only, can't run backend
- **Auto-deployment**: Deploys on every git push to main

### Render
- **Strengths**: Good for Node.js, includes PostgreSQL, free tier with limits
- **Limitations**: Free tier spins down after 15 min inactivity (might take 30s to wake)
- **Auto-deployment**: Deplooys on every git push to main
- **Database**: Included PostgreSQL (no additional cost on free tier)

### Cold Starts
Render's free tier will spin down after inactivity. First request might take 30 seconds. This is normal for free tiers.

To avoid cold starts, upgrade Render to paid tier ($7/month).

## Cost Analysis

| Service | Free Tier | Paid Tier | Details |
|---------|-----------|-----------|---------|
| **Vercel** | Unlimited | $20/month | Unlimited bandwidth, 12 deployments/day |
| **Render** | Limited | $7/month | Includes 0.5 CPU, 512MB RAM, PostgreSQL |
| **Total** | Free | $27/month | Production-ready setup |

**With both free tiers**: Fully functional app with limitations (cold starts, limited database)

## Updating Your Code

After changes:

### Frontend (Vercel)
```bash
git add frontend/
git commit -m "Frontend changes"
git push origin main
# Vercel auto-deploys!
```

### Backend (Render)
```bash
git add backend/
git commit -m "Backend changes"
git push origin main
# Render auto-deploys!
```

## Environment Variables Recap

**On Vercel Dashboard:**
```
REACT_APP_API_URL=https://your-render-url.onrender.com/api
```

**On Render Dashboard:**
```
JWT_SECRET=your-secret
NODE_ENV=production
DATABASE_URL=auto-set-by-render
```

## Monitoring

### Vercel Logs
- Dashboard → Deployments → Click deployment → Logs

### Render Logs
- Dashboard → Logs tab (real-time)

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Frontend can't reach API | Check REACT_APP_API_URL is set correctly |
| 502 Bad Gateway | Backend might be starting, wait 30s and retry |
| Database error | Check DATABASE_URL is set in Render env vars |
| Login fails | Verify JWT_SECRET matches between code and env |
| Frontend shows 404 | Ensure frontend build directory is correct |

## Database Connection Issues

If Render can't connect to database:

1. Check DATABASE_URL is set: Render dashboard → Environment
2. Verify PostgreSQL service is running
3. Try resetting database through Render UI
4. Check Render logs for connection errors

## Next Steps

1. Deploy frontend to Vercel (5 min)
2. Deploy backend to Render (10 min)
3. Connect them (update REACT_APP_API_URL)
4. Seed database
5. Test thoroughly
6. Monitor logs for issues

## Quick Commands

```bash
# Test API is running
curl https://your-render-url.onrender.com/api/health

# View Render logs
# In Render dashboard → Logs tab

# Redeploy on Vercel
# Push a commit or manual redeploy in dashboard

# Check environment variables
# Vercel: Dashboard → Settings → Environment Variables
# Render: Dashboard → Environment
```

## References

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **GitHub Integration**: Both services auto-deploy on push

---

**Ready to deploy?** Follow the steps above, or see `VERCEL_RENDER_QUICK_START.md` for a condensed version.
