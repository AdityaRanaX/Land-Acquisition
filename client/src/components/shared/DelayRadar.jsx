import React, { useState, useEffect } from 'react';
import apiClient from '../../services/api/apiClient';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { AlertOctagon, AlertTriangle, CheckCircle2, Clock, Zap } from 'lucide-react';

export const DelayRadar = ({ projectId = null, title = 'Statutory RFCTLARR Delay Radar' }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRadar = async () => {
      setLoading(true);
      try {
        const query = projectId ? `?projectId=${projectId}` : '';
        const res = await apiClient.get(`/audit/delay-radar${query}`);
        if (res.data?.data) {
          setData(Array.isArray(res.data.data) ? res.data.data : [res.data.data]);
        }
      } catch (e) {
        // Fallback mock items
        setData([
          {
            projectId: 'p_2',
            projectCode: 'MRIDC-PUNE-NSK-002',
            projectName: 'Pune-Nashik Semi High-Speed Rail Corridor',
            riskScore: 85,
            riskLevel: 'CRITICAL',
            bottlenecks: [
              {
                type: 'STATUTORY_LAPSE_RISK',
                severity: 'CRITICAL',
                message: 'Section 19 Declaration pending for 11.8 months since Sec 11 notification. Lapse window expires in 6 days!'
              },
              {
                type: 'CITIZEN_DISPUTE_SURGE',
                severity: 'HIGH',
                message: '18 unresolved valuation objections pending in Khed taluka.'
              }
            ]
          },
          {
            projectId: 'p_1',
            projectCode: 'NHAI-PUNE-BLR-001',
            projectName: 'Pune-Bengaluru Green Expressway (Package 4A)',
            riskScore: 55,
            riskLevel: 'HIGH',
            bottlenecks: [
              {
                type: 'FIELD_SURVEY_LAG',
                severity: 'MEDIUM',
                message: '240 out of 650 parcels (37%) pending ground truth verification.'
              }
            ]
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRadar();
  }, [projectId]);

  const getRiskBadge = (level) => {
    switch (level) {
      case 'CRITICAL':
        return <Badge variant="danger" dot className="animate-pulse">CRITICAL RISK</Badge>;
      case 'HIGH':
        return <Badge variant="warning" dot>HIGH RISK</Badge>;
      case 'MEDIUM':
        return <Badge variant="primary">MODERATE</Badge>;
      default:
        return <Badge variant="success">LOW RISK</Badge>;
    }
  };

  return (
    <Card
      title={title}
      subtitle="Automated Statutory Bottleneck & RFCTLARR Timeline Violation Detection"
      action={<Zap className="w-4 h-4 text-amber-400" />}
    >
      <div className="space-y-4">
        {data.map((item) => (
          <div
            key={item.projectCode}
            className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-3"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-sky-400">{item.projectCode}</span>
                  {getRiskBadge(item.riskLevel)}
                </div>
                <h4 className="text-sm font-semibold text-slate-100 mt-1">{item.projectName}</h4>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-white">{item.riskScore}</span>
                <span className="text-xs text-slate-500 block">/100 Risk</span>
              </div>
            </div>

            {/* Bottlenecks List */}
            <div className="space-y-2 pt-2 border-t border-slate-900">
              {item.bottlenecks?.map((b, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-lg text-xs flex items-start gap-2.5 ${
                    b.severity === 'CRITICAL'
                      ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                      : b.severity === 'HIGH'
                      ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                      : 'bg-slate-900 text-slate-300 border border-slate-800'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-current" />
                  <p className="leading-relaxed">{b.message}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default DelayRadar;
