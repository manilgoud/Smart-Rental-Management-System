// ============================================
// server.js - Main Entry Point
// Smart Rental Management System
// ============================================

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// ── Middleware ──────────────────────────────
app.use(cors()); // Allow frontend to call backend
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// ── API Routes ──────────────────────────────
app.use('/api/auth',        require('./routes/authRoutes'));
app.use('/api/properties',  require('./routes/propertyRoutes'));
app.use('/api/tenants',     require('./routes/tenantRoutes'));
app.use('/api/payments',    require('./routes/paymentRoutes'));
app.use('/api/maintenance', require('./routes/maintenanceRoutes'));
app.use('/api/dashboard',   require('./routes/dashboardRoutes'));
app.use('/api/razorpay',    require('./routes/razorpayRoutes'));

// ── Root Route ──────────────────────────────
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/login.html'));
});

// ── 404 Handler ─────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Connect MongoDB & Start Server ──────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running at http://localhost:${process.env.PORT}`);
      console.log(`📂 Frontend: http://localhost:${process.env.PORT}`);
      console.log(`🔗 API Base: http://localhost:${process.env.PORT}/api`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Failed:', err.message);
    process.exit(1);
  });
