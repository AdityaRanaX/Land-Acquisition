import React from 'react';
import { DelayRadar } from '../../components/shared/DelayRadar';
import { Card } from '../../components/ui/Card';
import { KPICard } from '../../components/ui/KPICard';
import { AlertOctagon, Clock, ShieldAlert, Sparkles } from 'lucide-react';

export const NationalDelayRadar = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">National Statutory Delay & Lapse Radar</h2>
        <p className="text-xs text-slate-400">Heuristic AI bottleneck prediction engine preventing statutory land acquisition lapses</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard title="Statutory Lapse Risk" value="1 Project" subtitle="Sec 19 Declaration < 15 Days" icon={AlertOctagon} color="rose" />
        <KPICard title="SIA Hearing Bottlenecks" value="3 Districts" subtitle="Pending Expert Group Meeting" icon={Clock} color="amber" />
        <KPICard title="Prevented Lapses (FY24)" value="₹14,200 Cr" subtitle="Saved in Re-notification Costs" icon={ShieldAlert} color="emerald" />
      </div>

      <DelayRadar title="Real-Time Statutory Risk Scan Across All Projects" />
    </div>
  );
};

export default NationalDelayRadar;
