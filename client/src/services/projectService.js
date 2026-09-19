import { mockProjects } from '../mock/projects';

let projectsStore = [...mockProjects];

export const getProjects = (filters = {}) => {
  let list = [...projectsStore];
  if (filters.state) {
    list = list.filter((p) => p.state.toLowerCase() === filters.state.toLowerCase());
  }
  if (filters.status) {
    list = list.filter((p) => p.status === filters.status);
  }
  if (filters.agency) {
    list = list.filter((p) => p.requiringAgency.toLowerCase().includes(filters.agency.toLowerCase()));
  }
  if (filters.search) {
    const s = filters.search.toLowerCase();
    list = list.filter((p) => p.name.toLowerCase().includes(s) || p.code.toLowerCase().includes(s));
  }
  return Promise.resolve(list);
};

export const getProjectById = (id) => {
  const proj = projectsStore.find((p) => p.id === id || p.code === id);
  return Promise.resolve(proj || projectsStore[0]);
};

export const createProject = (projectData) => {
  const newProject = {
    id: `PROJ-00${projectsStore.length + 1}`,
    code: projectData.code || `LARR-2024-${Date.now().toString().slice(-4)}`,
    status: 'PROPOSAL_SUBMITTED',
    beneficiaryCount: 0,
    parcelsCount: 0,
    disbursedBudgetINR: 0,
    riskLevel: 'LOW',
    sanctionDate: new Date().toISOString().split('T')[0],
    milestones: [
      { section: 'SEC_4_SIA', label: 'Section 4: SIA Notification', status: 'IN_PROGRESS' },
      { section: 'SEC_6_SIA_APPROVAL', label: 'Section 6: Expert Group Approval', status: 'PENDING' },
      { section: 'SEC_11_PRELIMINARY_NOTIF', label: 'Section 11: Preliminary Notification', status: 'PENDING' },
      { section: 'SEC_15_OBJECTIONS_HEARING', label: 'Section 15: Objections Hearing', status: 'PENDING' },
      { section: 'SEC_19_DECLARATION', label: 'Section 19: Acquisition Declaration', status: 'PENDING' },
      { section: 'SEC_23_VALUATION_AWARD', label: 'Section 23: Valuation Award', status: 'PENDING' },
      { section: 'SEC_31_RR_AWARD', label: 'Section 31: R&R Award Sanction', status: 'PENDING' },
      { section: 'SEC_38_POSSESSION', label: 'Section 38: Final Possession', status: 'PENDING' }
    ],
    ...projectData
  };
  projectsStore = [newProject, ...projectsStore];
  return Promise.resolve(newProject);
};

export const updateProjectMilestone = (projectId, sectionKey, status, remarks = '') => {
  projectsStore = projectsStore.map((p) => {
    if (p.id === projectId || p.code === projectId) {
      const updatedMilestones = p.milestones.map((m) =>
        m.section === sectionKey ? { ...m, status, remarks, date: new Date().toISOString().split('T')[0] } : m
      );
      return { ...p, milestones: updatedMilestones };
    }
    return p;
  });
  return Promise.resolve(true);
};
