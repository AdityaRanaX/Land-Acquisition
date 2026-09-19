export const mockReports = {
  nationalStats: {
    totalProjects: 48,
    totalAreaHectares: 24500,
    totalBudgetINR: 185000000000,
    totalDisbursedINR: 64200000000,
    totalBeneficiaries: 68400,
    avgDisbursementDays: 124,
    statePerformance: [
      { state: 'Maharashtra', activeProjects: 14, totalAreaHa: 6850, avgDisbursementDays: 114, complianceScore: 92, status: 'Top Performer' },
      { state: 'Gujarat', activeProjects: 11, totalAreaHa: 5200, avgDisbursementDays: 98, complianceScore: 94, status: 'Top Performer' },
      { state: 'Uttar Pradesh', activeProjects: 18, totalAreaHa: 9400, avgDisbursementDays: 142, complianceScore: 84, status: 'Moderate' },
      { state: 'Karnataka', activeProjects: 9, totalAreaHa: 4100, avgDisbursementDays: 130, complianceScore: 88, status: 'Moderate' },
      { state: 'Tamil Nadu', activeProjects: 8, totalAreaHa: 3800, avgDisbursementDays: 165, complianceScore: 78, status: 'Lagging' },
      { state: 'Madhya Pradesh', activeProjects: 7, totalAreaHa: 3400, avgDisbursementDays: 120, complianceScore: 86, status: 'Moderate' }
    ]
  },
  stateStats: {
    stateName: 'Maharashtra',
    activeProjectsCount: 14,
    totalAreaHa: 6850,
    escrowPoolINR: 27000000000,
    disbursedINR: 5300000000,
    districtsData: [
      { district: 'Pune', projects: 6, areaHa: 2030.5, disbursedCr: 530, pendingGrievances: 14, status: 'Active Phase' },
      { district: 'Satara', projects: 3, areaHa: 980.0, disbursedCr: 210, pendingGrievances: 6, status: 'Active Phase' },
      { district: 'Nashik', projects: 4, areaHa: 1450.0, disbursedCr: 340, pendingGrievances: 19, status: 'Survey Phase' },
      { district: 'Ahmednagar', projects: 2, areaHa: 760.0, disbursedCr: 120, pendingGrievances: 4, status: 'Notified' }
    ]
  }
};

export default mockReports;
