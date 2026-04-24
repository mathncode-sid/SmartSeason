const express = require('express');
const Field = require('../models/Field');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Get dashboard data
router.get('/', authenticate, async (req, res) => {
  try {
    let fields;
    let dashboardData = {};

    if (req.user.role === 'admin') {
      // Admin dashboard - all fields they created
      fields = await Field.findByAdmin(req.user.id);
      
      dashboardData = {
        totalFields: fields.length,
        fieldsByStatus: {
          active: fields.filter(f => f.status === 'Active').length,
          atRisk: fields.filter(f => f.status === 'At Risk').length,
          completed: fields.filter(f => f.status === 'Completed').length
        },
        fieldsByStage: {
          planted: fields.filter(f => f.current_stage === 'Planted').length,
          growing: fields.filter(f => f.current_stage === 'Growing').length,
          ready: fields.filter(f => f.current_stage === 'Ready').length,
          harvested: fields.filter(f => f.current_stage === 'Harvested').length
        },
        recentFields: fields.slice(0, 5)
      };
    } else {
      // Agent dashboard - assigned fields
      fields = await Field.findByAgent(req.user.id);
      
      dashboardData = {
        totalAssignedFields: fields.length,
        fieldsByStatus: {
          active: fields.filter(f => f.status === 'Active').length,
          atRisk: fields.filter(f => f.status === 'At Risk').length,
          completed: fields.filter(f => f.status === 'Completed').length
        },
        fieldsByStage: {
          planted: fields.filter(f => f.current_stage === 'Planted').length,
          growing: fields.filter(f => f.current_stage === 'Growing').length,
          ready: fields.filter(f => f.current_stage === 'Ready').length,
          harvested: fields.filter(f => f.current_stage === 'Harvested').length
        },
        assignedFields: fields
      };
    }

    res.json(dashboardData);
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
