import { useAuth } from './useAuth';
import { ROLES } from '../constants/roles';

export const useRole = () => {
  const { user } = useAuth();
  const currentRole = user?.role;

  return {
    role: currentRole,
    isCentralAdmin: currentRole === ROLES.CENTRAL_ADMIN,
    isStateOfficer: currentRole === ROLES.STATE_OFFICER,
    isDistrictCollector: currentRole === ROLES.DISTRICT_COLLECTOR,
    isRequiringAgency: currentRole === ROLES.REQUIRING_AGENCY,
    isFieldSurveyor: currentRole === ROLES.FIELD_SURVEYOR,
    isCitizen: currentRole === ROLES.CITIZEN,
    hasRole: (...roles) => roles.includes(currentRole)
  };
};
