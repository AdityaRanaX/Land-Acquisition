import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { DelayRadar } from '../../components/shared/DelayRadar';
import { getParcels } from '../../services/parcelService';
;
import { AlertTriangle, Clock, Calendar, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DistrictDelayRadar = () => {
  const [parcels, setParcels] = useState([]);
  useEffect(() => {
    getParcels().then(setParcels).catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-bistre tracking-tight">District Statutory Delay Radar</h1>
        <p className="text-xs text-text-muted mt-0.5">
          Real-time statutory countdown timers under RFCTLARR Section 19 (12-month limit) and Section 25
        </p>
      </div>

      {/* Main Radar Component */}
      <DelayRadar />

      {/* Breakdown by Sub-Division */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Haveli Sub-Division Risk Summary">
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-status-danger/10 border border-status-danger/30 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-bold text-status-danger flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" /> Section 19 Expiry Approaching
                </span>
                <span className="font-bold text-status-danger">41 Days Left</span>
              </div>
              <p className="text-[11px] text-text-muted mt-1">
                Wagholi Package 4A: 18 parcels must receive Section 19 final declaration before Nov 2026 to prevent lapse of Section 11 notice.
              </p>
            </div>

            <div className="p-3 bg-page rounded border border-chamoisee/20">
              <div className="flex justify-between">
                <span className="text-text-muted">Parcels on Schedule:</span>
                <b className="text-status-success">142 Plots (88%)</b>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-text-muted">Parcels in Red Zone:</span>
                <b className="text-status-danger">8 Plots (5%)</b>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Daund Sub-Division Risk Summary">
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-status-warning/10 border border-status-warning/30 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-bold text-status-warning flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> Objection Hearing Schedule (Sec 15)
                </span>
                <span className="font-bold text-status-warning">On Track</span>
              </div>
              <p className="text-[11px] text-text-muted mt-1">
                Patas Cluster: 4 public objections filed regarding boundary realignment. Hearings scheduled on Sept 25.
              </p>
            </div>

            <div className="p-3 bg-page rounded border border-chamoisee/20">
              <div className="flex justify-between">
                <span className="text-text-muted">Parcels on Schedule:</span>
                <b className="text-status-success">98 Plots (95%)</b>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-text-muted">Parcels in Yellow Zone:</span>
                <b className="text-status-warning">5 Plots (5%)</b>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DistrictDelayRadar;
