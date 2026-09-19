import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { History, ShieldCheck } from 'lucide-react';

export const AuditTimeline = ({ title = 'Statutory Compliance Audit Log' }) => {
  const logs = [
    {
      id: 'LOG-01',
      action: 'PRONOUNCE_SECTION_23_AWARD',
      userEmail: 'collector.pune@nlams.gov.in',
      role: 'DISTRICT_COLLECTOR',
      module: 'COMPENSATION',
      timestamp: '2024-09-18T10:15:00Z',
      details: 'Sanctioned Form 11 award for Parcel #142/1A (₹2,93,66,506)'
    },
    {
      id: 'LOG-02',
      action: 'FIELD_VERIFY_GROUND_TRUTH',
      userEmail: 'surveyor.haveli@nlams.gov.in',
      role: 'FIELD_SURVEYOR',
      module: 'PARCELS',
      timestamp: '2024-09-18T09:40:00Z',
      details: 'Recorded GPS coordinates & verified sugarcane standing crop'
    },
    {
      id: 'LOG-03',
      action: 'UPDATE_SECTION_19_GAZETTE',
      userEmail: 'central.admin@nlams.gov.in',
      role: 'CENTRAL_ADMIN',
      module: 'PROJECTS',
      timestamp: '2024-09-17T16:00:00Z',
      details: 'Archived official gazette notification MAH-GAZ-2024-1189'
    }
  ];

  return (
    <Card
      title={title}
      subtitle="Immutable cryptographic compliance audit trail"
      action={<History className="w-4 h-4 text-chamoisee" />}
    >
      <div className="space-y-3">
        {logs.map((l) => (
          <div key={l.id} className="flex items-start gap-3 text-xs p-3 rounded-xl bg-[#FDFBF7] border border-chamoisee/20">
            <div className="w-7 h-7 rounded-full bg-kobicha/15 text-kobicha border border-kobicha/30 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono font-bold text-bistre text-xs">{l.action}</span>
                <span className="text-[10px] text-text-muted">
                  {new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-[11px] text-text-muted mt-0.5">{l.details}</p>
              <div className="flex items-center gap-2 mt-1.5 text-[10px] text-text-muted">
                <span className="font-semibold text-kobicha">{l.userEmail}</span>
                <span>•</span>
                <Badge size="sm" variant="taupe">{l.role}</Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default AuditTimeline;
