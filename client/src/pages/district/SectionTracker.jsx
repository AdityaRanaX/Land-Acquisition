import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { CheckCircle2, Clock, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import { MILESTONE_SECTIONS } from '../../constants/projectStatuses';

export const SectionTracker = () => {
  const [activeSection, setActiveSection] = useState('SEC_23_VALUATION_AWARD');

  const milestones = [
    { key: 'SEC_4_SIA', label: 'Sec 4: SIA Notification & Hearing', status: 'COMPLETED', gazette: 'MAH-GAZ-2023-1120', date: '10-Apr-2023' },
    { key: 'SEC_6_SIA_APPROVAL', label: 'Sec 6: Expert Group Approval', status: 'COMPLETED', date: '22-Jul-2023' },
    { key: 'SEC_11_PRELIMINARY_NOTIF', label: 'Sec 11: Preliminary Gazette Notification', status: 'COMPLETED', gazette: 'MAH-GAZ-2023-4102', date: '15-Nov-2023' },
    { key: 'SEC_15_OBJECTIONS_HEARING', label: 'Sec 15: Disposal of Landowner Objections', status: 'COMPLETED', remarks: '42 objections disposed by Collector', date: '18-Feb-2024' },
    { key: 'SEC_19_DECLARATION', label: 'Sec 19: Final Acquisition Declaration', status: 'COMPLETED', gazette: 'MAH-GAZ-2024-1189', date: '10-May-2024' },
    { key: 'SEC_23_VALUATION_AWARD', label: 'Sec 23: Valuation & Schedule I Award', status: 'IN_PROGRESS', date: 'Target: 30-Oct-2024' },
    { key: 'SEC_31_RR_AWARD', label: 'Sec 31: Rehabilitation & Resettlement Award', status: 'IN_PROGRESS', date: 'Target: 15-Nov-2024' },
    { key: 'SEC_38_POSSESSION', label: 'Sec 38: Final Possession Handover', status: 'PENDING', date: 'Target: 30-Jan-2025' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Statutory RFCTLARR Section Tracker</h2>
        <p className="text-xs text-slate-400">Step-by-step enforcement of mandatory legal milestones for Project NHAI-PUNE-BLR-001</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {milestones.map((m, idx) => (
          <div
            key={m.key}
            className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
              m.status === 'COMPLETED'
                ? 'bg-slate-900/60 border-slate-800'
                : m.status === 'IN_PROGRESS'
                ? 'bg-sky-500/10 border-sky-500/30 shadow-lg shadow-sky-500/5'
                : 'bg-slate-950/40 border-slate-900 opacity-60'
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                  m.status === 'COMPLETED'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : m.status === 'IN_PROGRESS'
                    ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30 animate-pulse'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {idx + 1}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{m.label}</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {m.gazette ? `Gazette Ref: ${m.gazette}` : m.remarks || 'Statutory legal compliance workflow stage'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-400">{m.date}</span>
              <Badge variant={m.status === 'COMPLETED' ? 'success' : m.status === 'IN_PROGRESS' ? 'primary' : 'default'} dot>
                {m.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionTracker;
