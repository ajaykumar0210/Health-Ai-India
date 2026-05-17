const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const firestore = require('../services/firestore');

// POST /api/consultations — book a consultation
router.post('/', verifyToken, async (req, res) => {
  try {
    const { doctorId, type, scheduledAt, concern, notes } = req.body;
    if (!doctorId || !type || !scheduledAt) {
      return res.status(400).json({ error: 'doctorId, type, and scheduledAt are required' });
    }
    const doctor = await firestore.getDoctor(doctorId);
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });

    const consultationId = await firestore.createConsultation({
      userId: req.uid,
      doctorId,
      doctorName: doctor.name,
      doctorSpeciality: doctor.speciality,
      type, // 'video' | 'chat'
      scheduledAt,
      concern: concern || '',
      notes: notes || '',
      status: 'pending', // pending | confirmed | completed | cancelled
    });
    res.json({ success: true, consultationId });
  } catch (err) {
    console.error('Book consultation error:', err.message);
    res.status(500).json({ error: 'Failed to book consultation' });
  }
});

// GET /api/consultations — get user's consultations
router.get('/', verifyToken, async (req, res) => {
  try {
    const consultations = await firestore.getUserConsultations(req.uid);
    res.json({ consultations });
  } catch (err) {
    console.error('Get consultations error:', err.message);
    res.status(500).json({ error: 'Failed to fetch consultations' });
  }
});

// GET /api/consultations/:id — get single consultation
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const consultation = await firestore.getConsultation(req.params.id);
    if (!consultation) return res.status(404).json({ error: 'Consultation not found' });
    if (consultation.userId !== req.uid) return res.status(403).json({ error: 'Forbidden' });
    res.json({ consultation });
  } catch (err) {
    console.error('Get consultation error:', err.message);
    res.status(500).json({ error: 'Failed to fetch consultation' });
  }
});

module.exports = router;
