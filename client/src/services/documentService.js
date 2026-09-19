import { documentApi } from './api/index';

export const getDocuments = async (filters = {}) => {
  const res = await documentApi.getDocuments(filters);
  return res.data;
};

export const getDocumentById = async (id) => {
  const res = await documentApi.getDocuments({ id });
  return res.data[0];
};

export const verifyDocumentAI = async (documentId) => {
  const res = await documentApi.verifyDocument(documentId);
  return res.data;
};
