import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tripsApi, busesApi, routesApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/common/loading-spinner';
import type { Trip, TripQuery, Bus, Route } from '@/types';

export default function TripsManagement() {
  const [filters, setFilters] = useState<TripQuery>({
    date: new Date().toISOString().split('T')[0], // Today's date
    busId: undefined,
    routeId: undefined,
    status: undefined,
    limit: 20,
    offset: 0,
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: tripsData, isLoading: tripsLoading } = useQuery({
    queryKey: ['/trips', filters],
    queryFn: () => tripsApi.getTrips(filters),
  });

  const { data: busesData } = useQuery({
    queryKey: ['/buses'],
    queryFn: () => busesApi.getBuses({ offset: 0, limit: 100 }),
  });

  const { data: routesData } = useQuery({
    queryKey: ['/routes'],
    queryFn: () => routesApi.getRoutes({ offset: 0, limit: 100 }),
  });

  const deleteTripMutation = useMutation({
    mutationFn: tripsApi.deleteTrip,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/trips'] });
      toast({
        title: "Trip cancelled",
        description: "Trip has been successfully cancelled.",
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

  const handleCancelTrip = (tripId: string) => {
    if (confirm('Are you sure you want to cancel this trip?')) {
      deleteTripMutation.mutate(tripId);
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex px-2 py-1 text-xs font-semibold rounded-full";
    switch (status) {
      case 'scheduled':
        return `${baseClasses} bg-primary-100 text-primary-600`;
      case 'departed':
        return `${baseClasses} bg-warning-100 text-warning-600`;
      case 'in_transit':
        return `${baseClasses} bg-success-100 text-success-600`;
      case 'arrived':
        return `${baseClasses} bg-gray-100 text-gray-600`;
      case 'cancelled':
        return `${baseClasses} bg-error-100 text-error-600`;
      case 'delayed':
        return `${baseClasses} bg-warning-100 text-warning-600`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-600`;
    }
  };

  const getBusNumber = (busId: string) => {
    if (!busesData?.buses) return 'Unknown';
    const bus = busesData.buses.find((b: Bus) => b.id === busId);
    return bus ? bus.busNumber : 'Unknown';
  };

  const getRouteName = (routeId: string) => {
    if (!routesData?.routes) return 'Unknown';
    const route = routesData.routes.find((r: Route) => r.id === routeId);
    return route ? route.name : 'Unknown';
  };

  const formatTime = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  if (tripsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner className="w-8 h-8" />
      </div>
    );
  }

  const trips = tripsData?.trips || [];
  const total = tripsData?.total || 0;

  // Calculate trip metrics
  const scheduledTrips = trips.filter((t: Trip) => t.status === 'scheduled').length;
  const inTransitTrips = trips.filter((t: Trip) => t.status === 'in_transit' || t.status === 'departed').length;
  const completedTrips = trips.filter((t: Trip) => t.status === 'arrived').length;
  const delayedTrips = trips.filter((t: Trip) => t.status === 'delayed').length;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Trips Management</h3>
              <p className="text-sm text-gray-600">Schedule and track bus trips</p>
            </div>
            <button 
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center space-x-2"
              data-testid="button-schedule-trip"
            >
              <span className="material-icons text-sm">add</span>
              <span>Schedule Trip</span>
            </button>
          </div>
        </div>

        {/* Trip Metrics Overview */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-primary-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-primary-600">Scheduled</p>
                  <p className="text-2xl font-bold text-primary-600" data-testid="trips-scheduled">
                    {scheduledTrips}
                  </p>
                </div>
                <span className="material-icons text-primary-600">schedule</span>
              </div>
            </div>

            <div className="bg-warning-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-warning-600">In Transit</p>
                  <p className="text-2xl font-bold text-warning-600" data-testid="trips-in-transit">
                    {inTransitTrips}
                  </p>
                </div>
                <span className="material-icons text-warning-600">directions_bus</span>
              </div>
            </div>

            <div className="bg-success-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-success-600">Completed</p>
                  <p className="text-2xl font-bold text-success-600" data-testid="trips-completed">
                    {completedTrips}
                  </p>
                </div>
                <span className="material-icons text-success-600">check_circle</span>
              </div>
            </div>

            <div className="bg-error-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-error-600">Delayed</p>
                  <p className="text-2xl font-bold text-error-600" data-testid="trips-delayed">
                    {delayedTrips}
                  </p>
                </div>
                <span className="material-icons text-error-600">warning</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trip Filters */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative">
                <input
                  type="date"
                  value={filters.date || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value || undefined }))}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  data-testid="input-date-filter"
                />
              </div>

              <select
                value={filters.routeId || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, routeId: e.target.value || undefined }))}
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
                value={filters.busId || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, busId: e.target.value || undefined }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                data-testid="select-bus-filter"
              >
                <option value="">All Buses</option>
                {busesData?.buses.map((bus: Bus) => (
                  <option key={bus.id} value={bus.id}>
                    {bus.busNumber}
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
                <option value="scheduled">Scheduled</option>
                <option value="departed">Departed</option>
                <option value="in_transit">In Transit</option>
                <option value="arrived">Arrived</option>
                <option value="delayed">Delayed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span data-testid="trips-total">{total} trips</span>
              <span>•</span>
              <span data-testid="trips-date">
                {filters.date ? formatDate(filters.date + 'T00:00:00.000Z') : 'All dates'}
              </span>
            </div>
          </div>
        </div>

        {/* Trips Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trip Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Schedule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Passengers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {trips.map((trip: Trip) => (
                <tr key={trip.id} className="hover:bg-gray-50" data-testid={`trip-row-${trip.id}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {getBusNumber(trip.busId)} → {getRouteName(trip.routeId)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Driver: {trip.driverId || 'Unassigned'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div>Dept: {formatTime(trip.scheduledDepartureTime.toString())}</div>
                      <div>Arr: {formatTime(trip.scheduledArrivalTime.toString())}</div>
                      {trip.delayMinutes && trip.delayMinutes > 0 && (
                        <div className="text-error-600">+{trip.delayMinutes} min</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadge(trip.status)}>
                      {trip.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {trip.passengerCount || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        className="text-primary-600 hover:text-primary-700"
                        data-testid={`button-view-${trip.id}`}
                      >
                        View
                      </button>
                      <button 
                        className="text-gray-600 hover:text-gray-700"
                        data-testid={`button-edit-${trip.id}`}
                      >
                        Edit
                      </button>
                      {(trip.status === 'scheduled' || trip.status === 'delayed') && (
                        <button
                          onClick={() => handleCancelTrip(trip.id)}
                          disabled={deleteTripMutation.isPending}
                          className="text-error-600 hover:text-error-700 disabled:opacity-50"
                          data-testid={`button-cancel-${trip.id}`}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {trips.length === 0 && (
          <div className="text-center py-12">
            <span className="material-icons text-gray-400 text-6xl mb-4">schedule</span>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No trips found</h3>
            <p className="text-gray-600">Schedule your first trip to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
