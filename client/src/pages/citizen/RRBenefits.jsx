import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Scale, Home, HeartHandshake, Briefcase, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const RRBenefits = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link to="/citizen">
              <Button variant="outline" size="sm" className="gap-1 text-xs">
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </Button>
            </Link>
            <h1 className="text-2xl font-black text-bistre tracking-tight">RFCTLARR Second Schedule R&R Package</h1>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Rehabilitation and Resettlement entitlements for Family ID <span className="font-mono font-bold text-kobicha">FAM-01</span>
          </p>
        </div>
        <Badge status="VERIFIED" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="1. Resettlement Housing">
          <div className="space-y-3">
            <div className="p-3 bg-status-success/10 border border-status-success/30 rounded-lg">
              <span className="font-bold text-status-success text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Allotment Confirmed
              </span>
              <p className="text-xs font-bold text-bistre mt-1">Plot #42, Wagholi R&R Township</p>
              <p className="text-[11px] text-text-muted">50 sq. meter developed residential plot with water & power connection</p>
            </div>
            <p className="text-[11px] text-text-muted">Possession certificate issued by Collectorate.</p>
          </div>
        </Card>

        <Card title="2. Subsistence & Shifting">
          <div className="space-y-3">
            <div className="p-3 bg-buff/20 border border-kobicha/30 rounded-lg">
              <span className="font-bold text-bistre text-xs">₹3,000 / month Subsistence</span>
              <p className="text-[11px] text-text-muted mt-1">Payable for 12 consecutive months via DBT</p>
            </div>
            <div className="p-3 bg-page border border-chamoisee/20 rounded-lg text-xs">
              <span className="text-text-muted">One-Time Shifting Grant:</span>
              <p className="font-bold text-bistre">₹50,000 (Sanctioned)</p>
            </div>
          </div>
        </Card>

        <Card title="3. Livelihood & Skill Training">
          <div className="space-y-3">
            <div className="p-3 bg-page border border-chamoisee/20 rounded-lg text-xs">
              <span className="text-text-muted">Nominated Family Member:</span>
              <p className="font-bold text-bistre">Sachin Ramesh Patil (Son)</p>
              <p className="text-[11px] text-kobicha font-semibold mt-1">NHAI Heavy Machinery & Toll Operations Course</p>
            </div>
            <p className="text-[11px] text-text-muted">Guaranteed placement assistance upon corridor commissioning.</p>
          </div>
        </Card>
      </div>

      <Card title="Family Demographic & Entitlement Profile">
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <dt className="text-text-muted">Head of Household</dt>
            <dd className="font-bold text-bistre mt-0.5">Ramesh Tukaram Patil</dd>
          </div>
          <div>
            <dt className="text-text-muted">Total Dependent Members</dt>
            <dd className="font-bold text-bistre mt-0.5">5 (2 Adults, 3 Children)</dd>
          </div>
          <div>
            <dt className="text-text-muted">Social Category</dt>
            <dd className="font-bold text-bistre mt-0.5">Small Farmer / OBC</dd>
          </div>
          <div>
            <dt className="text-text-muted">Displacement Status</dt>
            <dd className="font-bold text-status-success mt-0.5">Residential & Agricultural</dd>
          </div>
        </dl>
      </Card>
    </div>
  );
};

export default RRBenefits;
