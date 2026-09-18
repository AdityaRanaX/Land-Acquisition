import React from 'react';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { KPICard } from '../../components/ui/KPICard';
import { Button } from '../../components/ui/Button';
import { Coins, CheckCircle2, ArrowUpRight, ShieldCheck } from 'lucide-react';

export const FundAllocation = () => {
  const funds = [
    { project: 'Pune-Bengaluru Green Expressway', totalSanctionedCr: 1250, escrowDepositedCr: 900, disbursedCr: 420, remainingEscrowCr: 480, status: 'Healthy' },
    { project: 'Pune-Nashik Semi High-Speed Rail', totalSanctionedCr: 2850, escrowDepositedCr: 1500, disbursedCr: 110, remainingEscrowCr: 1390, status: 'Adequate' },
    { project: 'Talegaon Industrial Cluster Extension', totalSanctionedCr: 650, escrowDepositedCr: 300, disbursedCr: 0, remainingEscrowCr: 300, status: 'Initial Stage' }
  ];

  const columns = [
    { title: 'Project Name', key: 'project', className: 'font-semibold text-white' },
    { title: 'Sanctioned Budget', key: 'totalSanctionedCr', render: (v) => `₹${v} Cr` },
    { title: 'Escrow Deposited', key: 'escrowDepositedCr', render: (v) => `₹${v} Cr` },
    { title: 'Disbursed (DBT)', key: 'disbursedCr', render: (v) => <span className="font-bold text-emerald-400">₹${v} Cr</span> },
    { title: 'Available Escrow', key: 'remainingEscrowCr', render: (v) => `₹${v} Cr` },
    {
      title: 'Status',
      key: 'status',
      render: (v) => <Badge variant="success">{v}</Badge>
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">State Escrow & DBT Fund Allocation</h2>
        <p className="text-xs text-slate-400">Automated integration with State Treasury & Public Financial Management System (PFMS)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard title="Total Escrow Pool" value="₹2,700 Cr" subtitle="Multi-project state account" icon={Coins} color="sky" />
        <KPICard title="Direct DBT Disbursed" value="₹530 Cr" subtitle="100% Solatium included" icon={CheckCircle2} color="emerald" />
        <KPICard title="Pending Award Escrow" value="₹2,170 Cr" subtitle="Ready for Section 23 awards" icon={ShieldCheck} color="purple" />
      </div>

      <Card title="Project Escrow & Compensation Balances" subtitle="Track deposited acquisition capital and disbursement run-rates">
        <Table columns={columns} data={funds} />
      </Card>
    </div>
  );
};

export default FundAllocation;
