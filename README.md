# SmartSeason Field Monitoring System

A full-stack web application for tracking crop progress across multiple fields during a growing season. Built with Node.js/Express backend and React frontend, featuring role-based access control for administrators and field agents.

## Overview

SmartSeason helps agricultural coordinators and field agents:
- Track multiple fields throughout the growing season
- Monitor crop stages and field health status
- Assign fields to specific agents for monitoring
- Record observations and stage updates
- Get real-time dashboards with field status overview

## Tech Stack

- **Backend:** Node.js, Express.js, SQLite3
- **Frontend:** React 18, React Router v6, Axios
- **Database:** SQLite (embedded, no external DB required)
- **Authentication:** JWT (JSON Web Tokens)

## 📋 System Architecture

### Backend
- RESTful API with Express.js
- SQLite database with schema for users, fields, assignments, and updates
- JWT authentication with role-based access control
- Models: User, Field, FieldAssignment, FieldUpdate

### Frontend
- React SPA with React Router for navigation
- Context API for global authentication state
- Clean, responsive UI with CSS Grid/Flexbox
- Role-based page access

### Database Schema
```
Users: id, email, password, first_name, last_name, role, created_at
Fields: id, name, crop_type, planting_date, current_stage, status, created_by, created_at
FieldAssignments: id, field_id, agent_id, assigned_date
FieldUpdates: id, field_id, agent_id, stage, notes, created_at
```

## Setup Instructions

### Prerequisites
- Node.js 14+ and npm
- Git

### Installation

#### 1. Clone & Navigate to Project
```bash
git clone <repository-url>
cd SmartSeason
```

#### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# The backend will automatically create the SQLite database on first run

# Start the backend server (development)
npm run dev
# or
npm start
```

Backend runs on `http://localhost:5000`

#### 3. Frontend Setup (in new terminal)
```bash
cd frontend

# Install dependencies
npm install

# Create .env file for API URL (optional - defaults to http://localhost:5000/api)
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env

# Start the development server
npm start
```

Frontend runs on `http://localhost:3000`

### Database Initialization

The database and schema are automatically created when the backend starts for the first time. The SQLite database file (`smartseason.db`) will be created in the `backend/` directory.

## Design Decisions

### 1. Field Status Calculation Logic
Fields have a computed **status** that's determined by:
- **Current Stage**: Planted → Growing → Ready → Harvested
- **Days Since Planting**: Expected progress is ~30 days per stage
- **Status Outcomes**:
  - **Active**: Field is on track (current stage matches expected timeline)
  - **At Risk**: Field is behind schedule (actual stage < expected stage)
  - **Completed**: Field has been harvested

Example: If a field was planted 60 days ago, it should be in "Growing" or "Ready" stage. If it's still in "Planted", its status is marked as "At Risk".

### 2. Role-Based Access Control
- **Admin/Coordinator**: Can create fields, assign fields to agents, view all fields and updates
- **Field Agent**: Can only view assigned fields, submit updates and observations

### 3. Database Choice
SQLite was chosen for:
- Zero configuration needed
- Perfect for assessment/demo purposes
- Portable (single file database)
- Easy deployment

For production, uses **Turso** SQLite for cloud database with the same table schema.

### 4. Authentication
- JWT tokens stored in localStorage
- 24-hour token expiration
- Passwords hashed with bcryptjs (10 salt rounds)
- No persistent sessions needed

### 5. API Design
- RESTful endpoints with clear separation:
  - `/api/auth/` - Authentication (register, login)
  - `/api/fields/` - Field CRUD operations
  - `/api/updates/` - Field update submissions
  - `/api/assignments/` - Field-to-agent assignments
  - `/api/dashboard/` - Dashboard summary data

### 6. Frontend Architecture
- Context API for state management (simpler than Redux for this scope)
- Component-based UI with clear separation
- Protected routes with role checking
- Responsive design using CSS Grid and Flexbox

## 🔑 Demo Credentials

Two demo users have been created:

### Admin/Coordinator Account
- **Email:** `admin@smartseason.com`
- **Password:** `password123`
- **Access:** Can create fields, assign to agents, view all dashboards

### Field Agent Account
- **Email:** `agent@smartseason.com`
- **Password:** `password123`
- **Access:** Can view assigned fields and submit updates

### Creating Demo Users
To create demo users manually:

1. Register at `http://localhost:3000/register`
2. Fill in the form with desired credentials
3. Select "Admin/Coordinator" or "Field Agent" role
4. Click Register

Then login with those credentials.

## 📱 Application Features

### Admin Dashboard
- Overview of total fields with status breakdown
- Fields by stage (Planted, Growing, Ready, Harvested)
- Recent fields list with quick links
- Create new fields with name, crop type, and planting date
- Assign fields to specific agents
- Delete fields
- View all field details and update history

### Agent Dashboard
- Overview of assigned fields
- Status breakdown for assigned fields
- Stage progress visualization
- Quick access to assigned fields
- Real-time field details

### Field Management
- Create fields with essential information
- Update field current stage
- Assign/unassign fields to/from agents
- Delete fields
- View complete update history

### Field Updates
- Agents can add stage updates
- Record observations and notes
- Automatic stage progression in field record
- Timestamped update history
- Visibility of who made each update

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### Fields
- `GET /api/fields` - Get all fields (filtered by role)
- `GET /api/fields/:id` - Get field details
- `POST /api/fields` - Create field (admin only)
- `PUT /api/fields/:id` - Update field (admin only)
- `DELETE /api/fields/:id` - Delete field (admin only)

