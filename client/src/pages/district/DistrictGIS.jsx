import React, { useState, useMemo } from 'react';
import { useGIS } from '../../hooks/useGIS';
import { GISMap } from '../../components/gis/GISMap';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Search, Filter, LandPlot, User, MapPin, AlertOctagon, CheckCircle2, RefreshCw } from 'lucide-react';

export const DistrictGIS = () => {
  const { geoJsonData, selectedParcel, setSelectedParcel, loading, error, stats, refetch } = useGIS();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [verifiedFilter, setVerifiedFilter] = useState('');

  const features = useMemo(() => {
    let list = geoJsonData?.features || [];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((f) =>
        [f.properties?.surveyNumber, f.properties?.village, f.properties?.primaryOwnerName]
          .some((v) => v?.toLowerCase().includes(q))
      );
    }
    if (statusFilter) {
      list = list.filter((f) => f.properties?.acquisitionStatus === statusFilter);
    }
    if (verifiedFilter === 'verified') {
      list = list.filter((f) => f.properties?.isVerified);
    } else if (verifiedFilter === 'unverified') {
      list = list.filter((f) => !f.properties?.isVerified);
    }
    return list;
  }, [geoJsonData, search, statusFilter, verifiedFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DDD3C7] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#4A2E1B]">District GIS Cadastral Map</h1>
          <p className="text-xs text-[#6C625B]">Spatial visualization of land parcels, boundaries, and statutory verification status</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#4A2E1B] bg-[#F8F4ED] border border-[#DDD3C7] hover:bg-[#EAD8CE] transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Layers
          </button>
        </div>
      </div>

      {/* Backend geometry limitation notice */}
      <div className="p-3 bg-[#F8F4ED] border-l-4 border-[#C07D38] text-xs text-[#4A2E1B]">
        <strong>Backend Geometry Coverage:</strong> Real parcel polygon geometry is loaded directly from MongoDB. Project boundary geometry is currently not published by the backend server.
      </div>

      {/* Layer Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-[#F8F4ED] border border-[#DDD3C7]">
          <span className="text-[11px] font-semibold uppercase text-[#6C625B]">Total Spatial Parcels</span>
          <p className="text-2xl font-bold text-[#4A2E1B] mt-1">{stats?.totalParcels ?? features.length}</p>
        </div>
        <div className="p-4 bg-[#F8F4ED] border border-[#DDD3C7]">
          <span className="text-[11px] font-semibold uppercase text-[#6C625B]">Ground Verified</span>
          <p className="text-2xl font-bold text-[#C07D38] mt-1">{stats?.verifiedParcels ?? '—'}</p>
        </div>
        <div className="p-4 bg-[#F8F4ED] border border-[#DDD3C7]">
          <span className="text-[11px] font-semibold uppercase text-[#6C625B]">Disputed Parcels</span>
          <p className="text-2xl font-bold text-[#B84D28] mt-1">{stats?.disputedParcels ?? '—'}</p>
        </div>
        <div className="p-4 bg-[#F8F4ED] border border-[#DDD3C7]">
          <span className="text-[11px] font-semibold uppercase text-[#6C625B]">Awards Pronounced</span>
          <p className="text-2xl font-bold text-[#4A2E1B] mt-1">{stats?.awardedParcels ?? '—'}</p>
        </div>
      </div>

      {/* Controls & Filter Bar */}
      <div className="p-4 bg-[#F8F4ED] border border-[#DDD3C7] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 text-[#6C625B] absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search survey #, village, owner..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#DDD3C7] text-[#4A2E1B] focus:outline-none focus:border-[#B84D28]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-[#DDD3C7] text-[#4A2E1B] focus:outline-none focus:border-[#B84D28]"
          >
            <option value="">All Statuses</option>
            <option value="NOTIFIED_SEC_11">Sec 11 Notified</option>
            <option value="VALUATION_COMPLETED">Valuation Completed</option>
            <option value="AWARD_PRONOUNCED">Award Pronounced</option>
            <option value="DISPUTED">Disputed</option>
          </select>
          <select
            value={verifiedFilter}
            onChange={(e) => setVerifiedFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-[#DDD3C7] text-[#4A2E1B] focus:outline-none focus:border-[#B84D28]"
          >
            <option value="">All Verifications</option>
            <option value="verified">Verified Only</option>
            <option value="unverified">Unverified Only</option>
          </select>
        </div>
        <div className="text-xs text-[#6C625B]">
          Showing {features.length} features
        </div>
      </div>

      {/* Main Map & Parcel Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {error ? (
            <div className="p-6 bg-[#FAF3E0] border border-[#DDD3C7] text-xs text-[#B84D28]">
              {error}
            </div>
          ) : (
            <GISMap
              features={features}
              selectedParcel={selectedParcel}
              onSelectParcel={setSelectedParcel}
              height="550px"
              stats={stats}
            />
          )}
        </div>

        {/* Selected Parcel Inspector Panel */}
        <div className="space-y-4">
          <Card title="Parcel Detail Inspector" subtitle="Click any map polygon to inspect spatial properties">
            {selectedParcel ? (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-[#F8F4ED] border border-[#DDD3C7] space-y-2">
                  <div className="flex items-center justify-between border-b border-[#DDD3C7] pb-1.5">
                    <span className="font-bold text-sm text-[#4A2E1B]">Survey #{selectedParcel.surveyNumber}</span>
                    <Badge variant={selectedParcel.isVerified ? 'success' : 'warning'} dot>
                      {selectedParcel.isVerified ? 'VERIFIED' : 'UNVERIFIED'}
                    </Badge>
                  </div>
                  <div className="space-y-1.5 text-[#4A2E1B] pt-1">
                    <p className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-[#6C625B]" />
                      <span><strong>Primary Owner:</strong> {selectedParcel.primaryOwnerName}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <LandPlot className="w-3.5 h-3.5 text-[#6C625B]" />
                      <span><strong>Area:</strong> {selectedParcel.areaAcres} Acres</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#6C625B]" />
                      <span><strong>Village/Taluka:</strong> {selectedParcel.village}, {selectedParcel.taluka || 'Haveli'}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 flex items-center justify-center font-bold text-[10px] text-[#6C625B]">P</span>
                      <span><strong>Project:</strong> {selectedParcel.projectName || selectedParcel.projectCode || 'N/A'}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 flex items-center justify-center font-bold text-[10px] text-[#6C625B]">S</span>
                      <span><strong>Acquisition Status:</strong> {selectedParcel.acquisitionStatus}</span>
                    </p>
                  </div>
                </div>

                {selectedParcel.discrepancyDetected && (
                  <div className="p-3 bg-[#FADBD8] border border-[#F5B7B1] text-[#78281F] rounded text-xs flex items-start gap-2">
                    <AlertOctagon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-semibold">Discrepancy Flagged</strong>
                      <span>Ground survey boundary mismatch detected during field inspection.</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center border border-dashed border-[#DDD3C7] bg-[#F8F4ED] text-[#6C625B] text-xs">
                <LandPlot className="w-8 h-8 text-[#C07D38] mx-auto opacity-70 mb-2" />
                Select a parcel on the Leaflet map to inspect its attributes, owner profile, and statutory status.
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DistrictGIS;
