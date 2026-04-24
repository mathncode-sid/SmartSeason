# Vercel + Render Quick Start

Deploy SmartSeason in 15 minutes using free tiers.

## Step 1: Deploy Frontend to Vercel (5 min)

```bash
# Go to https://vercel.com
# Click "Import Project" → Select SmartSeason GitHub repo
# Settings:
#   - Framework: Create React App
#   - Root: frontend
#   - Build: npm run build
#   - Output: build
# Click Deploy
```

**You'll get a URL like:** `smartseason.vercel.app`

## Step 2: Deploy Backend to Render (10 min)

```bash
# Go to https://render.com
# Click "New Web Service"
# Connect GitHub repo
# Settings:
#   - Name: smartseason-api
#   - Environment: Node
#   - Build Command: npm install && npm install --prefix backend && npm run build --prefix frontend
#   - Start Command: node backend/src/index.js
# Environment Variables:
#   JWT_SECRET = your-random-secret
#   NODE_ENV = production
# Click "Add PostgreSQL" (adds database automatically!)
# Click "Create Web Service"
```

**You'll get a URL like:** `smartseason-api.onrender.com`

## Step 3: Connect Frontend to Backend (2 min)

Go to Vercel dashboard:
1. Click your project
2. Settings → Environment Variables
3. Add:
   ```
   REACT_APP_API_URL=https://smartseason-api.onrender.com/api
   ```
4. Deployments → Redeploy

## Step 4: Seed Database (1 min)

In Render dashboard:
1. Click your service
2. Click "Shell"
3. Run: `npm run seed-db`

## Test It!

Visit: `https://smartseason.vercel.app`

Login: `admin@smartseason.com` / `password123`

**Done!** Your app is live! 🎉

## Useful Links

**Vercel**
- Dashboard: https://vercel.com/dashboard
- Docs: https://vercel.com/docs

**Render**
- Dashboard: https://dashboard.render.com
- Docs: https://render.com/docs

## If Something Goes Wrong

**Frontend won't load:**
- Check Vercel logs: Deployments tab
- Verify build command worked

**Backend won't start:**
- Check Render logs: Logs tab
- Verify Start Command is correct
- Check environment variables are set

**Frontend can't reach backend:**
- Verify REACT_APP_API_URL is correct
- Check backend is actually running
- Wait 30s for cold start

## After Deployment

**Update code:**
```bash
git push origin main
# Both auto-deploy!
```

**Check logs:**
- Vercel: Dashboard → Deployments → Logs
- Render: Dashboard → Logs

**Change environment variables:**
- Vercel: Settings → Environment Variables
- Render: Environment tab

---

**Full detailed guide:** See `VERCEL_RENDER_DEPLOYMENT.md`

**Troubleshooting:** See deployment guide or check logs
