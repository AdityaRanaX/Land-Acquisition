import { mockDocuments } from '../mock/documents';

let documentsStore = [...mockDocuments];

export const getDocuments = (filters = {}) => {
  let list = [...documentsStore];
  if (filters.parcelId) {
    list = list.filter((d) => d.parcelId === filters.parcelId);
  }
  if (filters.status) {
    list = list.filter((d) => d.verificationStatus === filters.status);
  }
  return Promise.resolve(list);
};

export const getDocumentById = (id) => {
  const doc = documentsStore.find((d) => d.id === id);
  return Promise.resolve(doc || documentsStore[0]);
};

export const verifyDocumentAI = (documentId) => {
  documentsStore = documentsStore.map((d) => {
    if (d.id === documentId) {
      return {
        ...d,
        verificationStatus: 'VERIFIED',
        verificationRemarks: 'Automated AI/OCR check verified 100% against Revenue Records.'
      };
    }
    return d;
  });
  return Promise.resolve(true);
};
