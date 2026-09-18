import React from 'react';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Camera, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AssignedParcels = () => {
  const parcels = [
    { surveyNumber: '142/1A', village: 'Wagholi', areaAcres: 2.5, landType: 'AGRICULTURAL_IRRIGATED', owner: 'Ramesh Tukaram Patil', status: 'VERIFIED' },
    { surveyNumber: '142/1B', village: 'Wagholi', areaAcres: 1.8, landType: 'AGRICULTURAL_UNIRRIGATED', owner: 'Sunita Dnyaneshwar Shinde', status: 'PENDING_INSPECTION' },
    { surveyNumber: '145/2', village: 'Wagholi', areaAcres: 0.75, landType: 'RESIDENTIAL', owner: 'Kailash Baburao Jagtap', status: 'DISPUTED' }
  ];

  const columns = [
    { title: 'Survey #', key: 'surveyNumber', render: (v) => <span className="font-mono font-bold text-sky-400">{v}</span> },
    { title: 'Village', key: 'village' },
    { title: 'Landowner', key: 'owner', className: 'font-semibold text-white' },
    { title: 'Area', key: 'areaAcres', render: (v) => `${v} Acres` },
    { title: 'Type', key: 'landType' },
    {
      title: 'Verification',
      key: 'status',
      render: (v) => <Badge variant={v === 'VERIFIED' ? 'success' : v === 'DISPUTED' ? 'danger' : 'warning'} dot>{v}</Badge>
    },
    {
      title: 'Action',
      key: 'act',
      render: () => (
        <Link to="/field/inspection">
          <Button size="sm" variant="primary" icon={Camera}>Record Survey</Button>
        </Link>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Assigned Survey Parcels</h2>
        <p className="text-xs text-slate-400">Parcels assigned for physical ground-truth inspection and boundary geotagging</p>
      </div>

      <Card title="Circle Inspection List" subtitle="Haveli Taluka, Pune">
        <Table columns={columns} data={parcels} />
      </Card>
    </div>
  );
};

export default AssignedParcels;
