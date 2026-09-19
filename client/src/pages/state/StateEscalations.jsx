import React from 'react';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { AlertTriangle, Clock, Calendar, CheckCircle2 } from 'lucide-react';

export const StateEscalations = () => {
  const escalations = [
    {
      id: 'ESC-9901',
      project: 'Pune-Nashik Semi High-Speed Rail Corridor',
      district: 'Pune',
      type: 'Statutory 12-Month Lapse Alert',
      summary: 'Section 19 declaration pending for 11.8 months since Sec 11 notification.',
      urgency: 'CRITICAL',
      assignedCollector: 'Dr. Suhas Diwase (IAS)',
      deadline: '10-Oct-2024'
    },
    {
      id: 'ESC-8834',
      project: 'Pune-Bengaluru Green Expressway (Package 4A)',
      district: 'Satara',
      type: 'Valuation Hearing Deadlock',
      summary: 'Objection filed by 40 farmers in Shirwal regarding circle rate multipliers.',
      urgency: 'HIGH',
      assignedCollector: 'Collector, Satara',
      deadline: '28-Sep-2024'
    }
  ];

  const columns = [
    { title: 'Case ID', key: 'id', render: (v) => <span className="font-mono font-bold text-kobicha">{v}</span> },
    { title: 'Project Name', key: 'project', className: 'font-bold text-bistre' },
    { title: 'District', key: 'district' },
    { title: 'Escalation Category', key: 'type' },
    {
      title: 'Severity',
      key: 'urgency',
      render: (v) => <Badge status={v} dot>{v}</Badge>
    },
    { title: 'Assigned Collector', key: 'assignedCollector' },
    { title: 'Deadline', key: 'deadline', render: (v) => <span className="text-[#7E332A] font-bold">{v}</span> },
    {
      title: 'Action',
      key: 'act',
      render: () => <Button size="sm" variant="primary">Review Directive</Button>
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-bistre">State-Level Escalations & Bottlenecks</h2>
        <p className="text-xs text-text-muted">High-priority bottlenecks escalated directly to Principal Secretary (Revenue)</p>
      </div>

      <Card title="Active Statutory Escalation Queue" subtitle="Collector notices and hearing deadline trackers">
        <Table columns={columns} data={escalations} />
      </Card>
    </div>
  );
};

export default StateEscalations;
