import apiClient from './apiClient';

export const gisApi = {
  getParcelsGeoJSON: (params) => apiClient.get('/gis/parcels-geojson', { params }),
  getGISStats: (params) => apiClient.get('/gis/layer-stats', { params })
};

export default gisApi;
