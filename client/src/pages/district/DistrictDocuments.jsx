import React, { useEffect, useMemo, useState } from 'react';
import { Check, ChevronDown, Filter, RotateCw, Search, Sparkles, X } from 'lucide-react';
import documentApi from '../../services/api/documentApi';

const formatLabel = (value) => value?.replace(/_/g, ' ') || 'Unavailable';
const formatDate = (value) => value ? new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Unavailable';
const statusTone = (status) => status === 'OFFICER_APPROVED' ? 'complete' : status === 'REJECTED_MISMATCH' ? 'urgent' : status === 'AI_VERIFIED' ? 'progress' : 'pending';

const DocumentRow = ({ document, expanded, onToggle, onAction, onVerify, actionLoading }) => (
  <article className="district-document-row">
    <button type="button" className="district-document-summary" onClick={onToggle} aria-expanded={expanded}>
      <div className="district-document-main"><div className="district-document-title">{document.title || 'Unavailable'}</div><div className="district-document-meta">{formatLabel(document.docType)} · {document._id || 'Document identifier unavailable'}</div></div>
      <div className="district-document-value" data-label="Project">{document.project || 'Unavailable'}</div>
      <div className="district-document-value" data-label="Parcel">{document.parcel?.surveyNumber || 'Unavailable'}</div>
      <div className={`district-document-status district-document-status-${statusTone(document.verificationStatus)}`} data-label="Status"><span className="district-document-dot" />{formatLabel(document.verificationStatus)}</div>
      <ChevronDown className={`district-document-chevron ${expanded ? 'is-open' : ''}`} size={15} />
    </button>
    {expanded && <div className="district-document-detail"><div className="district-document-detail-grid"><div><span>Uploaded by</span><strong>{document.uploadedBy?.name || document.uploadedBy?.email || 'Unavailable'}</strong></div><div><span>Uploaded</span><strong>{formatDate(document.createdAt)}</strong></div><div><span>Verification remarks</span><strong>{document.verificationRemarks || 'Unavailable'}</strong></div><div><span>OCR owner</span><strong>{document.ocrExtractedData?.ownerName || 'Unavailable'}</strong></div><div><span>OCR survey number</span><strong>{document.ocrExtractedData?.surveyNumber || 'Unavailable'}</strong></div><div><span>Match confidence</span><strong>{typeof document.ocrExtractedData?.confidenceScore === 'number' ? `${Math.round(document.ocrExtractedData.confidenceScore * 100)}%` : 'Unavailable'}</strong></div></div><div className="district-document-links">{document.fileUrl && <a href={document.fileUrl} target="_blank" rel="noreferrer">Open document reference</a>}<div className="district-document-actions"><button type="button" disabled={Boolean(actionLoading)} onClick={() => onVerify(document._id)}><Sparkles size={13} /> {actionLoading === `verify-${document._id}` ? 'Verifying...' : 'Run verification'}</button><button type="button" disabled={Boolean(actionLoading)} onClick={() => onAction(document._id, 'ACCEPT')}><Check size={13} /> Accept</button><button type="button" disabled={Boolean(actionLoading)} onClick={() => onAction(document._id, 'REJECT')}><X size={13} /> Reject</button><button type="button" disabled={Boolean(actionLoading)} onClick={() => onAction(document._id, 'REQUEST_NEW_DOCUMENT')}>Request new document</button><button type="button" disabled={Boolean(actionLoading)} onClick={() => onAction(document._id, 'ESCALATE')}>Escalate</button></div></div></div>}
  </article>
);

