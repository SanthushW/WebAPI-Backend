import { useAuth } from '@/hooks/use-auth';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'routes', label: 'Routes', icon: 'route' },
    { id: 'buses', label: 'Buses', icon: 'directions_bus' },
    { id: 'trips', label: 'Trips', icon: 'schedule' },
    { id: 'realtime', label: 'Real-time Tracking', icon: 'gps_fixed' },
    { id: 'docs', label: 'API Documentation', icon: 'description' },
  ];

  const systemItems = [
    { id: 'health', label: 'Health Monitor', icon: 'health_and_safety' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="material-icons text-white text-xl">directions_bus</span>
          </div>
          <div>
            <h1 className="font-bold text-lg text-gray-900">BusTracker</h1>
            <p className="text-xs text-gray-500">National Transport Commission</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6">
        <div className="px-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md mt-1 transition-colors ${
                activeTab === item.id
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              data-testid={`nav-${item.id}`}
            >
              <span className="material-icons mr-3 text-xl">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        <div className="px-3 mt-8">
          <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            System
          </p>
          {systemItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md mt-2 transition-colors ${
                activeTab === item.id
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              data-testid={`nav-${item.id}`}
            >
              <span className="material-icons mr-3 text-xl">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* User section */}
      <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="material-icons text-gray-600 text-sm">person</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">
              {user ? `${user.firstName} ${user.lastName}` : 'Operator Name'}
            </p>
            <p className="text-xs text-gray-500">{user?.role || 'Fleet Manager'}</p>
          </div>
          <button
            onClick={logout}
            className="text-gray-400 hover:text-gray-600"
            data-testid="button-logout"
          >
            <span className="material-icons text-xl">logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
