module.exports = [
  {
    title: 'Certified 7/12 (Satbara) Record of Rights - Parcel 142/1A',
    docType: 'EXTRACT_7_12_ROR',
    fileUrl: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=600',
    fileSizeKB: 1420,
    mimeType: 'application/pdf',
    verificationStatus: 'AI_VERIFIED',
    ocrExtractedData: {
      ownerName: 'Ramesh Tukaram Patil',
      surveyNumber: '142/1A',
      areaMatched: true,
      confidenceScore: 0.98,
      extractedText: 'Village: Wagholi, Taluka: Haveli, Survey: 142/1A, Area: 1.01 Hectares, Owner: Ramesh Tukaram Patil'
    },
    verificationRemarks: 'AI verification matched 100% against State Land Record database (MahaBhumi).'
  },
  {
    title: 'Registered Sale Deed - Parcel 145/2',
    docType: 'LAND_TITLE_DEED',
    fileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600',
    fileSizeKB: 2840,
    mimeType: 'application/pdf',
    verificationStatus: 'REJECTED_MISMATCH',
    ocrExtractedData: {
      ownerName: 'Kailash B Jagtap',
      surveyNumber: '145/2',
      areaMatched: false,
      confidenceScore: 0.82,
      extractedText: 'Sub-registrar Haveli Deed No 4192/2018. Discrepancy observed in boundary North axis.'
    },
    verificationRemarks: 'Automated verification flagged anomaly: Boundary dimension mismatch with village master map.'
  }
];
