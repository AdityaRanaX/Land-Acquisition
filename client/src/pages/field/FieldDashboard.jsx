import React from 'react';
import { KPICard } from '../../components/ui/KPICard';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { GISMap } from '../../components/gis/GISMap';
import { useGIS } from '../../hooks/useGIS';
import { LandPlot, Compass, Camera, RefreshCw, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FieldDashboard = () => {
  const { geoJsonData, stats } = useGIS();

  const assignedTasks = [
    { id: '1', surveyNumber: '142/1A', village: 'Wagholi', area: '2.5 Acres', owner: 'Ramesh Patil', status: 'VERIFIED' },
    { id: '2', surveyNumber: '142/1B', village: 'Wagholi', area: '1.8 Acres', owner: 'Sunita Shinde', status: 'PENDING_INSPECTION' },
    { id: '3', surveyNumber: '145/2', village: 'Wagholi', area: '0.75 Acres', owner: 'Kailash Jagtap', status: 'DISPUTE_FLAGGED' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Field Surveyor Workspace</h2>
          <p className="text-xs text-slate-400">Circle Inspector & Talathi Mobile Cadastral Ground Truth Verification</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/field/inspection">
            <Button variant="primary" icon={Compass}>Start GPS Ground Survey</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard title="Assigned Parcels" value="3 Plots" subtitle="Wagholi Circle, Haveli" icon={LandPlot} color="sky" />
        <KPICard title="Ground Verified" value="2 Verified" subtitle="Photos & GPS Bounds Synced" icon={CheckCircle2} color="emerald" />
        <KPICard title="Offline Sync Queue" value="0 Pending" subtitle="All field logs synchronized" icon={RefreshCw} color="purple" />
      </div>

      {/* Cadastral Map View */}
      <Card title="Mobile GPS Cadastral Map" subtitle="Walk boundaries with high-accuracy GNSS / Mobile GPS">
        <GISMap features={geoJsonData?.features || []} stats={stats} height="380px" />
      </Card>

      {/* Assigned Tasks */}
      <Card title="Today's Survey Queue" subtitle="Tap on a parcel to record ground inspection">
        <div className="divide-y divide-slate-800/80">
          {assignedTasks.map((t) => (
            <div key={t.id} className="py-3 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sky-400 text-xs">Survey #{t.surveyNumber}</span>
                  <span className="text-xs text-slate-400">({t.village})</span>
                  <Badge variant={t.status === 'VERIFIED' ? 'success' : t.status === 'DISPUTE_FLAGGED' ? 'danger' : 'warning'}>
                    {t.status}
                  </Badge>
                </div>
                <p className="text-xs text-slate-200 mt-1">Owner: {t.owner} • {t.area}</p>
              </div>
              <Link to="/field/inspection">
                <Button size="sm" variant="secondary" icon={Camera}>Inspect</Button>
              </Link>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default FieldDashboard;