export const DistrictDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [docType, setDocType] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState('');
  const [actionError, setActionError] = useState('');

  const fetchDocuments = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await documentApi.getDocuments();
      setDocuments(Array.isArray(response.data?.data) ? response.data.data : []);
    } catch (requestError) {
      setDocuments([]);
      setError('Unable to load documents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const options = useMemo(() => ({
    statuses: [...new Set(documents.map((document) => document.verificationStatus).filter(Boolean))],
    types: [...new Set(documents.map((document) => document.docType).filter(Boolean))]
  }), [documents]);

  const filteredDocuments = useMemo(() => {
    const query = search.trim().toLowerCase();
    return documents.filter((document) => {
      const matchesSearch = !query || [document.title, document.docType, document._id, document.parcel?.surveyNumber, document.parcel?.primaryOwnerName, document.uploadedBy?.name]
        .some((value) => value?.toLowerCase().includes(query));
      return matchesSearch && (!status || document.verificationStatus === status) && (!docType || document.docType === docType);
    });
  }, [documents, docType, search, status]);

  const updateDocument = async (id, action) => {
    setActionLoading(`${action}-${id}`);
    setActionError('');
    try {
      const response = await documentApi.updateDocumentStatus(id, { action });
      const updated = response.data?.data;
      if (updated) setDocuments((current) => current.map((document) => document._id === updated._id ? updated : document));
    } catch (requestError) {
      setActionError(requestError.response?.data?.message || 'Unable to update document status.');
    } finally {
      setActionLoading('');
    }
  };

  const verifyDocument = async (id) => {
    setActionLoading(`verify-${id}`);
    setActionError('');
    try {
      const response = await documentApi.verifyDocument(id);
      const result = response.data?.data;
      if (result) setDocuments((current) => current.map((document) => document._id === id ? { ...document, verificationStatus: result.status, verificationRemarks: result.remarks, ocrExtractedData: { ...document.ocrExtractedData, confidenceScore: result.confidence } } : document));
    } catch (requestError) {
      setActionError(requestError.response?.data?.message || 'Unable to verify document.');
    } finally {
      setActionLoading('');
    }
  };

  return (
    <div className="district-documents-page">
      <style>{`
        .district-documents-page { --terracotta:#B84D28; --umber:#4A2E1B; --ochre:#C07D38; --grey-brown:#6C625B; --line:#DDD3C7; --tan:#E8D9C4; color:var(--umber); } .district-documents-heading { padding:1.5rem 0 2rem; border-bottom:1px solid var(--line); } .district-documents-title { margin:0; color:var(--umber); font-size:2.35rem; font-weight:500; letter-spacing:-.03em; } .district-documents-subtitle { margin:.6rem 0 0; color:var(--grey-brown); font-size:.88rem; } .district-documents-toolbar { display:flex; align-items:center; justify-content:space-between; gap:1rem; padding:1.25rem 0; } .district-documents-count { color:var(--grey-brown); font-size:.75rem; } .district-documents-filter { display:inline-flex; align-items:center; gap:.45rem; border:1px solid var(--line); background:transparent; color:var(--umber); padding:.55rem .8rem; cursor:pointer; font:inherit; font-size:.75rem; } .district-documents-filter:hover { border-color:var(--terracotta); color:var(--terracotta); } .district-documents-filters { display:grid; grid-template-columns:minmax(0,1fr) 14rem 14rem; gap:.7rem; padding-bottom:1.25rem; } .district-documents-search,.district-documents-select { display:flex; align-items:center; gap:.5rem; min-height:2.35rem; border:1px solid var(--line); background:#FFFDF9; color:var(--grey-brown); padding:0 .7rem; } .district-documents-search input,.district-documents-select select { width:100%; border:0; outline:0; background:transparent; color:var(--umber); font:inherit; font-size:.75rem; } .district-documents-list { border-top:1px solid var(--line); } .district-document-row { border-bottom:1px solid var(--line); } .district-document-summary { display:grid; grid-template-columns:minmax(15rem,1.5fr) minmax(10rem,1fr) minmax(8rem,.8fr) minmax(10rem,1fr) 1.5rem; width:100%; gap:1rem; align-items:center; border:0; background:transparent; padding:1.15rem 0; color:inherit; cursor:pointer; text-align:left; font:inherit; } .district-document-summary:hover { background:rgba(234,216,206,.28); } .district-document-title { color:var(--umber); font-size:.8rem; font-weight:700; } .district-document-meta { margin-top:.35rem; color:var(--grey-brown); font-size:.65rem; } .district-document-value { color:var(--grey-brown); font-size:.72rem; word-break:break-word; } .district-document-status { display:flex; align-items:center; gap:.45rem; color:var(--grey-brown); font-size:.7rem; } .district-document-status-progress { color:var(--ochre); } .district-document-status-urgent { color:var(--terracotta); } .district-document-status-complete { color:var(--grey-brown); } .district-document-dot { width:.48rem; height:.48rem; border-radius:50%; background:var(--tan); } .district-document-status-progress .district-document-dot { background:var(--ochre); } .district-document-status-urgent .district-document-dot { background:var(--terracotta); } .district-document-status-complete .district-document-dot { background:var(--grey-brown); } .district-document-chevron { color:var(--grey-brown); transition:transform .2s ease; } .district-document-chevron.is-open { transform:rotate(180deg); } .district-document-detail { padding:0 0 1.25rem; border-top:1px solid var(--line); } .district-document-detail-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1rem; padding:1.1rem 0; } .district-document-detail-grid span { display:block; color:var(--grey-brown); font-size:.62rem; letter-spacing:.05em; text-transform:uppercase; } .district-document-detail-grid strong { display:block; margin-top:.3rem; color:var(--umber); font-size:.73rem; font-weight:600; line-height:1.45; word-break:break-word; } .district-document-links { display:flex; align-items:center; justify-content:space-between; gap:1rem; flex-wrap:wrap; } .district-document-links > a { color:var(--terracotta); font-size:.72rem; text-decoration:none; } .district-document-links > a:hover { text-decoration:underline; } .district-document-actions { display:flex; flex-wrap:wrap; justify-content:flex-end; gap:.45rem; } .district-document-actions button { display:inline-flex; align-items:center; gap:.35rem; border:1px solid var(--line); background:transparent; color:var(--terracotta); padding:.45rem .55rem; cursor:pointer; font:inherit; font-size:.66rem; } .district-document-actions button:hover { background:#EAD8CE; } .district-document-actions button:disabled { cursor:wait; opacity:.55; } .district-documents-state { padding:3.5rem 1rem; border-top:1px solid var(--line); border-bottom:1px solid var(--line); color:var(--grey-brown); text-align:center; font-size:.8rem; } .district-documents-error,.district-document-error-message { color:var(--terracotta); } .district-documents-retry { display:inline-flex; align-items:center; gap:.4rem; margin-top:.8rem; border:1px solid var(--line); background:transparent; color:var(--terracotta); padding:.5rem .75rem; cursor:pointer; font:inherit; font-size:.72rem; } .district-document-error-message { margin:1rem 0 0; font-size:.72rem; } .district-documents-skeleton { height:5.5rem; border-bottom:1px solid var(--line); background:#EFE7DC; animation:district-documents-pulse 1.4s ease-in-out infinite; } @keyframes district-documents-pulse { 0%,100% { opacity:.45; } 50% { opacity:.8; } }
        @media (max-width:850px) { .district-documents-filters { grid-template-columns:1fr; } .district-document-summary { grid-template-columns:1fr 1fr; gap:.7rem 1rem; } .district-document-main { grid-column:1 / -1; } .district-document-value::before { content:attr(data-label); display:block; margin-bottom:.25rem; color:var(--grey-brown); font-size:.62rem; letter-spacing:.05em; text-transform:uppercase; } .district-document-chevron { justify-self:end; grid-column:2; grid-row:1; } .district-document-detail-grid { grid-template-columns:1fr 1fr; } .district-document-links { align-items:flex-start; flex-direction:column; } .district-document-actions { justify-content:flex-start; } }
      `}</style>
      <header className="district-documents-heading"><h1 className="district-documents-title">Documents</h1><p className="district-documents-subtitle">Review uploaded land-acquisition documents and verification results.</p></header>
      <div className="district-documents-toolbar"><span className="district-documents-count">{loading ? 'Loading documents...' : `${filteredDocuments.length} document${filteredDocuments.length === 1 ? '' : 's'} shown`}</span><button type="button" className="district-documents-filter" onClick={() => setFiltersOpen((current) => !current)} aria-expanded={filtersOpen}><Filter size={14} /> Filters</button></div>
      {filtersOpen && <div className="district-documents-filters"><label className="district-documents-search"><Search size={14} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search title, type, parcel or uploader" /></label><label className="district-documents-select"><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="">All verification statuses</option>{options.statuses.map((option) => <option key={option} value={option}>{formatLabel(option)}</option>)}</select></label><label className="district-documents-select"><select value={docType} onChange={(event) => setDocType(event.target.value)}><option value="">All document types</option>{options.types.map((option) => <option key={option} value={option}>{formatLabel(option)}</option>)}</select></label></div>}
      {loading && <div className="district-documents-list"><div className="district-documents-skeleton" /><div className="district-documents-skeleton" /></div>}
      {!loading && error && <div className="district-documents-state district-documents-error">{error}<br /><button type="button" className="district-documents-retry" onClick={fetchDocuments}><RotateCw size={13} /> Retry</button></div>}
      {!loading && !error && filteredDocuments.length === 0 && <div className="district-documents-state">No documents found.</div>}
      {!loading && !error && filteredDocuments.length > 0 && <div className="district-documents-list">{filteredDocuments.map((document) => <DocumentRow key={document._id} document={document} expanded={expandedId === document._id} onToggle={() => setExpandedId((current) => current === document._id ? null : document._id)} onAction={updateDocument} onVerify={verifyDocument} actionLoading={actionLoading} />)}</div>}
      {actionError && <p className="district-document-error-message">{actionError}</p>}
    </div>
  );
};

export default DistrictDocuments;
