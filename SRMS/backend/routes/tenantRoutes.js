// tenantRoutes.js
const express = require('express');
const r = express.Router();
const c = require('../controllers/tenantController');
const { protect, landlordOnly } = require('../middleware/authMiddleware');
r.use(protect);
r.get('/my', c.getMyRecord);
r.get('/', landlordOnly, c.getTenants);
r.post('/', landlordOnly, c.addTenant);
r.delete('/:id', landlordOnly, c.removeTenant);
module.exports = r;
