import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      navigate(user.role === 'admin' ? '/admin-dashboard' : '/agent-dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto' }}>
      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>SmartSeason Login</h2>
        
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p>
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </div>

        <div className="alert alert-success" style={{ marginTop: '20px' }}>
          <strong>Demo Credentials:</strong>
          <p><strong>Admin:</strong> admin@smartseason.com / password123</p>
          <p><strong>Agent:</strong> agent@smartseason.com / password123</p>
        </div>
      </div>
    </div>
  );
}
