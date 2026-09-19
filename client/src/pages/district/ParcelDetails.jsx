import React, { useEffect,  useState } from 'react';
import { useParams, Link } from 'react-router-dom';
;
;
;
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { getParcels } from '../../services/parcelService';
import { getFamilies } from '../../services/familyService';
import { mockParcels } from '../../mock/parcels';
import { mockFamilies } from '../../mock/families';
import { mockCompensation } from '../../mock/compensation';
import {
  ArrowLeft,
  MapPin,
  LandPlot,
  User,
  Phone,
  Calculator,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Camera,
  Layers,
  Clock
} from 'lucide-react';

export const ParcelDetails = () => {
  const [parcels, setParcels] = useState([]);
  useEffect(() => {
    getParcels().then(setParcels).catch(console.error);
  }, []);
  const [families, setFamilies] = useState([]);
  useEffect(() => {
    getFamilies().then(setFamilies).catch(console.error);
  }, []);

  const { id } = useParams();
  const parcel = mockParcels.find((p) => p.id === id) || mockParcels[0];
  const family = mockFamilies.find((f) => f.familyId === parcel?.familyId);
  const comp = mockCompensation.find((c) => c.parcelId === parcel?.id);

  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/district/parcels">
            <Button variant="outline" size="sm" className="gap-1">
              <ArrowLeft className="w-4 h-4" /> Back to Parcels
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-bistre tracking-tight">
                Survey No. {parcel.surveyNumber}
              </h1>
              <Badge status={parcel.acquisitionStatus} />
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              Parcel ID: <span className="font-mono font-bold text-kobicha">{parcel.id}</span> • {parcel.village}, {parcel.taluka}, {parcel.district}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/district/officers">
            <Button variant="secondary" size="sm">Reassign Surveyor</Button>
          </Link>
          <Link to="/district/compensation">
            <Button variant="primary" size="sm">Generate Section 23 Award</Button>
          </Link>
        </div>
      </div>

      {/* Quick Info Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card bodyClassName="p-4">
          <p className="text-[10px] uppercase font-bold text-text-muted">Total Area</p>
          <p className="text-xl font-black text-bistre mt-0.5">{parcel.areaAcres} Acres</p>
          <p className="text-xs text-chamoisee">({parcel.areaHectares} Hectares)</p>
        </Card>
        <Card bodyClassName="p-4">
          <p className="text-[10px] uppercase font-bold text-text-muted">Land Classification</p>
          <p className="text-sm font-bold text-bistre mt-0.5">{parcel.landType?.replace(/_/g, ' ')}</p>
          <p className="text-xs text-text-muted capitalize">{parcel.urbanOrRural} Zone</p>
        </Card>
        <Card bodyClassName="p-4">
          <p className="text-[10px] uppercase font-bold text-text-muted">Primary Titleholder</p>
          <p className="text-sm font-bold text-bistre mt-0.5 truncate">{parcel.primaryOwnerName}</p>
          <p className="text-xs text-text-muted">{parcel.primaryOwnerPhone}</p>
        </Card>
        <Card bodyClassName="p-4">
          <p className="text-[10px] uppercase font-bold text-text-muted">Total Solatium Valuation</p>
          <p className="text-xl font-black text-status-success mt-0.5">
            ₹{((parcel.totalValuationINR || 0) / 100000).toFixed(2)} L
          </p>
          <p className="text-xs text-text-muted">RFCTLARR 2013 Formula</p>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-chamoisee/20 gap-6 text-sm font-medium">
        {[
          { key: 'overview', label: 'Parcel Details & Ownership' },
          { key: 'field', label: 'Field Verification Record' },
          { key: 'valuation', label: 'RFCTLARR Valuation Breakdown' },
          { key: 'family', label: 'Affected Family & R&R Schedule' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-3 font-semibold transition-all border-b-2 ${
              activeTab === tab.key
                ? 'border-kobicha text-kobicha font-bold'
                : 'border-transparent text-text-muted hover:text-bistre'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Cadastral & Geographic Identifiers">
            <dl className="grid grid-cols-2 gap-y-4 text-xs">
              <div>
                <dt className="text-text-muted">Project Affiliation</dt>
                <dd className="font-bold text-bistre mt-0.5">{parcel.projectName}</dd>
              </div>
              <div>
                <dt className="text-text-muted">Project Code</dt>
                <dd className="font-mono font-bold text-kobicha mt-0.5">{parcel.projectCode}</dd>
              </div>
              <div>
                <dt className="text-text-muted">Survey & Sub-Division</dt>
                <dd className="font-bold text-bistre mt-0.5">{parcel.surveyNumber} ({parcel.subDivisionNumber})</dd>
              </div>
              <div>
                <dt className="text-text-muted">Taluka & Village</dt>
                <dd className="font-bold text-bistre mt-0.5">{parcel.taluka}, {parcel.village}</dd>
              </div>
              <div>
                <dt className="text-text-muted">Assigned Revenue Surveyor</dt>
                <dd className="font-bold text-bistre mt-0.5">{parcel.assignedSurveyor || 'Unassigned'}</dd>
              </div>
              <div>
                <dt className="text-text-muted">Coordinates Center</dt>
                <dd className="font-mono text-text-muted mt-0.5">18.5794° N, 73.9782° E</dd>
              </div>
            </dl>
          </Card>

          <Card title="Landowner & Co-Sharers">
            <div className="p-3 bg-page rounded-lg border border-chamoisee/20 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-kobicha/10 text-kobicha flex items-center justify-center font-bold">
                  RP
                </div>
                <div>
                  <h4 className="font-bold text-bistre text-sm">{parcel.primaryOwnerName}</h4>
                  <p className="text-xs text-text-muted">Primary Khata Holder (100% Share)</p>
                </div>
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-y-3 text-xs">
              <div>
                <dt className="text-text-muted">Phone Number</dt>
                <dd className="font-medium text-bistre">{parcel.primaryOwnerPhone}</dd>
              </div>
              <div>
                <dt className="text-text-muted">Family Record ID</dt>
                <dd className="font-mono font-bold text-kobicha">{parcel.familyId || 'FAM-01'}</dd>
              </div>
              <div>
                <dt className="text-text-muted">Bank Account Verified</dt>
                <dd className="text-status-success font-bold">Yes (State Bank of India)</dd>
              </div>
              <div>
                <dt className="text-text-muted">Aadhaar Linked</dt>
                <dd className="text-status-success font-bold">Verified via UIDAI</dd>
              </div>
            </dl>
          </Card>
        </div>
      )}

      {activeTab === 'field' && (
        <div className="space-y-6">
          <Card title="Ground Verification Status">
            <div className="flex items-center justify-between p-4 bg-page rounded-lg border border-chamoisee/20 mb-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-status-success" />
                <div>
                  <h4 className="font-bold text-bistre text-sm">Ground Survey Completed</h4>
                  <p className="text-xs text-text-muted">
                    Inspected by {parcel.fieldVerification?.verifiedBy} on {parcel.fieldVerification?.verifiedAt}
                  </p>
                </div>
              </div>
              <Badge status={parcel.fieldVerification?.discrepancyDetected ? 'DISPUTED' : 'VERIFIED'} />
            </div>

            <div className="space-y-3">
              <h5 className="font-bold text-bistre text-xs uppercase tracking-wider">Field Notes & Ground Assets</h5>
              <p className="text-xs text-text-muted p-3 bg-white rounded border border-chamoisee/20 leading-relaxed">
                {parcel.fieldVerification?.fieldNotes || 'Surveyor verified boundaries with DGPS device. Physical boundary markers installed.'}
              </p>
            </div>

            <div className="mt-6">
              <h5 className="font-bold text-bistre text-xs uppercase tracking-wider mb-3">Geo-Tagged Field Photos</h5>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="relative aspect-video rounded-lg overflow-hidden border border-chamoisee/30 bg-page">
                  <img
                    src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400"
                    alt="Land parcel ground view"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 left-1 bg-bistre/80 text-white text-[9px] px-1.5 py-0.5 rounded">
                    Land Vista
                  </span>
                </div>
                <div className="relative aspect-video rounded-lg overflow-hidden border border-chamoisee/30 bg-page">
                  <img
                    src="https://images.unsplash.com/photo-1595878715977-2e8f8df18ea8?w=400"
                    alt="Boundary peg marker"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 left-1 bg-bistre/80 text-white text-[9px] px-1.5 py-0.5 rounded">
                    Boundary Peg
                  </span>
                </div>
                <div className="relative aspect-video rounded-lg overflow-hidden border border-chamoisee/30 bg-page">
                  <img
                    src="https://images.unsplash.com/photo-1524813686514-a57563d77d46?w=400"
                    alt="Borewell and pump house"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 left-1 bg-bistre/80 text-white text-[9px] px-1.5 py-0.5 rounded">
                    Pump Shed
                  </span>
                </div>
                <div className="relative aspect-video rounded-lg overflow-hidden border border-chamoisee/30 bg-page flex items-center justify-center text-xs text-text-muted font-bold">
                  + 2 More Photos
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'valuation' && (
        <Card title="Section 23 & 30 Solatium Award Breakdown (RFCTLARR 2013)">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-page rounded border border-chamoisee/20">
                <p className="text-[10px] text-text-muted uppercase font-bold">Base Market Value</p>
                <p className="text-lg font-black text-bistre mt-0.5">
                  ₹{((parcel.baseMarketRatePerAcreINR * parcel.areaAcres) / 100000).toFixed(2)} Lakhs
                </p>
                <p className="text-[11px] text-text-muted">@ ₹{(parcel.baseMarketRatePerAcreINR / 100000).toFixed(2)} L/acre</p>
              </div>

              <div className="p-3 bg-page rounded border border-chamoisee/20">
                <p className="text-[10px] text-text-muted uppercase font-bold">Rural Multiplier (Sec 26)</p>
                <p className="text-lg font-black text-kobicha mt-0.5">{parcel.multiplierApplied}x Multiplier</p>
                <p className="text-[11px] text-text-muted">Distance factor applied</p>
              </div>

              <div className="p-3 bg-page rounded border border-chamoisee/20">
                <p className="text-[10px] text-text-muted uppercase font-bold">100% Solatium (Sec 30)</p>
                <p className="text-lg font-black text-status-success mt-0.5">+ 100% Statutory</p>
                <p className="text-[11px] text-text-muted">Equal to adjusted base</p>
              </div>
            </div>

            <table className="w-full text-xs text-left border-collapse mt-4">
              <thead>
                <tr className="border-b border-chamoisee/20 text-text-muted">
                  <th className="py-2">Component</th>
                  <th className="py-2">Statutory Basis</th>
                  <th className="py-2 text-right">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-chamoisee/10">
                <tr>
                  <td className="py-2.5 font-semibold text-bistre">Adjusted Land Value</td>
                  <td className="py-2.5 text-text-muted">Base × Multiplier (2.5 ac × ₹35L × 1.5)</td>
                  <td className="py-2.5 text-right font-mono font-bold text-bistre">₹1,31,25,000</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-semibold text-bistre">Trees & Assets Attached</td>
                  <td className="py-2.5 text-text-muted">Horticulture valuation (12 Mango trees)</td>
                  <td className="py-2.5 text-right font-mono font-bold text-bistre">₹3,40,000</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-semibold text-bistre">Farmhouse & Borewell</td>
                  <td className="py-2.5 text-text-muted">PWD schedule of rates</td>
                  <td className="py-2.5 text-right font-mono font-bold text-bistre">₹12,18,253</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-semibold text-bistre">100% Solatium</td>
                  <td className="py-2.5 text-text-muted">Section 30(1) RFCTLARR Act</td>
                  <td className="py-2.5 text-right font-mono font-bold text-bistre">₹1,46,83,253</td>
                </tr>
                <tr className="bg-buff/15 font-bold text-bistre">
                  <td className="py-3 text-sm">Total Final Compensation Award</td>
                  <td className="py-3 text-xs text-text-muted">Payable to Ramesh Tukaram Patil</td>
                  <td className="py-3 text-right font-mono text-base text-status-success">₹2,93,66,506</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'family' && (
        <Card title="Displaced / Affected Family Social R&R Record">
          <div className="p-4 bg-page rounded-lg border border-chamoisee/20 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-text-muted uppercase font-bold">Family ID</p>
                <h4 className="font-bold text-bistre text-base font-mono">{family?.familyId || 'FAM-01'}</h4>
              </div>
              <Badge status={family?.rnrStatus || 'ENTITLED'} />
            </div>
            <p className="text-xs text-text-muted mt-2">
              Head of Household: <span className="font-bold text-bistre">{family?.headOfFamily || parcel.primaryOwnerName}</span> • 
              Total Members: <span className="font-bold text-bistre">{family?.membersCount || 5} (2 Adults, 3 Dependents)</span>
            </p>
          </div>

          <h5 className="font-bold text-bistre text-xs uppercase tracking-wider mb-2">Entitled R&R Schedule II Package</h5>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-white rounded border border-chamoisee/20">
              <p className="text-text-muted font-semibold">Resettlement Housing</p>
              <p className="font-bold text-bistre mt-0.5">PM Awas Scheme Allotment</p>
              <p className="text-[11px] text-status-success font-medium">Plot #42, Wagholi R&R Colony</p>
            </div>
            <div className="p-3 bg-white rounded border border-chamoisee/20">
              <p className="text-text-muted font-semibold">Subsistence Allowance</p>
              <p className="font-bold text-bistre mt-0.5">₹3,000 / month</p>
              <p className="text-[11px] text-text-muted">For 12 consecutive months</p>
            </div>
            <div className="p-3 bg-white rounded border border-chamoisee/20">
              <p className="text-text-muted font-semibold">Skill & Employment</p>
              <p className="font-bold text-bistre mt-0.5">1 Member Enrolled</p>
              <p className="text-[11px] text-text-muted">NHAI Toll Operator Training</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ParcelDetails;
