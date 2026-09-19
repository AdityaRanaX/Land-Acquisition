import { mockReports } from '../mock/reports';

export const getNationalStats = () => {
  return Promise.resolve(mockReports.nationalStats);
};

export const getStateStats = () => {
  return Promise.resolve(mockReports.stateStats);
};
