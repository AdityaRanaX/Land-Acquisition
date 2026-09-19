import { userApi, authApi } from './api/index';

export const getUsers = async () => {
  const res = await userApi.getUsers();
  return res.data;
};

export const getFieldOfficers = async () => {
  const res = await userApi.getUsers({ role: 'FIELD_SURVEYOR' });
  return res.data;
};

export const getUserProfile = async (roleKey) => {
  const res = await authApi.getMe();
  return res.data;
};
