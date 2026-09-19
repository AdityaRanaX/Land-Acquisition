import React from 'react';
import { DelayRadar } from '../../components/shared/DelayRadar';
import { KPICard } from '../../components/ui/KPICard';
import { AlertOctagon, Clock, ShieldAlert } from 'lucide-react';

export const NationalDelayRadar = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-bistre">National Statutory Delay & Lapse Radar</h2>
        <p className="text-xs text-text-muted">Automated heuristic rules engine predicting statutory RFCTLARR deadlines & Section 19 lapse risks</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard title="Statutory Lapse Risk" value="1 Project" subtitle="Sec 19 Declaration < 15 Days" icon={AlertOctagon} color="danger" />
        <KPICard title="SIA Hearing Bottlenecks" value="3 Districts" subtitle="Pending Expert Group Meeting" icon={Clock} color="warning" />
        <KPICard title="Lapses Prevented (FY24)" value="₹14,200 Cr" subtitle="Saved in Re-notification Costs" icon={ShieldAlert} color="success" />
      </div>

      <DelayRadar title="Real-Time Statutory Risk Scan Across All Projects" />
    </div>
  );
};

export default NationalDelayRadar;
