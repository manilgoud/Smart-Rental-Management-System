const express = require('express');
const router = express.Router();
const { landlordStats, tenantStats } = require('../controllers/dashboardController');
const { protect, landlordOnly } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/landlord', landlordOnly, landlordStats);
router.get('/tenant', tenantStats);

module.exports = router;
