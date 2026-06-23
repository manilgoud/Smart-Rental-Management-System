# 🏠 Smart Rental Management System (SRMS)
### Mini Project — CSE (AI & ML), Batch No. 15

---

## 📁 PROJECT STRUCTURE

```
SRMS/
├── backend/
│   ├── server.js                  ← Main server entry point
│   ├── .env                       ← Config (port, DB, JWT)
│   ├── package.json
│   ├── config/
│   │   └── seed.js                ← Dummy data loader
│   ├── middleware/
│   │   └── authMiddleware.js      ← JWT auth + role check
│   ├── models/
│   │   ├── User.js                ← User (Landlord/Tenant)
│   │   ├── Property.js            ← Property schema
│   │   ├── Tenant.js              ← Tenant record
│   │   ├── Payment.js             ← Rent payment
│   │   └── Maintenance.js         ← Maintenance request
│   ├── controllers/
│   │   ├── authController.js      ← Login / Register
│   │   ├── propertyController.js  ← Property CRUD
│   │   ├── tenantController.js    ← Tenant management
│   │   ├── paymentController.js   ← Payment tracking
│   │   ├── maintenanceController.js← Maintenance
│   │   └── dashboardController.js ← Stats / Reports
│   └── routes/
│       ├── authRoutes.js
│       ├── propertyRoutes.js
│       ├── tenantRoutes.js
│       ├── paymentRoutes.js
│       ├── maintenanceRoutes.js
│       └── dashboardRoutes.js
└── frontend/
    ├── css/
    │   └── style.css              ← All styles
    ├── js/
    │   └── api.js                 ← API helper functions
    └── pages/
        ├── login.html             ← Login / Register page
        ├── landlord-dashboard.html← Landlord portal
        └── tenant-dashboard.html  ← Tenant portal
```

---

## ⚙️ SETUP — STEP BY STEP

### STEP 1: Install Node.js
- Go to: https://nodejs.org
- Download LTS version → Install (Next → Next → Finish)
- Restart PC

### STEP 2: Install MongoDB
- Go to: https://www.mongodb.com/try/download/community
- Download → Install with default settings
- Make sure "Install MongoDB as a Service" is CHECKED ✅

### STEP 3: Open Project in VS Code
- Extract the project folder
- Open VS Code → File → Open Folder → select SRMS folder

### STEP 4: Open Terminal in VS Code
- Top menu → Terminal → New Terminal

### STEP 5: Go to backend folder
```bash
cd backend
```

### STEP 6: Install packages
```bash
npm install
```
(Wait 1-2 minutes)

### STEP 7: Load dummy data
```bash
npm run seed
```
You will see login credentials printed ✅

### STEP 8: Start the server
```bash
npm run dev
```
You should see:
```
✅ MongoDB Connected Successfully
🚀 Server running at http://localhost:5000
```

### STEP 9: Open in Browser
Go to: **http://localhost:5000**

---

## 🔑 LOGIN CREDENTIALS

| Role     | Email                | Password |
|----------|----------------------|----------|
| Landlord | landlord@srms.com    | 1234     |
| Tenant 1 | tenant@srms.com      | 1234     |
| Tenant 2 | anil@srms.com        | 1234     |

---

## 🔗 ALL API ENDPOINTS

### AUTH
| Method | URL                  | Description     |
|--------|----------------------|-----------------|
| POST   | /api/auth/register   | Register user   |
| POST   | /api/auth/login      | Login           |
| GET    | /api/auth/me         | Get own profile |

### PROPERTIES (Landlord)
| Method | URL                    | Description       |
|--------|------------------------|-------------------|
| GET    | /api/properties        | Get all           |
| POST   | /api/properties        | Add new           |
| PUT    | /api/properties/:id    | Update            |
| DELETE | /api/properties/:id    | Delete            |

### PAYMENTS
| Method | URL                          | Description       |
|--------|------------------------------|-------------------|
| GET    | /api/payments                | All payments      |
| GET    | /api/payments/my             | Tenant's own      |
| POST   | /api/payments                | Record payment    |
| PUT    | /api/payments/:id/mark-paid  | Mark as paid      |
| PUT    | /api/payments/:id/remind     | Send reminder     |
| GET    | /api/payments/report         | Income report     |

### MAINTENANCE
| Method | URL                           | Description      |
|--------|-------------------------------|------------------|
| GET    | /api/maintenance              | All requests     |
| GET    | /api/maintenance/my           | Tenant's own     |
| POST   | /api/maintenance              | Submit request   |
| PUT    | /api/maintenance/:id/status   | Update status    |
| PUT    | /api/maintenance/:id/note     | Add note         |
| DELETE | /api/maintenance/:id          | Delete           |

---

## 🏗️ ARCHITECTURE — MVC Pattern

```
Request → Route → Controller → Model → MongoDB
                      ↓
                   Response
```

- **Model**      → MongoDB Schema (what data looks like)
- **View**       → HTML Frontend Pages
- **Controller** → Business logic (what to do with data)
- **Route**      → URL mapping (which URL calls which controller)

---

## 🧪 VIVA QUESTIONS & ANSWERS

**Q: What is JWT?**
A: JSON Web Token — used for secure authentication. After login, server gives a token. Every API request sends this token to prove identity.

**Q: What is MongoDB?**
A: NoSQL database that stores data as JSON documents. We use it to store users, properties, payments, maintenance records.

**Q: What is REST API?**
A: A standard way to build web APIs using HTTP methods — GET (read), POST (create), PUT (update), DELETE (remove).

**Q: What is MVC architecture?**
A: Model-View-Controller design pattern that separates data (Model), display (View), and logic (Controller).

**Q: What is role-based access?**
A: Different users have different permissions. Landlord can add properties & mark payments. Tenant can only view their own data & submit requests.

---
*Guide: Ms. Amisha Raj | Department: CSE (AI & ML)*
