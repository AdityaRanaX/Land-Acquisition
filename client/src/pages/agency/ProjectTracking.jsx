import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { mockProjects } from '../../mock/projects';
import { CheckCircle2, Clock, AlertTriangle, ArrowRight, Download, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProjectTracking = () => {
  const proj = mockProjects[0];

  const statutoryStages = [
    { code: 'SIA_4', name: 'Section 4: SIA Study & Notification', status: 'COMPLETED', date: 'Jan 15, 2026', delayDays: 0 },
    { code: 'EXPERT_7', name: 'Section 7: Expert Committee Evaluation', status: 'COMPLETED', date: 'Mar 10, 2026', delayDays: 0 },
    { code: 'SEC_11', name: 'Section 11: Preliminary Gazette Notification', status: 'COMPLETED', date: 'May 02, 2026', delayDays: 0 },
    { code: 'SEC_15', name: 'Section 15: Landowner Hearing of Objections', status: 'COMPLETED', date: 'Jun 20, 2026', delayDays: 0 },
    { code: 'SEC_19', name: 'Section 19: Final Declaration of Acquisition', status: 'IN_PROGRESS', date: 'Expected Oct 2026', delayDays: 14 },
    { code: 'SEC_23', name: 'Section 23: Valuation & Solatium Award Inquiry', status: 'PENDING', date: 'Expected Nov 2026', delayDays: 0 },
    { code: 'SEC_38', name: 'Section 38: Final Physical Possession Handover', status: 'PENDING', date: 'Expected Jan 2027', delayDays: 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-bistre tracking-tight">{proj.name}</h1>
            <Badge status={proj.currentStage} />
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Project Code: <span className="font-mono font-bold text-kobicha">{proj.code}</span> • Corridor Length: 128 km
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Download className="w-4 h-4" /> Download Gantt Export
          </Button>
          <Link to="/agency/parcels">
            <Button variant="primary" size="sm">View Corridor Parcels</Button>
          </Link>
        </div>
      </div>

      {/* Corridor Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card bodyClassName="p-4">
          <p className="text-[10px] uppercase font-bold text-text-muted">Total Requisitioned</p>
          <p className="text-xl font-black text-bistre mt-0.5">{proj.totalAreaAcres || 480} Ha</p>
          <p className="text-xs text-text-muted">185 Total Cadastral Parcels</p>
        </Card>
        <Card bodyClassName="p-4">
          <p className="text-[10px] uppercase font-bold text-text-muted">Possession Handed Over</p>
          <p className="text-xl font-black text-status-success mt-0.5">{proj.progressPercentage || 48}%</p>
          <p className="text-xs text-status-success font-medium">92 Plots Ready for Civil Works</p>
        </Card>
        <Card bodyClassName="p-4">
          <p className="text-[10px] uppercase font-bold text-text-muted">Escrow Account Deposited</p>
          <p className="text-xl font-black text-bistre mt-0.5">₹900.0 Cr</p>
          <p className="text-xs text-text-muted">Sanctioned: ₹1,250 Cr</p>
        </Card>
        <Card bodyClassName="p-4">
          <p className="text-[10px] uppercase font-bold text-text-muted">Collector Lead Time</p>
          <p className="text-xl font-black text-status-warning mt-0.5">242 Days</p>
          <p className="text-xs text-text-muted">Target: &lt; 365 Days (Sec 19)</p>
        </Card>
      </div>

      {/* Statutory Milestones Stepper */}
      <Card title="RFCTLARR 2013 Statutory Stage Tracker">
        <div className="space-y-4">
          {statutoryStages.map((stage, idx) => (
            <div
              key={stage.code}
              className={`p-3.5 rounded-lg border transition-all flex items-center justify-between ${
                stage.status === 'COMPLETED'
                  ? 'bg-status-success/5 border-status-success/25'
                  : stage.status === 'IN_PROGRESS'
                  ? 'bg-buff/15 border-kobicha shadow-sm'
                  : 'bg-page border-chamoisee/15 opacity-70'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                    stage.status === 'COMPLETED'
                      ? 'bg-status-success text-white'
                      : stage.status === 'IN_PROGRESS'
                      ? 'bg-kobicha text-white'
                      : 'bg-chamoisee/30 text-text-muted'
                  }`}
                >
                  {idx + 1}
                </div>
                <div>
                  <h4 className="font-bold text-bistre text-xs">{stage.name}</h4>
                  <p className="text-[11px] text-text-muted">{stage.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {stage.delayDays > 0 && (
                  <span className="text-[11px] text-status-danger font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> +{stage.delayDays} Days Delay
                  </span>
                )}
                <Badge status={stage.status} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ProjectTracking;
