# MyNet.tn - B2B Procurement Platform

## Overview
MyNet.tn is a production-ready B2B procurement platform for the Tunisian private sector, designed for scalability and market leadership. It offers a secure and efficient solution for B2B transactions, including tender and offer management, dynamic company profiles, and a complete supply chain process from tender creation to invoice generation. The platform aims to provide a unified institutional theme, enterprise-grade security, and a professional user experience.

## User Preferences
I prefer simple language and clear explanations. I want iterative development with small, testable changes. Please ask before making any major architectural changes or introducing new dependencies. I prefer that the agent works in the `/frontend` directory and does not make changes in the `/backend` directory.

## System Architecture
The platform utilizes a React frontend (Vite) and a Node.js backend with a PostgreSQL database.

### UI/UX Decisions
- **Design Principle**: All styles defined via `frontend/src/theme/theme.js` using Material-UI (MUI).
- **Color Palette**: #0056B3 (primary), #F9F9F9 (background), #212121 (text).
- **Styling**: 4px border radius, 8px spacing, Roboto font.
- **Localization**: FRANÇAIS UNIQUEMENT.
- **Responsive Design**: Mobile-first approach with breakpoint guidelines, touch target sizes, responsive typography, and flexible grid layouts.
- **Accessibility**: WCAG 2.1 compliant with ARIA labels, keyboard navigation, semantic HTML, and color contrast compliance.
- **User Experience**: Loading skeletons for improved data loading UX.

### Technical Implementations
- **Frontend**: React 18 + Vite.
- **Backend**: Node.js 20 + Express.
- **Authentication**: JWT tokens + httpOnly cookies, 3-layer token persistence, MFA (SMS & TOTP).
- **Security**: CORS, CSRF, XSS, AES-256 encryption, rate limiting, brute-force protection, input validation, soft deletes, role-based access control.
- **Workflow Management**: Multi-step wizard forms for procurement processes with auto-save, draft recovery, validation, and progress tracking.
- **Core Features**: Dynamic company profiles, advanced filtering & search, messaging, reviews & ratings, direct supply requests, analytics dashboards, bid comparison tool, supplier performance tracking.
- **Data Management**: Export features (JSON, CSV), real-time updates via WebSockets, pagination, and bulk operations.
- **Notifications**: Integrated email notification system.
- **Super Admin Features**: Full CRUD for static pages, file management, image gallery, documents with versioning, content backup/restore, analytics, service/subscription plan management, audit logs, purchase orders.
- **Error Handling**: Comprehensive system with custom error classes, global handler, error boundary, and Axios interceptors.
- **Form Validation**: Custom `useFormValidation` hook, pre-built schemas, real-time error display, and backend error integration.
- **Admin Middleware**: Specialized functions for rate limiting, input validation, permission verification, and logging for super admin endpoints.
- **System Utilities**: Logging, analytics, and testing systems with Jest.

### System Design Choices
- **Database Connection**: Optimized PostgreSQL connection pool with `SafeClient` wrapper and safe query middleware.
- **Security Enhancements**: Implemented CSRF protection, field-level access control, optimistic locking, and comprehensive rate limiting.
- **Code Quality**: Refactored components, eliminated code duplication, and introduced reusable components (AdminDialog, AdminForm, AdminTable, SkeletonLoader).
- **Architectural Patterns**: Use of `withTransaction()` for atomic database operations, `ErrorBoundary` for UI resilience, and `asyncHandler` for robust route error catching.
- **Critical Fixes**: Addressed database connection pool errors, implemented comprehensive input validation and SQL injection prevention, enforced pagination limits, and integrated automated daily database backups.
- **Production Code Quality**: Removed console.log statements, implemented Privacy Policy & Terms of Service pages, added a response validation layer, and enhanced Axios interceptors.

