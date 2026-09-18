import React from 'react';
import { WhatIfSimulator } from '../../components/shared/WhatIfSimulator';
import { SmartDocVerify } from '../../components/shared/SmartDocVerify';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Calculator, Scale, FileText } from 'lucide-react';

export const LandValuation = () => {
  const valuationRates = [
    { type: 'Agricultural Irrigated (Jirayat)', circleRatePerAcre: 3500000, avgSaleDeedRate: 3800000, recommendedRate: 3800000 },
    { type: 'Agricultural Unirrigated (Bagayat)', circleRatePerAcre: 2800000, avgSaleDeedRate: 3100000, recommendedRate: 3100000 },
    { type: 'Residential Gaothan', circleRatePerAcre: 6500000, avgSaleDeedRate: 7200000, recommendedRate: 7200000 },
    { type: 'Commercial Highway Frontage', circleRatePerAcre: 8000000, avgSaleDeedRate: 9500000, recommendedRate: 9500000 }
  ];

  const columns = [
    { title: 'Land Classification', key: 'type', className: 'font-semibold text-white' },
    { title: 'Circle Rate (ASR) / Acre', key: 'circleRatePerAcre', render: (v) => `₹${(v / 100000).toFixed(1)} Lakh` },
    { title: 'Avg Sale Deed Rate (Sec 26(1)(b))', key: 'avgSaleDeedRate', render: (v) => `₹${(v / 100000).toFixed(1)} Lakh` },
    {
      title: 'Determined Market Value (Highest)',
      key: 'recommendedRate',
      render: (v) => <span className="font-bold text-emerald-400">₹${(v / 100000).toFixed(1)} Lakh / Acre</span>
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Land Valuation & Market Rate Determination</h2>
        <p className="text-xs text-slate-400">Determining baseline market values pursuant to RFCTLARR Section 26 rules</p>
      </div>

      <Card title="Circle Rates vs Recent Registered Sale Deeds (Section 26 Criteria)" subtitle="Highest criteria automatically recommended by statutory formula">
        <Table columns={columns} data={valuationRates} />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WhatIfSimulator />
        <SmartDocVerify />
      </div>
    </div>
  );
};

export default LandValuation;
