import React, { useState, useEffect } from 'react';
import { KPICard } from '../../components/ui/KPICard';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { GISMap } from '../../components/gis/GISMap';
import { DelayRadar } from '../../components/shared/DelayRadar';
import { useGIS } from '../../hooks/useGIS';
import { Building2, LandPlot, Coins, AlertTriangle, TrendingUp, ShieldCheck } from 'lucide-react';
import apiClient from '../../services/api/apiClient';

export const CentralDashboard = () => {
  const { geoJsonData, stats } = useGIS();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await apiClient.get('/projects');
        if (res.data?.data) {
          setProjects(res.data.data);
        }
      } catch (e) {
        setProjects([
          {
            _id: 'p1',
            code: 'NHAI-PUNE-BLR-001',
            name: 'Pune-Bengaluru Green Expressway',
            state: 'Maharashtra',
            totalAreaRequiredHectares: 480.5,
            status: 'VALUATION_IN_PROGRESS',
            riskLevel: 'HIGH'
          },
          {
            _id: 'p2',
            code: 'MRIDC-PUNE-NSK-002',
            name: 'Pune-Nashik Semi High-Speed Rail',
            state: 'Maharashtra',
            totalAreaRequiredHectares: 1200.0,
            status: 'SECTION_11_PUBLISHED',
            riskLevel: 'CRITICAL'
          },
          {
            _id: 'p3',
            code: 'MIDC-TAL-IND-003',
            name: 'Talegaon Industrial & Semiconductor Cluster',
            state: 'Maharashtra',
            totalAreaRequiredHectares: 350.0,
            status: 'PROPOSAL_SUBMITTED',
            riskLevel: 'LOW'
          }
        ]);
      }
    };
    fetchProjects();
  }, []);

  const projectColumns = [
    {
      title: 'Code / Name',
      key: 'name',
      render: (_, row) => (
        <div>
          <span className="font-mono font-bold text-sky-400 text-xs">{row.code}</span>
          <p className="font-semibold text-slate-100 text-sm mt-0.5">{row.name}</p>
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
      render: (val) => (
        <Badge variant={val === 'VALUATION_IN_PROGRESS' ? 'primary' : val === 'SECTION_11_PUBLISHED' ? 'warning' : 'default'}>
          {val?.replace(/_/g, ' ')}
        </Badge>
      )
    },
    {
      title: 'Delay Risk',
      key: 'riskLevel',
      render: (val) => (
        <Badge variant={val === 'CRITICAL' ? 'danger' : val === 'HIGH' ? 'warning' : 'success'} dot>
          {val}
        </Badge>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Active National Projects"
          value={projects.length || '3'}
          subtitle="Across 28 States & UTs"
          icon={Building2}
          color="sky"
          trend={{ text: '12% MoM', isPositive: true, label: 'Pipeline' }}
        />
        <KPICard
          title="Total Land Notified"
          value="2,030.5 Ha"
          subtitle="65% Verified by GIS Field Ground Truth"
          icon={LandPlot}
          color="emerald"
        />
        <KPICard
          title="National Outlay & Escrow"
          value="₹47,500 Cr"
          subtitle="₹5,300 Cr Disbursed to Affected Families"
          icon={Coins}
          color="purple"
        />
        <KPICard
          title="Statutory Delay Radar"
          value="1 Critical"
          subtitle="Sec 19 Lapse Window Nearing"
          icon={AlertTriangle}
          color="rose"
          trend={{ text: 'Action Req', isPositive: false }}
        />
      </div>

      {/* GIS National Cadastral View */}
      <Card
        title="Live National Land Acquisition GIS Cadastral Map"
        subtitle="Multi-layer spatial tracking of survey polygons, land classification & ground inspections"
      >
        <GISMap
          features={geoJsonData?.features || []}
          stats={stats}
          height="450px"
        />
      </Card>

      {/* Grid: Projects and Delay Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card
            title="Strategic Infrastructure Acquisitions"
            subtitle="Priority corridors under PM Gati Shakti & Bharatmala"
          >
            <Table columns={projectColumns} data={projects} />
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
