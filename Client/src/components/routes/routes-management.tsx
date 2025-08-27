import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { routesApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/common/loading-spinner';
import type { Route, RouteQuery } from '@/types';

export default function RoutesManagement() {
  const [filters, setFilters] = useState<RouteQuery>({
    status: undefined,
    sort: undefined,
    limit: 10,
    offset: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ['/routes', filters],
    queryFn: () => routesApi.getRoutes(filters),
  });

  const deleteRouteMutation = useMutation({
    mutationFn: routesApi.deleteRoute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/routes'] });
      toast({
        title: "Route deleted",
        description: "Route has been successfully deleted.",
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

  const handleDelete = (routeId: string) => {
    if (confirm('Are you sure you want to delete this route?')) {
      deleteRouteMutation.mutate(routeId);
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex px-2 py-1 text-xs font-semibold rounded-full";
    switch (status) {
      case 'active':
        return `${baseClasses} bg-success-100 text-success-600`;
      case 'inactive':
        return `${baseClasses} bg-gray-100 text-gray-600`;
      case 'maintenance':
        return `${baseClasses} bg-warning-100 text-warning-600`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-600`;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner className="w-8 h-8" />
      </div>
    );
  }

  const routes = data?.routes || [];
  const total = data?.total || 0;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Routes Management</h3>
              <p className="text-sm text-gray-600">Manage bus routes across Sri Lanka</p>
            </div>
            <button 
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center space-x-2"
              data-testid="button-add-route"
            >
              <span className="material-icons text-sm">add</span>
              <span>Add Route</span>
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative">
                <span className="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">search</span>
                <input
                  type="text"
                  placeholder="Search routes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  data-testid="input-search-routes"
                />
              </div>

              <select
                value={filters.status || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any || undefined }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                data-testid="select-status-filter"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Under Maintenance</option>
              </select>

              <select
                value={filters.sort || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value as any || undefined }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                data-testid="select-sort"
              >
                <option value="">Sort by</option>
                <option value="name">Name</option>
                <option value="distance">Distance</option>
                <option value="created">Date Created</option>
              </select>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span data-testid="routes-total">{total} routes</span>
              <span>•</span>
              <span data-testid="routes-active">
                {routes.filter((r: Route) => r.status === 'active').length} active
              </span>
            </div>
          </div>
        </div>

        {/* Routes Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Distance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {routes.map((route: Route) => (
                <tr key={route.id} className="hover:bg-gray-50" data-testid={`route-row-${route.id}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{route.name}</div>
                      <div className="text-sm text-gray-500">{route.routeCode}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {route.distance} km
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {route.duration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadge(route.status)}>
                      {route.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        className="text-primary-600 hover:text-primary-700"
                        data-testid={`button-view-${route.id}`}
                      >
                        View
                      </button>
                      <button 
                        className="text-gray-600 hover:text-gray-700"
                        data-testid={`button-edit-${route.id}`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(route.id)}
                        disabled={deleteRouteMutation.isPending}
                        className="text-error-600 hover:text-error-700 disabled:opacity-50"
                        data-testid={`button-delete-${route.id}`}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {routes.length === 0 && (
          <div className="text-center py-12">
            <span className="material-icons text-gray-400 text-6xl mb-4">route</span>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No routes found</h3>
            <p className="text-gray-600">Get started by creating your first route.</p>
          </div>
        )}
      </div>
    </div>
  );
}
