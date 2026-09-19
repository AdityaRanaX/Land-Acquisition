import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { CheckCircle2, XCircle, AlertCircle, FileCheck2, ExternalLink } from 'lucide-react';

export const ProjectApproval = () => {
  const [requisitions, setRequisitions] = useState([
    {
      id: 'REQ-01',
      projectCode: 'MIDC-TAL-IND-003',
      name: 'Talegaon Industrial & Semiconductor Cluster Extension',
      agency: 'Maharashtra Industrial Development Corporation (MIDC)',
      areaHa: 350.0,
      budgetCr: 650,
      submittedDate: '01-Mar-2024',
      status: 'PENDING_SCRUTINY',
      remarks: 'Preliminary Alignment and SIA Study report attached for Collector sanction.'
    }
  ]);

  const handleApprove = (id) => {
    setRequisitions((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'APPROVED_INITIATED' } : r))
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-bistre">Project Requisitions & Administrative Approvals</h2>
        <p className="text-xs text-text-muted">Statutory scrutiny of land requisition proposals submitted by Requiring Bodies</p>
      </div>

      <div className="space-y-4">
        {requisitions.map((r) => (
          <Card key={r.id} title={r.name} subtitle={`Project Code: ${r.projectCode} • Submitted on ${r.submittedDate}`} action={<Badge status={r.status}>{r.status?.replace(/_/g, ' ')}</Badge>}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs text-text-primary mb-4 p-3.5 bg-[#FDFBF7] rounded-xl border border-chamoisee/20">
              <div>
                <span className="text-text-muted block text-[10px] font-bold uppercase">Requiring Agency</span>
                <span className="font-bold text-bistre">{r.agency}</span>
              </div>
              <div>
                <span className="text-text-muted block text-[10px] font-bold uppercase">Required Footprint</span>
                <span className="font-bold text-bistre">{r.areaHa} Hectares</span>
              </div>
              <div>
                <span className="text-text-muted block text-[10px] font-bold uppercase">Estimated Budget</span>
                <span className="font-bold text-kobicha">₹{r.budgetCr} Crores</span>
              </div>
              <div>
                <span className="text-text-muted block text-[10px] font-bold uppercase">SIA Status</span>
                <span className="font-bold text-[#4D5A34]">Study Report Attached ✓</span>
              </div>
            </div>

            <p className="text-xs text-text-muted mb-4">{r.remarks}</p>

            <div className="flex items-center justify-between pt-3 border-t border-chamoisee/15">
              <Button size="sm" variant="outline" icon={ExternalLink}>View Detailed DPR & Alignment</Button>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="danger" icon={XCircle}>Reject Requisition</Button>
                <Button
                  size="sm"
                  variant="success"
                  icon={CheckCircle2}
                  onClick={() => handleApprove(r.id)}
                >
                  {r.status === 'APPROVED_INITIATED' ? 'Approved ✓' : 'Approve & Issue Section 4 Notice'}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProjectApproval;
