import React, { useEffect, useMemo, useState } from 'react';
import { Filter, RotateCw, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import projectApi from '../../services/api/projectApi';

const statusTone = (status) => {
  if (status === 'COMPLETED' || status === 'LITIGATION_STAYED') return 'closed';
  if (status === 'PROPOSAL_SUBMITTED' || status === 'SIA_INITIATED') return 'pending';
  return 'progress';
};

const riskTone = (risk) => {
  if (risk === 'HIGH' || risk === 'CRITICAL') return 'urgent';
  if (risk === 'MEDIUM') return 'medium';
  return 'neutral';
};

const StatusDot = ({ tone }) => <span className={`district-project-dot district-project-dot-${tone}`} aria-hidden="true" />;

const formatLabel = (value) => value?.replace(/_/g, ' ') || 'Not available';

const ProjectRow = ({ project }) => (
  <article className="district-project-row">
    <div className="district-project-main">
      <div className="district-project-name">{project.name || 'Not available'}</div>
      <div className="district-project-code">{project.code || 'Project code unavailable'}</div>
    </div>
    <div className="district-project-value" data-label="Status">
      <StatusDot tone={statusTone(project.status)} />
      <span>{formatLabel(project.status)}</span>
    </div>
    <div className="district-project-value" data-label="Risk">
      <StatusDot tone={riskTone(project.riskLevel)} />
      <span>{formatLabel(project.riskLevel)}</span>
    </div>
    <div className="district-project-value district-project-acquisition" data-label="Acquisition %">
      <span>—</span>
      <small>Unavailable</small>
    </div>
    <div className="district-project-action">
      <Link to={`/district/projects/${project._id}`}>View details <span aria-hidden="true">→</span></Link>
    </div>
  </article>
);

export const DistrictProjects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [risk, setRisk] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await projectApi.getProjects();
      setProjects(Array.isArray(response.data?.data) ? response.data.data : []);
    } catch (requestError) {
      setProjects([]);
      setError('Projects could not be loaded. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesSearch = !query || [project.name, project.code].some((value) => value?.toLowerCase().includes(query));
      const matchesStatus = !status || project.status === status;
      const matchesRisk = !risk || project.riskLevel === risk;
      return matchesSearch && matchesStatus && matchesRisk;
    });
  }, [projects, risk, search, status]);

  const statusOptions = [...new Set(projects.map((project) => project.status).filter(Boolean))];
  const riskOptions = [...new Set(projects.map((project) => project.riskLevel).filter(Boolean))];

  return (
    <div className="district-projects-page">
      <style>{`
        .district-projects-page { --terracotta:#B84D28; --umber:#4A2E1B; --ochre:#C07D38; --grey-brown:#6C625B; --paper:#F8F4ED; --line:#DDD3C7; --tan:#E8D9C4; color:var(--umber); }
        .district-projects-heading { display:flex; align-items:flex-end; justify-content:space-between; gap:1.5rem; padding:1.5rem 0 2rem; border-bottom:1px solid var(--line); }
        .district-projects-title { margin:0; color:var(--umber); font-size:2.35rem; font-weight:500; letter-spacing:-.03em; }
        .district-projects-subtitle { margin:.6rem 0 0; color:var(--grey-brown); font-size:.88rem; }
        .district-projects-context { color:var(--grey-brown); font-size:.74rem; text-align:right; }
        .district-projects-toolbar { display:flex; justify-content:space-between; align-items:center; gap:1rem; padding:1.25rem 0; }
        .district-projects-count { color:var(--grey-brown); font-size:.75rem; }
        .district-projects-filter-button { display:inline-flex; align-items:center; gap:.45rem; border:1px solid var(--line); background:transparent; color:var(--umber); padding:.55rem .8rem; font:inherit; font-size:.75rem; cursor:pointer; }
        .district-projects-filter-button:hover { border-color:var(--terracotta); color:var(--terracotta); }
        .district-projects-filters { display:grid; grid-template-columns:minmax(0,1fr) 12rem 12rem; gap:.75rem; padding:0 0 1.25rem; }
        .district-projects-search,.district-projects-select { display:flex; align-items:center; gap:.5rem; min-height:2.35rem; border:1px solid var(--line); background:#FFFDF9; color:var(--grey-brown); padding:0 .7rem; }
        .district-projects-search input,.district-projects-select select { width:100%; border:0; outline:0; background:transparent; color:var(--umber); font:inherit; font-size:.75rem; }
        .district-projects-select select { cursor:pointer; }
        .district-projects-list { border-top:1px solid var(--line); }
        .district-projects-labels,.district-project-row { display:grid; grid-template-columns:minmax(16rem,2fr) minmax(9rem,1fr) minmax(7rem,.8fr) minmax(7rem,.8fr) 7rem; gap:1rem; align-items:center; }
        .district-projects-labels { padding:1rem 0; color:var(--grey-brown); font-size:.68rem; font-weight:700; letter-spacing:.08em; text-transform:uppercase; border-bottom:1px solid var(--line); }
        .district-project-row { min-height:5.7rem; border-bottom:1px solid var(--line); }
        .district-project-row:hover { background:rgba(234,216,206,.28); }
        .district-project-name { color:var(--umber); font-size:.82rem; font-weight:700; line-height:1.35; }
        .district-project-code { margin-top:.35rem; color:var(--grey-brown); font-family:ui-monospace,SFMono-Regular,Menlo,monospace; font-size:.68rem; }
        .district-project-value { display:flex; align-items:center; gap:.45rem; color:var(--grey-brown); font-size:.74rem; }
        .district-project-dot { width:.48rem; height:.48rem; flex:0 0 .48rem; border-radius:50%; }
        .district-project-dot-pending { background:var(--tan); } .district-project-dot-progress { background:var(--ochre); } .district-project-dot-urgent { background:var(--terracotta); } .district-project-dot-medium { background:var(--ochre); } .district-project-dot-neutral,.district-project-dot-closed { background:var(--grey-brown); }
        .district-project-acquisition { display:flex; align-items:baseline; gap:.35rem; color:var(--umber); font-size:.9rem; font-weight:600; }
        .district-project-acquisition small { color:var(--grey-brown); font-size:.62rem; font-weight:400; }
        .district-project-action { text-align:right; }
        .district-project-action a { color:var(--terracotta); font-size:.72rem; text-decoration:none; white-space:nowrap; }
        .district-project-action a:hover { text-decoration:underline; }
        .district-projects-state { padding:3.5rem 1rem; border-top:1px solid var(--line); border-bottom:1px solid var(--line); color:var(--grey-brown); text-align:center; font-size:.8rem; }
        .district-projects-error { color:var(--terracotta); }
        .district-projects-retry { display:inline-flex; align-items:center; gap:.4rem; margin-top:1rem; border:1px solid var(--line); background:transparent; color:var(--terracotta); padding:.5rem .75rem; cursor:pointer; font:inherit; font-size:.72rem; }
        .district-projects-skeleton { height:5.7rem; border-bottom:1px solid var(--line); background:#EFE7DC; animation:district-projects-pulse 1.4s ease-in-out infinite; }
        @keyframes district-projects-pulse { 0%,100% { opacity:.45; } 50% { opacity:.8; } }
        @media (max-width:760px) { .district-projects-heading,.district-projects-toolbar { align-items:flex-start; flex-direction:column; } .district-projects-context { text-align:left; } .district-projects-filters { grid-template-columns:1fr; } .district-projects-labels { display:none; } .district-project-row { display:grid; grid-template-columns:1fr 1fr; gap:.7rem 1rem; padding:1.15rem 0; } .district-project-main { grid-column:1 / -1; } .district-project-value { min-width:0; } .district-project-value::before { content:attr(data-label); display:block; min-width:5.6rem; color:var(--grey-brown); font-size:.64rem; text-transform:uppercase; letter-spacing:.05em; } .district-project-acquisition small { display:none; } .district-project-action { grid-column:1 / -1; text-align:left; padding-top:.2rem; } }
      `}</style>

      <header className="district-projects-heading">
        <div>
          <h1 className="district-projects-title">Projects</h1>
          <p className="district-projects-subtitle">Monitor and manage land-acquisition projects across the district.</p>
        </div>
        <div className="district-projects-context">{user?.jurisdiction?.district || 'Current district'} · {projects.length} records</div>
      </header>

      <div className="district-projects-toolbar">
        <span className="district-projects-count">{loading ? 'Loading projects…' : `${filteredProjects.length} project${filteredProjects.length === 1 ? '' : 's'} shown`}</span>
        <button type="button" className="district-projects-filter-button" onClick={() => setFiltersOpen((current) => !current)} aria-expanded={filtersOpen}><Filter size={14} /> Filters</button>
      </div>

      {filtersOpen && (
        <div className="district-projects-filters">
          <label className="district-projects-search"><Search size={14} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by project name or code" /></label>
          <label className="district-projects-select"><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="">All statuses</option>{statusOptions.map((option) => <option key={option} value={option}>{formatLabel(option)}</option>)}</select></label>
          <label className="district-projects-select"><select value={risk} onChange={(event) => setRisk(event.target.value)}><option value="">All risks</option>{riskOptions.map((option) => <option key={option} value={option}>{formatLabel(option)}</option>)}</select></label>
        </div>
      )}

      {loading && <div className="district-projects-list" aria-label="Loading projects"><div className="district-projects-skeleton" /><div className="district-projects-skeleton" /><div className="district-projects-skeleton" /></div>}
      {!loading && error && <div className="district-projects-state district-projects-error">{error}<br /><button type="button" className="district-projects-retry" onClick={fetchProjects}><RotateCw size={13} /> Retry</button></div>}
      {!loading && !error && filteredProjects.length === 0 && <div className="district-projects-state">No projects found in the current district.</div>}
      {!loading && !error && filteredProjects.length > 0 && <div className="district-projects-list"><div className="district-projects-labels"><span>Project</span><span>Status</span><span>Risk</span><span>Acquisition %</span><span /></div>{filteredProjects.map((project) => <ProjectRow key={project._id || project.code} project={project} />)}</div>}
    </div>
  );
};

export default DistrictProjects;
