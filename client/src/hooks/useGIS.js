import { useState, useEffect, useCallback } from 'react';
import apiClient from '../services/api/apiClient';

const EMPTY_COLLECTION = {
  type: 'FeatureCollection',
  features: []
};

export const useGIS = (projectId = null) => {
  const [geoJsonData, setGeoJsonData] = useState(EMPTY_COLLECTION);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  const fetchGIS = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query = projectId ? `?projectId=${projectId}` : '';
      const res = await apiClient.get(`/gis/parcels-geojson${query}`);
      if (res.data?.data) {
        setGeoJsonData(res.data.data);
      } else {
        setGeoJsonData(EMPTY_COLLECTION);
      }

      const statRes = await apiClient.get('/gis/layer-stats');
      if (statRes.data?.data) {
        setStats(statRes.data.data);
      }
    } catch (e) {
      setError(e.response?.data?.message || 'Unable to fetch spatial GIS records');
      setGeoJsonData(EMPTY_COLLECTION);
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
    error,
    stats,
    refetch: fetchGIS
  };
};

export default useGIS;