### Updates
- `POST /api/updates` - Create field update (agent only)
- `GET /api/updates/field/:fieldId` - Get field updates
- `GET /api/updates/agent/my-updates` - Get agent's updates

### Assignments
- `POST /api/assignments` - Assign field to agent (admin only)
- `DELETE /api/assignments/:fieldId/:agentId` - Unassign field
- `GET /api/assignments/field/:fieldId` - Get agents for field
- `GET /api/assignments/agents/list` - Get all agents (admin only)

### Dashboard
- `GET /api/dashboard` - Get dashboard summary (role-specific)

## ⚙️ Configuration

### Backend (.env)
```
PORT=5000
JWT_SECRET=smartseason-secret-key-change-in-production
NODE_ENV=development
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 🧪 Testing the System

### Quick Demo Flow
1. Login as Admin (`admin@smartseason.com` / `password123`)
2. Create a field (e.g., "North Field 1", "Corn", with planting date 30-60 days ago)
3. Create another field with different dates to see "At Risk" status
4. Go to "Manage Fields" and assign a field to Agent
5. Logout and login as Agent (`agent@smartseason.com` / `password123`)
6. See the assigned field in "My Fields"
7. Click on field and add an update with notes
8. Go back to Admin and refresh - see the update in field history

## 📈 Field Status Examples

1. **Field planted 10 days ago** → Planted stage → Expected: Planted → **Active**
2. **Field planted 40 days ago** → Still in Planted stage → Expected: Growing → **At Risk**
3. **Field planted 90 days ago** → Harvested → **Completed**

## Deployment

SmartSeason is ready for production deployment on **Vercel**.

### Vercel + Turso Full-Stack (Recommended - Single Platform)

Deploy your entire application on Vercel with Turso SQLite:
- ✅ React frontend on global CDN
- ✅ Backend as serverless API routes
- ✅ Turso SQLite database (same format as your local database!)
- ✅ Automatic GitHub deployments
- ✅ Single dashboard

**Quick Start (20 min):**
1. Create Turso SQLite database
2. Push code to GitHub with Vercel configuration
3. Import repo to Vercel
4. Set environment variables
5. Deploy and seed database

**Full Instructions:** See `VERCEL_FULLSTACK_DEPLOYMENT.md`

**Cost:**
- Frontend & API Routes: Free tier available
- Turso SQLite: Free tier available (10GB storage, 1M requests/month)
- **Total: Completely free to start!**

**Why Vercel + Turso?**
- ✅ Single platform, single dashboard
- ✅ No cold starts with serverless functions
- ✅ Global CDN for frontend
- ✅ Serverless API routes included
- ✅ SQLite database (zero migration from local)
- ✅ Automatic deployments from GitHub
- ✅ Free tier covers all features

### Local Production Testing

Test the production setup locally:
```bash
npm run build --prefix frontend
PORT=5000 npm start
# Visit http://localhost:5000
```

### Manual Deployment

For custom servers (AWS EC2, DigitalOcean VPS, etc.):

1. **Install Node.js** on your server
2. **Clone repository**: `git clone <repo>`
3. **Install dependencies**: `npm install && npm install --prefix backend && npm install --prefix frontend`
4. **Build frontend**: `npm run build --prefix frontend`
5. **Set environment variables** (.env files):
   - Backend: `JWT_SECRET`, `NODE_ENV=production`
   - Frontend: `REACT_APP_API_URL=https://your-domain.com/api`
6. **Database**: Set up Turso SQLite and configure `DATABASE_URL` with libsql connection
7. **Start server**: `npm start`
8. **Setup reverse proxy**: Configure nginx/Apache to forward requests
9. **Enable HTTPS**: Use Let's Encrypt for SSL certificates

### Platform-Specific Guides

- **Vercel**: `VERCEL_FULLSTACK_DEPLOYMENT.md` (recommended)
- **AWS EC2**: Set up Node.js, SQLite/PostgreSQL, nginx with reverse proxy
- **DigitalOcean**: App Platform or VPS with similar setup to AWS

## 📝 Key Assumptions

1. **Crop growth timeline:** Assumed ~30 days per stage for status calculation (can be customized per crop type)
2. **Single coordinator:** System assumes one admin managing all fields (can be extended for multi-tenant)
3. **Linear workflow:** Fields progress through stages in order (can add branching in future)
4. **No real-time updates:** Dashboard requires page refresh (can add WebSockets for live updates)
5. **No image uploads:** Currently supports text notes only (can add file upload capability)

## 🔒 Security Notes

- Passwords are hashed with bcryptjs (10 salt rounds)
- JWT tokens expire after 24 hours
- Role-based access control on all protected endpoints
- Input validation on backend
- CORS enabled for frontend communication

For production, add:
- HTTPS/SSL
- Request rate limiting
- Input sanitization
- CSRF protection
- Secure cookie flags

## 🤝 Code Quality

- Clear separation of concerns (models, routes, middleware)
- Async/await for promise handling
- Error handling with try-catch blocks
- Consistent naming conventions
- Comments for complex logic

## 📞 Support

For issues or questions about the system, check:
- Backend logs at console output
- Browser console for frontend errors
- Network tab for API request issues

## 📄 License

This is a demonstration project for assessment purposes.

---

**Built with ❤️ for SmartSeason**
