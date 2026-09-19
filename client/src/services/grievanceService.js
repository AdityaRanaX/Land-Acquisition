import { mockGrievances } from '../mock/grievances';

let grievancesStore = [...mockGrievances];

export const getGrievances = (filters = {}) => {
  let list = [...grievancesStore];
  if (filters.status) {
    list = list.filter((g) => g.status === filters.status);
  }
  if (filters.category) {
    list = list.filter((g) => g.category === filters.category);
  }
  return Promise.resolve(list);
};

export const getGrievanceById = (id) => {
  const grv = grievancesStore.find((g) => g.id === id || g.ticketNumber === id);
  return Promise.resolve(grv || grievancesStore[0]);
};

export const submitGrievance = (grievanceData) => {
  const newGrievance = {
    id: `GRV-${Date.now().toString().slice(-4)}`,
    ticketNumber: `GRV-${Math.floor(100000 + Math.random() * 900000)}`,
    createdAt: new Date().toISOString(),
    status: 'SUBMITTED',
    hearingDate: null,
    assignedOfficer: 'Dr. Suhas Diwase (IAS)',
    ...grievanceData
  };
  grievancesStore = [newGrievance, ...grievancesStore];
  return Promise.resolve(newGrievance);
};
