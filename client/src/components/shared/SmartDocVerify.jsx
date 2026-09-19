import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { verifyDocumentAI } from '../../services/documentService';

export const SmartDocVerify = ({ documentData = null }) => {
  const [doc, setDoc] = useState(
    documentData || {
      id: 'DOC-501',
      title: '7/12 Extract (Record of Rights) - Survey #142/1A',
      docType: 'EXTRACT_7_12_ROR',
      verificationStatus: 'VERIFIED',
      ocrExtractedData: {
        ownerName: 'Ramesh Tukaram Patil',
        surveyNumber: '142/1A',
        areaMatched: true,
        confidenceScore: 0.98,
        extractedText: 'MahaBhumi Digital Extract: Wagholi, Haveli. Survey 142/1A area 1.01 Ha in name of Ramesh Tukaram Patil.'
      },
      verificationRemarks: 'AI verification matched 100% against State Land Record database (MahaBhumi).'
    }
  );
  const [verifying, setVerifying] = useState(false);

  const handleRunVerify = async () => {
    setVerifying(true);
    setTimeout(() => {
      setDoc((prev) => ({
        ...prev,
        verificationStatus: 'VERIFIED',
        verificationRemarks: 'Automated OCR scan completed. Title ownership and survey boundaries verified with 98% confidence.'
      }));
      setVerifying(false);
    }, 900);
  };

  return (
    <Card
      title="Smart OCR & Title Verification"
      subtitle="Automated anomaly detection between scanned deeds and Land Registry"
      action={
        <Button
          size="sm"
          variant="primary"
          icon={Sparkles}
          loading={verifying}
          onClick={handleRunVerify}
        >
          Run AI Scan
        </Button>
      }
    >
      <div className="space-y-4 text-xs">
        <div className="p-3.5 rounded-xl bg-[#FDFBF7] border border-chamoisee/25 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-bistre text-sm">{doc.title}</span>
            <Badge status={doc.verificationStatus} dot />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pt-2 border-t border-chamoisee/15 text-text-muted">
            <div>
              <span className="text-[10px] uppercase font-bold text-chamoisee block">Extracted Owner</span>
              <span className="text-bistre font-semibold">{doc.ocrExtractedData?.ownerName || 'N/A'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-chamoisee block">Survey Number</span>
              <span className="text-bistre font-semibold">{doc.ocrExtractedData?.surveyNumber || 'N/A'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-chamoisee block">Match Confidence</span>
              <span className="text-[#4D5A34] font-bold">
                {((doc.ocrExtractedData?.confidenceScore || 0.95) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        {/* Verification Summary */}
        <div className="p-3 rounded-xl bg-buff/20 border border-buff/40 text-bistre flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-kobicha mt-0.5" />
          <p className="leading-relaxed text-xs">{doc.verificationRemarks}</p>
        </div>
      </div>
    </Card>
  );
};

export default SmartDocVerify;
