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

## Recent Changes (November 22, 2025)

### Purchase Orders System - PO management
- Backend API: 5 endpoints for PO lifecycle
- Frontend page: `PurchaseOrders.jsx` with status filtering
- Create PO from offers, track status (pending/confirmed/delivered)

### Audit Logs System - Compliance tracking
- Backend API: Admin audit log viewing
- Middleware for auto-logging actions
- Track user activities, entity changes, IP addresses

### Subscription Plans System - Monetization ready
- Backend API: Plan management and user subscriptions
- Support for multiple subscription tiers
- Active subscription tracking

### Messaging System - Complete user-to-user communication
- 3 Frontend Pages: Inbox, Compose, MessageDetail
- 7 Backend Endpoints for messaging operations
- User search/autocomplete for recipients
- Mark-as-read, pagination, search functionality
- Related entity linking support

### Reviews & Ratings System - Supplier feedback
- Frontend: `SupplierReviews.jsx` with rating statistics
- 6 Backend Endpoints for reviews
- 5-star rating system with distribution charts
- Auto-update average ratings
- Edit/delete own reviews

### Direct Supply Request System - Direct procurement
- 3 Frontend Pages: Create, View Sent, View Received
- 5 Backend Endpoints for supply requests
- 4-step wizard for creating requests
- Accept/reject supplier requests
- Real-time status updates

## Database Structure (22 tables)
- **Active**: users, tenders, offers, invoices, user_profiles, notifications, purchase_requests, supplier_verifications, mfa_codes, reviews, messages, purchase_orders
- **Available**: audit_logs, subscription_plans, user_subscriptions, supplier_features, tender_history, tender_award_line_items, archive_policies, encryption_keys, feature_flags, feature_flag_audits

## External Dependencies
- **Database**: PostgreSQL (Neon).
- **Frontend Libraries**: Material-UI (MUI) v7.3.5, React Router DOM, Axios, i18next.
- **Backend Libraries**: Express, Node.js 20.
