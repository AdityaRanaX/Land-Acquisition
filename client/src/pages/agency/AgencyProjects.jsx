import React, { useEffect,  useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { getProjects } from '../../services/projectService';
import { mockProjects } from '../../mock/projects';
;
import { Building2, Search, ArrowRight, FolderPlus, MapPin, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AgencyProjects = () => {
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    getProjects().then(setProjects).catch(console.error);
  }, []);

  const [searchTerm, setSearchTerm] = useState('');

  const filtered = mockProjects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-bistre tracking-tight">NHAI Requisitioned Corridors</h1>
          <p className="text-xs text-text-muted mt-0.5">
            Full inventory of alignment proposals submitted for revenue department acquisition
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/agency/new-requisition">
            <Button variant="primary" size="sm" className="gap-1.5">
              <FolderPlus className="w-4 h-4" /> New Requisition Proposal
            </Button>
          </Link>
        </div>
      </div>

      <div className="w-full sm:w-80">
        <Input
          placeholder="Search by project name or code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="text-xs py-2"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((proj) => (
          <Card key={proj.id} title={proj.name} subtitle={proj.code}>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-muted">Current Statutory Stage:</span>
                <Badge status={proj.currentStage} />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs p-3 bg-page rounded-lg border border-chamoisee/15">
                <div>
                  <span className="text-text-muted">Target Alignment:</span>
                  <p className="font-bold text-bistre mt-0.5">{proj.state}</p>
                </div>
                <div>
                  <span className="text-text-muted">Acquisition Budget:</span>
                  <p className="font-bold text-bistre mt-0.5">
                    ₹{((proj.totalEstimatedCostINR || 0) / 10000000).toFixed(0)} Cr
                  </p>
                </div>
                <div>
                  <span className="text-text-muted">Parcels Affected:</span>
                  <p className="font-bold text-bistre mt-0.5">185 Plots</p>
                </div>
                <div>
                  <span className="text-text-muted">Target Handover:</span>
                  <p className="font-bold text-bistre mt-0.5">{proj.targetCompletionDate || 'Dec 2026'}</p>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-text-muted">Acquisition Progress</span>
                  <span className="font-bold text-bistre">{proj.progressPercentage || 50}%</span>
                </div>
                <div className="w-full bg-chamoisee/20 rounded-full h-2">
                  <div
                    className="bg-kobicha h-2 rounded-full"
                    style={{ width: `${proj.progressPercentage || 50}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-chamoisee/15">
                <Link to="/agency/parcels">
                  <Button variant="outline" size="sm" className="text-xs">
                    View Parcels
                  </Button>
                </Link>
                <Link to="/agency/tracking">
                  <Button variant="primary" size="sm" className="text-xs gap-1">
                    Track Milestones <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AgencyProjects;
