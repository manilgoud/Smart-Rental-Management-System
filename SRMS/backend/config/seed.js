// ============================================
// config/seed.js
// Dummy Data for Testing
// Run: npm run seed
// ============================================

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Property = require('../models/Property');
const Tenant = require('../models/Tenant');
const Payment = require('../models/Payment');
const Maintenance = require('../models/Maintenance');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany();
    await Property.deleteMany();
    await Tenant.deleteMany();
    await Payment.deleteMany();
    await Maintenance.deleteMany();
    console.log('🗑  Old data cleared');

    // ── Create Landlord ──────────────────────
    const landlord = await User.create({
      name: 'Ravi Kumar',
      email: 'landlord@srms.com',
      password: '1234',
      role: 'landlord',
      phone: '9876543210'
    });

    // ── Create Tenant Users ──────────────────
    const tenantUser1 = await User.create({
      name: 'Priya Sharma',
      email: 'tenant@srms.com',
      password: '1234',
      role: 'tenant',
      phone: '9123456789'
    });
    const tenantUser2 = await User.create({
      name: 'Anil Reddy',
      email: 'anil@srms.com',
      password: '1234',
      role: 'tenant',
      phone: '9988776655'
    });
    const tenantUser3 = await User.create({
      name: 'Sneha Patel',
      email: 'sneha@srms.com',
      password: '1234',
      role: 'tenant',
      phone: '9871234567'
    });

    // ── Create Properties ────────────────────
    const prop1 = await Property.create({
      landlord: landlord._id,
      name: 'Green Valley Apartments',
      address: 'Plot 45, Madhapur',
      city: 'Hyderabad',
      type: 'Apartment',
      totalUnits: 6,
      monthlyRent: 12000,
      description: 'Modern 2BHK apartments with parking'
    });
    const prop2 = await Property.create({
      landlord: landlord._id,
      name: 'Sunrise Villas',
      address: 'Road 12, Gachibowli',
      city: 'Hyderabad',
      type: 'Villa',
      totalUnits: 3,
      monthlyRent: 20000,
      description: '3BHK villas with garden'
    });

    // ── Create Tenant Records ────────────────
    const t1 = await Tenant.create({
      landlord: landlord._id,
      user: tenantUser1._id,
      property: prop1._id,
      unit: 'A-101',
      monthlyRent: 12000,
      leaseStart: new Date('2024-01-01')
    });
    const t2 = await Tenant.create({
      landlord: landlord._id,
      user: tenantUser2._id,
      property: prop1._id,
      unit: 'B-202',
      monthlyRent: 12000,
      leaseStart: new Date('2024-01-01')
    });
    const t3 = await Tenant.create({
      landlord: landlord._id,
      user: tenantUser3._id,
      property: prop2._id,
      unit: 'V-01',
      monthlyRent: 20000,
      leaseStart: new Date('2024-02-01')
    });

    // ── Create Payment Records ───────────────
    // January - all paid
    await Payment.create([
      { landlord: landlord._id, tenant: t1._id, property: prop1._id, month: 'January 2024', amount: 12000, status: 'paid', paidDate: new Date('2024-01-03') },
      { landlord: landlord._id, tenant: t2._id, property: prop1._id, month: 'January 2024', amount: 12000, status: 'paid', paidDate: new Date('2024-01-05') },
      { landlord: landlord._id, tenant: t3._id, property: prop2._id, month: 'January 2024', amount: 20000, status: 'paid', paidDate: new Date('2024-01-04') },
      // February
      { landlord: landlord._id, tenant: t1._id, property: prop1._id, month: 'February 2024', amount: 12000, status: 'paid', paidDate: new Date('2024-02-02') },
      { landlord: landlord._id, tenant: t2._id, property: prop1._id, month: 'February 2024', amount: 12000, status: 'paid', paidDate: new Date('2024-02-01') },
      { landlord: landlord._id, tenant: t3._id, property: prop2._id, month: 'February 2024', amount: 20000, status: 'paid', paidDate: new Date('2024-02-03') },
      // March - mixed
      { landlord: landlord._id, tenant: t1._id, property: prop1._id, month: 'March 2024', amount: 12000, status: 'pending' },
      { landlord: landlord._id, tenant: t2._id, property: prop1._id, month: 'March 2024', amount: 12000, status: 'paid', paidDate: new Date('2024-03-02') },
      { landlord: landlord._id, tenant: t3._id, property: prop2._id, month: 'March 2024', amount: 20000, status: 'overdue' },
    ]);

    // ── Create Maintenance Requests ──────────
    await Maintenance.create([
      {
        landlord: landlord._id, tenant: t1._id, property: prop1._id,
        title: 'Leaking tap in bathroom',
        description: 'The bathroom tap has been leaking continuously for 2 days.',
        category: 'Plumbing', status: 'open'
      },
      {
        landlord: landlord._id, tenant: t2._id, property: prop1._id,
        title: 'AC not cooling properly',
        description: 'Air conditioner stopped cooling. Needs urgent repair.',
        category: 'AC/Appliance', status: 'in-progress',
        landlordNote: 'Technician scheduled for March 20.'
      },
      {
        landlord: landlord._id, tenant: t3._id, property: prop2._id,
        title: 'Broken window latch',
        description: 'Window latch is broken in bedroom. Security concern.',
        category: 'Carpentry', status: 'done',
        landlordNote: 'Fixed on March 10.',
        completedAt: new Date('2024-03-10')
      }
    ]);

    console.log('✅ Seed data inserted successfully!\n');
    console.log('═══════════════════════════════════');
    console.log('🔑 LOGIN CREDENTIALS:');
    console.log('─────────────────────────────────────');
    console.log('👔 LANDLORD:');
    console.log('   Email   : landlord@srms.com');
    console.log('   Password: 1234');
    console.log('─────────────────────────────────────');
    console.log('👤 TENANT 1:');
    console.log('   Email   : tenant@srms.com');
    console.log('   Password: 1234');
    console.log('👤 TENANT 2:');
    console.log('   Email   : anil@srms.com');
    console.log('   Password: 1234');
    console.log('═══════════════════════════════════');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
};

seed();
