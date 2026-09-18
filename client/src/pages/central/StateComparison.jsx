import React from 'react';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { KPICard } from '../../components/ui/KPICard';
import { BarChart3, TrendingUp, Award, Zap } from 'lucide-react';

export const StateComparison = () => {
  const stateData = [
    { state: 'Maharashtra', activeProjects: 14, totalAreaHa: 6850, avgDisbursementDays: 114, complianceScore: 92, status: 'Top Performer' },
    { state: 'Gujarat', activeProjects: 11, totalAreaHa: 5200, avgDisbursementDays: 98, complianceScore: 94, status: 'Top Performer' },
    { state: 'Uttar Pradesh', activeProjects: 18, totalAreaHa: 9400, avgDisbursementDays: 142, complianceScore: 84, status: 'Moderate' },
    { state: 'Karnataka', activeProjects: 9, totalAreaHa: 4100, avgDisbursementDays: 130, complianceScore: 88, status: 'Moderate' },
    { state: 'Tamil Nadu', activeProjects: 8, totalAreaHa: 3800, avgDisbursementDays: 165, complianceScore: 78, status: 'Lagging' },
    { state: 'Madhya Pradesh', activeProjects: 7, totalAreaHa: 3400, avgDisbursementDays: 120, complianceScore: 86, status: 'Moderate' }
  ];

  const columns = [
    { title: 'State / UT', key: 'state', className: 'font-semibold text-white' },
    { title: 'Active Projects', key: 'activeProjects' },
    { title: 'Acquisition Footprint', key: 'totalAreaHa', render: (v) => `${v.toLocaleString()} Ha` },
    { title: 'Avg Award Velocity', key: 'avgDisbursementDays', render: (v) => `${v} Days` },
    {
      title: 'RFCTLARR Compliance Index',
      key: 'complianceScore',
      render: (v) => (
        <div className="flex items-center gap-2">
          <div className="w-24 bg-slate-800 rounded-full h-2 overflow-hidden">
            <div className="bg-sky-500 h-2 rounded-full" style={{ width: `${v}%` }} />
          </div>
          <span className="font-bold text-slate-200">{v}%</span>
        </div>
      )
    },
    {
      title: 'Performance Grade',
      key: 'status',
      render: (v) => (
        <Badge variant={v === 'Top Performer' ? 'success' : v === 'Moderate' ? 'primary' : 'danger'}>
          {v}
        </Badge>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Inter-State Acquisition & Compliance Benchmarking</h2>
        <p className="text-xs text-slate-400">Comparative analytics across States regarding disbursement velocity and statutory milestone adherence</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard title="Top Performing State" value="Gujarat (94%)" subtitle="Avg Award Speed: 98 Days" icon={Award} color="emerald" />
        <KPICard title="National Avg Speed" value="128 Days" subtitle="From Sec 11 to Final Award" icon={TrendingUp} color="sky" />
        <KPICard title="Fastest Disbursing Agency" value="NHAI Expressways" subtitle="Direct DBT via PFMS / Escrow" icon={Zap} color="purple" />
      </div>

      <Card title="State Performance Matrix" subtitle="Statutory compliance and speed index">
        <Table columns={columns} data={stateData} />
      </Card>
    </div>
  );
};

export default StateComparison;
