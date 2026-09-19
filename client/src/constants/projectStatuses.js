export const PROJECT_STATUSES = {
  PROPOSAL_SUBMITTED: { label: 'Proposal Submitted', color: 'bg-slate-500/20 text-slate-300' },
  SIA_INITIATED: { label: 'SIA Initiated (Sec 4)', color: 'bg-blue-500/20 text-blue-300' },
  SIA_APPROVED: { label: 'SIA Approved (Sec 6)', color: 'bg-indigo-500/20 text-indigo-300' },
  SECTION_11_PUBLISHED: { label: 'Sec 11 Preliminary Notif', color: 'bg-amber-500/20 text-amber-300' },
  OBJECTIONS_HEARING: { label: 'Sec 15 Objections Hearing', color: 'bg-orange-500/20 text-orange-300' },
  SECTION_19_DECLARED: { label: 'Sec 19 Declaration', color: 'bg-purple-500/20 text-purple-300' },
  VALUATION_IN_PROGRESS: { label: 'Valuation in Progress', color: 'bg-yellow-500/20 text-yellow-300' },
  AWARD_PRONOUNCED: { label: 'Award Pronounced (Sec 23)', color: 'bg-emerald-500/20 text-emerald-300' },
  DISBURSEMENT_POSSESSION: { label: 'Disbursement & Possession', color: 'bg-teal-500/20 text-teal-300' },
  COMPLETED: { label: 'Acquisition Completed', color: 'bg-emerald-500/20 text-emerald-300' },
  LITIGATION_STAYED: { label: 'Litigation Stayed', color: 'bg-rose-500/20 text-rose-300' }
};

export const MILESTONE_SECTIONS = [
  { key: 'SEC_4_SIA', label: 'Section 4: SIA Study & Public Hearing' },
  { key: 'SEC_6_SIA_APPROVAL', label: 'Section 6: Expert Group Approval' },
  { key: 'SEC_11_PRELIMINARY_NOTIF', label: 'Section 11: Preliminary Notification' },
  { key: 'SEC_15_OBJECTIONS_HEARING', label: 'Section 15: Hearing of Objections' },
  { key: 'SEC_19_DECLARATION', label: 'Section 19: Acquisition Declaration' },
  { key: 'SEC_23_VALUATION_AWARD', label: 'Section 23: Valuation & Award' },
  { key: 'SEC_31_RR_AWARD', label: 'Section 31: R&R Award Sanction' },
  { key: 'SEC_38_POSSESSION', label: 'Section 38: Final Possession' }
];
