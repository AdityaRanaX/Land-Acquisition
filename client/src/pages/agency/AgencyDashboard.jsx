import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { KPICard } from '../../components/ui/KPICard';
import { getProjects } from '../../services/projectService';
import { mockProjects } from '../../mock/projects';
;
import { Building2, FolderPlus, LandPlot, Coins, ArrowRight, FileText, CheckCircle2, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AgencyDashboard = () => {
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    getProjects().then(setProjects).catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-bistre tracking-tight">
            Requiring Body Portal: National Highways Authority of India (NHAI)
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            Monitor corridor land requisitions, administrative sanctions, Section 3A/11 gazette notices & escrow funds
          </p>
        </div>
        <Link to="/agency/new-requisition">
          <Button variant="primary" size="sm" className="gap-1.5">
            <FolderPlus className="w-4 h-4" /> Create Requisition Wizard
          </Button>
        </Link>
      </div>

      {/* Agency KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card bodyClassName="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-kobicha/10 text-kobicha">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-text-muted">Total Corridors</p>
              <p className="text-xl font-black text-bistre mt-0.5">{mockProjects.length} Projects</p>
            </div>
          </div>
        </Card>

        <Card bodyClassName="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-status-info/10 text-status-info">
              <LandPlot className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-text-muted">Requisitioned Area</p>
              <p className="text-xl font-black text-bistre mt-0.5">1,250 Ha</p>
            </div>
          </div>
        </Card>

        <Card bodyClassName="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-status-success/10 text-status-success">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-text-muted">Escrow Deposited</p>
              <p className="text-xl font-black text-status-success mt-0.5">₹900.0 Cr</p>
            </div>
          </div>
        </Card>

        <Card bodyClassName="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-kobicha/10 text-kobicha">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-text-muted">Possession Handover</p>
              <p className="text-xl font-black text-bistre mt-0.5">48.2%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Active Corridor Projects */}
      <Card
        title="Active Infrastructure Projects"
        subtitle="Tracking milestone clearances across Collector jurisdictions"
        action={
          <Link to="/agency/projects">
            <Button variant="outline" size="sm" className="gap-1 text-xs">
              View All Corridors <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-chamoisee/20 text-text-muted">
                <th className="py-2.5 px-3">Project Code</th>
                <th className="py-2.5 px-3">Corridor Name</th>
                <th className="py-2.5 px-3">Required Area</th>
                <th className="py-2.5 px-3">Escrow Budget</th>
                <th className="py-2.5 px-3">Current Section Stage</th>
                <th className="py-2.5 px-3">Handover %</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-chamoisee/10">
              {mockProjects.map((proj) => (
                <tr key={proj.id} className="hover:bg-page transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-kobicha">{proj.code}</td>
                  <td className="py-3 px-3">
                    <p className="font-bold text-bistre">{proj.name}</p>
                    <p className="text-[11px] text-text-muted">{proj.state}</p>
                  </td>
                  <td className="py-3 px-3 text-bistre font-semibold">{proj.totalAreaAcres || 480} Ha</td>
                  <td className="py-3 px-3 font-mono text-bistre font-bold">
                    ₹{((proj.totalEstimatedCostINR || 0) / 10000000).toFixed(0)} Cr
                  </td>
                  <td className="py-3 px-3">
                    <Badge status={proj.currentStage} />
                  </td>
                  <td className="py-3 px-3">
                    <div className="w-24 bg-chamoisee/20 rounded-full h-2">
                      <div
                        className="bg-kobicha h-2 rounded-full"
                        style={{ width: `${proj.progressPercentage || 50}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-text-muted font-bold mt-0.5 inline-block">
                      {proj.progressPercentage || 50}% acquired
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Link to="/agency/tracking">
                      <Button variant="outline" size="sm" className="text-[11px] py-1 gap-1">
                        Track <ArrowRight className="w-3 h-3" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AgencyDashboard;
