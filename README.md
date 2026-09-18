# NLAMS: National Land Acquisition & Management System
> **Problem Statement ID: SIH26016**  
> **Repository Architecture**: High-Performance Monorepo for 6 Concurrent Hackathon Developers

---

## 🏛️ System Overview

The **National Land Acquisition & Management System (NLAMS)** is a unified digital platform built according to the statutory provisions of the **Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013 (RFCTLARR Act, 2013)**.

The monorepo contains 6 role-isolated frontends and a unified Express + Mongoose backend with statutory calculation engines, GIS spatial tools, and automated bottleneck detection (Delay Radar).

---

## 👥 6-Role Architecture & Team Assignments

| Developer | Role Code | Scope / Jurisdiction | Dedicated Frontend Path | Dedicated Controller / Feature |
| :--- | :--- | :--- | :--- | :--- |
| **Dev 1** | `CENTRAL_ADMIN` | National (DoLR / MoRD) | `client/src/pages/central/` | `controllers/projects.controller.js`, `delayRadar.service.js` |
| **Dev 2** | `STATE_OFFICER` | State Revenue Dept | `client/src/pages/state/` | `controllers/users.controller.js`, `controllers/projects.controller.js` |
| **Dev 3** | `DISTRICT_COLLECTOR` | District LAA Authority | `client/src/pages/district/` | `controllers/compensation.controller.js`, `compensationCalc.service.js` |
| **Dev 4** | `REQUIRING_AGENCY` | NHAI / Railways / Defense | `client/src/pages/agency/` | `controllers/projects.controller.js`, `controllers/parcels.controller.js` |
| **Dev 5** | `FIELD_SURVEYOR` | Ground Truth / Mobile | `client/src/pages/field/` | `controllers/gis.controller.js`, `controllers/documents.controller.js` |
| **Dev 6** | `CITIZEN` | Affected Landowners / Public | `client/src/pages/citizen/` | `controllers/grievances.controller.js`, `controllers/rr.controller.js` |

---

## ⚡ Quick Start Guide

### 1. Install all dependencies
```bash
npm run install:all
```
*(Or install root, server, and client dependencies individually)*

### 2. Configure Environment Variables
Copy `.env.example` into both root and `server/` / `client/`:
```bash
cp .env.example server/.env
cp client/.env.example client/.env
```

### 3. Seed Realistic Hackathon Data
```bash
npm run seed
```
*(Populates 6 role accounts, interlinked projects, GeoJSON parcels, compensation packages, R&R allocations, and mock grievances).*

### 4. Run Both Client & Server Concurrently
```bash
npm run dev
```
- **Client**: `http://localhost:5173`
- **Server API**: `http://localhost:5000/api`

---

## 🔑 Pre-Seeded Hackathon Credentials

All users share the default password: `Password@123`

| Role | Username / Email | Jurisdiction |
| :--- | :--- | :--- |
| **Central Admin** | `central.admin@nlams.gov.in` | National / India |
| **State Officer** | `state.maharashtra@nlams.gov.in` | Maharashtra |
| **District Collector** | `collector.pune@nlams.gov.in` | Pune District |
| **Requiring Agency** | `nhai.director@nhai.gov.in` | National Highway Auth |
| **Field Surveyor** | `surveyor.haveli@nlams.gov.in` | Haveli Taluka, Pune |
| **Citizen (Landowner)** | `ramesh.patil@citizen.in` | Haveli Parcel #142/1 |

---

## 📁 Repository Directory Layout

```
Land-Acquisition/
├── package.json                         # Monorepo runner (concurrently client + server)
├── .gitignore                           # Monorepo ignore rules
├── .env.example                         # Unified environment template
├── README.md                            # Comprehensive 6-Role Developer Guide
│
├── client/                              # React + Vite + Tailwind Frontend
│   ├── src/
│   │   ├── constants/                   # roles, projectStatuses, riskLevels, routes
│   │   ├── context/                     # AuthContext, NotificationContext
│   │   ├── hooks/                       # useAuth, useRole, useGIS
│   │   ├── services/api/                # Modular Axios API service layer (11 files)
│   │   ├── components/
│   │   │   ├── ui/                      # Shared UI Design System (Button, Card, Table...)
│   │   │   ├── layout/                  # AppLayout, RoleNavbar, RoleSidebar, ProtectedRoute
│   │   │   ├── gis/                     # Interactive Leaflet GISMap & Legend
│   │   │   └── shared/                  # DelayRadar, SmartDocVerify, WhatIfSimulator, etc.
│   │   ├── pages/                       # 6 Role-Isolated Page Namespaces
│   │   │   ├── auth/                    # Shared Login / OTP pages
│   │   │   ├── central/                 # Dev 1 (DoLR National)
│   │   │   ├── state/                   # Dev 2 (State Revenue)
│   │   │   ├── district/                # Dev 3 (LAA Authority / RFCTLARR)
│   │   │   ├── agency/                  # Dev 4 (Requiring Body)
│   │   │   ├── field/                   # Dev 5 (Field Surveyor Mobile-first)
│   │   │   └── citizen/                 # Dev 6 (Public Portal)
│   │   └── routes/AppRoutes.jsx         # Master dynamic role router
│
└── server/                              # Node.js + Express + Mongoose Backend
    ├── config/                          # db.js, env.js
    ├── models/                          # 10 Core Collections
    ├── routes/                          # 11 REST API Routers
    ├── controllers/                     # 11 Controller Modules
    ├── middleware/                      # auth, rbac, errorHandler, audit
    ├── services/                        # Heuristic Delay Radar, Statutory Compensation, OTP
    └── seed/                            # Master runner & 8 interlinked datasets
```

---

## ⚖️ Statutory RFCTLARR 2013 Milestone Tracker

1. **Section 4**: Social Impact Assessment (SIA) notification & public hearing.
2. **Section 6**: SIA evaluation & Expert Group approval.
3. **Section 11**: Preliminary notification & objection filing (60-day window).
4. **Section 15**: Hearing of objections by the Collector.
5. **Section 19**: Declaration of acquisition & Rehabilitation Scheme publication.
6. **Section 23/26-30**: Land valuation, 100% Solatium, 12% additional interest award computation.
7. **Section 31**: Rehabilitation & Resettlement (R&R) award execution.
8. **Section 38**: Final possession handover.

---

## 📡 Core Backend API Routes

- `POST /api/auth/login` - Authenticate & obtain JWT
- `POST /api/auth/verify-otp` - Verify 2FA token
- `GET /api/projects` - List projects (filtered by jurisdiction)
- `GET /api/parcels` - GeoJSON parcels with boundary polygons
- `GET /api/parcels/gis` - Optimized GeoJSON feature collection for Leaflet map
- `POST /api/compensation/calculate` - Statutory Schedule I & II award simulator
- `GET /api/delay-radar` - Heuristic bottleneck risk engine
- `POST /api/documents/verify` - OCR & anomaly detection
- `GET /api/grievances` - Citizen dispute tracking
- `GET /api/audit` - Immutable audit log trail
