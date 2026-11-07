# Product Requirements Document (PRD)

## 1. Product summary

**Product:** National Land Acquisition & Management System (NLAMS)  
**Problem statement:** SIH26016  
**Audience:** Government land-acquisition authorities, requiring agencies, field officers, affected landowners, and citizens.

NLAMS is a role-aware digital platform for coordinating land acquisition under the Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013 (RFCTLARR Act). It provides a shared project record, parcel-level spatial visibility, statutory milestone tracking, compensation and rehabilitation workflows, citizen grievance handling, and an auditable record of state changes.

The current repository is a functional prototype with seeded demonstration data. It is not a legal determination engine, a production records-management system, or a replacement for statutory notices and approvals.

## 2. Goals

1. Provide one source of truth for acquisition projects, parcels, milestones, awards, R&R packages, grievances, and notifications.
2. Make progress and statutory risk visible at national, state, district, agency, field, and citizen levels.
3. Enforce least-privilege access using role and jurisdiction.
4. Reduce manual calculation errors through a repeatable compensation calculation and simulation service.
5. Improve parcel verification through map-based field workflows and discrepancy flags.
6. Preserve an auditable history of successful state-changing operations.
7. Give affected landowners transparent access to claim status, compensation breakdown, R&R benefits, and grievances.

## 3. Non-goals

- Issuing legally binding notifications, awards, or possession orders.
- Replacing government land records, treasury systems, court systems, or official GIS sources.
- Performing authoritative OCR or machine-learning document decisions; the current verifier is an application service/prototype.
- Supporting unrestricted public access to personally identifiable information.
- Guaranteeing offline field synchronization; the route and UI surface exist, but a durable offline queue is a future capability.

## 4. Users and permissions

| Role | Primary responsibility | Default scope |
|---|---|---|
| Central Admin | National oversight, policy monitoring, project and user governance | All India |
| State Officer | State portfolio, district performance, fund allocation, escalations | Assigned state |
| District Collector | Local land-acquisition authority, SIA, valuation, awards | Assigned state and district |
| Requiring Agency | Submit and track public-purpose requisitions and estimates | Assigned agency |
| Field Surveyor | Verify parcels and record ground evidence | Assigned state, district, and field jurisdiction |
| Citizen / Landowner | View own claim, compensation, R&R, and submit grievances | Own citizen-linked records |

Authentication is provided by email/password and OTP endpoints. The client also contains a local mock-user mode for demonstration when the API is unavailable.

## 5. Product capabilities

### 5.1 Project and statutory lifecycle

Projects progress through:

1. Proposal submitted
2. Section 4 SIA initiated
3. Section 6 SIA approved
4. Section 11 preliminary notification
5. Section 15 objections hearing
6. Section 19 declaration
7. Valuation in progress
8. Section 23 award pronounced
9. Disbursement and possession
10. Completed

Litigation-stayed is a terminal exception state. Each project stores target/completion dates, notification references, remarks, budget, beneficiary counts, parcels, agency, districts, and assigned officers.

### 5.2 Parcel and GIS operations

- Store survey and subdivision identifiers, ownership references, area, land type, acquisition status, and GeoJSON geometry.
- Display parcel features on a Leaflet map with status, verification, award, and discrepancy styling.
- Provide jurisdiction-filtered parcel lists, GeoJSON, and GIS layer statistics.
- Capture field verification, notes, photographs, verifier, timestamp, and discrepancy details.

### 5.3 Compensation and R&R

- Calculate a statutory award using market value, area, urban/rural factor, attached assets, solatium, and time-based additional value.
- Run project budget what-if simulations.
- List and create compensation awards.
- List families and create rehabilitation and resettlement packages.
- Present citizen-facing compensation and R&R information.

### 5.4 Documents

- Upload/register documents associated with acquisition records.
- List documents by filters.
- Run verification and expose verification/anomaly results to authorized workflows.

### 5.5 Grievances and notifications

