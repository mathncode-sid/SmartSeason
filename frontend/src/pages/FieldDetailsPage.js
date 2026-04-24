import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fieldsAPI, updatesAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function FieldDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [field, setField] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    stage: '',
    notes: ''
  });

  useEffect(() => {
    fetchFieldData();
  }, [id]);

  const fetchFieldData = async () => {
    try {
      setLoading(true);
      const fieldRes = await fieldsAPI.getById(id);
      setField(fieldRes.data);
      
      if (fieldRes.data.updates) {
        setUpdates(fieldRes.data.updates);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load field');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUpdate = async (e) => {
    e.preventDefault();
    try {
      await updatesAPI.create(id, updateForm.stage || null, updateForm.notes || null);
      setUpdateForm({ stage: '', notes: '' });
      setShowUpdateForm(false);
      alert('Update added successfully!');
      fetchFieldData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add update');
    }
  };

  if (loading) return <div className="loading">Loading field details...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!field) return <div className="alert alert-error">Field not found</div>;

  const handleRefreshField = () => {
    setLoading(true);
    fetchFieldData();
  };

  const daysOld = Math.floor((new Date() - new Date(field.planting_date)) / (1000 * 60 * 60 * 24));

  return (
    <div>
      <button className="btn btn-secondary" onClick={() => navigate(-1)} style={{ marginBottom: '20px' }}>
        ← Back
      </button>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <div>
            <h2>{field.name}</h2>
            <p style={{ color: '#6c757d', marginBottom: '20px' }}>Crop: {field.crop_type}</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'start' }}>
            <button className="btn btn-primary btn-small" onClick={handleRefreshField} disabled={loading}>
              {loading ? '⟳' : '⟳'} Refresh
            </button>
            <span className={`badge badge-${field.status.toLowerCase().replace(' ', '-')}`} style={{ padding: '10px 15px', fontSize: '14px' }}>
              {field.status}
            </span>
          </div>
        </div>

        <div className="dashboard-grid" style={{ marginBottom: '20px' }}>
          <div>
            <strong>Current Stage:</strong>
            <p>{field.current_stage}</p>
          </div>
          <div>
            <strong>Planting Date:</strong>
            <p>{new Date(field.planting_date).toLocaleDateString()}</p>
          </div>
          <div>
            <strong>Days Since Planting:</strong>
            <p>{daysOld} days</p>
          </div>
          <div>
            <strong>Status:</strong>
            <p style={{ color: field.status === 'At Risk' ? '#ffc107' : '#28a745' }}>
              {field.status}
            </p>
          </div>
        </div>
      </div>

      {/* Add Update Form - Only for Agents */}
      {user?.role === 'agent' && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3>Add Update</h3>
            <button 
              className="btn btn-primary" 
              onClick={() => setShowUpdateForm(!showUpdateForm)}
            >
              {showUpdateForm ? '✕ Cancel' : '+ Add Update'}
            </button>
          </div>

          {showUpdateForm && (
            <form onSubmit={handleAddUpdate}>
              <div className="form-group">
                <label htmlFor="stage">Update Stage (optional)</label>
                <select
                  id="stage"
                  value={updateForm.stage}
                  onChange={(e) => setUpdateForm({ ...updateForm, stage: e.target.value })}
                >
                  <option value="">No stage change</option>
                  <option value="Planted">Planted</option>
                  <option value="Growing">Growing</option>
                  <option value="Ready">Ready</option>
                  <option value="Harvested">Harvested</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="notes">Notes / Observations</label>
                <textarea
                  id="notes"
                  value={updateForm.notes}
                  onChange={(e) => setUpdateForm({ ...updateForm, notes: e.target.value })}
                  placeholder="Add any observations or notes about the field..."
                />
              </div>

              <button type="submit" className="btn btn-primary">Submit Update</button>
            </form>
          )}
        </div>
      )}

      {/* Updates History */}
      <div className="card">
        <h3>Update History</h3>
        {updates && updates.length > 0 ? (
          <div>
            {updates.map(update => (
              <div key={update.id} style={{ paddingBottom: '20px', borderBottom: '1px solid #eee', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <strong>{update.first_name} {update.last_name}</strong>
                    <p style={{ color: '#6c757d', margin: '5px 0' }}>
                      {new Date(update.created_at).toLocaleString()}
                    </p>
                  </div>
                  {update.stage && (
                    <span style={{ backgroundColor: '#e7f3ff', padding: '5px 10px', borderRadius: '3px', fontSize: '12px', fontWeight: '500' }}>
                      Updated to: {update.stage}
                    </span>
                  )}
                </div>
                {update.notes && (
                  <p style={{ marginTop: '10px', marginBottom: 0 }}>{update.notes}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#6c757d' }}>No updates yet</p>
        )}
      </div>
    </div>
  );
}
