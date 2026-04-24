import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import './styles/global.css';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import AgentDashboard from './pages/AgentDashboard';
import FieldDetailsPage from './pages/FieldDetailsPage';
import ManageFieldsPage from './pages/ManageFieldsPage';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'admin' ? '/admin-dashboard' : '/agent-dashboard'} />;
  }

  return children;
};

const Navigation = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <header className="header">
      <div className="container">
        <div className="nav">
          <div>
            <h1>SmartSeason</h1>
            <p>Field Monitoring System</p>
          </div>
          <nav>
            <ul className="nav-links">
              {user.role === 'admin' && (
                <>
                  <li>
                    <Link to="/admin-dashboard">Dashboard</Link>
                  </li>
                  <li>
                    <Link to="/manage-fields">Manage Fields</Link>
                  </li>
                </>
              )}
              {user.role === 'agent' && (
                <li>
                  <Link to="/agent-dashboard">My Fields</Link>
                </li>
              )}
              <li>
                <span style={{ color: 'white', marginRight: '10px' }}>
                  {user.firstName} ({user.role})
                </span>
                <button className="btn btn-secondary btn-small" onClick={logout}>
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={user ? <Navigate to={user.role === 'admin' ? '/admin-dashboard' : '/agent-dashboard'} /> : <LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <div className="container">
                <AdminDashboard />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-fields"
          element={
            <ProtectedRoute requiredRole="admin">
              <div className="container">
                <ManageFieldsPage />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/field/:id"
          element={
            <ProtectedRoute>
              <div className="container">
                <FieldDetailsPage />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/agent-dashboard"
          element={
            <ProtectedRoute requiredRole="agent">
              <div className="container">
                <AgentDashboard />
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
