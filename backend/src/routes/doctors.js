const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const firestore = require('../services/firestore');

// GET /api/doctors — list all active doctors (with optional filter)
router.get('/', verifyToken, async (req, res) => {
  try {
    const { speciality } = req.query;
    const doctors = await firestore.getDoctors(speciality ? { speciality } : {});
    res.json({ doctors });
  } catch (err) {
    console.error('Get doctors error:', err.message);
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
});

// GET /api/doctors/:doctorId — get single doctor profile
router.get('/:doctorId', verifyToken, async (req, res) => {
  try {
    const doctor = await firestore.getDoctor(req.params.doctorId);
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
    res.json({ doctor });
  } catch (err) {
    console.error('Get doctor error:', err.message);
    res.status(500).json({ error: 'Failed to fetch doctor' });
  }
});

module.exports = router;
