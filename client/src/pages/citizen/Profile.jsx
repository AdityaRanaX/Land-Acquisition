import React from 'react';
import { Mail, MapPin, ShieldCheck, User } from 'lucide-react';
import { CitizenCard, CitizenPageHeader } from '../../components/citizen/CitizenCard';
import { citizenParcel, citizenProfile, citizenProject } from '../../data/citizenMockData';

const InfoRow = ({ label, value }) => <div className="citizen-info-row"><span>{label}</span><strong>{value}</strong></div>;

export const Profile = () => (
  <div className="citizen-page">
    <CitizenPageHeader title="Profile" subtitle="Your personal and land acquisition information." />
    <div className="citizen-profile-grid">
      <CitizenCard className="citizen-profile-summary">
        <div className="citizen-avatar"><User size={28} /></div>
        <h2>{citizenProfile.name}</h2>
        <p><Mail size={15} /> {citizenProfile.email}</p>
        <span className="citizen-role-label"><ShieldCheck size={14} /> {citizenProfile.role}</span>
      </CitizenCard>
      <CitizenCard title="Personal Information">
        <InfoRow label="Name" value={citizenProfile.name} />
        <InfoRow label="Email" value={citizenProfile.email} />
        <InfoRow label="Role" value={citizenProfile.role} />
      </CitizenCard>
      <CitizenCard title="Land Information">
        <InfoRow label="Parcel" value={citizenParcel.parcelNumber} />
        <InfoRow label="Village" value={citizenParcel.village} />
        <InfoRow label="District" value={citizenParcel.district} />
        <InfoRow label="State" value={citizenParcel.state} />
      </CitizenCard>
      <CitizenCard title="Case Information">
        <InfoRow label="Case ID" value={citizenProject.caseId} />
        <InfoRow label="Project" value={citizenProject.name} />
        <InfoRow label="Location" value={<><MapPin size={15} /> {citizenProject.location}</>} />
      </CitizenCard>
    </div>
  </div>
);

export default Profile;
