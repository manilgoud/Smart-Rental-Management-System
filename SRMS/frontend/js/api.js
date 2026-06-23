// ============================================
// js/api.js  — API Helper Functions
// All frontend API calls go through here
// ============================================

const BASE = '/api';  // Backend base URL

// ── Save / Get token from localStorage ──────
const getToken  = ()       => localStorage.getItem('srms_token');
const getUser   = ()       => JSON.parse(localStorage.getItem('srms_user') || '{}');
const saveAuth  = (token, user) => {
  localStorage.setItem('srms_token', token);
  localStorage.setItem('srms_user', JSON.stringify(user));
};
const clearAuth = () => {
  localStorage.removeItem('srms_token');
  localStorage.removeItem('srms_user');
};

// ── Redirect if not logged in ────────────────
const requireAuth = (redirectRole = null) => {
  const token = getToken();
  const user  = getUser();
  if (!token) {
    window.location.href = '/pages/login.html';
    return false;
  }
  if (redirectRole && user.role !== redirectRole) {
    // Wrong role — send to correct dashboard
    window.location.href = user.role === 'landlord'
      ? '/pages/landlord-dashboard.html'
      : '/pages/tenant-dashboard.html';
    return false;
  }
  return true;
};

// ── Main API Request Function ────────────────
const api = async (method, endpoint, body = null) => {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  try {
    const res  = await fetch(`${BASE}${endpoint}`, options);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Something went wrong');
    return data;
  } catch (err) {
    throw err;
  }
};

// Shorthand helpers
const GET    = (url)        => api('GET',    url);
const POST   = (url, body)  => api('POST',   url, body);
const PUT    = (url, body)  => api('PUT',    url, body);
const DELETE = (url)        => api('DELETE', url);

// ── Toast Notification ────────────────────────
const toast = (message, type = 'info') => {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.className = `show ${type}`;
  setTimeout(() => { el.className = ''; }, 3200);
};

// ── Modal Helper ──────────────────────────────
const openModal  = (id) => document.getElementById(id)?.classList.add('open');
const closeModal = (id) => document.getElementById(id)?.classList.remove('open');

// ── Format currency ───────────────────────────
const formatINR = (n) => '₹' + Number(n).toLocaleString('en-IN');

// ── Close modal when clicking outside ────────
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
  }
});
