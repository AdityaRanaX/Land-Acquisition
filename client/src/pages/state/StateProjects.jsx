import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { getProjects } from '../../services/projectService';
import { Search, Eye, Download } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const StateProjects = () => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getProjects({ state: 'Maharashtra' }).then(setProjects);
  }, []);

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      title: 'Project Code',
      key: 'code',
      render: (v) => <span className="font-mono font-bold text-kobicha text-xs">{v}</span>
    },
    { title: 'Corridor Name', key: 'name', className: 'font-bold text-bistre' },
    { title: 'Requiring Body', key: 'requiringAgency' },
    { title: 'Districts', key: 'districts', render: (d) => d?.join(', ') },
    { title: 'Area (Ha)', key: 'totalAreaRequiredHectares', render: (v) => `${v} Ha` },
    {
      title: 'Workflow Stage',
      key: 'status',
      render: (v) => <Badge status={v}>{v?.replace(/_/g, ' ')}</Badge>
    },
    {
      title: 'Risk',
      key: 'riskLevel',
      render: (v) => <Badge status={v} dot>{v}</Badge>
    },
    {
      title: 'Action',
      key: 'act',
      render: (_, row) => (
        <Link to={`/state/projects/${row.id}`}>
          <Button size="sm" variant="outline" icon={Eye}>Inspect</Button>
        </Link>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-bistre">State Projects Monitoring Ledger</h2>
          <p className="text-xs text-text-muted">Highways, railways, metro, and industrial corridors within Maharashtra state scope</p>
        </div>
        <Button variant="outline" icon={Download}>Export State Ledger</Button>
      </div>

      <Card
        action={
          <div className="w-64">
            <Input
              icon={Search}
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        }
      >
        <Table
          columns={columns}
          data={filtered}
          onRowClick={(row) => navigate(`/state/projects/${row.id}`)}
        />
      </Card>
    </div>
  );
};

export default StateProjects;
