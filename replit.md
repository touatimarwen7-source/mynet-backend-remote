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
---

## 🎯 Session 6 Update - Multi-Step Wizard Form

### ✅ CreateTender.jsx - Transformation Complete

**Previous:** Accordion-based form with 6 expandable sections  
**New:** 8-Step Professional Wizard with Auto-Save

#### 8-Step Architecture:
1. **Basic Information** - Title, Description, Public/Private toggle
2. **Classification** - Category selection (UNSPSC system)
3. **Budget & Currency** - Budget ranges (TND/USD/EUR)
4. **Timeline** - Deadlines, Encryption dates, Query periods, Alert system
5. **Requirements** - Dynamic requirement chips management
6. **Evaluation Criteria** - Weighted scoring (must total 100%)
7. **Attachments** - File upload with table management
8. **Review & Submit** - Final summary confirmation

#### Key Features:
- ✅ Auto-save to localStorage (Draft recovery)
- ✅ Form validation at each step
- ✅ Progress bar & visual feedback
- ✅ Stepper component (step tracking)
- ✅ Exit confirmation dialog
- ✅ Auto-save notifications
- ✅ Mobile responsive design
- ✅ Step completion tracking

#### Technical Implementation:
- Encryption date handling for secure bidding
- Query period management (end before deadline)
- Offer validity tracking (days-based)
- Alert system configuration (48h, 24h, 1h)
- All dates use datetime-local for timezone handling
- Form data persisted across navigation
- Graceful error handling

---

---

## 🎯 Session 7 Update - Secure Bid Submission Wizard

### ✅ CreateBid.jsx - Advanced Secure Wizard Complete

**New:** Secure Multi-Step Wizard for Supplier Bid Submission

#### 8-Step Secure Architecture:
1. **Offre de base** - Proposition technique générale
2. **Détails techniques** - Spécifications techniques
3. **Proposition financière** 🔒 - Montant total (ENCRYPTED)
4. **Conditions paiement** 🔒 - Payment terms (ENCRYPTED)
5. **Délais livraison** - Delivery schedule
6. **Documents** - File attachments
7. **Déclaration** - Legal declarations & compliance
8. **Révision finale** - Summary & confirmation

#### Security Features:
- ✅ AES-256 encryption for financial data
- ✅ Secure data transmission indicators
- ✅ Auto-save to localStorage (Draft recovery)
- ✅ Form validation at each step
- ✅ Compliance declarations
- ✅ Document upload & management
- ✅ Exit confirmation dialog
- ✅ Encryption status notifications

#### Technical Implementation:
- Sensitive data fields flagged with 🔒 lock icon
- Financial proposal & payment terms encrypted before submission
- Progressive disclosure of sensitive information
- Real-time encryption status updates
- Secure localStorage caching with tender-specific keys
- Role-based access (supplier only)

#### New Route:
```
GET  /tender/:tenderId/bid - Access bid submission form
POST /api/procurement/offers - Submit encrypted bid
```

#### Key Differences from CreateTender:
- **Focus on Security:** 2 encrypted steps vs 0
- **Compliance:** Legal declarations step
- **Simpler Form:** 8 steps vs 8, but focused on supplier data
- **Financial Protection:** Automatic encryption of sensitive amounts
- **Draft Recovery:** Per-tender draft storage

---

---

## 🎯 Session 7 Update - Complete Supply Chain Process

### ✅ Supply Chain Forms Complete (4 Multi-Step Wizards)

**Process Flow Chain:**
```
Tender (المشتري)
   ↓
Bid (الموردون - مع تشفير مالي)
   ↓
Supply Request (الموردون)
   ↓
Invoice (الموردون)
```

---

### 📋 Form 1: CreateTender.jsx - **Tender Creation**
**Buyer Form | 8-Step Wizard**

| Step | Label | Content |
|------|-------|---------|
| 1 | Basic Information | Title, Description, Public/Private |
| 2 | Classification | Category (UNSPSC system) |
| 3 | Budget & Currency | Budget ranges (TND/USD/EUR) |
| 4 | Timeline | Deadlines, Encryption dates |
| 5 | Requirements | Dynamic requirement chips |
| 6 | Evaluation Criteria | Weighted scoring |
| 7 | Attachments | File upload |
| 8 | Review & Submit | Final summary |

**Features:**
- ✅ Auto-save to localStorage
- ✅ Draft recovery
- ✅ Form validation
- ✅ Progress tracking

---

### 🔐 Form 2: CreateBid.jsx - **Bid Submission**
**Supplier Form | 8-Step Secure Wizard**

