import React, { useState } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, Tooltip } from 'react-leaflet';
import GISLegend from './GISLegend';
import { Badge } from '../ui/Badge';
import { CheckCircle, AlertOctagon, User, LandPlot, MapPin } from 'lucide-react';

export const GISMap = ({
  features = [],
  selectedParcel,
  onSelectParcel,
  mode = 'monitor', // 'monitor' | 'survey' | 'valuation' | 'citizen'
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
      return { fillColor: '#EF4444', color: '#DC2626', weight: 2.5, fillOpacity: 0.5 };
    }
    if (status === 'AWARD_PRONOUNCED') {
      return { fillColor: '#F59E0B', color: '#D97706', weight: 2, fillOpacity: 0.45 };
    }
    if (isVerified || status === 'VALUATION_COMPLETED') {
      return { fillColor: '#10B981', color: '#059669', weight: 2, fillOpacity: 0.45 };
    }
    return { fillColor: '#38BDF8', color: '#0284C7', weight: 2, fillOpacity: 0.4 };
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-xl" style={{ height }}>
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
          // Leaflet expects [lat, lng], whereas GeoJSON is [lng, lat]
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
                <div className="text-xs font-semibold">
                  Survey #{feat.properties?.surveyNumber} - {feat.properties?.village}
                </div>
              </Tooltip>
              <Popup className="custom-popup">
                <div className="p-1 space-y-1.5 text-xs text-slate-900">
                  <div className="flex items-center justify-between gap-2 border-b pb-1">
                    <span className="font-bold text-sm">Survey #{feat.properties?.surveyNumber}</span>
                    <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded font-medium">
                      {feat.properties?.village}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      <strong>Owner:</strong> {feat.properties?.primaryOwnerName}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <LandPlot className="w-3.5 h-3.5 text-slate-500" />
                      <strong>Area:</strong> {feat.properties?.areaAcres} Acres ({feat.properties?.landType})
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <strong>Status:</strong> {feat.properties?.acquisitionStatus}
                    </p>
                  </div>
                  {feat.properties?.discrepancyDetected && (
                    <div className="mt-1 bg-red-50 text-red-700 p-1.5 rounded text-[11px] font-medium flex items-center gap-1">
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
