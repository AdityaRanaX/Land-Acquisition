import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { FileText, Download, CheckCircle2, ExternalLink, ShieldCheck } from 'lucide-react';

export const CitizenDocuments = () => {
  const docs = [
    {
      title: 'Section 11 Preliminary Notification (Form 4)',
      date: 'May 02, 2026',
      file: 'Sec11_Notice_Wagholi_142_1A.pdf',
      size: '1.4 MB',
      status: 'VERIFIED'
    },
    {
      title: 'Section 19 Final Acquisition Declaration',
      date: 'Aug 14, 2026',
      file: 'Sec19_Declaration_Pune_Expressway.pdf',
      size: '2.1 MB',
      status: 'VERIFIED'
    },
    {
      title: 'Joint Field Measurement & Valuation Sheet',
      date: 'Sept 12, 2026',
      file: 'Joint_Measurement_Patil_Wagholi.pdf',
      size: '3.8 MB',
      status: 'VERIFIED'
    },
    {
      title: 'PFMS Direct Benefit Transfer Mandate Form',
      date: 'Sept 15, 2026',
      file: 'PFMS_DBT_Mandate_Ack.pdf',
      size: '0.8 MB',
      status: 'VERIFIED'
    }
  ];

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-bistre tracking-tight">Notices, Gazettes & Certificates</h1>
        <p className="text-xs text-text-muted mt-0.5">
          Official statutory notices and verified identity records for Survey #142/1A
        </p>
      </div>

      <div className="space-y-3">
        {docs.map((doc, idx) => (
          <Card key={idx} bodyClassName="p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-kobicha/10 text-kobicha shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-bistre text-xs">{doc.title}</h4>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    Issued: {doc.date} • <span className="font-mono">{doc.file}</span> ({doc.size})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="text-xs py-1 gap-1">
                  <ExternalLink className="w-3.5 h-3.5" /> View
                </Button>
                <Button variant="secondary" size="sm" className="text-xs py-1 gap-1">
                  <Download className="w-3.5 h-3.5" /> Download
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CitizenDocuments;
