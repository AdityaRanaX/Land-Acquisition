export const mockCompensations = [
  {
    id: 'COMP-001',
    parcelId: 'PARCEL-101',
    projectId: 'PROJ-001',
    projectName: 'Pune-Bengaluru Green Expressway (Package 4A)',
    surveyNumber: '142/1A',
    village: 'Wagholi',
    beneficiaryName: 'Ramesh Tukaram Patil',
    beneficiaryAadhaarMasked: '•••• •••• 4128',
    bankDetails: {
      accountNumber: '501004128934',
      ifscCode: 'HDFC0001824',
      bankName: 'HDFC Bank, Wagholi Branch',
      verified: true
    },
    baseMarketValuePerAcre: 3500000,
    acquiredAreaAcres: 2.5,
    basicLandValue: 8750000,
    multiplicationFactor: 1.5,
    multipliedLandValue: 13125000,
    assetsValueStructures: 850000,
    assetsValueTreesCrops: 320000,
    totalBaseAssetAndLandValue: 14295000,
    solatiumPercentage: 100,
    solatiumAmount: 14295000,
    interestDays: 180,
    interest12PercentAdditionalValue: 776506,
    totalGrossAwardINR: 29366506,
    disbursementStatus: 'AWARD_APPROVED',
    sanctionDate: '2024-05-20',
    transactionReference: 'NEFT-RBI-20240918-0091'
  },
  {
    id: 'COMP-002',
    parcelId: 'PARCEL-104',
    projectId: 'PROJ-002',
    projectName: 'Pune-Nashik Semi High-Speed Rail Corridor',
    surveyNumber: '89/3',
    village: 'Chakan',
    beneficiaryName: 'Ganesh Shripad Kulkarni',
    beneficiaryAadhaarMasked: '•••• •••• 9921',
    bankDetails: {
      accountNumber: '30291823901',
      ifscCode: 'SBIN0004210',
      bankName: 'State Bank of India, Chakan',
      verified: true
    },
    baseMarketValuePerAcre: 8000000,
    acquiredAreaAcres: 3.2,
    basicLandValue: 25600000,
    multiplicationFactor: 1.2,
    multipliedLandValue: 30720000,
    assetsValueStructures: 0,
    assetsValueTreesCrops: 0,
    totalBaseAssetAndLandValue: 30720000,
    solatiumPercentage: 100,
    solatiumAmount: 30720000,
    interestDays: 0,
    interest12PercentAdditionalValue: 0,
    totalGrossAwardINR: 61440000,
    disbursementStatus: 'AWARD_APPROVED',
    sanctionDate: '2024-04-10',
    transactionReference: 'NEFT-RBI-20240410-4421'
  }
];

export const mockRRPackages = [
  {
    id: 'RR-001',
    familyId: 'FAM-02',
    beneficiaryName: 'Kailash Baburao Jagtap',
    projectId: 'PROJ-001',
    projectName: 'Pune-Bengaluru Green Expressway (Package 4A)',
    surveyNumber: '145/2',
    houseConstructedOrProvided: {
      isEligible: true,
      optedCashInLieu: false,
      allottedPlotNumber: 'R&R-KESNAND-PLOT-42',
      resettlementColonyLocation: 'Kesnand Rehabilitation Zone, Pune'
    },
    oneTimeResettlementAllowanceINR: 50000,
    subsistenceGrantPerMonthINR: 3000,
    subsistencePeriodMonths: 12,
    transportationAllowanceINR: 50000,
    cattleShedPettyShopGrantINR: 25000,
    artisanGrantINR: 0,
    skillDevelopmentTrainingOffered: true,
    totalRRAmountINR: 161000,
    deliveryStatus: 'SANCTIONED',
    sanctionedDate: '2024-06-01'
  },
  {
    id: 'RR-002',
    familyId: 'FAM-01',
    beneficiaryName: 'Ramesh Tukaram Patil',
    projectId: 'PROJ-001',
    projectName: 'Pune-Bengaluru Green Expressway (Package 4A)',
    surveyNumber: '142/1A',
    houseConstructedOrProvided: { isEligible: false },
    oneTimeResettlementAllowanceINR: 50000,
    subsistenceGrantPerMonthINR: 3000,
    subsistencePeriodMonths: 12,
    transportationAllowanceINR: 0,
    cattleShedPettyShopGrantINR: 0,
    artisanGrantINR: 0,
    skillDevelopmentTrainingOffered: true,
    totalRRAmountINR: 86000,
    deliveryStatus: 'SANCTIONED',
    sanctionedDate: '2024-06-15'
  }
];

export const mockCompensation = mockCompensations;
export default mockCompensations;
