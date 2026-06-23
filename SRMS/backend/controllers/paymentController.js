const Payment = require('../models/Payment');
const Tenant = require('../models/Tenant');

exports.getAllPayments = async (req, res) => {
  try {
    const filter = { landlord: req.user._id };
    if (req.query.month) filter.month = req.query.month;
    if (req.query.status) filter.status = req.query.status;
    const payments = await Payment.find(filter)
      .populate({ path: 'tenant', populate: { path: 'user', select: 'name email phone' } })
      .populate('property', 'name address')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: payments.length, data: payments });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getMyPayments = async (req, res) => {
  try {
    const tenant = await Tenant.findOne({ user: req.user._id, isActive: true });
    if (!tenant) return res.status(404).json({ success: false, message: 'No tenant record found' });
    const payments = await Payment.find({ tenant: tenant._id })
      .populate('property', 'name address')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: payments.length, data: payments });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createPayment = async (req, res) => {
  try {
    const { tenantId, propertyId, month, amount, status, paidDate, notes } = req.body;
    if (!tenantId || !month || !amount) {
      return res.status(400).json({ success: false, message: 'tenantId, month, amount required' });
    }
    const payment = await Payment.create({
      landlord: req.user._id, tenant: tenantId, property: propertyId,
      month, amount, status: status || 'pending',
      paidDate: status === 'paid' ? (paidDate || Date.now()) : null,
      notes: notes || ''
    });
    res.status(201).json({ success: true, message: 'Payment recorded!', data: payment });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.markAsPaid = async (req, res) => {
  try {
    const payment = await Payment.findOneAndUpdate(
      { _id: req.params.id, landlord: req.user._id },
      { status: 'paid', paidDate: Date.now() }, { new: true }
    );
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
    res.json({ success: true, message: '✅ Marked as Paid!', data: payment });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.sendReminder = async (req, res) => {
  try {
    const payment = await Payment.findOneAndUpdate(
      { _id: req.params.id, landlord: req.user._id },
      { reminderSent: true }, { new: true }
    ).populate({ path: 'tenant', populate: { path: 'user', select: 'name email' } });
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
    res.json({ success: true, message: `📧 Reminder sent to ${payment.tenant?.user?.name}!`, data: payment });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const update = { status };
    if (status === 'paid') update.paidDate = Date.now();
    const payment = await Payment.findOneAndUpdate(
      { _id: req.params.id, landlord: req.user._id },
      update, { new: true }
    );
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
    res.json({ success: true, message: 'Status updated!', data: payment });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.payRent = async (req, res) => {
  try {
    const { paymentMethod } = req.body;
    const tenant = await Tenant.findOne({ user: req.user._id, isActive: true });
    if (!tenant) return res.status(404).json({ success: false, message: 'No tenant record found' });
    const payment = await Payment.findOne({
      tenant: tenant._id, status: { $in: ['pending', 'overdue'] }
    }).sort({ createdAt: -1 });
    if (!payment) return res.status(400).json({ success: false, message: 'No pending payments!' });
    const transactionId = 'TXN' + Date.now();
    payment.status   = 'paid';
    payment.paidDate = new Date();
    payment.notes    = `Paid via ${paymentMethod}. TxnID: ${transactionId}`;
    await payment.save();
    res.json({
      success: true,
      message: `✅ Payment of ₹${payment.amount} successful!`,
      data: { transactionId, amount: payment.amount, month: payment.month, paidDate: payment.paidDate, paymentMethod }
    });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getIncomeReport = async (req, res) => {
  try {
    const report = await Payment.aggregate([
      { $match: { landlord: req.user._id, status: 'paid' } },
      { $group: { _id: '$month', totalIncome: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { _id: -1 } }, { $limit: 12 }
    ]);
    res.json({ success: true, data: report });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
