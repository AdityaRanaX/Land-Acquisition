import React, { useEffect, useMemo, useState } from 'react';
import { Filter, RotateCw, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import parcelApi from '../../services/api/parcelApi';

const formatLabel = (value) => value?.replace(/_/g, ' ') || 'Unavailable';

const ParcelRow = ({ parcel }) => (
  <article className="district-parcel-row">
    <div className="district-parcel-main">
      <div className="district-parcel-id">{parcel.surveyNumber || 'Unavailable'}</div>
      <div className="district-parcel-secondary">{parcel._id || 'Parcel identifier unavailable'}</div>
    </div>
    <div className="district-parcel-value" data-label="Owner">{parcel.primaryOwnerName || 'Unavailable'}</div>
    <div className="district-parcel-value district-parcel-status" data-label="Status">{formatLabel(parcel.acquisitionStatus)}</div>
    <div className="district-parcel-value" data-label="Risk">Unavailable</div>
    <div className="district-parcel-action"><Link to={`/district/parcels/${parcel._id}`}>View details <span aria-hidden="true">→</span></Link></div>
  </article>
);

export const DistrictParcels = () => {
  const [parcels, setParcels] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [project, setProject] = useState('');
  const [village, setVillage] = useState('');
  const [verification, setVerification] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchParcels = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await parcelApi.getParcels();
      setParcels(Array.isArray(response.data?.data) ? response.data.data : []);
    } catch (requestError) {
      setParcels([]);
      setError('Unable to load parcels. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParcels();
  }, []);

  const filterOptions = useMemo(() => ({
    statuses: [...new Set(parcels.map((parcel) => parcel.acquisitionStatus).filter(Boolean))],
    projects: [...new Map(parcels.filter((parcel) => parcel.project?._id).map((parcel) => [parcel.project._id, parcel.project])).values()],
    villages: [...new Set(parcels.map((parcel) => parcel.village).filter(Boolean))]
  }), [parcels]);

  const filteredParcels = useMemo(() => {
    const query = search.trim().toLowerCase();
    return parcels.filter((parcel) => {
      const matchesSearch = !query || [parcel.surveyNumber, parcel.primaryOwnerName, parcel.village, parcel.project?.name, parcel.project?.code]
        .some((value) => value?.toLowerCase().includes(query));
      const matchesStatus = !status || parcel.acquisitionStatus === status;
      const matchesProject = !project || parcel.project?._id === project;
      const matchesVillage = !village || parcel.village === village;
      const matchesVerification = !verification || String(Boolean(parcel.fieldVerification?.isVerified)) === verification;
      return matchesSearch && matchesStatus && matchesProject && matchesVillage && matchesVerification;
    });
  }, [parcels, project, search, status, verification, village]);

  return (
    <div className="district-parcels-page">
      <style>{`
        .district-parcels-page { --terracotta:#B84D28; --umber:#4A2E1B; --ochre:#C07D38; --grey-brown:#6C625B; --line:#DDD3C7; --tan:#E8D9C4; color:var(--umber); }
        .district-parcels-heading { display:flex; align-items:flex-end; justify-content:space-between; gap:1.5rem; padding:1.5rem 0 2rem; border-bottom:1px solid var(--line); }
        .district-parcels-title { margin:0; color:var(--umber); font-size:2.35rem; font-weight:500; letter-spacing:-.03em; }
        .district-parcels-subtitle { margin:.6rem 0 0; color:var(--grey-brown); font-size:.88rem; }
        .district-parcels-toolbar { display:flex; align-items:center; justify-content:space-between; gap:1rem; padding:1.25rem 0; }
        .district-parcels-count { color:var(--grey-brown); font-size:.75rem; }
        .district-parcels-filter-button { display:inline-flex; align-items:center; gap:.45rem; border:1px solid var(--line); background:transparent; color:var(--umber); padding:.55rem .8rem; cursor:pointer; font:inherit; font-size:.75rem; }
        .district-parcels-filter-button:hover { border-color:var(--terracotta); color:var(--terracotta); }
        .district-parcels-filters { display:grid; grid-template-columns:minmax(0,1fr) repeat(4, minmax(9rem, .7fr)); gap:.7rem; padding:0 0 1.25rem; }
        .district-parcels-search,.district-parcels-select { display:flex; align-items:center; gap:.5rem; min-height:2.35rem; border:1px solid var(--line); background:#FFFDF9; color:var(--grey-brown); padding:0 .7rem; }
        .district-parcels-search input,.district-parcels-select select { width:100%; border:0; outline:0; background:transparent; color:var(--umber); font:inherit; font-size:.75rem; }
        .district-parcels-list { border-top:1px solid var(--line); }
        .district-parcels-labels,.district-parcel-row { display:grid; grid-template-columns:minmax(13rem,1.4fr) minmax(12rem,1.2fr) minmax(10rem,1fr) minmax(7rem,.7fr) 7rem; gap:1rem; align-items:center; }
        .district-parcels-labels { padding:1rem 0; color:var(--grey-brown); font-size:.68rem; font-weight:700; letter-spacing:.08em; text-transform:uppercase; border-bottom:1px solid var(--line); }
        .district-parcel-row { min-height:5.5rem; border-bottom:1px solid var(--line); }
        .district-parcel-row:hover { background:rgba(234,216,206,.28); }
        .district-parcel-id { color:var(--umber); font-size:.82rem; font-weight:700; }
        .district-parcel-secondary { margin-top:.35rem; color:var(--grey-brown); font-family:ui-monospace,SFMono-Regular,Menlo,monospace; font-size:.64rem; word-break:break-all; }
        .district-parcel-value { color:var(--grey-brown); font-size:.74rem; }
        .district-parcel-status { display:flex; align-items:center; gap:.45rem; }
        .district-parcel-status::before { content:''; display:inline-block; width:.48rem; height:.48rem; border-radius:50%; background:var(--ochre); }
        .district-parcel-action { text-align:right; }
        .district-parcel-action a { color:var(--terracotta); font-size:.72rem; text-decoration:none; white-space:nowrap; }
        .district-parcel-action a:hover { text-decoration:underline; }
        .district-parcels-state { padding:3.5rem 1rem; border-top:1px solid var(--line); border-bottom:1px solid var(--line); color:var(--grey-brown); text-align:center; font-size:.8rem; }
        .district-parcels-error { color:var(--terracotta); }
        .district-parcels-retry { display:inline-flex; align-items:center; gap:.4rem; margin-top:1rem; border:1px solid var(--line); background:transparent; color:var(--terracotta); padding:.5rem .75rem; cursor:pointer; font:inherit; font-size:.72rem; }
        .district-parcels-skeleton { height:5.5rem; border-bottom:1px solid var(--line); background:#EFE7DC; animation:district-parcels-pulse 1.4s ease-in-out infinite; }
        @keyframes district-parcels-pulse { 0%,100% { opacity:.45; } 50% { opacity:.8; } }
        @media (max-width:900px) { .district-parcels-filters { grid-template-columns:1fr 1fr; } }
        @media (max-width:700px) { .district-parcels-heading,.district-parcels-toolbar { align-items:flex-start; flex-direction:column; } .district-parcels-filters { grid-template-columns:1fr; } .district-parcels-labels { display:none; } .district-parcel-row { display:grid; grid-template-columns:1fr 1fr; gap:.7rem 1rem; padding:1.15rem 0; } .district-parcel-main { grid-column:1 / -1; } .district-parcel-value { min-width:0; } .district-parcel-value::before { content:attr(data-label); display:block; margin-bottom:.25rem; color:var(--grey-brown); font-size:.64rem; text-transform:uppercase; letter-spacing:.05em; } .district-parcel-action { grid-column:1 / -1; text-align:left; padding-top:.2rem; } }
      `}</style>

      <header className="district-parcels-heading"><div><h1 className="district-parcels-title">Parcels</h1><p className="district-parcels-subtitle">Review land parcels and verification status within the district.</p></div></header>
      <div className="district-parcels-toolbar"><span className="district-parcels-count">{loading ? 'Loading parcels...' : `${filteredParcels.length} parcel${filteredParcels.length === 1 ? '' : 's'} shown`}</span><button type="button" className="district-parcels-filter-button" onClick={() => setFiltersOpen((current) => !current)} aria-expanded={filtersOpen}><Filter size={14} /> Filters</button></div>

      {filtersOpen && <div className="district-parcels-filters"><label className="district-parcels-search"><Search size={14} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search parcel, owner, village or project" /></label><label className="district-parcels-select"><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="">All statuses</option>{filterOptions.statuses.map((option) => <option key={option} value={option}>{formatLabel(option)}</option>)}</select></label><label className="district-parcels-select"><select value={project} onChange={(event) => setProject(event.target.value)}><option value="">All projects</option>{filterOptions.projects.map((option) => <option key={option._id} value={option._id}>{option.code || option.name}</option>)}</select></label><label className="district-parcels-select"><select value={village} onChange={(event) => setVillage(event.target.value)}><option value="">All villages</option>{filterOptions.villages.map((option) => <option key={option} value={option}>{option}</option>)}</select></label><label className="district-parcels-select"><select value={verification} onChange={(event) => setVerification(event.target.value)}><option value="">All verification states</option><option value="true">Verified</option><option value="false">Unverified</option></select></label></div>}

      {loading && <div className="district-parcels-list" aria-label="Loading parcels"><div className="district-parcels-skeleton" /><div className="district-parcels-skeleton" /><div className="district-parcels-skeleton" /></div>}
      {!loading && error && <div className="district-parcels-state district-parcels-error">{error}<br /><button type="button" className="district-parcels-retry" onClick={fetchParcels}><RotateCw size={13} /> Retry</button></div>}
      {!loading && !error && filteredParcels.length === 0 && <div className="district-parcels-state">No parcels found.</div>}
      {!loading && !error && filteredParcels.length > 0 && <div className="district-parcels-list"><div className="district-parcels-labels"><span>Parcel ID</span><span>Owner</span><span>Status</span><span>Risk</span><span /></div>{filteredParcels.map((parcel) => <ParcelRow key={parcel._id} parcel={parcel} />)}</div>}
    </div>
  );
};

export default DistrictParcels;
