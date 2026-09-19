import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import {
  FolderPlus,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Upload,
  MapPin,
  Building2,
  FileCheck,
  Send,
  HelpCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const NewRequisition = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    projectName: 'Nashik-Surat High Speed Economic Corridor (Spur)',
    projectCode: 'NHAI-NSK-SUR-007',
    agencyType: 'NHAI (National Highways Authority of India)',
    state: 'Maharashtra',
    district: 'Nashik',
    totalAreaHa: '320.5',
    talukas: 'Dindori, Surgana, Peth',
    villagesCount: '14',
    alignmentKml: 'nashik_surat_spur_v2.kml',
    estimatedBudgetCr: '640.00',
    statutoryAct: 'National Highways Act 1956 / RFCTLARR 2013'
  });

  const steps = [
    { num: 1, title: 'Project Details' },
    { num: 2, title: 'Land & Circle Scope' },
    { num: 3, title: 'GIS Alignment' },
    { num: 4, title: 'Statutory Uploads' },
    { num: 5, title: 'Review & Submit' }
  ];

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      setSubmitted(true);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <Card bodyClassName="p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-status-success/15 text-status-success rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-bistre">Requisition Proposal Submitted!</h2>
          <p className="text-xs text-text-muted max-w-md mx-auto">
            Your land acquisition requisition has been transmitted to the District Collector Office (Nashik). Reference No:{' '}
            <span className="font-mono font-bold text-kobicha">REQ-2026-MH-NSK-007</span>
          </p>

          <div className="p-4 bg-page rounded-lg border border-chamoisee/20 text-xs text-left max-w-md mx-auto space-y-2">
            <div className="flex justify-between">
              <span className="text-text-muted">Corridor:</span>
              <span className="font-bold text-bistre">{formData.projectName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Estimated Area:</span>
              <span className="font-bold text-bistre">{formData.totalAreaHa} Hectares</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Collector Escrow:</span>
              <span className="font-mono font-bold text-status-success">₹{formData.estimatedBudgetCr} Cr</span>
            </div>
          </div>

          <div className="pt-4 flex justify-center gap-3">
            <Link to="/agency">
              <Button variant="outline" size="sm">Return to Agency Dashboard</Button>
            </Link>
            <Link to="/agency/tracking">
              <Button variant="primary" size="sm">Track Submission Workflow</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-bistre tracking-tight">Create Land Requisition Proposal</h1>
        <p className="text-xs text-text-muted mt-0.5">
          5-Step Statutory Requisition Wizard for Requiring Bodies under RFCTLARR / NH Act
        </p>
      </div>

      {/* Step Progress Header */}
      <div className="grid grid-cols-5 gap-2">
        {steps.map((s) => (
          <div
            key={s.num}
            onClick={() => setCurrentStep(s.num)}
            className={`cursor-pointer p-2.5 rounded-lg border text-center transition-all ${
              currentStep === s.num
                ? 'bg-kobicha text-white border-kobicha shadow-sm'
                : currentStep > s.num
                ? 'bg-status-success/15 border-status-success/30 text-bistre'
                : 'bg-page border-chamoisee/20 text-text-muted'
            }`}
          >
            <p className="text-[10px] uppercase font-bold">Step {s.num}</p>
            <p className="text-xs font-semibold truncate mt-0.5">{s.title}</p>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card title={`Step ${currentStep}: ${steps[currentStep - 1].title}`}>
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-bistre mb-1">Project Name</label>
                <Input
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-bistre mb-1">Project Reference Code</label>
                <Input
                  value={formData.projectCode}
                  onChange={(e) => setFormData({ ...formData, projectCode: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-bistre mb-1">Requiring Authority</label>
                <Input
                  value={formData.agencyType}
                  onChange={(e) => setFormData({ ...formData, agencyType: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-bistre mb-1">Statutory Act Applicable</label>
                <Select
                  value={formData.statutoryAct}
                  onChange={(e) => setFormData({ ...formData, statutoryAct: e.target.value })}
                  options={[
                    { value: 'National Highways Act 1956 / RFCTLARR 2013', label: 'National Highways Act 1956' },
                    { value: 'RFCTLARR Act 2013 (Section 11)', label: 'RFCTLARR Act 2013' },
                    { value: 'Railways Act 1989', label: 'Railways Act 1989' }
                  ]}
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-bistre mb-1">Target State</label>
                <Input value={formData.state} disabled />
              </div>
              <div>
                <label className="block text-xs font-bold text-bistre mb-1">Target District</label>
                <Input
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-bistre mb-1">Estimated Area (Hectares)</label>
                <Input
                  type="number"
                  value={formData.totalAreaHa}
                  onChange={(e) => setFormData({ ...formData, totalAreaHa: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-bistre mb-1">Talukas Covered</label>
                <Input
                  value={formData.talukas}
                  onChange={(e) => setFormData({ ...formData, talukas: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-bistre mb-1">Estimated Village Count</label>
                <Input
                  value={formData.villagesCount}
                  onChange={(e) => setFormData({ ...formData, villagesCount: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <p className="text-xs text-text-muted">
              Upload digitized corridor alignment in GeoJSON, KML, or ESRI Shapefile format to trigger automated cadastral parcel overlays.
            </p>

            <div className="border-2 border-dashed border-chamoisee/40 rounded-xl p-8 text-center bg-page hover:bg-buff/10 transition-colors">
              <Upload className="w-8 h-8 text-kobicha mx-auto mb-2" />
              <p className="font-bold text-bistre text-sm">Upload Alignment Shapefile / KML</p>
              <p className="text-xs text-text-muted mt-1">Accepted formats: .kml, .geojson, .shp, .zip</p>
              <p className="text-xs font-mono text-kobicha font-bold mt-2">
                Active file attached: {formData.alignmentKml} (3.4 MB)
              </p>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-3">
            <p className="text-xs text-text-muted mb-2">
              Mandatory statutory documents required by the Collectorate for initiating Section 4 Social Impact Assessment:
            </p>

            {[
              { title: 'Administrative Approval & Expenditure Sanction (AA&ES)', file: 'MoRTH_Sanction_Order_2026_09.pdf', size: '1.2 MB' },
              { title: 'Detailed Project Report (DPR) Land Schedule Chapter', file: 'DPR_Land_Schedule_Nashik_Spur.pdf', size: '8.5 MB' },
              { title: 'Environmental & Forest Clearance NOC (Parivesh)', file: 'MoEFCC_Stage1_NOC_Nashik.pdf', size: '2.1 MB' }
            ].map((doc, idx) => (
              <div key={idx} className="p-3 bg-page rounded-lg border border-chamoisee/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileCheck className="w-5 h-5 text-status-success" />
                  <div>
                    <h5 className="font-bold text-bistre text-xs">{doc.title}</h5>
                    <p className="text-[11px] text-text-muted font-mono">{doc.file} • {doc.size}</p>
                  </div>
                </div>
                <Badge status="VERIFIED" />
              </div>
            ))}
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-4">
            <div className="p-4 bg-page rounded-lg border border-chamoisee/20 space-y-3 text-xs">
              <h4 className="font-bold text-bistre text-sm uppercase tracking-wider">Requisition Summary</h4>
              <dl className="grid grid-cols-2 gap-y-3">
                <div>
                  <dt className="text-text-muted">Corridor Name</dt>
                  <dd className="font-bold text-bistre">{formData.projectName}</dd>
                </div>
                <div>
                  <dt className="text-text-muted">Project Code</dt>
                  <dd className="font-mono font-bold text-kobicha">{formData.projectCode}</dd>
                </div>
                <div>
                  <dt className="text-text-muted">Total Land Area</dt>
                  <dd className="font-bold text-bistre">{formData.totalAreaHa} Ha across {formData.villagesCount} villages</dd>
                </div>
                <div>
                  <dt className="text-text-muted">Estimated Cost</dt>
                  <dd className="font-bold text-status-success">₹{formData.estimatedBudgetCr} Cr</dd>
                </div>
              </dl>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-chamoisee/15 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleNext}
            className="gap-1"
          >
            {currentStep === 5 ? (
              <>
                <Send className="w-4 h-4" /> Submit Requisition
              </>
            ) : (
              <>
                Next Step <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default NewRequisition;
