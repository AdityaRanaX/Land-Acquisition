import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { mockParcels } from '../../mock/parcels';
import { LandPlot, FileText, CheckCircle2, ShieldCheck, MapPin, Download, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MyLand = () => {
  const parcel = mockParcels[0];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-bistre tracking-tight">
              Survey No. {parcel.surveyNumber}
            </h1>
            <Badge status={parcel.acquisitionStatus} />
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Parcel Identifier: <span className="font-mono font-bold text-kobicha">{parcel.id}</span> • {parcel.village}, {parcel.taluka}, {parcel.district}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/citizen/compensation">
            <Button variant="primary" size="sm" className="gap-1 text-xs">
              View Solatium Award <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Land Registration & Revenue Record">
          <dl className="grid grid-cols-2 gap-y-3.5 text-xs">
            <div>
              <dt className="text-text-muted">Registered Titleholder</dt>
              <dd className="font-bold text-bistre mt-0.5">{parcel.primaryOwnerName}</dd>
            </div>
            <div>
              <dt className="text-text-muted">Aadhaar / KYC</dt>
              <dd className="font-semibold text-status-success mt-0.5 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Linked & Verified
              </dd>
            </div>
            <div>
              <dt className="text-text-muted">Survey & Sub-Division</dt>
              <dd className="font-mono font-bold text-bistre mt-0.5">{parcel.surveyNumber} ({parcel.subDivisionNumber})</dd>
            </div>
            <div>
              <dt className="text-text-muted">Notified Land Area</dt>
              <dd className="font-bold text-bistre mt-0.5">{parcel.areaAcres} Acres ({parcel.areaHectares} Ha)</dd>
            </div>
            <div>
              <dt className="text-text-muted">Land Classification</dt>
              <dd className="font-bold text-bistre mt-0.5">{parcel.landType?.replace(/_/g, ' ')}</dd>
            </div>
            <div>
              <dt className="text-text-muted">Zone Type</dt>
              <dd className="font-bold text-bistre mt-0.5 capitalize">{parcel.urbanOrRural} Region</dd>
            </div>
          </dl>
        </Card>

        <Card title="Infrastructure Project Context">
          <dl className="grid grid-cols-1 gap-y-3.5 text-xs">
            <div>
              <dt className="text-text-muted">National Corridor</dt>
              <dd className="font-bold text-bistre mt-0.5">{parcel.projectName}</dd>
            </div>
            <div>
              <dt className="text-text-muted">Requiring Authority</dt>
              <dd className="font-semibold text-kobicha mt-0.5">National Highways Authority of India (NHAI)</dd>
            </div>
            <div>
              <dt className="text-text-muted">SLAO District Office</dt>
              <dd className="font-semibold text-bistre mt-0.5">Special Land Acquisition Officer #1, Pune Collectorate</dd>
            </div>
            <div>
              <dt className="text-text-muted">Assigned Talathi Surveyor</dt>
              <dd className="font-semibold text-bistre mt-0.5">{parcel.assignedSurveyor}</dd>
            </div>
          </dl>
        </Card>
      </div>

      <Card title="Verified Ground Assets & Crop Valuation">
        <p className="text-xs text-text-muted mb-3">
          Assets verified during joint measurement and endorsed for compensation:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-page rounded border border-chamoisee/20">
            <p className="text-text-muted font-bold">Sugarcane Crop Standing</p>
            <p className="text-bistre font-medium mt-1">2.50 Acres irrigated standing crop valued at ₹2,10,000</p>
          </div>
          <div className="p-3 bg-page rounded border border-chamoisee/20">
            <p className="text-text-muted font-bold">12 Mature Mango Trees</p>
            <p className="text-bistre font-medium mt-1">Horticulture valuation endorsed at ₹3,40,000</p>
          </div>
          <div className="p-3 bg-page rounded border border-chamoisee/20">
            <p className="text-text-muted font-bold">Farmhouse & 2 Pump Sheds</p>
            <p className="text-bistre font-medium mt-1">PWD rate evaluation endorsed at ₹12,18,253</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MyLand;
