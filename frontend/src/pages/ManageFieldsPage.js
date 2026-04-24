import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fieldsAPI, assignmentsAPI } from '../utils/api';

export default function ManageFieldsPage() {
  const [fields, setFields] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    cropType: '',
    plantingDate: ''
  });
  const [assignmentForm, setAssignmentForm] = useState({
    fieldId: '',
    agentId: ''
  });
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [fieldsRes, agentsRes] = await Promise.all([
        fieldsAPI.getAll(),
        assignmentsAPI.getAgents()
      ]);
      setFields(fieldsRes.data);
      setAgents(agentsRes.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateField = async (e) => {
    e.preventDefault();
    try {
      await fieldsAPI.create(formData.name, formData.cropType, formData.plantingDate);
      setFormData({ name: '', cropType: '', plantingDate: '' });
      setShowForm(false);
      alert('Field created successfully!');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create field');
    }
  };

  const handleAssignField = async (e) => {
    e.preventDefault();
    try {
      await assignmentsAPI.assign(assignmentForm.fieldId, assignmentForm.agentId);
      setAssignmentForm({ fieldId: '', agentId: '' });
      setShowAssignmentForm(false);
      alert('Field assigned successfully!');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to assign field');
    }
  };

  const handleDeleteField = async (fieldId) => {
    if (window.confirm('Are you sure you want to delete this field?')) {
      try {
        await fieldsAPI.delete(fieldId);
        alert('Field deleted successfully!');
        fetchData();
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete field');
      }
    }
  };

  if (loading) return <div className="loading">Loading fields...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2>Manage Fields</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Cancel' : '+ Create Field'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Create Field Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: '30px' }}>
          <h3>Create New Field</h3>
          <form onSubmit={handleCreateField}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Field Name</label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="cropType">Crop Type</label>
                <input
                  id="cropType"
                  type="text"
                  value={formData.cropType}
                  onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="plantingDate">Planting Date</label>
              <input
                id="plantingDate"
                type="date"
                value={formData.plantingDate}
                onChange={(e) => setFormData({ ...formData, plantingDate: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Create Field</button>
          </form>
        </div>
      )}

      {/* Assign Field Form */}
      {showAssignmentForm && agents.length > 0 && (
        <div className="card" style={{ marginBottom: '30px' }}>
          <h3>Assign Field to Agent</h3>
          <form onSubmit={handleAssignField}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fieldId">Field</label>
                <select
                  id="fieldId"
                  value={assignmentForm.fieldId}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, fieldId: e.target.value })}
                  required
                >
                  <option value="">Select a field...</option>
                  {fields.map(field => (
                    <option key={field.id} value={field.id}>
                      {field.name} ({field.crop_type})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="agentId">Agent</label>
                <select
                  id="agentId"
                  value={assignmentForm.agentId}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, agentId: e.target.value })}
                  required
                >
                  <option value="">Select an agent...</option>
                  {agents.map(agent => (
                    <option key={agent.id} value={agent.id}>
                      {agent.first_name} {agent.last_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Assign Field</button>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => setShowAssignmentForm(false)}
              style={{ marginLeft: '10px' }}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {agents.length === 0 ? (
          <p style={{ color: '#6c757d' }}>No agents available. Register agents first.</p>
        ) : (
          <button 
            className="btn btn-primary" 
            onClick={() => setShowAssignmentForm(!showAssignmentForm)}
          >
            {showAssignmentForm ? '✕ Cancel' : '🔗 Assign Field to Agent'}
          </button>
        )}
      </div>

      {/* Fields Table */}
      <div className="card">
        <h3>All Fields ({fields.length})</h3>
        {fields.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Crop Type</th>
                <th>Stage</th>
                <th>Status</th>
                <th>Planting Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {fields.map(field => (
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
                    <button 
                      className="btn btn-danger btn-small" 
                      onClick={() => handleDeleteField(field.id)}
                      style={{ marginLeft: '5px' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No fields created yet.</p>
        )}
      </div>
    </div>
  );
}
