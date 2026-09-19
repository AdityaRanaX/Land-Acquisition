import React, { useEffect, useState } from 'react';
import { ArrowLeft, Check, RotateCw, X } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import projectApi from '../../services/api/projectApi';

const formatLabel = (value) => value?.replace(/_/g, ' ') || 'Unavailable';
const formatDate = (value) => value ? new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Unavailable';
const formatINR = (value) => typeof value === 'number' ? `₹${value.toLocaleString('en-IN')}` : 'Unavailable';

const StatusDot = ({ tone }) => <span className={`project-detail-dot project-detail-dot-${tone}`} aria-hidden="true" />;

const statusTone = (status) => {
  if (status === 'COMPLETED' || status === 'LITIGATION_STAYED') return 'closed';
  if (status === 'PROPOSAL_SUBMITTED') return 'pending';
  return 'progress';
};

const riskTone = (risk) => {
  if (risk === 'HIGH' || risk === 'CRITICAL') return 'urgent';
  if (risk === 'MEDIUM') return 'progress';
  return 'neutral';
};

const milestoneTone = (status) => {
  if (status === 'COMPLETED') return 'closed';
  if (status === 'DELAYED') return 'urgent';
  if (status === 'IN_PROGRESS') return 'progress';
  return 'pending';
};

export const DistrictProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mutationError, setMutationError] = useState('');
  const [actionLoading, setActionLoading] = useState('');
  const [remarks, setRemarks] = useState('');

  const fetchProject = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await projectApi.getProjectById(id);
      setProject(response.data?.data || null);
      if (!response.data?.data) setError('Project not found.');
    } catch (requestError) {
      setProject(null);
      setError(requestError.response?.status === 404 ? 'Project not found.' : 'Unable to load project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const runAction = async (action) => {
    if (action === 'REJECT' && !window.confirm('Reject this project proposal?')) return;
    setActionLoading(action);
    setMutationError('');
    try {
      const data = { action };
      if (remarks.trim() && action !== 'APPROVE') data.remarks = remarks.trim();
      const response = await projectApi.updateProject(id, data);
      setProject(response.data?.data || null);
      setRemarks('');
    } catch (requestError) {
      setMutationError(requestError.response?.data?.message || 'Unable to update project. Please try again.');
    } finally {
      setActionLoading('');
    }
  };

  if (loading) return <div className="project-detail-state">Loading project...</div>;
  if (error) {
    return (
      <div className="project-detail-state project-detail-error">
        <p>{error}</p>
        <button type="button" className="project-detail-retry" onClick={fetchProject}><RotateCw size={14} /> Retry</button>
      </div>
    );
  }
  if (!project) return <div className="project-detail-state">Project not found.</div>;

  const canAct = project.status === 'PROPOSAL_SUBMITTED';

  return (
    <div className="project-detail-page">
      <style>{`
        .project-detail-page { --terracotta:#B84D28; --umber:#4A2E1B; --ochre:#C07D38; --grey-brown:#6C625B; --paper:#F8F4ED; --line:#DDD3C7; --tan:#E8D9C4; color:var(--umber); }
        .project-detail-back { display:inline-flex; align-items:center; gap:.45rem; color:var(--terracotta); font-size:.75rem; text-decoration:none; }
        .project-detail-header { display:flex; justify-content:space-between; align-items:flex-end; gap:2rem; padding:1.5rem 0 2rem; border-bottom:1px solid var(--line); }
        .project-detail-overline { color:var(--grey-brown); font-family:ui-monospace,SFMono-Regular,Menlo,monospace; font-size:.7rem; }
        .project-detail-title { margin:.55rem 0 0; color:var(--umber); font-size:clamp(1.8rem,3.5vw,2.8rem); font-weight:500; letter-spacing:-.03em; }
        .project-detail-districts { margin:.55rem 0 0; color:var(--grey-brown); font-size:.78rem; }
        .project-detail-statuses { display:flex; align-items:center; gap:.6rem; flex-wrap:wrap; justify-content:flex-end; }
        .project-detail-status { display:inline-flex; align-items:center; gap:.4rem; border:1px solid var(--line); padding:.45rem .65rem; color:var(--grey-brown); font-size:.7rem; }
        .project-detail-status-urgent { color:var(--terracotta); border-color:#D9B8A8; } .project-detail-status-progress { color:var(--ochre); border-color:#E2C7A7; } .project-detail-status-closed { color:var(--grey-brown); } .project-detail-status-pending { color:var(--grey-brown); }
        .project-detail-grid { display:grid; grid-template-columns:minmax(0,1.25fr) minmax(16rem,.75fr); gap:3rem; padding-top:2rem; }
        .project-detail-section { padding:1.5rem 0; border-bottom:1px solid var(--line); }
        .project-detail-section:first-child { padding-top:0; }
        .project-detail-section h2 { margin:0 0 1rem; color:var(--umber); font-size:1rem; font-weight:700; }
        .project-detail-description { color:var(--grey-brown); font-size:.82rem; line-height:1.7; white-space:pre-line; }
        .project-detail-purpose { color:var(--grey-brown); font-size:.78rem; }
        .project-detail-facts { display:grid; grid-template-columns:1fr 1fr; border-top:1px solid var(--line); }
        .project-detail-fact { padding:1rem .8rem 1rem 0; border-bottom:1px solid var(--line); }
        .project-detail-fact:nth-child(even) { padding-left:.8rem; border-left:1px solid var(--line); }
        .project-detail-fact-label { color:var(--grey-brown); font-size:.65rem; text-transform:uppercase; letter-spacing:.06em; }
        .project-detail-fact-value { display:block; margin-top:.35rem; color:var(--umber); font-size:.8rem; font-weight:600; word-break:break-word; }
        .project-detail-milestones { border-top:1px solid var(--line); }
        .project-detail-milestone { display:grid; grid-template-columns:minmax(0,1fr) auto; gap:1rem; padding:1rem 0; border-bottom:1px solid var(--line); }
        .project-detail-milestone-title { display:flex; align-items:center; gap:.5rem; color:var(--umber); font-size:.78rem; font-weight:600; }
        .project-detail-milestone-meta { margin:.35rem 0 0 1rem; color:var(--grey-brown); font-size:.68rem; line-height:1.5; }
        .project-detail-milestone-status { align-self:start; color:var(--grey-brown); font-size:.68rem; text-align:right; }
        .project-detail-dot { display:inline-block; width:.48rem; height:.48rem; flex:0 0 .48rem; border-radius:50%; } .project-detail-dot-pending { background:var(--tan); } .project-detail-dot-progress { background:var(--ochre); } .project-detail-dot-urgent { background:var(--terracotta); } .project-detail-dot-neutral,.project-detail-dot-closed { background:var(--grey-brown); }
        .project-detail-map { display:flex; align-items:center; justify-content:center; min-height:12rem; border:1px solid var(--line); color:var(--grey-brown); font-size:.78rem; text-align:center; }
        .project-detail-actions { padding-top:1.5rem; }
        .project-detail-actions h2 { margin-bottom:.45rem; }
        .project-detail-actions-copy { margin:0 0 1rem; color:var(--grey-brown); font-size:.72rem; line-height:1.5; }
        .project-detail-remarks { width:100%; min-height:4.5rem; resize:vertical; border:1px solid var(--line); background:#FFFDF9; color:var(--umber); padding:.65rem; outline:0; font:inherit; font-size:.75rem; }
        .project-detail-remarks:focus { border-color:var(--terracotta); }
        .project-detail-action-row { display:flex; flex-wrap:wrap; gap:.55rem; margin-top:.75rem; }
        .project-detail-action { border:1px solid var(--line); background:transparent; color:var(--terracotta); padding:.6rem .75rem; cursor:pointer; font:inherit; font-size:.72rem; }
        .project-detail-action:hover { background:#EAD8CE; } .project-detail-action:disabled { cursor:wait; opacity:.55; }
        .project-detail-action-reject { color:var(--terracotta); } .project-detail-mutation-error { margin:.75rem 0 0; color:var(--terracotta); font-size:.72rem; }
        .project-detail-state { padding:4rem 1rem; color:var(--grey-brown); text-align:center; font-size:.82rem; } .project-detail-error { color:var(--terracotta); } .project-detail-retry { display:inline-flex; align-items:center; gap:.4rem; margin-top:.8rem; border:1px solid var(--line); background:transparent; color:var(--terracotta); padding:.55rem .75rem; cursor:pointer; font:inherit; font-size:.72rem; }
        @media (max-width:760px) { .project-detail-header { align-items:flex-start; flex-direction:column; } .project-detail-statuses { justify-content:flex-start; } .project-detail-grid { grid-template-columns:1fr; gap:0; } .project-detail-facts { grid-template-columns:1fr; } .project-detail-fact:nth-child(even) { padding-left:0; border-left:0; } .project-detail-milestone { grid-template-columns:1fr; gap:.4rem; } .project-detail-milestone-status { text-align:left; margin-left:1rem; } }
      `}</style>

      <Link className="project-detail-back" to="/district/projects"><ArrowLeft size={14} /> District / Projects / {project.name || 'Project'}</Link>
      <header className="project-detail-header">
        <div>
          <div className="project-detail-overline">{project.code || 'Project code unavailable'}</div>
          <h1 className="project-detail-title">{project.name || 'Project name unavailable'}</h1>
          <p className="project-detail-districts">District(s): {project.districts?.length ? project.districts.join(', ') : 'Unavailable'}</p>
        </div>
        <div className="project-detail-statuses">
          <span className={`project-detail-status project-detail-status-${statusTone(project.status)}`}><StatusDot tone={statusTone(project.status)} />{formatLabel(project.status)}</span>
          <span className={`project-detail-status project-detail-status-${riskTone(project.riskLevel)}`}><StatusDot tone={riskTone(project.riskLevel)} />Risk: {formatLabel(project.riskLevel)}</span>
        </div>
      </header>

      <div className="project-detail-grid">
        <main>
          <section className="project-detail-section"><h2>Description</h2><p className="project-detail-description">{project.description || 'Unavailable'}</p><p className="project-detail-purpose">Purpose: {formatLabel(project.purpose)}</p></section>
          <section className="project-detail-section"><h2>Milestones</h2><div className="project-detail-milestones">{project.milestones?.length ? project.milestones.map((milestone) => <div className="project-detail-milestone" key={milestone._id || milestone.section}><div><div className="project-detail-milestone-title"><StatusDot tone={milestoneTone(milestone.status)} />{formatLabel(milestone.section)}</div><p className="project-detail-milestone-meta">{milestone.remarks || 'No remarks'} · Target: {formatDate(milestone.targetDate)} · Completed: {formatDate(milestone.completedDate)}</p></div><div className="project-detail-milestone-status">{formatLabel(milestone.status)}</div></div>) : <div className="project-detail-state">Milestones unavailable.</div>}</div></section>
          <section className="project-detail-section"><h2>Project boundary</h2><div className="project-detail-map">Project boundary is not available.</div></section>
        </main>

        <aside>
          <section className="project-detail-section"><h2>Project facts</h2><div className="project-detail-facts"><div className="project-detail-fact"><span className="project-detail-fact-label">Requiring agency</span><span className="project-detail-fact-value">{project.requiringAgency || 'Unavailable'}</span></div><div className="project-detail-fact"><span className="project-detail-fact-label">Agency contact</span><span className="project-detail-fact-value">{project.agencyContactEmail || 'Unavailable'}</span></div><div className="project-detail-fact"><span className="project-detail-fact-label">Area required</span><span className="project-detail-fact-value">{typeof project.totalAreaRequiredHectares === 'number' ? `${project.totalAreaRequiredHectares} hectares` : 'Unavailable'}</span></div><div className="project-detail-fact"><span className="project-detail-fact-label">Estimated budget</span><span className="project-detail-fact-value">{formatINR(project.estimatedBudgetINR)}</span></div><div className="project-detail-fact"><span className="project-detail-fact-label">Disbursed budget</span><span className="project-detail-fact-value">{formatINR(project.disbursedBudgetINR)}</span></div><div className="project-detail-fact"><span className="project-detail-fact-label">Parcel count</span><span className="project-detail-fact-value">{typeof project.parcelsCount === 'number' ? project.parcelsCount : 'Unavailable'}</span></div><div className="project-detail-fact"><span className="project-detail-fact-label">Beneficiary count</span><span className="project-detail-fact-value">{typeof project.beneficiaryCount === 'number' ? project.beneficiaryCount : 'Unavailable'}</span></div><div className="project-detail-fact"><span className="project-detail-fact-label">Assigned Collector</span><span className="project-detail-fact-value">{project.assignedCollector?.name || 'Unavailable'}</span></div></div></section>
          {canAct && <section className="project-detail-section project-detail-actions"><h2>Authority actions</h2><p className="project-detail-actions-copy">Actions are sent to the backend using its supported workflow values.</p><textarea className="project-detail-remarks" value={remarks} onChange={(event) => setRemarks(event.target.value)} placeholder="Optional remarks for rejection or clarification" /><div className="project-detail-action-row"><button type="button" className="project-detail-action" disabled={Boolean(actionLoading)} onClick={() => runAction('APPROVE')}><Check size={14} /> {actionLoading === 'APPROVE' ? 'Approving…' : 'Approve'}</button><button type="button" className="project-detail-action project-detail-action-reject" disabled={Boolean(actionLoading)} onClick={() => runAction('REJECT')}><X size={14} /> {actionLoading === 'REJECT' ? 'Rejecting…' : 'Reject'}</button><button type="button" className="project-detail-action" disabled={Boolean(actionLoading)} onClick={() => runAction('REQUEST_CLARIFICATION')}>{actionLoading === 'REQUEST_CLARIFICATION' ? 'Sending…' : 'Request clarification'}</button></div>{mutationError && <p className="project-detail-mutation-error">{mutationError}</p>}</section>}
        </aside>
      </div>
    </div>
  );
};

export default DistrictProjectDetails;
