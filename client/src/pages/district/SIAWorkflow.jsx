import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Users, FileCheck2, CheckCircle2, Clock, Calendar } from 'lucide-react';

export const SIAWorkflow = () => {
  const steps = [
    { title: 'Step 1: Section 4 SIA Study Notification', desc: 'Public notice published in two local vernacular newspapers and Gram Sabha.', status: 'COMPLETED', date: '10-Apr-2023' },
    { title: 'Step 2: Gram Sabha Public Hearing', desc: 'Conducted in Wagholi village hall with 280 affected family attendees.', status: 'COMPLETED', date: '18-May-2023' },
    { title: 'Step 3: Social Impact Management Plan (SIMP)', desc: 'Identified 2 vulnerable SC/ST families eligible for Schedule II housing and subsistence.', status: 'COMPLETED', date: '25-Jun-2023' },
    { title: 'Step 4: Section 6 Expert Group Appraisal', desc: 'State Appraisal Committee recommended project approval with green mitigation safeguards.', status: 'APPROVED', date: '22-Jul-2023' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Social Impact Assessment (SIA) Workflow</h2>
        <p className="text-xs text-slate-400">Statutory RFCTLARR Section 4 to Section 6 Public Consultation & Expert Group Evaluation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="SIA Statutory Milestones" subtitle="Pune-Bengaluru Expressway Corridor (Package 4A)">
          <div className="space-y-4">
            {steps.map((s, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-100">{s.title}</h4>
                  <Badge variant="success" dot>{s.status}</Badge>
                </div>
                <p className="text-[11px] text-slate-400">{s.desc}</p>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 pt-1 border-t border-slate-900">
                  <Calendar className="w-3 h-3 text-sky-400" />
                  <span>Completed on: {s.date}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="SIA Findings & Mitigation Summary" subtitle="Key community assets identified">
          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Affected Families Identified</span>
              <span className="text-lg font-bold text-white mt-0.5 block">14 Families</span>
              <span className="text-[11px] text-slate-400">2 Displaced residential households, 12 Agricultural landholders</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Common Property Resources (CPR)</span>
              <span className="text-[11px] text-slate-200 mt-1 block">1 Village grazing land well and 1 community pond edge to be reconstructed by NHAI.</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SIAWorkflow;
