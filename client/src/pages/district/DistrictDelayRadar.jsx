import React, { useState, useEffect } from 'react';
import { auditApi } from '../../services/api/auditApi';
import { DelayRadar } from '../../components/shared/DelayRadar';
import { Card } from '../../components/ui/Card';
import { RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';

export const DistrictDelayRadar = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DDD3C7] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#4A2E1B]">Statutory RFCTLARR Delay Radar</h1>
          <p className="text-xs text-[#6C625B]">Real-time bottleneck detection engine evaluating statutory lapse risks and survey lag</p>
        </div>
      </div>

      <div className="p-3 bg-[#F8F4ED] border-l-4 border-[#C07D38] text-xs text-[#4A2E1B]">
        <strong>Statutory Rule Engine:</strong> Scans active projects against statutory limits (e.g. 12-month limit between Section 11 preliminary notification and Section 19 declaration under Sec 19(7)), field survey completion, and grievance backlog.
      </div>

      <DelayRadar title="District Statutory Risk Analysis" />
    </div>
  );
};

export default DistrictDelayRadar;
