const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const logger = require('../utils/logger');
const User = require('../models/User');
const Project = require('../models/Project');
const Parcel = require('../models/Parcel');
const Family = require('../models/Family');
const Document = require('../models/Document');
const Compensation = require('../models/Compensation');
const RR = require('../models/RR');
const Grievance = require('../models/Grievance');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');

const usersData = require('./data/users.seed');
const projectsData = require('./data/projects.seed');
const parcelsData = require('./data/parcels.seed');
const familiesData = require('./data/families.seed');
const documentsData = require('./data/documents.seed');
const compensationData = require('./data/compensation.seed');
const rrData = require('./data/rr.seed');
const grievancesData = require('./data/grievances.seed');

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nlams_db';
    logger.info(`Connecting to database for seeding: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    logger.warn('Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Project.deleteMany({}),
      Parcel.deleteMany({}),
      Family.deleteMany({}),
      Document.deleteMany({}),
      Compensation.deleteMany({}),
      RR.deleteMany({}),
      Grievance.deleteMany({}),
      Notification.deleteMany({}),
      AuditLog.deleteMany({})
    ]);
    logger.success('Collections cleared.');

    // 1. Seed Users
    logger.info('Seeding 6 Role Users...');
    const createdUsers = await User.create(usersData);
    const userMap = {};
    createdUsers.forEach((u) => {
      userMap[u.role] = u;
    });
    logger.success(`Created ${createdUsers.length} users across 6 roles.`);

    // 2. Seed Projects
    logger.info('Seeding Projects with Milestones...');
    const projectDocs = projectsData.map((p) => ({
      ...p,
      assignedCollector: userMap.DISTRICT_COLLECTOR._id,
      createdAgencyUser: userMap.REQUIRING_AGENCY._id
    }));
    const createdProjects = await Project.create(projectDocs);
    const primaryProject = createdProjects[0];
    logger.success(`Created ${createdProjects.length} infrastructure projects.`);

    // 3. Seed Parcels linked to Primary Project
    logger.info('Seeding GeoJSON Parcels...');
    const parcelDocs = parcelsData.map((p, idx) => ({
      ...p,
      project: primaryProject._id,
      citizenUser: idx === 0 ? userMap.CITIZEN._id : undefined,
      'fieldVerification.verifiedBy': p.fieldVerification?.isVerified ? userMap.FIELD_SURVEYOR._id : undefined
    }));
    const createdParcels = await Parcel.create(parcelDocs);
    const primaryParcel = createdParcels[0];
    logger.success(`Created ${createdParcels.length} GeoJSON parcels.`);

    // 4. Seed Affected Families
    logger.info('Seeding Affected Families...');
    const familyDocs = familiesData.map((f, idx) => ({
      ...f,
      project: primaryProject._id,
      parcels: [createdParcels[idx % createdParcels.length]._id],
      citizenUser: idx === 0 ? userMap.CITIZEN._id : undefined
    }));
    const createdFamilies = await Family.create(familyDocs);
    const primaryFamily = createdFamilies[0];
    logger.success(`Created ${createdFamilies.length} affected families.`);

    // 5. Seed Documents
    logger.info('Seeding Scanned Documents & OCR Data...');
    const documentDocs = documentsData.map((d, idx) => ({
      ...d,
      project: primaryProject._id,
      parcel: createdParcels[idx % createdParcels.length]._id,
      uploadedBy: userMap.CITIZEN._id,
      verifiedBy: d.verificationStatus === 'AI_VERIFIED' ? userMap.DISTRICT_COLLECTOR._id : undefined,
      verifiedAt: d.verificationStatus === 'AI_VERIFIED' ? new Date() : undefined
    }));
    const createdDocuments = await Document.create(documentDocs);
    logger.success(`Created ${createdDocuments.length} documents.`);

    // 6. Seed Compensation Awards
    logger.info('Seeding Compensation Awards...');
    const compDocs = compensationData.map((c) => ({
      ...c,
      project: primaryProject._id,
      parcel: primaryParcel._id,
      calculatedBy: userMap.DISTRICT_COLLECTOR._id,
      approvedBy: userMap.DISTRICT_COLLECTOR._id
    }));
    const createdComp = await Compensation.create(compDocs);
    logger.success(`Created ${createdComp.length} compensation awards.`);

    // 7. Seed R&R Packages
    logger.info('Seeding R&R Second Schedule Packages...');
    const rrDocs = rrData.map((r) => ({
      ...r,
      project: primaryProject._id,
      family: createdFamilies[1]._id
    }));
    const createdRR = await RR.create(rrDocs);
    logger.success(`Created ${createdRR.length} R&R packages.`);

    // 8. Seed Grievances
    logger.info('Seeding Citizen Grievances...');
    const grvDocs = grievancesData.map((g, idx) => ({
      ...g,
      citizen: userMap.CITIZEN._id,
      project: primaryProject._id,
      parcel: createdParcels[idx % createdParcels.length]._id,
      assignedOfficer: userMap.DISTRICT_COLLECTOR._id
    }));
    const createdGrievances = await Grievance.create(grvDocs);
    logger.success(`Created ${createdGrievances.length} citizen grievances.`);

    // 9. Seed System Notifications
    logger.info('Seeding Notifications...');
    await Notification.create([
      {
        recipientRole: 'ALL',
        title: 'System Initialized',
        message: 'NLAMS 2024 Portal is active with RFCTLARR 2013 Statutory Workflows.',
        type: 'ALERT',
        severity: 'INFO'
      },
      {
        recipientRole: 'DISTRICT_COLLECTOR',
        title: 'Statutory 12-Month Alert',
        message: 'Pune-Nashik Rail Corridor (MRIDC-PUNE-NSK-002) is nearing Section 19 declaration lapse.',
        type: 'DELAY_RADAR_WARNING',
        severity: 'CRITICAL',
        link: '/district/tracker'
      },
      {
        recipient: userMap.CITIZEN._id,
        title: 'Award Approved',
        message: 'Statutory valuation award for Survey #142/1A has been sanctioned. Total: ₹2,93,66,506',
        type: 'PAYMENT_DISBURSED',
        severity: 'SUCCESS',
        link: '/citizen/compensation'
      }
    ]);

    // 10. Seed Initial Audit Log
    logger.info('Seeding Audit Trail...');
    await AuditLog.create({
      user: userMap.CENTRAL_ADMIN._id,
      userEmail: userMap.CENTRAL_ADMIN.email,
      role: 'CENTRAL_ADMIN',
      action: 'SYSTEM_SEED_INITIALIZATION',
      module: 'SYSTEM',
      endpoint: '/seed',
      method: 'POST',
      details: { seededCollectionsCount: 9 }
    });

    logger.success('======================================================');
    logger.success('NLAMS Database Seeding Completed Successfully! 🚀');
    logger.success('======================================================');
    logger.info('Default Seed Users:');
    usersData.forEach((u) => {
      logger.info(`  [${u.role}] => Email: ${u.email} | Pass: Password@123`);
    });

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    logger.error(`Seeding error: ${error.message}`, error.stack);
    process.exit(1);
  }
};

seedDB();
