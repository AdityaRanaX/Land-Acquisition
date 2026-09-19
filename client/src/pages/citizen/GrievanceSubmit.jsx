import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Send, CheckCircle2, AlertTriangle, ArrowLeft, ArrowRight, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const GrievanceSubmit = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    surveyNumber: '142/1A',
    category: 'VALUATION_DISPUTE',
    subject: 'Request for re-counting of 4 grafted mango saplings on southern boundary',
    description: 'During joint measurement on Sept 12, four 3-year-old Alphonso mango saplings near the road margin were missed in the count. Requesting spot verification.',
    contactPhone: '+91 9866001234'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <Card bodyClassName="p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-status-success/15 text-status-success rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-bistre">Grievance Ticket Registered!</h2>
          <p className="text-xs text-text-muted max-w-md mx-auto">
            Your grievance has been lodged with the District Land Acquisition Collector (Pune).
          </p>
          <div className="p-3 bg-buff/20 rounded-lg border border-kobicha/30 max-w-xs mx-auto">
            <p className="text-[10px] uppercase font-bold text-text-muted">Ticket Number</p>
            <p className="font-mono font-black text-kobicha text-lg">GRV-2026-PUN-042</p>
          </div>
          <p className="text-[11px] text-text-muted">
            Under Section 15 / Grievance Redressal Mechanism, hearing scheduled within 7 working days. SMS updates will be sent to {formData.contactPhone}.
          </p>
          <div className="pt-4 flex justify-center gap-3">
            <Link to="/citizen">
              <Button variant="outline" size="sm">Back to Dashboard</Button>
            </Link>
            <Link to="/citizen/grievances">
              <Button variant="primary" size="sm">Track Grievance Status</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <Link to="/citizen">
          <Button variant="outline" size="sm" className="gap-1 text-xs">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Button>
        </Link>
        <Link to="/citizen/grievances">
          <Button variant="secondary" size="sm" className="gap-1 text-xs">
            View Existing Grievances <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-black text-bistre tracking-tight">Submit Dispute / Public Grievance</h1>
        <p className="text-xs text-text-muted mt-0.5">
          RFCTLARR Section 15 hearing objection or Rehabilitation & Resettlement enquiry
        </p>
      </div>

      <Card title="Grievance Particulars">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-bistre mb-1">Survey Number</label>
              <Input
                value={formData.surveyNumber}
                onChange={(e) => setFormData({ ...formData, surveyNumber: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-bistre mb-1">Grievance Category</label>
              <Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                options={[
                  { value: 'VALUATION_DISPUTE', label: 'Valuation / Tree / Asset Count Dispute' },
                  { value: 'BOUNDARY_CORRECTION', label: 'Boundary Demarcation / Area Discrepancy' },
                  { value: 'RNR_ELIGIBILITY', label: 'R&R Package / Housing Plot Entitlement' },
                  { value: 'PAYMENT_DELAY', label: 'Direct Benefit Transfer / PFMS Delay' },
                  { value: 'OTHER', label: 'General Administrative Enquiry' }
                ]}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-bistre mb-1">Subject / Summary</label>
            <Input
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-bistre mb-1">Detailed Description of Grievance</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full text-xs p-3 rounded-lg border border-chamoisee/30 bg-page focus:bg-white focus:outline-none focus:ring-1 focus:ring-kobicha"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-bistre mb-1">Registered Mobile Number for SMS Updates</label>
            <Input
              value={formData.contactPhone}
              onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
            />
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary" size="sm" className="w-full gap-2 py-2.5">
              <Send className="w-4 h-4" /> Submit Grievance to SLAO
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default GrievanceSubmit;
