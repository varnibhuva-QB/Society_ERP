# 🏢 SocietyPro ERP - Complete Setup & Run Guide

This guide provides step-by-step instructions to set up and run the SocietyPro ERP system. Follow each step carefully.

---

## 📋 Prerequisites

Before starting, ensure you have the following installed:

1. **Node.js** (v16 or higher) - Download from https://nodejs.org/
2. **Microsoft SQL Server** with SSMS (SQL Server Management Studio)
   - Instance: `ADMIN\SQLEXPRESS` (or your configured instance)
   - Database: `SocietyERP` (will be created during setup)
3. **Git** (optional, for cloning)

**Verify installations:**
```bash
node --version    # Should show v16.x.x or higher
npm --version     # Should show 8.x.x or higher
```

---

## 🚀 Quick Start (5 steps)

### Step 1: Navigate to Project Root
```bash
cd d:\Project\ERP\SocietyPro-ERP-FIXED\society-erp
```

### Step 2: Setup Backend Database
Open **SQL Server Management Studio** and execute:

1. Connect to your SQL Server instance (ADMIN\SQLEXPRESS)
2. Open a **New Query** window
3. Copy-paste and execute the SQL from `backend/sql/setup.sql`
4. Verify database `SocietyERP` is created

*Expected: Database created with all tables*

### Step 3: Start Backend Server
```bash
# Terminal Window 1 (Backend)
cd backend
npm install     # First time only, installs dependencies
node start.js   # or: npm start
```

**Expected Output:**
```
✓ Backend server running on http://localhost:5000
✓ Prisma client initialized
✓ Database connected
```

### Step 4: Start Frontend Server
```bash
# Terminal Window 2 (Frontend)
cd frontend
npm install     # First time only, installs dependencies
npm start       # or: npm run dev
```

**Expected Output:**
```
✓ Frontend compiled successfully
✓ App running on http://localhost:3000
```

### Step 5: Access & Login
1. Open browser → **http://localhost:3000**
2. Login with credentials:
   - **Email:** `demo@example.com`
   - **Password:** `Password123`

✅ **System Ready!** Continue to "Feature Walkthrough" below.

---

## 🐛 Troubleshooting

### Port Already in Use
If you see `EADDRINUSE: address already in use :::5000` or `:3000`:

**Windows PowerShell:**
```powershell
# Kill all Node processes
taskkill /F /IM node.exe

# Restart backend and frontend
```

**Alternative (use different port):**
```bash
# In backend/start.js, change port: 5001
# In frontend/.env, set: REACT_APP_API_URL=http://localhost:5001
```

### Database Connection Error
**Error:** `Connection refused` or `Login failed`

**Solution:**
1. Verify SQL Server is running (Services → SQL Server (SQLEXPRESS))
2. Check connection string in `backend/.env`:
   ```
   DATABASE_URL=sqlserver://ADMIN\SQLEXPRESS;database=SocietyERP;integratedSecurity=true;trustServerCertificate=true;encrypt=false
   ```
3. Restart backend: `node start.js`

### Backend Not Responding
**Error:** `GET /api/dashboard/stats` returns error

**Solution:**
```bash
# In backend directory:
npm install                    # Reinstall dependencies
npx prisma generate          # Regenerate Prisma client
npx prisma db push           # Sync schema
node start.js                # Restart
```

### Login Page Shows Blank/Errors
**Error:** Frontend doesn't load or shows connection errors

**Solution:**
```bash
# In frontend directory:
npm cache clean --force
rm -r node_modules
npm install
npm start
```

---

## 📚 Feature Walkthrough

### 🔐 Authentication
- **Login Page:** Enter email and password
- **Register:** Create new account (first-time setup)
- **Logout:** Click user icon → Logout

**Test Account:**
- Email: `demo@example.com`
- Password: `Password123`

---

### 📊 Dashboard (Main Hub)
After login, you see the Dashboard with:

1. **📈 Stats Cards** - Quick overview:
   - Total Members
   - Active Vehicles
   - Upcoming Bookings
   - Total Bills

2. **🎯 Quick Shortcuts** - Click any to navigate instantly:
   - View Notices
   - Book Amenity
   - Manage Vehicles
   - Important Contacts
   - Payment History
   - Bills & Maintenance
   - *(Chairman only: Society Funds, Treasurer Panel)*

3. **📢 Recent Notices** - Click any notice to read full description
4. **📅 Upcoming Bookings** - Shows next 5 bookings with time & amenity

---

### 👥 Members Management
**Access:** Sidebar → Members (Admin/Chairman only)

