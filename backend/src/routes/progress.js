const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const firestore = require('../services/firestore');

// POST /api/progress — save a progress log entry
router.post('/', verifyToken, async (req, res) => {
  try {
    const { type, data, date } = req.body;
    if (!type || !data) {
      return res.status(400).json({ error: 'type and data are required' });
    }
    const id = await firestore.saveProgressLog(req.uid, {
      type, // 'medication' | 'nutrition' | 'sleep' | 'weekly_checkin' | 'milestone'
      data,
      date: date || new Date().toISOString().split('T')[0],
    });
    res.json({ success: true, id });
  } catch (err) {
    console.error('Save progress error:', err.message);
    res.status(500).json({ error: 'Failed to save progress' });
  }
});

// GET /api/progress — get user's progress logs
router.get('/', verifyToken, async (req, res) => {
  try {
    const { limit } = req.query;
    const logs = await firestore.getProgressLogs(req.uid, limit ? parseInt(limit) : 30);
    res.json({ logs });
  } catch (err) {
    console.error('Get progress error:', err.message);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

module.exports = router;
