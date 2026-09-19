import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { KPICard } from '../../components/ui/KPICard';
import { Table } from '../../components/ui/Table';
import { getProjectById } from '../../services/projectService';
import { getParcels } from '../../services/parcelService';
import { ArrowLeft, Building2, LandPlot, Coins, Calendar, Download } from 'lucide-react';

export const StateProjectDetails = () => {
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

  if (!project) return <div className="p-8 text-center text-text-muted">Loading state project...</div>;

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/state/projects">
            <Button variant="outline" size="sm" icon={ArrowLeft}>Back to Projects</Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-kobicha text-xs">{project.code}</span>
              <Badge status={project.status}>{project.status?.replace(/_/g, ' ')}</Badge>
            </div>
            <h2 className="text-xl font-bold text-bistre mt-0.5">{project.name}</h2>
          </div>
        </div>
        <Button variant="primary" icon={Download}>Export District Dossier</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Acquisition Footprint" value={`${project.totalAreaRequiredHectares} Ha`} subtitle={`State: ${project.state}`} icon={LandPlot} color="kobicha" />
        <KPICard title="Escrow Deposited" value={formatINR(project.estimatedBudgetINR)} subtitle="Sanctioned Capital" icon={Coins} color="taupe" />
        <KPICard title="Disbursed DBT" value={formatINR(project.disbursedBudgetINR)} subtitle="Released to Beneficiaries" icon={Coins} color="success" />
        <KPICard title="Assigned Collector" value={project.assignedCollector || 'Collector, Pune'} subtitle="Competent LAA Authority" icon={Building2} color="info" />
      </div>

      <Card title="Milestones Progression" subtitle="Statutory section compliance">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {project.milestones?.map((m) => (
            <div key={m.section} className="p-3.5 rounded-xl border border-chamoisee/20 bg-[#FDFBF7] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-bistre">{m.label}</span>
                <Badge status={m.status} size="sm" dot>{m.status}</Badge>
              </div>
              <p className="text-[10px] text-text-muted">{m.date || m.targetDate || 'Pending'}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Survey Parcels List" subtitle="Plots registered under this project">
        <Table columns={parcelColumns} data={parcels} />
      </Card>
    </div>
  );
};

export default StateProjectDetails;
