import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { getParcels } from '../../services/parcelService';
import { Search, Eye, Download, Camera } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const DistrictParcels = () => {
  const [parcels, setParcels] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    getParcels().then(setParcels);
  }, []);

  const filtered = parcels.filter((p) => {
    const matchesSearch =
      p.surveyNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.primaryOwnerName.toLowerCase().includes(search.toLowerCase()) ||
      p.village.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.acquisitionStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      title: 'Survey #',
      key: 'surveyNumber',
      render: (v) => <span className="font-mono font-bold text-kobicha text-xs">{v}</span>
    },
    { title: 'Village / Taluka', key: 'village', render: (_, r) => `${r.village}, ${r.taluka}` },
    { title: 'Primary Landowner', key: 'primaryOwnerName', className: 'font-bold text-bistre' },
    { title: 'Area (Acres)', key: 'areaAcres', render: (v) => `${v} Acres` },
    { title: 'Land Classification', key: 'landType' },
    {
      title: 'Ground Verified',
      key: 'fieldVerification',
      render: (v) => (
        <Badge status={v?.isVerified ? 'VERIFIED' : 'PENDING'} size="sm" dot>
          {v?.isVerified ? 'Verified' : 'Pending'}
        </Badge>
      )
    },
    {
      title: 'Status',
      key: 'acquisitionStatus',
      render: (v) => <Badge status={v}>{v?.replace(/_/g, ' ')}</Badge>
    },
    {
      title: 'Action',
      key: 'act',
      render: (_, row) => (
        <Link to={`/district/parcels/${row.id}`}>
          <Button size="sm" variant="outline" icon={Eye}>Inspect</Button>
        </Link>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-bistre">Cadastral Land Parcels & Ownership Register</h2>
          <p className="text-xs text-text-muted">Master database of surveyed land holdings under RFCTLARR acquisition in Pune District</p>
        </div>
        <Button variant="outline" icon={Download}>Export Cadastral Register</Button>
      </div>

      <Card
        action={
          <div className="flex items-center gap-3">
            <div className="w-64">
              <Input
                icon={Search}
                placeholder="Search survey #, owner..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="w-44">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: 'All', label: 'All Statuses' },
                  { value: 'VALUATION_COMPLETED', label: 'Valuation Done' },
                  { value: 'NOTIFIED_SEC_11', label: 'Notified (Sec 11)' },
                  { value: 'DISPUTED', label: 'Disputed' }
                ]}
              />
            </div>
          </div>
        }
      >
        <Table
          columns={columns}
          data={filtered}
          onRowClick={(row) => navigate(`/district/parcels/${row.id}`)}
        />
      </Card>
    </div>
  );
};

export default DistrictParcels;
