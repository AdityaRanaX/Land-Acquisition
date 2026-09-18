import React from 'react';
import { Card } from '../../components/ui/Card';
import { AuditTimeline } from '../../components/shared/AuditTimeline';
import { Badge } from '../../components/ui/Badge';
import { ShieldCheck, FileText, Scale } from 'lucide-react';

export const PolicyMonitoring = () => {
  const policyRules = [
    { rule: 'Mandatory 100% Solatium (Sec 30(1))', desc: 'Strict enforcement of 100% solatium on land and attached asset market valuations across all state gazettes.', status: 'ENFORCED' },
    { rule: 'Section 19 Statutory 12-Month Limit (Sec 19(7))', desc: 'Automated lapse alarm triggering 60 days before expiration of 1-year window after Section 11 publication.', status: 'ACTIVE RADAR' },
    { rule: 'Schedule II R&R Entitlements', desc: 'Direct biometric/Aadhaar verification required for subsistence grants (₹3,000/mo) and one-time resettlement allowances (₹50,000).', status: 'COMPLIANT' },
    { rule: 'Direct DBT Bank Account Validation', desc: 'Automated penny-drop validation before PFMS fund release to prevent misdirected disbursements.', status: 'MANDATORY' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Policy Directives & Compliance Oversight</h2>
        <p className="text-xs text-slate-400">Statutory RFCTLARR guidelines, gazette policy rules & central compliance audit trails</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Active Statutory Policy Directives" subtitle="DoLR national governance rules">
          <div className="space-y-3">
            {policyRules.map((p, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-200">{p.rule}</h4>
                  <Badge variant="primary">{p.status}</Badge>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </Card>

        <div>
          <AuditTimeline limit={15} />
        </div>
      </div>
    </div>
  );
};

export default PolicyMonitoring;
