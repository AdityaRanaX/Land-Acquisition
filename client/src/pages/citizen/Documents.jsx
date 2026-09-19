import React, { useState } from 'react';
import { Download, Eye, Upload, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { CitizenCard, CitizenPageHeader, CitizenStatus } from '../../components/citizen/CitizenCard';
import { citizenDocuments } from '../../data/citizenMockData';

export const Documents = () => {
  const [documents, setDocuments] = useState(citizenDocuments);
  const [selectedId, setSelectedId] = useState(null);
  const [message, setMessage] = useState('');

  const handleUpload = (id, event) => {
    if (!event.target.files?.[0]) return;
    setDocuments((current) => current.map((doc) => doc.id === id ? { ...doc, status: 'Under Review', date: '18 Sep 2026' } : doc));
    setMessage('Document uploaded successfully. It is now under review.');
    setSelectedId(null);
  };

  return (
    <div className="citizen-page">
      <CitizenPageHeader title="Documents" subtitle="View, download and submit documents related to your acquisition case." />
      {message && <div className="citizen-alert"><CheckCircle2 size={18} />{message}</div>}
      <CitizenCard title="Case Documents" subtitle="Documents connected to Parcel 142/1A">
        <div className="citizen-document-list">
          {documents.map((document) => (
            <div className="citizen-document-row" key={document.id}>
              <div><strong>{document.name}</strong><span>{document.type}{document.date ? ` • ${document.date}` : ''}</span></div>
              <CitizenStatus status={document.status} />
              <div className="citizen-row-actions">
                <Button variant="ghost" size="sm" icon={Eye} onClick={() => setMessage(`${document.name} opened in prototype view.`)}>View</Button>
                <Button variant="ghost" size="sm" icon={Download} onClick={() => setMessage(`${document.name} download started.`)}>Download</Button>
                {document.canUpload && <label className="citizen-button citizen-button-outline citizen-button-small"><Upload size={14} /> Upload<input className="sr-only" type="file" onChange={(event) => { setSelectedId(document.id); handleUpload(document.id, event); }} /></label>}
              </div>
            </div>
          ))}
        </div>
      </CitizenCard>
    </div>
  );
};

export default Documents;
