# SocietyPro ERP — Full Stack Society Management System

## Tech Stack
- **Backend**: Node.js + Express.js
- **Frontend**: React.js (JSX, no TypeScript)
- **Database**: Microsoft SQL Server (SSMS) — Server: `SERP` / `ADMIN\SQLEXPRESS`
- **ORM**: Prisma
- **Auth**: JWT

---

## Folder Structure
```
society-erp/
├── backend/
│   ├── prisma/schema.prisma       ← DB models
│   ├── sql/setup.sql              ← Run in SSMS first
│   ├── src/
│   │   ├── index.js               ← Express server entry
│   │   ├── controllers/           ← All business logic
│   │   ├── routes/                ← REST API routes
│   │   ├── middleware/            ← JWT auth middleware
│   │   └── utils/prisma.js        ← DB client
│   └── .env                       ← DB connection string
└── frontend/
    ├── public/index.html
    └── src/
        ├── App.jsx                ← All React pages + components
        └── index.js
```

---

## Setup Instructions

### Step 1 — SQL Server Setup
1. Open **SSMS** → connect to `ADMIN\SQLEXPRESS` with Windows Authentication
2. Open file: `backend/sql/setup.sql`
3. Run the script (F5) — creates `SocietyERP` database + all tables

### Step 2 — Backend Setup
```bash
cd backend
npm install
npx prisma generate        # Generate Prisma client
```

Edit `.env` if needed:
```
# Windows Auth (your current setup):
DATABASE_URL="sqlserver://ADMIN\\SQLEXPRESS;database=SocietyERP;integratedSecurity=true;trustServerCertificate=true"

# OR SQL Auth:
DATABASE_URL="sqlserver://ADMIN\\SQLEXPRESS;database=SocietyERP;user=sa;password=YourPass;encrypt=true;trustServerCertificate=true"
```

Seed the database with sample data:
```bash
npm run seed
```

Start the backend server:
```bash
npm run dev
```
Server runs on: http://localhost:5000

### Step 3 — Frontend Setup
```bash
cd frontend
npm install
npm start
```
Frontend runs on: http://localhost:3000

---

## Login Credentials (after seeding)

| Role      | Email                        | Password     |
|-----------|------------------------------|--------------|
| Admin     | admin@societyerp.com         | Admin@123    |
| Chairman  | chairman@societyerp.com      | Chair@123    |
| Member    | amit@test.com                | Member@123   |
| Member    | varni@test.com               | Member@123   |

---

## API Endpoints

### Auth
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET  `/api/auth/profile`
- PUT  `/api/auth/profile`
- POST `/api/auth/change-password`

### Members
- GET    `/api/members`
- GET    `/api/members/:id`
- POST   `/api/members`       (Admin/Chairman)
- PUT    `/api/members/:id`   (Admin/Chairman)
- DELETE `/api/members/:id`   (Admin/Chairman)

### Notices
- GET    `/api/notices`
- POST   `/api/notices`       (Admin/Chairman)
- PUT    `/api/notices/:id`   (Admin/Chairman)
- DELETE `/api/notices/:id`   (Admin/Chairman)

### Billing
- GET   `/api/billing`
- GET   `/api/billing/stats`
- POST  `/api/billing`              (Admin)
- POST  `/api/billing/generate`     (Admin — bulk generate)
- PATCH `/api/billing/:id/pay`

### Bookings
- GET  `/api/bookings`
- GET  `/api/bookings/availability?amenity_type=garden&date=2025-04-20`
- POST `/api/bookings`
- PATCH `/api/bookings/:id/cancel`

### Payments
- GET  `/api/payments`
- POST `/api/payments`

### Contacts
- GET    `/api/contacts`
- POST   `/api/contacts`
- PUT    `/api/contacts/:id`
- DELETE `/api/contacts/:id`

### Family & Vehicles
- GET    `/api/family/my`
- POST   `/api/family`
- DELETE `/api/family/:id`
- GET    `/api/vehicles/my`
- POST   `/api/vehicles`
- DELETE `/api/vehicles/:id`

### Dashboard
- GET `/api/dashboard/stats`

---

## Roles & Permissions

| Feature              | Admin | Chairman | Member |
|----------------------|-------|----------|--------|
| View all members     | ✅    | ✅       | ✅     |
| Add/edit members     | ✅    | ✅       | ❌     |
| Post notices         | ✅    | ✅       | ❌     |
| Generate bills       | ✅    | ✅       | ❌     |
| Mark bill paid       | ✅    | ✅       | ❌     |
| Book amenities       | ✅    | ✅       | ✅     |
| Add contacts         | ✅    | ✅       | ✅     |
| View own bills       | ✅    | ✅       | ✅     |

---

## Troubleshooting

**DB Connection Error:**
- Ensure SQL Server Express is running (check Services)
- Enable TCP/IP in SQL Server Configuration Manager
- Try adding port: `ADMIN\\SQLEXPRESS,1433`

**Prisma generate fails:**
- Run `npm install` in backend folder
- Ensure `prisma` package is in devDependencies

**CORS error in browser:**
- Ensure `FRONTEND_URL=http://localhost:3000` in `.env`
- Backend must be running on port 5000
