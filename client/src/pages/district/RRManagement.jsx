import React, { useEffect,  useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
;
import { Scale, Home, Briefcase, HeartHandshake, CheckCircle2, FileSpreadsheet, Plus } from 'lucide-react';

export const RRManagement = () => {
  const [families, setFamilies] = useState([]);
  useEffect(() => {
    getFamilies().then(setFamilies).catch(console.error);
  }, []);


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-bistre tracking-tight">Rehabilitation & Resettlement (R&R) Administrator</h1>
          <p className="text-xs text-text-muted mt-0.5">
            RFCTLARR 2013 Second Schedule Resettlement Scheme, Housing Layouts, and Entitlements
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <FileSpreadsheet className="w-4 h-4" /> Download Schedule II Audit
          </Button>
          <Button variant="primary" size="sm" className="gap-1">
            <Plus className="w-4 h-4" /> Add Resettlement Colony
          </Button>
        </div>
      </div>

      {/* R&R Package Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="1. Resettlement Housing (PM Awas / Plots)">
          <p className="text-xs text-text-muted mb-3">
            Constructed housing or developed residential plot of 50 sq.m in designated R&R township.
          </p>
          <div className="p-3 bg-page rounded border border-chamoisee/20 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-text-muted">Total Entitled:</span>
              <b className="text-bistre">42 Families</b>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Plots Allotted:</span>
              <b className="text-status-success">38 Allotted</b>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Under Construction:</span>
              <b className="text-status-warning">4 Plots</b>
            </div>
          </div>
        </Card>

        <Card title="2. Subsistence & Shifting Grants">
          <p className="text-xs text-text-muted mb-3">
            ₹3,000 / month subsistence for 12 months + one-time ₹50,000 shifting allowance.
          </p>
          <div className="p-3 bg-page rounded border border-chamoisee/20 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-text-muted">Total Budget Allocated:</span>
              <b className="text-bistre">₹36.12 Lakhs</b>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Disbursed to Date:</span>
              <b className="text-status-success">₹24.80 Lakhs (68%)</b>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Upcoming Tranche:</span>
              <b className="text-kobicha">₹3.10 Lakhs (Oct 2026)</b>
            </div>
          </div>
        </Card>

        <Card title="3. Livelihood & Mandatory Training">
          <p className="text-xs text-text-muted mb-3">
            Skill development programs with requiring agency or one-time ₹5,00,000 annuity grant.
          </p>
          <div className="p-3 bg-page rounded border border-chamoisee/20 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-text-muted">Enrolled in Vocational:</span>
              <b className="text-bistre">28 Candidates</b>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Agency Employment Offers:</span>
              <b className="text-status-success">19 Placed</b>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Opted for Cash Annuity:</span>
              <b className="text-text-muted">14 Families</b>
            </div>
          </div>
        </Card>
      </div>

      {/* R&R Implementation Roster */}
      <Card title="Individual Family Entitlement Matrix">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-chamoisee/20 text-text-muted">
                <th className="py-2.5 px-3">Family ID</th>
                <th className="py-2.5 px-3">Head of Household</th>
                <th className="py-2.5 px-3">Village</th>
                <th className="py-2.5 px-3">Housing Unit</th>
                <th className="py-2.5 px-3">Subsistence Grant</th>
                <th className="py-2.5 px-3">Livelihood Option</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-chamoisee/10">
              {families.map((fam) => (
                <tr key={fam.familyId} className="hover:bg-page transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-kobicha">{fam.familyId}</td>
                  <td className="py-3 px-3 font-bold text-bistre">{fam.headOfFamily}</td>
                  <td className="py-3 px-3 text-text-muted">{fam.village}</td>
                  <td className="py-3 px-3 text-bistre">
                    <span className="inline-flex items-center gap-1 text-status-success font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Plot #{fam.housingPlotNumber || '42'} Allotted
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-bistre">₹3,000 / mo (Active)</td>
                  <td className="py-3 px-3 text-text-muted">Vocational Skill Track</td>
                  <td className="py-3 px-3">
                    <Badge status={fam.rnrStatus || 'COMPLETED'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default RRManagement;
