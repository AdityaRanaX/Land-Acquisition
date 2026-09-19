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
import UnauthorizedPage from '../pages/auth/UnauthorizedPage';
import ProfilePage from '../pages/auth/ProfilePage';
import NotificationsPage from '../pages/auth/NotificationsPage';

// Role 1: Central Pages
import CentralDashboard from '../pages/central/CentralDashboard';
import NationalMap from '../pages/central/NationalMap';
import NationalProjects from '../pages/central/NationalProjects';
import CentralProjectDetails from '../pages/central/CentralProjectDetails';
import StateComparison from '../pages/central/StateComparison';
import PolicyMonitoring from '../pages/central/PolicyMonitoring';
import NationalDelayRadar from '../pages/central/NationalDelayRadar';
import NationalReports from '../pages/central/NationalReports';

// Role 2: State Pages
import StateDashboard from '../pages/state/StateDashboard';
import StateMap from '../pages/state/StateMap';
import StateProjects from '../pages/state/StateProjects';
import StateProjectDetails from '../pages/state/StateProjectDetails';
import DistrictOverview from '../pages/state/DistrictOverview';
import FundAllocation from '../pages/state/FundAllocation';
import StateEscalations from '../pages/state/StateEscalations';
import StateReports from '../pages/state/StateReports';

// Role 3: District Pages
import DistrictDashboard from '../pages/district/DistrictDashboard';
import DistrictProjects from '../pages/district/DistrictProjects';
import ProjectApproval from '../pages/district/ProjectApproval';
import DistrictGISMap from '../pages/district/DistrictGISMap';
import DistrictParcels from '../pages/district/DistrictParcels';
import ParcelDetails from '../pages/district/ParcelDetails';
import AffectedFamilies from '../pages/district/AffectedFamilies';
import OfficerAssignment from '../pages/district/OfficerAssignment';
import DocVerification from '../pages/district/DocVerification';
import CompensationManagement from '../pages/district/CompensationManagement';
import RRManagement from '../pages/district/RRManagement';
import DistrictDelayRadar from '../pages/district/DistrictDelayRadar';
import SIAWorkflow from '../pages/district/SIAWorkflow';
import SectionTracker from '../pages/district/SectionTracker';
import LandValuation from '../pages/district/LandValuation';
import AwardGeneration from '../pages/district/AwardGeneration';

// Role 4: Requiring Agency Pages
import AgencyDashboard from '../pages/agency/AgencyDashboard';
import AgencyProjects from '../pages/agency/AgencyProjects';
import NewRequisition from '../pages/agency/NewRequisition';
import ProjectTracking from '../pages/agency/ProjectTracking';
import AgencyParcels from '../pages/agency/AgencyParcels';
import AgencyDocuments from '../pages/agency/AgencyDocuments';
import AgencyCommunication from '../pages/agency/AgencyCommunication';
import ProposalStatus from '../pages/agency/ProposalStatus';
import CostEstimation from '../pages/agency/CostEstimation';

// Role 5: Field Surveyor Pages
import FieldDashboard from '../pages/field/FieldDashboard';
import AssignedParcels from '../pages/field/AssignedParcels';
import ParcelNavigationMap from '../pages/field/ParcelNavigationMap';
import FieldVerificationForm from '../pages/field/FieldVerificationForm';
import PhotoUpload from '../pages/field/PhotoUpload';
import FieldDocVerification from '../pages/field/FieldDocVerification';
import VerificationHistory from '../pages/field/VerificationHistory';
import OfflineSync from '../pages/field/OfflineSync';

// Role 6: Citizen Pages
import CitizenDashboard from '../pages/citizen/CitizenDashboard';
import MyLand from '../pages/citizen/MyLand';
import AcquisitionTimeline from '../pages/citizen/AcquisitionTimeline';
import CompensationBreakup from '../pages/citizen/CompensationBreakup';
import RRBenefits from '../pages/citizen/RRBenefits';
import CitizenDocuments from '../pages/citizen/CitizenDocuments';
import GrievanceSubmit from '../pages/citizen/GrievanceSubmit';
import GrievancePortal from '../pages/citizen/GrievancePortal';

const RoleRootRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  const roleRedirectMap = {
    [ROLES.CENTRAL_ADMIN]: '/central',
    [ROLES.STATE_OFFICER]: '/state',
    [ROLES.DISTRICT_COLLECTOR]: '/district',
    [ROLES.REQUIRING_AGENCY]: '/agency',
    [ROLES.FIELD_SURVEYOR]: '/field',
    [ROLES.CITIZEN]: '/citizen'
  };

  return <Navigate to={roleRedirectMap[user.role] || '/central'} replace />;
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/verify-otp" element={<OtpVerifyPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Root Dynamic Redirector */}
      <Route path="/" element={<RoleRootRedirect />} />

      {/* Authenticated Protected Shell */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          {/* Shared User Profile & Notifications */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/notifications" element={<NotificationsPage />} />

          {/* Role 1: Central Routes */}
          <Route path="/central" element={<CentralDashboard />} />
          <Route path="/central/map" element={<NationalMap />} />
          <Route path="/central/state-comparison" element={<StateComparison />} />
          <Route path="/central/projects" element={<NationalProjects />} />
          <Route path="/central/projects/:id" element={<CentralProjectDetails />} />
          <Route path="/central/delay-radar" element={<NationalDelayRadar />} />
          <Route path="/central/reports" element={<NationalReports />} />
          <Route path="/central/policy" element={<PolicyMonitoring />} />

          {/* Role 2: State Routes */}
          <Route path="/state" element={<StateDashboard />} />
          <Route path="/state/map" element={<StateMap />} />
          <Route path="/state/districts" element={<DistrictOverview />} />
          <Route path="/state/projects" element={<StateProjects />} />
          <Route path="/state/projects/:id" element={<StateProjectDetails />} />
          <Route path="/state/escalations" element={<StateEscalations />} />
          <Route path="/state/reports" element={<StateReports />} />
          <Route path="/state/funds" element={<FundAllocation />} />

          {/* Role 3: District Routes */}
          <Route path="/district" element={<DistrictDashboard />} />
          <Route path="/district/projects" element={<DistrictProjects />} />
          <Route path="/district/approvals" element={<ProjectApproval />} />
          <Route path="/district/map" element={<DistrictGISMap />} />
          <Route path="/district/parcels" element={<DistrictParcels />} />
          <Route path="/district/parcels/:id" element={<ParcelDetails />} />
          <Route path="/district/families" element={<AffectedFamilies />} />
          <Route path="/district/officers" element={<OfficerAssignment />} />
          <Route path="/district/doc-verify" element={<DocVerification />} />
          <Route path="/district/compensation" element={<CompensationManagement />} />
          <Route path="/district/rr" element={<RRManagement />} />
          <Route path="/district/delay-radar" element={<DistrictDelayRadar />} />
          <Route path="/district/sia" element={<SIAWorkflow />} />
          <Route path="/district/tracker" element={<SectionTracker />} />
          <Route path="/district/valuation" element={<LandValuation />} />
          <Route path="/district/awards" element={<AwardGeneration />} />

          {/* Role 4: Agency Routes */}
          <Route path="/agency" element={<AgencyDashboard />} />
          <Route path="/agency/projects" element={<AgencyProjects />} />
          <Route path="/agency/new-requisition" element={<NewRequisition />} />
          <Route path="/agency/tracking" element={<ProjectTracking />} />
          <Route path="/agency/parcels" element={<AgencyParcels />} />
          <Route path="/agency/documents" element={<AgencyDocuments />} />
          <Route path="/agency/communication" element={<AgencyCommunication />} />
          <Route path="/agency/proposals" element={<ProposalStatus />} />
          <Route path="/agency/cost-estimation" element={<CostEstimation />} />

          {/* Role 5: Field Routes */}
          <Route path="/field" element={<FieldDashboard />} />
          <Route path="/field/parcels" element={<AssignedParcels />} />
          <Route path="/field/navigation" element={<ParcelNavigationMap />} />
          <Route path="/field/verification" element={<FieldVerificationForm />} />
          <Route path="/field/photos" element={<PhotoUpload />} />
          <Route path="/field/doc-verify" element={<FieldDocVerification />} />
          <Route path="/field/history" element={<VerificationHistory />} />
          <Route path="/field/sync" element={<OfflineSync />} />
          <Route path="/field/inspection" element={<FieldVerificationForm />} />

          {/* Role 6: Citizen Routes */}
          <Route path="/citizen" element={<CitizenDashboard />} />
          <Route path="/citizen/my-land" element={<MyLand />} />
          <Route path="/citizen/timeline" element={<AcquisitionTimeline />} />
          <Route path="/citizen/compensation" element={<CompensationBreakup />} />
          <Route path="/citizen/rr-benefits" element={<RRBenefits />} />
          <Route path="/citizen/documents" element={<CitizenDocuments />} />
          <Route path="/citizen/grievance-submit" element={<GrievanceSubmit />} />
          <Route path="/citizen/grievances" element={<GrievancePortal />} />
          <Route path="/citizen/claim-status" element={<MyLand />} />
        </Route>
      </Route>

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
