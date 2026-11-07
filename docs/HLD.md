# High-Level Design (HLD)

## 1. Scope and design principles

This design describes the current NLAMS monorepo and the boundaries needed to evolve it into a production service. The system uses a modular monolith: one React client and one Express API backed by MongoDB. Domain modules are separated in code without introducing distributed-service complexity.

Design principles:

- Authorize at the API boundary, not only in the UI.
- Apply jurisdiction scope before returning domain data.
- Keep statutory calculations deterministic and independently testable.
- Treat audit records as a first-class cross-cutting concern.
- Return consistent API envelopes through the shared response helper.
- Keep map rendering dependent on a GeoJSON contract rather than database details.

## 2. Context diagram

```text
                 +-----------------------------+
                 | Government officers         |
                 | Agencies / Field staff      |
                 | Citizens / Landowners       |
                 +--------------+--------------+
                                |
                         HTTPS / JSON
                                |
+-------------------------------v-------------------------------+
|                    NLAMS React client                        |
|  Auth + role routing | dashboards | GIS | forms | notifications|
+-------------------------------+-------------------------------+
                                |
                         REST /api/*
                                |
+-------------------------------v-------------------------------+
|                    NLAMS Express API                         |
| auth | RBAC | jurisdiction | controllers | services | audit  |
+------------------+----------------------+---------------------+
                   |                      |
             Mongoose ODM             External/configured
                   |                   services (future)
                   v
             +-----------+
             | MongoDB   |
             | 10 models |
             +-----------+
```

The current GIS client uses OpenStreetMap tiles and receives parcel features from the API. OTP, OCR, document storage, official land records, treasury, SMS/email, and identity-provider integrations are extension points rather than fully implemented external dependencies.

## 3. Component architecture

### Client

- `main.jsx`: React bootstrap and providers.
- `AuthContext` / `NotificationContext`: session and notification state.
- `AppRoutes`: public routes, protected shell, role landing redirects, and role pages.
- `ProtectedRoute`, `AppLayout`, `RoleNavbar`, `RoleSidebar`: authenticated UX and navigation.
- `services/api`: Axios client and domain-specific API modules.
- `components/gis`: Leaflet map and legend.
- `components/shared`: Delay Radar, document verification, audit timeline, notifications, and what-if simulation.
- `pages/<role>`: role-specific workflows for central, state, district, agency, field, and citizen users.

### API

- `server.js`: configuration, security middleware, route mounting, health check, and centralized error handling.
- `routes`: HTTP contract and route-level middleware composition.
- `middleware`: authentication, RBAC/jurisdiction, audit, and errors.
- `controllers`: request orchestration and response mapping.
- `services`: compensation, Delay Radar, document verification, notifications, OTP, and other domain logic.
- `models`: MongoDB schemas and indexes.
- `seed`: realistic demo users, projects, parcels, and related records.

## 4. Domain modules

| Module | Primary records | Main consumers |
|---|---|---|
| Identity and access | User | Every protected workflow |
| Projects | Project and milestones | Central, state, district, agency |
| Parcels and GIS | Parcel | Agency, district, field, citizen |
| Compensation | Compensation | District and citizen |
| R&R | Family and RR | District and citizen |
| Documents | Document | Field, district, agency |
| Grievances | Grievance | Citizen and officers |
| Notifications | Notification | All authenticated roles |
| Audit | AuditLog | Central oversight and compliance |

## 5. Request flow

```text
Browser
  -> Axios API module
  -> JWT request interceptor
  -> Express JSON/CORS/Helmet middleware
  -> authenticate
  -> authorize and/or scopeJurisdiction
  -> route controller
  -> domain service / Mongoose model
  -> ApiResponse envelope
  -> audit wrapper for successful mutations
  -> browser state and UI
```

Authentication loads the user from the token subject and excludes the password. `scopeJurisdiction` derives filters from the user role: national, state, district, agency, or citizen-linked. Controllers should preserve those filters for all list/read operations.

## 6. Data and consistency

MongoDB is the system of record for the prototype. References connect projects to parcels, users to roles and jurisdiction, parcels to citizen users, awards to projects/parcels, and R&R packages to families and beneficiaries.

Consistency rules:

- Project and parcel status values use enumerated domain values.
- Project milestones store section, status, target/completion dates, gazette reference, and remarks.
- Geometry is stored with a 2dsphere index and exposed through a GeoJSON response for mapping.
- Successful mutation audit records are associated with the authenticated actor and request metadata.
- Compensation calculations are computed from request inputs; persisted awards are separate records and must not be silently overwritten.

## 7. Security architecture

Implemented controls:

- Helmet security headers.
- CORS allow-list with credential support.
- Bearer token authentication.
- Password excluded from authenticated user queries.
- Role authorization middleware.
- Jurisdiction filtering middleware.
- Audit middleware for covered successful mutations.
- Centralized error handler.

Production controls required before deployment:

- TLS termination and secure cookie/token policy.
- Request schema validation and payload size/content validation.
- Rate limiting and abuse monitoring on all sensitive endpoints.
- Secret rotation and managed MongoDB credentials.
- Field-level encryption or tokenization for PII.
- Immutable/append-only audit storage and retention policy.
- Removal of local mock login fallback.

## 8. Deployment topology

```text
                 HTTPS
                   |
        +----------v----------+
        | Reverse proxy / WAF |
        +-----+----------+----+
              |          |
       Static client   API process
       (Vite output)   (Node/Express)
                             |
                     Private MongoDB
```

The development topology uses Vite on port 5173 and Express on port 5000. Production should serve the built client from a CDN/static host, run the API in a managed process/container, keep MongoDB private, and expose `/health` to the orchestrator.

## 9. Availability and observability

- Use `/health` for liveness and dependency-aware readiness checks.
- Emit structured logs for authentication failures, authorization failures, controller errors, and audit-write failures.
- Track request latency, status codes, database errors, Delay Radar evaluation duration, and notification delivery.
- Back up MongoDB and test restoration.
- For high availability, run multiple stateless API instances behind a load balancer; store session state in tokens and move rate-limit state to a shared store.

## 10. Key architectural decisions

| Decision | Rationale |
|---|---|
| Modular monolith | Fits the current team and domain size while preserving clear future extraction boundaries. |
| MongoDB/Mongoose | Maps naturally to nested milestones, verification evidence, and flexible workflow metadata. |
| REST JSON | Simple integration contract for the React client and future government systems. |
| Server-side scope enforcement | Prevents UI-only authorization bypasses and centralizes policy. |
| Deterministic services | Makes statutory calculations and risk results explainable and testable. |
| GeoJSON boundary | Keeps GIS provider/rendering concerns out of domain models and controllers. |

