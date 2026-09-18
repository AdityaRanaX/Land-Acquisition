import React from 'react';
import { WhatIfSimulator } from '../../components/shared/WhatIfSimulator';
import { Card } from '../../components/ui/Card';
import { KPICard } from '../../components/ui/KPICard';
import { Calculator, Coins, ShieldCheck } from 'lucide-react';

export const CostEstimation = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Pre-Requisition Statutory Cost Estimation</h2>
        <p className="text-xs text-slate-400">Model accurate DPR budget provisions including 100% Solatium & R&R entitlement costs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard title="Statutory Solatium Rule" value="100% Mandatory" subtitle="Over base land & asset valuation" icon={ShieldCheck} color="amber" />
        <KPICard title="Rural Multiplier" value="1.0x to 2.0x" subtitle="Based on distance from urban node" icon={Coins} color="sky" />
        <KPICard title="Statutory 12% Interest" value="Sec 30(3)" subtitle="Calculated from Sec 11 notification" icon={Calculator} color="purple" />
      </div>

      <WhatIfSimulator />
    </div>
  );
};

export default CostEstimation;
