import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROLES } from '../constants/roles';
import { useAuth } from '../hooks/useAuth';

// Layout & Protected Route
import AppLayout from '../components/layout/AppLayout';
import ProtectedRoute from '../components/layout/ProtectedRoute';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import OtpVerifyPage from '../pages/auth/OtpVerifyPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import { UnauthorizedPage } from '../pages/auth/UnauthorizedPage';

// Role 1: Central Pages
import CentralDashboard from '../pages/central/CentralDashboard';
import NationalProjects from '../pages/central/NationalProjects';
import StateComparison from '../pages/central/StateComparison';
import PolicyMonitoring from '../pages/central/PolicyMonitoring';
import NationalDelayRadar from '../pages/central/NationalDelayRadar';

// Role 2: State Pages
import StateDashboard from '../pages/state/StateDashboard';
import DistrictOverview from '../pages/state/DistrictOverview';
import FundAllocation from '../pages/state/FundAllocation';
import StateEscalations from '../pages/state/StateEscalations';

// Role 3: District Pages
import DistrictDashboard from '../pages/district/DistrictDashboard';
import SIAWorkflow from '../pages/district/SIAWorkflow';
import SectionTracker from '../pages/district/SectionTracker';
import LandValuation from '../pages/district/LandValuation';
import AwardGeneration from '../pages/district/AwardGeneration';

// Role 4: Requiring Agency Pages
import AgencyDashboard from '../pages/agency/AgencyDashboard';
import NewRequisition from '../pages/agency/NewRequisition';
import ProposalStatus from '../pages/agency/ProposalStatus';
import CostEstimation from '../pages/agency/CostEstimation';

// Role 5: Field Surveyor Pages
import FieldDashboard from '../pages/field/FieldDashboard';
import AssignedParcels from '../pages/field/AssignedParcels';
import SurveyInspection from '../pages/field/SurveyInspection';
import OfflineSync from '../pages/field/OfflineSync';

// Role 6: Citizen Pages
import CitizenDashboard from '../pages/citizen/CitizenDashboard';
import LandClaimStatus from '../pages/citizen/LandClaimStatus';
import CompensationBreakup from '../pages/citizen/CompensationBreakup';
import RRBenefits from '../pages/citizen/RRBenefits';
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
          {/* Role 1: Central Routes */}
          <Route path="/central" element={<CentralDashboard />} />
          <Route path="/central/projects" element={<NationalProjects />} />
          <Route path="/central/state-comparison" element={<StateComparison />} />
          <Route path="/central/policy" element={<PolicyMonitoring />} />
          <Route path="/central/delay-radar" element={<NationalDelayRadar />} />

          {/* Role 2: State Routes */}
          <Route path="/state" element={<StateDashboard />} />
          <Route path="/state/districts" element={<DistrictOverview />} />
          <Route path="/state/funds" element={<FundAllocation />} />
          <Route path="/state/escalations" element={<StateEscalations />} />

          {/* Role 3: District Routes */}
          <Route path="/district" element={<DistrictDashboard />} />
          <Route path="/district/sia" element={<SIAWorkflow />} />
          <Route path="/district/tracker" element={<SectionTracker />} />
          <Route path="/district/valuation" element={<LandValuation />} />
          <Route path="/district/awards" element={<AwardGeneration />} />

          {/* Role 4: Agency Routes */}
          <Route path="/agency" element={<AgencyDashboard />} />
          <Route path="/agency/new-requisition" element={<NewRequisition />} />
          <Route path="/agency/proposals" element={<ProposalStatus />} />
          <Route path="/agency/cost-estimation" element={<CostEstimation />} />

          {/* Role 5: Field Routes */}
          <Route path="/field" element={<FieldDashboard />} />
          <Route path="/field/parcels" element={<AssignedParcels />} />
          <Route path="/field/inspection" element={<SurveyInspection />} />
          <Route path="/field/sync" element={<OfflineSync />} />

          {/* Role 6: Citizen Routes */}
          <Route path="/citizen" element={<CitizenDashboard />} />
          <Route path="/citizen/claim-status" element={<LandClaimStatus />} />
          <Route path="/citizen/compensation" element={<CompensationBreakup />} />
          <Route path="/citizen/rr-benefits" element={<RRBenefits />} />
          <Route path="/citizen/grievances" element={<GrievancePortal />} />
        </Route>
      </Route>

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
