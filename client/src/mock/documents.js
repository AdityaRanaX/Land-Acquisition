export const mockDocuments = [
  {
    id: 'DOC-501',
    title: 'Certified 7/12 (Satbara) Record of Rights - Parcel 142/1A',
    docType: 'EXTRACT_7_12_ROR',
    fileUrl: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=600',
    fileSize: '1.4 MB',
    fileType: 'PDF',
    projectId: 'PROJ-001',
    projectName: 'Pune-Bengaluru Green Expressway (Package 4A)',
    parcelId: 'PARCEL-101',
    surveyNumber: '142/1A',
    ownerName: 'Ramesh Tukaram Patil',
    uploadedBy: 'Ramesh Tukaram Patil (Citizen)',
    uploadedAt: '2024-01-10',
    verificationStatus: 'VERIFIED',
    ocrExtractedData: {
      ownerName: 'Ramesh Tukaram Patil',
      surveyNumber: '142/1A',
      areaMatched: true,
      confidenceScore: 0.98,
      extractedText: 'Village: Wagholi, Taluka: Haveli, Survey: 142/1A, Area: 1.01 Hectares (2.5 Acres), Primary Holder: Ramesh Tukaram Patil'
    },
    verificationRemarks: 'AI verification matched 100% against MahaBhumi Digital Land Registry database.'
  },
  {
    id: 'DOC-502',
    title: 'Registered Sale Deed - Parcel 145/2',
    docType: 'LAND_TITLE_DEED',
    fileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600',
    fileSize: '2.8 MB',
    fileType: 'PDF',
    projectId: 'PROJ-001',
    projectName: 'Pune-Bengaluru Green Expressway (Package 4A)',
    parcelId: 'PARCEL-103',
    surveyNumber: '145/2',
    ownerName: 'Kailash Baburao Jagtap',
    uploadedBy: 'Kailash Baburao Jagtap (Citizen)',
    uploadedAt: '2024-02-14',
    verificationStatus: 'REJECTED_MISMATCH',
    ocrExtractedData: {
      ownerName: 'Kailash B Jagtap',
      surveyNumber: '145/2',
      areaMatched: false,
      confidenceScore: 0.82,
      extractedText: 'Sub-registrar Haveli Deed No 4192/2018. Discrepancy observed in boundary North coordinate.'
    },
    verificationRemarks: 'Automated scan flagged anomaly: Boundary dimension mismatch with village master map.'
  },
  {
    id: 'DOC-503',
    title: 'Section 19 Gazette Notification (MAH-GAZ-2024-1189)',
    docType: 'SECTION_19_DECLARATION',
    fileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600',
    fileSize: '4.2 MB',
    fileType: 'PDF',
    projectId: 'PROJ-001',
    projectName: 'Pune-Bengaluru Green Expressway (Package 4A)',
    uploadedBy: 'Dr. Suhas Diwase (IAS)',
    uploadedAt: '2024-05-10',
    verificationStatus: 'VERIFIED',
    ocrExtractedData: {
      confidenceScore: 1.0,
      extractedText: 'Government of Maharashtra Gazette Extraordinary: Declaration under Section 19(1) of RFCTLARR Act 2013.'
    },
    verificationRemarks: 'Official Gazette Notification published and archived.'
  }
];

export default mockDocuments;
