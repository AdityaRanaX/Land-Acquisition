import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { AlertOctagon, AlertTriangle, CheckCircle2, Clock, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DelayRadar = ({ title = 'Statutory RFCTLARR Delay Radar' }) => {
  const radarItems = [
    {
      id: 'RADAR-01',
      projectId: 'PROJ-002',
      projectCode: 'MRIDC-PUNE-NSK-002',
      projectName: 'Pune-Nashik Semi High-Speed Rail Corridor',
      riskScore: 85,
      riskLevel: 'CRITICAL',
      bottlenecks: [
        {
          type: 'STATUTORY_LAPSE_RISK',
          severity: 'CRITICAL',
          message: 'Section 19 Declaration pending for 11.8 months since Sec 11 notification. Statutory 1-year lapse limit approaching under Section 19(7)!'
        },
        {
          type: 'CITIZEN_DISPUTE_SURGE',
          severity: 'HIGH',
          message: '18 unresolved valuation objections pending in Khed & Chakan talukas.'
        }
      ]
    },
    {
      id: 'RADAR-02',
      projectId: 'PROJ-001',
      projectCode: 'NHAI-PUNE-BLR-001',
      projectName: 'Pune-Bengaluru Green Expressway (Package 4A)',
      riskScore: 55,
      riskLevel: 'HIGH',
      bottlenecks: [
        {
          type: 'FIELD_SURVEY_LAG',
          severity: 'MEDIUM',
          message: '240 out of 650 parcels (37%) pending ground-truth verification survey.'
        }
      ]
    }
  ];

  return (
    <Card
      title={title}
      subtitle="Automated Heuristic Bottleneck & Statutory Milestone Violation Alarm"
      action={<Zap className="w-4 h-4 text-status-warning" />}
    >
      <div className="space-y-4">
        {radarItems.map((item) => (
          <div
            key={item.projectCode}
            className="p-4 rounded-xl border border-chamoisee/25 bg-[#FDFBF7] space-y-3"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-kobicha">{item.projectCode}</span>
                  <Badge status={item.riskLevel} dot>{item.riskLevel}</Badge>
                </div>
                <h4 className="text-sm font-bold text-bistre mt-1">{item.projectName}</h4>
              </div>
              <div className="text-right shrink-0">
                <span className="text-2xl font-black text-bistre">{item.riskScore}</span>
                <span className="text-[10px] text-text-muted block uppercase font-semibold">/100 Risk</span>
              </div>
            </div>

            {/* Bottlenecks List */}
            <div className="space-y-2 pt-2 border-t border-chamoisee/15">
              {item.bottlenecks?.map((b, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-lg text-xs flex items-start gap-2.5 border ${
                    b.severity === 'CRITICAL'
                      ? 'bg-status-danger/10 text-[#7E332A] border-status-danger/20'
                      : 'bg-status-warning/10 text-[#8F6A22] border-status-warning/20'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-current" />
                  <p className="leading-relaxed font-medium">{b.message}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-1">
              <Link to={`/central/projects/${item.projectId}`}>
                <Button size="sm" variant="outline" icon={ArrowRight}>
                  Review Statutory Directive
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default DelayRadar;
