export const mockFamilies = [
  {
    id: 'FAM-01',
    familyHeadName: 'Ramesh Tukaram Patil',
    phone: '+91 9866001234',
    projectId: 'PROJ-001',
    projectName: 'Pune-Bengaluru Green Expressway (Package 4A)',
    parcelIds: ['PARCEL-101'],
    surveyNumbers: ['142/1A'],
    village: 'Wagholi',
    socialCategory: 'OBC',
    isBPL: false,
    isVulnerable: false,
    isLivelihoodLost: true,
    livelihoodType: 'AGRICULTURE',
    membersCount: 4,
    residentialDisplacement: false,
    rrEligibility: {
      subsistenceGrant: true,
      resettlementAllowance: true,
      constructedHouse: false,
      skillTraining: true
    },
    members: [
      { name: 'Ramesh Patil', relation: 'Self / Head', age: 48, gender: 'MALE', isDependent: false },
      { name: 'Laxmi Patil', relation: 'Wife', age: 44, gender: 'FEMALE', isDependent: true },
      { name: 'Amit Patil', relation: 'Son', age: 22, gender: 'MALE', isDependent: true },
      { name: 'Pooja Patil', relation: 'Daughter', age: 19, gender: 'FEMALE', isDependent: true }
    ]
  },
  {
    id: 'FAM-02',
    familyHeadName: 'Kailash Baburao Jagtap',
    phone: '+91 9888003344',
    projectId: 'PROJ-001',
    projectName: 'Pune-Bengaluru Green Expressway (Package 4A)',
    parcelIds: ['PARCEL-103'],
    surveyNumbers: ['145/2'],
    village: 'Wagholi',
    socialCategory: 'SC',
    isBPL: true,
    isVulnerable: true,
    isLivelihoodLost: true,
    livelihoodType: 'TENANT_FARMER',
    membersCount: 5,
    residentialDisplacement: true,
    rrEligibility: {
      subsistenceGrant: true,
      resettlementAllowance: true,
      constructedHouse: true,
      allottedPlotNumber: 'R&R-KESNAND-PLOT-42',
      skillTraining: true
    },
    members: [
      { name: 'Kailash Jagtap', relation: 'Self / Head', age: 52, gender: 'MALE', isDependent: false },
      { name: 'Tara Jagtap', relation: 'Wife', age: 47, gender: 'FEMALE', isDependent: true },
      { name: 'Sachin Jagtap', relation: 'Son', age: 24, gender: 'MALE', isDependent: true },
      { name: 'Rohit Jagtap', relation: 'Son', age: 20, gender: 'MALE', isDependent: true },
      { name: 'Kusum Jagtap', relation: 'Mother', age: 74, gender: 'FEMALE', isDependent: true }
    ]
  },
  {
    id: 'FAM-03',
    familyHeadName: 'Sunita Dnyaneshwar Shinde',
    phone: '+91 9877002233',
    projectId: 'PROJ-001',
    projectName: 'Pune-Bengaluru Green Expressway (Package 4A)',
    parcelIds: ['PARCEL-102'],
    surveyNumbers: ['142/1B'],
    village: 'Wagholi',
    socialCategory: 'GENERAL',
    isBPL: false,
    isVulnerable: false,
    isLivelihoodLost: true,
    livelihoodType: 'AGRICULTURE',
    membersCount: 3,
    residentialDisplacement: false,
    rrEligibility: {
      subsistenceGrant: true,
      resettlementAllowance: true,
      constructedHouse: false,
      skillTraining: true
    }
  }
];

export default mockFamilies;
