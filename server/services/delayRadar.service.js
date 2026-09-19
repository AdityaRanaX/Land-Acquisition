const Project = require('../models/Project');
const Grievance = require('../models/Grievance');
const Parcel = require('../models/Parcel');

/**
 * Heuristic rules engine that evaluates projects for statutory RFCTLARR bottlenecks
 */
const evaluateProjectDelays = async (projectId, jurisdictionFilter = {}) => {
  const projectFilter = { _id: projectId };
  if (jurisdictionFilter.state) projectFilter.state = jurisdictionFilter.state;
  if (jurisdictionFilter.district) projectFilter.districts = jurisdictionFilter.district;
  if (jurisdictionFilter.requiringAgency) projectFilter.requiringAgency = jurisdictionFilter.requiringAgency;

  const project = await Project.findOne(projectFilter);
  if (!project) return null;

  const now = new Date();
  const bottlenecks = [];
  let calculatedRiskScore = 10; // Base score 0-100

  // 1. Check Section 11 to Section 19 statutory lapse window (Statutory 12-month limit under Sec 19(7))
  const sec11 = project.milestones?.find((m) => m.section === 'SEC_11_PRELIMINARY_NOTIF');
  const sec19 = project.milestones?.find((m) => m.section === 'SEC_19_DECLARATION');

  if (sec11 && sec11.completedDate && (!sec19 || sec19.status !== 'COMPLETED')) {
    const monthsElapsed = (now - new Date(sec11.completedDate)) / (1000 * 60 * 60 * 24 * 30.4);
    if (monthsElapsed > 10) {
      calculatedRiskScore += 45;
      bottlenecks.push({
        type: 'STATUTORY_LAPSE_RISK',
        severity: monthsElapsed > 12 ? 'CRITICAL' : 'HIGH',
        message: `Sec 19 Declaration pending for ${monthsElapsed.toFixed(1)} months since Sec 11 notification. RFCTLARR Section 19(7) mandates lapse after 12 months!`
      });
    }
  }

  // 2. Check Unverified Ground Parcels
  const unverifiedParcelsCount = await Parcel.countDocuments({
    project: projectId,
    'fieldVerification.isVerified': false
  });
  const totalParcels = await Parcel.countDocuments({ project: projectId });

  if (totalParcels > 0 && unverifiedParcelsCount / totalParcels > 0.4) {
    calculatedRiskScore += 20;
    bottlenecks.push({
      type: 'FIELD_SURVEY_LAG',
      severity: 'MEDIUM',
      message: `${unverifiedParcelsCount} out of ${totalParcels} parcels (${((unverifiedParcelsCount / totalParcels) * 100).toFixed(0)}%) still pending ground verification.`
    });
  }

  // 3. Check High Grievance Backlog
  const unresolvedGrievances = await Grievance.countDocuments({
    project: projectId,
    status: { $in: ['SUBMITTED', 'UNDER_INVESTIGATION', 'HEARING_SCHEDULED'] }
  });

  if (unresolvedGrievances > 5) {
    calculatedRiskScore += 25;
    bottlenecks.push({
      type: 'CITIZEN_DISPUTE_SURGE',
      severity: unresolvedGrievances > 15 ? 'HIGH' : 'MEDIUM',
      message: `${unresolvedGrievances} unresolved citizen disputes / valuation objections active.`
    });
  }

  // Normalize score
  calculatedRiskScore = Math.min(100, Math.max(0, calculatedRiskScore));
  let computedLevel = 'LOW';
  if (calculatedRiskScore >= 75) computedLevel = 'CRITICAL';
  else if (calculatedRiskScore >= 50) computedLevel = 'HIGH';
  else if (calculatedRiskScore >= 25) computedLevel = 'MEDIUM';

  return {
    projectId: project._id,
    projectCode: project.code,
    projectName: project.name,
    riskScore: calculatedRiskScore,
    riskLevel: computedLevel,
    bottlenecks,
    evaluatedAt: now
  };
};

/**
 * Scan all active projects for radar alerts
 */
const scanAllProjectsForDelays = async (jurisdictionFilter = {}) => {
  const filter = {
    status: { $nin: ['COMPLETED', 'LITIGATION_STAYED'] }
  };
  if (jurisdictionFilter.state) filter.state = jurisdictionFilter.state;
  if (jurisdictionFilter.district) filter.districts = jurisdictionFilter.district;
  if (jurisdictionFilter.requiringAgency) filter.requiringAgency = jurisdictionFilter.requiringAgency;

  const projects = await Project.find(filter);

  const radarResults = await Promise.all(
    projects.map((p) => evaluateProjectDelays(p._id, jurisdictionFilter))
  );

  return radarResults.filter(Boolean);
};

module.exports = {
  evaluateProjectDelays,
  scanAllProjectsForDelays
};
