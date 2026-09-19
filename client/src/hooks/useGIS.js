import { useState, useEffect, useCallback } from 'react';
import apiClient from '../services/api/apiClient';

const MOCK_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 'p_1',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [73.9782, 18.5794],
            [73.9815, 18.5799],
            [73.9822, 18.5768],
            [73.9789, 18.5762],
            [73.9782, 18.5794]
          ]
        ]
      },
      properties: {
        id: 'p_1',
        surveyNumber: '142/1A',
        village: 'Wagholi',
        taluka: 'Haveli',
        district: 'Pune',
        areaAcres: 2.5,
        landType: 'AGRICULTURAL_IRRIGATED',
        primaryOwnerName: 'Ramesh Tukaram Patil',
        acquisitionStatus: 'VALUATION_COMPLETED',
        isVerified: true,
        discrepancyDetected: false,
        projectName: 'Pune-Bengaluru Green Expressway (Package 4A)'
      }
    },
    {
      type: 'Feature',
      id: 'p_2',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [73.9822, 18.5768],
            [73.9855, 18.5772],
            [73.9861, 18.5741],
            [73.9828, 18.5738],
            [73.9822, 18.5768]
          ]
        ]
      },
      properties: {
        id: 'p_2',
        surveyNumber: '142/1B',
        village: 'Wagholi',
        taluka: 'Haveli',
        district: 'Pune',
        areaAcres: 1.8,
        landType: 'AGRICULTURAL_UNIRRIGATED',
        primaryOwnerName: 'Sunita Dnyaneshwar Shinde',
        acquisitionStatus: 'NOTIFIED_SEC_11',
        isVerified: false,
        discrepancyDetected: false,
        projectName: 'Pune-Bengaluru Green Expressway (Package 4A)'
      }
    },
    {
      type: 'Feature',
      id: 'p_3',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [73.9855, 18.5772],
            [73.9890, 18.5778],
            [73.9895, 18.5750],
            [73.9861, 18.5741],
            [73.9855, 18.5772]
          ]
        ]
      },
      properties: {
        id: 'p_3',
        surveyNumber: '145/2',
        village: 'Wagholi',
        taluka: 'Haveli',
        district: 'Pune',
        areaAcres: 0.75,
        landType: 'RESIDENTIAL',
        primaryOwnerName: 'Kailash Baburao Jagtap',
        acquisitionStatus: 'DISPUTED',
        isVerified: true,
        discrepancyDetected: true,
        projectName: 'Pune-Bengaluru Green Expressway (Package 4A)'
      }
    }
  ]
};

export const useGIS = (projectId = null) => {
  const [geoJsonData, setGeoJsonData] = useState(MOCK_GEOJSON);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalParcels: 3,
    verifiedParcels: 2,
    disputedParcels: 1,
    awardedParcels: 1
  });

  const fetchGIS = useCallback(async () => {
    setLoading(true);
    try {
      const query = projectId ? `?projectId=${projectId}` : '';
      const res = await apiClient.get(`/gis/parcels-geojson${query}`);
      if (res.data?.data?.features?.length > 0) {
        setGeoJsonData(res.data.data);
      }
      const statRes = await apiClient.get('/gis/layer-stats');
      if (statRes.data?.data) {
        setStats(statRes.data.data);
      }
    } catch (e) {
      // Keep mock fallback
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchGIS();
  }, [fetchGIS]);

  return {
    geoJsonData,
    selectedParcel,
    setSelectedParcel,
    loading,
    stats,
    refetch: fetchGIS
  };
};
