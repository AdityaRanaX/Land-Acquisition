import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { KPICard } from '../../components/ui/KPICard';
import { getNationalStats } from '../../services/reportService';
import { Award, TrendingUp, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const StateComparison = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getNationalStats().then(setStats);
  }, []);

  const columns = [
    { title: 'State / UT', key: 'state', className: 'font-bold text-bistre' },
    { title: 'Active Corridors', key: 'activeProjects' },
    { title: 'Footprint (Ha)', key: 'totalAreaHa', render: (v) => `${v.toLocaleString()} Ha` },
    { title: 'Avg Award Velocity', key: 'avgDisbursementDays', render: (v) => `${v} Days` },
    {
      title: 'RFCTLARR Compliance Index',
      key: 'complianceScore',
      render: (v) => (
        <div className="flex items-center gap-2">
          <div className="w-24 bg-page rounded-full h-2 overflow-hidden border border-chamoisee/20">
            <div className="bg-kobicha h-2 rounded-full" style={{ width: `${v}%` }} />
          </div>
          <span className="font-bold text-bistre text-xs">{v}%</span>
        </div>
      )
    },
    {
      title: 'Grade',
      key: 'status',
      render: (v) => (
        <Badge status={v === 'Top Performer' ? 'ACQUIRED' : v === 'Moderate' ? 'PENDING' : 'DELAYED'}>
          {v}
        </Badge>
      )
    },
    {
      title: 'Action',
      key: 'act',
      render: () => (
        <Link to="/state">
          <Button size="sm" variant="outline" icon={ArrowRight}>Inspect State</Button>
        </Link>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-bistre">Inter-State Acquisition & Compliance Benchmarking</h2>
        <p className="text-xs text-text-muted">Comparative analytics across States regarding award velocity, 100% Solatium adherence, and dispute resolution</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard title="Top Performing State" value="Gujarat (94%)" subtitle="Avg Award Speed: 98 Days" icon={Award} color="success" />
        <KPICard title="National Avg Speed" value="124 Days" subtitle="From Sec 11 to Final Award" icon={TrendingUp} color="kobicha" />
        <KPICard title="Fastest Disbursing Agency" value="NHAI Expressways" subtitle="Direct DBT via PFMS / Escrow" icon={Zap} color="info" />
      </div>

      <Card title="State Performance Matrix" subtitle="Statutory compliance and speed index">
        <Table columns={columns} data={stats?.statePerformance || []} />
      </Card>
    </div>
  );
};

export default StateComparison;
