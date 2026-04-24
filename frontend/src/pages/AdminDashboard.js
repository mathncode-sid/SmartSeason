import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI, fieldsAPI } from '../utils/api';

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getData();
      setDashboard(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!dashboard) return null;

  const statusPercentages = {
    active: dashboard.totalFields > 0 ? Math.round((dashboard.fieldsByStatus.active / dashboard.totalFields) * 100) : 0,
    atRisk: dashboard.totalFields > 0 ? Math.round((dashboard.fieldsByStatus.atRisk / dashboard.totalFields) * 100) : 0,
    completed: dashboard.totalFields > 0 ? Math.round((dashboard.fieldsByStatus.completed / dashboard.totalFields) * 100) : 0,
  };

  return (
    <div>
      <h2 style={{ marginBottom: '30px' }}>Administrator Dashboard</h2>

      {/* Summary Cards */}
      <div className="dashboard-grid">
        <div className="stat-card">
          <h4>Total Fields</h4>
          <div className="number">{dashboard.totalFields}</div>
        </div>
        <div className="stat-card">
          <h4>Active Fields</h4>
          <div className="number" style={{ color: '#28a745' }}>{dashboard.fieldsByStatus.active}</div>
          <small>{statusPercentages.active}%</small>
        </div>
        <div className="stat-card">
          <h4>At Risk</h4>
          <div className="number" style={{ color: '#ffc107' }}>{dashboard.fieldsByStatus.atRisk}</div>
          <small>{statusPercentages.atRisk}%</small>
        </div>
        <div className="stat-card">
          <h4>Completed</h4>
          <div className="number" style={{ color: '#17a2b8' }}>{dashboard.fieldsByStatus.completed}</div>
          <small>{statusPercentages.completed}%</small>
        </div>
      </div>

      {/* Stage Breakdown */}
      <div className="card">
        <h3>Field Stages</h3>
        <div className="dashboard-grid" style={{ marginBottom: 0 }}>
          <div style={{ textAlign: 'center' }}>
            <strong>Planted</strong>
            <p style={{ fontSize: '20px', color: '#1db854' }}>{dashboard.fieldsByStage.planted}</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <strong>Growing</strong>
            <p style={{ fontSize: '20px', color: '#1db854' }}>{dashboard.fieldsByStage.growing}</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <strong>Ready</strong>
            <p style={{ fontSize: '20px', color: '#1db854' }}>{dashboard.fieldsByStage.ready}</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <strong>Harvested</strong>
            <p style={{ fontSize: '20px', color: '#1db854' }}>{dashboard.fieldsByStage.harvested}</p>
          </div>
        </div>
      </div>

      {/* Recent Fields Table */}
      <div className="card">
        <h3>Recent Fields</h3>
        {dashboard.recentFields.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Field Name</th>
                <th>Crop Type</th>
                <th>Current Stage</th>
                <th>Status</th>
                <th>Planting Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.recentFields.map(field => (
                <tr key={field.id}>
                  <td>{field.name}</td>
                  <td>{field.crop_type}</td>
                  <td>{field.current_stage}</td>
                  <td>
                    <span className={`badge badge-${field.status.toLowerCase().replace(' ', '-')}`}>
                      {field.status}
                    </span>
                  </td>
                  <td>{new Date(field.planting_date).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/field/${field.id}`} className="btn btn-primary btn-small">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No fields yet. <Link to="/manage-fields">Create one</Link></p>
        )}
      </div>

      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <Link to="/manage-fields" className="btn btn-primary">
          Manage All Fields
        </Link>
      </div>
    </div>
  );
}
