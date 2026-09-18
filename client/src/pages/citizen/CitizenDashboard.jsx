import React, { useState, useEffect } from 'react';
import { KPICard } from '../../components/ui/KPICard';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { GISMap } from '../../components/gis/GISMap';
import { useGIS } from '../../hooks/useGIS';
import { LandPlot, Coins, Building2, HelpCircle, ArrowRight, ShieldCheck, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import apiClient from '../../services/api/apiClient';

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
      {/* Greeting Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-900/40 via-slate-900 to-slate-950 border border-sky-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider">Citizen & Landowner Portal</span>
          <h2 className="text-2xl font-bold text-white mt-1">Welcome, Shri Ramesh Tukaram Patil</h2>
          <p className="text-xs text-slate-300 mt-1">
            Registered Title Holder for <strong>Survey #142/1A</strong>, Wagholi Village (Haveli, Pune)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/citizen/grievances">
            <Button variant="secondary" icon={HelpCircle}>File Dispute / Grievance</Button>
          </Link>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Acquired Parcel" value="2.5 Acres" subtitle="Survey #142/1A (Agricultural)" icon={LandPlot} color="sky" />
        <KPICard title="Statutory Award (Sec 23)" value={formatINR(citizenLand.totalAwardINR)} subtitle="Includes 100% Solatium" icon={Coins} color="emerald" />
        <KPICard title="Direct DBT Status" value="Award Sanctioned" subtitle="Escrow Account Funded" icon={ShieldCheck} color="purple" />
        <KPICard title="Dispute Redressal" value="1 Scheduled" subtitle="Hearing on 25-Sep with Collector" icon={HelpCircle} color="amber" />
      </div>

      {/* Map of Citizen's Parcel */}
      <Card title="My Cadastral Land Parcel Boundaries" subtitle="High-precision satellite GIS overlay for Survey #142/1A">
        <GISMap features={geoJsonData?.features || []} stats={stats} height="360px" />
      </Card>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Land Acquisition Claim" subtitle="Current statutory status">
          <p className="text-xs text-slate-300 leading-relaxed">
            Your parcel is notified under <strong>Section 19 Declaration</strong>. Valuation award pronounced by LAA Collector.
          </p>
          <Link to="/citizen/claim-status" className="mt-4 block">
            <Button variant="outline" size="sm" icon={ArrowRight} className="w-full">
              View Section Timeline
            </Button>
          </Link>
        </Card>

        <Card title="Compensation & Solatium" subtitle="Statutory Schedule I breakdown">
          <p className="text-xs text-slate-300 leading-relaxed">
            Market rate multiplied by 1.5x rural factor plus <strong>100% Solatium</strong> & 12% statutory interest.
          </p>
          <Link to="/citizen/compensation" className="mt-4 block">
            <Button variant="primary" size="sm" icon={Coins} className="w-full">
              View Detailed Calculation
            </Button>
          </Link>
        </Card>

        <Card title="R&R Benefits (Schedule II)" subtitle="Rehabilitation entitlements">
          <p className="text-xs text-slate-300 leading-relaxed">
            Check your family's eligibility for subsistence allowance, housing plots, and skill development aid.
          </p>
          <Link to="/citizen/rr-benefits" className="mt-4 block">
            <Button variant="secondary" size="sm" icon={Building2} className="w-full">
              Check R&R Entitlements
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default CitizenDashboard;
