import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { mockDocuments } from '../../mock/documents';
import { FileText, Download, Upload, CheckCircle2, Search, ExternalLink } from 'lucide-react';

export const AgencyDocuments = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-bistre tracking-tight">Gazettes & Statutory Dossiers</h1>
          <p className="text-xs text-text-muted mt-0.5">
            Central repository of Extra-Ordinary Gazette Notifications (Sec 3A, 3D, 11, 19), AA&ES orders, and SIA publications
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" className="gap-1.5">
            <Upload className="w-4 h-4" /> Upload Gazette Copy
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            title: 'Section 11 Preliminary Notification Gazette (E-Gazette #412)',
            code: 'GAZ-MH-PUN-2026-11',
            type: 'Official Gazette Notification',
            date: 'May 02, 2026',
            size: '2.4 MB',
            status: 'VERIFIED'
          },
          {
            title: 'Social Impact Assessment (SIA) Final Endorsement Report',
            code: 'SIA-PUN-BLR-004',
            type: 'SIA Study Report',
            date: 'Jan 15, 2026',
            size: '14.8 MB',
            status: 'VERIFIED'
          },
          {
            title: 'Administrative Approval & Expenditure Sanction (AA&ES)',
            code: 'MoRTH-EXP-2025-99',
            type: 'Sanction Order',
            date: 'Nov 12, 2025',
            size: '1.1 MB',
            status: 'VERIFIED'
          },
          {
            title: 'Draft Section 19 Acquisition Declaration (Pending Publication)',
            code: 'SEC19-DRAFT-PUN-4A',
            type: 'Statutory Declaration',
            date: 'Sept 14, 2026',
            size: '3.6 MB',
            status: 'PENDING'
          }
        ].map((item, idx) => (
          <Card key={idx} bodyClassName="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-kobicha/10 text-kobicha shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-bistre text-xs">{item.title}</h4>
                  <p className="font-mono text-[10px] text-kobicha mt-0.5">{item.code}</p>
                  <p className="text-[11px] text-text-muted mt-1">Published: {item.date} • {item.size}</p>
                </div>
              </div>
              <Badge status={item.status} />
            </div>

            <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-chamoisee/15">
              <Button variant="outline" size="sm" className="text-xs py-1 gap-1">
                <ExternalLink className="w-3 h-3" /> Preview
              </Button>
              <Button variant="secondary" size="sm" className="text-xs py-1 gap-1">
                <Download className="w-3 h-3" /> Download PDF
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AgencyDocuments;
