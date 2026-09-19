import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Eye, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DistrictOverview = () => {
  const [selectedDistrict, setSelectedDistrict] = useState('Pune');

  const talukas = [
    { taluka: 'Haveli', villages: 12, parcels: 240, areaAcres: 620.5, valuationDone: '85%', collectorStatus: 'Section 19 Declared' },
    { taluka: 'Khed', villages: 8, parcels: 180, areaAcres: 440.0, valuationDone: '60%', collectorStatus: 'Section 15 Hearings' },
    { taluka: 'Maval', villages: 6, parcels: 110, areaAcres: 290.2, valuationDone: '90%', collectorStatus: 'Award Pronounced' },
    { taluka: 'Shirur', villages: 5, parcels: 95, areaAcres: 210.0, valuationDone: '40%', collectorStatus: 'Section 11 Published' }
  ];

  const columns = [
    { title: 'Taluka / Sub-Division', key: 'taluka', className: 'font-bold text-bistre' },
    { title: 'Notified Villages', key: 'villages' },
    { title: 'Total Parcels', key: 'parcels' },
    { title: 'Area (Acres)', key: 'areaAcres' },
    {
      title: 'Valuation Progress',
      key: 'valuationDone',
      render: (v) => <span className="font-bold text-[#4D5A34]">{v}</span>
    },
    {
      title: 'Statutory Stage',
      key: 'collectorStatus',
      render: (v) => <Badge status={v}>{v}</Badge>
    },
    {
      title: 'Action',
      key: 'act',
      render: () => (
        <Link to="/district">
          <Button size="sm" variant="outline" icon={Eye}>District View</Button>
        </Link>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-bistre">District-Level Acquisition Breakdown</h2>
          <p className="text-xs text-text-muted">Sub-divisional and taluka-level progress for {selectedDistrict} District</p>
        </div>
        <div className="w-56">
          <Select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            options={[
              { value: 'Pune', label: 'Pune District' },
              { value: 'Satara', label: 'Satara District' },
              { value: 'Nashik', label: 'Nashik District' }
            ]}
          />
        </div>
      </div>

      <Card title={`Taluka Acquisition Matrix - ${selectedDistrict} District`} subtitle="Talathi circles, survey numbers and revenue extract status">
        <Table columns={columns} data={talukas} />
      </Card>
    </div>
  );
};

export default DistrictOverview;