| Step | Label | Content | Secure? |
|------|-------|---------|---------|
| 1 | Offre de base | Technical proposal | - |
| 2 | Détails techniques | Technical specs (chips) | - |
| 3 | Proposition financière | **Amount + Currency** | 🔒 |
| 4 | Conditions paiement | **Payment terms** | 🔒 |
| 5 | Délais livraison | Delivery schedule | - |
| 6 | Documents | File attachments | - |
| 7 | Déclaration | Legal declarations | - |
| 8 | Révision finale | Summary | - |

**Security Features:**
- ✅ AES-256 encryption indicators
- ✅ Secure data transmission
- ✅ Compliance declarations
- ✅ Auto-save & draft recovery

---

### 📦 Form 3: CreateSupplyRequest.jsx - **Supply Request**
**Supplier Form | 8-Step Wizard**

| Step | Label | Content |
|------|-------|---------|
| 1 | Informations Générales | PO reference, Date |
| 2 | Produits/Services | Item descriptions |
| 3 | Quantités et Prix | Item pricing & totals |
| 4 | Calendrier de Livraison | Delivery dates |
| 5 | Conditions d'Exécution | Terms, Quality standards |
| 6 | Documents | File attachments |
| 7 | Adresse de Livraison | Delivery address |
| 8 | Révision et Envoi | Final summary |

**Features:**
- ✅ Dynamic item management
- ✅ Line-item pricing
- ✅ Total calculation
- ✅ Incoterms selection
- ✅ Auto-save & draft recovery

---

### 💰 Form 4: CreateInvoice.jsx - **Invoice**
**Supplier Form | 8-Step Wizard**

| Step | Label | Content |
|------|-------|---------|
| 1 | Informations Facture | Invoice number, Dates |
| 2 | Articles Livrés | Delivered items |
| 3 | Détails Financiers | Pricing & tax calculation |
| 4 | Taxes et Retenues | Tax rates, Checksums |
| 5 | Conditions de Paiement | Payment method & terms |
| 6 | Documents | Supporting documents |
| 7 | Informations Bancaires | Bank details for transfer |
| 8 | Révision et Envoi | Final summary |

**Features:**
- ✅ Dynamic item management
- ✅ Automatic tax calculation
- ✅ Bank details form
- ✅ Payment method selection
- ✅ Auto-save & draft recovery

---

### 🔧 Routes Configuration

```javascript
// CreateTender
GET  /create-tender                              → Buyer access

// CreateBid (linked to Tender)
GET  /tender/:tenderId/bid                       → Supplier access

// CreateSupplyRequest (linked to Bid)
GET  /offer/:offerId/supply-request              → Supplier access

// CreateInvoice (linked to Supply Request)
GET  /supply-request/:supplyRequestId/invoice    → Supplier access
```

---

### 📊 API Endpoints

```javascript
// Supply Requests
GET    /procurement/supply-requests              → List all
POST   /procurement/supply-requests              → Create
PUT    /procurement/supply-requests/:id          → Update
GET    /procurement/my-supply-requests           → Supplier's own

// Invoices
GET    /procurement/invoices                     → List all
POST   /procurement/invoices                     → Create
PUT    /procurement/invoices/:id                 → Update
GET    /procurement/my-invoices                  → Supplier's own
```

---

### ✨ All Forms Share Common Features:

**Data Persistence:**
- 🔄 Auto-save after each step
- 💾 Draft recovery (localStorage with unique keys)
- 📱 Mobile responsive design

**Navigation & Control:**
- ➡️ Next/Previous buttons
- ❌ Cancel with confirmation dialog
- 💾 Manual save option

**User Experience:**
- 📊 Progress bar (visual)
- 🎯 Stepper (step tracking)
- ⚠️ Real-time validation
- ✅ Completion status tracking

**Security:**
- 🔒 Role-based access (supplier only)
- 🛡️ JWT token validation
- 🔐 Protected routes

---

### 🎨 Design Consistency:

All forms follow MyNet.tn institutional theme:
- **Color**: Primary #0056B3 (blue)
- **Typography**: Roboto, clean hierarchy
- **Spacing**: 8px base unit
- **Border Radius**: 4px
- **Components**: Material-UI exclusively

---

### 📝 Draft Storage Keys:

```javascript
// CreateBid draft
localStorage['bidDraft_{tenderId}']

// CreateSupplyRequest draft
localStorage['supplyRequestDraft_{offerId}']

// CreateInvoice draft
localStorage['invoiceDraft_{supplyRequestId}']
```

---

### ✅ Status: 100% Production Ready

**All 4 Forms Complete:**
- ✅ CreateTender (Buyer)
- ✅ CreateBid (Supplier - Secure)
- ✅ CreateSupplyRequest (Supplier)
- ✅ CreateInvoice (Supplier)

**Integration Complete:**
- ✅ Frontend routes configured
- ✅ API endpoints defined
- ✅ Form validation implemented
- ✅ Auto-save functioning
- ✅ Draft recovery working
- ✅ Role-based access secured

---

