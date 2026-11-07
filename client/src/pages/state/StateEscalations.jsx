import React, { useMemo, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { AlertTriangle, ArrowUpRight, CheckCircle2, ClipboardCheck, Clock, Send, ShieldAlert } from 'lucide-react';

export const StateEscalations = () => {
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedId, setSelectedId] = useState('ESC-9901');
  const [actionMessage, setActionMessage] = useState('');
  const escalations = [
    {
      id: 'ESC-9901',
      project: 'Pune-Nashik Semi High-Speed Rail',
      district: 'Pune',
      type: 'Statutory 12-Month Lapse Alert',
      summary: 'Section 19 declaration pending for 11 months since Sec 11 notification.',
      urgency: 'CRITICAL',
      assignedCollector: 'Dr. Suhas Diwase (IAS)',
      deadline: '10-Oct-2026',
      status: 'Pending',
      raised: 'District Authority · 16 Sep 2026',
      recommendation: 'Issue an instruction to complete the Section 19 declaration and upload the legal review note within 48 hours.'
    },
    {
      id: 'ESC-8834',
      project: 'Pune-Bengaluru Green Expressway',
      district: 'Satara',
      type: 'Valuation Hearing Deadlock',
      summary: 'Objection filed by 40 farmers in Shirwal regarding circle rate multipliers.',
      urgency: 'HIGH',
      assignedCollector: 'Collector, Satara',
      deadline: '28-Sep-2026',
      status: 'In review',
      raised: 'District Authority · 14 Sep 2026',
      recommendation: 'Convene a valuation hearing with the affected families and submit the revised assessment for state review.'
    },
    {
      id: 'ESC-7712',
      project: 'Nashik Industrial Growth Zone',
      district: 'Nashik',
      type: 'Repeated Verification Discrepancy',
      summary: '18 parcels remain unresolved after two field visits and require district-level coordination.',
      urgency: 'MEDIUM',
      assignedCollector: 'Collector, Nashik',
      deadline: '04-Oct-2026',
      status: 'Resolved',
      raised: 'District Authority · 09 Sep 2026',
      recommendation: 'Coordinate a joint verification camp with the field team and project agency.'
    }
  ];

  const visibleEscalations = useMemo(
    () => statusFilter === 'All' ? escalations : escalations.filter((item) => item.status === statusFilter),
    [statusFilter]
  );
  const selected = escalations.find((item) => item.id === selectedId) || escalations[0];

  const runAction = (message) => {
    setActionMessage(message);
  };

  const columns = [
    { title: 'Case ID', key: 'id', render: (v) => <span className="font-mono font-bold text-sky-400">{v}</span> },
    { title: 'Project Name', key: 'project', className: 'font-semibold text-white' },
    { title: 'District', key: 'district' },
    { title: 'Escalation Category', key: 'type' },
    {
      title: 'Severity',
      key: 'urgency',
      render: (v) => <Badge variant={v === 'CRITICAL' ? 'danger' : v === 'HIGH' ? 'warning' : 'primary'} dot>{v}</Badge>
    },
    { title: 'Assigned Collector', key: 'assignedCollector' },
    { title: 'Status', key: 'status', render: (v) => <Badge variant={v === 'Resolved' ? 'success' : v === 'In review' ? 'primary' : 'warning'}>{v}</Badge> },
    { title: 'Deadline', key: 'deadline', render: (v) => <span className="text-rose-400 font-semibold">{v}</span> },
    {
      title: 'Action',
      key: 'act',
      render: (_, row) => <Button size="sm" variant="primary" onClick={() => setSelectedId(row.id)}>Review</Button>
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold uppercase tracking-[0.18em]"><ShieldAlert className="w-3.5 h-3.5" /> Escalation desk</div>
          <h2 className="text-xl font-bold text-white mt-2">State-level escalations</h2>
          <p className="text-xs text-slate-400 mt-1">Review district cases, send instructions, or forward unresolved issues to Central.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400"><Clock className="w-3.5 h-3.5" /> Next review window: 18 Sep 2026 · 11:00</div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[['Open cases', '2', AlertTriangle, 'text-amber-400'], ['Critical', '1', ShieldAlert, 'text-rose-400'], ['In review', '1', ClipboardCheck, 'text-sky-400'], ['Resolved this month', '7', CheckCircle2, 'text-emerald-400']].map(([label, value, Icon, color]) => (
          <div key={label} className="glass-card rounded-xl border border-slate-800/80 p-4 flex items-center gap-3"><Icon className={`w-5 h-5 ${color}`} /><div><p className="text-lg font-bold text-white">{value}</p><p className="text-[11px] text-slate-500">{label}</p></div></div>
        ))}
      </div>

      <Card title="Escalation queue" subtitle="District cases and statutory deadline trackers" action={<div className="flex gap-1">{['All', 'Pending', 'In review', 'Resolved'].map((filter) => <button key={filter} onClick={() => setStatusFilter(filter)} className={`px-2.5 py-1 rounded-md text-xs ${statusFilter === filter ? 'bg-sky-500/15 text-sky-300' : 'text-slate-500 hover:text-slate-300'}`}>{filter}</button>)}</div>}>
        <Table columns={columns} data={visibleEscalations} onRowClick={(row) => setSelectedId(row.id)} />
      </Card>

      <Card title={`Review ${selected.id}`} subtitle={`${selected.project} · ${selected.district}`} action={<Badge variant={selected.status === 'Resolved' ? 'success' : 'warning'} dot>{selected.status}</Badge>}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div><p className="text-xs text-slate-500 uppercase tracking-wider">Escalation reason</p><p className="text-sm font-semibold text-white mt-1">{selected.type}</p><p className="text-sm text-slate-300 mt-2 leading-relaxed">{selected.summary}</p></div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm"><div><p className="text-xs text-slate-500">Raised by</p><p className="text-slate-200 mt-1">{selected.raised}</p></div><div><p className="text-xs text-slate-500">Assigned collector</p><p className="text-slate-200 mt-1">{selected.assignedCollector}</p></div><div><p className="text-xs text-slate-500">Action deadline</p><p className="text-rose-300 font-semibold mt-1">{selected.deadline}</p></div></div>
            <div className="p-3 rounded-lg border border-sky-500/20 bg-sky-500/5"><p className="text-xs text-sky-300 uppercase tracking-wider">Suggested state instruction</p><p className="text-sm text-slate-200 mt-1 leading-relaxed">{selected.recommendation}</p></div>
            {actionMessage && <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-sm text-emerald-300"><CheckCircle2 className="w-4 h-4 inline mr-2" />{actionMessage}</div>}
          </div>
          <div className="space-y-2 lg:border-l lg:border-slate-800 lg:pl-6"><p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Available actions</p><Button className="w-full" icon={Send} onClick={() => runAction(`Instruction sent to ${selected.assignedCollector}.`)}>Send instruction</Button><Button className="w-full" variant="outline" icon={ArrowUpRight} onClick={() => runAction('Case forwarded to Central Government for national review.')}>Forward to Central</Button><Button className="w-full" variant="success" icon={CheckCircle2} onClick={() => runAction(`Case ${selected.id} marked resolved.`)}>Mark resolved</Button></div>
        </div>
      </Card>
    </div>
  );
};

export default StateEscalations;
