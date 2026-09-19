import React from 'react';
import { MapContainer, TileLayer, Polygon, Popup, Tooltip } from 'react-leaflet';
import GISLegend from './GISLegend';
import { Badge } from '../ui/Badge';
import { User, LandPlot, MapPin, AlertOctagon } from 'lucide-react';

export const GISMap = ({
  features = [],
  selectedParcel,
  onSelectParcel,
  center = [18.5775, 73.9835], // Wagholi, Pune coordinates
  zoom = 15,
  height = '480px',
  stats
}) => {
  const getPolygonStyle = (feature) => {
    const status = feature.properties?.acquisitionStatus;
    const isDisputed = feature.properties?.discrepancyDetected || status === 'DISPUTED';
    const isVerified = feature.properties?.isVerified;

    if (isDisputed) {
      return { fillColor: '#A24A3F', color: '#7E332A', weight: 2.5, fillOpacity: 0.5 };
    }
    if (status === 'AWARD_PRONOUNCED') {
      return { fillColor: '#C99A3F', color: '#8F6A22', weight: 2, fillOpacity: 0.45 };
    }
    if (isVerified || status === 'VALUATION_COMPLETED') {
      return { fillColor: '#6B7B4C', color: '#4D5A34', weight: 2, fillOpacity: 0.45 };
    }
    return { fillColor: '#5B7A8C', color: '#3D5665', weight: 2, fillOpacity: 0.4 };
  };

  return (
    <div className="relative rounded-xl overflow-hidden border border-chamoisee/25 shadow-card bg-surface" style={{ height }}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {features.map((feat) => {
          if (!feat.geometry?.coordinates) return null;
          const latLngs = feat.geometry.coordinates[0].map(([lng, lat]) => [lat, lng]);

          return (
            <Polygon
              key={feat.id || feat.properties?.id}
              positions={latLngs}
              pathOptions={getPolygonStyle(feat)}
              eventHandlers={{
                click: () => onSelectParcel && onSelectParcel(feat.properties)
              }}
            >
              <Tooltip sticky>
                <div className="text-xs font-bold text-bistre">
                  Survey #{feat.properties?.surveyNumber} - {feat.properties?.village}
                </div>
              </Tooltip>
              <Popup className="custom-popup">
                <div className="p-1 space-y-1.5 text-xs text-text-primary">
                  <div className="flex items-center justify-between gap-2 border-b border-chamoisee/20 pb-1">
                    <span className="font-bold text-sm text-bistre">Survey #{feat.properties?.surveyNumber}</span>
                    <span className="text-[10px] bg-buff/30 text-bistre px-1.5 py-0.5 rounded font-bold">
                      {feat.properties?.village}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-chamoisee" />
                      <strong>Owner:</strong> {feat.properties?.primaryOwnerName}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <LandPlot className="w-3.5 h-3.5 text-chamoisee" />
                      <strong>Area:</strong> {feat.properties?.areaAcres} Acres ({feat.properties?.landType})
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-chamoisee" />
                      <strong>Status:</strong> <Badge size="sm" status={feat.properties?.acquisitionStatus} />
                    </p>
                  </div>
                  {feat.properties?.discrepancyDetected && (
                    <div className="mt-1 bg-status-danger/15 text-[#7E332A] p-1.5 rounded text-[11px] font-bold flex items-center gap-1">
                      <AlertOctagon className="w-3.5 h-3.5" /> Discrepancy Flagged
                    </div>
                  )}
                </div>
              </Popup>
            </Polygon>
          );
        })}
      </MapContainer>

      <GISLegend stats={stats} />
    </div>
  );
};

export default GISMap;
