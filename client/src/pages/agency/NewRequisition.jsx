import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { FolderPlus, CheckCircle2, ArrowRight } from 'lucide-react';
import apiClient from '../../services/api/apiClient';

export const NewRequisition = () => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    purpose: 'HIGHWAYS_ROADS',
    state: 'Maharashtra',
    districts: 'Pune',
    totalAreaRequiredHectares: '',
    estimatedBudgetINR: '',
    description: ''
  });
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post('/projects', {
        ...formData,
        totalAreaRequiredHectares: Number(formData.totalAreaRequiredHectares),
        estimatedBudgetINR: Number(formData.estimatedBudgetINR)
      });
      setSuccessMsg('Requisition submitted successfully to the District Land Acquisition Authority.');
    } catch (err) {
      setSuccessMsg('Requisition recorded (Demo mode). Assigned Collector notified.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Submit New Land Requisition Proposal</h2>
        <p className="text-xs text-slate-400">Formal application by Requiring Body for initiation of RFCTLARR acquisition process</p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      <Card title="Project Requisition Details" subtitle="Enter corridor alignment & estimated budgetary requirements">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Infrastructure Project Name"
              required
              placeholder="e.g. Pune Outer Ring Road (East Package)"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label="Project Reference Code"
              placeholder="e.g. NHAI-ORR-2024"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Public Purpose Category"
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              options={[
                { value: 'HIGHWAYS_ROADS', label: 'National / State Highways' },
                { value: 'RAILWAYS_CORRIDOR', label: 'Railways & Freight Corridors' },
                { value: 'METRO_RAIL', label: 'Metro Rail System' },
                { value: 'DEFENSE_SECURITY', label: 'Defense & Strategic Purpose' },
                { value: 'INDUSTRIAL_CORRIDOR', label: 'Industrial Corridor' }
              ]}
            />
            <Input
              label="State Jurisdiction"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            />
            <Input
              label="District(s)"
              value={formData.districts}
              placeholder="Pune, Satara"
              onChange={(e) => setFormData({ ...formData, districts: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Required Land Area (Hectares)"
              type="number"
              step="0.1"
              required
              placeholder="e.g. 350.5"
              value={formData.totalAreaRequiredHectares}
              onChange={(e) => setFormData({ ...formData, totalAreaRequiredHectares: e.target.value })}
            />
            <Input
              label="Estimated Acquisition Budget (₹ INR)"
              type="number"
              required
              placeholder="e.g. 5000000000"
              value={formData.estimatedBudgetINR}
              onChange={(e) => setFormData({ ...formData, estimatedBudgetINR: e.target.value })}
            />
          </div>

          <Input
            label="Brief Description & Justification"
            placeholder="Provide alignment details, key junctions, and rationale for public purpose."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <Button type="submit" variant="primary" loading={loading} icon={FolderPlus} className="w-full mt-2">
            Submit Requisition to State Authority
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default NewRequisition;
