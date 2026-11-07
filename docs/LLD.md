# Low-Level Design (LLD)

## 1. Conventions

- Base API URL: `/api`; local default is `http://localhost:5000/api`.
- JSON responses use the shared `ApiResponse` helper.
- Protected requests carry `Authorization: Bearer <token>`.
- Identifiers are MongoDB ObjectIds unless otherwise stated.
- Timestamps are stored as JavaScript/MongoDB dates.
- Enumerated values in this document must match the corresponding model/constants before being changed.

## 2. API contract

### Authentication

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/auth/login` | Public | Validate credentials and return token/user context. |
| POST | `/auth/verify-otp` | Public/flow token | Verify OTP and complete the second factor. |
| GET | `/auth/me` | Authenticated | Return the current authenticated user. |

### Users

| Method | Path | Auth/scope | Purpose |
|---|---|---|---|
| GET | `/users` | Authenticated + jurisdiction | List users visible in the caller’s scope. |
| POST | `/users` | Central Admin or State Officer + audit | Create a user. |
| PUT | `/users/:id` | Central Admin or State Officer + audit | Update a user. |

### Projects

| Method | Path | Auth/scope | Purpose |
|---|---|---|---|
| GET | `/projects` | Authenticated + jurisdiction | List scoped projects. |
| GET | `/projects/:id` | Authenticated | Retrieve one project. |
| POST | `/projects` | Route policy + audit | Create a project/requisition. |
| PUT | `/projects/:id/milestone` | Route policy + audit | Update a statutory milestone. |

### Parcels and GIS

| Method | Path | Auth/scope | Purpose |
|---|---|---|---|
| GET | `/parcels` | Authenticated + jurisdiction | List scoped parcels. |
| GET | `/parcels/:id` | Authenticated | Retrieve parcel details. |
| POST | `/parcels` | Route policy + audit | Register a parcel. |
| POST | `/parcels/:id/field-verify` | Route policy + audit | Save ground verification evidence. |
| GET | `/gis/parcels-geojson` | Authenticated + jurisdiction | Return map-ready parcel features. |
| GET | `/gis/layer-stats` | Authenticated + jurisdiction | Return GIS summary statistics. |

### Documents, compensation, and R&R

| Method | Path | Purpose |
|---|---|---|
| GET | `/documents` | List documents. |
| POST | `/documents` | Register/upload a document; audited. |
| POST | `/documents/:id/verify` | Verify a document; audited. |
| POST | `/compensation/calculate` | Calculate an unsaved statutory estimate. |
| POST | `/compensation/simulate` | Calculate a project budget scenario. |
| GET | `/compensation` | List persisted awards. |
| POST | `/compensation/award` | Create an award record. |
| GET | `/rr` | List R&R packages. |
| GET | `/rr/families` | List affected families. |
| POST | `/rr` | Create an R&R package. |

### Grievances, notifications, and audit

| Method | Path | Purpose |
|---|---|---|
| GET | `/grievances` | List grievances within policy scope. |
| POST | `/grievances` | Submit a grievance; audited. |
| PUT | `/grievances/:id` | Update grievance status/response. |
| GET | `/notifications` | List current-user notifications. |
| PUT | `/notifications/:id/read` | Mark a notification read. |
| GET | `/audit/delay-radar` | Return Delay Radar results. |
| GET | `/audit` | Retrieve audit entries for authorized oversight. |

## 3. Core data models

### User

```text
User {
  name, email, passwordHash, role,
  designation,
  jurisdiction: { state, district, taluka, agencyName },
  isActive,
  timestamps
}
```

`role` is one of `CENTRAL_ADMIN`, `STATE_OFFICER`, `DISTRICT_COLLECTOR`, `REQUIRING_AGENCY`, `FIELD_SURVEYOR`, or `CITIZEN`.

### Project

```text
Project {
  code, name, description, purpose, requiringAgency,
  agencyContactEmail, state, districts[],
  status, totalAreaRequiredHectares,
  estimatedBudgetINR, disbursedBudgetINR,
  beneficiaryCount, parcelsCount, riskLevel,
  milestones: [{
    section, status, targetDate, completedDate,
    gazetteNotificationNumber, remarks
  }],
  assignedCollector -> User,
  createdAgencyUser -> User,
  timestamps
}
```

Indexes include `{ state: 1, status: 1 }`; project code is unique.

### Parcel

```text
Parcel {
  project -> Project,
  surveyNumber, subDivisionNumber,
  state, district, taluka, village,
  landType, urbanOrRural,
  areaAcres, areaHectares,
  primaryOwnerName, primaryOwnerAadhaarHash, primaryOwnerPhone,
  citizenUser -> User,
  acquisitionStatus,
  baseMarketRatePerAcreINR,
  geometry: { type, coordinates },
  fieldVerification: {
    isVerified, verifiedBy -> User, verifiedAt,
    groundPhotos[], fieldNotes,
    discrepancyDetected, discrepancyDetails
  },
  timestamps
}
```

Indexes include `geometry: 2dsphere`, `{ project: 1 }`, jurisdiction fields, and `{ surveyNumber, village, district }`.

### Supporting records

- `Compensation`: project/parcel/beneficiary references, calculation components, award status, and payment details.
- `Family`: affected-family identity and member/beneficiary details.
- `RR`: family/project references, entitlement, package status, and execution information.
- `Document`: owner/context references, type, storage metadata, verification status, and anomaly results.
- `Grievance`: citizen/project/parcel references, category, status, priority, narrative, responses, and resolution.
- `Notification`: recipient, type, title/message, read state, and related resource.
- `AuditLog`: actor/user email/role, action, module, endpoint, method, IP, user agent, request details, and timestamp.

## 4. Middleware order and authorization

1. `helmet`, CORS, JSON/urlencoded parsers.
2. Request logging in development.
3. Route-level `authenticate` for protected endpoints.
4. Route-level `authorize(...roles)` where a role allow-list is required.
5. Route-level `scopeJurisdiction` for list and geography queries.
6. Controller and service execution.
7. Audit wrapper around successful mutations.
8. 404 handler, then centralized error handler.

`scopeJurisdiction` creates `req.jurisdictionFilter`:

```text
CENTRAL_ADMIN       {}
STATE_OFFICER       { state }
DISTRICT_COLLECTOR  { state, district }
FIELD_SURVEYOR      { state, district }
REQUIRING_AGENCY    { requiringAgency: agencyName }
CITIZEN             { citizenUser: user._id }
```

Controllers must merge this filter with explicit query filters rather than allowing request parameters to replace it.

## 5. Compensation calculation

### Input

```text
{
  baseMarketValuePerAcre,
  acquiredAreaAcres,
  urbanOrRural: "URBAN" | "RURAL",
  distanceFactor,
  assetsStructures,
  assetsTreesCrops,
  interestDays
}
```

### Algorithm

```text
basicLandValue = baseMarketValuePerAcre * acquiredAreaAcres
factor = urban ? 1.0 : clamp(distanceFactor, 1.0, 2.0)
multipliedLandValue = basicLandValue * factor
totalAssets = assetsStructures + assetsTreesCrops
base = multipliedLandValue + totalAssets
solatium = base * 100%
additionalValue = multipliedLandValue * 12% * (interestDays / 365)
grossAward = round(base + solatium + additionalValue)
```

The response includes each intermediate component, the applied factor, rounded additional value, and `totalGrossAwardINR`. Input validation should reject negative values and invalid enum values before calling the service.

The what-if simulator applies a supplied multiplier and solatium percentage to each parcel, totals base/multiplied/solatium/gross values, and returns rounded aggregate values.

## 6. Delay Radar

`evaluateProjectDelays(projectId)`:

1. Load the project.
2. Start at risk score 10.
3. If Section 11 is completed and Section 19 is incomplete, calculate elapsed months. Add 45 for elapsed time over 10 months and classify as high/critical around the 12-month limit.
4. Count unverified and total project parcels. Add 20 when more than 40% are unverified.
5. Count unresolved grievances in `SUBMITTED`, `UNDER_INVESTIGATION`, or `HEARING_SCHEDULED`. Add 25 when more than five exist.
6. Clamp to 0–100 and classify: `LOW < 25`, `MEDIUM 25–49`, `HIGH 50–74`, `CRITICAL >= 75`.
7. Return project identity, score, level, bottlenecks, and evaluation time.

`scanAllProjectsForDelays()` evaluates all projects not in `COMPLETED` or `LITIGATION_STAYED` concurrently.

## 7. GIS data contract

The map expects a feature collection whose parcel features contain:

```text
Feature {
  id,
  geometry: { type: "Polygon" | "MultiPolygon", coordinates },
  properties: {
    surveyNumber, village, primaryOwnerName,
    areaAcres, landType, acquisitionStatus,
    isVerified, discrepancyDetected
  }
}
```

GeoJSON coordinates are `[longitude, latitude]`. The Leaflet component converts polygon rings to `[latitude, longitude]` before rendering. Status styling is deterministic: discrepancy/disputed red, awarded amber, verified/valuation complete green, otherwise blue.

## 8. Error handling and observability

- Controllers should return `ApiResponse` success/error shapes and delegate unexpected errors to the centralized handler.
- Authentication and authorization failures must return explicit 401/403 responses.
- Missing resources must return an explicit 404.
- Audit-write failures are logged as warnings and must be promoted to monitored, retryable delivery in production.
- Avoid returning stack traces or sensitive request details in production responses.

## 9. Testing plan

1. Unit-test compensation formulas, factor clamping, rounding, and simulator aggregation.
2. Unit-test Delay Radar thresholds and score clamping.
3. Middleware-test JWT parsing, inactive users, role denial, and each jurisdiction mapping.
4. API-test list endpoints for scope leakage and mutation audit creation.
5. Contract-test GeoJSON shape and coordinate handling.
6. Component-test protected redirects, role navigation, map selection, and citizen visibility.
7. Seed a disposable database for end-to-end project-to-award-to-grievance flows.

