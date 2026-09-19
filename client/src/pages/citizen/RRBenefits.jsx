import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CitizenCard, CitizenPageHeader, CitizenStatus } from '../../components/citizen/CitizenCard';
import { rrData } from '../../data/citizenMockData';

export const RRBenefits = () => (
  <div className="citizen-page">
    <CitizenPageHeader title="Rehabilitation & Resettlement" subtitle="View your R&R eligibility, package and pending actions." />
    <div className="citizen-case-summary"><div><span>Eligibility</span><strong>{rrData.eligibility}</strong></div><div><span>Package</span><strong>{rrData.package}</strong></div><div><span>Status</span><CitizenStatus status={rrData.status} /></div></div>
    <CitizenCard title="Your Benefits" subtitle="Benefits included in your rehabilitation and resettlement package."><div className="citizen-benefits-grid">{rrData.benefits.map((benefit) => <div className="citizen-benefit" key={benefit.title}><CheckCircle2 size={18} /><div><strong>{benefit.title}</strong><p>{benefit.detail}</p></div></div>)}</div></CitizenCard>
    <CitizenCard className="citizen-action-card" title="Action Required" subtitle={rrData.pendingAction} action={<Link className="citizen-button citizen-button-primary" to="/citizen/documents">Review R&amp;R Details <ArrowRight size={16} /></Link>} />
  </div>
);
export default RRBenefits;
