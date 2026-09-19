import React, { useEffect,  useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { getParcels } from '../../services/parcelService';
import { mockParcels } from '../../mock/parcels';
import { UserCheck, Shield, MapPin, Check, RefreshCw, AlertCircle } from 'lucide-react';
;

const mockSurveyors = [
  { id: 'SURV-01', name: 'Kiran Thorat (Talathi)', zone: 'Haveli / Wagholi', activeAssignments: 8, completed: 34, phone: '+91 9822019921', status: 'ACTIVE' },
  { id: 'SURV-02', name: 'Sanjay Deshmukh (RI)', zone: 'Daund / Patas', activeAssignments: 14, completed: 52, phone: '+91 9423088192', status: 'ACTIVE' },
  { id: 'SURV-03', name: 'Pooja Kulkarni (Surveyor)', zone: 'Haveli / Loni', activeAssignments: 3, completed: 19, phone: '+91 9765411234', status: 'ACTIVE' },
  { id: 'SURV-04', name: 'Vikas Jadhav (Patwari)', zone: 'Khed / Chakan', activeAssignments: 0, completed: 41, phone: '+91 9922334455', status: 'ON_LEAVE' },
];

export const OfficerAssignment = () => {
  const [parcels, setParcels] = useState([]);
  useEffect(() => {
    getParcels().then(setParcels).catch(console.error);
  }, []);
  const displayParcels = parcels.length > 0 ? parcels : mockParcels;

  const [selectedSurveyor, setSelectedSurveyor] = useState(mockSurveyors[0].id);
  const [selectedParcels, setSelectedParcels] = useState([]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleSelectParcel = (id) => {
    if (selectedParcels.includes(id)) {
      setSelectedParcels(selectedParcels.filter(p => p !== id));
    } else {
      setSelectedParcels([...selectedParcels, id]);
    }
  };

  const handleAssign = () => {
    if (selectedParcels.length === 0) return;
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-bistre tracking-tight">Revenue Officer & Field Surveyor Assignment</h1>
        <p className="text-xs text-text-muted mt-0.5">
          Delegate ground cadastral verification, DGPS boundary mapping, and crop estimation to field circles
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-status-success/10 border border-status-success/30 rounded-lg flex items-center gap-2 text-status-success text-xs font-bold">
          <Check className="w-4 h-4" /> Successfully assigned {selectedParcels.length} parcel(s) to the selected surveyor! Notifications dispatched.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Surveyor List */}
        <div className="lg:col-span-1 space-y-4">
          <Card title="Available Revenue Staff">
            <div className="space-y-3">
              {mockSurveyors.map((surv) => (
                <div
                  key={surv.id}
                  onClick={() => setSelectedSurveyor(surv.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedSurveyor === surv.id
                      ? 'bg-kobicha/10 border-kobicha shadow-sm'
                      : 'bg-page border-chamoisee/20 hover:border-chamoisee/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-bistre text-xs">{surv.name}</h4>
                    <Badge status={surv.status === 'ACTIVE' ? 'VERIFIED' : 'PENDING'} />
                  </div>
                  <p className="text-[11px] text-text-muted mt-1">{surv.zone}</p>
                  <div className="flex items-center justify-between text-[11px] text-text-muted mt-2 pt-2 border-t border-chamoisee/15">
                    <span>Active: <b className="text-bistre">{surv.activeAssignments}</b></span>
                    <span>Completed: <b className="text-status-success">{surv.completed}</b></span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Parcel Assignment Queue */}
        <div className="lg:col-span-2 space-y-4">
          <Card
            title="Unassigned & Pending Verification Parcels"
            subtitle="Select parcels to assign or reassign"
            action={
              <Button
                variant="primary"
                size="sm"
                onClick={handleAssign}
                disabled={selectedParcels.length === 0}
                className="gap-1.5"
              >
                <UserCheck className="w-4 h-4" /> Assign Selected ({selectedParcels.length})
              </Button>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-chamoisee/20 text-text-muted">
                    <th className="py-2 px-3 w-8">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) setSelectedParcels(displayParcels.map(p => p.id));
                          else setSelectedParcels([]);
                        }}
                        checked={displayParcels.length > 0 && selectedParcels.length === displayParcels.length}
                        className="rounded border-chamoisee text-kobicha focus:ring-kobicha"
                      />
                    </th>
                    <th className="py-2 px-3">Parcel / Survey</th>
                    <th className="py-2 px-3">Location</th>
                    <th className="py-2 px-3">Area (Acres)</th>
                    <th className="py-2 px-3">Current Surveyor</th>
                    <th className="py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-chamoisee/10">
                  {displayParcels.map((parcel) => {
                    const isSelected = selectedParcels.includes(parcel.id);
                    return (
                      <tr
                        key={parcel.id}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-buff/20' : 'hover:bg-page'
                        }`}
                        onClick={() => toggleSelectParcel(parcel.id)}
                      >
                        <td className="py-3 px-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="rounded border-chamoisee text-kobicha focus:ring-kobicha"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-mono font-bold text-bistre">{parcel.surveyNumber}</p>
                          <p className="text-[10px] text-text-muted font-mono">{parcel.id}</p>
                        </td>
                        <td className="py-3 px-3 text-text-muted">
                          {parcel.village}, {parcel.taluka}
                        </td>
                        <td className="py-3 px-3 font-semibold text-bistre">{parcel.areaAcres} ac</td>
                        <td className="py-3 px-3 text-text-muted">
                          {parcel.assignedSurveyor || <span className="text-status-warning font-bold">Unassigned</span>}
                        </td>
                        <td className="py-3 px-3">
                          <Badge status={parcel.acquisitionStatus} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OfficerAssignment;
