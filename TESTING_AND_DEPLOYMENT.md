# 🚀 Testing & Live Deployment Guide

## Part 1: Run for Local Testing

### Option A: Quick Start (Easiest)

#### Step 1: Open Two Terminals

**Terminal 1 - Backend (Port 5000)**
```bash
cd d:\Project\ERP\SocietyPro-ERP-FIXED\society-erp\backend
npm install
npm run setup
npm run smart-start
```

**Terminal 2 - Frontend (Port 3000)**
```bash
cd d:\Project\ERP\SocietyPro-ERP-FIXED\society-erp\frontend
npm install
npm start
```

#### Step 2: Wait for Messages

**Backend Ready:**
```
✅ Server running on http://localhost:5000
```

**Frontend Ready:**
```
✅ Compiled successfully!
Open http://localhost:3000 to view it in the browser
```

#### Step 3: Test in Browser
- Open: http://localhost:3000
- Login with: `admin@example.com` / `admin123`
- Test all pages & features

---

### Option B: Full Setup (Recommended First Time)

#### Step 1: Install Dependencies

**Backend:**
```bash
cd backend
npm install
npx prisma generate
npm run seed
```

**Frontend:**
```bash
cd frontend
npm install
npm install lucide-react
```

#### Step 2: Run Backend
```bash
cd backend
npm run dev          # Development mode with auto-reload (requires nodemon)
# OR
npm run smart-start  # Automatic setup mode
# OR
node src/index.js    # Simple start
```

Expected output:
```
[Prisma] Database created successfully
✅ Server is running on port 5000
```

#### Step 3: Run Frontend
```bash
cd frontend
npm start
```

Expected output:
```
webpack compiled successfully
Compiled successfully!
```

#### Step 4: Test

| Page | URL | Demo Login |
|------|-----|-----------|
| Login | http://localhost:3000 | admin@example.com / admin123 |
| Dashboard | http://localhost:3000/dashboard | (auto after login) |
| Members | http://localhost:3000/members | (click sidebar) |
| Notices | http://localhost:3000/notices | (click sidebar) |
| Billing | http://localhost:3000/billing | (click sidebar) |
| Bookings | http://localhost:3000/bookings | (click sidebar) |
| Settings | http://localhost:3000/settings | (click user icon) |

---

## Part 2: Deploy Live from GitHub

### Option 1: Vercel (FASTEST - Recommended) ⭐

#### Step 1: Push to GitHub
```bash
# In project root
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/society-erp.git
git push -u origin main
```

#### Step 2: Deploy Frontend on Vercel

1. Go to https://vercel.com
2. Click "New Project"
3. Connect GitHub account
4. Select your `society-erp` repository
5. Configure:
   - **Framework**: React
   - **Build Command**: `cd frontend && npm run build`
   - **Output Directory**: `frontend/build`
   - **Environment Variable**:
     ```
     REACT_APP_API_URL=https://your-backend-url.com
     ```
6. Click "Deploy"

**Frontend URL**: `https://society-erp.vercel.app`

#### Step 3: Deploy Backend (Choose One)

**Option A: Heroku (Free with GitHub)**
```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create society-erp-backend

# Set environment variables
heroku config:set DATABASE_URL="your_database_url"

# Deploy
git subtree push --prefix backend heroku main
```

**Option B: Railway (Simpler)**
1. Go to https://railway.app
2. Click "New Project"
3. Connect GitHub
4. Select `society-erp` repository
5. Select `backend` folder
6. Add environment variables
7. Deploy (auto)

**Backend URL**: `https://society-erp-backend.up.railway.app`

#### Step 4: Update Frontend Environment
In Vercel dashboard, update `REACT_APP_API_URL` to your backend URL.

---

### Option 2: GitHub Pages (Frontend Only)

#### Step 1: Update package.json
```json
{
  "homepage": "https://YOUR_USERNAME.github.io/society-erp",
  "scripts": {
    "build": "react-scripts build",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

#### Step 2: Install & Deploy
```bash
cd frontend
npm install --save-dev gh-pages
npm run deploy
```

#### Step 3: Access
- Frontend: `https://YOUR_USERNAME.github.io/society-erp`
- (You still need a backend for full functionality)

---

### Option 3: Docker + GitHub Actions (Advanced)

#### Step 1: Create Dockerfile for Backend
```dockerfile
# backend/Dockerfile
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 5000

CMD ["npm", "run", "start"]
```

#### Step 2: Create Dockerfile for Frontend
```dockerfile
# frontend/Dockerfile
FROM node:18 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
```

