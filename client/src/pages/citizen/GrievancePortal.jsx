import React, { useState } from 'react';
import { CheckCircle2, Plus, Upload } from 'lucide-react';
import { CitizenCard, CitizenPageHeader, CitizenStatus } from '../../components/citizen/CitizenCard';
import { citizenGrievances as initialGrievances } from '../../data/citizenMockData';

const grievanceStages = ['Submitted', 'Under Review', 'Action Taken', 'Resolved'];

export const GrievancePortal = () => {
  const [grievances, setGrievances] = useState(initialGrievances);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ category: 'Compensation', description: '', evidence: '' });
  const [message, setMessage] = useState('');

  const submit = (event) => {
    event.preventDefault();
    if (!form.description.trim()) return;
    setGrievances((current) => [{ id: `grievance-${Date.now()}`, ticket: `GRV-2026-${String(current.length + 143).padStart(4, '0')}`, category: form.category, submitted: '18 Sep 2026', description: form.description, status: 'Submitted', evidence: form.evidence }, ...current]);
    setForm({ category: 'Compensation', description: '', evidence: '' });
    setOpen(false);
    setMessage('Grievance submitted successfully.');
  };

  return (
    <div className="citizen-page">
      <CitizenPageHeader title="Grievances" subtitle="Raise and track concerns related to your land acquisition case."><button className="citizen-button citizen-button-primary" onClick={() => setOpen(!open)}><Plus size={16} /> {open ? 'Close' : 'Raise New Grievance'}</button></CitizenPageHeader>
      {message && <div className="citizen-alert"><CheckCircle2 size={18} /> {message}</div>}
      {open && <CitizenCard title="Raise New Grievance" subtitle="Tell us what needs attention in your acquisition case."><form className="citizen-form" onSubmit={submit}><label>Category<select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}><option>Compensation</option><option>Land Details</option><option>Documents</option><option>R&amp;R</option><option>Other</option></select></label><label>Description<textarea required rows="5" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Describe your concern" /></label><label className="citizen-file-label"><Upload size={16} /> Evidence upload<input type="file" onChange={(event) => setForm({ ...form, evidence: event.target.files?.[0]?.name || '' })} />{form.evidence && <small>{form.evidence}</small>}</label><button className="citizen-button citizen-button-primary" type="submit">Submit Grievance</button></form></CitizenCard>}
+      {grievances.map((grievance) => <CitizenCard key={grievance.id} title={grievance.ticket} subtitle={`${grievance.category} • Submitted ${grievance.submitted}`} action={<CitizenStatus status={grievance.status} />}><p className="citizen-grievance-description">{grievance.description}</p><div className="citizen-grievance-timeline">{grievanceStages.map((stage) => <div className={stage === grievance.status ? 'is-current' : grievanceStages.indexOf(stage) < grievanceStages.indexOf(grievance.status) ? 'is-complete' : ''} key={stage}><span />{stage}</div>)}</div></CitizenCard>)}
+    </div>
  );
};
export default GrievancePortal;
