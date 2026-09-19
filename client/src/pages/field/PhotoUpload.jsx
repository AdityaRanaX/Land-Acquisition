import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { mockParcels } from '../../mock/parcels';
import {
  Camera,
  Upload,
  CheckCircle2,
  Image,
  MapPin,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Compass,
  Layers,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const PhotoUpload = () => {
  const [selectedParcelId, setSelectedParcelId] = useState(mockParcels[0].id);
  const parcel = mockParcels.find((p) => p.id === selectedParcelId) || mockParcels[0];

  const [photos, setPhotos] = useState({
    land: {
      url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600',
      timestamp: '2026-09-19 10:14 AM',
      coords: '18.5794° N, 73.9782° E',
      caption: 'Full panoramic vista of sugarcane parcel facing North'
    },
    boundary: {
      url: 'https://images.unsplash.com/photo-1595878715977-2e8f8df18ea8?w=600',
      timestamp: '2026-09-19 10:18 AM',
      coords: '18.5798° N, 73.9789° E',
      caption: 'Survey stone peg #3 along northern road boundary'
    },
    document: {
      url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600',
      timestamp: '2026-09-19 10:22 AM',
      coords: '18.5794° N, 73.9782° E',
      caption: 'Original 7/12 land record presented on-site by owner'
    },
    evidence: {
      url: 'https://images.unsplash.com/photo-1524813686514-a57563d77d46?w=600',
      timestamp: '2026-09-19 10:26 AM',
      coords: '18.5791° N, 73.9780° E',
      caption: 'Borewell and pump shed structure attached to survey'
    }
  });

  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleSimulateCapture = (category) => {
    setPhotos({
      ...photos,
      [category]: {
        url: photos[category]?.url || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600',
        timestamp: new Date().toLocaleTimeString(),
        coords: '18.5794° N, 73.9782° E (GPS Lock)',
        caption: `Updated geo-tagged ${category} photo capture`
      }
    });
  };

  const handleSaveAll = () => {
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link to="/field">
          <Button variant="outline" size="sm" className="gap-1 text-xs">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Button>
        </Link>
        <Link to="/field/verification">
          <Button variant="secondary" size="sm" className="gap-1 text-xs">
            <Compass className="w-3.5 h-3.5 text-kobicha" /> Go to Survey Form <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-black text-bistre tracking-tight">Geo-Tagged Spot Photo Capture</h1>
        <p className="text-xs text-text-muted mt-0.5">
          Capture high-resolution ground truth photos with watermarked GPS coordinates & timestamps
        </p>
      </div>

      {uploadSuccess && (
        <div className="p-3.5 bg-status-success/15 border border-status-success/30 rounded-lg flex items-center justify-between text-status-success text-xs font-bold">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> All 4 geo-tagged spot photos synced and bound to Survey #{parcel.surveyNumber}!
          </span>
          <Link to="/field/history">
            <Button variant="outline" size="sm" className="text-xs py-0.5 text-status-success border-status-success">
              View History
            </Button>
          </Link>
        </div>
      )}

      {/* Target Parcel Card */}
      <Card title="Target Cadastral Plot">
        <div className="space-y-2">
          <label className="block text-xs font-bold text-bistre">Select Parcel</label>
          <Select
            value={selectedParcelId}
            onChange={(e) => setSelectedParcelId(e.target.value)}
            options={mockParcels.map((p) => ({
              value: p.id,
              label: `Survey #${p.surveyNumber} — ${p.primaryOwnerName} (${p.village})`
            }))}
          />
        </div>
      </Card>

      {/* 4 Dedicated Photo Upload Modules */}
      <div className="space-y-4">
        {/* 1. Land Photo */}
        <Card
          title="1. Land Parcel Panoramic Photo"
          subtitle="Full ground view showing crop condition, terrain, and soil"
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSimulateCapture('land')}
              className="gap-1 text-xs py-1"
            >
              <Camera className="w-3.5 h-3.5 text-kobicha" /> Snap Photo
            </Button>
          }
        >
          {photos.land ? (
            <div className="space-y-2">
              <div className="relative aspect-video rounded-lg overflow-hidden border border-chamoisee/30 bg-black">
                <img
                  src={photos.land.url}
                  alt="Land Panoramic"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-bistre/80 backdrop-blur-xs p-2 text-[10px] text-white flex justify-between">
                  <span>{photos.land.coords}</span>
                  <span>{photos.land.timestamp}</span>
                </div>
              </div>
              <p className="text-xs text-text-muted">{photos.land.caption}</p>
            </div>
          ) : (
            <div className="border-2 border-dashed border-chamoisee/30 rounded-lg p-6 text-center bg-page">
              <Camera className="w-6 h-6 text-chamoisee mx-auto mb-1" />
              <p className="text-xs font-bold text-bistre">No Land Photo Attached</p>
              <p className="text-[10px] text-text-muted">Tap Snap Photo to use camera</p>
            </div>
          )}
        </Card>

        {/* 2. Boundary Photo */}
        <Card
          title="2. Boundary Peg & Demarcation Photo"
          subtitle="Physical boundary stones, fencing, or neighboring survey demarcation"
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSimulateCapture('boundary')}
              className="gap-1 text-xs py-1"
            >
              <Camera className="w-3.5 h-3.5 text-kobicha" /> Snap Photo
            </Button>
          }
        >
          {photos.boundary ? (
            <div className="space-y-2">
              <div className="relative aspect-video rounded-lg overflow-hidden border border-chamoisee/30 bg-black">
                <img
                  src={photos.boundary.url}
                  alt="Boundary Marker"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-bistre/80 backdrop-blur-xs p-2 text-[10px] text-white flex justify-between">
                  <span>{photos.boundary.coords}</span>
                  <span>{photos.boundary.timestamp}</span>
                </div>
              </div>
              <p className="text-xs text-text-muted">{photos.boundary.caption}</p>
            </div>
          ) : (
            <div className="border-2 border-dashed border-chamoisee/30 rounded-lg p-6 text-center bg-page">
              <Camera className="w-6 h-6 text-chamoisee mx-auto mb-1" />
              <p className="text-xs font-bold text-bistre">No Boundary Photo Attached</p>
              <p className="text-[10px] text-text-muted">Demarcation stone required</p>
            </div>
          )}
        </Card>

        {/* 3. Document Photo */}
        <Card
          title="3. Land Record / Passbook Physical Document Photo"
          subtitle="On-site physical 7/12 record, tax receipt, or Kisan credit passbook"
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSimulateCapture('document')}
              className="gap-1 text-xs py-1"
            >
              <Camera className="w-3.5 h-3.5 text-kobicha" /> Snap Photo
            </Button>
          }
        >
          {photos.document ? (
            <div className="space-y-2">
              <div className="relative aspect-video rounded-lg overflow-hidden border border-chamoisee/30 bg-black">
                <img
                  src={photos.document.url}
                  alt="Physical Land Record"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-bistre/80 backdrop-blur-xs p-2 text-[10px] text-white flex justify-between">
                  <span>{photos.document.coords}</span>
                  <span>{photos.document.timestamp}</span>
                </div>
              </div>
              <p className="text-xs text-text-muted">{photos.document.caption}</p>
            </div>
          ) : (
            <div className="border-2 border-dashed border-chamoisee/30 rounded-lg p-6 text-center bg-page">
              <Camera className="w-6 h-6 text-chamoisee mx-auto mb-1" />
              <p className="text-xs font-bold text-bistre">No Document Photo Attached</p>
            </div>
          )}
        </Card>

        {/* 4. Supporting Evidence Photo */}
        <Card
          title="4. Attached Assets & Structure Evidence Photo"
          subtitle="Wells, borewells, farm houses, mango/fruit orchards, pipeline valves"
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSimulateCapture('evidence')}
              className="gap-1 text-xs py-1"
            >
              <Camera className="w-3.5 h-3.5 text-kobicha" /> Snap Photo
            </Button>
          }
        >
          {photos.evidence ? (
            <div className="space-y-2">
              <div className="relative aspect-video rounded-lg overflow-hidden border border-chamoisee/30 bg-black">
                <img
                  src={photos.evidence.url}
                  alt="Asset Structure"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-bistre/80 backdrop-blur-xs p-2 text-[10px] text-white flex justify-between">
                  <span>{photos.evidence.coords}</span>
                  <span>{photos.evidence.timestamp}</span>
                </div>
              </div>
              <p className="text-xs text-text-muted">{photos.evidence.caption}</p>
            </div>
          ) : (
            <div className="border-2 border-dashed border-chamoisee/30 rounded-lg p-6 text-center bg-page">
              <Camera className="w-6 h-6 text-chamoisee mx-auto mb-1" />
              <p className="text-xs font-bold text-bistre">No Asset Photo Attached</p>
            </div>
          )}
        </Card>
      </div>

      {/* Save / Upload All Button */}
      <div className="pt-4">
        <Button
          type="button"
          variant="primary"
          onClick={handleSaveAll}
          className="w-full gap-2 py-3 text-sm font-bold shadow-md"
        >
          <Upload className="w-4 h-4" /> Upload & Sync All 4 Spot Photos
        </Button>
      </div>
    </div>
  );
};

export default PhotoUpload;
