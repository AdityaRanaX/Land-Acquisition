import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { GISMap } from '../../components/gis/GISMap';
import { getParcelsGeoJSON } from '../../services/parcelService';
import { MapPin, Download } from 'lucide-react';

export const StateMap = () => {
  const [geoJsonData, setGeoJsonData] = useState(null);

  useEffect(() => {
    getParcelsGeoJSON().then(setGeoJsonData);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-bistre">State Cadastral GIS Portal (Maharashtra)</h2>
          <p className="text-xs text-text-muted">High-resolution cadastral spatial layer tracking over Pune, Satara, Nashik & Ahmednagar districts</p>
        </div>
        <Button variant="outline" icon={Download}>Export State GIS Layer</Button>
      </div>

      <Card title="State Geographic Map Viewer" subtitle="Interactive cadastral boundaries">
        <GISMap features={geoJsonData?.features || []} height="580px" />
      </Card>
    </div>
  );
};

export default StateMap;
