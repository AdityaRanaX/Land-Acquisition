import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { ROLES } from '../constants/roles';
import { useAuth } from '../hooks/useAuth';

// Layout & Protected Route
import AppLayout from '../components/layout/AppLayout';
import ProtectedRoute from '../components/layout/ProtectedRoute';

// Auth & Shared Pages
import LoginPage from '../pages/auth/LoginPage';
import OtpVerifyPage from '../pages/auth/OtpVerifyPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import { UnauthorizedPage } from '../pages/auth/UnauthorizedPage';
import ProfilePage from '../pages/auth/ProfilePage';
import NotificationsPage from '../pages/auth/NotificationsPage';

// ============================================================
// ROLE 1: CENTRAL ADMIN
// ============================================================

import CentralDashboard from '../pages/central/CentralDashboard';
import NationalMap from '../pages/central/NationalMap';
import NationalProjects from '../pages/central/NationalProjects';
import CentralProjectDetails from '../pages/central/CentralProjectDetails';
import StateComparison from '../pages/central/StateComparison';
import PolicyMonitoring from '../pages/central/PolicyMonitoring';
import NationalDelayRadar from '../pages/central/NationalDelayRadar';
import NationalReports from '../pages/central/NationalReports';

// ============================================================
// ROLE 2: STATE OFFICER
// ============================================================

import StateDashboard from '../pages/state/StateDashboard';
import StateMap from '../pages/state/StateMap';
import StateProjects from '../pages/state/StateProjects';
import StateProjectDetails from '../pages/state/StateProjectDetails';
import DistrictOverview from '../pages/state/DistrictOverview';
import FundAllocation from '../pages/state/FundAllocation';
import StateEscalations from '../pages/state/StateEscalations';
import StateReports from '../pages/state/StateReports';

// ============================================================
// ROLE 3: DISTRICT COLLECTOR
// ============================================================

// Main / newer District implementation
import DistrictDashboard from '../pages/district/DistrictDashboard';
import DistrictProjects from '../pages/district/DistrictProjects';
import DistrictProjectDetails from '../pages/district/DistrictProjectDetails';
import DistrictGIS from '../pages/district/DistrictGIS';
import DistrictParcels from '../pages/district/DistrictParcels';
import DistrictParcelDetails from '../pages/district/DistrictParcelDetails';
import DistrictFamilies from '../pages/district/DistrictFamilies';
import DistrictFieldOfficers from '../pages/district/DistrictFieldOfficers';
import DistrictDocuments from '../pages/district/DistrictDocuments';
import DistrictCompensation from '../pages/district/DistrictCompensation';
import DistrictRR from '../pages/district/DistrictRR';
import DistrictDelayRadar from '../pages/district/DistrictDelayRadar';
import DistrictNotifications from '../pages/district/DistrictNotifications';
import DistrictProfile from '../pages/district/DistrictProfile';

// Existing / legacy District pages
import ProjectApproval from '../pages/district/ProjectApproval';
import DistrictGISMap from '../pages/district/DistrictGISMap';
import ParcelDetails from '../pages/district/ParcelDetails';
import AffectedFamilies from '../pages/district/AffectedFamilies';
import OfficerAssignment from '../pages/district/OfficerAssignment';
import DocVerification from '../pages/district/DocVerification';
import CompensationManagement from '../pages/district/CompensationManagement';
import RRManagement from '../pages/district/RRManagement';
import SIAWorkflow from '../pages/district/SIAWorkflow';
import SectionTracker from '../pages/district/SectionTracker';
import LandValuation from '../pages/district/LandValuation';
import AwardGeneration from '../pages/district/AwardGeneration';

// ============================================================
// ROLE 4: REQUIRING AGENCY
// ============================================================

import AgencyDashboard from '../pages/agency/AgencyDashboard';
import AgencyProjects from '../pages/agency/AgencyProjects';
import NewRequisition from '../pages/agency/NewRequisition';
import ProjectTracking from '../pages/agency/ProjectTracking';
import AgencyParcels from '../pages/agency/AgencyParcels';
import AgencyDocuments from '../pages/agency/AgencyDocuments';
import AgencyCommunication from '../pages/agency/AgencyCommunication';
import ProposalStatus from '../pages/agency/ProposalStatus';
import CostEstimation from '../pages/agency/CostEstimation';

// ============================================================
// ROLE 5: FIELD SURVEYOR
// ============================================================

import FieldDashboard from '../pages/field/FieldDashboard';
import AssignedParcels from '../pages/field/AssignedParcels';
import ParcelNavigationMap from '../pages/field/ParcelNavigationMap';
import FieldVerificationForm from '../pages/field/FieldVerificationForm';
import PhotoUpload from '../pages/field/PhotoUpload';
import FieldDocVerification from '../pages/field/FieldDocVerification';
import VerificationHistory from '../pages/field/VerificationHistory';
import OfflineSync from '../pages/field/OfflineSync';

