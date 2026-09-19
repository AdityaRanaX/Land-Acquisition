import React, { useState, useEffect } from 'react';
import { KPICard } from '../../components/ui/KPICard';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { GISMap } from '../../components/gis/GISMap';
import { DelayRadar } from '../../components/shared/DelayRadar';
import { getParcels, getParcelsGeoJSON } from '../../services/parcelService';
import { Scale, Users, LandPlot, AlertTriangle, Eye, ArrowRight, UserCheck, FileSearch, Coins } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const DistrictDashboard = () => {
  const [parcels, setParcels] = useState([]);
  const [geoJsonData, setGeoJsonData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getParcels().then(setParcels);
    getParcelsGeoJSON().then(setGeoJsonData);
  }, []);

  const parcelColumns = [
    { title: 'Survey #', key: 'surveyNumber', render: (v) => <span className="font-mono font-bold text-kobicha">{v}</span> },
    { title: 'Village', key: 'village' },
    { title: 'Primary Landowner', key: 'primaryOwnerName', className: 'font-bold text-bistre' },
    { title: 'Area (Acres)', key: 'areaAcres' },
    {
      title: 'Status',
      key: 'acquisitionStatus',
      render: (v) => <Badge status={v}>{v?.replace(/_/g, ' ')}</Badge>
    },
    {
      title: 'Action',
      key: 'act',
      render: (_, row) => (
        <Link to={`/district/parcels/${row.id}`}>
          <Button size="sm" variant="outline" icon={Eye}>Inspect Plot</Button>
        </Link>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-bistre">District Land Acquisition Authority (Pune)</h2>
          <p className="text-xs text-text-muted">Office of District Collector & Competent LAA Authority</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/district/compensation">
            <Button variant="primary" icon={Coins}>Pronounce Section 23 Award</Button>
          </Link>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="District Parcels" value={parcels.length || 4} subtitle="Wagholi & Chakan Circles" icon={LandPlot} color="kobicha" />
        <KPICard title="SIA Approvals" value="100%" subtitle="Social Impact Study Cleared" icon={Users} color="success" />
        <KPICard title="Award Sanctions" value="₹2.93 Cr" subtitle="Section 23 Award Ready" icon={Scale} color="info" />
        <KPICard title="Boundary Objections" value="1 Disputed" subtitle="Courtyard Marker Conflict" icon={AlertTriangle} color="danger" />
      </div>

      {/* Quick Action Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link to="/district/officers" className="p-3 bg-surface rounded-xl border border-chamoisee/25 hover:border-kobicha hover:bg-buff/15 transition-all text-center group">
          <UserCheck className="w-5 h-5 text-kobicha mx-auto mb-1 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-bistre block">Assign Officers</span>
          <span className="text-[10px] text-text-muted">Field Surveyors</span>
        </Link>
        <Link to="/district/doc-verify" className="p-3 bg-surface rounded-xl border border-chamoisee/25 hover:border-kobicha hover:bg-buff/15 transition-all text-center group">
          <FileSearch className="w-5 h-5 text-kobicha mx-auto mb-1 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-bistre block">Verify Documents</span>
          <span className="text-[10px] text-text-muted">Smart AI/OCR</span>
        </Link>
        <Link to="/district/compensation" className="p-3 bg-surface rounded-xl border border-chamoisee/25 hover:border-kobicha hover:bg-buff/15 transition-all text-center group">
          <Coins className="w-5 h-5 text-kobicha mx-auto mb-1 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-bistre block">Valuation & Awards</span>
          <span className="text-[10px] text-text-muted">100% Solatium</span>
        </Link>
        <Link to="/district/rr" className="p-3 bg-surface rounded-xl border border-chamoisee/25 hover:border-kobicha hover:bg-buff/15 transition-all text-center group">
          <Scale className="w-5 h-5 text-kobicha mx-auto mb-1 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-bistre block">R&R Sanctions</span>
          <span className="text-[10px] text-text-muted">Schedule II Aid</span>
        </Link>
      </div>

      {/* GIS Cadastral Map */}
      <Card
        title="District Cadastral Spatial Viewer"
        subtitle="Interactive plot boundary selection, valuation layers, and discrepancy flags"
        action={
          <Link to="/district/map">
            <Button size="sm" variant="outline" icon={ArrowRight}>Full GIS View</Button>
          </Link>
        }
      >
        <GISMap
          features={geoJsonData?.features || []}
          height="380px"
          onSelectParcel={(p) => navigate(`/district/parcels/${p.id}`)}
        />
      </Card>

      {/* Grid: Parcels Table & Delay Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card
            title="Land Parcels Queue (Haveli Taluka)"
            subtitle="Click on any survey row to review detailed ownership & ground survey records"
            action={
              <Link to="/district/parcels">
                <Button size="sm" variant="outline" icon={ArrowRight}>View All</Button>
              </Link>
            }
          >
            <Table
              columns={parcelColumns}
              data={parcels}
              onRowClick={(row) => navigate(`/district/parcels/${row.id}`)}
            />
          </Card>
        </div>
        <div>
          <DelayRadar />
        </div>
      </div>
    </div>
  );
};

export default DistrictDashboard;
