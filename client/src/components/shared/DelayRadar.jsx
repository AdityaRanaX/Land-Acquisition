import React, { useState, useEffect } from 'react';
import apiClient from '../../services/api/apiClient';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { AlertTriangle, ShieldCheck, Clock } from 'lucide-react';

export const DelayRadar = ({ projectId = null, title = 'Statutory RFCTLARR Delay Radar' }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchRadar = async () => {
      setLoading(true);
      setError(null);
      try {
        const query = projectId ? `?projectId=${projectId}` : '';
        const res = await apiClient.get(`/audit/delay-radar${query}`);
        if (isMounted) {
          if (res.data?.data) {
            const resultList = Array.isArray(res.data.data) ? res.data.data : [res.data.data];
            setData(resultList);
          } else {
            setData([]);
          }
        }
      } catch (e) {
        if (isMounted) {
          setError(e.response?.data?.message || 'Unable to load delay radar data from server');
          setData([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchRadar();
    return () => { isMounted = false; };
  }, [projectId]);

  const getRiskBadge = (level) => {
    switch (level) {
      case 'CRITICAL':
        return <Badge variant="danger" dot>CRITICAL RISK</Badge>;
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
      action={<AlertTriangle className="w-4 h-4 text-[#B84D28]" />}
    >
      {loading ? (
        <div className="p-6 text-center text-xs text-[#6C625B]">
          Scanning statutory milestones & delay risks...
        </div>
      ) : error ? (
        <div className="p-4 rounded-lg bg-[#FAF3E0] border border-[#DDD3C7] text-xs text-[#B84D28]">
          {error}
        </div>
      ) : data.length === 0 ? (
        <div className="p-8 text-center space-y-2 border border-dashed border-[#DDD3C7] rounded-xl bg-[#F8F4ED]">
          <ShieldCheck className="w-8 h-8 text-[#C07D38] mx-auto opacity-70" />
          <p className="text-xs font-semibold text-[#4A2E1B]">No delay records found</p>
          <p className="text-[11px] text-[#6C625B]">
            All projects are currently adhering to statutory timelines or have no active bottlenecks recorded.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((item) => (
            <div
              key={item.projectCode || item.projectId}
              className="p-4 rounded-xl border border-[#DDD3C7] bg-[#F8F4ED] space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#4A2E1B]">{item.projectCode}</span>
                    {getRiskBadge(item.riskLevel)}
                  </div>
                  <h4 className="text-sm font-semibold text-[#4A2E1B] mt-1">{item.projectName}</h4>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-[#B84D28]">{item.riskScore}</span>
                  <span className="text-xs text-[#6C625B] block">/100 Risk</span>
                </div>
              </div>

              {/* Bottlenecks List */}
              {item.bottlenecks && item.bottlenecks.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-[#DDD3C7]">
                  {item.bottlenecks.map((b, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-lg text-xs flex items-start gap-2.5 ${
                        b.severity === 'CRITICAL'
                          ? 'bg-[#FADBD8] text-[#78281F] border border-[#F5B7B1]'
                          : b.severity === 'HIGH'
                          ? 'bg-[#FCF3CF] text-[#7D6608] border border-[#F9E79F]'
                          : 'bg-[#EAECEE] text-[#2C3E50] border border-[#D5D8DC]'
                      }`}
                    >
                      <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-current" />
                      <p className="leading-relaxed">{b.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default DelayRadar;
