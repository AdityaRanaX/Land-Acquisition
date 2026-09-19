import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Ruler, Sprout } from 'lucide-react';
import { GISMap } from '../../components/gis/GISMap';
import { CitizenCard, CitizenPageHeader, CitizenStatus } from '../../components/citizen/CitizenCard';
import { citizenGeoJson, citizenParcel, citizenProject } from '../../data/citizenMockData';

export const MyLand = () => (
  <div className="citizen-page">
    <CitizenPageHeader title="My Land" subtitle="View the land parcel associated with your acquisition case.">
      <span className="citizen-context-pill">{citizenParcel.village} • Parcel {citizenParcel.parcelNumber}</span>
    </CitizenPageHeader>

    <div className="citizen-two-column">
      <CitizenCard title={`Parcel ${citizenParcel.parcelNumber}`} subtitle={`${citizenParcel.village}, ${citizenParcel.district}, ${citizenParcel.state}`}>
        <div className="citizen-detail-list">
          <div><span>Area</span><strong><Ruler size={16} />{citizenParcel.area}</strong></div>
          <div><span>Land type</span><strong><Sprout size={16} />{citizenParcel.landType}</strong></div>
          <div><span>Project</span><strong>{citizenProject.name}</strong></div>
          <div><span>Case ID</span><strong>{citizenProject.caseId}</strong></div>
          <div><span>Acquisition</span><CitizenStatus status={citizenParcel.acquisitionStatus} /></div>
        </div>
        <Link className="citizen-button citizen-button-primary" to="/citizen/acquisition-status">
          View Acquisition Status <ArrowRight size={16} />
        </Link>
      </CitizenCard>

      <CitizenCard title="Parcel Details" subtitle="Your authorized parcel location and acquisition boundary.">
        <div className="citizen-map-label"><MapPin size={16} /> {citizenParcel.village}, {citizenParcel.district}</div>
        <GISMap features={citizenGeoJson.features} height="360px" mode="citizen" />
      </CitizenCard>
    </div>
  </div>
);

export default MyLand;
