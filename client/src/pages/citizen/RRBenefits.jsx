import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { KPICard } from '../../components/ui/KPICard';
import { Building2, Coins, Home, GraduationCap, Truck, CheckCircle2 } from 'lucide-react';

export const RRBenefits = () => {
  const benefits = [
    { title: 'One-Time Resettlement Allowance', statutoryRef: 'Schedule II, Para 4', entitlement: '₹50,000 per displaced family', status: 'SANCTIONED', icon: Coins },
    { title: 'Subsistence Allowance for 12 Months', statutoryRef: 'Schedule II, Para 5', entitlement: '₹3,000 / month (₹36,000 Total)', status: 'SANCTIONED', icon: Building2 },
    { title: 'Transportation & Shifting Aid', statutoryRef: 'Schedule II, Para 6', entitlement: '₹50,000 one-time shifting cost', status: 'SANCTIONED', icon: Truck },
    { title: 'Skill Development & Livelihood Aid', statutoryRef: 'Schedule II, Para 8', entitlement: 'Free vocational training sponsored at NSDC Pune', status: 'AVAILABLE', icon: GraduationCap }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Rehabilitation & Resettlement (R&R) Entitlements</h2>
        <p className="text-xs text-slate-400">Statutory benefits provided under RFCTLARR Second Schedule</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {benefits.map((b, idx) => {
          const Icon = b.icon;
          return (
            <Card key={idx} title={b.title} subtitle={b.statutoryRef} action={<Badge variant="success" dot>{b.status}</Badge>}>
              <div className="flex items-start gap-3 mt-1">
                <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{b.entitlement}</h4>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Direct beneficiary transfer mapped to family ration Aadhaar record.
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default RRBenefits;