// ============================================================
// ROLE 6: CITIZEN
// ============================================================

import CitizenDashboard from '../pages/citizen/CitizenDashboard';
import MyLand from '../pages/citizen/MyLand';
import AcquisitionTimeline from '../pages/citizen/AcquisitionTimeline';
import CompensationBreakup from '../pages/citizen/CompensationBreakup';
import RRBenefits from '../pages/citizen/RRBenefits';
import CitizenDocuments from '../pages/citizen/CitizenDocuments';
import GrievanceSubmit from '../pages/citizen/GrievanceSubmit';
import GrievancePortal from '../pages/citizen/GrievancePortal';

// ============================================================
// ROOT REDIRECT
// ============================================================

const RoleRootRedirect = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const roleRedirectMap = {
    [ROLES.CENTRAL_ADMIN]: '/central',
    [ROLES.STATE_OFFICER]: '/state',
    [ROLES.DISTRICT_COLLECTOR]: '/district',
    [ROLES.REQUIRING_AGENCY]: '/agency',
    [ROLES.FIELD_SURVEYOR]: '/field',
    [ROLES.CITIZEN]: '/citizen',
  };

  return (
    <Navigate
      to={roleRedirectMap[user.role] || '/central'}
      replace
    />
  );
};

// ============================================================
// ROUTES
// ============================================================

