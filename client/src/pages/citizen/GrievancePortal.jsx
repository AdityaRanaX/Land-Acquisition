import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { mockGrievances } from '../../mock/grievances';
import { HelpCircle, Plus, CheckCircle2, Clock, MessageSquare, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const GrievancePortal = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-bistre tracking-tight">Citizen Grievance Redressal Desk</h1>
          <p className="text-xs text-text-muted mt-0.5">
            Track status of Section 15 objections, valuation inquiries, and R&R settlement requests
          </p>
        </div>

        <Link to="/citizen/grievance-submit">
          <Button variant="primary" size="sm" className="gap-1.5 text-xs">
            <Plus className="w-4 h-4" /> Lodge New Grievance
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {mockGrievances.map((grv) => (
          <Card key={grv.id} title={grv.subject} subtitle={`Ticket ID: ${grv.id} • Filed on ${grv.createdAt}`}>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Category: <b className="text-bistre">{grv.category?.replace(/_/g, ' ')}</b></span>
                <Badge status={grv.status} />
              </div>

              <p className="p-3 bg-page rounded-lg border border-chamoisee/20 text-text-muted leading-relaxed">
                {grv.description}
              </p>

              {grv.slaoResponse && (
                <div className="p-3 bg-buff/15 rounded-lg border border-kobicha/30 space-y-1">
                  <span className="font-bold text-bistre flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-kobicha" /> Official Collector SLAO Response
                  </span>
                  <p className="text-text-muted leading-relaxed">{grv.slaoResponse}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-chamoisee/15 text-[11px] text-text-muted">
                <span>Associated Survey: <b>142/1A</b></span>
                <span>Last Updated: <b>2 hours ago</b></span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GrievancePortal;
