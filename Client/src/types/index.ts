export * from './shared';

export interface DashboardMetrics {
  activeRoutes: number;
  totalBuses: number;
  activeBuses: number;
  todaysTrips: number;
  completedTrips: number;
  systemHealth: string;
}

export interface SystemHealth {
  apiStatus: string;
  uptime: string;
  responseTime: string;
  connections: number;
  dbStatus: string;
  gpsStatus: string;
}

export interface RecentApiCall {
  method: string;
  endpoint: string;
  statusCode: number;
  responseTime: string;
  timestamp: string;
}

export interface SystemLog {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: string;
}

export type TabType = 'dashboard' | 'routes' | 'buses' | 'trips' | 'docs' | 'health';
