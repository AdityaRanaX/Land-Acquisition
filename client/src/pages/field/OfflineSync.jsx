import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { RefreshCw, CheckCircle2, Wifi, WifiOff, HardDrive } from 'lucide-react';

export const OfflineSync = () => {
  const [synced, setSynced] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const localQueue = [
    { type: 'Ground Survey Inspection', ref: 'Survey 142/1B Wagholi', timestamp: '10 mins ago', status: 'SYNCED' },
    { type: 'Geotagged Photo Upload (3 items)', ref: 'Survey 142/1A Farmhouse', timestamp: '1 hour ago', status: 'SYNCED' },
    { type: 'Boundary GeoJSON Trace', ref: 'Survey 145/2 Courtyard', timestamp: '2 hours ago', status: 'SYNCED' }
  ];

  const handleManualSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setSynced(true);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Offline Cadastral Data & Sync Hub</h2>
          <p className="text-xs text-slate-400">IndexedDB local offline storage for rural surveys with auto-sync upon reconnection</p>
        </div>
        <Button variant="primary" icon={RefreshCw} loading={syncing} onClick={handleManualSync}>
          Sync All Local Records
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Wifi className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Connection State</span>
            <span className="text-sm font-bold text-emerald-400">Online (Synced)</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Local IndexedDB Cache</span>
            <span className="text-sm font-bold text-white">3 Cadastral Tiles Cached</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Pending Push Queue</span>
            <span className="text-sm font-bold text-white">0 Mutations Pending</span>
          </div>
        </div>
      </div>

      <Card title="Sync Log & Queue History" subtitle="Recent local device mutations uploaded to centralized server">
        <div className="divide-y divide-slate-800/60">
          {localQueue.map((item, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between text-xs">
              <div>
                <p className="font-semibold text-slate-200">{item.type}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{item.ref} • {item.timestamp}</p>
              </div>
              <Badge variant="success" dot>{item.status}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default OfflineSync;
