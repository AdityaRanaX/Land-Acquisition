import { mockFamilies } from '../mock/families';

export const getFamilies = (filters = {}) => {
  let list = [...mockFamilies];
  if (filters.projectId) {
    list = list.filter((f) => f.projectId === filters.projectId);
  }
  if (filters.category) {
    list = list.filter((f) => f.socialCategory === filters.category);
  }
  return Promise.resolve(list);
};

export const getFamilyById = (id) => {
  const family = mockFamilies.find((f) => f.id === id);
  return Promise.resolve(family || mockFamilies[0]);
};
