import React from 'react';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Coins, Download, ShieldCheck, IndianRupee, CheckCircle2 } from 'lucide-react';

export const CompensationBreakup = () => {
  const formatINR = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);

  const breakdown = [
    { component: 'Base Market Value of Land', formula: '2.5 Acres × ₹35,00,000 / Acre', amount: 8750000 },
    { component: 'Rural Distance Multiplier (1.5x)', formula: '₹87,50,000 × 1.5 factor', amount: 13125000 },
    { component: 'Value of Attached Assets (Farmhouse & Wells)', formula: 'Horticulture & PWD Valuation', amount: 850000 },
    { component: 'Value of Standing Crops & Timber', formula: 'Sugarcane & 12 Mango Trees', amount: 320000 },
    { component: 'Sub-Total (Base Land + Assets)', formula: 'Multiplied Land + Total Assets', amount: 14295000 },
    { component: '100% Mandatory Solatium (Section 30(1))', formula: '100% of Sub-Total', amount: 14295000 },
    { component: '12% Additional Market Value (Section 30(3))', formula: '180 days from Sec 11 notification', amount: 776506 }
  ];

  const columns = [
    { title: 'Statutory Component', key: 'component', className: 'font-semibold text-white' },
    { title: 'Calculation Formula / Basis', key: 'formula', className: 'text-slate-400 font-mono text-xs' },
    {
      title: 'Amount (₹ INR)',
      key: 'amount',
      render: (v) => <span className="font-bold text-slate-200">{formatINR(v)}</span>
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">RFCTLARR Schedule I Compensation Breakup</h2>
          <p className="text-xs text-slate-400">Statutory award determination notice for Survey #142/1A (Wagholi)</p>
        </div>
        <Button variant="secondary" icon={Download}>Download Form 11 Award PDF</Button>
      </div>

      {/* Hero Total Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div>
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">
            Total Sanctioned Statutory Gross Award
          </span>
          <h3 className="text-3xl font-black text-white mt-1">₹2,93,66,506</h3>
          <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Verified & Certified by District Collector, Pune
          </p>
        </div>
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1 min-w-[240px]">
          <span className="text-slate-400 block text-[10px] uppercase font-semibold">Registered DBT Bank Account</span>
          <p className="text-slate-100 font-mono font-bold">HDFC Bank ••••••8934</p>
          <span className="text-emerald-400 font-medium text-[11px] block">Penny-Drop Verified ✓</span>
        </div>
      </div>

      <Card title="Itemized Statutory Computation (First Schedule)" subtitle="Full legal transparency conforming to Sections 26, 29 & 30">
        <Table columns={columns} data={breakdown} />
      </Card>
    </div>
  );
};

export default CompensationBreakup;
