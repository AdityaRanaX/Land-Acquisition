export const mockUsers = {
  CENTRAL_ADMIN: {
    id: 'USR-001',
    name: 'Shri Rajesh Verma (IAS)',
    email: 'central.admin@nlams.gov.in',
    role: 'CENTRAL_ADMIN',
    designation: 'Joint Secretary, Department of Land Resources (DoLR)',
    department: 'Ministry of Rural Development, Govt. of India',
    jurisdiction: { state: 'All India', district: 'National' },
    phone: '+91 9811001122'
  },
  STATE_OFFICER: {
    id: 'USR-002',
    name: 'Smt. Ananya Deshmukh',
    email: 'state.maharashtra@nlams.gov.in',
    role: 'STATE_OFFICER',
    designation: 'Principal Secretary, Revenue & Forest Dept',
    department: 'Government of Maharashtra',
    jurisdiction: { state: 'Maharashtra' },
    phone: '+91 9822003344'
  },
  DISTRICT_COLLECTOR: {
    id: 'USR-003',
    name: 'Dr. Suhas Diwase (IAS)',
    email: 'collector.pune@nlams.gov.in',
    role: 'DISTRICT_COLLECTOR',
    designation: 'District Collector & Land Acquisition Officer, Pune',
    department: 'District Revenue Administration',
    jurisdiction: { state: 'Maharashtra', district: 'Pune' },
    phone: '+91 9833005566'
  },
  REQUIRING_AGENCY: {
    id: 'USR-004',
    name: 'Er. Vikram Malhotra',
    email: 'nhai.director@nhai.gov.in',
    role: 'REQUIRING_AGENCY',
    designation: 'Chief Project Director, Expressways',
    department: 'National Highways Authority of India (NHAI)',
    jurisdiction: { state: 'Maharashtra', agencyName: 'NHAI' },
    phone: '+91 9844007788'
  },
  FIELD_SURVEYOR: {
    id: 'USR-005',
    name: 'Kiran Thorat (Talathi)',
    email: 'surveyor.haveli@nlams.gov.in',
    role: 'FIELD_SURVEYOR',
    designation: 'Circle Revenue Inspector & GIS Field Surveyor',
    department: 'Haveli Taluka Circle Office, Pune',
    jurisdiction: { state: 'Maharashtra', district: 'Pune', taluka: 'Haveli' },
    phone: '+91 9855009900'
  },
  CITIZEN: {
    id: 'USR-006',
    name: 'Ramesh Tukaram Patil',
    email: 'ramesh.patil@citizen.in',
    role: 'CITIZEN',
    designation: 'Registered Landowner (Survey #142/1A)',
    department: 'Citizen & Affected Landowner',
    jurisdiction: { state: 'Maharashtra', district: 'Pune', taluka: 'Haveli', village: 'Wagholi' },
    phone: '+91 9866001234'
  }
};

export const mockFieldOfficers = [
  { id: 'FO-01', name: 'Kiran Thorat (Talathi)', taluka: 'Haveli', circle: 'Wagholi', assignedParcelsCount: 14, completedParcelsCount: 12, phone: '+91 9855009900', status: 'ONLINE' },
  { id: 'FO-02', name: 'Pravin Jadhav (Talathi)', taluka: 'Khed', circle: 'Chakan', assignedParcelsCount: 18, completedParcelsCount: 15, phone: '+91 9855009911', status: 'ONLINE' },
  { id: 'FO-03', name: 'Sanjay More (Inspector)', taluka: 'Maval', circle: 'Talegaon', assignedParcelsCount: 8, completedParcelsCount: 8, phone: '+91 9855009922', status: 'OFFLINE' },
  { id: 'FO-04', name: 'Meena Kadam (Surveyor)', taluka: 'Satara', circle: 'Shirwal', assignedParcelsCount: 22, completedParcelsCount: 10, phone: '+91 9855009933', status: 'ONLINE' }
];

export default mockUsers;
