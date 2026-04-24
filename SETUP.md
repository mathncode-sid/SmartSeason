# SmartSeason Setup Guide

## Quick Start (Windows)

### Option 1: Automated Setup (Recommended)
1. Double-click `setup.bat` to install all dependencies
2. Double-click `start.bat` to run both backend and frontend

That's it! The application will open at `http://localhost:3000`, and demo users are created automatically.

### Option 2: Manual Setup

#### Prerequisites
- Node.js 14+ (Download from https://nodejs.org/)
- Git (optional)

#### Step 1: Backend Setup
```
cd backend
npm install
npm start
```
Backend will run on `http://localhost:5000`

> **Note**: Demo users are created automatically on first run.

#### Step 2: Frontend Setup (new terminal)
```
cd frontend
npm install
npm start
```
Frontend will open automatically at `http://localhost:3000`

## After Installation

### Demo Users

Demo users are automatically created when you start the backend for the first time.

**Admin Account:**
- Email: `admin@smartseason.com`
- Password: `password123`

**Field Agent Account:**
- Email: `agent@smartseason.com`
- Password: `password123`

### First Time Usage

1. **Open the application** at `http://localhost:3000`

2. **Login as Admin** with credentials above
   - View the Admin Dashboard
   - See the overview of fields (initially empty)
   - Click "Manage Fields" to create test fields

3. **Create Sample Fields** to test the system:
   - North Field (Wheat) - Plant date: 60 days ago
   - South Field (Corn) - Plant date: 30 days ago  
   - East Field (Soybean) - Plant date: 5 days ago

4. **Assign Fields to Agent**:
   - In Manage Fields, use "Assign Field to Agent" button
   - Select a field and assign to the Field Agent

5. **Login as Field Agent**:
   - Logout from admin account
   - Login with agent credentials
   - You'll see assigned fields in "My Fields"
   - Click on a field to add updates/observations

6. **Add Field Updates**:
   - Click on an assigned field
   - Click "Add Update" button
   - Change the stage or add notes
   - Submit the update

7. **Review Updates**:
   - Login back as Admin
   - View the field details to see all updates

## Troubleshooting

### "Port 5000 already in use"
Change the port in `backend/.env`:
```
PORT=3001
```
Then update frontend `.env`:
```
REACT_APP_API_URL=http://localhost:3001/api
```

### Frontend shows "Cannot reach API"
Make sure:
1. Backend is running on `http://localhost:5000`
2. Frontend `.env` has correct API URL
3. No firewall blocking localhost communication

### Database errors
Delete `backend/smartseason.db` and restart backend to recreate the database

### Dependencies installation fails
Try clearing npm cache:
```
npm cache clean --force
rm -rf node_modules
npm install
```

## File Structure

```
SmartSeason/
├── backend/
│   ├── src/
│   │   ├── index.js (main server)
│   │   ├── database.js (DB setup)
│   │   ├── middleware/auth.js (JWT auth)
│   │   ├── models/ (User, Field, etc.)
│   │   └── routes/ (API endpoints)
│   ├── package.json
│   ├── .env
│   └── smartseason.db (created on first run)
├── frontend/
│   ├── src/
│   │   ├── index.js
│   │   ├── App.js (routing)
│   │   ├── pages/ (React pages)
│   │   ├── context/ (Auth state)
│   │   ├── utils/api.js (API client)
│   │   └── styles/global.css
│   ├── public/index.html
│   ├── package.json
│   └── .env
└── README.md
```

## Important Notes

- **Database**: The system uses SQLite which stores data in `backend/smartseason.db`
- **Authentication**: JWT tokens expire after 24 hours
- **API Base URL**: Change in `frontend/.env` if backend is on different port/host
- **Production**: For production deployment, change `JWT_SECRET` in `backend/.env`

## Support

For detailed API documentation and architecture decisions, see `README.md` in the project root.

---

Happy farming!
