// ============================================
// controllers/dashboardController.js
// Stats for Landlord & Tenant Dashboards
// ============================================

const Property = require('../models/Property');
const Tenant = require('../models/Tenant');
const Payment = require('../models/Payment');
const Maintenance = require('../models/Maintenance');

// ── LANDLORD Dashboard Stats ─────────────────
exports.landlordStats = async (req, res) => {
  try {
    const landlordId = req.user._id;
    const currentMonth = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });

    // Count all data
    const [totalProperties, totalTenants, allPayments, maintenanceStats] = await Promise.all([
      Property.countDocuments({ landlord: landlordId }),
      Tenant.countDocuments({ landlord: landlordId, isActive: true }),
      Payment.find({ landlord: landlordId }),
      Maintenance.aggregate([
        { $match: { landlord: landlordId } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
    ]);

    // Payment stats
    const paidPayments   = allPayments.filter(p => p.status === 'paid');
    const pendingPayments = allPayments.filter(p => p.status === 'pending');
    const overduePayments = allPayments.filter(p => p.status === 'overdue');
    const totalCollected  = paidPayments.reduce((sum, p) => sum + p.amount, 0);

    // This month income
    const thisMonthIncome = allPayments
      .filter(p => p.status === 'paid' && p.month === currentMonth)
      .reduce((sum, p) => sum + p.amount, 0);

    // Maintenance counts
    const maintCounts = { open: 0, 'in-progress': 0, done: 0 };
    maintenanceStats.forEach(m => { maintCounts[m._id] = m.count; });

    res.json({
      success: true,
      data: {
        totalProperties,
        totalTenants,
        payments: {
          total: allPayments.length,
          paid: paidPayments.length,
          pending: pendingPayments.length,
          overdue: overduePayments.length,
          totalCollected,
          thisMonthIncome
        },
        maintenance: maintCounts
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── TENANT Dashboard Stats ───────────────────
exports.tenantStats = async (req, res) => {
  try {
    const tenant = await Tenant.findOne({ user: req.user._id, isActive: true })
      .populate('property', 'name address')
      .populate('user', 'name email');

    if (!tenant) {
      return res.status(404).json({ success: false, message: 'No tenant record found' });
    }

    const payments = await Payment.find({ tenant: tenant._id });
    const maintenance = await Maintenance.find({ tenant: tenant._id });

    const paidCount   = payments.filter(p => p.status === 'paid').length;
    const pendingCount = payments.filter(p => p.status === 'pending').length;
    const totalPaid   = payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);

    // Latest payment
    const latestPayment = payments.sort((a, b) => b.createdAt - a.createdAt)[0];

    res.json({
      success: true,
      data: {
        tenant: {
          name: req.user.name,
          unit: tenant.unit,
          monthlyRent: tenant.monthlyRent,
          property: tenant.property
        },
        payments: {
          total: payments.length,
          paid: paidCount,
          pending: pendingCount,
          totalPaid,
          latestStatus: latestPayment?.status || 'N/A',
          latestMonth: latestPayment?.month || 'N/A'
        },
        maintenance: {
          total: maintenance.length,
          open: maintenance.filter(m => m.status === 'open').length,
          inProgress: maintenance.filter(m => m.status === 'in-progress').length,
          done: maintenance.filter(m => m.status === 'done').length
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
