import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Scale, CheckCircle2, Download, Printer, ShieldCheck } from 'lucide-react';
import apiClient from '../../services/api/apiClient';

export const AwardGeneration = () => {
  const [awards, setAwards] = useState([]);

  useEffect(() => {
    const fetchAwards = async () => {
      try {
        const res = await apiClient.get('/compensation');
        if (res.data?.data) setAwards(res.data.data);
      } catch (e) {
        setAwards([
          {
            _id: 'a1',
            beneficiaryName: 'Ramesh Tukaram Patil',
            parcel: { surveyNumber: '142/1A', village: 'Wagholi', areaAcres: 2.5 },
            basicLandValue: 8750000,
            multipliedLandValue: 13125000,
            solatiumAmount: 14295000,
            interest12PercentAdditionalValue: 776506,
            totalGrossAwardINR: 29366506,
            disbursementStatus: 'AWARD_APPROVED'
          }
        ]);
      }
    };
    fetchAwards();
  }, []);

  const formatINR = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);

  const columns = [
    { title: 'Beneficiary Landowner', key: 'beneficiaryName', className: 'font-semibold text-white' },
    {
      title: 'Survey # / Village',
      key: 'parcel',
      render: (p) => (p ? `${p.surveyNumber} (${p.village})` : 'N/A')
    },
    {
      title: 'Acquired Area',
      key: 'parcel',
      render: (p) => (p ? `${p.areaAcres} Acres` : 'N/A')
    },
    {
      title: 'Solatium 100% (Sec 30)',
      key: 'solatiumAmount',
      render: (v) => <span className="font-semibold text-amber-400">{formatINR(v)}</span>
    },
    {
      title: 'Total Gross Award (Sec 23)',
      key: 'totalGrossAwardINR',
      render: (v) => <span className="font-bold text-emerald-400">{formatINR(v)}</span>
    },
    {
      title: 'Award Status',
      key: 'disbursementStatus',
      render: (v) => <Badge variant="success" dot>{v}</Badge>
    },
    {
      title: 'Action',
      key: 'act',
      render: () => (
        <div className="flex items-center gap-1.5">
          <Button size="sm" variant="secondary" icon={Printer}>Print Notice</Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Section 23 & 30 Statutory Award Pronouncement</h2>
          <p className="text-xs text-slate-400">Pronounce and sign legal award notices with 100% Solatium & 12% Interest</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="primary" icon={Scale}>Pronounce New Award</Button>
        </div>
      </div>

      <Card title="Pronounced Schedule I Compensation Awards" subtitle="Legally binding determinations under RFCTLARR Act">
        <Table columns={columns} data={awards} />
      </Card>
    </div>
  );
};

export default AwardGeneration;
