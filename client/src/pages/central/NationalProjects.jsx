import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { getProjects } from '../../services/projectService';
import { Search, Download, Eye } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export const NationalProjects = () => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    getProjects().then(setProjects);
  }, []);

  const filtered = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase());
    const matchesState = stateFilter === 'All' || p.state === stateFilter;
    return matchesSearch && matchesState;
  });

  const columns = [
    {
      title: 'Project Code',
      key: 'code',
      render: (val) => <span className="font-mono font-bold text-kobicha text-xs">{val}</span>
    },
    { title: 'Project Corridor Name', key: 'name', className: 'font-bold text-bistre' },
    { title: 'Requiring Agency', key: 'requiringAgency' },
    { title: 'State', key: 'state' },
    {
      title: 'Area (Ha)',
      key: 'totalAreaRequiredHectares',
      render: (v) => `${v} Ha`
    },
    {
      title: 'Budget (₹ Cr)',
      key: 'estimatedBudgetINR',
      render: (val) => (val ? `₹${(val / 10000000).toFixed(0)} Cr` : 'N/A')
    },
    {
      title: 'Status',
      key: 'status',
      render: (val) => <Badge status={val}>{val?.replace(/_/g, ' ')}</Badge>
    },
    {
      title: 'Statutory Risk',
      key: 'riskLevel',
      render: (val) => <Badge status={val} dot>{val}</Badge>
    },
    {
      title: 'Action',
      key: 'act',
      render: (_, row) => (
        <Link to={`/central/projects/${row.id}`}>
          <Button size="sm" variant="outline" icon={Eye}>Inspect</Button>
        </Link>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-bistre">National Project Repository & Milestone Monitoring</h2>
          <p className="text-xs text-text-muted">Comprehensive oversight of all mega infrastructure projects under RFCTLARR Act, 2013</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" icon={Download}>Export National Ledger</Button>
        </div>
      </div>

      <Card
        action={
          <div className="flex items-center gap-3">
            <div className="w-64">
              <Input
                icon={Search}
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="w-40">
              <Select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                options={[
                  { value: 'All', label: 'All States' },
                  { value: 'Maharashtra', label: 'Maharashtra' }
                ]}
              />
            </div>
          </div>
        }
      >
        <Table
          columns={columns}
          data={filtered}
          onRowClick={(row) => navigate(`/central/projects/${row.id}`)}
        />
      </Card>
    </div>
  );
};

export default NationalProjects;