**Features:**
- View all members with role badges
- Add new member (form with name, email, phone, role)
- Remove member from society
- View member details

**Try:** Add a new member → Fill all fields → Click "Add Member"

---

### 🔔 Notice Board
**Access:** Sidebar → Notices OR Dashboard → Quick Shortcut

**For Members:**
- View all notices with priority levels (High/Medium/Low)
- Click any notice to read full description
- See notice date and chairman name

**For Chairman:**
- Everything members can do, PLUS:
- **Post New Notice** - Title, description, priority
- Notices appear on all members' dashboards

**Try:** Chairman posts notice → Members see on dashboard → Click to view

---

### 🚗 Vehicle Management
**Access:** Sidebar → Vehicles OR Dashboard → Quick Shortcut

**All Members:**
- **My Vehicles** - Register your personal vehicle
  - Add vehicle (license plate, model, color)
  - Remove your vehicle
- **All Society Vehicles** - View every member's vehicle
  - See who owns each vehicle
  - View vehicle details with photos

**Try:** Add a vehicle → See it in "My Vehicles" → View in "All Vehicles"

---

### 🏢 Amenity Booking
**Access:** Sidebar → Book Amenity OR Dashboard → Quick Shortcut

**Features:**
- Select amenity (Garden, Terrace, Parking, Gym, Pool)
- Choose date
- Select time slot (morning, afternoon, evening)
- Choose duration (1-12 hours)
- See dynamic price: `hours × amenity_rate`
- Confirm booking

**Pricing:** Each amenity has hourly rate set by chairman

**Try:** Select Garden → Pick date → Choose 3 hours → See price → Book

---

### 💰 Amenities Management (Admin/Chairman)
**Access:** Sidebar → Amenities

**Admin/Chairman Features:**
- View all amenities with icons
- **Add Amenity** - New amenity type with rent/hour
- **Edit Amenity** - Change name, description, or hourly rate
- **Delete Amenity** - Remove amenity from system

**Members:**
- View all amenities (read-only)

**Try:** Add "Tennis Court" at ₹200/hour → Edit to ₹250 → Delete

---

### 💵 Billing & Payments
**Access:** Sidebar → Bills OR Payments

**Bills Page:**
- View all maintenance bills
- See bill amount, due date, status (Paid/Pending)
- Make payment directly

**Payments Page:**
- View payment history
- See all transactions with date & amount

**Try:** Click bill → "Pay Now" → Submit

---

### 🏠 Society Funds (Chairman Only)
**Access:** Sidebar → Society Funds

**Features:**
- View total collected funds
- See breakdown by member
- Track fund distribution
- Remove member's deposits

**Try:** Chairman views funds collected from each member

---

### 👨‍💼 Treasurer Panel (Chairman Only)
**Access:** Sidebar → Treasurer Panel

**Features:**
- Financial overview
- Income vs expenses
- Transaction history
- Generate reports

**Try:** Chairman reviews monthly transactions

---

### 📞 Important Contacts
**Access:** Sidebar → Contacts OR Dashboard → Quick Shortcut

**Features:**
- View all important contacts (society office, emergency, etc.)
- Add/edit contact information
- Quick call links

---

### ⚙️ Settings
**Access:** Sidebar → Settings OR Dashboard → Quick Shortcut

**Profile Settings:**
- Update name
- Update contact number
- Update blood group
- Save profile changes

**Try:** Edit your profile → Update blood group → Save

---

## 🎨 UI Features

### Premium Design Elements
- **Gradient backgrounds** on cards and stats
- **Smooth animations** on button hover
- **Color-coded status badges** (High/Medium/Low priority)
- **Responsive grid layout** for amenities
- **Emoji icons** for visual indicators
- **Modal dialogs** for detailed views

### Interactive Elements
- Click notices → See full description
- Hover on cards → See shadow and elevation effects
- Button feedback → Hover state transitions
- Table sorting → Click headers to sort
- Auto-refresh → Data updates after actions

---

## 🔒 Security Features

1. **JWT Authentication** - Token-based login
2. **Password Hashing** - bcryptjs encryption
3. **Role-Based Access** - Admin/Chairman/Member permissions
4. **Protected Routes** - Middleware checks authorization
5. **CORS Enabled** - Secure cross-origin requests
6. **Rate Limiting** - Prevents API abuse
7. **Input Validation** - Server-side validation

---

## 📁 Project Structure

