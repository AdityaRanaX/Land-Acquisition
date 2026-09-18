import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Search, Filter, Download, PlusCircle } from 'lucide-react';
import apiClient from '../../services/api/apiClient';

export const NationalProjects = () => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await apiClient.get('/projects');
        if (res.data?.data) setProjects(res.data.data);
      } catch (e) {
        setProjects([
          {
            code: 'NHAI-PUNE-BLR-001',
            name: 'Pune-Bengaluru Green Expressway (Package 4A)',
            requiringAgency: 'NHAI',
            state: 'Maharashtra',
            totalAreaRequiredHectares: 480.5,
            estimatedBudgetINR: 12500000000,
            status: 'VALUATION_IN_PROGRESS',
            riskLevel: 'HIGH'
          },
          {
            code: 'MRIDC-PUNE-NSK-002',
            name: 'Pune-Nashik Semi High-Speed Rail Corridor',
            requiringAgency: 'MRIDC',
            state: 'Maharashtra',
            totalAreaRequiredHectares: 1200.0,
            estimatedBudgetINR: 28500000000,
            status: 'SECTION_11_PUBLISHED',
            riskLevel: 'CRITICAL'
          },
          {
            code: 'MIDC-TAL-IND-003',
            name: 'Talegaon Industrial & Semiconductor Cluster Extension',
            requiringAgency: 'MIDC',
            state: 'Maharashtra',
            totalAreaRequiredHectares: 350.0,
            estimatedBudgetINR: 6500000000,
            status: 'PROPOSAL_SUBMITTED',
            riskLevel: 'LOW'
          }
        ]);
      }
    };
    fetchProjects();
  }, []);

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.code.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      title: 'Project Code',
      key: 'code',
      render: (val) => <span className="font-mono font-bold text-sky-400">{val}</span>
    },
    { title: 'Project Name', key: 'name', className: 'font-semibold text-white' },
    { title: 'Agency', key: 'requiringAgency' },
    { title: 'State', key: 'state' },
    { title: 'Area (Ha)', key: 'totalAreaRequiredHectares' },
    {
      title: 'Budget (₹ Cr)',
      key: 'estimatedBudgetINR',
      render: (val) => (val ? `₹${(val / 10000000).toFixed(0)} Cr` : 'N/A')
    },
    {
      title: 'Status',
      key: 'status',
      render: (val) => <Badge variant="primary">{val?.replace(/_/g, ' ')}</Badge>
    },
    {
      title: 'Statutory Risk',
      key: 'riskLevel',
      render: (val) => (
        <Badge variant={val === 'CRITICAL' ? 'danger' : val === 'HIGH' ? 'warning' : 'success'} dot>
          {val}
        </Badge>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">National Infrastructure Acquisition Repository</h2>
          <p className="text-xs text-slate-400">Comprehensive oversight of all mega infrastructure projects under RFCTLARR Act</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" icon={Download}>Export Gazette Index</Button>
        </div>
      </div>

      <Card
        headerClassName="bg-slate-950/40"
        action={
          <div className="w-64">
            <Input
              icon={Search}
              placeholder="Search projects by name or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        }
      >
        <Table columns={columns} data={filtered} />
      </Card>
    </div>
  );
};

export default NationalProjects;
