import React, { useState, useEffect } from 'react';
import { KPICard } from '../../components/ui/KPICard';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { GISMap } from '../../components/gis/GISMap';
import { getStateStats } from '../../services/reportService';
import { getParcelsGeoJSON } from '../../services/parcelService';
import { MapPin, Coins, AlertTriangle, Building, ArrowRight, Eye, Download } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const StateDashboard = () => {
  const [stats, setStats] = useState(null);
  const [geoJsonData, setGeoJsonData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getStateStats().then(setStats);
    getParcelsGeoJSON().then(setGeoJsonData);
  }, []);

  const columns = [
    { title: 'District', key: 'district', className: 'font-bold text-bistre' },
    { title: 'Active Corridors', key: 'projects' },
    { title: 'Footprint', key: 'areaHa', render: (v) => `${v} Ha` },
    { title: 'Disbursed (₹ Cr)', key: 'disbursedCr', render: (v) => `₹${v} Cr` },
    {
      title: 'Active Disputes',
      key: 'pendingGrievances',
      render: (v) => <span className={v > 10 ? 'text-[#7E332A] font-bold' : 'text-text-primary'}>{v} Tickets</span>
    },
    {
      title: 'Status',
      key: 'status',
      render: (v) => <Badge status={v === 'Active Phase' ? 'ACQUIRED' : 'PENDING'}>{v}</Badge>
    },
    {
      title: 'Action',
      key: 'act',
      render: (_, row) => (
        <Link to="/state/districts">
          <Button size="sm" variant="outline" icon={Eye}>Inspect</Button>
        </Link>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-bistre">State Revenue Administration (Maharashtra)</h2>
          <p className="text-xs text-text-muted">Office of Principal Secretary, Revenue & Forest Department</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/state/map">
            <Button variant="outline" icon={MapPin}>State Cadastral Map</Button>
          </Link>
          <Link to="/state/reports">
            <Button variant="primary" icon={Download}>State Escrow Report</Button>
          </Link>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="State Corridors" value="14 Projects" subtitle="Across 36 Districts" icon={Building} color="kobicha" />
        <KPICard title="Acquisition Area" value="5,220 Ha" subtitle="84% SIA Studies Completed" icon={MapPin} color="success" />
        <KPICard title="State Escrow Pool" value="₹2,700 Cr" subtitle="PFMS Direct DBT Verified" icon={Coins} color="info" />
        <KPICard title="Urgent Escalations" value="2 Cases" subtitle="Sec 19 Declaration Deadlines" icon={AlertTriangle} color="danger" />
      </div>

      {/* State Map */}
      <Card
        title="State Cadastral Acquisition Footprint (Maharashtra)"
        subtitle="Real-time multi-district cadastral parcel layer synchronization"
        action={
          <Link to="/state/map">
            <Button size="sm" variant="outline" icon={ArrowRight}>Expand Map</Button>
          </Link>
        }
      >
        <GISMap features={geoJsonData?.features || []} height="380px" />
      </Card>

      {/* District Matrix */}
      <Card
        title="District Land Acquisition Matrix"
        subtitle="Aggregated progress of Land Acquisition Authorities across Maharashtra"
        action={
          <Link to="/state/districts">
            <Button size="sm" variant="outline" icon={ArrowRight}>View All Districts</Button>
          </Link>
        }
      >
        <Table columns={columns} data={stats?.districtsData || []} />
      </Card>
    </div>
  );
};

export default StateDashboard;
