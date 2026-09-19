import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { KPICard } from '../../components/ui/KPICard';
import { Table } from '../../components/ui/Table';
import { getProjectById } from '../../services/projectService';
import { getParcels } from '../../services/parcelService';
import { ArrowLeft, Building2, LandPlot, Coins, AlertTriangle, Calendar, CheckCircle2, FileText, Download } from 'lucide-react';

export const CentralProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [parcels, setParcels] = useState([]);

  useEffect(() => {
    getProjectById(id).then((p) => {
      setProject(p);
      if (p) {
        getParcels({ projectId: p.id }).then(setParcels);
      }
    });
  }, [id]);

  if (!project) {
    return <div className="p-8 text-center text-text-muted">Loading project details...</div>;
  }

  const formatINR = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);

  const parcelColumns = [
    { title: 'Survey #', key: 'surveyNumber', render: (v) => <span className="font-mono font-bold text-kobicha">{v}</span> },
    { title: 'Village', key: 'village' },
    { title: 'Primary Landowner', key: 'primaryOwnerName', className: 'font-bold text-bistre' },
    { title: 'Area (Acres)', key: 'areaAcres' },
    {
      title: 'Status',
      key: 'acquisitionStatus',
      render: (v) => <Badge status={v}>{v?.replace(/_/g, ' ')}</Badge>
    }
  ];

  return (
    <div className="space-y-6">
      {/* Back Button & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/central/projects">
            <Button variant="outline" size="sm" icon={ArrowLeft}>Back to Projects</Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-kobicha text-xs">{project.code}</span>
              <Badge status={project.status}>{project.status?.replace(/_/g, ' ')}</Badge>
              <Badge status={project.riskLevel} dot>{project.riskLevel} Risk</Badge>
            </div>
            <h2 className="text-xl font-bold text-bistre mt-0.5">{project.name}</h2>
          </div>
        </div>
        <Button variant="primary" icon={Download}>Export Project Dossier</Button>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Area Required" value={`${project.totalAreaRequiredHectares} Ha`} subtitle="Across Pune & Satara" icon={LandPlot} color="kobicha" />
        <KPICard title="Sanctioned Outlay" value={formatINR(project.estimatedBudgetINR)} subtitle="Approved by Central Committee" icon={Coins} color="taupe" />
        <KPICard title="Disbursed DBT" value={formatINR(project.disbursedBudgetINR)} subtitle="Direct to Landowner Accounts" icon={Coins} color="success" />
        <KPICard title="Affected Landowners" value={project.beneficiaryCount || 1420} subtitle="Schedule I & II Beneficiaries" icon={Building2} color="info" />
      </div>

      {/* Statutory Milestone Timeline */}
      <Card title="RFCTLARR Statutory Milestone Workflow" subtitle="Legal progression through mandatory Sections 4, 6, 11, 15, 19, 23, 31 & 38">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {project.milestones?.map((m, idx) => (
            <div
              key={m.section}
              className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-2 ${
                m.status === 'COMPLETED'
                  ? 'bg-[#F9F6F0] border-chamoisee/30'
                  : m.status === 'IN_PROGRESS'
                  ? 'bg-buff/15 border-kobicha/40 shadow-sm'
                  : 'bg-surface border-chamoisee/15 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-chamoisee uppercase">Step {idx + 1}</span>
                  <Badge status={m.status} size="sm" dot>{m.status}</Badge>
                </div>
                <h4 className="text-xs font-bold text-bistre mt-1">{m.label}</h4>
                {m.gazette && <p className="text-[10px] font-mono text-kobicha mt-0.5">Gazette: {m.gazette}</p>}
                {m.remarks && <p className="text-[10px] text-text-muted mt-0.5 leading-tight">{m.remarks}</p>}
              </div>
              <div className="pt-2 border-t border-chamoisee/15 text-[10px] text-text-muted flex items-center gap-1">
                <Calendar className="w-3 h-3 text-chamoisee" />
                <span>{m.date || m.targetDate || 'Pending'}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Cadastral Parcels Linked */}
      <Card title="Acquisition Parcels Queue" subtitle={`Mapped cadastral plots for ${project.name}`}>
        <Table columns={parcelColumns} data={parcels} />
      </Card>
    </div>
  );
};

export default CentralProjectDetails;
