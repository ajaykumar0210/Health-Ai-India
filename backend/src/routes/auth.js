const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const firestore = require('../services/firestore');

// POST /api/auth/profile — save/update user profile after login
router.post('/profile', verifyToken, async (req, res) => {
  try {
    const { name, age, gender, language, concerns } = req.body;
    const profileData = {
      uid: req.uid,
      name: name || '',
      age: age || null,
      gender: gender || '',
      language: language || 'hi',
      concerns: concerns || [],
      updatedAt: new Date().toISOString(),
    };
    await firestore.saveUser(req.uid, profileData);
    res.json({ success: true, profile: profileData });
  } catch (err) {
    console.error('Save profile error:', err.message);
    res.status(500).json({ error: 'Failed to save profile' });
  }
});

// GET /api/auth/profile — get current user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await firestore.getUser(req.uid);
    if (!user) return res.status(404).json({ error: 'Profile not found' });
    res.json({ user });
  } catch (err) {
    console.error('Get profile error:', err.message);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// DELETE /api/auth/account — delete user account
router.delete('/account', verifyToken, async (req, res) => {
  try {
    const { admin } = require('../middleware/auth');
    await admin.auth().deleteUser(req.uid);
    await firestore.saveUser(req.uid, { deleted: true, deletedAt: new Date().toISOString() });
    res.json({ success: true });
  } catch (err) {
    console.error('Delete account error:', err.message);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

module.exports = router;
