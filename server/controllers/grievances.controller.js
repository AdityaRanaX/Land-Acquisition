const Grievance = require('../models/Grievance');
const Project = require('../models/Project');
const Parcel = require('../models/Parcel');
const ApiResponse = require('../utils/apiResponse');
const { createNotification } = require('../services/notification.service');

// @desc Get grievances
// @route GET /api/grievances
const getGrievances = async (req, res, next) => {
  try {
    const { status, category, priority, projectId } = req.query;
    const filter = {};

    // Citizens only see their own grievances
    if (req.user.role === 'CITIZEN') {
      filter.citizen = req.user._id;
    } else if (req.user.role === 'DISTRICT_COLLECTOR' || req.user.role === 'FIELD_SURVEYOR') {
      const [projects, parcels] = await Promise.all([
        Project.find({ state: req.user.jurisdiction?.state, districts: req.user.jurisdiction?.district }).select('_id'),
        Parcel.find({ state: req.user.jurisdiction?.state, district: req.user.jurisdiction?.district }).select('_id')
      ]);
      filter.$or = [
        { project: { $in: projects.map((project) => project._id) } },
        { parcel: { $in: parcels.map((parcel) => parcel._id) } },
        { assignedOfficer: req.user._id }
      ];
    } else if (req.user.role === 'STATE_OFFICER' && req.user.jurisdiction?.state) {
      const projects = await Project.find({ state: req.user.jurisdiction.state }).select('_id');
      filter.project = { $in: projects.map((project) => project._id) };
    } else if (req.user.role === 'REQUIRING_AGENCY' && req.user.jurisdiction?.agencyName) {
      const projects = await Project.find({ requiringAgency: req.user.jurisdiction.agencyName }).select('_id');
      filter.project = { $in: projects.map((project) => project._id) };
    }

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (projectId) filter.project = projectId;

    const grievances = await Grievance.find(filter)
      .populate('citizen', 'name email phone')
      .populate('project', 'name code state')
      .populate('parcel', 'surveyNumber village')
      .populate('assignedOfficer', 'name email designation')
      .sort({ createdAt: -1 });

    return ApiResponse.success(res, grievances, 'Grievances retrieved');
  } catch (error) {
    next(error);
  }
};

// @desc Submit new citizen grievance
// @route POST /api/grievances
const submitGrievance = async (req, res, next) => {
  try {
    const { project, parcel, category, priority, subject, description, documentsAttached } = req.body;

    const ticketNumber = `GRV-${Date.now().toString().slice(-6)}`;

    const grievance = await Grievance.create({
      ticketNumber,
      citizen: req.user._id,
      citizenName: req.user.name,
      citizenPhone: req.user.phone,
      project,
      parcel,
      category,
      priority: priority || 'MEDIUM',
      subject,
      description,
      documentsAttached: documentsAttached || []
    });

    await createNotification({
      recipientRole: 'DISTRICT_COLLECTOR',
      title: 'New Citizen Grievance Filed',
      message: `Ticket #${ticketNumber} filed under category ${category}: ${subject}`,
      severity: 'WARNING',
      link: `/district/grievances/${grievance._id}`
    });

    return ApiResponse.created(res, grievance, 'Grievance ticket registered successfully');
  } catch (error) {
    next(error);
  }
};

// @desc Update grievance status / schedule hearing / resolve
// @route PUT /api/grievances/:id
const updateGrievance = async (req, res, next) => {
  try {
    const { status, hearingDate, hearingRemarks, resolutionSummary, assignedOfficer } = req.body;
    const grievance = await Grievance.findById(req.params.id);

    if (!grievance) {
      return ApiResponse.notFound(res, 'Grievance ticket not found');
    }

    if (status) grievance.status = status;
    if (hearingDate) grievance.hearingDate = hearingDate;
    if (hearingRemarks) grievance.hearingRemarks = hearingRemarks;
    if (resolutionSummary) grievance.resolutionSummary = resolutionSummary;
    if (assignedOfficer) grievance.assignedOfficer = assignedOfficer;

    if (status === 'RESOLVED') {
      grievance.resolvedAt = new Date();
    }

    await grievance.save();

    await createNotification({
      recipient: grievance.citizen,
      title: `Grievance #${grievance.ticketNumber} Updated`,
      message: `Your grievance status is now: ${grievance.status}.`,
      severity: grievance.status === 'RESOLVED' ? 'SUCCESS' : 'INFO'
    });

    return ApiResponse.success(res, grievance, 'Grievance ticket updated');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGrievances,
  submitGrievance,
  updateGrievance
};
