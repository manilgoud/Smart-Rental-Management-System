const express = require('express');
const router = express.Router();
const { getProperties, getProperty, addProperty, updateProperty, deleteProperty } = require('../controllers/propertyController');
const { protect, landlordOnly } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/', getProperties);
router.get('/:id', getProperty);
router.post('/', landlordOnly, addProperty);
router.put('/:id', landlordOnly, updateProperty);
router.delete('/:id', landlordOnly, deleteProperty);

module.exports = router;
