import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { KPICard } from '../../components/ui/KPICard';
import { GISMap } from '../../components/gis/GISMap';
import { useGIS } from '../../hooks/useGIS';
import { LandPlot, Coins, Building2, HelpCircle, ArrowRight, ShieldCheck, FileText, History, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CitizenDashboard = () => {
  const { geoJsonData, stats } = useGIS();

  const citizenLand = {
    surveyNumber: '142/1A',
    village: 'Wagholi',
    taluka: 'Haveli',
    district: 'Pune',
    areaAcres: 2.5,
    areaHectares: 1.01,
    project: 'Pune-Bengaluru Green Expressway (Package 4A)',
    status: 'VALUATION_COMPLETED',
    totalAwardINR: 29366506
  };

  const formatINR = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);

  return (
    <div className="space-y-6">
      {/* Citizen Welcome Banner */}
      <div className="p-6 rounded-xl bg-bistre text-white border border-chamoisee/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-buff uppercase tracking-widest">
            Pradhan Mantri Landowner Portal • DoLR & NHAI
          </span>
          <h1 className="text-2xl font-black text-white mt-1">Welcome, Shri Ramesh Tukaram Patil</h1>
          <p className="text-xs text-buff/80 mt-1">
            Registered Title Holder for <strong className="text-white">Survey #142/1A</strong>, Wagholi Village (Haveli, Pune)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/citizen/grievance-submit">
            <Button variant="secondary" size="sm" className="gap-1 text-xs">
              <HelpCircle className="w-4 h-4 text-kobicha" /> File Grievance / Query
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card bodyClassName="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-kobicha/10 text-kobicha">
              <LandPlot className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-text-muted">Notified Parcel</p>
              <p className="text-xl font-black text-bistre mt-0.5">2.50 Acres</p>
              <p className="text-[11px] text-text-muted">Survey #142/1A</p>
            </div>
          </div>
        </Card>

        <Card bodyClassName="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-status-success/10 text-status-success">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-text-muted">Total Award Amount</p>
              <p className="text-xl font-black text-status-success mt-0.5">₹2.94 Cr</p>
              <p className="text-[11px] text-status-success font-medium">100% Solatium Included</p>
            </div>
          </div>
        </Card>

        <Card bodyClassName="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-kobicha/10 text-kobicha">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-text-muted">PFMS Direct DBT</p>
              <p className="text-xl font-black text-bistre mt-0.5">Ready</p>
              <p className="text-[11px] text-text-muted">Bank KYC Verified</p>
            </div>
          </div>
        </Card>

        <Card bodyClassName="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-status-info/10 text-status-info">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-text-muted">R&R Housing Unit</p>
              <p className="text-xl font-black text-bistre mt-0.5">Plot #42</p>
              <p className="text-[11px] text-text-muted">Wagholi Colony</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Cadastral GIS Boundaries */}
      <Card
        title="My Cadastral Parcel Satellite Boundary"
        subtitle="High-precision cadastral polygon for Survey #142/1A"
        action={
          <Link to="/citizen/my-land">
            <Button variant="outline" size="sm" className="text-xs">
              View Land Dossier <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        }
      >
        <GISMap features={geoJsonData?.features || []} stats={stats} height="360px" />
      </Card>

      {/* Quick Access Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Acquisition Timeline" subtitle="Section 11 to Section 38">
          <p className="text-xs text-text-muted leading-relaxed">
            Your parcel has crossed Section 19 Final Declaration and is currently at the Section 23 Award stage.
          </p>
          <div className="mt-4">
            <Link to="/citizen/timeline">
              <Button variant="outline" size="sm" className="w-full text-xs gap-1">
                <History className="w-3.5 h-3.5" /> View Step-by-Step Timeline
              </Button>
            </Link>
          </div>
        </Card>

        <Card title="Compensation & Solatium" subtitle="Schedule I itemized breakdown">
          <p className="text-xs text-text-muted leading-relaxed">
            View full calculation: Base market rate, rural 1.5x multiplier, crop trees, and 100% Solatium.
          </p>
          <div className="mt-4">
            <Link to="/citizen/compensation">
              <Button variant="primary" size="sm" className="w-full text-xs gap-1">
                <Coins className="w-3.5 h-3.5" /> View Compensation Breakdown
              </Button>
            </Link>
          </div>
        </Card>

        <Card title="R&R Benefits Package" subtitle="Schedule II rehabilitation rights">
          <p className="text-xs text-text-muted leading-relaxed">
            Resettlement housing allotment, ₹3,000 monthly subsistence allowance, and job training rights.
          </p>
          <div className="mt-4">
            <Link to="/citizen/rr-benefits">
              <Button variant="secondary" size="sm" className="w-full text-xs gap-1">
                <Scale className="w-3.5 h-3.5" /> View Entitlement Package
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CitizenDashboard;
