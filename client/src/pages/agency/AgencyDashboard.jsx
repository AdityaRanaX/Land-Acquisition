import React from 'react';
import { KPICard } from '../../components/ui/KPICard';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Building2, FolderPlus, LandPlot, Coins, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AgencyDashboard = () => {
  const requisitions = [
    { code: 'NHAI-PUNE-BLR-001', name: 'Pune-Bengaluru Green Expressway (Pkg 4A)', state: 'Maharashtra', areaHa: 480.5, budgetCr: 1250, status: 'Valuation Stage' },
    { code: 'NHAI-NASHIK-SUR-004', name: 'Surat-Nashik Industrial Spur Requisition', state: 'Maharashtra', areaHa: 220.0, budgetCr: 580, status: 'Proposal Submitted' }
  ];

  const columns = [
    { title: 'Project Code', key: 'code', render: (v) => <span className="font-mono font-bold text-sky-400">{v}</span> },
    { title: 'Corridor Name', key: 'name', className: 'font-semibold text-white' },
    { title: 'Required Area', key: 'areaHa', render: (v) => `${v} Ha` },
    { title: 'Estimated Outlay', key: 'budgetCr', render: (v) => `₹${v} Cr` },
    {
      title: 'Workflow Stage',
      key: 'status',
      render: (v) => <Badge variant="primary">{v}</Badge>
    },
    {
      title: 'Action',
      key: 'act',
      render: () => (
        <Button size="sm" variant="ghost" icon={ArrowRight}>Track</Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Requiring Agency Portal (NHAI)</h2>
          <p className="text-xs text-slate-400">Manage infrastructure acquisition proposals, budget estimates & gazette filings</p>
        </div>
        <Link to="/agency/new-requisition">
          <Button variant="primary" icon={FolderPlus}>Submit New Land Requisition</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard title="Total Corridors" value="2 Projects" subtitle="700.5 Hectares Requisitioned" icon={Building2} color="sky" />
        <KPICard title="Escrow Deposited" value="₹900 Cr" subtitle="Against ₹1,830 Cr Sanctioned" icon={Coins} color="emerald" />
        <KPICard title="Possession Handover" value="35%" subtitle="Expected Package 4A: Jan 2025" icon={LandPlot} color="purple" />
      </div>

      <Card title="Active Land Acquisition Requisitions" subtitle="Track administrative sanctions and Collector progress">
        <Table columns={columns} data={requisitions} />
      </Card>
    </div>
  );
};

export default AgencyDashboard;
