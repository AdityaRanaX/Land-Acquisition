import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Check, RotateCw, X } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { GISMap } from '../../components/gis/GISMap';
import gisApi from '../../services/api/gisApi';
import parcelApi from '../../services/api/parcelApi';

const formatLabel = (value) => value?.replace(/_/g, ' ') || 'Unavailable';
const formatDate = (value) => value ? new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Unavailable';

const ParcelDetailsField = ({ label, value }) => <div className="district-parcel-detail-field"><span>{label}</span><strong>{value ?? 'Unavailable'}</strong></div>;
const StatusDot = ({ tone = 'neutral' }) => <span className={`district-parcel-detail-dot district-parcel-detail-dot-${tone}`} aria-hidden="true" />;

const statusTone = (status) => status === 'DISPUTED' ? 'urgent' : status === 'COMPENSATION_PAID' || status === 'POSSESSION_TAKEN' ? 'closed' : 'progress';

export const DistrictParcelDetails = () => {
  const { id } = useParams();
  const [parcel, setParcel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fieldNotes, setFieldNotes] = useState('');
  const [discrepancyDetected, setDiscrepancyDetected] = useState(false);
  const [discrepancyDetails, setDiscrepancyDetails] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');
  const [resolveLoading, setResolveLoading] = useState(false);
  const [gisStats, setGisStats] = useState(null);

  const fetchParcel = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await parcelApi.getParcelById(id);
      setParcel(response.data?.data || null);
      if (!response.data?.data) setError('Parcel not found.');
    } catch (requestError) {
      setParcel(null);
      setError(requestError.response?.status === 404 ? 'Parcel not found.' : 'Unable to load parcel.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParcel();
    gisApi.getGISStats().then((response) => setGisStats(response.data?.data || null)).catch(() => setGisStats(null));
  }, [id]);

  const geometryFeature = useMemo(() => {
    if (!parcel?.geometry?.coordinates) return null;
    return {
      type: 'Feature',
      id: parcel._id,
      geometry: parcel.geometry,
      properties: {
        id: parcel._id,
        surveyNumber: parcel.surveyNumber,
        village: parcel.village,
        taluka: parcel.taluka,
        district: parcel.district,
        areaAcres: parcel.areaAcres,
        landType: parcel.landType,
        primaryOwnerName: parcel.primaryOwnerName,
        acquisitionStatus: parcel.acquisitionStatus,
        isVerified: parcel.fieldVerification?.isVerified || false,
        discrepancyDetected: parcel.fieldVerification?.discrepancyDetected || false,
        projectName: parcel.project?.name,
        projectCode: parcel.project?.code
      }
    };
  }, [parcel]);

  const submitVerification = async () => {
    setActionLoading(true);
    setActionError('');
    try {
      const response = await parcelApi.verifyGroundSurvey(id, {
        groundPhotos: [],
        fieldNotes,
        discrepancyDetected,
        discrepancyDetails
      });
      setParcel(response.data?.data || parcel);
      setFieldNotes('');
      setDiscrepancyDetails('');
    } catch (requestError) {
      setActionError(requestError.response?.data?.message || 'Unable to submit verification.');
    } finally {
      setActionLoading(false);
    }
  };

  const resolveDiscrepancy = async () => {
    setResolveLoading(true);
    setActionError('');
    try {
      const response = await parcelApi.updateParcel(id, { resolveDiscrepancy: true, fieldNotes });
      setParcel(response.data?.data || parcel);
    } catch (requestError) {
      setActionError(requestError.response?.data?.message || 'Unable to resolve discrepancy.');
    } finally {
      setResolveLoading(false);
    }
  };

  if (loading) return <div className="district-parcel-detail-state">Loading parcel...</div>;
  if (error) return <div className="district-parcel-detail-state district-parcel-detail-error"><p>{error}</p><button type="button" className="district-parcel-detail-retry" onClick={fetchParcel}><RotateCw size={14} /> Retry</button></div>;
  if (!parcel) return <div className="district-parcel-detail-state">Parcel not found.</div>;

  const verification = parcel.fieldVerification || {};
  const projectName = parcel.project?.name || parcel.project?.code || 'Unavailable';

  return (
    <div className="district-parcel-detail-page">
      <style>{`
        .district-parcel-detail-page { --terracotta:#B84D28; --umber:#4A2E1B; --ochre:#C07D38; --grey-brown:#6C625B; --line:#DDD3C7; --tan:#E8D9C4; color:var(--umber); }
        .district-parcel-detail-back { display:inline-flex; align-items:center; gap:.45rem; color:var(--terracotta); font-size:.75rem; text-decoration:none; }
        .district-parcel-detail-header { display:flex; justify-content:space-between; align-items:flex-end; gap:2rem; padding:1.5rem 0 2rem; border-bottom:1px solid var(--line); }
        .district-parcel-detail-overline { color:var(--grey-brown); font-family:ui-monospace,SFMono-Regular,Menlo,monospace; font-size:.7rem; }
        .district-parcel-detail-title { margin:.55rem 0 0; color:var(--umber); font-size:clamp(1.8rem,3.5vw,2.8rem); font-weight:500; letter-spacing:-.03em; }
        .district-parcel-detail-subtitle { margin:.5rem 0 0; color:var(--grey-brown); font-size:.78rem; }
        .district-parcel-detail-status { display:inline-flex; align-items:center; gap:.45rem; border:1px solid var(--line); padding:.45rem .65rem; color:var(--grey-brown); font-size:.7rem; }
        .district-parcel-detail-grid { display:grid; grid-template-columns:minmax(0,1.2fr) minmax(16rem,.8fr); gap:3rem; padding-top:2rem; }
        .district-parcel-detail-section { padding:1.5rem 0; border-bottom:1px solid var(--line); }
        .district-parcel-detail-section:first-child { padding-top:0; }
        .district-parcel-detail-section h2 { margin:0 0 1rem; color:var(--umber); font-size:1rem; font-weight:700; }
        .district-parcel-detail-fields { display:grid; grid-template-columns:1fr 1fr; border-top:1px solid var(--line); }
        .district-parcel-detail-field { padding:1rem .8rem 1rem 0; border-bottom:1px solid var(--line); }
        .district-parcel-detail-field:nth-child(even) { padding-left:.8rem; border-left:1px solid var(--line); }
        .district-parcel-detail-field span { display:block; color:var(--grey-brown); font-size:.65rem; text-transform:uppercase; letter-spacing:.06em; }
        .district-parcel-detail-field strong { display:block; margin-top:.35rem; color:var(--umber); font-size:.8rem; font-weight:600; word-break:break-word; }
        .district-parcel-detail-map { min-height:18rem; border:1px solid var(--line); overflow:hidden; }
        .district-parcel-detail-map > div { border:0 !important; border-radius:0 !important; box-shadow:none !important; }
        .district-parcel-detail-unavailable { display:flex; align-items:center; justify-content:center; min-height:12rem; border:1px solid var(--line); color:var(--grey-brown); font-size:.78rem; text-align:center; }
        .district-parcel-detail-verification { border-top:1px solid var(--line); }
        .district-parcel-detail-verification-row { display:grid; grid-template-columns:minmax(0,1fr) auto; gap:1rem; padding:1rem 0; border-bottom:1px solid var(--line); }
        .district-parcel-detail-verification-label { color:var(--grey-brown); font-size:.7rem; }
        .district-parcel-detail-verification-value { margin-top:.3rem; color:var(--umber); font-size:.78rem; }
        .district-parcel-detail-dot { display:inline-block; width:.48rem; height:.48rem; margin-right:.45rem; border-radius:50%; background:var(--grey-brown); } .district-parcel-detail-dot-progress { background:var(--ochre); } .district-parcel-detail-dot-urgent { background:var(--terracotta); } .district-parcel-detail-dot-closed { background:var(--grey-brown); }
        .district-parcel-detail-form { display:grid; gap:.7rem; }
        .district-parcel-detail-form label { color:var(--grey-brown); font-size:.7rem; }
        .district-parcel-detail-form textarea { width:100%; min-height:4.5rem; resize:vertical; border:1px solid var(--line); background:#FFFDF9; color:var(--umber); padding:.65rem; outline:0; font:inherit; font-size:.75rem; }
        .district-parcel-detail-form textarea:focus { border-color:var(--terracotta); }
        .district-parcel-detail-check { display:flex; align-items:center; gap:.5rem; color:var(--umber) !important; }
        .district-parcel-detail-actions { display:flex; flex-wrap:wrap; gap:.55rem; }
        .district-parcel-detail-button { display:inline-flex; align-items:center; gap:.4rem; border:1px solid var(--line); background:transparent; color:var(--terracotta); padding:.6rem .75rem; cursor:pointer; font:inherit; font-size:.72rem; }
        .district-parcel-detail-button:hover { background:#EAD8CE; } .district-parcel-detail-button:disabled { cursor:wait; opacity:.55; }
        .district-parcel-detail-error-message { margin:0; color:var(--terracotta); font-size:.72rem; }
        .district-parcel-detail-state { padding:4rem 1rem; color:var(--grey-brown); text-align:center; font-size:.82rem; } .district-parcel-detail-error { color:var(--terracotta); } .district-parcel-detail-retry { display:inline-flex; align-items:center; gap:.4rem; margin-top:.8rem; border:1px solid var(--line); background:transparent; color:var(--terracotta); padding:.55rem .75rem; cursor:pointer; font:inherit; font-size:.72rem; }
        @media (max-width:760px) { .district-parcel-detail-header { align-items:flex-start; flex-direction:column; } .district-parcel-detail-grid { grid-template-columns:1fr; gap:0; } .district-parcel-detail-fields { grid-template-columns:1fr; } .district-parcel-detail-field:nth-child(even) { padding-left:0; border-left:0; } }
      `}</style>

      <Link className="district-parcel-detail-back" to="/district/parcels"><ArrowLeft size={14} /> District / Parcels / {parcel.surveyNumber || 'Parcel'}</Link>
      <header className="district-parcel-detail-header"><div><div className="district-parcel-detail-overline">{parcel._id}</div><h1 className="district-parcel-detail-title">{parcel.surveyNumber || 'Parcel details'}</h1><p className="district-parcel-detail-subtitle">{parcel.village || 'Village unavailable'} · {parcel.taluka || 'Taluka unavailable'} · {parcel.district || 'District unavailable'}</p></div><span className="district-parcel-detail-status"><StatusDot tone={statusTone(parcel.acquisitionStatus)} />{formatLabel(parcel.acquisitionStatus)}</span></header>
      <div className="district-parcel-detail-grid"><main>
        <section className="district-parcel-detail-section"><h2>Overview</h2><div className="district-parcel-detail-fields"><ParcelDetailsField label="Owner" value={parcel.primaryOwnerName} /><ParcelDetailsField label="Land type" value={formatLabel(parcel.landType)} /><ParcelDetailsField label="Area (acres)" value={parcel.areaAcres} /><ParcelDetailsField label="Area (hectares)" value={parcel.areaHectares} /><ParcelDetailsField label="State" value={parcel.state} /><ParcelDetailsField label="Urban / rural" value={formatLabel(parcel.urbanOrRural)} /><ParcelDetailsField label="Project" value={projectName} /><ParcelDetailsField label="Base market rate" value={typeof parcel.baseMarketRatePerAcreINR === 'number' ? `₹${parcel.baseMarketRatePerAcreINR.toLocaleString('en-IN')} / acre` : 'Unavailable'} /></div></section>
        <section className="district-parcel-detail-section"><h2>GIS</h2>{geometryFeature ? <div className="district-parcel-detail-map"><GISMap features={[geometryFeature]} stats={gisStats} height="360px" /></div> : <div className="district-parcel-detail-unavailable">Parcel boundary is not available.</div>}</section>
        <section className="district-parcel-detail-section"><h2>Owner / Family</h2><div className="district-parcel-detail-fields"><ParcelDetailsField label="Owner name" value={parcel.primaryOwnerName} /><ParcelDetailsField label="Owner phone" value={parcel.primaryOwnerPhone} /><ParcelDetailsField label="Citizen account" value={parcel.citizenUser?.email || 'Unavailable'} /></div></section>
        <section className="district-parcel-detail-section"><h2>Verification</h2><div className="district-parcel-detail-verification"><div className="district-parcel-detail-verification-row"><div><div className="district-parcel-detail-verification-label">Verification state</div><div className="district-parcel-detail-verification-value"><StatusDot tone={verification.isVerified ? 'closed' : 'progress'} />{verification.isVerified ? 'Verified' : 'Unverified'}</div></div><div>{formatDate(verification.verifiedAt)}</div></div><div className="district-parcel-detail-verification-row"><div><div className="district-parcel-detail-verification-label">Field notes</div><div className="district-parcel-detail-verification-value">{verification.fieldNotes || 'Unavailable'}</div></div></div><div className="district-parcel-detail-verification-row"><div><div className="district-parcel-detail-verification-label">Discrepancy</div><div className="district-parcel-detail-verification-value">{verification.discrepancyDetected ? verification.discrepancyDetails || 'Detected' : 'None recorded'}</div></div></div></div></section>
        <section className="district-parcel-detail-section"><h2>Documents</h2><div className="district-parcel-detail-unavailable">Information not available.</div></section><section className="district-parcel-detail-section"><h2>Compensation</h2><div className="district-parcel-detail-unavailable">Information not available.</div></section><section className="district-parcel-detail-section"><h2>R&amp;R</h2><div className="district-parcel-detail-unavailable">Information not available.</div></section><section className="district-parcel-detail-section"><h2>Timeline</h2><div className="district-parcel-detail-unavailable">Information not available.</div></section><section className="district-parcel-detail-section"><h2>Audit history</h2><div className="district-parcel-detail-unavailable">Information not available.</div></section>
      </main><aside>
        <section className="district-parcel-detail-section"><h2>Field verification</h2><div className="district-parcel-detail-form"><label htmlFor="field-notes">Field notes</label><textarea id="field-notes" value={fieldNotes} onChange={(event) => setFieldNotes(event.target.value)} placeholder="Enter field verification notes" /><label className="district-parcel-detail-check"><input type="checkbox" checked={discrepancyDetected} onChange={(event) => setDiscrepancyDetected(event.target.checked)} /> Discrepancy detected</label>{discrepancyDetected && <><label htmlFor="discrepancy-details">Discrepancy details</label><textarea id="discrepancy-details" value={discrepancyDetails} onChange={(event) => setDiscrepancyDetails(event.target.value)} /></>}<div className="district-parcel-detail-actions"><button type="button" className="district-parcel-detail-button" disabled={actionLoading} onClick={submitVerification}><Check size={14} /> {actionLoading ? 'Submitting...' : 'Submit verification'}</button>{verification.discrepancyDetected && <button type="button" className="district-parcel-detail-button" disabled={resolveLoading} onClick={resolveDiscrepancy}><X size={14} /> {resolveLoading ? 'Resolving...' : 'Resolve discrepancy'}</button>}</div>{actionError && <p className="district-parcel-detail-error-message">{actionError}</p>}</div></section>
      </aside></div>
    </div>
  );
};

export default DistrictParcelDetails;
