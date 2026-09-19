import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { getNationalStats } from '../../services/reportService';
import { FileText, Download, Printer, Filter } from 'lucide-react';

export const NationalReports = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getNationalStats().then(setStats);
  }, []);

  const reports = [
    { id: 'REP-01', title: 'National Land Acquisition Annual Ledger (FY24)', period: '2023-2024', size: '4.8 MB', date: '15-Sep-2024', type: 'Annual Summary' },
    { id: 'REP-02', title: 'Schedule I Solatium & Multiplier Audit Summary', period: 'Q1-Q2 FY24', size: '2.1 MB', date: '01-Aug-2024', type: 'Financial Audit' },
    { id: 'REP-03', title: 'State-Wise SIA Clearance & Expert Group Log', period: 'Past 12 Months', size: '3.4 MB', date: '10-Jul-2024', type: 'SIA Report' },
    { id: 'REP-04', title: 'Section 19 Declaration Gazette Compilation', period: 'Monthly Gazette', size: '6.2 MB', date: '01-Sep-2024', type: 'Gazette Compilation' }
  ];

  const columns = [
    { title: 'Report Title', key: 'title', className: 'font-bold text-bistre' },
    { title: 'Reporting Period', key: 'period' },
    { title: 'Type', key: 'type', render: (v) => <Badge variant="taupe">{v}</Badge> },
    { title: 'File Size', key: 'size' },
    { title: 'Published Date', key: 'date' },
    {
      title: 'Action',
      key: 'act',
      render: () => (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" icon={Download}>Download PDF</Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-bistre">National Statutory Reports & Gazette Archives</h2>
          <p className="text-xs text-text-muted">DoLR official parliamentary reports, expenditure audits, and RFCTLARR compliance indices</p>
        </div>
        <Button variant="primary" icon={Printer}>Print Consolidated Ledger</Button>
      </div>

      <Card title="Available Official Reports & Publications" subtitle="Download verified administrative records">
        <Table columns={columns} data={reports} />
      </Card>
    </div>
  );
};

export default NationalReports;
