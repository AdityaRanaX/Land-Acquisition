import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Coins, Download, ShieldCheck, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CompensationBreakup = () => {
  const formatINR = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);

  const breakdown = [
    { component: 'Base Market Value of Land', formula: '2.50 Acres × ₹35,00,000 / Acre', amount: 8750000 },
    { component: 'Rural Distance Multiplier (1.5x)', formula: '₹87,50,000 × 1.5 factor (Sec 26)', amount: 13125000 },
    { component: 'Value of Attached Assets (Farmhouse & Wells)', formula: 'PWD Schedule of Rates', amount: 1218253 },
    { component: 'Value of Standing Crops & 12 Mango Trees', formula: 'Horticulture Department assessment', amount: 340000 },
    { component: 'Sub-Total (Base Land + Assets)', formula: 'Multiplied Land + Total Assets', amount: 14683253 },
    { component: '100% Mandatory Solatium (Section 30(1))', formula: '100% of Sub-Total', amount: 14683253 }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link to="/citizen">
              <Button variant="outline" size="sm" className="gap-1 text-xs">
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </Button>
            </Link>
            <h1 className="text-2xl font-black text-bistre tracking-tight">RFCTLARR Schedule I Compensation Breakup</h1>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Statutory Section 23 award determination for Survey #142/1A (Wagholi, Pune)
          </p>
        </div>
        <Button variant="primary" size="sm" className="gap-1 text-xs">
          <Download className="w-3.5 h-3.5" /> Download Form 11 Award PDF
        </Button>
      </div>

      {/* Hero Total Card */}
      <div className="p-6 rounded-xl bg-bistre text-white border border-chamoisee/30 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div>
          <span className="text-[10px] font-bold text-buff uppercase tracking-widest block">
            Total Sanctioned Gross Compensation Award
          </span>
          <h2 className="text-3xl font-black text-white mt-1">₹2,93,66,506</h2>
          <p className="text-xs text-buff/80 mt-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-buff" />
            Verified & Certified by Special Land Acquisition Officer, Pune Collectorate
          </p>
        </div>
        <div className="p-4 rounded-lg bg-[#23140C] border border-chamoisee/20 text-xs space-y-1 min-w-[220px]">
          <span className="text-chamoisee block text-[10px] uppercase font-bold">Registered DBT Bank Account</span>
          <p className="text-white font-mono font-bold">State Bank of India ••••••8934</p>
          <span className="text-status-success font-semibold text-[11px] block flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> PFMS Penny-Drop Verified
          </span>
        </div>
      </div>

      {/* Itemized Table */}
      <Card title="Itemized Statutory Computation (First Schedule)" subtitle="Full statutory transparency conforming to Sections 26, 29 & 30">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-chamoisee/20 text-text-muted">
                <th className="py-2.5 px-3">Statutory Component</th>
                <th className="py-2.5 px-3">Calculation Basis / Formula</th>
                <th className="py-2.5 px-3 text-right">Amount (₹ INR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-chamoisee/10">
              {breakdown.map((row, idx) => (
                <tr key={idx} className="hover:bg-page transition-colors">
                  <td className="py-3 px-3 font-semibold text-bistre">{row.component}</td>
                  <td className="py-3 px-3 text-text-muted font-mono">{row.formula}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-bistre">{formatINR(row.amount)}</td>
                </tr>
              ))}
              <tr className="bg-buff/20 font-bold text-bistre">
                <td className="py-3 px-3 text-sm">Total Final Payable Award</td>
                <td className="py-3 px-3 text-xs text-text-muted">Direct Benefit Transfer to Registered Bank Account</td>
                <td className="py-3 px-3 text-right font-mono text-base text-status-success">₹2,93,66,506</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default CompensationBreakup;
