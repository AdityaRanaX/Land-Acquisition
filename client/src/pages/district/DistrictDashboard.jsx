import React, { useState, useEffect } from 'react';
import { KPICard } from '../../components/ui/KPICard';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { GISMap } from '../../components/gis/GISMap';
import { DelayRadar } from '../../components/shared/DelayRadar';
import { WhatIfSimulator } from '../../components/shared/WhatIfSimulator';
import { useGIS } from '../../hooks/useGIS';
import { Scale, Users, LandPlot, FileText, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import apiClient from '../../services/api/apiClient';

export const DistrictDashboard = () => {
  const { geoJsonData, stats, setSelectedParcel } = useGIS();
  const [parcels, setParcels] = useState([]);

  useEffect(() => {
    const fetchParcels = async () => {
      try {
        const res = await apiClient.get('/parcels');
        if (res.data?.data) setParcels(res.data.data);
      } catch (e) {
        setParcels([
          { _id: '1', surveyNumber: '142/1A', village: 'Wagholi', areaAcres: 2.5, primaryOwnerName: 'Ramesh Tukaram Patil', acquisitionStatus: 'VALUATION_COMPLETED' },
          { _id: '2', surveyNumber: '142/1B', village: 'Wagholi', areaAcres: 1.8, primaryOwnerName: 'Sunita Dnyaneshwar Shinde', acquisitionStatus: 'NOTIFIED_SEC_11' },
          { _id: '3', surveyNumber: '145/2', village: 'Wagholi', areaAcres: 0.75, primaryOwnerName: 'Kailash Baburao Jagtap', acquisitionStatus: 'DISPUTED' }
        ]);
      }
    };
    fetchParcels();
  }, []);

  const parcelColumns = [
    { title: 'Survey #', key: 'surveyNumber', render: (v) => <span className="font-mono font-bold text-sky-400">{v}</span> },
    { title: 'Village', key: 'village' },
    { title: 'Primary Owner', key: 'primaryOwnerName', className: 'font-semibold text-white' },
    { title: 'Area (Acres)', key: 'areaAcres' },
    {
      title: 'Status',
      key: 'acquisitionStatus',
      render: (v) => (
        <Badge variant={v === 'VALUATION_COMPLETED' ? 'success' : v === 'DISPUTED' ? 'danger' : 'primary'}>
          {v?.replace(/_/g, ' ')}
        </Badge>
      )
    },
    {
      title: 'Action',
      key: 'act',
      render: (_, row) => (
        <Link to="/district/valuation">
          <Button size="sm" variant="ghost" icon={ArrowRight}>Valuation</Button>
        </Link>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">District Land Acquisition Authority (Pune)</h2>
          <p className="text-xs text-slate-400">Office of District Collector & Competent Authority (LARR)</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/district/awards">
            <Button variant="success" icon={Scale}>Pronounce Section 23 Award</Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="District Parcels" value={parcels.length || 3} subtitle="Cadastral boundaries mapped" icon={LandPlot} color="sky" />
        <KPICard title="SIA Completed" value="100%" subtitle="Social Impact Clearance approved" icon={Users} color="emerald" />
        <KPICard title="Awards Pronounced" value="1 Award" subtitle="Total: ₹2.93 Cr sanctioned" icon={Scale} color="purple" />
        <KPICard title="Disputed Parcels" value="1 Case" subtitle="Boundary hearing pending" icon={AlertTriangle} color="amber" />
      </div>

      {/* GIS Cadastral Map */}
      <Card title="District Cadastral GIS & Valuation Layers" subtitle="Interactive parcel selection & ground truth review">
        <GISMap
          features={geoJsonData?.features || []}
          stats={stats}
          onSelectParcel={(p) => setSelectedParcel(p)}
          height="420px"
        />
      </Card>

      {/* Grid: Parcels Table & Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card title="Acquisition Parcels Queue" subtitle="Wagholi Circle, Haveli Taluka">
            <Table columns={parcelColumns} data={parcels} />
          </Card>
        </div>
        <div>
          <DelayRadar />
        </div>
      </div>
    </div>
  );
};

export default DistrictDashboard;
