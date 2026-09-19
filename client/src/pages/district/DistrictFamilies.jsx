import React, { useEffect, useMemo, useState } from 'react';
import { Filter, RotateCw, Search } from 'lucide-react';
import rrApi from '../../services/api/rrApi';

const formatLabel = (value) => value?.replace(/_/g, ' ') || 'Unavailable';

export const DistrictFamilies = () => {
  const [families, setFamilies] = useState([]);
  const [rrPackages, setRrPackages] = useState([]);
  const [search, setSearch] = useState('');
  const [project, setProject] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFamilies = async () => {
    setLoading(true);
    setError('');
    try {
      const [familyResponse, rrResponse] = await Promise.all([rrApi.getFamilies(), rrApi.getRRPackages()]);
      setFamilies(Array.isArray(familyResponse.data?.data) ? familyResponse.data.data : []);
      setRrPackages(Array.isArray(rrResponse.data?.data) ? rrResponse.data.data : []);
    } catch (requestError) {
      setFamilies([]);
      setRrPackages([]);
      setError('Unable to load families. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFamilies();
  }, []);

  const projects = useMemo(() => [...new Map(families.filter((family) => family.project?._id).map((family) => [family.project._id, family.project])).values()], [families]);
  const filteredFamilies = useMemo(() => {
    const query = search.trim().toLowerCase();
    return families.filter((family) => {
      const matchesSearch = !query || [family.familyHeadName, family.phone, family.project?.name, family.project?.code, ...(family.parcels || []).map((parcel) => parcel.surveyNumber)]
        .some((value) => value?.toLowerCase().includes(query));
      return matchesSearch && (!project || family.project?._id === project);
    });
  }, [families, project, search]);

  const getRrPackage = (familyId) => rrPackages.find((item) => item.family?._id === familyId || item.family === familyId);

  return (
    <div className="district-families-page">
      <style>{`
        .district-families-page { --terracotta:#B84D28; --umber:#4A2E1B; --ochre:#C07D38; --grey-brown:#6C625B; --line:#DDD3C7; --tan:#E8D9C4; color:var(--umber); }
        .district-families-heading { padding:1.5rem 0 2rem; border-bottom:1px solid var(--line); } .district-families-title { margin:0; color:var(--umber); font-size:2.35rem; font-weight:500; letter-spacing:-.03em; } .district-families-subtitle { margin:.6rem 0 0; color:var(--grey-brown); font-size:.88rem; }
        .district-families-toolbar { display:flex; align-items:center; justify-content:space-between; gap:1rem; padding:1.25rem 0; } .district-families-count { color:var(--grey-brown); font-size:.75rem; } .district-families-filter { display:inline-flex; align-items:center; gap:.45rem; border:1px solid var(--line); background:transparent; color:var(--umber); padding:.55rem .8rem; cursor:pointer; font:inherit; font-size:.75rem; } .district-families-filter:hover { border-color:var(--terracotta); color:var(--terracotta); }
        .district-families-filters { display:grid; grid-template-columns:minmax(0,1fr) 15rem; gap:.7rem; padding-bottom:1.25rem; } .district-families-search,.district-families-select { display:flex; align-items:center; gap:.5rem; min-height:2.35rem; border:1px solid var(--line); background:#FFFDF9; color:var(--grey-brown); padding:0 .7rem; } .district-families-search input,.district-families-select select { width:100%; border:0; outline:0; background:transparent; color:var(--umber); font:inherit; font-size:.75rem; }
        .district-families-list { border-top:1px solid var(--line); } .district-family-row { display:grid; grid-template-columns:minmax(14rem,1.4fr) minmax(12rem,1.1fr) minmax(11rem,1fr) minmax(10rem,1fr); gap:1rem; align-items:center; padding:1.2rem 0; border-bottom:1px solid var(--line); } .district-family-row:hover { background:rgba(234,216,206,.28); } .district-family-name { color:var(--umber); font-size:.82rem; font-weight:700; } .district-family-meta,.district-family-value { color:var(--grey-brown); font-size:.72rem; line-height:1.5; } .district-family-meta { margin-top:.35rem; font-family:ui-monospace,SFMono-Regular,Menlo,monospace; font-size:.64rem; word-break:break-word; } .district-family-label { display:block; margin-bottom:.25rem; color:var(--grey-brown); font-size:.62rem; letter-spacing:.05em; text-transform:uppercase; } .district-family-status { display:inline-flex; align-items:center; gap:.4rem; color:var(--grey-brown); } .district-family-status::before { content:''; width:.48rem; height:.48rem; border-radius:50%; background:var(--ochre); } .district-family-status.is-complete::before { background:var(--grey-brown); } .district-families-labels { display:grid; grid-template-columns:minmax(14rem,1.4fr) minmax(12rem,1.1fr) minmax(11rem,1fr) minmax(10rem,1fr); gap:1rem; padding:1rem 0; color:var(--grey-brown); font-size:.68rem; font-weight:700; letter-spacing:.08em; text-transform:uppercase; border-bottom:1px solid var(--line); }
        .district-families-state { padding:3.5rem 1rem; border-top:1px solid var(--line); border-bottom:1px solid var(--line); color:var(--grey-brown); text-align:center; font-size:.8rem; } .district-families-error { color:var(--terracotta); } .district-families-retry { display:inline-flex; align-items:center; gap:.4rem; margin-top:.8rem; border:1px solid var(--line); background:transparent; color:var(--terracotta); padding:.5rem .75rem; cursor:pointer; font:inherit; font-size:.72rem; } .district-families-skeleton { height:6rem; border-bottom:1px solid var(--line); background:#EFE7DC; animation:district-families-pulse 1.4s ease-in-out infinite; } @keyframes district-families-pulse { 0%,100% { opacity:.45; } 50% { opacity:.8; } }
        @media (max-width:780px) { .district-families-filters { grid-template-columns:1fr; } .district-families-labels { display:none; } .district-family-row { grid-template-columns:1fr 1fr; gap:.8rem 1rem; } .district-family-main { grid-column:1 / -1; } .district-family-value::before { content:attr(data-label); display:block; margin-bottom:.25rem; color:var(--grey-brown); font-size:.62rem; letter-spacing:.05em; text-transform:uppercase; } }
      `}</style>
      <header className="district-families-heading"><h1 className="district-families-title">Families</h1><p className="district-families-subtitle">Affected families and their linked parcels, projects and R&amp;R records.</p></header>
      <div className="district-families-toolbar"><span className="district-families-count">{loading ? 'Loading families...' : `${filteredFamilies.length} famil${filteredFamilies.length === 1 ? 'y' : 'ies'} shown`}</span><button type="button" className="district-families-filter" onClick={() => setFiltersOpen((current) => !current)} aria-expanded={filtersOpen}><Filter size={14} /> Filters</button></div>
      {filtersOpen && <div className="district-families-filters"><label className="district-families-search"><Search size={14} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search family, parcel or project" /></label><label className="district-families-select"><select value={project} onChange={(event) => setProject(event.target.value)}><option value="">All projects</option>{projects.map((item) => <option key={item._id} value={item._id}>{item.code || item.name}</option>)}</select></label></div>}
      {loading && <div className="district-families-list"><div className="district-families-skeleton" /><div className="district-families-skeleton" /></div>}
      {!loading && error && <div className="district-families-state district-families-error">{error}<br /><button type="button" className="district-families-retry" onClick={fetchFamilies}><RotateCw size={13} /> Retry</button></div>}
      {!loading && !error && filteredFamilies.length === 0 && <div className="district-families-state">No families found.</div>}
      {!loading && !error && filteredFamilies.length > 0 && <div className="district-families-list"><div className="district-families-labels"><span>Family</span><span>Parcel(s)</span><span>Project</span><span>R&amp;R status</span></div>{filteredFamilies.map((family) => { const rrPackage = getRrPackage(family._id); return <article className="district-family-row" key={family._id}><div className="district-family-main"><div className="district-family-name">{family.familyHeadName || 'Unavailable'}</div><div className="district-family-meta">{family._id || 'Family identifier unavailable'} · {family.membersCount ?? 'Unavailable'} members</div></div><div className="district-family-value" data-label="Parcel(s)">{family.parcels?.length ? family.parcels.map((parcel) => parcel.surveyNumber || parcel._id).join(', ') : 'Unavailable'}</div><div className="district-family-value" data-label="Project">{family.project?.name || family.project?.code || 'Unavailable'}</div><div className={`district-family-value district-family-status ${rrPackage?.deliveryStatus === 'FULLY_DELIVERED' ? 'is-complete' : ''}`} data-label="R&R status">{rrPackage ? formatLabel(rrPackage.deliveryStatus) : 'Unavailable'}</div></article>; })}</div>}
    </div>
  );
};

export default DistrictFamilies;
