const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const firestore = require('../services/firestore');
const { createOrder, verifyPaymentSignature } = require('../services/razorpay');

const PLANS = {
  rural: { name: 'Rural Basic', price: 99, period: 'monthly' },
  standard: { name: 'Standard Care', price: 299, period: 'monthly' },
  premium: { name: 'Premium Care', price: 599, period: 'monthly' },
};

// POST /api/subscriptions/order — create Razorpay order
router.post('/order', verifyToken, async (req, res) => {
  try {
    const { planId } = req.body;
    const plan = PLANS[planId];
    if (!plan) return res.status(400).json({ error: 'Invalid plan' });

    const receipt = `sub_${req.uid.slice(0, 8)}_${Date.now()}`;
    const order = await createOrder(plan.price, 'INR', receipt);
    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      planId,
      planName: plan.name,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error('Create order error:', err.message);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
});

// POST /api/subscriptions/verify — verify payment and activate subscription
router.post('/verify', verifyToken, async (req, res) => {
  try {
    const { orderId, paymentId, signature, planId } = req.body;
    if (!orderId || !paymentId || !signature || !planId) {
      return res.status(400).json({ error: 'orderId, paymentId, signature, planId are required' });
    }

    const isValid = verifyPaymentSignature(orderId, paymentId, signature);
    if (!isValid) return res.status(400).json({ error: 'Invalid payment signature' });

    const plan = PLANS[planId];
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    await firestore.saveSubscription(req.uid, {
      planId,
      planName: plan.name,
      status: 'active',
      orderId,
      paymentId,
      activatedAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString(),
    });

    // Update user record too
    await firestore.saveUser(req.uid, { subscription: planId, subscriptionExpiry: expiresAt.toISOString() });

    res.json({ success: true, planId, expiresAt: expiresAt.toISOString() });
  } catch (err) {
    console.error('Verify payment error:', err.message);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

// GET /api/subscriptions — get current subscription
router.get('/', verifyToken, async (req, res) => {
  try {
    const subscription = await firestore.getSubscription(req.uid);
    res.json({ subscription: subscription || { planId: 'freemium', status: 'active' } });
  } catch (err) {
    console.error('Get subscription error:', err.message);
    res.status(500).json({ error: 'Failed to fetch subscription' });
  }
});

module.exports = router;
