import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { mockParcels } from '../../mock/parcels';
import { LandPlot, Search, Download, Filter, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AgencyParcels = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [parcels, setParcels] = useState(mockParcels);

  const filtered = parcels.filter(
    (p) =>
      p.surveyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.primaryOwnerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-bistre tracking-tight">Corridor Cadastral Parcels</h1>
          <p className="text-xs text-text-muted mt-0.5">
            Real-time status of all land plots along the Pune-Bengaluru Expressway right-of-way (RoW)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </div>
      </div>

      <Card
        title="Corridor RoW Parcels Roster"
        subtitle={`${filtered.length} parcels recorded in current alignment`}
        action={
          <div className="w-64">
            <Input
              placeholder="Search by survey number, owner, village..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs py-1.5"
            />
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-chamoisee/20 text-text-muted">
                <th className="py-2.5 px-3">Parcel ID</th>
                <th className="py-2.5 px-3">Survey No.</th>
                <th className="py-2.5 px-3">Village / Taluka</th>
                <th className="py-2.5 px-3">Area (Acres)</th>
                <th className="py-2.5 px-3">Landowner</th>
                <th className="py-2.5 px-3">Acquisition Stage</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-chamoisee/10">
              {filtered.map((parcel) => (
                <tr key={parcel.id} className="hover:bg-page transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-kobicha">{parcel.id}</td>
                  <td className="py-3 px-3 font-bold text-bistre">{parcel.surveyNumber}</td>
                  <td className="py-3 px-3 text-text-muted">{parcel.village}, {parcel.taluka}</td>
                  <td className="py-3 px-3 font-semibold text-bistre">{parcel.areaAcres} ac</td>
                  <td className="py-3 px-3 text-bistre">{parcel.primaryOwnerName}</td>
                  <td className="py-3 px-3">
                    <Badge status={parcel.acquisitionStatus} />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Link to={`/district/parcels/${parcel.id}`}>
                      <Button variant="outline" size="sm" className="text-[11px] py-1 gap-1">
                        <Eye className="w-3 h-3" /> View Record
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

export default AgencyParcels;
