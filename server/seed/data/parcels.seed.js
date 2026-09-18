module.exports = [
  {
    surveyNumber: '142/1A',
    subDivisionNumber: 'A',
    state: 'Maharashtra',
    district: 'Pune',
    taluka: 'Haveli',
    village: 'Wagholi',
    landType: 'AGRICULTURAL_IRRIGATED',
    urbanOrRural: 'RURAL',
    areaAcres: 2.5,
    areaHectares: 1.01,
    primaryOwnerName: 'Ramesh Tukaram Patil',
    primaryOwnerPhone: '+91 9866001234',
    acquisitionStatus: 'VALUATION_COMPLETED',
    baseMarketRatePerAcreINR: 3500000,
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [73.9782, 18.5794],
          [73.9815, 18.5799],
          [73.9822, 18.5768],
          [73.9789, 18.5762],
          [73.9782, 18.5794]
        ]
      ]
    },
    fieldVerification: {
      isVerified: true,
      verifiedAt: new Date('2024-03-12'),
      groundPhotos: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600'],
      fieldNotes: 'Well maintained sugarcane cultivation. One residential farmhouse and 2 irrigation pump sheds inspected.',
      discrepancyDetected: false
    }
  },
  {
    surveyNumber: '142/1B',
    subDivisionNumber: 'B',
    state: 'Maharashtra',
    district: 'Pune',
    taluka: 'Haveli',
    village: 'Wagholi',
    landType: 'AGRICULTURAL_UNIRRIGATED',
    urbanOrRural: 'RURAL',
    areaAcres: 1.8,
    areaHectares: 0.73,
    primaryOwnerName: 'Sunita Dnyaneshwar Shinde',
    primaryOwnerPhone: '+91 9877002233',
    acquisitionStatus: 'NOTIFIED_SEC_11',
    baseMarketRatePerAcreINR: 3500000,
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [73.9822, 18.5768],
          [73.9855, 18.5772],
          [73.9861, 18.5741],
          [73.9828, 18.5738],
          [73.9822, 18.5768]
        ]
      ]
    },
    fieldVerification: {
      isVerified: false,
      groundPhotos: [],
      fieldNotes: 'Scheduled for circle survey next week.',
      discrepancyDetected: false
    }
  },
  {
    surveyNumber: '145/2',
    subDivisionNumber: '2',
    state: 'Maharashtra',
    district: 'Pune',
    taluka: 'Haveli',
    village: 'Wagholi',
    landType: 'RESIDENTIAL',
    urbanOrRural: 'RURAL',
    areaAcres: 0.75,
    areaHectares: 0.30,
    primaryOwnerName: 'Kailash Baburao Jagtap',
    primaryOwnerPhone: '+91 9888003344',
    acquisitionStatus: 'DISPUTED',
    baseMarketRatePerAcreINR: 6500000,
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [73.9855, 18.5772],
          [73.9890, 18.5778],
          [73.9895, 18.5750],
          [73.9861, 18.5741],
          [73.9855, 18.5772]
        ]
      ]
    },
    fieldVerification: {
      isVerified: true,
      verifiedAt: new Date('2024-04-18'),
      groundPhotos: ['https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600'],
      fieldNotes: 'Dispute filed regarding boundary overlap with village gaothan road.',
      discrepancyDetected: true,
      discrepancyDetails: 'Encroachment of 0.12 acres beyond mutation record.'
    }
  },
  {
    surveyNumber: '89/3',
    subDivisionNumber: '3',
    state: 'Maharashtra',
    district: 'Pune',
    taluka: 'Khed',
    village: 'Chakan',
    landType: 'COMMERCIAL',
    urbanOrRural: 'RURAL',
    areaAcres: 3.2,
    areaHectares: 1.29,
    primaryOwnerName: 'Ganesh Shripad Kulkarni',
    primaryOwnerPhone: '+91 9899004455',
    acquisitionStatus: 'AWARD_PRONOUNCED',
    baseMarketRatePerAcreINR: 8000000,
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [73.8550, 18.7520],
          [73.8590, 18.7525],
          [73.8598, 18.7490],
          [73.8555, 18.7485],
          [73.8550, 18.7520]
        ]
      ]
    },
    fieldVerification: {
      isVerified: true,
      verifiedAt: new Date('2024-02-10'),
      groundPhotos: [],
      fieldNotes: 'Commercial warehouse footprint verified.',
      discrepancyDetected: false
    }
  }
];
