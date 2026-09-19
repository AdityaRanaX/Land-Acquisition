import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { GISMap } from '../../components/gis/GISMap';
import { getParcelsGeoJSON } from '../../services/parcelService';
import { Download, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DistrictGISMap = () => {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getParcelsGeoJSON().then(setGeoJsonData);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-bistre">District Cadastral GIS Spatial Portal (Pune)</h2>
          <p className="text-xs text-text-muted">High-accuracy plot boundary inspection, dispute visualizer, and valuation overlays</p>
        </div>
        <Button variant="outline" icon={Download}>Export District KML / GeoJSON</Button>
      </div>

      <Card title="District Cadastral Layer" subtitle="Click on any parcel boundary to open details">
        <GISMap
          features={geoJsonData?.features || []}
          height="580px"
          onSelectParcel={(p) => navigate(`/district/parcels/${p.id}`)}
        />
      </Card>
    </div>
  );
};

export default DistrictGISMap;