## External Dependencies
- **Database**: PostgreSQL (Neon).
- **Frontend Libraries**: Material-UI (MUI), React Router DOM, Axios, i18next, socket.io-client.
- **Backend Libraries**: Express, Node.js, cors, express-rate-limit.
- **Email Services**: SendGrid/Resend/Gmail (integrated notification system).

## Latest Changes - CreateTender Wizard Enhancement & Bug Fixes (November 23, 2025)

### Feature: 13-Step Tender Wizard Consolidated into 6 Grouped Stages ✨
**What Changed**: Reorganized the tender creation wizard to show steps grouped into logical stages while preserving all 13 steps and their full content.

**New Stage Structure**:
1. **Informations Générales** (Steps 1-3): Basic info, Classification, Budget & Currency
2. **Contenu & Articles** (Steps 4, 9): Lots & Articles, Technical Specifications  
3. **Conditions & Exigences** (Steps 5, 10): Participation Conditions, Requirements
4. **Modalités de Soumission** (Steps 6-8): Submission Method, Calendar, Contacts
5. **Évaluation** (Step 11): Evaluation Criteria
6. **Finalisation** (Steps 12-13): Attachments, Final Review

**UI Improvements**:
- Stage-based progress indicator (6-segment colored bar)
- Display shows stage name with description
- "Étape X sur 6" progress + "Y/13 détails" counter
- Mobile-optimized responsive design
- All original validation logic preserved

**Files Modified**: `frontend/src/pages/CreateTender.jsx`

### Critical Bug Fixes ✅

**#1 - Validation Step Mismapping**
- Issue: "Lots et Articles" step showed validation error when clicking Next
- Cause: validateStep function case 3 was checking wrong conditions (calendar dates instead of lots)
- Fix: Moved calendar validation to case 6, configured case 3 to validate lots

**#2 - Step Counter Display Error**
- Issue: Step counter displayed incorrect step numbers (e.g., "Étape 03 sur 03")
- Cause: Malformed switch statement with fall-through cases and orphaned code
- Fix: Removed duplicate case 'step10', fixed orphaned return statement on line 507

**#3-#5 - Duplicate Theme Imports**
- Issue: Build failed with "already declared" errors in 9+ component files
- Cause: Multiple `import institutionalTheme` statements in same file
- Files Fixed: AdminAnalytics, ServicesManager, StaticPagesManager, SystemConfig, UserRoleManagement, EnhancedTable, AdvancedSearch, PaymentOrders, ProfileInterestsTab, QuickActions
- Fix: Removed all duplicate imports, kept single import per file

**#6 - Import Path Errors in Admin Components**
- Issue: "Could not resolve" errors for theme imports in Admin folder
- Cause: Wrong relative paths (../theme/theme instead of ../../theme/theme)
- Files Fixed: AdminAnalytics, ServicesManager, StaticPagesManager, SystemConfig
- Fix: Updated all Admin component theme imports to use correct path

**#7 - StatusBadge Export/Import Mismatch**
- Issue: Build failed with "StatusBadge is not exported" errors
- Cause: File exports as default but was imported as named export
- Files Fixed: POManagement, PODetail, EmailNotifications
- Fix: Changed imports from `{ StatusBadge }` to `StatusBadge`

**#8 - Missing Theme Declaration in EnhancedTable**
- Issue: Component had syntax error with theme declaration in parameters
- Cause: `const theme = institutionalTheme;` was in function signature instead of body
- Fix: Moved theme declaration inside function body

### Build Status
- ✅ Frontend builds cleanly with VITE v7.2.4
- ✅ All 1242 modules transformed successfully  
- ✅ All 13 tender creation steps preserved and fully functional
- ✅ No compilation errors across 92+ pages
- ✅ 100% French language support maintained
- ✅ Material-UI theming via theme.js only
- ✅ Production-ready state achieved

### Workflow Status
- ✅ Frontend: Running cleanly, ready in ~220ms
- ✅ Backend: Running, handling requests successfully
- ✅ All routes functional and tested
