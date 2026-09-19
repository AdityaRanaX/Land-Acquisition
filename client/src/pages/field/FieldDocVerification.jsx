import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { mockDocuments } from '../../mock/documents';
import { FileSearch, CheckCircle2, Scan, Camera, ArrowLeft, ArrowRight, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FieldDocVerification = () => {
  const [doc, setDoc] = useState(mockDocuments[0]);
  const [scanned, setScanned] = useState(false);

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <Link to="/field">
          <Button variant="outline" size="sm" className="gap-1 text-xs">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Button>
        </Link>
        <Link to="/field/verification">
          <Button variant="secondary" size="sm" className="gap-1 text-xs">
            <Compass className="w-3.5 h-3.5" /> Survey Form
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-black text-bistre tracking-tight">Mobile Document OCR Quick-Check</h1>
        <p className="text-xs text-text-muted mt-0.5">
          Scan paper 7/12 land records or bank passbooks in the field to match against cadastral database
        </p>
      </div>

      <Card title="Quick Scan Camera OCR">
        <div className="space-y-4">
          <div className="border-2 border-dashed border-chamoisee/40 rounded-xl p-8 text-center bg-page">
            <Scan className="w-10 h-10 text-kobicha mx-auto mb-2 animate-pulse" />
            <p className="font-bold text-bistre text-sm">Align 7/12 Extract within Frame</p>
            <p className="text-xs text-text-muted mt-1">Automatic Marathi/English OCR extraction</p>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setScanned(true)}
              className="mt-4 gap-1.5"
            >
              <Camera className="w-4 h-4" /> Run Live OCR Scan
            </Button>
          </div>

          {scanned && (
            <div className="p-4 bg-status-success/10 border border-status-success/30 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-bistre text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-status-success" /> OCR Match Confidence: 98.2%
                </span>
                <Badge status="VERIFIED" />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-text-muted">Detected Survey:</span>
                  <p className="font-mono font-bold text-bistre">142/1A</p>
                </div>
                <div>
                  <span className="text-text-muted">Khata Holder:</span>
                  <p className="font-bold text-bistre">Ramesh Tukaram Patil</p>
                </div>
                <div>
                  <span className="text-text-muted">Extracted Area:</span>
                  <p className="font-bold text-bistre">2.50 Acres (1.01 Ha)</p>
                </div>
                <div>
                  <span className="text-text-muted">Encumbrances:</span>
                  <p className="font-bold text-status-success">NIL (Clear Title)</p>
                </div>
              </div>

              <div className="pt-2">
                <Link to="/field/verification">
                  <Button variant="primary" size="sm" className="w-full text-xs gap-1">
                    Auto-Fill Survey Form with Extracted Data <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default FieldDocVerification;
