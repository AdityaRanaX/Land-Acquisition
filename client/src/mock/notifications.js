export const mockNotifications = [
  {
    id: 'NOTIF-1',
    title: 'Statutory 12-Month Alert',
    message: 'Pune-Nashik Rail Corridor (MRIDC-PUNE-NSK-002) is nearing Section 19 declaration statutory lapse window.',
    type: 'DELAY_RADAR_WARNING',
    severity: 'CRITICAL',
    createdAt: '2024-09-18T10:00:00Z',
    isRead: false,
    link: '/district/tracker'
  },
  {
    id: 'NOTIF-2',
    title: 'Section 23 Award Sanctioned',
    message: 'Statutory valuation award for Survey #142/1A has been sanctioned. Total: ₹2,93,66,506 (Includes 100% Solatium).',
    type: 'PAYMENT_DISBURSED',
    severity: 'SUCCESS',
    createdAt: '2024-09-17T15:30:00Z',
    isRead: false,
    link: '/citizen/compensation'
  },
  {
    id: 'NOTIF-3',
    title: 'New Requisition Submitted',
    message: 'Talegaon Industrial Extension proposal submitted by MIDC for Pune District.',
    type: 'ALERT',
    severity: 'INFO',
    createdAt: '2024-09-16T11:20:00Z',
    isRead: true,
    link: '/district/approvals'
  },
  {
    id: 'NOTIF-4',
    title: 'Dispute Hearing Scheduled',
    message: 'Collector hearing scheduled for Grievance #GRV-882190 on 25-Sep at 11:00 AM.',
    type: 'GRIEVANCE_UPDATE',
    severity: 'WARNING',
    createdAt: '2024-09-15T09:45:00Z',
    isRead: true,
    link: '/citizen/grievances'
  }
];

export default mockNotifications;
