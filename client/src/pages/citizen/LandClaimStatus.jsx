import React from 'react';
import { CitizenCard, CitizenPageHeader, CitizenStatus } from '../../components/citizen/CitizenCard';
import { acquisitionTimeline, citizenParcel, citizenProject } from '../../data/citizenMockData';

export const LandClaimStatus = () => (
  <div className="citizen-page">
    <CitizenPageHeader title="Acquisition Status" subtitle="Track every stage of your land acquisition case." />
    <div className="citizen-case-summary"><div><span>Case ID</span><strong>{citizenProject.caseId}</strong></div><div><span>Parcel</span><strong>{citizenParcel.parcelNumber}</strong></div><div><span>Current stage</span><strong>Compensation</strong></div><div><span>Overall progress</span><strong>67%</strong></div></div>
    <CitizenCard title="Case Timeline" subtitle="Six stages from notification through rehabilitation and resettlement."><div className="citizen-full-timeline">{acquisitionTimeline.map((stage) => <div className={`citizen-full-timeline-row ${stage.status === 'In Progress' ? 'is-current' : ''}`} key={stage.id}><span className="citizen-full-marker" /><div><div className="citizen-timeline-heading"><strong>{stage.title}</strong><CitizenStatus status={stage.status} /></div><p>{stage.description}</p>{stage.date && <small>{stage.date}</small>}</div></div>)}</div></CitizenCard>
  </div>
);
export default LandClaimStatus;
