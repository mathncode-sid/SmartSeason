const express = require('express');
const FieldUpdate = require('../models/FieldUpdate');
const FieldAssignment = require('../models/FieldAssignment');
const Field = require('../models/Field');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Create a field update (Agent only, for assigned fields)
router.post('/', authenticate, authorize(['agent']), async (req, res) => {
  try {
    const { fieldId, stage, notes } = req.body;

    if (!fieldId) {
      return res.status(400).json({ error: 'Field ID is required' });
    }

    // Verify agent is assigned to this field
    const isAssigned = await FieldAssignment.isAssigned(fieldId, req.user.id);
    if (!isAssigned) {
      return res.status(403).json({ error: 'Not assigned to this field' });
    }

    const update = await FieldUpdate.create(fieldId, req.user.id, stage, notes);

    // If stage is provided, update the field's current stage
    if (stage) {
      await Field.update(fieldId, { current_stage: stage });
    }

    res.status(201).json({
      ...update,
      message: 'Update created successfully'
    });
  } catch (error) {
    console.error('Field update error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get updates for a specific field
router.get('/field/:fieldId', authenticate, async (req, res) => {
  try {
    const field = await Field.findById(req.params.fieldId);
    
    if (!field) {
      return res.status(404).json({ error: 'Field not found' });
    }

    // Authorization check
    if (req.user.role === 'agent') {
      const isAssigned = await FieldAssignment.isAssigned(field.id, req.user.id);
      if (!isAssigned) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    const updates = await FieldUpdate.findByField(req.params.fieldId);
    res.json(updates);
  } catch (error) {
    console.error('Updates retrieval error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get updates by current agent
router.get('/agent/my-updates', authenticate, authorize(['agent']), async (req, res) => {
  try {
    const updates = await FieldUpdate.findByAgent(req.user.id);
    res.json(updates);
  } catch (error) {
    console.error('Agent updates retrieval error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
