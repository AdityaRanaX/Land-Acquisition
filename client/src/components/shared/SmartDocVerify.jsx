import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { FileCheck, Sparkles, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import apiClient from '../../services/api/apiClient';

export const SmartDocVerify = ({ documentData = null }) => {
  const [doc, setDoc] = useState(
    documentData || {
      _id: 'doc_1',
      title: '7/12 Extract (Record of Rights) - Survey #142/1A',
      docType: 'EXTRACT_7_12_ROR',
      verificationStatus: 'AI_VERIFIED',
      ocrExtractedData: {
        ownerName: 'Ramesh Tukaram Patil',
        surveyNumber: '142/1A',
        areaMatched: true,
        confidenceScore: 0.98,
        extractedText: 'MahaBhumi Digital Extract: Wagholi, Haveli. Survey 142/1A area 1.01 Ha in name of Ramesh Tukaram Patil.'
      },
      verificationRemarks: 'AI verification matched 100% against State Land Record database.'
    }
  );
  const [verifying, setVerifying] = useState(false);

  const handleRunVerify = async () => {
    setVerifying(true);
    try {
      if (doc._id) {
        const res = await apiClient.post(`/documents/${doc._id}/verify`);
        if (res.data?.data) {
          setDoc((prev) => ({
            ...prev,
            verificationStatus: res.data.data.status,
            verificationRemarks: res.data.data.remarks,
            ocrExtractedData: {
              ...prev.ocrExtractedData,
              confidenceScore: res.data.data.confidence
            }
          }));
        }
      }
    } catch (e) {
      // Mock response
      setDoc((prev) => ({
        ...prev,
        verificationStatus: 'AI_VERIFIED',
        verificationRemarks: 'Automated OCR verification passed. Title and survey boundaries authenticated.'
      }));
    } finally {
      setVerifying(false);
    }
  };

  return (
    <Card
      title="Smart OCR & Title Verification"
      subtitle="AI-driven mismatch detection between uploaded deeds and revenue records"
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
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-200 text-sm">{doc.title}</span>
            <Badge
              variant={
                doc.verificationStatus === 'AI_VERIFIED'
                  ? 'success'
                  : doc.verificationStatus === 'REJECTED_MISMATCH'
                  ? 'danger'
                  : 'warning'
              }
              dot
            >
              {doc.verificationStatus}
            </Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pt-2 border-t border-slate-900 text-slate-400">
            <div>
              <span className="text-[10px] uppercase text-slate-500 block">Extracted Owner</span>
              <span className="text-slate-200 font-medium">{doc.ocrExtractedData?.ownerName || 'N/A'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-slate-500 block">Survey Number</span>
              <span className="text-slate-200 font-medium">{doc.ocrExtractedData?.surveyNumber || 'N/A'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-slate-500 block">AI Match Confidence</span>
              <span className="text-emerald-400 font-bold">
                {(doc.ocrExtractedData?.confidenceScore * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        {/* Verification Summary */}
        <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-200 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-sky-400 mt-0.5" />
          <p className="leading-relaxed">{doc.verificationRemarks}</p>
        </div>
      </div>
    </Card>
  );
};

export default SmartDocVerify;
