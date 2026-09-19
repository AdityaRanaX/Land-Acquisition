import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { CitizenCard, CitizenPageHeader, CitizenStatus } from '../../components/citizen/CitizenCard';
import { citizenProject, citizenParcel, compensationData, formatINR } from '../../data/citizenMockData';

export const CompensationBreakup = () => (
  <div className="citizen-page">
    <CitizenPageHeader title="Compensation" subtitle="View your assessed compensation and payment status." />
    <div className="citizen-kpi-grid citizen-compensation-kpis"><CitizenCard><p className="citizen-kpi-label">TOTAL ASSESSED</p><strong className="citizen-kpi-value">{formatINR(compensationData.totalAssessed)}</strong><span>{citizenParcel.parcelNumber} • {citizenProject.name}</span></CitizenCard><CitizenCard><p className="citizen-kpi-label">PAID</p><strong className="citizen-kpi-value">{formatINR(compensationData.paid)}</strong><span>Payments received</span></CitizenCard><CitizenCard><p className="citizen-kpi-label">PROCESSING</p><strong className="citizen-kpi-value">{formatINR(compensationData.processing)}</strong><span>Pending amount</span></CitizenCard></div>
    <CitizenCard title="Payment Status" subtitle="Current status of your compensation award." action={<CitizenStatus status={compensationData.status} />}><div className="citizen-payment-status"><div><span>Current status</span><strong>{compensationData.status}</strong></div><div><span>Last payment</span><strong>{compensationData.lastPaymentDate}</strong></div></div></CitizenCard>
    <CitizenCard title="Payment History" subtitle="A record of payments linked to your acquisition case."><div className="citizen-payment-list">{compensationData.paymentHistory.map((payment) => <div key={`${payment.date}-${payment.amount}`}><span>{payment.date}</span><strong>{formatINR(payment.amount)}</strong><CitizenStatus status={payment.status} /></div>)}</div></CitizenCard>
    <div className="citizen-alert"><CheckCircle2 size={18} /> Compensation records are shown for your authorized parcel only.</div>
  </div>
);
export default CompensationBreakup;
