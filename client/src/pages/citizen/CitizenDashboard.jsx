import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Coins, Home, LandPlot, MapPin } from 'lucide-react';
import { GISMap } from '../../components/gis/GISMap';
import { CitizenCard, CitizenPageHeader, CitizenStatus } from '../../components/citizen/CitizenCard';
import { acquisitionTimeline, citizenGeoJson, citizenParcel, citizenProfile, compensationData, rrData, citizenProject, formatINR } from '../../data/citizenMockData';

const stageClass = (status) => status === 'Completed' ? 'is-complete' : status === 'In Progress' ? 'is-current' : '';

export const CitizenDashboard = () => (
  <div className="citizen-page">
    <CitizenPageHeader title={`Welcome back, ${citizenProfile.name.split(' ')[0]}`} subtitle="Track your land acquisition case, compensation and rehabilitation status."><span className="citizen-context-pill">{citizenParcel.village} • Parcel {citizenParcel.parcelNumber}</span></CitizenPageHeader>
    <div className="citizen-kpi-grid">
      <CitizenCard><p className="citizen-kpi-label">LAND PARCEL</p><strong className="citizen-kpi-value">{citizenParcel.parcelNumber}</strong><span>{citizenParcel.village}</span></CitizenCard>
      <CitizenCard><p className="citizen-kpi-label">ACQUISITION PROGRESS</p><strong className="citizen-kpi-value">67%</strong><span>4 of 6 stages completed</span></CitizenCard>
      <CitizenCard><p className="citizen-kpi-label">COMPENSATION</p><strong className="citizen-kpi-value">{formatINR(compensationData.paid)}</strong><span>Paid • {formatINR(compensationData.processing)} processing</span></CitizenCard>
      <CitizenCard><p className="citizen-kpi-label">R&amp;R STATUS</p><strong className="citizen-kpi-value citizen-kpi-value-small">{rrData.status}</strong><span>Review pending</span></CitizenCard>
    </div>
    <CitizenCard title="Acquisition Status" subtitle="Current progress of your land acquisition case." action={<Link className="citizen-inline-link" to="/citizen/acquisition-status">View details <ArrowRight size={15} /></Link>}>
      <div className="citizen-timeline citizen-timeline-horizontal">{acquisitionTimeline.map((stage) => <div className={`citizen-timeline-item ${stageClass(stage.status)}`} key={stage.id}><span className="citizen-timeline-marker">{stage.status === 'Completed' ? <CheckCircle2 size={14} /> : stage.status === 'In Progress' ? <span /> : null}</span><strong>{stage.title}</strong><CitizenStatus status={stage.status} /></div>)}</div>
    </CitizenCard>
    <CitizenCard title="Your Land" subtitle="Authorized parcel location and acquisition boundary."><GISMap features={citizenGeoJson.features} height="380px" mode="citizen" /></CitizenCard>
    <div className="citizen-home-links">
      <Link to="/citizen/my-land"><LandPlot size={18} /><span><strong>My Land</strong><small>{citizenParcel.area} • {citizenProject.name}</small></span><ArrowRight size={16} /></Link>
      <Link to="/citizen/compensation"><Coins size={18} /><span><strong>Compensation</strong><small>{formatINR(compensationData.totalAssessed)} assessed • {compensationData.status}</small></span><ArrowRight size={16} /></Link>
      <Link to="/citizen/rr"><Home size={18} /><span><strong>R&amp;R Package</strong><small>{rrData.eligibility} • {rrData.status}</small></span><ArrowRight size={16} /></Link>
      <span className="citizen-location"><MapPin size={18} /> {citizenProject.location}</span>
    </div>
  </div>
);
export default CitizenDashboard;
