import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { mockParcels } from '../../mock/parcels';
import {
  Compass,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  Camera,
  ShieldAlert,
  Send
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const FieldVerificationForm = () => {
  const navigate = useNavigate();
  const [selectedParcelId, setSelectedParcelId] = useState(mockParcels[0].id);
  const parcel = mockParcels.find((p) => p.id === selectedParcelId) || mockParcels[0];

  const [formData, setFormData] = useState({
    surveyNumber: parcel.surveyNumber,
    subDivision: parcel.subDivisionNumber || '1A',
    ownerName: parcel.primaryOwnerName,
    groundAreaAcres: String(parcel.areaAcres),
    landClassification: parcel.landType || 'AGRICULTURAL_IRRIGATED',
    gpsLat: '18.57942',
    gpsLng: '73.97825',
    gpsAccuracyM: '1.2',
    structuresPresent: '1 Residential Farmhouse, 2 Pump Sheds',
    treesPresent: '12 Mature Mango Trees, 4 Coconut Palms',
    boundaryDemarcation: 'CONFIRMED_WITH_STONES',
    remarks: 'Owner in peaceful possession. Boundaries align with revenue map. No court stay pending on ground.'
  });

  const [submissionFeedback, setSubmissionFeedback] = useState(null);

  const handleAction = (actionType) => {
    let title = '';
    let msg = '';
    let statusBadge = '';

    if (actionType === 'CONFIRM') {
      title = 'Field Verification Confirmed';
      msg = `Survey No. ${formData.surveyNumber} successfully marked as verified and endorsed by Talathi.`;
      statusBadge = 'VERIFIED';
    } else if (actionType === 'FLAG_DISCREPANCY') {
      title = 'Discrepancy Flagged to SLAO';
      msg = `Discrepancy recorded for Survey No. ${formData.surveyNumber}. Issue escalated to Land Acquisition Collector.`;
      statusBadge = 'DISPUTED';
    } else if (actionType === 'REQUEST_REVERIFY') {
      title = 'Joint Re-Verification Requested';
      msg = `Joint measurement with Requiring Agency (NHAI) requested for boundary correction.`;
      statusBadge = 'PENDING';
    }

    setSubmissionFeedback({ type: actionType, title, msg, statusBadge });
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link to="/field">
          <Button variant="outline" size="sm" className="gap-1 text-xs">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Button>
        </Link>
        <Link to="/field/photos">
          <Button variant="secondary" size="sm" className="gap-1 text-xs">
            <Camera className="w-3.5 h-3.5 text-kobicha" /> Go to Photo Upload <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-black text-bistre tracking-tight">Cadastral Field Verification Form</h1>
        <p className="text-xs text-text-muted mt-0.5">
          Record ground measurements, crop assets, and boundary coordinates on-site
        </p>
      </div>

      {submissionFeedback && (
        <Card bodyClassName="p-4 bg-status-success/10 border-status-success/30 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-bistre text-sm flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-status-success" />
              {submissionFeedback.title}
            </h4>
            <Badge status={submissionFeedback.statusBadge} />
          </div>
          <p className="text-xs text-text-muted">{submissionFeedback.msg}</p>
          <div className="pt-2 flex items-center gap-2">
            <Link to="/field/photos">
              <Button variant="primary" size="sm" className="gap-1 text-xs">
                Proceed to Photo Upload <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSubmissionFeedback(null)}
              className="text-xs"
            >
              Continue Editing
            </Button>
          </div>
        </Card>
      )}

      {/* Parcel Selection Selector */}
      <Card title="Target Survey Parcel">
        <div className="space-y-3">
          <label className="block text-xs font-bold text-bistre">Select Assigned Parcel</label>
          <Select
            value={selectedParcelId}
            onChange={(e) => {
              const pid = e.target.value;
              setSelectedParcelId(pid);
              const p = mockParcels.find((x) => x.id === pid);
              if (p) {
                setFormData({
                  ...formData,
                  surveyNumber: p.surveyNumber,
                  ownerName: p.primaryOwnerName,
                  groundAreaAcres: String(p.areaAcres),
                  landClassification: p.landType
                });
              }
            }}
            options={mockParcels.map((p) => ({
              value: p.id,
              label: `Survey #${p.surveyNumber} — ${p.primaryOwnerName} (${p.areaAcres} Ac, ${p.village})`
            }))}
          />

          <div className="p-3 bg-page rounded-lg border border-chamoisee/20 flex items-center justify-between text-xs">
            <div>
              <span className="text-text-muted">Parcel ID: </span>
              <span className="font-mono font-bold text-kobicha">{parcel.id}</span>
            </div>
            <div>
              <span className="text-text-muted">Status: </span>
              <Badge status={parcel.acquisitionStatus} />
            </div>
          </div>
        </div>
      </Card>

      {/* Ground Truth Data Entry Form */}
      <Card title="1. GPS Coordinates & Boundary Lock">
        <div className="space-y-3">
          <div className="p-3 bg-buff/15 rounded-lg border border-kobicha/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-kobicha" />
              <div>
                <p className="text-xs font-bold text-bistre">Live DGPS / Mobile Fix</p>
                <p className="text-[11px] text-text-muted">Accuracy: ±{formData.gpsAccuracyM} meters (GNSS locked)</p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setFormData({
                  ...formData,
                  gpsLat: '18.57945',
                  gpsLng: '73.97831',
                  gpsAccuracyM: '0.8'
                })
              }
              className="text-xs py-1"
            >
              Refresh Fix
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-bistre mb-1">Center Latitude</label>
              <Input
                value={formData.gpsLat}
                onChange={(e) => setFormData({ ...formData, gpsLat: e.target.value })}
                className="font-mono text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-bistre mb-1">Center Longitude</label>
              <Input
                value={formData.gpsLng}
                onChange={(e) => setFormData({ ...formData, gpsLng: e.target.value })}
                className="font-mono text-xs"
              />
            </div>
          </div>
        </div>
      </Card>

      <Card title="2. Land Particulars & Ground Verification">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-bistre mb-1">Survey Number</label>
              <Input
                value={formData.surveyNumber}
                onChange={(e) => setFormData({ ...formData, surveyNumber: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-bistre mb-1">Sub-Division / Hissa</label>
              <Input
                value={formData.subDivision}
                onChange={(e) => setFormData({ ...formData, subDivision: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-bistre mb-1">Owner / Titleholder Name</label>
              <Input
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-bistre mb-1">Measured Area (Acres)</label>
              <Input
                type="number"
                step="0.01"
                value={formData.groundAreaAcres}
                onChange={(e) => setFormData({ ...formData, groundAreaAcres: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-bistre mb-1">Ground Land Classification</label>
            <Select
              value={formData.landClassification}
              onChange={(e) => setFormData({ ...formData, landClassification: e.target.value })}
              options={[
                { value: 'AGRICULTURAL_IRRIGATED', label: 'Agricultural (Perennially Irrigated - Multi Crop)' },
                { value: 'AGRICULTURAL_UNIRRIGATED', label: 'Agricultural (Unirrigated - Single Crop)' },
                { value: 'COMMERCIAL_INDUSTRIAL', label: 'Commercial / Industrial Non-Agricultural (NA)' },
                { value: 'RESIDENTIAL_GAOTHAN', label: 'Residential / Gaothan Settlement' },
                { value: 'WASTELAND_BARREN', label: 'Barren / Uncultivable Wasteland' }
              ]}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-bistre mb-1">Structures & Wells on Ground</label>
            <Input
              value={formData.structuresPresent}
              onChange={(e) => setFormData({ ...formData, structuresPresent: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-bistre mb-1">Horticulture & Trees Attached</label>
            <Input
              value={formData.treesPresent}
              onChange={(e) => setFormData({ ...formData, treesPresent: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-bistre mb-1">Surveyor Ground Remarks & Findings</label>
            <textarea
              rows={3}
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              className="w-full text-xs p-3 rounded-lg border border-chamoisee/30 bg-page focus:bg-white focus:outline-none focus:ring-1 focus:ring-kobicha"
            />
          </div>
        </div>
      </Card>

      {/* Action Buttons: Confirm / Flag Discrepancy / Request Re-verification */}
      <Card title="3. Revenue Endorsement Action">
        <p className="text-xs text-text-muted mb-4">
          Select the appropriate statutory disposition for Survey #{formData.surveyNumber}:
        </p>

        <div className="space-y-3">
          <Button
            type="button"
            variant="primary"
            onClick={() => handleAction('CONFIRM')}
            className="w-full gap-2 bg-status-success hover:bg-status-success/90 py-2.5"
          >
            <CheckCircle2 className="w-4 h-4" /> Confirm & Endorse Ground Verification
          </Button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleAction('FLAG_DISCREPANCY')}
              className="gap-2 border-status-danger text-status-danger hover:bg-status-danger/10 py-2"
            >
              <AlertTriangle className="w-4 h-4" /> Flag Discrepancy to SLAO
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={() => handleAction('REQUEST_REVERIFY')}
              className="gap-2 py-2"
            >
              <RefreshCw className="w-4 h-4" /> Request Joint Re-Verification
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FieldVerificationForm;
