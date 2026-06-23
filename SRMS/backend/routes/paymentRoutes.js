const express = require('express');
const router = express.Router();
const c = require('../controllers/paymentController');
const { protect, landlordOnly } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/my', c.getMyPayments);
router.post('/pay', c.payRent);
router.get('/report', landlordOnly, c.getIncomeReport);
router.get('/', landlordOnly, c.getAllPayments);
router.post('/', landlordOnly, c.createPayment);
router.put('/:id/mark-paid', landlordOnly, c.markAsPaid);
router.put('/:id/remind', landlordOnly, c.sendReminder);
router.put('/:id/status', landlordOnly, c.updateStatus);

module.exports = router;