```
society-erp/
├── backend/
│   ├── src/
│   │   ├── index.js              # Server entry point
│   │   ├── controllers/          # Business logic
│   │   ├── routes/               # API endpoints
│   │   ├── middleware/           # Auth & validation
│   │   └── utils/                # Helper functions
│   ├── prisma/
│   │   ├── schema.prisma         # Database schema
│   │   └── seed.js               # Seed data
│   ├── sql/
│   │   └── setup.sql             # Database setup
│   ├── package.json
│   └── start.js                  # Start script
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx               # Main component (all pages)
│   │   ├── index.js              # React entry
│   │   ├── context/              # Auth context
│   │   └── utils/                # API client, helpers
│   ├── public/
│   │   └── index.html
│   └── package.json
│
├── RUN_INSTRUCTIONS.md           # This file
└── README.md
```

---

## 📊 Database Schema

### Tables Created:
1. **Member** - User accounts and profiles
2. **FamilyMember** - Family members of registered users
3. **Vehicle** - Registered vehicles in society
4. **Notice** - Chairman announcements
5. **MaintenanceBill** - Monthly/periodic bills
6. **Payment** - Payment records
7. **AmenityBooking** - Amenity bookings with duration
8. **ImportantContact** - Emergency/important contacts

---

## 🧪 Testing Checklist

Before considering setup complete, test these:

- [ ] Login with demo account
- [ ] View dashboard with all stats
- [ ] Click notice on dashboard → see full description
- [ ] Add & remove vehicle
- [ ] View all society vehicles
- [ ] Book an amenity with hours selection
- [ ] See correct price calculation
- [ ] View payment history
- [ ] Update profile in settings
- [ ] (Chairman) Post new notice
- [ ] (Chairman) Add/edit/delete amenity
- [ ] (Chairman) Manage members

---

## 📞 Support & Debugging

### Check Backend Is Running
```bash
# In PowerShell, run:
netstat -ano | findstr :5000
# Should show: TCP    127.0.0.1:5000    LISTENING
```

### Check Frontend Is Running
```bash
# In PowerShell, run:
netstat -ano | findstr :3000
# Should show: TCP    127.0.0.1:3000    LISTENING
```

### View Backend Logs
In the backend terminal window, logs show:
- API requests with timestamps
- Database queries
- Error messages
- Authentication attempts

### Clear Browser Cache
```
Ctrl + Shift + Delete → Clear browsing data → Visit website
```

### Reset Everything
```bash
# Kill all processes
taskkill /F /IM node.exe

# Clear frontend
cd frontend
npm cache clean --force
rm -r node_modules package-lock.json
npm install

# Clear backend
cd ../backend
rm -r node_modules package-lock.json
npm install

# Restart both servers
```

---

## 🎉 Success Indicators

✅ **Setup Complete When:**
1. Backend terminal shows "Server running on port 5000"
2. Frontend opens at localhost:3000 without errors
3. You can login with demo credentials
4. Dashboard displays stats
5. All menu items shown in sidebar
6. You can navigate between pages smoothly

---

## 📝 Notes

- **Database:** Uses SQL Server with Prisma ORM
- **Authentication:** JWT tokens stored in localStorage
- **API Base:** http://localhost:5000/api
- **Frontend Framework:** React.js
- **Port Conflicts:** See Troubleshooting section above
- **First Time:** npm install may take 2-3 minutes

---

## ✨ Features Implemented

✅ User authentication & registration
✅ Member management (add/remove)
✅ Notice board (post & view)
✅ Vehicle registration & tracking
✅ Amenity booking with hourly rates
✅ Amenities management (add/edit/delete)
✅ Billing & payment system
✅ Important contacts
✅ Dashboard with quick stats
✅ User profile settings
✅ Society funds tracking (chairman)
✅ Role-based access control
✅ Premium UI with gradients & animations
✅ Responsive design
✅ Real-time data updates

---

## 🚀 Next Steps After Setup

1. **Explore the System**
   - Log in as member and explore all features
   - Switch to chairman role to see admin features

2. **Customize Settings**
   - Update amenity pricing
   - Add important contacts
   - Configure bill schedules

3. **Add Test Data**
   - Register multiple members
   - Add vehicles
   - Create sample notices

4. **Train Users**
   - Share login credentials
   - Show dashboard walkthrough
   - Explain booking process

---

## 📧 Contact Form Submission

All features are **fully implemented and tested**. If you encounter any issues:

1. Check Troubleshooting section
2. Verify all prerequisites installed
3. Follow steps in exact order
4. Check browser console for errors (F12)
5. Check backend terminal for API errors

---

**Version:** SocietyPro ERP v1.0
**Last Updated:** 2024
**Status:** ✅ Production Ready

Good luck! 🎉
