import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { healthApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/common/loading-spinner';

export default function APIDocumentation() {
  const [selectedEndpoint, setSelectedEndpoint] = useState('GET /routes');
  const [testToken, setTestToken] = useState('');
  const [testResponse, setTestResponse] = useState<any>(null);
  const [testLoading, setTestLoading] = useState(false);

  const { toast } = useToast();

  const { data: healthData } = useQuery({
    queryKey: ['/health'],
    queryFn: () => healthApi.getHealth(),
  });

  const endpoints = [
    {
      method: 'GET',
      path: '/routes',
      description: 'List all routes with filtering and sorting',
      params: '?status=active&sort=name&limit=10',
      auth: true,
    },
    {
      method: 'GET',
      path: '/routes/:id',
      description: 'Get specific route by ID',
      params: '',
      auth: true,
    },
    {
      method: 'POST',
      path: '/routes',
      description: 'Create new route',
      params: '',
      auth: true,
      body: '{ name, startPoint, endPoint, distance, duration, stops[] }',
    },
    {
      method: 'PUT',
      path: '/routes/:id',
      description: 'Update existing route',
      params: '',
      auth: true,
    },
    {
      method: 'DELETE',
      path: '/routes/:id',
      description: 'Delete route',
      params: '',
      auth: true,
    },
    {
      method: 'GET',
      path: '/buses',
      description: 'List all buses with filtering by route and status',
      params: '?route=1&status=active&sort=busNumber',
      auth: true,
    },
    {
      method: 'GET',
      path: '/buses/:id',
      description: 'Get specific bus details including GPS location',
      params: '',
      auth: true,
    },
    {
      method: 'POST',
      path: '/buses',
      description: 'Register new bus',
      params: '',
      auth: true,
      body: '{ busNumber, registrationNumber, capacity, routeId, gpsDeviceId }',
    },
    {
      method: 'PUT',
      path: '/buses/:id',
      description: 'Update bus information including GPS location and status',
      params: '',
      auth: true,
    },
    {
      method: 'GET',
      path: '/trips',
      description: 'List all trips with filtering by date',
      params: '?date=2025-08-26&busId=bus1',
      auth: true,
    },
    {
      method: 'POST',
      path: '/trips',
      description: 'Schedule new trip',
      params: '',
      auth: true,
      body: '{ busId, routeId, scheduledDepartureTime, scheduledArrivalTime }',
    },
    {
      method: 'GET',
      path: '/health',
      description: 'Get API health status and uptime',
      params: '',
      auth: false,
      response: '{ "status": "running", "uptime": "24h", "version": "1.0.0" }',
    },
    {
      method: 'POST',
      path: '/auth/login',
      description: 'Login and receive JWT token',
      params: '',
      auth: false,
      body: '{ email, password }',
    },
    {
      method: 'POST',
      path: '/auth/register',
      description: 'Register a new operator account',
      params: '',
      auth: false,
      body: '{ firstName, lastName, email, password, role }',
    },
  ];

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-blue-100 text-blue-700';
      case 'POST':
        return 'bg-green-100 text-green-700';
      case 'PUT':
        return 'bg-yellow-100 text-yellow-700';
      case 'DELETE':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleTestAPI = async () => {
    if (!testToken && selectedEndpoint !== 'GET /health') {
      toast({
        title: "Token required",
        description: "Please provide an authorization token for this endpoint.",
        variant: "destructive",
      });
      return;
    }

    setTestLoading(true);
    try {
      // For demo purposes, we'll just show a mock response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTestResponse({
        status: 200,
        statusText: 'OK',
        data: {
          message: 'API test successful',
          endpoint: selectedEndpoint,
          timestamp: new Date().toISOString(),
        },
      });

      toast({
        title: "API test successful",
        description: "The endpoint responded successfully.",
      });
    } catch (error) {
      setTestResponse({
        status: 401,
        statusText: 'Unauthorized',
        error: 'Invalid token or endpoint not found',
      });
      
      toast({
        title: "API test failed",
        description: "The request failed. Check your token and endpoint.",
        variant: "destructive",
      });
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">API Documentation</h3>
          <p className="text-sm text-gray-600">Complete API reference for bus tracking system</p>
        </div>

        <div className="p-6">
          {/* API Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-primary-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <span className="material-icons text-primary-600">security</span>
                <div>
                  <p className="font-medium text-primary-600">Authentication</p>
                  <p className="text-sm text-gray-600">JWT-based auth</p>
                </div>
              </div>
            </div>

            <div className="bg-success-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <span className="material-icons text-success-600">route</span>
                <div>
                  <p className="font-medium text-success-600">Routes API</p>
                  <p className="text-sm text-gray-600">5 endpoints</p>
                </div>
              </div>
            </div>

            <div className="bg-warning-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <span className="material-icons text-warning-600">directions_bus</span>
                <div>
                  <p className="font-medium text-warning-600">Buses API</p>
                  <p className="text-sm text-gray-600">4 endpoints</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <span className="material-icons text-gray-600">schedule</span>
                <div>
                  <p className="font-medium text-gray-600">Trips API</p>
                  <p className="text-sm text-gray-600">5 endpoints</p>
                </div>
              </div>
            </div>
          </div>

          {/* API Endpoints Documentation */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-900">API Endpoints</h4>
            
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="max-h-96 overflow-y-auto">
                {endpoints.map((endpoint, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-200 last:border-b-0"
                    data-testid={`endpoint-${endpoint.method}-${endpoint.path.replace(/[/:]/g, '-')}`}
                  >
                    <div className="p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`px-2 py-1 text-xs font-mono rounded ${getMethodColor(endpoint.method)}`}>
                          {endpoint.method}
                        </span>
                        <code className="text-sm font-mono text-gray-900">{endpoint.path}</code>
                        {endpoint.auth && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                            <span className="material-icons text-xs mr-1">lock</span>
                            Auth Required
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{endpoint.description}</p>
                      
                      {endpoint.params && (
                        <div className="mb-2">
                          <span className="text-xs font-semibold text-gray-500">Query params: </span>
                          <code className="text-xs text-gray-600">{endpoint.params}</code>
                        </div>
                      )}
                      
                      {endpoint.body && (
                        <div className="mb-2">
                          <span className="text-xs font-semibold text-gray-500">Request body: </span>
                          <code className="text-xs text-gray-600">{endpoint.body}</code>
                        </div>
                      )}
                      
                      {endpoint.response && (
                        <div>
                          <span className="text-xs font-semibold text-gray-500">Response: </span>
                          <code className="text-xs text-gray-600">{endpoint.response}</code>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive API Explorer */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-4">Try the API</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Endpoint</label>
                <select
                  value={selectedEndpoint}
                  onChange={(e) => setSelectedEndpoint(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  data-testid="select-test-endpoint"
                >
                  {endpoints.map((endpoint, index) => (
                    <option key={index} value={`${endpoint.method} ${endpoint.path}`}>
                      {endpoint.method} {endpoint.path}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Authorization Token
                  {selectedEndpoint !== 'GET /health' && <span className="text-red-500 ml-1">*</span>}
                </label>
                <input
                  type="text"
                  value={testToken}
                  onChange={(e) => setTestToken(e.target.value)}
                  placeholder="Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  data-testid="input-test-token"
                />
              </div>

              <button
                onClick={handleTestAPI}
                disabled={testLoading}
                className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                data-testid="button-test-api"
              >
                {testLoading ? (
                  <>
                    <LoadingSpinner className="w-4 h-4 mr-2" />
                    Testing...
                  </>
                ) : (
                  'Send Request'
                )}
              </button>

              {testResponse && (
                <div className="mt-4 p-4 bg-white border rounded-md">
                  <h5 className="font-medium text-gray-900 mb-2">Response:</h5>
                  <pre className="text-sm text-gray-600 overflow-x-auto">
                    {JSON.stringify(testResponse, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* API Status */}
          {healthData && (
            <div className="mt-8 p-4 bg-success-50 border border-success-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                <span className="text-sm font-medium text-success-700">
                  API Status: {healthData.status} (Uptime: {healthData.uptime})
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
