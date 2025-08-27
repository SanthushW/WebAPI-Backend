// Shared schema types for API communication

export interface Route {
  id: number;
  name: string;
  startLocation: string;
  endLocation: string;
  distance: number;
  estimatedDuration: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Bus {
  id: number;
  routeId: number;
  plate: string;
  status: 'active' | 'inactive' | 'maintenance';
  gps?: {
    lat: number;
    lng: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Trip {
  id: number;
  busId: number;
  routeId: number;
  startTime: string;
  endTime?: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  username: string;
  role: 'admin' | 'operator' | 'viewer';
  createdAt: string;
}

// Query interfaces
export interface RouteQuery {
  status?: string;
  sort?: string;
  limit?: number;
  offset?: number;
}

export interface BusQuery {
  route?: string;
  status?: string;
  sort?: string;
  limit?: number;
  offset?: number;
}

export interface TripQuery {
  date?: string;
  busId?: string;
  routeId?: string;
  status?: string;
  limit?: number;
  offset?: number;
}

// Insert interfaces
export interface InsertRoute {
  name: string;
  startLocation: string;
  endLocation: string;
  distance: number;
  estimatedDuration: number;
  status?: 'active' | 'inactive';
}

export interface InsertBus {
  routeId: number;
  plate: string;
  status?: 'active' | 'inactive' | 'maintenance';
  gps?: {
    lat: number;
    lng: number;
  };
}

export interface InsertTrip {
  busId: number;
  routeId: number;
  startTime: string;
  endTime?: string;
  status?: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}

// Auth interfaces
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  role: 'admin' | 'operator' | 'viewer';
}

export interface AuthResponse {
  token: string;
  user: User;
}

// API Response interfaces
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
