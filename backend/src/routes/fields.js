const express = require('express');
const Field = require('../models/Field');
const FieldUpdate = require('../models/FieldUpdate');
const FieldAssignment = require('../models/FieldAssignment');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Create a new field (Admin only)
router.post('/', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { name, cropType, plantingDate } = req.body;

    if (!name || !cropType || !plantingDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const field = await Field.create(name, cropType, plantingDate, req.user.id);
    res.status(201).json(field);
  } catch (error) {
    console.error('Field creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all fields (Admin sees all, Agent sees assigned)
router.get('/', authenticate, async (req, res) => {
  try {
    let fields;
    if (req.user.role === 'admin') {
      fields = await Field.findByAdmin(req.user.id);
    } else {
      fields = await Field.findByAgent(req.user.id);
    }
    res.json(fields);
  } catch (error) {
    console.error('Field retrieval error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get a specific field
router.get('/:id', authenticate, async (req, res) => {
  try {
    const field = await Field.findById(req.params.id);
    
    if (!field) {
      return res.status(404).json({ error: 'Field not found' });
    }

    // Check authorization: admin can see all, agent can only see assigned
    if (req.user.role === 'agent') {
      const isAssigned = await FieldAssignment.isAssigned(field.id, req.user.id);
      if (!isAssigned && field.created_by !== req.user.id) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    const assignments = await FieldAssignment.findByField(field.id);
    const updates = await FieldUpdate.findByField(field.id);

    res.json({
      ...field,
      assignments,
      updates
    });
  } catch (error) {
    console.error('Field retrieval error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update field (Admin only)
router.put('/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const field = await Field.update(req.params.id, req.body);
    
    if (!field) {
      return res.status(404).json({ error: 'Field not found' });
    }

    res.json(field);
  } catch (error) {
    console.error('Field update error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete field (Admin only)
router.delete('/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { db_run } = require('../database');
    await db_run('DELETE FROM fields WHERE id = ?', [req.params.id]);
    res.json({ message: 'Field deleted successfully' });
  } catch (error) {
    console.error('Field deletion error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
