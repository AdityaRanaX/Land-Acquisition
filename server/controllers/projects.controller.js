const Project = require('../models/Project');
const ApiResponse = require('../utils/apiResponse');
const { createNotification } = require('../services/notification.service');

// @desc Get list of projects (jurisdiction filtered)
// @route GET /api/projects
const getProjects = async (req, res, next) => {
  try {
    const { status, state, district, purpose, search } = req.query;
    const filter = { ...req.jurisdictionFilter };

    if (status) filter.status = status;
    if (state) filter.state = state;
    if (district) filter.districts = district;
    if (purpose) filter.purpose = purpose;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } }
      ];
    }

    const projects = await Project.find(filter)
      .populate('assignedCollector', 'name email designation')
      .sort({ createdAt: -1 });

    return ApiResponse.success(res, projects, 'Projects retrieved successfully', 200, { count: projects.length });
  } catch (error) {
    next(error);
  }
};

// @desc Get project details with milestones
// @route GET /api/projects/:id
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('assignedCollector', 'name email phone designation')
      .populate('createdAgencyUser', 'name email');

    if (!project) {
      return ApiResponse.notFound(res, 'Project not found');
    }

    return ApiResponse.success(res, project, 'Project details retrieved');
  } catch (error) {
    next(error);
  }
};

// @desc Create new land acquisition proposal (Requiring Agency)
// @route POST /api/projects
const createProject = async (req, res, next) => {
  try {
    const {
      name,
      code,
      description,
      purpose,
      requiringAgency,
      agencyContactEmail,
      state,
      districts,
      totalAreaRequiredHectares,
      estimatedBudgetINR,
      assignedCollector
    } = req.body;

    const defaultMilestones = [
      { section: 'SEC_4_SIA', status: 'PENDING' },
      { section: 'SEC_6_SIA_APPROVAL', status: 'PENDING' },
      { section: 'SEC_11_PRELIMINARY_NOTIF', status: 'PENDING' },
      { section: 'SEC_15_OBJECTIONS_HEARING', status: 'PENDING' },
      { section: 'SEC_19_DECLARATION', status: 'PENDING' },
      { section: 'SEC_23_VALUATION_AWARD', status: 'PENDING' },
      { section: 'SEC_31_RR_AWARD', status: 'PENDING' },
      { section: 'SEC_38_POSSESSION', status: 'PENDING' }
    ];

    const project = await Project.create({
      name,
      code: code || `LARR-${Date.now().toString().slice(-6)}`,
      description,
      purpose,
      requiringAgency: requiringAgency || req.user.jurisdiction?.agencyName || 'Requiring Body',
      agencyContactEmail: agencyContactEmail || req.user.email,
      state,
      districts: Array.isArray(districts) ? districts : [districts],
      totalAreaRequiredHectares,
      estimatedBudgetINR,
      assignedCollector,
      createdAgencyUser: req.user._id,
      milestones: defaultMilestones
    });

    await createNotification({
      recipientRole: 'DISTRICT_COLLECTOR',
      title: 'New Requisition Submitted',
      message: `Project ${project.code} - ${project.name} submitted for acquisition in ${state}.`,
      severity: 'INFO',
      link: `/district/projects/${project._id}`
    });

    return ApiResponse.created(res, project, 'Project requisition created successfully');
  } catch (error) {
    next(error);
  }
};

// @desc Update project status / milestones
// @route PUT /api/projects/:id/milestone
const updateMilestone = async (req, res, next) => {
  try {
    const { section, status, completedDate, remarks, gazetteNotificationNumber } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return ApiResponse.notFound(res, 'Project not found');
    }

    const milestoneIndex = project.milestones.findIndex((m) => m.section === section);
    if (milestoneIndex > -1) {
      project.milestones[milestoneIndex].status = status;
      if (completedDate) project.milestones[milestoneIndex].completedDate = completedDate;
      if (remarks) project.milestones[milestoneIndex].remarks = remarks;
      if (gazetteNotificationNumber) project.milestones[milestoneIndex].gazetteNotificationNumber = gazetteNotificationNumber;
    } else {
      project.milestones.push({ section, status, completedDate, remarks, gazetteNotificationNumber });
    }

    // Update parent project status according to milestones
    if (section === 'SEC_11_PRELIMINARY_NOTIF' && status === 'COMPLETED') {
      project.status = 'SECTION_11_PUBLISHED';
    } else if (section === 'SEC_19_DECLARATION' && status === 'COMPLETED') {
      project.status = 'SECTION_19_DECLARED';
    } else if (section === 'SEC_23_VALUATION_AWARD' && status === 'COMPLETED') {
      project.status = 'AWARD_PRONOUNCED';
    } else if (section === 'SEC_38_POSSESSION' && status === 'COMPLETED') {
      project.status = 'COMPLETED';
    }

    await project.save();
    return ApiResponse.success(res, project, 'Milestone updated successfully');
  } catch (error) {
    next(error);
  }
};

