import React, { useState, useEffect } from 'react';
import { KPICard } from '../../components/ui/KPICard';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { GISMap } from '../../components/gis/GISMap';
import { useGIS } from '../../hooks/useGIS';
import { MapPin, Coins, AlertTriangle, Building, FileCheck } from 'lucide-react';
import apiClient from '../../services/api/apiClient';

export const StateDashboard = () => {
  const { geoJsonData, stats } = useGIS();
  const [districtSummary, setDistrictSummary] = useState([
    { district: 'Pune', projects: 6, areaHa: 2030.5, disbursedCr: 530, pendingGrievances: 14, status: 'Active Phase' },
    { district: 'Satara', projects: 3, areaHa: 980.0, disbursedCr: 210, pendingGrievances: 6, status: 'Active Phase' },
    { district: 'Nashik', projects: 4, areaHa: 1450.0, disbursedCr: 340, pendingGrievances: 19, status: 'Survey Phase' },
    { district: 'Ahmednagar', projects: 2, areaHa: 760.0, disbursedCr: 120, pendingGrievances: 4, status: 'Notified' }
  ]);

  const columns = [
    { title: 'District', key: 'district', className: 'font-bold text-white' },
    { title: 'Active Projects', key: 'projects' },
    { title: 'Acquisition Footprint', key: 'areaHa', render: (v) => `${v} Ha` },
    { title: 'Disbursed (₹ Cr)', key: 'disbursedCr', render: (v) => `₹${v} Cr` },
    {
      title: 'Active Disputes',
      key: 'pendingGrievances',
      render: (v) => (
        <span className={v > 10 ? 'text-rose-400 font-bold' : 'text-slate-300'}>{v} Tickets</span>
      )
    },
    {
      title: 'Workflow Stage',
      key: 'status',
      render: (v) => <Badge variant="primary">{v}</Badge>
    }
  ];

  return (
    <div className="space-y-6">
      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="State Acquisition Projects" value="15" subtitle="Across 36 Districts in Maharashtra" icon={Building} color="sky" />
        <KPICard title="Total Area in Acquisition" value="5,220 Ha" subtitle="84% SIA Studies Completed" icon={MapPin} color="emerald" />
        <KPICard title="State Escrow Balance" value="₹1,200 Cr" subtitle="PFMS Integrated for Direct DBT" icon={Coins} color="purple" />
        <KPICard title="Collector Escalations" value="43 Active" subtitle="Urgent Hearing Scheduled" icon={AlertTriangle} color="amber" />
      </div>

      {/* GIS Cadastral Map */}
      <Card title="State Cadastral Acquisition Footprint (Maharashtra)" subtitle="Real-time parcel layer synchronization">
        <GISMap features={geoJsonData?.features || []} stats={stats} height="420px" />
      </Card>

      {/* District Matrix */}
      <Card title="District Land Acquisition Matrix" subtitle="Aggregated overview of land acquisition authorities in the state">
        <Table columns={columns} data={districtSummary} />
      </Card>
    </div>
  );
};

export default StateDashboard;