export const AppRoutes = () => {
  return (
    <Routes>
      {/* ======================================================
          PUBLIC AUTH ROUTES
          ====================================================== */}

      <Route path="/login" element={<LoginPage />} />
      <Route path="/verify-otp" element={<OtpVerifyPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Dynamic role-based root */}
      <Route path="/" element={<RoleRootRedirect />} />

      {/* ======================================================
          AUTHENTICATED APPLICATION
          ====================================================== */}

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>

          {/* ==================================================
              SHARED USER ROUTES
              ================================================== */}

          <Route
            path="/profile"
            element={<ProfilePage />}
          />

          <Route
            path="/notifications"
            element={<NotificationsPage />}
          />

          {/* ==================================================
              ROLE 1 — CENTRAL ADMIN
              ================================================== */}

          <Route
            path="/central"
            element={<CentralDashboard />}
          />

          <Route
            path="/central/map"
            element={<NationalMap />}
          />

          <Route
            path="/central/state-comparison"
            element={<StateComparison />}
          />

          <Route
            path="/central/projects"
            element={<NationalProjects />}
          />

          <Route
            path="/central/projects/:id"
            element={<CentralProjectDetails />}
          />

          <Route
            path="/central/delay-radar"
            element={<NationalDelayRadar />}
          />

          <Route
            path="/central/reports"
            element={<NationalReports />}
          />

          <Route
            path="/central/policy"
            element={<PolicyMonitoring />}
          />

          {/* ==================================================
              ROLE 2 — STATE OFFICER
              ================================================== */}

          <Route
            path="/state"
            element={<StateDashboard />}
          />

          <Route
            path="/state/map"
            element={<StateMap />}
          />

          <Route
            path="/state/districts"
            element={<DistrictOverview />}
          />

          <Route
            path="/state/projects"
            element={<StateProjects />}
          />

          <Route
            path="/state/projects/:id"
            element={<StateProjectDetails />}
          />

          <Route
            path="/state/escalations"
            element={<StateEscalations />}
          />

          <Route
            path="/state/reports"
            element={<StateReports />}
          />

          <Route
            path="/state/funds"
            element={<FundAllocation />}
          />

          {/* ==================================================
              ROLE 3 — DISTRICT COLLECTOR
              ================================================== */}

          {/* Dashboard */}
          <Route
            path="/district"
            element={<DistrictDashboard />}
          />

          {/* Projects */}
          <Route
            path="/district/projects"
            element={<DistrictProjects />}
          />

          <Route
            path="/district/projects/:id"
            element={<DistrictProjectDetails />}
          />

          {/* Project approval — legacy route preserved */}
          <Route
            path="/district/approvals"
            element={<ProjectApproval />}
          />

          {/* GIS */}
          <Route
            path="/district/gis"
            element={<DistrictGIS />}
          />

          {/* Legacy GIS route preserved */}
          <Route
            path="/district/map"
            element={<DistrictGISMap />}
          />

          {/* Parcels */}
          <Route
            path="/district/parcels"
            element={<DistrictParcels />}
          />

          <Route
            path="/district/parcels/:id"
            element={<DistrictParcelDetails />}
          />

          {/* Legacy parcel details route preserved */}
          <Route
            path="/district/parcel-details/:id"
            element={<ParcelDetails />}
          />

          {/* Families */}
          <Route
            path="/district/families"
            element={<DistrictFamilies />}
          />

          {/* Field officers */}
          <Route
            path="/district/field-officers"
            element={<DistrictFieldOfficers />}
          />

          {/* Legacy officer assignment route preserved */}
          <Route
            path="/district/officers"
            element={<OfficerAssignment />}
          />

          {/* Documents */}
          <Route
            path="/district/documents"
            element={<DistrictDocuments />}
          />

          {/* Legacy document verification route preserved */}
          <Route
            path="/district/doc-verify"
            element={<DocVerification />}
          />

          {/* Compensation */}
          <Route
            path="/district/compensation"
            element={<DistrictCompensation />}
          />

          {/* Legacy compensation route preserved */}
          <Route
            path="/district/compensation-management"
            element={<CompensationManagement />}
          />

          {/* Rehabilitation & Resettlement */}
          <Route
            path="/district/rr"
            element={<DistrictRR />}
          />

          {/* Legacy R&R route preserved */}
          <Route
            path="/district/rr-management"
            element={<RRManagement />}
          />

          {/* Delay Radar */}
          <Route
            path="/district/delay-radar"
            element={<DistrictDelayRadar />}
          />

          {/* District-specific notifications */}
          <Route
            path="/district/notifications"
            element={<DistrictNotifications />}
          />

          {/* District-specific profile */}
          <Route
            path="/district/profile"
            element={<DistrictProfile />}
          />

          {/* Existing legacy District workflow pages */}
          <Route
            path="/district/sia"
            element={<SIAWorkflow />}
          />

          <Route
            path="/district/tracker"
            element={<SectionTracker />}
          />

          <Route
            path="/district/valuation"
            element={<LandValuation />}
          />

          <Route
            path="/district/awards"
            element={<AwardGeneration />}
          />

          {/* ==================================================
              ROLE 4 — REQUIRING AGENCY
              ================================================== */}

          <Route
            path="/agency"
            element={<AgencyDashboard />}
          />

          <Route
            path="/agency/projects"
            element={<AgencyProjects />}
          />

          <Route
            path="/agency/new-requisition"
            element={<NewRequisition />}
          />

          <Route
            path="/agency/tracking"
            element={<ProjectTracking />}
          />

          <Route
            path="/agency/parcels"
            element={<AgencyParcels />}
          />

          <Route
            path="/agency/documents"
            element={<AgencyDocuments />}
          />

          <Route
            path="/agency/communication"
            element={<AgencyCommunication />}
          />

          <Route
            path="/agency/proposals"
            element={<ProposalStatus />}
          />

          <Route
            path="/agency/cost-estimation"
            element={<CostEstimation />}
          />

          {/* ==================================================
              ROLE 5 — FIELD SURVEYOR
              ================================================== */}

          <Route
            path="/field"
            element={<FieldDashboard />}
          />

          <Route
            path="/field/parcels"
            element={<AssignedParcels />}
          />

          <Route
            path="/field/navigation"
            element={<ParcelNavigationMap />}
          />

          <Route
            path="/field/verification"
            element={<FieldVerificationForm />}
          />

          <Route
            path="/field/photos"
            element={<PhotoUpload />}
          />

          <Route
            path="/field/doc-verify"
            element={<FieldDocVerification />}
          />

          <Route
            path="/field/history"
            element={<VerificationHistory />}
          />

          <Route
            path="/field/sync"
            element={<OfflineSync />}
          />

          {/* Existing inspection alias */}
          <Route
            path="/field/inspection"
            element={<FieldVerificationForm />}
          />

          {/* ==================================================
              ROLE 6 — CITIZEN
              ================================================== */}

          <Route
            path="/citizen"
            element={<CitizenDashboard />}
          />

          <Route
            path="/citizen/my-land"
            element={<MyLand />}
          />

          <Route
            path="/citizen/timeline"
            element={<AcquisitionTimeline />}
          />

          <Route
            path="/citizen/compensation"
            element={<CompensationBreakup />}
          />

          <Route
            path="/citizen/rr-benefits"
            element={<RRBenefits />}
          />

          <Route
            path="/citizen/documents"
            element={<CitizenDocuments />}
          />

          <Route
            path="/citizen/grievance-submit"
            element={<GrievanceSubmit />}
          />

          <Route
            path="/citizen/grievances"
            element={<GrievancePortal />}
          />

          <Route
            path="/citizen/claim-status"
            element={<MyLand />}
          />

        </Route>
      </Route>

      {/* ======================================================
          CATCH-ALL
          ====================================================== */}

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
};

export default AppRoutes;