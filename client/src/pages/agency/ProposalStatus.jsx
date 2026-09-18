import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { FileCheck, Download, ExternalLink } from 'lucide-react';

export const ProposalStatus = () => {
  const proposals = [
    { code: 'NHAI-PUNE-BLR-001', name: 'Pune-Bengaluru Green Expressway (Pkg 4A)', collector: 'Dr. Suhas Diwase (IAS)', lastUpdated: '10-May-2024', status: 'SECTION_19_DECLARED', escrowProgress: '72%' },
    { code: 'NHAI-NASHIK-SUR-004', name: 'Surat-Nashik Industrial Spur Requisition', collector: 'Collector, Nashik', lastUpdated: '02-Aug-2024', status: 'PROPOSAL_SUBMITTED', escrowProgress: '0%' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Requisition Proposal Pipeline & Tracking</h2>
        <p className="text-xs text-slate-400">Track Collector review, gazette publications, and possession handover timelines</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {proposals.map((p) => (
          <Card key={p.code} title={p.name} subtitle={`Project Code: ${p.code}`} action={<Badge variant="primary">{p.status}</Badge>}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-slate-300">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Assigned Collector</span>
                <span className="font-semibold text-white">{p.collector}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Last Gazette Update</span>
                <span className="font-semibold">{p.lastUpdated}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Escrow Funded</span>
                <span className="font-bold text-emerald-400">{p.escrowProgress}</span>
              </div>
              <div className="flex items-center justify-end">
                <Button size="sm" variant="secondary" icon={ExternalLink}>View Gazette Records</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProposalStatus;
