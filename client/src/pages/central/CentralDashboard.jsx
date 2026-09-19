import React, { useState, useEffect } from 'react';
import { KPICard } from '../../components/ui/KPICard';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { GISMap } from '../../components/gis/GISMap';
import { DelayRadar } from '../../components/shared/DelayRadar';
import { getProjects } from '../../services/projectService';
import { getParcelsGeoJSON } from '../../services/parcelService';
import { Building2, LandPlot, Coins, AlertTriangle, ArrowRight, Eye, Map, Download } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const CentralDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [geoJsonData, setGeoJsonData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getProjects().then(setProjects);
    getParcelsGeoJSON().then(setGeoJsonData);
  }, []);

  const projectColumns = [
    {
      title: 'Project Code / Name',
      key: 'name',
      render: (_, row) => (
        <div>
          <span className="font-mono font-bold text-kobicha text-xs">{row.code}</span>
          <p className="font-bold text-bistre text-xs mt-0.5">{row.name}</p>
        </div>
      )
    },
    { title: 'State', key: 'state' },
    {
      title: 'Area Required',
      key: 'totalAreaRequiredHectares',
      render: (val) => `${val} Ha`
    },
    {
      title: 'Workflow Stage',
      key: 'status',
      render: (val) => <Badge status={val}>{val?.replace(/_/g, ' ')}</Badge>
    },
    {
      title: 'Delay Risk',
      key: 'riskLevel',
      render: (val) => <Badge status={val} dot>{val}</Badge>
    },
    {
      title: 'Action',
      key: 'act',
      render: (_, row) => (
        <Link to={`/central/projects/${row.id}`}>
          <Button size="sm" variant="outline" icon={Eye}>Inspect</Button>
        </Link>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Welcome & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-bistre tracking-tight">National Land Acquisition Oversight</h2>
          <p className="text-xs text-text-muted">Department of Land Resources (DoLR) • Central Monitoring Dashboard</p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link to="/central/map">
            <Button variant="outline" icon={Map}>National GIS Map</Button>
          </Link>
          <Link to="/central/reports">
            <Button variant="primary" icon={Download}>Export National Report</Button>
          </Link>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Active National Projects"
          value={projects.length || '3'}
          subtitle="Across 28 States & UTs"
          icon={Building2}
          color="kobicha"
          trend={{ text: '12% YoY', isPositive: true, label: 'Pipeline growth' }}
        />
        <KPICard
          title="Total Notified Footprint"
          value="2,030.5 Ha"
          subtitle="65% Verified by Field Ground Truth"
          icon={LandPlot}
          color="success"
        />
        <KPICard
          title="National Escrow Disbursed"
          value="₹5,300 Cr"
          subtitle="Out of ₹47,500 Cr Allocated"
          icon={Coins}
          color="info"
        />
        <KPICard
          title="Statutory Lapse Alerts"
          value="1 Critical"
          subtitle="Sec 19 Declaration < 30 Days"
          icon={AlertTriangle}
          color="danger"
          trend={{ text: 'Action Req', isPositive: false }}
        />
      </div>

      {/* GIS National Cadastral View */}
      <Card
        title="Live National Land Acquisition GIS Cadastral Map"
        subtitle="Multi-layer spatial tracking of survey polygons, land classification & ground inspections"
        action={
          <Link to="/central/map">
            <Button size="sm" variant="outline" icon={ArrowRight}>Full GIS View</Button>
          </Link>
        }
      >
        <GISMap
          features={geoJsonData?.features || []}
          height="400px"
          onSelectParcel={(p) => navigate('/district/parcels')}
        />
      </Card>

      {/* Grid: Priority Projects and Delay Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card
            title="Strategic Infrastructure Corridors"
            subtitle="Priority corridors under PM Gati Shakti & Bharatmala Pariyojana"
            action={
              <Link to="/central/projects">
                <Button size="sm" variant="outline" icon={ArrowRight}>View All</Button>
              </Link>
            }
          >
            <Table
              columns={projectColumns}
              data={projects}
              onRowClick={(row) => navigate(`/central/projects/${row.id}`)}
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

export default CentralDashboard;
