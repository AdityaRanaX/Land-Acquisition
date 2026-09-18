import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { CheckCircle2, Clock, Calendar, Download, FileText } from 'lucide-react';

export const LandClaimStatus = () => {
  const timeline = [
    { title: 'Section 4 SIA Public Hearing', date: '10-Apr-2023', status: 'COMPLETED', desc: 'SIA team recorded no negative social impact on village school.' },
    { title: 'Section 11 Preliminary Notification', date: '15-Nov-2023', status: 'COMPLETED', desc: 'Gazette notification published for Survey #142/1A (2.5 Acres).' },
    { title: 'Section 15 Hearing of Objections', date: '18-Feb-2024', status: 'COMPLETED', desc: 'Collector confirmed ownership rights and approved joint measurement survey.' },
    { title: 'Section 19 Declaration of Acquisition', date: '10-May-2024', status: 'COMPLETED', desc: 'Final declaration of public purpose published in Official Gazette.' },
    { title: 'Section 23 Pronouncement of Award', date: 'Current Stage', status: 'IN_PROGRESS', desc: 'Compensation award determined at ₹2,93,66,506.' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Land Acquisition Milestone Progression</h2>
        <p className="text-xs text-slate-400">Statutory step-by-step tracker for Survey #142/1A under RFCTLARR Act, 2013</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {timeline.map((step, idx) => (
          <Card key={idx} title={step.title} subtitle={`Milestone Stage ${idx + 1}`} action={<Badge variant={step.status === 'COMPLETED' ? 'success' : 'primary'} dot>{step.status}</Badge>}>
            <p className="text-xs text-slate-300 leading-relaxed">{step.desc}</p>
            <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-sky-400" /> {step.date}</span>
              <span className="text-slate-500 font-medium">Verified by District Collector</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LandClaimStatus;
