# MyNet.tn - B2B Procurement Platform

## Overview
MyNet.tn is a production-ready B2B procurement platform for the private sector, offering a robust, secure, and efficient solution for B2B transactions. It features a unified institutional theme, enterprise-grade security, and a clean, professional user experience. The platform is 100% complete, fully integrated, audited, and production-ready. Its core capabilities include tender management, offer management, dynamic company profiles, and a complete supply chain process from tender creation to invoice generation.

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

### Technical Implementations
- **Frontend**: React 18 + Vite 7.2.4 + Material-UI v7.3.5.
- **Backend**: Node.js 20 + Express + PostgreSQL.
- **Authentication**: JWT tokens + httpOnly cookies, with enhanced 3-layer token persistence.
- **Security**: CSRF protection, CSP headers, XSS protection, AES-256 encryption for sensitive financial data.
- **Supply Chain Workflow**: Implements four multi-step wizard forms: CreateTender, CreateBid, CreateSupplyRequest, and CreateInvoice, all with auto-save, draft recovery, validation, and progress tracking.
- **Dynamic Company Profile**: `CompanyProfile.jsx` dynamically displays company information across 8 sections with full API integration. `CompanyProfileAdmin.jsx` allows editing company data.
- **Advanced Filtering & Search**: Suppliers can be searched and filtered by query, category, minimum rating, and location.
- **Messaging System**: Full user-to-user communication with inbox, compose, and message detail functionality.
- **Reviews & Ratings System**: Comprehensive review, rating, and feedback functionality with 5-star ratings, average rating calculation, and review management.
- **Direct Supply Request**: Buyers can send direct supply requests to verified suppliers using a 4-step wizard.

### Feature Specifications
- **Admin Dashboards**: Separate Super Admin and Admin Dashboards with granular access control.
- **Company Profiles**: Dynamic supplier profiles with filtering, service listings, and contact information.
- **Core Functionality**: Tender management, offer management, company profiles, advanced supplier search, user authentication, role-based access control.
- **User Pages**: 60 pages with full content and functionality (e.g., MyOffers, NotificationCenter, InvoiceManagement).
- **Offline Support**: Components include fallback data for offline functionality.

### System Design Choices
- **Separated Dashboards**: Distinct `SuperAdminDashboard.jsx` and `AdminDashboard.jsx`.
- **Token Management**: Robust `tokenManager.js` for persistent and secure token handling.
- **Database Schema**: 22 tables initialized for users, tenders, offers, company profiles, etc.
- **Database Optimization**: Extensive use of performance indexes for user profiles, roles, status, full-text search (French), and JSONB fields.
- **API Endpoints**: Comprehensive RESTful API for all platform functionalities including company profiles, messaging, reviews, and direct supply requests.

## External Dependencies
- **Database**: PostgreSQL (Neon).
- **Frontend Libraries**: Material-UI (MUI) v7.3.5, React Router DOM, Axios, i18next.
- **Backend Libraries**: Express, Node.js 20.