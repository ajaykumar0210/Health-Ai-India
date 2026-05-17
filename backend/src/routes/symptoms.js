const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const gemini = require('../services/gemini');

// POST /api/symptoms/chat — AI symptom chat (Hindi/English)
router.post('/chat', verifyToken, async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array is required' });
    }
    // Validate message structure
    for (const m of messages) {
      if (!m.role || !m.content) {
        return res.status(400).json({ error: 'Each message must have role and content' });
      }
    }
    const result = await gemini.chat(messages);
    res.json(result);
  } catch (err) {
    console.error('Symptom chat error:', err.message);
    res.status(500).json({ error: 'AI service unavailable. Please try again.' });
  }
});

module.exports = router;
