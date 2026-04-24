const express = require('express');
const FieldAssignment = require('../models/FieldAssignment');
const User = require('../models/User');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Assign a field to an agent (Admin only)
router.post('/', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { fieldId, agentId } = req.body;

    if (!fieldId || !agentId) {
      return res.status(400).json({ error: 'Field ID and Agent ID are required' });
    }

    await FieldAssignment.assign(fieldId, agentId);
    res.status(201).json({ message: 'Field assigned successfully' });
  } catch (error) {
    console.error('Assignment error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Unassign a field from an agent (Admin only)
router.delete('/:fieldId/:agentId', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { fieldId, agentId } = req.params;
    await FieldAssignment.unassign(fieldId, agentId);
    res.json({ message: 'Field unassigned successfully' });
  } catch (error) {
    console.error('Unassignment error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get agents assigned to a field
router.get('/field/:fieldId', authenticate, async (req, res) => {
  try {
    const assignments = await FieldAssignment.findByField(req.params.fieldId);
    res.json(assignments);
  } catch (error) {
    console.error('Assignments retrieval error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all available agents (Admin only)
router.get('/agents/list', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const agents = await User.findAgents();
    res.json(agents);
  } catch (error) {
    console.error('Agents retrieval error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
