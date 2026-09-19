import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { mockParcels } from '../../mock/parcels';
import {
  Compass,
  LandPlot,
  Camera,
  CheckCircle2,
  Navigation,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const FieldDashboard = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Mobile Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-bistre tracking-tight">Today's Field Route</h1>
            <span className="bg-status-success/15 text-status-success text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-status-success rounded-full animate-pulse" /> GPS Online (±1.5m)
            </span>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Talathi Circle: <span className="font-bold text-bistre">Haveli / Wagholi</span> • Surveyor: Kiran Thorat
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/field/navigation">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Navigation className="w-4 h-4 text-kobicha" /> Open GPS Route
            </Button>
          </Link>
          <Link to="/field/verification">
            <Button variant="primary" size="sm" className="gap-1.5">
              <Compass className="w-4 h-4" /> Start Inspection
            </Button>
          </Link>
        </div>
      </div>

      {/* Field Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card bodyClassName="p-3.5">
          <p className="text-[10px] uppercase font-bold text-text-muted">Assigned Today</p>
          <p className="text-xl font-black text-bistre mt-0.5">4 Plots</p>
          <p className="text-[11px] text-text-muted">Wagholi Package 4A</p>
        </Card>

        <Card bodyClassName="p-3.5">
          <p className="text-[10px] uppercase font-bold text-text-muted">Verified</p>
          <p className="text-xl font-black text-status-success mt-0.5">2 Completed</p>
          <p className="text-[11px] text-status-success font-medium">Synced with Server</p>
        </Card>

        <Card bodyClassName="p-3.5">
          <p className="text-[10px] uppercase font-bold text-text-muted">Discrepancies</p>
          <p className="text-xl font-black text-status-danger mt-0.5">1 Flagged</p>
          <p className="text-[11px] text-text-muted">Boundary encroachment</p>
        </Card>

        <Card bodyClassName="p-3.5">
          <p className="text-[10px] uppercase font-bold text-text-muted">Offline Cache</p>
          <p className="text-xl font-black text-bistre mt-0.5">Ready</p>
          <p className="text-[11px] text-text-muted">0 pending sync</p>
        </Card>
      </div>

      {/* Quick Action Navigation Grid (Mobile-friendly) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link to="/field/verification" className="block">
          <Card bodyClassName="p-4 text-center hover:border-kobicha transition-all">
            <Compass className="w-6 h-6 text-kobicha mx-auto mb-1.5" />
            <p className="font-bold text-bistre text-xs">Verify Data</p>
            <p className="text-[10px] text-text-muted">Fill land survey form</p>
          </Card>
        </Link>

        <Link to="/field/photos" className="block">
          <Card bodyClassName="p-4 text-center hover:border-kobicha transition-all">
            <Camera className="w-6 h-6 text-status-info mx-auto mb-1.5" />
            <p className="font-bold text-bistre text-xs">Photo Upload</p>
            <p className="text-[10px] text-text-muted">Capture geotagged photos</p>
          </Card>
        </Link>

        <Link to="/field/doc-verify" className="block">
          <Card bodyClassName="p-4 text-center hover:border-kobicha transition-all">
            <FileCheck className="w-6 h-6 text-status-success mx-auto mb-1.5" />
            <p className="font-bold text-bistre text-xs">Doc Scan</p>
            <p className="text-[10px] text-text-muted">OCR 7/12 & Aadhaar</p>
          </Card>
        </Link>

        <Link to="/field/history" className="block">
          <Card bodyClassName="p-4 text-center hover:border-kobicha transition-all">
            <CheckCircle2 className="w-6 h-6 text-chamoisee mx-auto mb-1.5" />
            <p className="font-bold text-bistre text-xs">History</p>
            <p className="text-[10px] text-text-muted">Past submissions</p>
          </Card>
        </Link>
      </div>

      {/* Today's Tasks Queue */}
      <Card
        title="Assigned Cadastral Plots"
        subtitle="Tap to navigate or start inspection"
        action={
          <Link to="/field/parcels">
            <Button variant="ghost" size="sm" className="text-xs text-kobicha">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        }
      >
        <div className="space-y-3">
          {mockParcels.map((parcel) => (
            <div
              key={parcel.id}
              className="p-3.5 rounded-lg border border-chamoisee/20 bg-page hover:bg-buff/10 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-bistre text-xs">
                    Survey #{parcel.surveyNumber}
                  </span>
                  <Badge status={parcel.acquisitionStatus} />
                </div>
                <p className="text-xs text-bistre font-semibold mt-1">
                  {parcel.primaryOwnerName} • {parcel.areaAcres} Acres
                </p>
                <p className="text-[11px] text-text-muted">
                  {parcel.village}, {parcel.taluka} • ID: <span className="font-mono">{parcel.id}</span>
                </p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <Link to="/field/navigation">
                  <Button variant="outline" size="sm" className="text-xs py-1 gap-1">
                    <Navigation className="w-3.5 h-3.5 text-kobicha" /> Map
                  </Button>
                </Link>
                <Link to="/field/verification">
                  <Button variant="secondary" size="sm" className="text-xs py-1 gap-1">
                    <Compass className="w-3.5 h-3.5" /> Verify
                  </Button>
                </Link>
                <Link to="/field/photos">
                  <Button variant="primary" size="sm" className="text-xs py-1 gap-1">
                    <Camera className="w-3.5 h-3.5" /> Photos
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default FieldDashboard;
