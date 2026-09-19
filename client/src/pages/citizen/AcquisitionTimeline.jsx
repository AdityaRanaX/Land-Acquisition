import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { CheckCircle2, Clock, Calendar, ArrowRight, ShieldCheck, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AcquisitionTimeline = () => {
  const steps = [
    {
      num: 1,
      title: 'Section 4: Social Impact Assessment (SIA) Study',
      date: 'Completed on Jan 15, 2026',
      status: 'COMPLETED',
      desc: 'SIA team conducted public hearings in Wagholi Gram Panchayat. R&R scheme recommendations submitted.'
    },
    {
      num: 2,
      title: 'Section 11: Preliminary Gazette Notification',
      date: 'Published on May 02, 2026 (Gazette #412)',
      status: 'COMPLETED',
      desc: 'Notified public intention to acquire land. Bar on land transaction and construction activated.'
    },
    {
      num: 3,
      title: 'Section 15: Landowner Hearing of Objections',
      date: 'Hearing concluded on Jun 20, 2026',
      status: 'COMPLETED',
      desc: 'Shri Ramesh Patil attended SLAO hearing regarding tree count. Joint inspection endorsed 12 mango trees.'
    },
    {
      num: 4,
      title: 'Section 19: Final Declaration of Acquisition',
      date: 'Gazette published on Aug 14, 2026',
      status: 'COMPLETED',
      desc: 'Official declaration published in local newspapers and district gazette.'
    },
    {
      num: 5,
      title: 'Section 23: Award Pronouncement & 100% Solatium',
      date: 'In Progress (Expected Sept 2026)',
      status: 'IN_PROGRESS',
      desc: 'LAA Collector finalizing statutory award dossier. Direct benefit transfer (DBT) escrow account ready.'
    },
    {
      num: 6,
      title: 'Section 38: Physical Possession Handover & R&R Allotment',
      date: 'Scheduled for Nov 2026',
      status: 'PENDING',
      desc: 'Compensation credit to bank account followed by formal physical possession by NHAI.'
    }
  ];

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-bistre tracking-tight">Land Acquisition Statutory Journey</h1>
        <p className="text-xs text-text-muted mt-0.5">
          Step-by-step progress of your land acquisition under RFCTLARR Act 2013
        </p>
      </div>

      <div className="space-y-4">
        {steps.map((step) => (
          <Card
            key={step.num}
            bodyClassName={`p-4 transition-all ${
              step.status === 'IN_PROGRESS' ? 'border-kobicha bg-buff/10' : ''
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                    step.status === 'COMPLETED'
                      ? 'bg-status-success text-white'
                      : step.status === 'IN_PROGRESS'
                      ? 'bg-kobicha text-white'
                      : 'bg-chamoisee/30 text-text-muted'
                  }`}
                >
                  {step.status === 'COMPLETED' ? <CheckCircle2 className="w-4 h-4" /> : step.num}
                </div>
                <div>
                  <h4 className="font-bold text-bistre text-sm">{step.title}</h4>
                  <p className="text-[11px] font-semibold text-kobicha mt-0.5">{step.date}</p>
                  <p className="text-xs text-text-muted mt-1 leading-relaxed">{step.desc}</p>
                </div>
              </div>

              <Badge status={step.status} />
            </div>
          </Card>
        ))}
      </div>

      <div className="p-4 bg-page rounded-lg border border-chamoisee/20 flex items-center justify-between">
        <div>
          <h4 className="font-bold text-bistre text-xs">Have questions regarding current stage?</h4>
          <p className="text-[11px] text-text-muted">You can submit queries or check compensation anytime.</p>
        </div>
        <Link to="/citizen/grievance-submit">
          <Button variant="primary" size="sm" className="text-xs">
            Ask SLAO Desk
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default AcquisitionTimeline;
