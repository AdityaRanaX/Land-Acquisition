import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockFamilies } from '../../mock/families';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Users, Search, Plus, Download, Home, HeartHandshake, CheckCircle } from 'lucide-react';

export const AffectedFamilies = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [families, setFamilies] = useState(mockFamilies);

  const filtered = families.filter(
    (f) =>
      f.headOfFamily?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.familyId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.village?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-bistre tracking-tight">Affected Families & R&R Register</h1>
          <p className="text-xs text-text-muted mt-0.5">
            Social Impact Assessment & RFCTLARR 2013 Second Schedule Rehabilitation Roster
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Download className="w-4 h-4" /> Export Register
          </Button>
          <Button variant="primary" size="sm" className="gap-1">
            <Plus className="w-4 h-4" /> Register New Family
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card bodyClassName="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-kobicha/10 text-kobicha">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-text-muted">Total Families</p>
              <p className="text-xl font-black text-bistre mt-0.5">{families.length}</p>
            </div>
          </div>
        </Card>

        <Card bodyClassName="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-status-success/10 text-status-success">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-text-muted">Housing Allotted</p>
              <p className="text-xl font-black text-bistre mt-0.5">
                {families.filter((f) => f.housingAllotted).length}
              </p>
            </div>
          </div>
        </Card>

        <Card bodyClassName="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-kobicha/10 text-kobicha">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-text-muted">Subsistence Active</p>
              <p className="text-xl font-black text-bistre mt-0.5">
                {families.filter((f) => f.subsistenceAllowanceActive).length}
              </p>
            </div>
          </div>
        </Card>

        <Card bodyClassName="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-status-info/10 text-status-info">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-text-muted">R&R Cleared</p>
              <p className="text-xl font-black text-bistre mt-0.5">85%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Roster Table */}
      <Card
        title="Project Affected Families (PAFs)"
        action={
          <div className="w-64">
            <Input
              placeholder="Search by Family ID, Head, Village..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="py-1.5 text-xs"
            />
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-chamoisee/20 text-text-muted">
                <th className="py-2.5 px-3">Family ID</th>
                <th className="py-2.5 px-3">Head of Family</th>
                <th className="py-2.5 px-3">Associated Parcel</th>
                <th className="py-2.5 px-3">Members</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Housing Status</th>
                <th className="py-2.5 px-3">R&R Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-chamoisee/10">
              {filtered.map((fam) => (
                <tr key={fam.familyId} className="hover:bg-buff/10 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-kobicha">{fam.familyId}</td>
                  <td className="py-3 px-3">
                    <p className="font-bold text-bistre">{fam.headOfFamily}</p>
                    <p className="text-[11px] text-text-muted">{fam.village}, {fam.district}</p>
                  </td>
                  <td className="py-3 px-3 font-mono text-bistre">
                    <Link to={`/district/parcels/${fam.parcelId}`} className="text-kobicha hover:underline font-bold">
                      {fam.parcelId || 'PARCEL-101'}
                    </Link>
                  </td>
                  <td className="py-3 px-3 text-bistre">{fam.membersCount || 4} Members</td>
                  <td className="py-3 px-3 font-semibold text-text-muted">{fam.socialCategory || 'OBC / Small Farmer'}</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-status-success">
                      <CheckCircle className="w-3 h-3" /> Allotted (Plot #42)
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <Badge status={fam.rnrStatus || 'COMPLETED'} />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Link to={`/district/parcels/${fam.parcelId || 'PARCEL-101'}`}>
                      <Button variant="outline" size="sm" className="text-[11px] py-1">
                        View Dossier
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

export default AffectedFamilies;
