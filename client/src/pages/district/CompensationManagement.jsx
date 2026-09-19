import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { WhatIfSimulator } from '../../components/shared/WhatIfSimulator';
import { mockCompensation } from '../../mock/compensation';
import { mockParcels } from '../../mock/parcels';
import { Coins, CheckCircle, FileText, Send, Download, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CompensationManagement = () => {
  const [activeParcel, setActiveParcel] = useState(mockParcels[0]);
  const [disbursedParcels, setDisbursedParcels] = useState([]);

  const handleDisburse = (id) => {
    setDisbursedParcels([...disbursedParcels, id]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-bistre tracking-tight">Section 23 Compensation & Solatium Awards</h1>
          <p className="text-xs text-text-muted mt-0.5">
            Statutory award determination and direct benefit transfer (PFMS) escrow disbursement
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Download className="w-4 h-4" /> Download Award Gazettes
          </Button>
          <Button variant="primary" size="sm" className="gap-1">
            <Coins className="w-4 h-4" /> Bulk PFMS Release
          </Button>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card bodyClassName="p-4">
          <p className="text-[10px] uppercase font-bold text-text-muted">Total Awarded Value</p>
          <p className="text-xl font-black text-bistre mt-0.5">₹42.85 Cr</p>
          <p className="text-xs text-chamoisee">Across 185 surveyed plots</p>
        </Card>
        <Card bodyClassName="p-4">
          <p className="text-[10px] uppercase font-bold text-text-muted">Disbursed via PFMS</p>
          <p className="text-xl font-black text-status-success mt-0.5">₹31.10 Cr</p>
          <p className="text-xs text-status-success font-medium">72.5% Complete</p>
        </Card>
        <Card bodyClassName="p-4">
          <p className="text-[10px] uppercase font-bold text-text-muted">Pending Escrow Release</p>
          <p className="text-xl font-black text-status-warning mt-0.5">₹8.95 Cr</p>
          <p className="text-xs text-text-muted">38 Parcels in clearance</p>
        </Card>
        <Card bodyClassName="p-4">
          <p className="text-[10px] uppercase font-bold text-text-muted">Court Escrow / Disputed</p>
          <p className="text-xl font-black text-status-danger mt-0.5">₹2.80 Cr</p>
          <p className="text-xs text-text-muted">Sec 64 Land Tribunal</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Award Queue Table */}
        <div className="lg:col-span-2 space-y-4">
          <Card title="Section 23 Award Register">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-chamoisee/20 text-text-muted">
                    <th className="py-2.5 px-3">Parcel / Survey</th>
                    <th className="py-2.5 px-3">Landowner</th>
                    <th className="py-2.5 px-3">Area (Ac)</th>
                    <th className="py-2.5 px-3">Total Solatium</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-chamoisee/10">
                  {mockParcels.map((parcel) => {
                    const isDisbursed = disbursedParcels.includes(parcel.id);
                    return (
                      <tr
                        key={parcel.id}
                        onClick={() => setActiveParcel(parcel)}
                        className={`cursor-pointer transition-colors ${
                          activeParcel.id === parcel.id ? 'bg-buff/15' : 'hover:bg-page'
                        }`}
                      >
                        <td className="py-3 px-3">
                          <p className="font-mono font-bold text-bistre">{parcel.surveyNumber}</p>
                          <p className="text-[10px] text-text-muted font-mono">{parcel.id}</p>
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-bold text-bistre">{parcel.primaryOwnerName}</p>
                          <p className="text-[11px] text-text-muted">{parcel.village}</p>
                        </td>
                        <td className="py-3 px-3 font-semibold text-bistre">{parcel.areaAcres}</td>
                        <td className="py-3 px-3 font-mono font-bold text-status-success">
                          ₹{((parcel.totalValuationINR || 0) / 100000).toFixed(2)} L
                        </td>
                        <td className="py-3 px-3">
                          <Badge status={isDisbursed ? 'PAID' : parcel.acquisitionStatus} />
                        </td>
                        <td className="py-3 px-3 text-right">
                          {isDisbursed ? (
                            <span className="text-[11px] text-status-success font-bold flex items-center justify-end gap-1">
                              <CheckCircle className="w-3.5 h-3.5" /> Disbursed
                            </span>
                          ) : (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDisburse(parcel.id);
                              }}
                              className="text-[11px] py-1"
                            >
                              Disburse
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Section 23 Award Details & Live Simulator */}
        <div className="lg:col-span-1 space-y-4">
          <Card title={`Valuation Dossier: ${activeParcel.surveyNumber}`}>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-chamoisee/10">
                <span className="text-text-muted">Land Classification</span>
                <span className="font-bold text-bistre">{activeParcel.landType?.replace(/_/g, ' ')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-chamoisee/10">
                <span className="text-text-muted">Base Rate / Acre</span>
                <span className="font-mono font-bold text-bistre">
                  ₹{(activeParcel.baseMarketRatePerAcreINR / 100000).toFixed(2)} Lakhs
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-chamoisee/10">
                <span className="text-text-muted">Rural Distance Multiplier</span>
                <span className="font-bold text-kobicha">{activeParcel.multiplierApplied}x</span>
              </div>
              <div className="flex justify-between py-1 border-b border-chamoisee/10">
                <span className="text-text-muted">100% Solatium (Sec 30)</span>
                <span className="font-bold text-status-success">+100%</span>
              </div>
              <div className="flex justify-between py-2 bg-buff/15 p-2 rounded">
                <span className="font-bold text-bistre">Final Award Payable</span>
                <span className="font-mono font-black text-status-success text-sm">
                  ₹{((activeParcel.totalValuationINR || 0) / 100000).toFixed(2)} Lakhs
                </span>
              </div>

              <div className="pt-2">
                <Link to={`/district/parcels/${activeParcel.id}`}>
                  <Button variant="outline" size="sm" className="w-full gap-1">
                    <ArrowUpRight className="w-4 h-4" /> Full Parcel Inspection Report
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          <WhatIfSimulator defaultBaseRate={activeParcel.baseMarketRatePerAcreINR || 3500000} />
        </div>
      </div>
    </div>
  );
};

export default CompensationManagement;
