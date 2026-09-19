import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { getParcels } from '../../services/parcelService';
import { mockParcels } from '../../mock/parcels';
;
import { History, CheckCircle2, AlertTriangle, ArrowLeft, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export const VerificationHistory = () => {
  const [parcels, setParcels] = useState([]);
  useEffect(() => {
    getParcels().then(setParcels).catch(console.error);
  }, []);

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <Link to="/field">
          <Button variant="outline" size="sm" className="gap-1 text-xs">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Button>
        </Link>
        <span className="text-xs text-text-muted">Total Submissions: {mockParcels.length}</span>
      </div>

      <div>
        <h1 className="text-2xl font-black text-bistre tracking-tight">Surveyor Field Inspection Log</h1>
        <p className="text-xs text-text-muted mt-0.5">
          Audit trail of confirmed boundary measurements, photo captures, and SLAO endorsements
        </p>
      </div>

      <Card title="Submitted Field Records">
        <div className="space-y-3">
          {mockParcels.map((parcel, idx) => (
            <div
              key={parcel.id}
              className="p-3.5 rounded-lg border border-chamoisee/20 bg-page hover:bg-buff/10 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-bistre text-xs">
                    Survey #{parcel.surveyNumber}
                  </span>
                  <Badge status={parcel.acquisitionStatus} />
                </div>
                <p className="text-xs text-bistre font-semibold mt-1">
                  {parcel.primaryOwnerName} • {parcel.village}, {parcel.taluka}
                </p>
                <p className="text-[11px] text-text-muted mt-0.5">
                  Verified: {parcel.fieldVerification?.verifiedAt || '2026-09-18'} • 4 Spot Photos Synced
                </p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <Link to={`/district/parcels/${parcel.id}`}>
                  <Button variant="outline" size="sm" className="text-xs py-1 gap-1">
                    <Eye className="w-3.5 h-3.5" /> View Record
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default VerificationHistory;