#### Step 3: Deploy with GitHub Actions

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build Docker images
        run: |
          docker build -t backend ./backend
          docker build -t frontend ./frontend
      
      - name: Push to registry
        # Configure based on your hosting (Docker Hub, AWS ECR, etc)
        run: |
          echo "Pushing images..."
```

---

## Part 3: Full Live Testing Checklist

### Pre-Deployment Tests (Local)

#### Backend Tests
- [ ] Server starts without errors
- [ ] Database connection works
- [ ] Prisma migrations complete
- [ ] API endpoints respond (test with Postman)

```bash
# Test API endpoint
curl http://localhost:5000/api/members
```

#### Frontend Tests
- [ ] App compiles without warnings
- [ ] Login page loads
- [ ] Can login with demo account
- [ ] Dashboard displays correctly
- [ ] All navigation links work
- [ ] Responsive on mobile (F12 → Toggle device)
- [ ] No console errors (F12 → Console)

### Deployment Tests

#### Vercel Frontend
- [ ] Site loads in browser
- [ ] Login works
- [ ] Connected to backend API
- [ ] Pages load correctly
- [ ] Mobile responsive

#### Backend (Heroku/Railway)
- [ ] API responds to requests
- [ ] Database queries work
- [ ] Logs show no errors
- [ ] Response times acceptable

---

## Complete Setup Command

### One-Liner for Full Setup

**Backend:**
```powershell
cd d:\Project\ERP\SocietyPro-ERP-FIXED\society-erp\backend; npm install; npx prisma generate; npm run seed; npm run smart-start
```

**Frontend (in another terminal):**
```powershell
cd d:\Project\ERP\SocietyPro-ERP-FIXED\society-erp\frontend; npm install; npm install lucide-react; npm start
```

---

## Environment Variables Setup

### Backend (.env file)

Create `backend/.env`:
```env
# Database
DATABASE_URL="your_database_connection_string"

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET="your_super_secret_key_change_this"

# CORS
CORS_ORIGIN="http://localhost:3000"
```

### Frontend (.env file)

Create `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development
```

---

## Troubleshooting

### Issue: "Port 5000 already in use"
```bash
# Kill existing process
taskkill /F /IM node.exe

# Then restart
npm run smart-start
```

### Issue: "Database error"
```bash
# Reinitialize database
cd backend
npx prisma generate
npx prisma db push
npm run seed
```

### Issue: "npm install fails"
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules
rm -r node_modules

# Reinstall
npm install
```

### Issue: "Frontend blank page"
1. Open DevTools (F12)
2. Check Console for errors
3. Check Network tab for API calls
4. Make sure backend is running

### Issue: "Login fails"
1. Backend must be running on port 5000
2. Database must be seeded
3. Check Network tab to see API response

---

## Quick Reference

### Ports
```
Frontend: http://localhost:3000
Backend:  http://localhost:5000
```

### Demo Accounts
```
Admin:   admin@example.com / admin123
Member:  member@example.com / member123
```

### Important Folders
```
backend/
  ├── src/
  ├── prisma/        (database schema)
  └── sql/           (initial setup)

frontend/
  ├── src/
  ├── components/    (UI components)
  └── pages/         (pages)
```

### Useful Commands

**Backend:**
```bash
npm run dev              # Development with auto-reload
npm run smart-start     # Automatic full setup
npm run seed            # Reset database with demo data
npx prisma studio      # Visual database manager
```

**Frontend:**
```bash
npm start               # Start dev server
npm run build           # Production build
npm test                # Run tests
```

---

## GitHub Live Deployment Steps (Summary)

### For Maximum Speed (5 minutes):

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Deploy Frontend (Vercel)**
   - Visit https://vercel.com
   - Import project
   - Click Deploy (2 minutes)

3. **Deploy Backend (Railway)**
   - Visit https://railway.app
   - Import project from GitHub
   - Auto-deploy (2 minutes)

4. **Update Frontend Environment**
   - Set `REACT_APP_API_URL` in Vercel
   - Redeploy

5. **Test Live**
   - Visit your Vercel URL
   - Should work exactly like local version

---

## Health Check Endpoints

Once live, test these URLs:

**Backend Health:**
```
GET http://your-backend-url/api/members
GET http://your-backend-url/api/notices
```

**Frontend:**
```
https://your-vercel-url
```

Both should return data or UI without errors.

---

## Next Steps

1. ✅ Test locally first (this guide - Part 1)
2. ✅ Push to GitHub
3. ✅ Deploy frontend to Vercel
4. ✅ Deploy backend to Railway/Heroku
5. ✅ Connect them
6. ✅ Test live deployment
7. ✅ Share the live URL!

---

**Ready to go live? Start with Part 1 (Local Testing) first!** 🚀
