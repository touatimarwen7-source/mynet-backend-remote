# MyNet.tn - B2B Procurement Platform

## Overview
MyNet.tn is a production-ready B2B procurement platform for the private sector, designed with a unified institutional theme and enterprise-grade security. Its purpose is to provide a robust, secure, and efficient solution for B2B transactions, featuring a clean, professional user experience.

## 🔄 Current Status (Latest Audit - Nov 22, 2025)
- ✅ Database: 22 tables created and initialized
- ✅ Backend API: Running on port 3000, all endpoints available
- ✅ Frontend: Running on port 5000, UI fully loaded
- ⚠️ Authentication: Login works (Backend) but Token persistence has issues in Frontend (Replit iframe)
- 🟡 Test Data: Only Super Admin user (no test data for other features)
- 📋 Tests: 86 Frontend tests passing, 0 Backend tests

## User Preferences
I prefer simple language and clear explanations. I want iterative development with small, testable changes. Please ask before making any major architectural changes or introducing new dependencies. I prefer that the agent works in the `/frontend` directory and does not make changes in the `/backend` directory.

## System Architecture
The platform utilizes a React frontend (Vite) and a Node.js backend with PostgreSQL database.

### UI/UX Decisions
- **Design Principle**: All styles defined via `frontend/src/theme/theme.js`
- **Framework**: Exclusive use of Material-UI (MUI v7.3.5)
- **Color Palette**: #0056B3 (primary), #F9F9F9 (background), #212121 (text)
- **Styling**: 4px border radius, 8px spacing, Roboto font

### Technical Stack
- **Frontend**: React 18 + Vite 7.2.4 + Material-UI v7.3.5
- **Backend**: Node.js 20 + Express + PostgreSQL
- **Authentication**: JWT tokens + httpOnly cookies
- **Security**: CSRF protection, CSP headers, XSS protection

### Database (PostgreSQL)
- 22 tables created
- Connection pool: max 30 connections, min 10 idle
- Initialization: `npm run db:init`

### Super Admin User
- Email: superadmin@mynet.tn
- Password: SuperAdmin@123456
- Role: super_admin

## 🐛 Known Issues (Critical Priority)

### 1. 🔴 Token Persistence in Frontend (Critical)
**Status:** Blocking authentication after login
**Files:** tokenManager.js, App.jsx, axiosConfig.js
**Cause:** Replit iframe storage limitations + overly aggressive token clearing
**Solution Implemented:** 
- ✅ sessionStorage + localStorage + memory storage layer
- ✅ Removed aggressive clearTokens from error handlers
- ⚠️ Still needs iframe compatibility fixes

### 2. 🟡 Missing Test Data (Medium)
**Status:** Prevents testing of tender cycle and user features
**Solution:** Need to create backend/scripts/seedData.js that adds:
- 10 test users (buyers + suppliers)
- 5-10 tender samples
- 10-20 offer samples

### 3. 🟡 Admin Dashboard Not Fully Tested (Medium)
**Status:** Components exist but not tested with real database
**Components:** AdminDashboard, UserRoleManagement, ContentManager, SystemConfig, AdminAnalytics
**Need:** End-to-end testing with real data

### 4. 🟠 No Backend Tests (Low Priority)
**Status:** 87 backend files with no tests
**Solution:** Add Jest tests for controllers and routes

## 📋 Untested Features & Scenarios

### Tender Cycle (Complete Flow)
- [ ] Create new tender
- [ ] View tender list with filters/pagination
- [ ] Submit offer on tender
- [ ] View submitted offers
- [ ] Evaluate offers
- [ ] Award winning offer
- [ ] Generate purchase order
- [ ] Create invoice

### User Services
- [ ] Update user profile
- [ ] Upload profile picture
- [ ] Change password
- [ ] Send messages between users
- [ ] View ratings and reviews

### Admin Dashboard
- [ ] Manage users (view, edit, delete, block)
- [ ] Edit static pages (About, Terms, Privacy)
- [ ] Upload and manage files
- [ ] View system analytics
- [ ] Export audit logs

## 📊 Completeness Report

| Component | Completion | Status |
|-----------|-----------|--------|
| Database Schema | 100% | ✅ |
| Backend API | 90% | ✅ |
| Frontend UI | 85% | ✅ |
| Authentication | 70% | ⚠️ |
| Admin Dashboard | 85% | ✅ (untested) |
| Tender Cycle | 0% | ❌ (no test data) |
| User Services | 0% | ❌ (untested) |
| Backend Tests | 0% | ❌ |
| Frontend Tests | 100% | ✅ (86 passing) |

## 🚀 Next Steps

### Immediate (Before Production)
1. **Fix Token Persistence** - 30 minutes
   - Test login → authentication persistence flow
   - May need to use in-memory store only for iframe

2. **Add Test Data** - 20 minutes
   - Create seedData.js script
   - Add sample tenders, offers, users

3. **Test Tender Cycle** - 45 minutes
   - Create tender (buyer)
   - Submit offer (supplier)
   - Award offer (buyer)
   - Create PO & invoice

### Short Term
4. Add Backend tests using Jest
5. Improve error messages
6. Test Admin Dashboard features
7. Test user services

### Long Term
8. Implement MFA
9. Implement Email notifications
10. Complete feature flags system

## 📁 Important Files
- `AUDIT_REPORT.md` - Complete audit with all issues and recommendations
- `frontend/src/theme/theme.js` - Global styling
- `backend/config/schema.js` - Database schema definitions
- `backend/config/db.js` - Database connection pool
- `frontend/src/services/tokenManager.js` - Token management (needs fix)
- `frontend/src/App.jsx` - Main router (auth issue here)

## 🔧 Commands

```bash
# Backend
npm run dev          # Start backend on port 3000
npm run db:init     # Initialize database
npm test            # Run backend tests

# Frontend  
npm run dev         # Start frontend on port 5000
npm run build       # Build for production
npm run lint        # Run ESLint

# Database
npm run db:init                 # Create all tables
node scripts/createSuperAdminUser.js  # Create super admin
```

## 📝 Version History
- **v1.2.0** (Current) - Database initialized, Backend working, Frontend has token issues
- **v1.1.0** - Admin Dashboard components added
- **v1.0.0** - Initial architecture

---

**Status:** ⚠️ Partially Ready - Backend & DB working, Frontend needs token persistence fix
**Last Updated:** 22 Nov 2025
**Next Review:** After token persistence fix
