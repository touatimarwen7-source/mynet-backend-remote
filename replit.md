# MyNet.tn - B2B Procurement Platform

## Overview
MyNet.tn is a production-ready B2B procurement platform for the private sector. It provides a robust, secure, and efficient solution for B2B transactions with a unified institutional theme and enterprise-grade security, featuring a clean, professional user experience. The platform is 100% complete, fully integrated, audited, and production-ready.

## User Preferences
I prefer simple language and clear explanations. I want iterative development with small, testable changes. Please ask before making any major architectural changes or introducing new dependencies. I prefer that the agent works in the `/frontend` directory and does not make changes in the `/backend` directory.

## System Architecture
The platform utilizes a React frontend (Vite) and a Node.js backend with a PostgreSQL database.

### UI/UX Decisions
- **Design Principle**: All styles defined via `frontend/src/theme/theme.js`.
- **Framework**: Exclusive use of Material-UI (MUI v7.3.5).
- **Color Palette**: #0056B3 (primary), #F9F9F9 (background), #212121 (text).
- **Styling**: 4px border radius, 8px spacing, Roboto font.
- **Localization**: Fully localized in French.

### Technical Stack
- **Frontend**: React 18 + Vite 7.2.4 + Material-UI v7.3.5.
- **Backend**: Node.js 20 + Express + PostgreSQL.
- **Authentication**: JWT tokens + httpOnly cookies, with enhanced 3-layer token persistence (memory → sessionStorage → localStorage).
- **Security**: CSRF protection, CSP headers, XSS protection.

### Feature Specifications
- **Super Admin Architecture**: Complete "Total Control Hub" with user management, content management, system configuration, and monitoring/analytics.
- **Admin Dashboard**: Limited permissions for user viewing and reporting.
- **Core Functionality**: Tender management, offer management, user authentication, role-based access control.
- **User Pages**: 60 pages with full content and functionality, including MyOffers, NotificationCenter, InvoiceManagement, DisputeManagement, FinancialReports, SecuritySettings, etc.
- **Offline Support**: Components include fallback data for offline functionality.

### System Design Choices
- **Separated Dashboards**: Distinct `SuperAdminDashboard.jsx` and `AdminDashboard.jsx` with separate routing and menus for granular access control.
- **Token Management**: Robust `tokenManager.js` for persistent and secure token handling across sessions and navigation.
- **Database Schema**: 22 tables initialized for users, tenders, offers, and other entities.

## External Dependencies
- **Database**: PostgreSQL (Neon), with an optimized connection pool (max 20, idle 60s).
- **Frontend Libraries**: Material-UI (MUI) v7.3.5.
- **Backend Libraries**: Express.