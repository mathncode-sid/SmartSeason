# SmartSeason on Vercel + Turso - Full-Stack Deployment Guide

Deploy your entire SmartSeason application on Vercel with Turso as your database.

## Overview

**What You Get:**
- ✅ Frontend deployed globally on Vercel's CDN
- ✅ Backend running as serverless API routes (no cold start penalty)
- ✅ SQLite database hosted on Turso (same format as your local database!)
- ✅ Single deployment, single dashboard
- ✅ Automatic git deployments
- ✅ No code changes needed - SQLite code works as-is

**Architecture:**
```
GitHub Repository
       ↓
   Vercel (Everything)
   ├─ /frontend → React app on CDN
   ├─ /api → Serverless functions (backend)
   └─ Turso SQLite → Database (libsql)
```

---

## Prerequisites

- GitHub account (repo already pushed)
- Vercel account (free, https://vercel.com)
- Turso account (free, https://turso.tech)
- Turso CLI installed (`npm install -g @tursodatabase/cli`)

---

## Part 1: Set Up Turso SQLite Database

### Step 1: Create Turso Account & Database

1. Go to https://turso.tech
2. Sign up (GitHub login recommended)
3. In the dashboard, click **Create a database**
4. Name it: `smartseason`
5. Choose region closest to you
6. Click **Create**

### Step 2: Get Database Connection String

1. Click on your `smartseason` database
2. Click **Connect**
3. Copy the **Connection URL** (looks like: `libsql://smartseason-xxx.turso.io?authToken=...`)
4. Also copy the **Auth Token**

Your `.env` file will use:
```
DATABASE_URL="libsql://smartseason-xxx.turso.io?authToken=your-auth-token"
```

Save both - you'll need them next.

### Step 3: Install Turso CLI (Optional but Recommended)

```bash
npm install -g @tursodatabase/cli
```

This lets you manage your database from the command line.

---

## Part 2: Update Your Repository

### Step 4: Install Turso Node Package

Your backend already uses SQLite, but for Vercel serverless functions, we need to add turso support:

```bash
npm install @libsql/client
```

Or in the backend directory:
```bash
cd backend
npm install @libsql/client
cd ..
```

### Step 2: Create `.env.local` File

In your root directory, create `.env.local` with your Turso credentials:

**File: `.env.local`**
```
DATABASE_URL="libsql://smartseason-xxx.turso.io?authToken=your-auth-token"
JWT_SECRET=your-random-secret-key-here
NODE_ENV=development
```

(Don't commit this file - it's in .gitignore)

### Step 3: Create `vercel.json` Configuration

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

### Step 5: Update Root `package.json`

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

### Step 6: Update Backend Database Code (if needed)

Your current `backend/src/database.js` uses SQLite locally. When deploying to Vercel:

**Option A: Keep SQLite locally, use Turso in production**
- Local: Keep `backend/smartseason.db` (SQLite file)
- Production: Turso handles the database
- Your code works the same way

**Option B: Use Turso everywhere (recommended)**
- Update `DATABASE_URL` to point to Turso
- Install `@libsql/client`
- Code stays mostly the same

For now, keep your current code as-is. It will work with Turso.

### Step 7: Update Frontend `.env`

**File: `frontend/.env`**
```
REACT_APP_API_URL=
```

(Leave blank - Vercel will auto-fill this)

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
   DATABASE_URL = libsql://smartseason-xxx.turso.io?authToken=your-auth-token
   JWT_SECRET = your-random-secret-key-here
   NODE_ENV = production
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

## Part 4: Initialize Turso Database

### Step 1: Create Database Schema

Your database is empty. Use the Turso CLI to run your schema:

**Option A: Using Turso CLI (Recommended)**

```bash
# Install Turso CLI if you haven't
npm install -g @tursodatabase/cli

# Login
turso auth login

# Open the Turso shell for your database
turso db shell smartseason
```

Then copy-paste your schema from `backend/src/database.js` (the CREATE TABLE statements).

**Option B: Using Turso Dashboard**

1. Go to https://turso.tech/app
2. Click your `smartseason` database
3. Click **Shell**
4. Paste your SQL schema

### Step 2: SQL Schema for Turso

Copy-paste this into your Turso shell:

```sql
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'agent',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Fields table
CREATE TABLE IF NOT EXISTS fields (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  crop_type TEXT NOT NULL,
  planting_date DATE NOT NULL,
  current_stage TEXT DEFAULT 'Planted',
  status TEXT DEFAULT 'Active',
  created_by INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Field assignments
CREATE TABLE IF NOT EXISTS field_assignments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  field_id INTEGER NOT NULL,
  agent_id INTEGER NOT NULL,
  assigned_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE CASCADE,
  FOREIGN KEY (agent_id) REFERENCES users(id),
  UNIQUE(field_id, agent_id)
);

-- Field updates/notes
CREATE TABLE IF NOT EXISTS field_updates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  field_id INTEGER NOT NULL,
  agent_id INTEGER NOT NULL,
  stage TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE CASCADE,
  FOREIGN KEY (agent_id) REFERENCES users(id)
);
```

### Step 3: Seed Demo Data

Insert demo users:

```sql
INSERT INTO users (email, password, first_name, last_name, role) VALUES
('admin@smartseason.com', '$2a$10$c4Ui7JvLlmHlzQDexhXnNeW0QHqEyVMmH5V3zKl8bGZGi7UZHYEfC', 'Admin', 'User', 'admin'),
('agent@smartseason.com', '$2a$10$c4Ui7JvLlmHlzQDexhXnNeW0QHqEyVMmH5V3zKl8bGZGi7UZHYEfC', 'Field', 'Agent', 'agent');
```

These are demo accounts:
- **Admin Email:** admin@smartseason.com
- **Agent Email:** agent@smartseason.com
- **Password:** password123

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

## Benefits of Vercel + Turso

| Feature | Benefit |
|---------|--------|
| **Single Platform Frontend** | One dashboard for Vercel |
| **SQLite Database** | Same format as your local dev |
| **No Cold Starts** | API routes optimized |
| **Global CDN** | Frontend served from edge locations worldwide |
| **Automatic Deployments** | Push to GitHub → Auto-deploys |
| **Integrated Database** | Turso SQLite, managed easily |
| **Simple Scaling** | Everything scales automatically |
| **Free Preview Deployments** | Test changes before merging |

---

## Cost Breakdown

| Component | Cost |
|-----------|------|
| **Vercel Frontend** | Free (with limits) |
| **Vercel API Routes** | Free (1 million invocations/month) |
| **Turso SQLite** | Free tier available, $29/month for Scaler |
| **Total** | **Free to $29/month** |

**Free tier covers:**
- Vercel: Unlimited deployments, 100GB bandwidth/month
- Turso: Up to 10GB storage, 1 million API requests/month

Perfect for SmartSeason!

---

## Troubleshooting

### "Cannot find module" errors
- Make sure all imports use correct relative paths
- Vercel uses strict module resolution

### "Database connection failed"
- Verify DATABASE_URL is set in Vercel Environment Variables
- Check connection string format: `libsql://yourdb.turso.io?authToken=...`
- Make sure you've run the schema in Turso
- Test locally: `turso db shell smartseason`

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

| Local | Vercel + Turso |
|-------|--------|
| `localhost:5000` | `https://yourapp.vercel.app` |
| `.env` file | Environment Variables in Vercel dashboard |
| `npm start` | Automatic on deploy |
| Reload to test | Every commit auto-deploys |
| SQLite database (`smartseason.db`) | Turso SQLite database |

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
- **Turso Docs**: https://docs.turso.tech
- **Turso CLI Guide**: https://docs.turso.tech/cli
- **API Routes**: https://vercel.com/docs/concepts/functions/serverless-functions
- **Environment Variables**: https://vercel.com/docs/concepts/projects/environment-variables

---

## Important Notes

- **Database**: Turso offers a free tier! Free tier covers 10GB storage and 1M API requests/month
- **API Routes**: Serverless functions have execution time limits (10 seconds on free tier)
- **Storage**: No persistent file storage on API routes (use Vercel Blob Storage if needed)
- **SQLite**: Same database format locally and in production - zero migration headache!
- **Preview Deployments**: Every GitHub push creates a preview URL before merging to main

---

**Ready to deploy SmartSeason with Vercel + Turso?** Start with Part 1 and follow the steps sequentially! 🚀
