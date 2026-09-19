import React, { useEffect,  useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { SmartDocVerify } from '../../components/shared/SmartDocVerify';
;
import { FileSearch, Check, X, AlertTriangle, FileText, Download } from 'lucide-react';

export const DocVerification = () => {
  const [documents, setDocuments] = useState([]);
  useEffect(() => {
    getDocuments().then(setDocuments).catch(console.error);
  }, []);

  const [selectedDoc, setSelectedDoc] = useState(mockDocuments[0]);

  const handleApprove = (docId) => {
    setDocuments(documents.map(d => d.id === docId ? { ...d, verificationStatus: 'VERIFIED' } : d));
    if (selectedDoc.id === docId) {
      setSelectedDoc({ ...selectedDoc, verificationStatus: 'VERIFIED' });
    }
  };

  const handleReject = (docId) => {
    setDocuments(documents.map(d => d.id === docId ? { ...d, verificationStatus: 'REJECTED' } : d));
    if (selectedDoc.id === docId) {
      setSelectedDoc({ ...selectedDoc, verificationStatus: 'REJECTED' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-bistre tracking-tight">Document OCR & Title Verification</h1>
          <p className="text-xs text-text-muted mt-0.5">
            Cross-examine 7/12 land records, sale deeds, and bank KYC with AI OCR extraction
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document Ingestion List */}
        <div className="lg:col-span-1 space-y-3">
          <Card title="Uploaded Title Documents">
            <div className="space-y-2.5">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedDoc.id === doc.id
                      ? 'bg-kobicha/10 border-kobicha shadow-sm'
                      : 'bg-page border-chamoisee/20 hover:border-chamoisee/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold text-kobicha">{doc.id}</span>
                    <Badge status={doc.verificationStatus} />
                  </div>
                  <h4 className="font-bold text-bistre text-xs mt-1 truncate">{doc.title || doc.documentType}</h4>
                  <p className="text-[11px] text-text-muted mt-0.5">Parcel: {doc.parcelId || 'PARCEL-101'}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* OCR Inspector & Verification Action */}
        <div className="lg:col-span-2 space-y-4">
          <SmartDocVerify document={selectedDoc} />

          <Card>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-bistre text-sm">Revenue Officer Determination</h4>
                <p className="text-xs text-text-muted">
                  Current Status: <span className="font-bold text-bistre">{selectedDoc.verificationStatus}</span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleReject(selectedDoc.id)}
                  className="gap-1 border-status-danger text-status-danger hover:bg-status-danger/10"
                >
                  <X className="w-4 h-4" /> Reject & Request Resubmission
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleApprove(selectedDoc.id)}
                  className="gap-1 bg-status-success hover:bg-status-success/90"
                >
                  <Check className="w-4 h-4" /> Validate & Endorse Title
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DocVerification;
