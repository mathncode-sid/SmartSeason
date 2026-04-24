import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../utils/api';

export default function AgentDashboard() {
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

  const handleRefresh = () => {
    fetchDashboard();
  };

  const statusPercentages = {
    active: dashboard.totalAssignedFields > 0 ? Math.round((dashboard.fieldsByStatus.active / dashboard.totalAssignedFields) * 100) : 0,
    atRisk: dashboard.totalAssignedFields > 0 ? Math.round((dashboard.fieldsByStatus.atRisk / dashboard.totalAssignedFields) * 100) : 0,
    completed: dashboard.totalAssignedFields > 0 ? Math.round((dashboard.fieldsByStatus.completed / dashboard.totalAssignedFields) * 100) : 0,
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2>My Fields</h2>
        <button className="btn btn-primary" onClick={handleRefresh} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="dashboard-grid">
        <div className="stat-card">
          <h4>Assigned Fields</h4>
          <div className="number">{dashboard.totalAssignedFields}</div>
        </div>
        <div className="stat-card">
          <h4>Active</h4>
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
        <h3>Field Progress</h3>
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

      {/* Assigned Fields Table */}
      <div className="card">
        <h3>My Assigned Fields</h3>
        {dashboard.assignedFields && dashboard.assignedFields.length > 0 ? (
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
              {dashboard.assignedFields.map(field => (
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
                      View & Update
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No fields assigned to you yet. Contact your coordinator.</p>
        )}
      </div>
    </div>
  );
}
