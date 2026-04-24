import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'agent'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
        formData.role
      );
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto' }}>
      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Create Account</h2>
        
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="agent">Field Agent</option>
              <option value="admin">Admin/Coordinator</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p>
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
