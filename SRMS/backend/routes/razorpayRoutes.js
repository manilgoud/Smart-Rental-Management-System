const express = require('express');
const router  = express.Router();
const Payment = require('../models/Payment');
const Tenant  = require('../models/Tenant');
const { protect } = require('../middleware/authMiddleware');

// Create Order (Simulated - No real Razorpay needed)
router.post('/create-order', protect, async (req, res) => {
  try {
    const tenant = await Tenant.findOne({ user: req.user._id, isActive: true });
    if (!tenant) return res.status(404).json({ success: false, message: 'No tenant record found' });

    const payment = await Payment.findOne({
      tenant: tenant._id,
      status: { $in: ['pending', 'overdue'] }
    }).sort({ createdAt: -1 });

    if (!payment) return res.status(400).json({ success: false, message: 'No pending payments!' });

    const orderId = 'order_' + Date.now();

    res.json({
      success:   true,
      order:     { id: orderId, amount: payment.amount * 100 },
      payment:   { id: payment._id, amount: payment.amount, month: payment.month },
      key:       'test_key',
      userName:  req.user.name,
      userEmail: req.user.email
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Verify Payment (Simulated)
router.post('/verify-payment', protect, async (req, res) => {
  try {
    const { paymentDbId } = req.body;
    const fakePaymentId   = 'pay_' + Date.now();
    const fakeOrderId     = 'order_' + Date.now();

    const payment = await Payment.findByIdAndUpdate(
      paymentDbId,
      {
        status:            'paid',
        paidDate:          new Date(),
        razorpayOrderId:   fakeOrderId,
        razorpayPaymentId: fakePaymentId,
        notes: `Paid via Payment Gateway. TxnID: ${fakePaymentId}`
      },
      { new: true }
    );

    res.json({
      success: true,
      message: `✅ Payment of ₹${payment.amount} successful!`,
      data:    { paymentId: fakePaymentId, amount: payment.amount, month: payment.month, status: 'paid' }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
