import { apiRequest } from './queryClient';
import type { 
  Route, Bus, Trip, 
  RouteQuery, BusQuery, TripQuery,
  InsertRoute, InsertBus, InsertTrip 
} from '@/types/shared';

// Enhanced API request with auth
async function authenticatedRequest(method: string, endpoint: string, data?: unknown) {
  const options: RequestInit = {
    method,
    ...(data && { body: JSON.stringify(data) }),
  };
  
  return apiRequest(endpoint, options);
}

// Routes API
export const routesApi = {
  getRoutes: (query?: RouteQuery) => {
    const params = new URLSearchParams();
    if (query?.status) params.append('status', query.status);
    if (query?.sort) params.append('sort', query.sort);
    if (query?.limit) params.append('limit', query.limit.toString());
    if (query?.offset) params.append('offset', query.offset.toString());
    
    return authenticatedRequest('GET', `/routes?${params.toString()}`);
  },
  
  getRoute: (id: string) => authenticatedRequest('GET', `/routes/${id}`),
  
  createRoute: (route: InsertRoute) => authenticatedRequest('POST', '/routes', route),
  
  updateRoute: (id: string, updates: Partial<Route>) => 
    authenticatedRequest('PUT', `/routes/${id}`, updates),
    
  deleteRoute: (id: string) => authenticatedRequest('DELETE', `/routes/${id}`),
};

// Buses API
export const busesApi = {
  getBuses: (query?: BusQuery) => {
    const params = new URLSearchParams();
    if (query?.route) params.append('route', query.route);
    if (query?.status) params.append('status', query.status);
    if (query?.sort) params.append('sort', query.sort);
    if (query?.limit) params.append('limit', query.limit.toString());
    if (query?.offset) params.append('offset', query.offset.toString());
    
    return authenticatedRequest('GET', `/buses?${params.toString()}`);
  },
  
  getBus: (id: string) => authenticatedRequest('GET', `/buses/${id}`),
  
  createBus: (bus: InsertBus) => authenticatedRequest('POST', '/buses', bus),
  
  updateBus: (id: string, updates: Partial<Bus>) => 
    authenticatedRequest('PUT', `/buses/${id}`, updates),
    
  deleteBus: (id: string) => authenticatedRequest('DELETE', `/buses/${id}`),
};

// Trips API
export const tripsApi = {
  getTrips: (query?: TripQuery) => {
    const params = new URLSearchParams();
    if (query?.date) params.append('date', query.date);
    if (query?.busId) params.append('busId', query.busId);
    if (query?.routeId) params.append('routeId', query.routeId);
    if (query?.status) params.append('status', query.status);
    if (query?.limit) params.append('limit', query.limit.toString());
    if (query?.offset) params.append('offset', query.offset.toString());
    
    return authenticatedRequest('GET', `/trips?${params.toString()}`);
  },
  
  getTrip: (id: string) => authenticatedRequest('GET', `/trips/${id}`),
  
  createTrip: (trip: InsertTrip) => authenticatedRequest('POST', '/trips', trip),
  
  updateTrip: (id: string, updates: Partial<Trip>) => 
    authenticatedRequest('PUT', `/trips/${id}`, updates),
    
  deleteTrip: (id: string) => authenticatedRequest('DELETE', `/trips/${id}`),
};

// Health API
export const healthApi = {
  getHealth: () => authenticatedRequest('GET', '/health'),
};
