import React, { useState, useEffect } from 'react';
import { compensationApi } from '../../services/api/compensationApi';
import { parcelApi } from '../../services/api/parcelApi';
import { projectApi } from '../../services/api/projectApi';
import { WhatIfSimulator } from '../../components/shared/WhatIfSimulator';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Scale, IndianRupee, RefreshCw, CheckCircle2, AlertTriangle, X, ShieldAlert } from 'lucide-react';

export const DistrictCompensation = () => {
  const [activeTab, setActiveTab] = useState('awards'); // 'awards' | 'simulator' | 'create'
  const [awards, setAwards] = useState([]);
  const [parcels, setParcels] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Status Update Modal State
  const [selectedAward, setSelectedAward] = useState(null);
  const [newStatus, setNewStatus] = useState('DISBURSED');
  const [utrNumber, setUtrNumber] = useState('');
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [mutating, setMutating] = useState(false);

  // New Award Form State
  const [awardForm, setAwardForm] = useState({
    parcelId: '',
    projectId: '',
    beneficiaryName: '',
    baseMarketValuePerAcre: 3500000,
    acquiredAreaAcres: 1.0,
    urbanOrRural: 'RURAL',
    distanceFactor: 1.2,
    assetsStructures: 0,
    assetsTreesCrops: 0,
    interestDays: 180,
    bankDetails: { accountNumber: '', ifscCode: '', bankName: '' }
  });
  const [creatingAward, setCreatingAward] = useState(false);

  const fetchAwardsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [resAwards, resParcels, resProjects] = await Promise.all([
        compensationApi.getAwards(),
        parcelApi.getParcels(),
        projectApi.getProjects()
      ]);
      setAwards(resAwards.data?.data || []);
      setParcels(resParcels.data?.data || []);
      setProjects(resProjects.data?.data || []);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to retrieve statutory compensation records from MongoDB');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAwardsData();
  }, []);

  const formatINR = (val) =>
    val != null
      ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val)
      : 'Unavailable';

  const handleUpdateStatusConfirm = async () => {
    if (!selectedAward) return;
    setMutating(true);
    setSuccessMsg(null);
    setError(null);
    try {
      const res = await compensationApi.updateStatus(selectedAward._id, {
        disbursementStatus: newStatus,
        utrTransactionNumber: utrNumber
      });
      setSuccessMsg(`Status updated successfully for award ${res.data?.data?._id || selectedAward._id}`);
      setConfirmModalOpen(false);
      setSelectedAward(null);
      fetchAwardsData();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to update compensation status');
    } finally {
      setMutating(false);
    }
  };

  const handleCreateAwardSubmit = async (e) => {
    e.preventDefault();
    if (!awardForm.parcelId || !awardForm.projectId || !awardForm.beneficiaryName) {
      setError('Parcel, Project, and Beneficiary Name are required');
      return;
    }
    setCreatingAward(true);
    setError(null);
    try {
      const res = await compensationApi.createAward(awardForm);
      setSuccessMsg(`Statutory award pronounced successfully for ${awardForm.beneficiaryName}`);
      setActiveTab('awards');
      fetchAwardsData();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to pronounce compensation award');
    } finally {
      setCreatingAward(false);
    }
  };

  const columns = [
    {
      title: 'Beneficiary Landowner',
      key: 'beneficiaryName',
      render: (v, row) => (
        <div>
          <span className="font-semibold text-[#4A2E1B]">{v || 'Unavailable'}</span>
          {row.bankDetails?.accountNumber && (
            <span className="text-[10px] text-[#6C625B] block">Bank: {row.bankDetails.bankName || 'A/C Verified'}</span>
          )}
        </div>
      )
    },
    {
      title: 'Parcel Survey / Project',
      key: 'parcel',
      render: (p, row) => (
        <div>
          <span className="font-medium text-[#4A2E1B]">Survey #{p?.surveyNumber || 'Unavailable'} ({p?.village || 'N/A'})</span>
          <span className="text-[10px] text-[#6C625B] block">{row.project?.name || 'Project N/A'}</span>
        </div>
      )
    },
    {
      title: 'Base Land + Assets',
      key: 'totalBaseAssetAndLandValue',
      render: (v) => <span className="text-[#4A2E1B]">{formatINR(v)}</span>
    },
    {
      title: 'Solatium (Sec 30)',
      key: 'solatiumAmount',
      render: (v) => <span className="font-semibold text-[#C07D38]">{formatINR(v)}</span>
    },
    {
      title: 'Total Gross Award',
      key: 'totalGrossAwardINR',
      render: (v) => <span className="font-bold text-[#B84D28]">{formatINR(v)}</span>
    },
    {
      title: 'Disbursement Status',
      key: 'disbursementStatus',
      render: (v) => (
        <Badge
          variant={v === 'DISBURSED' ? 'success' : v === 'AWARD_APPROVED' ? 'warning' : 'default'}
          dot
        >
          {v || 'ESTIMATED'}
        </Badge>
      )
    },
    {
      title: 'UTR / Payment Ref',
      key: 'transactionReference',
      render: (v, row) => (
        <span className="text-[11px] font-mono text-[#6C625B]">
          {v || row.disbursedDate ? `UTR: ${v || 'Ref recorded'}` : 'Unavailable'}
        </span>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, row) => (
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            setSelectedAward(row);
            setNewStatus(row.disbursementStatus === 'AWARD_APPROVED' ? 'DISBURSED' : 'ESCROW_FUNDED');
            setUtrNumber(row.transactionReference || '');
            setConfirmModalOpen(true);
          }}
        >
          Update Status
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DDD3C7] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#4A2E1B]">RFCTLARR Statutory Compensation Management</h1>
          <p className="text-xs text-[#6C625B]">Statutory land valuation, Schedule I calculations, award pronouncements, and disbursement tracking</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchAwardsData}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#4A2E1B] bg-[#F8F4ED] border border-[#DDD3C7] hover:bg-[#EAD8CE] transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Records
          </button>
        </div>
      </div>

      {/* Backend Limitation Notice */}
      <div className="p-3 bg-[#F8F4ED] border-l-4 border-[#C07D38] text-xs text-[#4A2E1B]">
        <strong>Backend Limitation Notice:</strong> Payment history log endpoint is currently unavailable in the backend. UTR transaction numbers and disbursement status are stored directly on the Compensation document.
      </div>

      {error && (
        <div className="p-3 bg-[#FAF3E0] border border-[#DDD3C7] text-xs text-[#B84D28] flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-[#EAD8CE] border border-[#B84D28]/30 text-xs text-[#4A2E1B] flex items-center justify-between">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#DDD3C7] text-xs font-semibold text-[#6C625B]">
        <button
          onClick={() => setActiveTab('awards')}
          className={`px-4 py-2.5 border-b-2 transition-colors ${
            activeTab === 'awards' ? 'border-[#B84D28] text-[#B84D28] bg-[#F8F4ED]' : 'border-transparent hover:text-[#4A2E1B]'
          }`}
        >
          Compensation Awards ({awards.length})
        </button>
        <button
          onClick={() => setActiveTab('simulator')}
          className={`px-4 py-2.5 border-b-2 transition-colors ${
            activeTab === 'simulator' ? 'border-[#B84D28] text-[#B84D28] bg-[#F8F4ED]' : 'border-transparent hover:text-[#4A2E1B]'
          }`}
        >
          What-If Simulator
        </button>
        <button
          onClick={() => setActiveTab('create')}
          className={`px-4 py-2.5 border-b-2 transition-colors ${
            activeTab === 'create' ? 'border-[#B84D28] text-[#B84D28] bg-[#F8F4ED]' : 'border-transparent hover:text-[#4A2E1B]'
          }`}
        >
          Pronounce New Award
        </button>
      </div>

      {/* TAB 1: Awards List */}
      {activeTab === 'awards' && (
        <Card title="Pronounced Schedule I Compensation Awards" subtitle="Authentic MongoDB Compensation Records">
          {loading ? (
            <div className="p-8 text-center text-xs text-[#6C625B]">Loading statutory compensation awards from backend...</div>
          ) : awards.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-[#DDD3C7] rounded-xl bg-[#F8F4ED] space-y-2">
              <Scale className="w-8 h-8 text-[#C07D38] mx-auto opacity-70" />
              <p className="text-xs font-semibold text-[#4A2E1B]">No compensation awards found</p>
              <p className="text-[11px] text-[#6C625B]">Use the "Pronounce New Award" tab or What-If Simulator to generate compensation records.</p>
            </div>
          ) : (
            <Table columns={columns} data={awards} />
          )}
        </Card>
      )}

      {/* TAB 2: What-If Simulator */}
      {activeTab === 'simulator' && (
        <WhatIfSimulator />
      )}

      {/* TAB 3: Create Award Form */}
      {activeTab === 'create' && (
        <Card title="Pronounce New Statutory Compensation Award" subtitle="RFCTLARR Section 23/30 Statutory Multipliers & Solatium">
          <form onSubmit={handleCreateAwardSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-[#4A2E1B] mb-1">Select Target Parcel *</label>
                <select
                  value={awardForm.parcelId}
                  onChange={(e) => setAwardForm({ ...awardForm, parcelId: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-[#DDD3C7] text-[#4A2E1B] text-xs focus:outline-none focus:border-[#B84D28]"
                  required
                >
                  <option value="">-- Choose Parcel --</option>
                  {parcels.map((p) => (
                    <option key={p._id} value={p._id}>
                      Survey #{p.surveyNumber} ({p.village}) - {p.primaryOwnerName} ({p.areaAcres} Acres)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#4A2E1B] mb-1">Select Project *</label>
                <select
                  value={awardForm.projectId}
                  onChange={(e) => setAwardForm({ ...awardForm, projectId: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-[#DDD3C7] text-[#4A2E1B] text-xs focus:outline-none focus:border-[#B84D28]"
                  required
                >
                  <option value="">-- Choose Project --</option>
                  {projects.map((proj) => (
                    <option key={proj._id} value={proj._id}>
                      {proj.name} ({proj.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Beneficiary Name *"
                type="text"
                value={awardForm.beneficiaryName}
                onChange={(e) => setAwardForm({ ...awardForm, beneficiaryName: e.target.value })}
                placeholder="e.g. Ramesh Patil"
                required
              />
              <Input
                label="Base Market Value / Acre (₹) *"
                type="number"
                value={awardForm.baseMarketValuePerAcre}
                onChange={(e) => setAwardForm({ ...awardForm, baseMarketValuePerAcre: Number(e.target.value) })}
                required
              />
              <Input
                label="Acquired Area (Acres) *"
                type="number"
                step="0.01"
                value={awardForm.acquiredAreaAcres}
                onChange={(e) => setAwardForm({ ...awardForm, acquiredAreaAcres: Number(e.target.value) })}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-[#4A2E1B] mb-1">Urban / Rural</label>
                <select
                  value={awardForm.urbanOrRural}
                  onChange={(e) => setAwardForm({ ...awardForm, urbanOrRural: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-[#DDD3C7] text-[#4A2E1B] text-xs focus:outline-none focus:border-[#B84D28]"
                >
                  <option value="RURAL">Rural (Factor 1.0 - 2.0)</option>
                  <option value="URBAN">Urban (Factor 1.0)</option>
                </select>
              </div>
              <Input
                label="Distance Factor Multiplier"
                type="number"
                step="0.1"
                min="1.0"
                max="2.0"
                disabled={awardForm.urbanOrRural === 'URBAN'}
                value={awardForm.distanceFactor}
                onChange={(e) => setAwardForm({ ...awardForm, distanceFactor: Number(e.target.value) })}
              />
              <Input
                label="Elapsed Days (12% Sec 30(3) Interest)"
                type="number"
                value={awardForm.interestDays}
                onChange={(e) => setAwardForm({ ...awardForm, interestDays: Number(e.target.value) })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Attached Structures / Wells Valuation (₹)"
                type="number"
                value={awardForm.assetsStructures}
                onChange={(e) => setAwardForm({ ...awardForm, assetsStructures: Number(e.target.value) })}
              />
              <Input
                label="Attached Trees / Standing Crops (₹)"
                type="number"
                value={awardForm.assetsTreesCrops}
                onChange={(e) => setAwardForm({ ...awardForm, assetsTreesCrops: Number(e.target.value) })}
              />
            </div>

            <div className="p-3 bg-[#F8F4ED] border border-[#DDD3C7] space-y-2">
              <span className="font-semibold text-[#4A2E1B]">Bank Details for Disbursement</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                  label="Account Number"
                  type="text"
                  value={awardForm.bankDetails.accountNumber}
                  onChange={(e) => setAwardForm({ ...awardForm, bankDetails: { ...awardForm.bankDetails, accountNumber: e.target.value } })}
                />
                <Input
                  label="IFSC Code"
                  type="text"
                  value={awardForm.bankDetails.ifscCode}
                  onChange={(e) => setAwardForm({ ...awardForm, bankDetails: { ...awardForm.bankDetails, ifscCode: e.target.value } })}
                />
                <Input
                  label="Bank Name"
                  type="text"
                  value={awardForm.bankDetails.bankName}
                  onChange={(e) => setAwardForm({ ...awardForm, bankDetails: { ...awardForm.bankDetails, bankName: e.target.value } })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="secondary" onClick={() => setActiveTab('awards')}>Cancel</Button>
              <Button type="submit" variant="primary" loading={creatingAward} icon={Scale}>Pronounce Statutory Award</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Confirmation Modal for State-Changing Status Update */}
      {confirmModalOpen && selectedAward && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#DDD3C7] max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#DDD3C7] pb-3">
              <h3 className="text-sm font-bold text-[#4A2E1B] flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#B84D28]" />
                Confirm Compensation Status Update
              </h3>
              <button onClick={() => setConfirmModalOpen(false)}><X className="w-4 h-4 text-[#6C625B]" /></button>
            </div>

            <div className="space-y-3 text-xs text-[#4A2E1B]">
              <p>
                You are updating the status for award to <strong>{selectedAward.beneficiaryName}</strong> (Award ID: {selectedAward._id}).
              </p>
              <div>
                <label className="block text-[11px] font-semibold mb-1">New Disbursement Status *</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-[#DDD3C7] text-xs"
                >
                  <option value="ESTIMATED">ESTIMATED</option>
                  <option value="AWARD_APPROVED">AWARD_APPROVED</option>
                  <option value="ESCROW_FUNDED">ESCROW_FUNDED</option>
                  <option value="DISBURSED">DISBURSED</option>
                  <option value="ON_HOLD_DISPUTE">ON_HOLD_DISPUTE</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold mb-1">UTR / Bank Transaction Reference</label>
                <input
                  type="text"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  placeholder="e.g. UTR984719283741"
                  className="w-full px-3 py-1.5 bg-white border border-[#DDD3C7] text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#DDD3C7]">
              <Button size="sm" variant="secondary" onClick={() => setConfirmModalOpen(false)}>Cancel</Button>
              <Button size="sm" variant="primary" loading={mutating} onClick={handleUpdateStatusConfirm}>
                Confirm Update
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DistrictCompensation;
