export const APP_ROUTES = {
  AUTH: {
    LOGIN: '/login',
    OTP: '/verify-otp',
    FORGOT_PASSWORD: '/forgot-password',
    UNAUTHORIZED: '/unauthorized'
  },
  CENTRAL: {
    DASHBOARD: '/central',
    PROJECTS: '/central/projects',
    STATE_COMPARISON: '/central/state-comparison',
    POLICY: '/central/policy',
    DELAY_RADAR: '/central/delay-radar'
  },
  STATE: {
    DASHBOARD: '/state',
    DISTRICTS: '/state/districts',
    FUNDS: '/state/funds',
    ESCALATIONS: '/state/escalations'
  },
  DISTRICT: {
    DASHBOARD: '/district',
    SIA_WORKFLOW: '/district/sia',
    SECTION_TRACKER: '/district/tracker',
    VALUATION: '/district/valuation',
    AWARD_GEN: '/district/awards'
  },
  AGENCY: {
    DASHBOARD: '/agency',
    NEW_REQUISITION: '/agency/new-requisition',
    PROPOSALS: '/agency/proposals',
    COST_ESTIMATION: '/agency/cost-estimation'
  },
  FIELD: {
    DASHBOARD: '/field',
    ASSIGNED_PARCELS: '/field/parcels',
    SURVEY_INSPECTION: '/field/inspection',
    OFFLINE_SYNC: '/field/sync'
  },
  CITIZEN: {
    DASHBOARD: '/citizen',
    CLAIM_STATUS: '/citizen/claim-status',
    COMPENSATION: '/citizen/compensation',
    RR_BENEFITS: '/citizen/rr-benefits',
    GRIEVANCES: '/citizen/grievances'
  }
};
