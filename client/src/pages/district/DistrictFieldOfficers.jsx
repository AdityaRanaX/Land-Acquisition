import React, { useState, useEffect } from 'react';
import { userApi } from '../../services/api/userApi';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Users, Info, ShieldCheck, RefreshCw, Mail, Phone, MapPin } from 'lucide-react';

export const DistrictFieldOfficers = () => {
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOfficers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await userApi.getUsers({ role: 'FIELD_SURVEYOR' });
      setOfficers(res.data?.data || []);
    } catch (e) {
      setError(e.response?.data?.message || 'Unable to retrieve field officers from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfficers();
  }, []);

  const columns = [
    {
      title: 'Officer Name & Role',
      key: 'name',
      render: (v, row) => (
        <div>
          <span className="font-semibold text-[#4A2E1B]">{v}</span>
          <span className="text-[10px] text-[#6C625B] block">{row.designation || 'Field Surveyor'}</span>
        </div>
      )
    },
    {
      title: 'Contact Information',
      key: 'email',
      render: (v, row) => (
        <div className="space-y-0.5 text-xs text-[#6C625B]">
          <div className="flex items-center gap-1.5">
            <Mail className="w-3 h-3 text-[#C07D38]" />
            <span>{v}</span>
          </div>
          {row.phone && (
            <div className="flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-[#C07D38]" />
              <span>{row.phone}</span>
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Jurisdiction Circle',
      key: 'jurisdiction',
      render: (j) => (
        <div className="flex items-center gap-1.5 text-xs text-[#4A2E1B]">
          <MapPin className="w-3.5 h-3.5 text-[#B84D28]" />
          <span>{j?.district || 'District'}, {j?.state || 'State'} {j?.taluka ? `(${j.taluka})` : ''}</span>
        </div>
      )
    },
    {
      title: 'Account Status',
      key: 'isActive',
      render: (v) => (
        <Badge variant={v !== false ? 'success' : 'danger'} dot>
          {v !== false ? 'ACTIVE' : 'INACTIVE'}
        </Badge>
      )
    },
    {
      title: 'Assigned Parcels / Actions',
      key: 'assigned',
      render: () => (
        <span className="text-[11px] text-[#6C625B]">
          Assignment contract unavailable
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DDD3C7] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#4A2E1B]">District Field Surveyors & Revenue Inspectors</h1>
          <p className="text-xs text-[#6C625B]">Cadastral ground verification officers registered under district jurisdiction</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchOfficers}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#4A2E1B] bg-[#F8F4ED] border border-[#DDD3C7] hover:bg-[#EAD8CE] transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Roster
          </button>
        </div>
      </div>

      {/* Backend Limitation Notice */}
      <div className="p-3 bg-[#F8F4ED] border-l-4 border-[#C07D38] text-xs text-[#4A2E1B] flex items-start gap-2">
        <Info className="w-4 h-4 text-[#C07D38] flex-shrink-0 mt-0.5" />
        <div>
          <strong>Backend Limitation Notice:</strong> The current backend API exposes user profiles for field surveyors via <code>GET /api/users</code>, but does not provide a dedicated field-officer parcel assignment or survey history contract. Officer parcel assignment operations are read-only.
        </div>
      </div>

      {error ? (
        <div className="p-4 bg-[#FAF3E0] border border-[#DDD3C7] text-xs text-[#B84D28]">
          {error}
        </div>
      ) : (
        <Card title="Registered Field Survey Roster" subtitle="Authentic MongoDB Users Collection">
          {loading ? (
            <div className="p-8 text-center text-xs text-[#6C625B]">Loading field officer roster...</div>
          ) : officers.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-[#DDD3C7] rounded-xl bg-[#F8F4ED] space-y-2">
              <Users className="w-8 h-8 text-[#C07D38] mx-auto opacity-70" />
              <p className="text-xs font-semibold text-[#4A2E1B]">No field officers found</p>
              <p className="text-[11px] text-[#6C625B]">No user accounts with role FIELD_SURVEYOR were returned for this jurisdiction.</p>
            </div>
          ) : (
            <Table columns={columns} data={officers} />
          )}
        </Card>
      )}
    </div>
  );
};

export default DistrictFieldOfficers;
