const express = require('express');
const router = express.Router();
const c = require('../controllers/maintenanceController');
const { protect, landlordOnly } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/my', c.getMyRequests);
router.get('/', landlordOnly, c.getAllRequests);
router.post('/', c.createRequest);
router.put('/:id/status', landlordOnly, c.updateStatus);
router.put('/:id/note', landlordOnly, c.addNote);
router.delete('/:id', landlordOnly, c.deleteRequest);

module.exports = router;
