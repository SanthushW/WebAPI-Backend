import { useQuery } from '@tanstack/react-query';
import { routesApi, busesApi, healthApi } from '@/lib/api';
import LoadingSpinner from '@/components/common/loading-spinner';
import type { DashboardMetrics } from '@/types';

export default function Dashboard() {
  const { data: routesData } = useQuery({
    queryKey: ['/routes'],
    queryFn: () => routesApi.getRoutes({ offset: 0, limit: 100 }),
  });

  const { data: busesData } = useQuery({
    queryKey: ['/buses'],
    queryFn: () => busesApi.getBuses({ offset: 0, limit: 100 }),
  });

  const { data: healthData } = useQuery({
    queryKey: ['/health'],
    queryFn: () => healthApi.getHealth(),
  });

  // Ensure data is loaded before computing metrics
  if (!routesData || !busesData) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner className="w-8 h-8" />
      </div>
    );
  }

  // Normalize responses to arrays
  const routesArray = Array.isArray(routesData)
    ? routesData
    : Array.isArray((routesData as any)?.routes)
      ? (routesData as any).routes
      : [];
  const busesArray = Array.isArray(busesData)
    ? busesData
    : Array.isArray((busesData as any)?.buses)
      ? (busesData as any).buses
      : [];

  const metrics: DashboardMetrics = {
    activeRoutes: (routesArray ?? []).filter((r: any) => r.status === 'active').length,
    totalBuses: (busesArray ?? []).length,
    activeBuses: (busesArray ?? []).filter((b: any) => b.status === 'active').length,
    todaysTrips: 147, // Would come from actual API
    completedTrips: 98, // Would come from actual API
    systemHealth: (healthData as any)?.status || 'unknown',
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Routes</p>
              <p className="text-3xl font-bold text-gray-900" data-testid="metric-active-routes">
                {metrics.activeRoutes}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <span className="material-icons text-primary-600 text-xl">route</span>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm text-success-600">+2</span>
            <span className="text-sm text-gray-500 ml-1">from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Fleet Size</p>
              <p className="text-3xl font-bold text-gray-900" data-testid="metric-fleet-size">
                {metrics.totalBuses}
              </p>
            </div>
            <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
              <span className="material-icons text-success-600 text-xl">directions_bus</span>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm text-success-600" data-testid="metric-active-buses">
              {metrics.activeBuses} active
            </span>
            <span className="text-sm text-gray-500 ml-1">
              • {metrics.totalBuses - metrics.activeBuses} maintenance
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Trips</p>
              <p className="text-3xl font-bold text-gray-900" data-testid="metric-todays-trips">
                {metrics.todaysTrips}
              </p>
            </div>
            <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
              <span className="material-icons text-warning-600 text-xl">schedule</span>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm text-success-600" data-testid="metric-completed-trips">
              {metrics.completedTrips} completed
            </span>
            <span className="text-sm text-gray-500 ml-1">
              • {metrics.todaysTrips - metrics.completedTrips} ongoing
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">System Health</p>
              <p className="text-3xl font-bold text-success-600">99.2%</p>
            </div>
            <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
              <span className="material-icons text-success-600 text-xl">health_and_safety</span>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm text-success-600">All systems operational</span>
          </div>
        </div>
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Bus Status */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Live Bus Status</h3>
            <p className="text-sm text-gray-600">Real-time tracking of active buses</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {(busesArray ?? []).slice(0, 3).map((bus: any) => (
                <div
                  key={bus.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  data-testid={`bus-status-${bus.id}`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      bus.status === 'active' ? 'bg-success-100' : 'bg-warning-100'
                    }`}>
                      <span className={`material-icons ${
                        bus.status === 'active' ? 'text-success-600' : 'text-warning-600'
                      }`}>
                        directions_bus
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{bus.busNumber}</p>
                      <p className="text-sm text-gray-600">Route {bus.routeId}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      bus.status === 'active' 
                        ? 'bg-success-100 text-success-600'
                        : 'bg-warning-100 text-warning-600'
                    }`}>
                      {bus.status === 'active' ? 'On Time' : 'Maintenance'}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">
                      {bus.status === 'active' ? 'ETA: 14:30' : 'In garage'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            <p className="text-sm text-gray-600">Common management tasks</p>
          </div>
          <div className="p-6 space-y-4">
            <button
              className="w-full flex items-center justify-between p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              data-testid="action-add-route"
            >
              <div className="flex items-center space-x-3">
                <span className="material-icons text-primary-600">add_road</span>
                <span className="font-medium text-gray-900">Add New Route</span>
              </div>
              <span className="material-icons text-gray-400">chevron_right</span>
            </button>

            <button
              className="w-full flex items-center justify-between p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              data-testid="action-register-bus"
            >
              <div className="flex items-center space-x-3">
                <span className="material-icons text-success-600">add</span>
                <span className="font-medium text-gray-900">Register Bus</span>
              </div>
              <span className="material-icons text-gray-400">chevron_right</span>
            </button>

            <button
              className="w-full flex items-center justify-between p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              data-testid="action-schedule-trip"
            >
              <div className="flex items-center space-x-3">
                <span className="material-icons text-warning-600">schedule</span>
                <span className="font-medium text-gray-900">Schedule Trip</span>
              </div>
              <span className="material-icons text-gray-400">chevron_right</span>
            </button>

            <button
              className="w-full flex items-center justify-between p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              data-testid="action-view-reports"
            >
              <div className="flex items-center space-x-3">
                <span className="material-icons text-gray-600">analytics</span>
                <span className="font-medium text-gray-900">View Reports</span>
              </div>
              <span className="material-icons text-gray-400">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
