import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Calculator, Sparkles, TrendingUp, IndianRupee } from 'lucide-react';
import apiClient from '../../services/api/apiClient';

export const WhatIfSimulator = () => {
  const [inputs, setInputs] = useState({
    baseMarketValuePerAcre: 3500000,
    acquiredAreaAcres: 2.5,
    urbanOrRural: 'RURAL',
    distanceFactor: 1.5,
    assetsStructures: 850000,
    assetsTreesCrops: 320000,
    interestDays: 180
  });

  const [result, setResult] = useState({
    basicLandValue: 8750000,
    multipliedLandValue: 13125000,
    totalBaseAssetAndLandValue: 14295000,
    solatiumAmount: 14295000,
    interest12PercentAdditionalValue: 776506,
    totalGrossAwardINR: 29366506
  });

  const [loading, setLoading] = useState(false);

  const calculate = async () => {
    setLoading(true);
    try {
      const res = await apiClient.post('/compensation/calculate', inputs);
      if (res.data?.data) {
        setResult(res.data.data);
      }
    } catch (e) {
      // Local fallback formula
      const basic = inputs.baseMarketValuePerAcre * inputs.acquiredAreaAcres;
      const mult = inputs.urbanOrRural === 'URBAN' ? 1.0 : inputs.distanceFactor;
      const multipliedLand = basic * mult;
      const assets = Number(inputs.assetsStructures) + Number(inputs.assetsTreesCrops);
      const baseTotal = multipliedLand + assets;
      const solatium = baseTotal; // 100%
      const interest = multipliedLand * 0.12 * (inputs.interestDays / 365);
      const total = Math.round(baseTotal + solatium + interest);

      setResult({
        basicLandValue: Math.round(basic),
        multipliedLandValue: Math.round(multipliedLand),
        totalBaseAssetAndLandValue: Math.round(baseTotal),
        solatiumAmount: Math.round(solatium),
        interest12PercentAdditionalValue: Math.round(interest),
        totalGrossAwardINR: total
      });
    } finally {
      setLoading(false);
    }
  };

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);
  };

  return (
    <Card
      title="RFCTLARR Statutory 'What-If' Award Simulator"
      subtitle="Simulate Schedule I Multipliers, 100% Solatium (Sec 30) & 12% Interest (Sec 30(3))"
      action={<Calculator className="w-4 h-4 text-sky-400" />}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Base Circle Rate / Acre (₹)"
              type="number"
              value={inputs.baseMarketValuePerAcre}
              onChange={(e) => setInputs({ ...inputs, baseMarketValuePerAcre: Number(e.target.value) })}
            />
            <Input
              label="Acquired Area (Acres)"
              type="number"
              step="0.1"
              value={inputs.acquiredAreaAcres}
              onChange={(e) => setInputs({ ...inputs, acquiredAreaAcres: Number(e.target.value) })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Area Classification"
              value={inputs.urbanOrRural}
              onChange={(e) => setInputs({ ...inputs, urbanOrRural: e.target.value })}
              options={[
                { value: 'RURAL', label: 'Rural (Multiplier 1.0 - 2.0)' },
                { value: 'URBAN', label: 'Urban (Multiplier 1.0)' }
              ]}
            />
            <Input
              label="Distance Multiplier"
              type="number"
              step="0.1"
              min="1.0"
              max="2.0"
              disabled={inputs.urbanOrRural === 'URBAN'}
              value={inputs.distanceFactor}
              onChange={(e) => setInputs({ ...inputs, distanceFactor: Number(e.target.value) })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Structures / Wells (₹)"
              type="number"
              value={inputs.assetsStructures}
              onChange={(e) => setInputs({ ...inputs, assetsStructures: Number(e.target.value) })}
            />
            <Input
              label="Trees / Standing Crops (₹)"
              type="number"
              value={inputs.assetsTreesCrops}
              onChange={(e) => setInputs({ ...inputs, assetsTreesCrops: Number(e.target.value) })}
            />
          </div>

          <Input
            label="Elapsed Days from Sec 11 Notification"
            type="number"
            value={inputs.interestDays}
            helperText="Applies 12% per annum additional market value under Sec 30(3)"
            onChange={(e) => setInputs({ ...inputs, interestDays: Number(e.target.value) })}
          />

          <Button variant="primary" className="w-full mt-2" loading={loading} onClick={calculate}>
            Recompute Statutory Award
          </Button>
        </div>

        {/* Breakdown Output */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Award Breakdown</span>
            <div className="mt-3 space-y-2.5 text-xs text-slate-300">
              <div className="flex justify-between pb-1 border-b border-slate-900">
                <span className="text-slate-400">Basic Land Value (Area × Rate):</span>
                <span className="font-semibold">{formatINR(result.basicLandValue)}</span>
              </div>
              <div className="flex justify-between pb-1 border-b border-slate-900">
                <span className="text-slate-400">Multiplied Value (Factor {inputs.urbanOrRural === 'URBAN' ? '1.0' : inputs.distanceFactor}x):</span>
                <span className="font-semibold text-sky-400">{formatINR(result.multipliedLandValue)}</span>
              </div>
              <div className="flex justify-between pb-1 border-b border-slate-900">
                <span className="text-slate-400">Base Land + Attached Assets:</span>
                <span className="font-semibold">{formatINR(result.totalBaseAssetAndLandValue)}</span>
              </div>
              <div className="flex justify-between pb-1 border-b border-slate-900">
                <span className="text-slate-400">Solatium @ 100% (Sec 30(1)):</span>
                <span className="font-semibold text-amber-400">{formatINR(result.solatiumAmount)}</span>
              </div>
              <div className="flex justify-between pb-1 border-b border-slate-900">
                <span className="text-slate-400">12% Interest ({inputs.interestDays} days):</span>
                <span className="font-semibold text-purple-400">{formatINR(result.interest12PercentAdditionalValue)}</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 bg-sky-950/20 p-3 rounded-lg border border-sky-500/20">
            <span className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider block">
              Total Statutory Gross Award (Sec 23/26)
            </span>
            <h3 className="text-2xl font-black text-emerald-400 mt-1">
              {formatINR(result.totalGrossAwardINR)}
            </h3>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WhatIfSimulator;
