import { mockUsers, mockFieldOfficers } from '../mock/users';

export const getUsers = () => {
  return Promise.resolve(Object.values(mockUsers));
};

export const getFieldOfficers = () => {
  return Promise.resolve(mockFieldOfficers);
};

export const getUserProfile = (roleKey) => {
  return Promise.resolve(mockUsers[roleKey] || mockUsers.CENTRAL_ADMIN);
};
