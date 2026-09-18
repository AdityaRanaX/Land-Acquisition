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

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateMilestone
};
