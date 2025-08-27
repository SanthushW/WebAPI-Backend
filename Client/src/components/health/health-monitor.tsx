import { useQuery } from '@tanstack/react-query';
import { healthApi } from '@/lib/api';
import LoadingSpinner from '@/components/common/loading-spinner';
import type { SystemHealth, RecentApiCall, SystemLog } from '@/types';

export default function HealthMonitor() {
  const { data: healthData, isLoading } = useQuery({
    queryKey: ['/health'],
    queryFn: () => healthApi.getHealth(),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Mock recent API calls data (in real app, this would come from API)
  const recentApiCalls: RecentApiCall[] = [
    {
      method: 'GET',
      endpoint: '/buses?route=1',
      statusCode: 200,
      responseTime: '234ms',
      timestamp: '14:23:45',
    },
    {
      method: 'POST',
      endpoint: '/trips',
      statusCode: 201,
      responseTime: '156ms',
      timestamp: '14:22:30',
    },
    {
      method: 'PUT',
      endpoint: '/buses/123',
      statusCode: 200,
      responseTime: '189ms',
      timestamp: '14:21:15',
    },
    {
      method: 'GET',
      endpoint: '/buses/999',
      statusCode: 404,
      responseTime: '95ms',
      timestamp: '14:20:42',
    },
  ];

  // Mock system logs data
  const systemLogs: SystemLog[] = [
    {
      id: '1',
      type: 'success',
      title: 'GPS Service Connected',
      message: 'GPS tracking service successfully reconnected for bus #CB-1001',
      timestamp: '14:25:30',
    },
    {
      id: '2',
      type: 'warning',
      title: 'High Response Time Detected',
      message: 'API response time exceeded 500ms threshold for /buses endpoint',
      timestamp: '14:20:15',
    },
    {
      id: '3',
      type: 'info',
      title: 'New Bus Registered',
      message: 'Bus #AD-4007 successfully added to Colombo-Anuradhapura route',
      timestamp: '14:15:42',
    },
    {
      id: '4',
      type: 'error',
      title: 'Authentication Failed',
      message: 'Invalid JWT token provided for /routes POST request',
      timestamp: '14:10:28',
    },
  ];

  const getStatusColor = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) return 'text-success-600';
    if (statusCode >= 400 && statusCode < 500) return 'text-error-600';
    if (statusCode >= 500) return 'text-error-600';
    return 'text-gray-600';
  };

  const getLogIcon = (type: SystemLog['type']) => {
    switch (type) {
      case 'success':
        return 'check_circle';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      case 'info':
      default:
        return 'info';
    }
  };

  const getLogColor = (type: SystemLog['type']) => {
    switch (type) {
      case 'success':
        return 'border-success-200 bg-success-50 text-success-700';
      case 'warning':
        return 'border-warning-200 bg-warning-50 text-warning-700';
      case 'error':
        return 'border-error-200 bg-error-50 text-error-700';
      case 'info':
      default:
        return 'border-gray-200 bg-gray-50 text-gray-700';
    }
  };

  const getLogDotColor = (type: SystemLog['type']) => {
    switch (type) {
      case 'success':
        return 'bg-success-500';
      case 'warning':
        return 'bg-warning-500';
      case 'error':
        return 'bg-error-500';
      case 'info':
      default:
        return 'bg-primary-500';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner className="w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Status Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">System Health Overview</h3>
            <p className="text-sm text-gray-600">Real-time API and system monitoring</p>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-success-500 rounded-full animate-pulse"></div>
                <span className="font-medium text-gray-900">API Status</span>
              </div>
              <span className="text-success-600 font-medium" data-testid="api-status">
                {healthData?.status || 'Unknown'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">Uptime</span>
              <span className="text-gray-600" data-testid="system-uptime">
                {healthData?.uptime || 'Unknown'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">Response Time</span>
              <span className="text-gray-600" data-testid="response-time">
                {healthData?.responseTime || 'Unknown'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">Active Connections</span>
              <span className="text-gray-600" data-testid="active-connections">
                {healthData?.connections || 'Unknown'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">Database Status</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                <span className="text-success-600 font-medium" data-testid="db-status">
                  {healthData?.dbStatus || 'Unknown'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">GPS Service</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                <span className="text-success-600 font-medium" data-testid="gps-status">
                  {healthData?.gpsStatus || 'Unknown'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent API Calls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent API Activity</h3>
            <p className="text-sm text-gray-600">Latest API requests and responses</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentApiCalls.map((call, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    call.statusCode >= 400 ? 'bg-error-50' : 'bg-gray-50'
                  }`}
                  data-testid={`api-call-${index}`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 text-xs font-mono rounded ${
                      call.method === 'GET' ? 'bg-blue-100 text-blue-700' :
                      call.method === 'POST' ? 'bg-green-100 text-green-700' :
                      call.method === 'PUT' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {call.method}
                    </span>
                    <span className="text-sm font-mono text-gray-900">{call.endpoint}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`text-xs font-medium ${getStatusColor(call.statusCode)}`}>
                      {call.statusCode}
                    </span>
                    <span className="text-xs text-gray-500">{call.responseTime}</span>
                    <span className="text-xs text-gray-500">{call.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Error Logs and Alerts */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">System Logs & Alerts</h3>
              <p className="text-sm text-gray-600">Recent system events and error notifications</p>
            </div>
            <button 
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
              data-testid="button-clear-logs"
            >
              Clear Logs
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {systemLogs.map((log) => (
              <div
                key={log.id}
                className={`flex items-start space-x-4 p-4 border rounded-lg ${getLogColor(log.type)}`}
                data-testid={`system-log-${log.id}`}
              >
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${getLogDotColor(log.type)}`}></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{log.title}</span>
                    <span className="text-xs">{log.timestamp}</span>
                  </div>
                  <p className="text-sm mt-1">{log.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
