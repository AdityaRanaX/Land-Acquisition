import React, { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, ChevronDown, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GISMap } from '../../components/gis/GISMap';
import { useAuth } from '../../hooks/useAuth';
import { useGIS } from '../../hooks/useGIS';
import apiClient from '../../services/api/apiClient';

const formatActivityTime = (value) => {
  if (!value) return 'Recent';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return Date.now() - date.getTime() > 86400000 ? 'Yesterday' : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const StatusDot = ({ tone = 'pending' }) => <span className={`status-dot status-dot-${tone}`} aria-hidden="true" />;

const Kpi = ({ label, value, detail, tone }) => (
  <article className="district-kpi">
    <div className="district-kpi-label"><StatusDot tone={tone} />{label}</div>
    <div className="district-kpi-value">{value}</div>
    {detail && <div className="district-kpi-detail">{detail}</div>}
  </article>
);

export const DistrictDashboard = () => {
  const { user } = useAuth();
  const { geoJsonData, stats, setSelectedParcel, loading: gisLoading } = useGIS();
  const [projects, setProjects] = useState([]);
  const [parcels, setParcels] = useState([]);
  const [compensation, setCompensation] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [rrPackages, setRrPackages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [audit, setAudit] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMoreStats, setShowMoreStats] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let mounted = true;
    const fetchDashboardData = async () => {
      const requests = await Promise.allSettled([
        apiClient.get('/projects'),
        apiClient.get('/parcels'),
        apiClient.get('/compensation'),
        apiClient.get('/documents'),
        apiClient.get('/rr'),
        apiClient.get('/notifications'),
        apiClient.get('/audit?limit=6')
      ]);
      if (!mounted) return;
      const getData = (index) => requests[index].status === 'fulfilled' ? requests[index].value.data?.data : [];
      setProjects(Array.isArray(getData(0)) ? getData(0) : []);
      setParcels(Array.isArray(getData(1)) ? getData(1) : []);
      setCompensation(Array.isArray(getData(2)) ? getData(2) : []);
      setDocuments(Array.isArray(getData(3)) ? getData(3) : []);
      setRrPackages(Array.isArray(getData(4)) ? getData(4) : []);
      setNotifications(Array.isArray(getData(5)) ? getData(5) : []);
      setAudit(Array.isArray(getData(6)) ? getData(6) : []);
      setLoading(false);
    };
    fetchDashboardData();
    return () => { mounted = false; };
  }, []);

  const kpis = useMemo(() => {
    const pendingVerification = parcels.filter((parcel) => !parcel.fieldVerification?.isVerified).length;
    const highRiskCases = projects.filter((project) => ['HIGH', 'CRITICAL'].includes(project.riskLevel)).length + parcels.filter((parcel) => parcel.acquisitionStatus === 'DISPUTED').length;
    const pendingCompensationCount = compensation.filter((award) => award.disbursementStatus !== 'DISBURSED').length;

    return {
      activeProjects: loading ? '...' : projects.length,
      pendingVerification: loading ? '...' : pendingVerification,
      highRiskCases: loading ? '...' : highRiskCases,
      compensationPending: loading ? '...' : (pendingCompensationCount > 0 ? `${pendingCompensationCount} cases` : '0')
    };
  }, [compensation, parcels, projects, loading]);

  const activity = useMemo(() => {
    const auditItems = audit.map((item) => ({
      time: formatActivityTime(item.timestamp),
      action: item.action?.replace(/_/g, ' ').toLowerCase().replace(/^\w/, (letter) => letter.toUpperCase()) || 'Action performed',
      entity: item.userEmail || item.module || 'District administration'
    }));
    const notificationItems = notifications.slice(0, 4).map((item) => ({
      time: formatActivityTime(item.createdAt),
      action: item.title,
      entity: item.message
    }));
    return [...auditItems, ...notificationItems].slice(0, 4);
  }, [audit, notifications]);

  const filteredParcels = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return parcels;
    return parcels.filter((parcel) =>
      [parcel.surveyNumber, parcel.village, parcel.primaryOwnerName].some((value) => value?.toLowerCase().includes(query))
    );
  }, [parcels, search]);

  const visibleFeatures = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return geoJsonData?.features || [];
    return (geoJsonData?.features || []).filter((feature) =>
      [feature.properties?.surveyNumber, feature.properties?.village, feature.properties?.primaryOwnerName].some((value) => value?.toLowerCase().includes(query))
    );
  }, [geoJsonData, search]);

  const secondaryStats = [
    ['Parcels Acquired', stats?.awardedParcels ?? parcels.filter((parcel) => parcel.acquisitionStatus === 'AWARD_PRONOUNCED').length],
    ['Documents Pending', documents.filter((document) => document.verificationStatus === 'PENDING').length],
    ['Disputed Parcels', stats?.disputedParcels ?? parcels.filter((parcel) => parcel.acquisitionStatus === 'DISPUTED').length],
    ['R&R Pending', rrPackages.filter((item) => item.deliveryStatus !== 'FULLY_DELIVERED').length]
  ];

  const priorityActions = useMemo(() => {
    const actions = [];
    if (kpis.pendingVerification > 0) {
      actions.push({
        title: 'Parcel verification required',
        detail: `${kpis.pendingVerification} parcels pending ground survey verification`,
        to: '/district/parcels'
      });
    }
    if (compensation.length > 0) {
      actions.push({
        title: 'Compensation queue',
        detail: `${compensation.length} statutory compensation records active`,
        to: '/district/compensation'
      });
    }
    if (kpis.highRiskCases > 0) {
      actions.push({
        title: 'High-risk cases active',
        detail: `${kpis.highRiskCases} high risk projects/disputed parcels flagged`,
        to: '/district/delay-radar'
      });
    }
    if (actions.length === 0) {
      actions.push({
        title: 'All clear',
        detail: 'No urgent pending priority actions flagged',
        to: '/district/projects'
      });
    }
    return actions;
  }, [kpis, compensation]);

  return (
    <div className="district-dashboard">
      <style>{`
        .district-dashboard { --terracotta:#B84D28; --umber:#4A2E1B; --ochre:#C07D38; --grey-brown:#6C625B; --paper:#F8F4ED; --line:#DDD3C7; --tan:#E8D9C4; min-height:calc(100vh - 3rem); margin:-1.5rem; padding:2rem clamp(1.25rem,4vw,4rem) 4rem; background:var(--paper); color:var(--umber); }
        .district-dashboard * { box-sizing:border-box; } .district-dashboard-header,.district-title-row { display:flex; justify-content:space-between; gap:2rem; } .district-dashboard-header { align-items:flex-start; padding-bottom:1.25rem; border-bottom:1px solid var(--line); } .district-overline { color:var(--terracotta); font-size:.7rem; font-weight:700; letter-spacing:.13em; text-transform:uppercase; } .district-brand,.district-context,.district-subtitle,.district-date,.district-kpi-label,.district-kpi-detail,.district-map-footer,.district-section-heading p,.district-action-detail,.district-activity-entity,.district-empty { color:var(--grey-brown); } .district-brand { margin-top:.45rem; font-size:.8rem; } .district-context { display:flex; align-items:center; gap:1.5rem; font-size:.72rem; } .district-context strong,.district-date strong { color:var(--umber); } .district-search { display:flex; align-items:center; gap:.5rem; min-width:12rem; padding:.35rem 0; border-bottom:1px solid var(--grey-brown); } .district-search input { width:100%; border:0; outline:0; background:transparent; color:var(--umber); font:inherit; } .district-search input::placeholder { color:var(--grey-brown); } .district-title-row { align-items:flex-end; padding:2.75rem 0 2rem; } .district-title { margin:0; color:var(--umber); font-size:clamp(2rem,4vw,3.5rem); font-weight:500; letter-spacing:-.03em; line-height:1; } .district-subtitle { margin:.7rem 0 0; font-size:.9rem; } .district-date { text-align:right; font-size:.75rem; line-height:1.6; } .district-kpis { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); border-top:1px solid var(--line); border-bottom:1px solid var(--line); } .district-kpi { margin-right:1.25rem; padding:1.4rem 1.25rem 1.5rem 0; border-right:1px solid var(--line); } .district-kpi:last-child { margin-right:0; border-right:0; } .district-kpi-label { display:flex; align-items:center; gap:.45rem; font-size:.72rem; } .district-kpi-value { margin-top:.8rem; color:var(--umber); font-size:2rem; font-weight:600; letter-spacing:-.04em; } .district-kpi-detail { margin-top:.25rem; font-size:.72rem; } .status-dot { display:inline-block; width:.48rem; height:.48rem; flex:0 0 .48rem; border-radius:50%; } .status-dot-pending { background:var(--tan); } .status-dot-progress { background:var(--ochre); } .status-dot-urgent { background:var(--terracotta); } .status-dot-closed { background:var(--grey-brown); } .district-more { display:flex; justify-content:flex-end; padding:.8rem 0; border-bottom:1px solid var(--line); } .district-more button,.district-link { border:0; background:transparent; color:var(--terracotta); cursor:pointer; font:inherit; font-size:.75rem; padding:0; } .district-more svg { margin-left:.35rem; vertical-align:middle; transition:transform .2s ease; } .district-more svg.open { transform:rotate(180deg); } .district-secondary { display:grid; grid-template-columns:repeat(4,1fr); border-bottom:1px solid var(--line); } .district-secondary div { padding:1rem 1rem 1rem 0; color:var(--grey-brown); font-size:.72rem; border-right:1px solid var(--line); } .district-secondary div:not(:first-child) { padding-left:1rem; } .district-secondary div:last-child { border-right:0; } .district-secondary strong { display:block; margin-bottom:.2rem; color:var(--umber); font-size:1.1rem; } .district-gis-section { padding-top:2.5rem; } .district-section-heading { display:flex; justify-content:space-between; align-items:baseline; gap:1rem; margin-bottom:1rem; } .district-section-heading h2 { margin:0; color:var(--umber); font-size:1rem; font-weight:700; } .district-section-heading p { margin:0; font-size:.72rem; } .district-gis-wrap { padding:.4rem; border:1px solid var(--line); background:#EDE7DD; } .district-gis-wrap > div { border-radius:0 !important; box-shadow:none !important; border-color:var(--line) !important; } .district-map-footer { display:flex; justify-content:space-between; gap:1rem; padding-top:.8rem; font-size:.72rem; } .district-actions-activity { display:grid; grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr); gap:3rem; padding-top:2.5rem; } .district-action-list,.district-activity-list { border-top:1px solid var(--line); } .district-action,.district-activity { display:flex; align-items:center; justify-content:space-between; gap:1rem; padding:1rem 0; border-bottom:1px solid var(--line); } .district-action-title,.district-activity-action { color:var(--umber); font-size:.78rem; font-weight:700; } .district-action-detail,.district-activity-entity { margin-top:.25rem; font-size:.7rem; } .district-action a { color:var(--terracotta); font-size:.72rem; text-decoration:none; white-space:nowrap; } .district-activity { align-items:flex-start; justify-content:flex-start; } .district-activity-time { width:4.5rem; flex:0 0 4.5rem; color:var(--ochre); font-size:.7rem; font-weight:700; } .district-empty { padding:1.2rem 0; font-size:.75rem; } @media (max-width:900px) { .district-kpis { grid-template-columns:repeat(2,1fr); } .district-kpi:nth-child(2) { border-right:0; } .district-kpi:nth-child(n+3) { border-top:1px solid var(--line); } .district-actions-activity { grid-template-columns:1fr; gap:2rem; } } @media (max-width:640px) { .district-dashboard-header,.district-title-row { flex-direction:column; align-items:flex-start; } .district-context { flex-wrap:wrap; gap:.8rem 1rem; } .district-search { min-width:100%; } .district-date { text-align:left; } .district-kpi-value { font-size:1.5rem; } .district-secondary { grid-template-columns:1fr 1fr; } .district-secondary div:nth-child(3),.district-secondary div:nth-child(4) { border-top:1px solid var(--line); } }
      `}</style>

      <header className="district-dashboard-header">
        <div>
          <div className="district-overline">SIH26016 / District Authority</div>
          <div className="district-brand">District Administration · Acquisition Console</div>
        </div>
        <div className="district-context">
          <label className="district-search">
            <Search size={14} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search parcels"
              aria-label="Search parcels"
            />
          </label>
          <span><strong>{user?.jurisdiction?.district || 'Pune'}</strong> District</span>
          <span>{new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}</span>
        </div>
      </header>

      <section className="district-title-row">
        <div>
          <h1 className="district-title">District Overview</h1>
          <p className="district-subtitle">Land acquisition activity and pending actions across the district.</p>
        </div>
        <div className="district-date">
          <strong>{user?.name || 'District Collector'}</strong><br />
          {user?.designation || 'Land Acquisition Authority'}
        </div>
      </section>

      <section className="district-kpis" aria-label="District key performance indicators">
        <Kpi label="Active Projects" value={kpis.activeProjects} detail="Total acquisition projects" tone="progress" />
        <Kpi label="Parcels Pending Verification" value={kpis.pendingVerification} detail="Ground survey pending" tone="pending" />
        <Kpi label="High-Risk Cases" value={kpis.highRiskCases} detail="Projects / Disputed parcels" tone="urgent" />
        <Kpi label="Compensation Pending" value={kpis.compensationPending} detail="Awards pending disbursement" tone="urgent" />
      </section>

      <div className="district-more">
        <button type="button" onClick={() => setShowMoreStats((current) => !current)} aria-expanded={showMoreStats}>
          {showMoreStats ? 'Hide more stats' : 'Show more stats'} <ChevronDown size={14} className={showMoreStats ? 'open' : ''} />
        </button>
      </div>

      {showMoreStats && (
        <section className="district-secondary" aria-label="Secondary statistics">
          {secondaryStats.map(([label, value]) => (
            <div key={label}><strong>{value}</strong>{label}</div>
          ))}
        </section>
      )}

      <section className="district-gis-section" id="district-gis">
        <div className="district-section-heading">
          <div>
            <h2>District GIS Overview</h2>
            <p>Cadastral boundaries and acquisition status across district.</p>
          </div>
          <Link className="district-link" to="/district/gis">Open Full GIS Map <ArrowUpRight size={13} /></Link>
        </div>
        <div className="district-gis-wrap">
          <GISMap features={visibleFeatures} stats={stats} onSelectParcel={setSelectedParcel} height="350px" />
        </div>
        <div className="district-map-footer">
          <span>{gisLoading ? 'Loading spatial records…' : `${visibleFeatures.length} parcel boundaries available`}</span>
          <span><StatusDot tone="urgent" /> Disputed &nbsp;&nbsp; <StatusDot tone="progress" /> In progress &nbsp;&nbsp; <StatusDot tone="pending" /> Pending review</span>
        </div>
      </section>

      <section className="district-actions-activity">
        <div>
          <div className="district-section-heading">
            <h2>Priority Actions</h2>
            <p>Requires attention</p>
          </div>
          <div className="district-action-list">
            {priorityActions.map((item) => (
              <div className="district-action" key={item.title}>
                <div>
                  <div className="district-action-title">
                    <StatusDot tone={item.title.includes('High-risk') ? 'urgent' : 'progress'} />
                    <span style={{ marginLeft:'.45rem' }}>{item.title}</span>
                  </div>
                  <div className="district-action-detail">{item.detail}</div>
                </div>
                <Link to={item.to}>Review <ArrowUpRight size={13} /></Link>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="district-section-heading">
            <h2>Recent Activity</h2>
            <p>Latest district actions</p>
          </div>
          <div className="district-activity-list">
            {loading ? (
              <div className="district-empty">Loading recent activity…</div>
            ) : activity.length > 0 ? (
              activity.map((item, index) => (
                <div className="district-activity" key={`${item.time}-${index}`}>
                  <div className="district-activity-time">{item.time}</div>
                  <div>
                    <div className="district-activity-action">{item.action}</div>
                    <div className="district-activity-entity">{item.entity}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="district-empty">No recent district activity recorded.</div>
            )}
          </div>
        </div>
      </section>

      {loading && !filteredParcels.length && <div className="district-empty">Loading district records…</div>}
    </div>
  );
};

export default DistrictDashboard;
