export const citizenProfile = {
  name: 'Ramesh Patil',
  fullName: 'Ramesh Patil',
  email: 'ramesh.patil@citizen.in',
  role: 'Citizen / Affected Family',
  location: 'Haveli',
  district: 'Pune',
  state: 'Maharashtra',
  phone: '+91 9866001234'
};

export const citizenProject = {
  name: 'NH-361 Land Acquisition Project',
  type: 'Highway Infrastructure',
  location: 'Haveli, Maharashtra',
  caseId: 'NLAMS-CIT-1421'
};

export const citizenParcel = {
  parcelNumber: '142/1A',
  village: 'Haveli',
  district: 'Pune',
  state: 'Maharashtra',
  area: '2.4 Acres',
  landType: 'Agricultural',
  acquisitionStatus: 'In Progress',
  authorizedCitizen: 'Ramesh Patil',
  geometry: {
    type: 'Polygon',
    coordinates: [[
      [73.9782, 18.5794],
      [73.9815, 18.5799],
      [73.9822, 18.5768],
      [73.9789, 18.5762],
      [73.9782, 18.5794]
    ]]
  }
};

export const acquisitionTimeline = [
  { id: 'notification', title: 'Notification', status: 'Completed', date: '18 Jun 2026', description: 'Acquisition notification issued for your parcel.' },
  { id: 'verification', title: 'Verification', status: 'Completed', date: '02 Jul 2026', description: 'Land and ownership details verified.' },
  { id: 'award', title: 'Award', status: 'Completed', date: '28 Jul 2026', description: 'Compensation award approved for your case.' },
  { id: 'compensation', title: 'Compensation', status: 'In Progress', date: '12 Sep 2026', description: 'Final payment is being processed.' },
  { id: 'possession', title: 'Possession', status: 'Pending', date: null, description: 'Will begin after compensation is completed.' },
  { id: 'rr', title: 'R&R', status: 'Pending', date: null, description: 'Rehabilitation package review is pending.' }
];

export const compensationData = {
  totalAssessed: 1250000,
  paid: 750000,
  processing: 500000,
  status: 'Processing',
  lastPaymentDate: '12 Sep 2026',
  paymentHistory: [
    { date: '10 Aug 2026', amount: 500000, status: 'Paid' },
    { date: '12 Sep 2026', amount: 250000, status: 'Paid' },
    { date: 'Current', amount: 500000, status: 'Processing' }
  ]
};

export const rrData = {
  eligibility: 'Eligible',
  package: 'Household relocation assistance',
  status: 'Action Required',
  pendingAction: 'Please review the rehabilitation and resettlement package details.',
  benefits: [
    { title: 'Relocation assistance', detail: 'Support for household movement and resettlement.' },
    { title: 'Transportation support', detail: 'Allowance for shifting household belongings.' },
    { title: 'Livelihood assistance', detail: 'Support to restore the affected family livelihood.' }
  ]
};

export const citizenDocuments = [
  { id: 'notice', name: 'Land Acquisition Notice', type: 'Official notice', status: 'Verified', date: '18 Jun 2026', canUpload: false },
  { id: 'award', name: 'Award Copy', type: 'Compensation award', status: 'Available', date: '28 Jul 2026', canUpload: false },
  { id: 'identity', name: 'Identity Proof', type: 'KYC document', status: 'Verified', date: '02 Jul 2026', canUpload: false },
  { id: 'bank', name: 'Bank Details', type: 'Requested document', status: 'Requested', date: null, canUpload: true }
];

export const citizenGrievances = [
  {
    id: 'grievance-1',
    ticket: 'GRV-2026-0142',
    category: 'Compensation discrepancy',
    submitted: '08 Sep 2026',
    description: 'Request for clarification on the processing amount in the compensation award.',
    status: 'Under Review',
    evidence: null
  }
];

export const citizenNotifications = [
  { id: 'notification-1', title: 'Compensation payment is being processed', description: 'The remaining compensation amount is currently being processed.', date: '12 Sep 2026, 10:30 AM', read: false },
  { id: 'notification-2', title: 'Award document is now available', description: 'Your compensation award copy is available to view and download.', date: '28 Jul 2026, 04:15 PM', read: false },
  { id: 'notification-3', title: 'Additional bank documentation requested', description: 'Please upload your latest bank details to continue payment processing.', date: '14 Sep 2026, 09:00 AM', read: true },
  { id: 'notification-4', title: 'Your grievance is under review', description: 'GRV-2026-0142 has been assigned for review.', date: '08 Sep 2026, 02:20 PM', read: true }
];

export const citizenGeoJson = {
  type: 'FeatureCollection',
  features: [{
    type: 'Feature',
    id: 'citizen-parcel-142-1a',
    geometry: citizenParcel.geometry,
    properties: {
      id: 'citizen-parcel-142-1a',
      surveyNumber: citizenParcel.parcelNumber,
      village: citizenParcel.village,
      district: citizenParcel.district,
      areaAcres: 2.4,
      landType: citizenParcel.landType,
      primaryOwnerName: citizenParcel.authorizedCitizen,
      acquisitionStatus: citizenParcel.acquisitionStatus,
      projectName: citizenProject.name,
      isVerified: true,
      discrepancyDetected: false
    }
  }]
};

export const formatINR = (value) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