// @desc Update project details or status (District Approval / Lifecycle update)
// @route PATCH /api/projects/:id
const updateProject = async (req, res, next) => {
  try {
    const { status, action, remarks, riskLevel, assignedCollector, totalAreaRequiredHectares, estimatedBudgetINR } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return ApiResponse.notFound(res, 'Project not found');
    }

    // Handle high-level workflow actions from District Collector or State Officer
    if (action === 'APPROVE') {
      project.status = 'SIA_INITIATED';
      await createNotification({
        recipient: project.createdAgencyUser,
        recipientRole: 'REQUIRING_AGENCY',
        title: 'Project Proposal Approved',
        message: `Project ${project.code} - ${project.name} has been approved by the District Authority.`,
        severity: 'SUCCESS',
        link: `/agency/projects/${project._id}`
      });
    } else if (action === 'REQUEST_CLARIFICATION') {
      await createNotification({
        recipient: project.createdAgencyUser,
        recipientRole: 'REQUIRING_AGENCY',
        title: 'Clarification / Documents Requested',
        message: `District authority requested clarification for project ${project.code}: ${remarks || 'Please review and submit additional documents.'}`,
        severity: 'WARNING',
        link: `/agency/projects/${project._id}`
      });
    } else if (action === 'REJECT') {
      project.status = 'LITIGATION_STAYED';
      await createNotification({
        recipient: project.createdAgencyUser,
        recipientRole: 'REQUIRING_AGENCY',
        title: 'Project Proposal Rejected / Returned',
        message: `Project ${project.code} proposal was rejected: ${remarks || 'Review requirements with District Authority.'}`,
        severity: 'ERROR',
        link: `/agency/projects/${project._id}`
      });
    } else if (status) {
      project.status = status;
    }

    if (remarks) project.description = project.description ? `${project.description}\n[Note: ${remarks}]` : remarks;
    if (riskLevel) project.riskLevel = riskLevel;
    if (assignedCollector) project.assignedCollector = assignedCollector;
    if (totalAreaRequiredHectares) project.totalAreaRequiredHectares = totalAreaRequiredHectares;
    if (estimatedBudgetINR) project.estimatedBudgetINR = estimatedBudgetINR;

    await project.save();

    return ApiResponse.success(res, project, 'Project updated successfully');
  } catch (error) {
    next(error);
  }
};

// @desc Run What-If delay and impact simulation
// @route POST /api/projects/simulate
const simulateDelayImpact = async (req, res, next) => {
  try {
    const { unresolvedParcels = 20, delayDays = 30, projectId } = req.body;
    const parcelsCount = Number(unresolvedParcels) || 20;
    const days = Number(delayDays) || 30;

    let projectName = 'National Highway Corridor';
    if (projectId) {
      const proj = await Project.findById(projectId);
      if (proj) projectName = proj.name;
    }

    const calculatedDelayDays = Math.round(days * 0.6);
    const affectedFamilies = Math.round(parcelsCount * 1.85);
    const pendingCompensationCases = Math.round(parcelsCount * 0.7);
    const estimatedLockedBudgetINR = parcelsCount * 7500000; // ~75L per parcel average

    return ApiResponse.success(
      res,
      {
        simulationQuery: `What if ${parcelsCount} parcels remain unresolved for ${days} days?`,
        projectName,
        expectedImpact: {
          projectDelayDays: calculatedDelayDays,
          delayFormatted: `+${calculatedDelayDays} days`,
          affectedParcels: parcelsCount,
          pendingFamilies: affectedFamilies,
          compensationCases: pendingCompensationCases,
          estimatedLockedBudgetINR,
          riskEscalation: days > 45 ? 'CRITICAL' : days > 20 ? 'HIGH' : 'MEDIUM'
        }
      },
      'What-If simulation computed successfully'
    );
  } catch (error) {
    next(error);
  }
};

// @desc Get aggregate KPI summary report for dashboards
// @route GET /api/projects/reports/summary
const getProjectSummaryReport = async (req, res, next) => {
  try {
    const filter = { ...req.jurisdictionFilter };
    const projects = await Project.find(filter);

    const totalProjects = projects.length;
    let totalLandRequiredHectares = 0;
    let totalBudgetINR = 0;
    let totalDisbursedINR = 0;
    let delayedProjectsCount = 0;

    projects.forEach((p) => {
      totalLandRequiredHectares += p.totalAreaRequiredHectares || 0;
      totalBudgetINR += p.estimatedBudgetINR || 0;
      totalDisbursedINR += p.disbursedBudgetINR || 0;
      if (p.riskLevel === 'HIGH' || p.riskLevel === 'CRITICAL' || p.status === 'LITIGATION_STAYED') {
        delayedProjectsCount += 1;
      }
    });

    const acquisitionPercentage = totalProjects > 0
      ? Math.min(100, Math.round(((totalProjects - delayedProjectsCount) / totalProjects) * 78))
      : 0;

    return ApiResponse.success(res, {
      totalProjects,
      totalLandRequiredHectares: Math.round(totalLandRequiredHectares * 100) / 100,
      totalBudgetINR,
      totalDisbursedINR,
      compensationPaidPercentage: totalBudgetINR > 0 ? Math.round((totalDisbursedINR / totalBudgetINR) * 100) : 0,
      delayedProjectsCount,
      acquisitionPercentage,
      activeStatesCount: 6
    }, 'Summary report generated');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  updateMilestone,
  simulateDelayImpact,
  getProjectSummaryReport
};
