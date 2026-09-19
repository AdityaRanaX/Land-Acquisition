import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { GISMap } from '../../components/gis/GISMap';
import { useGIS } from '../../hooks/useGIS';
import { mockParcels } from '../../mock/parcels';
import { Navigation, Compass, MapPin, Camera, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ParcelNavigationMap = () => {
  const { geoJsonData, stats } = useGIS();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <Link to="/field">
          <Button variant="outline" size="sm" className="gap-1 text-xs">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/field/verification">
            <Button variant="secondary" size="sm" className="gap-1 text-xs">
              <Compass className="w-3.5 h-3.5" /> Survey Form
            </Button>
          </Link>
          <Link to="/field/photos">
            <Button variant="primary" size="sm" className="gap-1 text-xs">
              <Camera className="w-3.5 h-3.5" /> Photo Upload
            </Button>
          </Link>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-black text-bistre tracking-tight">GPS Field Navigation & Cadastral Boundaries</h1>
        <p className="text-xs text-text-muted mt-0.5">
          Real-time DGPS boundary tracing, vertex lock, and route assistance to surveyed plots
        </p>
      </div>

      {/* Cadastral Interactive Map */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs p-2 bg-buff/15 rounded-lg border border-chamoisee/25">
            <span className="font-bold text-bistre flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-kobicha" /> Active Waypoint: Survey #142/1A (Patil)
            </span>
            <span className="font-mono text-kobicha font-bold">18.5794° N, 73.9782° E (120m away)</span>
          </div>

          <GISMap features={geoJsonData?.features || []} stats={stats} height="440px" />
        </div>
      </Card>
    </div>
  );
};

export default ParcelNavigationMap;
