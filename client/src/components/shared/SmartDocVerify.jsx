import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Sparkles, CheckCircle2, FileText } from 'lucide-react';
import apiClient from '../../services/api/apiClient';

export const SmartDocVerify = ({ documentData = null }) => {
  const [doc, setDoc] = useState(documentData);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setDoc(documentData);
  }, [documentData]);

  const handleRunVerify = async () => {
    if (!doc?._id) return;
    setVerifying(true);
    setError(null);
    try {
      const res = await apiClient.post(`/documents/${doc._id}/verify`);
      if (res.data?.data) {
        setDoc((prev) => ({
          ...prev,
          verificationStatus: res.data.data.status || 'AI_VERIFIED',
          verificationRemarks: res.data.data.remarks || 'Verification complete',
          ocrExtractedData: {
            ...prev?.ocrExtractedData,
            confidenceScore: res.data.data.confidence ?? 0.95
          }
        }));
      }
    } catch (e) {
      setError(e.response?.data?.message || 'Verification scan failed on server');
    } finally {
      setVerifying(false);
    }
  };

  if (!doc) {
    return (
      <Card
        title="Smart OCR & Title Verification"
        subtitle="AI-driven mismatch detection between uploaded deeds and revenue records"
      >
        <div className="p-8 text-center border border-dashed border-[#DDD3C7] rounded-xl bg-[#F8F4ED]">
          <FileText className="w-8 h-8 text-[#6C625B] mx-auto opacity-70" />
          <p className="text-xs font-semibold text-[#4A2E1B] mt-2">No document selected for verification</p>
          <p className="text-[11px] text-[#6C625B] mt-1">Select an active document from the list to view or trigger automated OCR verification.</p>
        </div>
      </Card>
    );
  }

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
        {error && (
          <div className="p-3 rounded-lg bg-[#FAF3E0] border border-[#DDD3C7] text-xs text-[#B84D28]">
            {error}
          </div>
        )}

        <div className="p-3.5 rounded-xl bg-[#F8F4ED] border border-[#DDD3C7] space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[#4A2E1B] text-sm">{doc.title || doc.documentType}</span>
            <Badge
              variant={
                doc.verificationStatus === 'AI_VERIFIED' || doc.verificationStatus === 'VERIFIED'
                  ? 'success'
                  : doc.verificationStatus === 'REJECTED' || doc.verificationStatus === 'REJECTED_MISMATCH'
                  ? 'danger'
                  : 'warning'
              }
              dot
            >
              {doc.verificationStatus || 'PENDING'}
            </Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pt-2 border-t border-[#DDD3C7] text-[#6C625B]">
            <div>
              <span className="text-[10px] uppercase text-[#6C625B] block">Extracted Owner</span>
              <span className="text-[#4A2E1B] font-medium">{doc.ocrExtractedData?.ownerName || 'N/A'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-[#6C625B] block">Survey Number</span>
              <span className="text-[#4A2E1B] font-medium">{doc.ocrExtractedData?.surveyNumber || 'N/A'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-[#6C625B] block">AI Match Confidence</span>
              <span className="text-[#B84D28] font-bold">
                {doc.ocrExtractedData?.confidenceScore
                  ? `${(doc.ocrExtractedData.confidenceScore * 100).toFixed(0)}%`
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Verification Summary */}
        {doc.verificationRemarks && (
          <div className="p-3 rounded-xl bg-[#EAD8CE] border border-[#B84D28]/30 text-[#4A2E1B] flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-[#B84D28] mt-0.5" />
            <p className="leading-relaxed">{doc.verificationRemarks}</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default SmartDocVerify;
