import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { GISMap } from '../../components/gis/GISMap';
import { getParcelsGeoJSON } from '../../services/parcelService';
import { MapPin, Layers, Filter, Download } from 'lucide-react';

export const NationalMap = () => {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [selectedState, setSelectedState] = useState('All');

  useEffect(() => {
    getParcelsGeoJSON().then(setGeoJsonData);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-bistre">National Cadastral GIS Spatial Portal</h2>
          <p className="text-xs text-text-muted">High-precision cadastral polygon mapping with EPSG:4326 GeoJSON overlay</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" icon={Download}>Export Shapefile / GeoJSON</Button>
        </div>
      </div>

      <Card
        title="Interactive Land Acquisition Layer Viewer"
        subtitle="Zoom to explore surveyed parcels, valuations, and disputed boundaries across national corridors"
      >
        <GISMap
          features={geoJsonData?.features || []}
          height="600px"
        />
      </Card>
    </div>
  );
};

export default NationalMap;
