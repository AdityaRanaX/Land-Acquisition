import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { getProjects } from '../../services/projectService';
import { Eye, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const DistrictProjects = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getProjects().then(setProjects);
  }, []);

  const columns = [
    {
      title: 'Project Code',
      key: 'code',
      render: (v) => <span className="font-mono font-bold text-kobicha text-xs">{v}</span>
    },
    { title: 'Corridor Name', key: 'name', className: 'font-bold text-bistre' },
    { title: 'Requiring Agency', key: 'requiringAgency' },
    { title: 'Area (Ha)', key: 'totalAreaRequiredHectares', render: (v) => `${v} Ha` },
    {
      title: 'Status',
      key: 'status',
      render: (v) => <Badge status={v}>{v?.replace(/_/g, ' ')}</Badge>
    },
    {
      title: 'Action',
      key: 'act',
      render: (_, row) => (
        <Link to={`/central/projects/${row.id}`}>
          <Button size="sm" variant="outline" icon={Eye}>Details</Button>
        </Link>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-bistre">District Infrastructure Acquisition Projects</h2>
          <p className="text-xs text-text-muted">Corridors passing through Pune District under Collector jurisdiction</p>
        </div>
        <Link to="/district/approvals">
          <Button variant="primary" icon={CheckCircle2}>Review Pending Requisitions</Button>
        </Link>
      </div>

      <Card title="Active District Projects">
        <Table columns={columns} data={projects} onRowClick={(row) => navigate(`/central/projects/${row.id}`)} />
      </Card>
    </div>
  );
};

export default DistrictProjects;
