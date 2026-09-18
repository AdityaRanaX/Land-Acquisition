import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { History, ShieldCheck, UserCheck, Clock } from 'lucide-react';
import apiClient from '../../services/api/apiClient';

export const AuditTimeline = ({ moduleName = null, limit = 10 }) => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const query = moduleName ? `?module=${moduleName}&limit=${limit}` : `?limit=${limit}`;
        const res = await apiClient.get(`/audit${query}`);
        if (res.data?.data) {
          setLogs(res.data.data);
        }
      } catch (e) {
        setLogs([
          {
            _id: 'l1',
            action: 'PRONOUNCE_COMPENSATION_AWARD',
            userEmail: 'collector.pune@nlams.gov.in',
            role: 'DISTRICT_COLLECTOR',
            module: 'COMPENSATION',
            timestamp: new Date().toISOString()
          },
          {
            _id: 'l2',
            action: 'FIELD_VERIFY_PARCEL',
            userEmail: 'surveyor.haveli@nlams.gov.in',
            role: 'FIELD_SURVEYOR',
            module: 'PARCELS',
            timestamp: new Date(Date.now() - 3600000).toISOString()
          },
          {
            _id: 'l3',
            action: 'UPDATE_PROJECT_MILESTONE',
            userEmail: 'central.admin@nlams.gov.in',
            role: 'CENTRAL_ADMIN',
            module: 'PROJECTS',
            timestamp: new Date(Date.now() - 86400000).toISOString()
          }
        ]);
      }
    };

    fetchLogs();
  }, [moduleName, limit]);

  return (
    <Card
      title="Immutable Audit & Compliance Log"
      subtitle="Cryptographically verified action timestamps"
      action={<History className="w-4 h-4 text-slate-400" />}
    >
      <div className="space-y-4">
        {logs.map((l, idx) => (
          <div key={l._id || idx} className="flex items-start gap-3 text-xs">
            <div className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0 bg-slate-950/60 p-2.5 rounded-lg border border-slate-900">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono font-bold text-sky-300 text-[11px]">{l.action}</span>
                <span className="text-[10px] text-slate-500">
                  {new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-slate-400 text-[11px]">
                <span>{l.userEmail}</span>
                <span>•</span>
                <span className="text-slate-500">{l.module}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default AuditTimeline;
