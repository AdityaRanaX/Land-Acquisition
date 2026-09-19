import React from 'react';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { KPICard } from '../../components/ui/KPICard';
import { Coins, Download, Printer, CheckCircle2 } from 'lucide-react';

export const StateReports = () => {
  const funds = [
    { project: 'Pune-Bengaluru Green Expressway (Package 4A)', totalSanctionedCr: 1250, escrowDepositedCr: 900, disbursedCr: 420, remainingEscrowCr: 480, status: 'Healthy' },
    { project: 'Pune-Nashik Semi High-Speed Rail Corridor', totalSanctionedCr: 2850, escrowDepositedCr: 1500, disbursedCr: 110, remainingEscrowCr: 1390, status: 'Adequate' },
    { project: 'Talegaon Industrial & Semiconductor Cluster Extension', totalSanctionedCr: 650, escrowDepositedCr: 300, disbursedCr: 0, remainingEscrowCr: 300, status: 'Initial Stage' }
  ];

  const columns = [
    { title: 'Project Name', key: 'project', className: 'font-bold text-bistre' },
    { title: 'Sanctioned Budget', key: 'totalSanctionedCr', render: (v) => `₹${v} Cr` },
    { title: 'Escrow Deposited', key: 'escrowDepositedCr', render: (v) => `₹${v} Cr` },
    { title: 'Disbursed (DBT)', key: 'disbursedCr', render: (v) => <span className="font-bold text-[#4D5A34]">₹${v} Cr</span> },
    { title: 'Available Escrow', key: 'remainingEscrowCr', render: (v) => `₹${v} Cr` },
    {
      title: 'Status',
      key: 'status',
      render: (v) => <Badge status="ACQUIRED">{v}</Badge>
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-bistre">State Escrow & Treasury Disbursement Ledger</h2>
          <p className="text-xs text-text-muted">Integrated state treasury records and direct landowner account disbursements</p>
        </div>
        <Button variant="primary" icon={Download}>Download Consolidated Escrow Report</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard title="Total Escrow Pool" value="₹2,700 Cr" subtitle="State multi-project account" icon={Coins} color="kobicha" />
        <KPICard title="Direct DBT Disbursed" value="₹530 Cr" subtitle="100% Solatium included" icon={CheckCircle2} color="success" />
        <KPICard title="Available Escrow" value="₹2,170 Cr" subtitle="Ready for Sec 23 awards" icon={Coins} color="taupe" />
      </div>

      <Card title="State Project Escrow Balances" subtitle="Track deposited capital and disbursement run-rates">
        <Table columns={columns} data={funds} />
      </Card>
    </div>
  );
};

export default StateReports;
