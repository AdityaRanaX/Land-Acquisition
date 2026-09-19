import { projectApi } from './api/index';

export const getProjects = async (filters = {}) => {
  const res = await projectApi.getProjects(filters);
  return res.data;
};

export const getProjectById = async (id) => {
  const res = await projectApi.getProjectById(id);
  return res.data;
};

export const createProject = async (projectData) => {
  const res = await projectApi.createProject(projectData);
  return res.data;
};

export const updateProjectMilestone = async (projectId, sectionKey, status, remarks = '') => {
  const res = await projectApi.updateMilestone(projectId, { sectionKey, status, remarks });
  return res.data;
};
