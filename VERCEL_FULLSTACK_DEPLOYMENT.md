# SmartSeason on Vercel - Full-Stack Deployment Guide

Deploy your entire SmartSeason application on Vercel with a single platform.

## Overview

**What You Get:**
- ✅ Frontend deployed globally on Vercel's CDN
- ✅ Backend running as serverless API routes (no cold start penalty)
- ✅ PostgreSQL database included (Vercel Postgres)
- ✅ Single deployment, single dashboard
- ✅ Automatic git deployments
- ✅ No additional platforms needed

**Architecture:**
```
GitHub Repository
       ↓
   Vercel (Everything)
   ├─ /frontend → React app on CDN
   ├─ /api → Serverless functions (backend)
   └─ Vercel Postgres → Database
```

---

## Prerequisites

- GitHub account (repo already pushed)
- Vercel account (free, https://vercel.com)
- Credit card on file (for Vercel Postgres, ~$15/month)

---

## Part 1: Set Up Vercel Postgres Database

### Step 1: Create Vercel Postgres Database

1. Go to https://vercel.com/dashboard
2. Click **Storage** (top menu)
3. Click **Create** → **Postgres**
4. Select **Hobby** plan (free option available)
5. Choose region closest to you
6. Name it: `smartseason-db`
7. Click **Create**

### Step 2: Get Database Connection String

1. Click on your `smartseason-db` database
2. Click **Connect**
3. Copy the `.env.local` code block - paste this in your repo

Your `.env.local` file will look like:
```
POSTGRES_URL_NON_POOLING="postgresql://user:password@host.vercel.postgres.com/smartseason"
```

Save this - you'll need it next.

---

## Part 2: Update Your Repository

### Step 1: Create `vercel.json` Configuration

Create a new file at the root of your repo:

**File: `vercel.json`**
```json
{
  "buildCommand": "npm run build-all",
  "outputDirectory": "frontend/build",
  "env": {
    "NODE_ENV": "production",
    "REACT_APP_API_URL": "@vercel_api_url"
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Step 2: Update Root `package.json`

Add this build script:

**In `package.json`, in the `scripts` section:**
```json
{
  "scripts": {
    "build-all": "npm run build --prefix frontend && npm run build --prefix backend",
    "build": "npm run build --prefix frontend",
    "start": "node backend/src/index.js"
  }
}
```

### Step 3: Convert Backend to API Routes

Vercel expects API routes in `/api/` directory. Here are the steps:

**Create `/api/` directory at root level:**
```
SmartSeason/
├── api/
│   ├── auth.js
│   ├── fields.js
│   ├── updates.js
│   ├── assignments.js
│   ├── dashboard.js
│   └── db.js
├── frontend/
├── backend/
└── vercel.json
```

**Copy your backend routes to `/api/` as serverless functions:**

Each route file becomes a serverless function. For example:

**`/api/auth.js`** (example structure):
```javascript
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from './db.js';

const router = Router();

router.post('/login', async (req, res) => {
  // Your existing login logic
});

export default router;
```

### Step 4: Update Frontend `.env`

**File: `frontend/.env`**
```
REACT_APP_API_URL=
```

(Leave blank - Vercel will auto-fill this)

---

## Part 3: Deploy to Vercel

### Step 1: Push Code to GitHub

```bash
git add .
git commit -m "Setup for Vercel full-stack deployment"
git push origin main
```

### Step 2: Import Project to Vercel

1. Go to https://vercel.com/dashboard
2. Click **Add New → Project**
3. Select your SmartSeason GitHub repo
4. Click **Import**

### Step 3: Configure Environment Variables

On the Vercel import page:

1. **Environment Variables** section
2. Add these variables:
   ```
   JWT_SECRET = your-random-secret-key-here
   NODE_ENV = production
   DATABASE_URL = [your Postgres connection string]
   ```

3. Click **Deploy**

### Step 4: Wait for Build

Vercel will:
- Clone your repo
- Build the frontend
- Set up API routes
- Deploy everything

This takes 2-5 minutes.

---

## Part 4: Initialize Database

### Step 1: Connect to Database

In Vercel dashboard:
1. Go to **Storage** → `smartseason-db`
2. Click **Connect** → **Query**
3. Or use psql command line if you have PostgreSQL installed

### Step 2: Run Database Schema

Copy your schema from `backend/src/database.js` and run it:

```sql
-- Create tables (from your database.js)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'agent',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ... rest of your schema ...
```

### Step 3: Seed Demo Data

Run your seed script with the Vercel database connection:

```bash
DATABASE_URL="[your-vercel-postgres-url]" npm run seed-db
```

---

## Part 5: Test Deployment

### Step 1: Visit Your App

Your Vercel deployment gives you a URL like:
```
https://smartseason-seven.vercel.app
```

### Step 2: Test Core Features

1. **Landing Page** - Should load with no errors
2. **Login** - Use demo credentials:
   - Email: `admin@smartseason.com`
   - Password: `password123`
3. **Admin Dashboard** - Create a field
4. **Agent View** - View assigned fields
5. **Field Updates** - Submit an update

### Step 3: Check Logs

If something fails:
1. Go to **Deployments** in Vercel
2. Click your deployment
3. Click **Logs** to see build/runtime errors

---

## Benefits of Vercel Full-Stack

| Feature | Benefit |
|---------|---------|
| **Single Platform** | One dashboard for everything |
| **No Cold Starts** | API routes optimized (unlike Render) |
| **Global CDN** | Frontend served from edge locations worldwide |
| **Automatic Deployments** | Push to GitHub → Auto-deploys |
| **Built-in Analytics** | See request patterns and performance |
| **Integrated Database** | Postgres included, easy to manage |
| **Simple Scaling** | Everything scales automatically |
| **Free Preview Deployments** | Test changes before merging |

---

## Cost Breakdown

| Component | Cost |
|-----------|------|
| **Vercel Frontend** | Free (with limits) |
| **Vercel API Routes** | Free (1 million invocations/month) |
| **Vercel Postgres** | $15/month (Hobby) or $29/month (Pro) |
| **Total** | ~$15-29/month |

**Free tier available for learning/testing**

---

## Troubleshooting

### "Cannot find module" errors
- Make sure all imports use correct relative paths
- Vercel uses strict module resolution

### "Database connection failed"
- Verify DATABASE_URL is set in Environment Variables
- Check connection string format
- Make sure you've run the schema migrations

### "API route not found"
- Check `/api/` folder structure
- Verify file exports default function
- Check request URL matches route

### "Frontend won't load"
- Check REACT_APP_API_URL is correct
- Look at Vercel logs for build errors
- Verify all dependencies installed

### "CORS errors when calling API"
- Add CORS middleware to your API routes
- Check request origin matches Vercel domain
- Set proper headers in serverless functions

---

## Differences from Local Development

| Local | Vercel |
|-------|--------|
| `localhost:5000` | `https://yourapp.vercel.app` |
| `.env` file | Environment Variables in dashboard |
| `npm start` | Automatic on deploy |
| Reload to test | Every commit auto-deploys |
| SQLite database | Postgres database |

---

## Next Steps

1. **Update your codebase** (see Part 2)
2. **Push to GitHub** (see Part 3)
3. **Deploy to Vercel** (see Part 3)
4. **Set up database** (see Part 4)
5. **Test your app** (see Part 5)

---

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Vercel Postgres**: https://vercel.com/docs/storage/vercel-postgres
- **API Routes**: https://vercel.com/docs/concepts/functions/serverless-functions
- **Environment Variables**: https://vercel.com/docs/concepts/projects/environment-variables

---

## Important Notes

- **Database**: Vercel Postgres requires a paid plan (starts at $15/month)
- **API Routes**: Serverless functions have execution time limits (10 seconds on free tier)
- **Storage**: No persistent file storage on API routes (use Vercel Blob Storage if needed)
- **Preview Deployments**: Every GitHub push creates a preview URL before merging to main

---

**Ready to go full-stack with Vercel?** Start with Part 1 and follow the steps sequentially! 🚀