- Allow citizens to submit grievances and authorized officers to update them.
- Track grievance status, category, priority, responses, and resolution information.
- Provide user notifications and read/unread state.

### 5.6 Monitoring and audit

- Evaluate Delay Radar risk from statutory lapse proximity, unverified parcels, and unresolved grievances.
- Aggregate active-project risk for national/state/district views.
- Record successful mutating API calls with actor, role, endpoint, request context, and timestamp.

## 6. Functional requirements

| ID | Requirement | Acceptance criterion |
|---|---|---|
| FR-01 | Authenticate users | Valid credentials return a token and user context; invalid or inactive users receive an explicit authorization error. |
| FR-02 | Enforce role access | A user cannot access a route outside the roles declared by that route. |
| FR-03 | Enforce jurisdiction | State, district, agency, and citizen queries are constrained to the authenticated user’s scope. |
| FR-04 | Track milestones | Authorized users can update a project milestone and the project status reflects the acquisition lifecycle. |
| FR-05 | Show parcel geography | Valid parcel GeoJSON renders as a selectable polygon with owner, area, and status details. |
| FR-06 | Verify ground survey | A parcel can store verification evidence and discrepancy state with verifier identity. |
| FR-07 | Calculate compensation | Given valid calculation inputs, the API returns component values and a rounded gross award. |
| FR-08 | Expose citizen transparency | A citizen can view only their linked claims, awards, R&R packages, notifications, and grievances. |
| FR-09 | Identify delays | Active projects receive a bounded 0–100 risk score and explainable bottleneck entries. |
| FR-10 | Audit mutations | Successful state-changing operations covered by audit middleware create an audit record. |

## 7. Non-functional requirements

- **Security:** HTTPS in deployment, secret-managed environment configuration, short-lived/rotated tokens, strict CORS allow-list, rate limiting on authentication, validation of all request bodies, and redaction of sensitive identity data in logs.
- **Privacy:** Aadhaar values must remain hashed or tokenized; access must be scoped to the minimum required records.
- **Availability:** API health endpoint must be suitable for process and load-balancer checks.
- **Performance:** Paginate list endpoints, index jurisdiction/status/lookup fields, and avoid loading all geometry for non-map views.
- **Auditability:** Mutations must preserve actor, action, resource/module, endpoint, and timestamp.
- **Accessibility:** Role dashboards and citizen flows should remain keyboard navigable, readable, and responsive.
- **Maintainability:** Keep client API modules, server routes/controllers, services, and Mongoose models separated by responsibility.

## 8. Success measures

- 100% of protected API requests reject missing/invalid authentication.
- 100% of scoped list queries apply the authenticated user’s jurisdiction filter.
- Compensation results are reproducible for identical inputs.
- Delay Radar results include a score, level, evaluation timestamp, and actionable bottlenecks.
- Citizen users cannot retrieve another citizen’s linked records.
- Every covered successful mutation has a corresponding audit record.

## 9. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Prototype calculations are mistaken for legal advice | Label outputs as estimates; require statutory review and approval before production use. |
| Sensitive landowner data is exposed | Enforce authorization and jurisdiction at the API boundary; minimize response fields and encrypt production data. |
| Stale or inaccurate GIS geometry | Show source and verification metadata; retain field evidence and discrepancy flags. |
| Statutory rules change | Version calculation rules and milestone policies; obtain legal review before rule changes. |
| Audit persistence fails asynchronously | Monitor failed audit writes, alert operators, and define a durable outbox/retry strategy for production. |
| API outage triggers mock authentication | Disable mock mode outside development and make degraded behavior explicit to users. |

## 10. Release scope

### Current prototype

React role dashboards, Express API, MongoDB models, seeded data, JWT/OTP routes, RBAC/jurisdiction middleware, GIS map, calculation services, Delay Radar, document verification surface, grievances, notifications, and audit middleware.

### Recommended next release

Request validation, production identity integration, durable file storage, real OCR/provider integration, pagination, automated tests, durable audit delivery, offline sync conflict handling, observability, and deployment automation.

