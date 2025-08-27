import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { busesApi, routesApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/common/loading-spinner';
import type { Bus, BusQuery, Route } from '@/types';

export default function BusFleetManagement() {
  const [filters, setFilters] = useState<BusQuery>({
    route: undefined,
    status: undefined,
    sort: undefined,
    limit: 20,
    offset: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: busesData, isLoading: busesLoading } = useQuery({
    queryKey: ['/buses', filters],
    queryFn: () => busesApi.getBuses(filters),
  });

  const { data: routesData } = useQuery({
    queryKey: ['/routes'],
    queryFn: () => routesApi.getRoutes({ offset: 0, limit: 100 }),
  });

  const deleteBusMutation = useMutation({
    mutationFn: busesApi.deleteBus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/buses'] });
      toast({
        title: "Bus deleted",
        description: "Bus has been successfully removed from the fleet.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDelete = (busId: string) => {
    if (confirm('Are you sure you want to delete this bus?')) {
      deleteBusMutation.mutate(busId);
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex px-2 py-1 text-xs font-semibold rounded-full";
    switch (status) {
      case 'active':
        return `${baseClasses} bg-success-100 text-success-600`;
      case 'maintenance':
        return `${baseClasses} bg-warning-100 text-warning-600`;
      case 'out_of_service':
        return `${baseClasses} bg-error-100 text-error-600`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-600`;
    }
  };

  const getGpsStatusIcon = (gpsStatus: string) => {
    switch (gpsStatus) {
      case 'online':
        return <div className="w-2 h-2 bg-success-500 rounded-full"></div>;
      case 'offline':
        return <div className="w-2 h-2 bg-gray-400 rounded-full"></div>;
      case 'error':
        return <div className="w-2 h-2 bg-error-500 rounded-full"></div>;
      default:
        return <div className="w-2 h-2 bg-gray-400 rounded-full"></div>;
    }
  };

  const getRouteNameById = (routeId: string | null) => {
    if (!routeId || !routesData?.routes) return 'Unassigned';
    const route = routesData.routes.find((r: Route) => r.id === routeId);
    return route ? route.name : 'Unknown Route';
  };

  if (busesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner className="w-8 h-8" />
      </div>
    );
  }

  const buses = busesData?.buses || [];
  const total = busesData?.total || 0;

  // Calculate fleet metrics
  const activeBuses = buses.filter((b: Bus) => b.status === 'active').length;
  const maintenanceBuses = buses.filter((b: Bus) => b.status === 'maintenance').length;
  const outOfServiceBuses = buses.filter((b: Bus) => b.status === 'out_of_service').length;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Bus Fleet Management</h3>
              <p className="text-sm text-gray-600">Register and manage bus fleet operations</p>
            </div>
            <button 
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center space-x-2"
              data-testid="button-register-bus"
            >
              <span className="material-icons text-sm">add</span>
              <span>Register Bus</span>
            </button>
          </div>
        </div>

        {/* Fleet Overview Cards */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-success-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-success-600">Active</p>
                  <p className="text-2xl font-bold text-success-600" data-testid="fleet-active">
                    {activeBuses}
                  </p>
                </div>
                <span className="material-icons text-success-600">directions_bus</span>
              </div>
            </div>

            <div className="bg-warning-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-warning-600">Maintenance</p>
                  <p className="text-2xl font-bold text-warning-600" data-testid="fleet-maintenance">
                    {maintenanceBuses}
                  </p>
                </div>
                <span className="material-icons text-warning-600">build</span>
              </div>
            </div>

            <div className="bg-error-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-error-600">Out of Service</p>
                  <p className="text-2xl font-bold text-error-600" data-testid="fleet-out-of-service">
                    {outOfServiceBuses}
                  </p>
                </div>
                <span className="material-icons text-error-600">error</span>
              </div>
            </div>

            <div className="bg-primary-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-primary-600">Total Fleet</p>
                  <p className="text-2xl font-bold text-primary-600" data-testid="fleet-total">
                    {total}
                  </p>
                </div>
                <span className="material-icons text-primary-600">assessment</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bus Filters */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative">
                <span className="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">search</span>
                <input
                  type="text"
                  placeholder="Search by bus number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  data-testid="input-search-buses"
                />
              </div>

              <select
                value={filters.route || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, route: e.target.value || undefined }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                data-testid="select-route-filter"
              >
                <option value="">All Routes</option>
                {routesData?.routes.map((route: Route) => (
                  <option key={route.id} value={route.id}>
                    {route.name}
                  </option>
                ))}
              </select>

              <select
                value={filters.status || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any || undefined }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                data-testid="select-status-filter"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="maintenance">Maintenance</option>
                <option value="out_of_service">Out of Service</option>
              </select>
            </div>
          </div>
        </div>

        {/* Buses Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buses.map((bus: Bus) => (
              <div
                key={bus.id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                data-testid={`bus-card-${bus.id}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      bus.status === 'active' 
                        ? 'bg-success-100' 
                        : bus.status === 'maintenance'
                        ? 'bg-warning-100'
                        : 'bg-error-100'
                    }`}>
                      <span className={`material-icons text-xl ${
                        bus.status === 'active' 
                          ? 'text-success-600' 
                          : bus.status === 'maintenance'
                          ? 'text-warning-600'
                          : 'text-error-600'
                      }`}>
                        directions_bus
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{bus.busNumber}</h4>
                      <p className="text-sm text-gray-500">Reg: {bus.registrationNumber}</p>
                    </div>
                  </div>
                  <span className={getStatusBadge(bus.status)}>
                    {bus.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Route:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {getRouteNameById(bus.routeId)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Capacity:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {bus.capacity} passengers
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Last Service:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {bus.lastServiceDate 
                        ? new Date(bus.lastServiceDate).toLocaleDateString() 
                        : 'Not scheduled'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">GPS Status:</span>
                    <div className="flex items-center space-x-1">
                      {getGpsStatusIcon(bus.gpsStatus)}
                      <span className={`text-sm font-medium ${
                        bus.gpsStatus === 'online' 
                          ? 'text-success-600' 
                          : bus.gpsStatus === 'error'
                          ? 'text-error-600'
                          : 'text-gray-500'
                      }`}>
                        {bus.gpsStatus}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <button 
                    className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                    data-testid={`button-view-${bus.id}`}
                  >
                    View Details
                  </button>
                  <div className="flex items-center space-x-2">
                    <button 
                      className="p-2 text-gray-400 hover:text-gray-600"
                      data-testid={`button-edit-${bus.id}`}
                    >
                      <span className="material-icons text-sm">edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(bus.id)}
                      disabled={deleteBusMutation.isPending}
                      className="p-2 text-gray-400 hover:text-error-600 disabled:opacity-50"
                      data-testid={`button-delete-${bus.id}`}
                    >
                      <span className="material-icons text-sm">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {buses.length === 0 && (
            <div className="text-center py-12">
              <span className="material-icons text-gray-400 text-6xl mb-4">directions_bus</span>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No buses found</h3>
              <p className="text-gray-600">Register your first bus to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
