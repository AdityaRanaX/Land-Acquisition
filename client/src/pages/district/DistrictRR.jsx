import React, { useEffect, useMemo, useState } from 'react';
import { Filter, RotateCw, Search } from 'lucide-react';
import rrApi from '../../services/api/rrApi';

const formatLabel = (value) => value?.replace(/_/g, ' ') || 'Unavailable';
const formatDate = (value) => value ? new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Unavailable';
const formatINR = (value) => typeof value === 'number' ? `₹${value.toLocaleString('en-IN')}` : 'Unavailable';

const statusClass = (status) => status === 'FULLY_DELIVERED' ? 'is-complete' : status === 'PARTIALLY_DELIVERED' ? 'is-progress' : 'is-pending';

export const DistrictRR = () => {
  const [packages, setPackages] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState('');
  const [actionError, setActionError] = useState('');

  const fetchPackages = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await rrApi.getRRPackages();
      setPackages(Array.isArray(response.data?.data) ? response.data.data : []);
    } catch (requestError) {
      setPackages([]);
      setError('Unable to load R&R records. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const statusOptions = useMemo(() => [...new Set(packages.map((item) => item.deliveryStatus).filter(Boolean))], [packages]);
  const filteredPackages = useMemo(() => {
    const query = search.trim().toLowerCase();
    return packages.filter((item) => {
      const family = item.family;
      const matchesSearch = !query || [item.beneficiaryName, family?.familyHeadName, item.project?.name, item.project?.code]
        .some((value) => value?.toLowerCase().includes(query));
      return matchesSearch && (!status || item.deliveryStatus === status);
    });
  }, [packages, search, status]);

  const updateStatus = async (item, deliveryStatus) => {
    setSavingId(item._id);
    setActionError('');
    try {
      const response = await rrApi.updatePackage(item._id, { deliveryStatus });
      const updated = response.data?.data;
      if (updated) setPackages((current) => current.map((entry) => entry._id === updated._id ? updated : entry));
    } catch (requestError) {
      setActionError(requestError.response?.data?.message || 'Unable to update R&R status.');
    } finally {
      setSavingId('');
    }
  };

  return (
    <div className="district-rr-page">
      <style>{`
        .district-rr-page { --terracotta:#B84D28; --umber:#4A2E1B; --ochre:#C07D38; --grey-brown:#6C625B; --line:#DDD3C7; --tan:#E8D9C4; color:var(--umber); } .district-rr-heading { padding:1.5rem 0 2rem; border-bottom:1px solid var(--line); } .district-rr-title { margin:0; color:var(--umber); font-size:2.35rem; font-weight:500; letter-spacing:-.03em; } .district-rr-subtitle { margin:.6rem 0 0; color:var(--grey-brown); font-size:.88rem; } .district-rr-toolbar { display:flex; align-items:center; justify-content:space-between; gap:1rem; padding:1.25rem 0; } .district-rr-count { color:var(--grey-brown); font-size:.75rem; } .district-rr-filter { display:inline-flex; align-items:center; gap:.45rem; border:1px solid var(--line); background:transparent; color:var(--umber); padding:.55rem .8rem; cursor:pointer; font:inherit; font-size:.75rem; } .district-rr-filter:hover { border-color:var(--terracotta); color:var(--terracotta); } .district-rr-filters { display:grid; grid-template-columns:minmax(0,1fr) 15rem; gap:.7rem; padding-bottom:1.25rem; } .district-rr-search,.district-rr-select { display:flex; align-items:center; gap:.5rem; min-height:2.35rem; border:1px solid var(--line); background:#FFFDF9; color:var(--grey-brown); padding:0 .7rem; } .district-rr-search input,.district-rr-select select { width:100%; border:0; outline:0; background:transparent; color:var(--umber); font:inherit; font-size:.75rem; } .district-rr-list { border-top:1px solid var(--line); } .district-rr-labels,.district-rr-row { display:grid; grid-template-columns:minmax(14rem,1.3fr) minmax(12rem,1fr) minmax(10rem,.9fr) minmax(9rem,.9fr) 10rem; gap:1rem; align-items:center; } .district-rr-labels { padding:1rem 0; color:var(--grey-brown); font-size:.68rem; font-weight:700; letter-spacing:.08em; text-transform:uppercase; border-bottom:1px solid var(--line); } .district-rr-row { min-height:6.2rem; border-bottom:1px solid var(--line); } .district-rr-row:hover { background:rgba(234,216,206,.28); } .district-rr-primary { color:var(--umber); font-size:.82rem; font-weight:700; } .district-rr-secondary,.district-rr-value { color:var(--grey-brown); font-size:.72rem; line-height:1.5; } .district-rr-secondary { margin-top:.35rem; font-family:ui-monospace,SFMono-Regular,Menlo,monospace; font-size:.64rem; word-break:break-word; } .district-rr-label { display:block; margin-bottom:.25rem; color:var(--grey-brown); font-size:.62rem; letter-spacing:.05em; text-transform:uppercase; } .district-rr-status { display:inline-flex; align-items:center; gap:.4rem; color:var(--grey-brown); } .district-rr-status::before { content:''; width:.48rem; height:.48rem; border-radius:50%; background:var(--tan); } .district-rr-status.is-progress::before { background:var(--ochre); } .district-rr-status.is-complete::before { background:var(--grey-brown); } .district-rr-action { display:flex; flex-wrap:wrap; justify-content:flex-end; gap:.45rem; } .district-rr-action button { border:1px solid var(--line); background:transparent; color:var(--terracotta); padding:.45rem .55rem; cursor:pointer; font:inherit; font-size:.66rem; } .district-rr-action button:hover { background:#EAD8CE; } .district-rr-action button:disabled { cursor:wait; opacity:.55; } .district-rr-error-message { margin:1rem 0 0; color:var(--terracotta); font-size:.72rem; } .district-rr-state { padding:3.5rem 1rem; border-top:1px solid var(--line); border-bottom:1px solid var(--line); color:var(--grey-brown); text-align:center; font-size:.8rem; } .district-rr-error { color:var(--terracotta); } .district-rr-retry { display:inline-flex; align-items:center; gap:.4rem; margin-top:.8rem; border:1px solid var(--line); background:transparent; color:var(--terracotta); padding:.5rem .75rem; cursor:pointer; font:inherit; font-size:.72rem; } .district-rr-skeleton { height:6.2rem; border-bottom:1px solid var(--line); background:#EFE7DC; animation:district-rr-pulse 1.4s ease-in-out infinite; } @keyframes district-rr-pulse { 0%,100% { opacity:.45; } 50% { opacity:.8; } }
        @media (max-width:800px) { .district-rr-filters { grid-template-columns:1fr; } .district-rr-labels { display:none; } .district-rr-row { display:grid; grid-template-columns:1fr 1fr; gap:.8rem 1rem; padding:1.15rem 0; } .district-rr-main { grid-column:1 / -1; } .district-rr-value::before { content:attr(data-label); display:block; margin-bottom:.25rem; color:var(--grey-brown); font-size:.62rem; letter-spacing:.05em; text-transform:uppercase; } .district-rr-action { grid-column:1 / -1; justify-content:flex-start; } }
      `}</style>
      <header className="district-rr-heading"><h1 className="district-rr-title">R&amp;R Management</h1><p className="district-rr-subtitle">Review rehabilitation and resettlement packages linked to affected families.</p></header>
      <div className="district-rr-toolbar"><span className="district-rr-count">{loading ? 'Loading R&R records...' : `${filteredPackages.length} record${filteredPackages.length === 1 ? '' : 's'} shown`}</span><button type="button" className="district-rr-filter" onClick={() => setFiltersOpen((current) => !current)} aria-expanded={filtersOpen}><Filter size={14} /> Filters</button></div>
      {filtersOpen && <div className="district-rr-filters"><label className="district-rr-search"><Search size={14} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search beneficiary, family or project" /></label><label className="district-rr-select"><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="">All statuses</option>{statusOptions.map((option) => <option key={option} value={option}>{formatLabel(option)}</option>)}</select></label></div>}
      {loading && <div className="district-rr-list"><div className="district-rr-skeleton" /><div className="district-rr-skeleton" /></div>}
      {!loading && error && <div className="district-rr-state district-rr-error">{error}<br /><button type="button" className="district-rr-retry" onClick={fetchPackages}><RotateCw size={13} /> Retry</button></div>}
      {!loading && !error && filteredPackages.length === 0 && <div className="district-rr-state">No R&amp;R records found.</div>}
      {!loading && !error && filteredPackages.length > 0 && <div className="district-rr-list"><div className="district-rr-labels"><span>Family / beneficiary</span><span>Project</span><span>Eligibility</span><span>Status</span><span /></div>{filteredPackages.map((item) => <article className="district-rr-row" key={item._id}><div className="district-rr-main"><div className="district-rr-primary">{item.beneficiaryName || item.family?.familyHeadName || 'Unavailable'}</div><div className="district-rr-secondary">{item.family?._id || item.family || 'Family relationship unavailable'}</div></div><div className="district-rr-value" data-label="Project">{item.project?.name || item.project?.code || 'Unavailable'}</div><div className="district-rr-value" data-label="Eligibility">{item.houseConstructedOrProvided?.isEligible === undefined ? 'Unavailable' : item.houseConstructedOrProvided.isEligible ? 'Eligible' : 'Not eligible'}</div><div className={`district-rr-value district-rr-status ${statusClass(item.deliveryStatus)}`} data-label="Status">{formatLabel(item.deliveryStatus)}<span className="district-rr-secondary">Total: {formatINR(item.totalRRAmountINR)} · Completed: {formatDate(item.completedDate)}</span></div><div className="district-rr-action"><button type="button" disabled={savingId === item._id || item.deliveryStatus === 'FULLY_DELIVERED'} onClick={() => updateStatus(item, 'PARTIALLY_DELIVERED')}>{savingId === item._id ? 'Saving...' : 'Mark partial'}</button><button type="button" disabled={savingId === item._id || item.deliveryStatus === 'FULLY_DELIVERED'} onClick={() => updateStatus(item, 'FULLY_DELIVERED')}>Mark delivered</button></div></article>)}</div>}
      {actionError && <p className="district-rr-error-message">{actionError}</p>}
    </div>
  );
};

export default DistrictRR;
