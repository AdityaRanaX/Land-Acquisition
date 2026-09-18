import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { HelpCircle, PlusCircle, CheckCircle2, Calendar, AlertCircle } from 'lucide-react';
import apiClient from '../../services/api/apiClient';

export const GrievancePortal = () => {
  const [grievances, setGrievances] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    category: 'VALUATION_DISPUTE',
    priority: 'HIGH',
    subject: '',
    description: ''
  });
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGrievances = async () => {
      try {
        const res = await apiClient.get('/grievances');
        if (res.data?.data) setGrievances(res.data.data);
      } catch (e) {
        setGrievances([
          {
            ticketNumber: 'GRV-882190',
            category: 'VALUATION_DISPUTE',
            priority: 'HIGH',
            subject: 'Request for re-valuation of 12 mature Kesar Mango trees and deep borewell',
            status: 'HEARING_SCHEDULED',
            hearingDate: '2024-09-25T11:00:00Z',
            hearingRemarks: 'Joint spot verification with Sub-Divisional Horticulture Officer.'
          }
        ]);
      }
    };
    fetchGrievances();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiClient.post('/grievances', formData);
      setSuccess('Grievance ticket submitted successfully! Assigned to District Collector.');
      setFormOpen(false);
      if (res.data?.data) {
        setGrievances([res.data.data, ...grievances]);
      }
    } catch (err) {
      setSuccess('Grievance ticket created (Demo mode).');
      setFormOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: 'Ticket #', key: 'ticketNumber', render: (v) => <span className="font-mono font-bold text-sky-400">{v}</span> },
    { title: 'Dispute Category', key: 'category' },
    { title: 'Subject', key: 'subject', className: 'font-medium text-white' },
    {
      title: 'Hearing Date',
      key: 'hearingDate',
      render: (v) => (v ? <span className="text-amber-400 font-semibold">{new Date(v).toLocaleDateString()}</span> : 'Under Review')
    },
    {
      title: 'Ticket Status',
      key: 'status',
      render: (v) => <Badge variant={v === 'RESOLVED' ? 'success' : v === 'HEARING_SCHEDULED' ? 'warning' : 'primary'} dot>{v}</Badge>
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Citizen Grievance & Dispute Redressal Portal</h2>
          <p className="text-xs text-slate-400">Direct escalation of valuation, boundary, or compensation disputes to the District Authority</p>
        </div>
        <Button variant="primary" icon={PlusCircle} onClick={() => setFormOpen(!formOpen)}>
          {formOpen ? 'Cancel' : 'File New Grievance'}
        </Button>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{success}</span>
        </div>
      )}

      {/* Grievance Submission Form */}
      {formOpen && (
        <Card title="File a New Dispute Ticket" subtitle="Explain the nature of objection under RFCTLARR Section 15 / 64">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Dispute Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                options={[
                  { value: 'VALUATION_DISPUTE', label: 'Valuation & Tree/Structure Count Dispute' },
                  { value: 'BOUNDARY_SURVEY_MISMATCH', label: 'Boundary Marker & Area Discrepancy' },
                  { value: 'OWNERSHIP_TITLE_CONFLICT', label: 'Ownership & Title Record Correction' },
                  { value: 'PAYMENT_DELAY_ESCROW', label: 'DBT Bank Disbursement Delay' },
                  { value: 'RR_ENTITLEMENT_OMISSION', label: 'Schedule II R&R Benefit Omission' }
                ]}
              />
              <Select
                label="Urgency Priority"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                options={[
                  { value: 'HIGH', label: 'High Priority (Immediate Hearing)' },
                  { value: 'MEDIUM', label: 'Medium Priority' },
                  { value: 'LOW', label: 'General Clarification' }
                ]}
              />
            </div>

            <Input
              label="Subject / Summary"
              required
              placeholder="e.g. Valuation of 12 mature fruit-bearing mango trees missing"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            />

            <Input
              label="Detailed Explanation of Dispute"
              required
              placeholder="State the exact facts, survey number, and requested corrective action by the Collector."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />

            <Button type="submit" variant="primary" loading={loading} icon={CheckCircle2} className="w-full mt-2">
              Submit Dispute Ticket
            </Button>
          </form>
        </Card>
      )}

      <Card title="My Filed Grievances & Scheduled Collector Hearings" subtitle="Track real-time resolution remarks">
        <Table columns={columns} data={grievances} />
      </Card>
    </div>
  );
};

export default GrievancePortal;
