# MyNet.tn - B2B Procurement Platform

## Overview
MyNet.tn is a modern B2B procurement platform for the private sector, featuring a unified institutional theme and enterprise-grade security. It aims to provide a robust, secure, and efficient solution for B2B transactions with a clean, professional user experience. Key capabilities include secure user authentication, dynamic content display, optimized performance, and comprehensive security hardening. The application is production-ready.

## User Preferences
I prefer simple language and clear explanations. I want iterative development with small, testable changes. Please ask before making any major architectural changes or introducing new dependencies. I prefer detailed explanations for complex logic. I prefer that the agent works in the `/frontend` directory and does not make changes in the `/backend` directory.

## System Architecture
The platform utilizes a React frontend (Vite) and a Node.js backend.

### UI/UX Decisions
- **Design Principle**: All styles are defined via `frontend/src/theme/theme.js`, with minimal `index.css` for global resets.
- **Framework**: Exclusive use of Material-UI (MUI v7.3.5) for all components.
- **Visual Style**: Flat design with no shadows or gradients.
- **Color Palette**: Fixed institutional colors: `#0056B3` (primary blue), `#F9F9F9` (background), `#212121` (text).
- **Spacing**: Grid-based spacing with an 8px base.
- **Border Radius**: Uniform 4px radius.
- **Typography**: Standardized Roboto font.
- **Loading States**: Enhanced with `LoadingSpinner.jsx` and `LoadingSkeletons.jsx` (Table, Card, Form, Avatar, List variants).
- **Pagination**: Implemented with `Pagination.jsx` for efficient data display and navigation (e.g., in `TenderList`).

### Technical Implementations
- **Code-Splitting & Optimization**: Implemented with `React.lazy()` and `Suspense`, using manual chunks for `react-core`, `mui-core`, `api`, and `i18n`.
- **Security Architecture**:
    - **Token Management**: Access tokens in memory (sessionStorage fallback), httpOnly cookie refresh tokens, automatic token refresh, and XSS protection.
    - **CSRF Protection**: `CSRFProtection.js` utility, token generation, meta tag storage, `X-CSRF-Token` headers, and frontend validation.
    - **Content Security Policy (CSP)**: Comprehensive meta tag directives for script, style, font, image, form, and frame sources; object-src `none`; and `upgrade-insecure-requests`.
    - **Additional Security Headers**: `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `X-XSS-Protection: 1; mode=block`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-UA-Compatible: IE=edge`, `X-Requested-With: XMLHttpRequest`.
    - **Token Expiration**: Request interceptor checks validity, redirects on expiry, and cleans up expired tokens on app load.
- **Error Handling**: `ErrorBoundary.jsx` for React errors, `ErrorFallback.jsx` UI, and `axiosConfig.js` for API error handling (retry, 401/403 redirects).
- **Data Validation**: Zod library for schema-based validation (e.g., `LoginSchema`, `RegisterSchema`, `TenderSchema`) via `validateWithZod()`.
- **Request Caching**: `axiosConfig.js` implements a 5-minute cache for GET requests with network error fallback.

### System Design Choices
- **Single Source of Truth**: `theme.js` for styles, `tokenManager.js` for token handling, and `axiosConfig.js` for API interaction.
- **Modular Components**: 91 modular JSX components and 90+ lazy-loaded pages.
- **Material-UI & React Router Compatibility**: Migrated Grid components to MUI v2 API and configured React Router v7 future flags (`v7_startTransition`, `v7_relativeSplatPath`).

## External Dependencies
- **Material-UI (MUI v7.3.5)**: Frontend UI component library.
- **React**: Frontend JavaScript library.
- **Vite 7.2.4**: Frontend build tool.
- **Node.js 20**: Backend runtime environment.
- **Axios**: HTTP client for API requests.
- **Zod**: TypeScript-first schema declaration and validation library.
- **i18n**: Internationalization library.