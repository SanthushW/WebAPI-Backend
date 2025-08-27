// QueryClientProvider is provided at the root (main.tsx)
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";

// Components
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import AuthModal from "@/components/auth/auth-modal";
import Dashboard from "@/pages/dashboard";
import RoutesManagement from "@/components/routes/routes-management";
import BusFleetManagement from "@/components/buses/bus-fleet-management";
import TripsManagement from "@/components/trips/trips-management";
import APIDocumentation from "@/components/docs/api-documentation";
import HealthMonitor from "@/components/health/health-monitor";
// import NotFound from "@/pages/not-found"; // Not used currently

import type { TabType } from "@/types";

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Auto-open the auth modal when unauthenticated (old behavior)
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setShowAuthModal(true);
    } else {
      setShowAuthModal(false);
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="material-icons text-white text-2xl">directions_bus</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">BusTracker</h1>
          <p className="text-gray-600 mb-4">National Transport Commission</p>
          <p className="text-sm text-gray-500">Please authenticate to continue</p>
        </div>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} defaultMode="login" />
      </div>
    );
  }

  const getPageTitle = (tab: TabType): string => {
    switch (tab) {
      case 'dashboard': return 'Dashboard';
      case 'routes': return 'Routes Management';
      case 'buses': return 'Bus Fleet Management';
      case 'trips': return 'Trips Management';
      case 'docs': return 'API Documentation';
      case 'health': return 'System Health Monitor';
      default: return 'Dashboard';
    }
  };

  const getPageSubtitle = (tab: TabType): string => {
    switch (tab) {
      case 'dashboard': return 'Real-time overview of bus operations';
      case 'routes': return 'Manage bus routes across Sri Lanka';
      case 'buses': return 'Register and manage bus fleet operations';
      case 'trips': return 'Schedule and track bus trips';
      case 'docs': return 'Complete API reference for bus tracking system';
      case 'health': return 'Monitor API performance and system health';
      default: return '';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'routes':
        return <RoutesManagement />;
      case 'buses':
        return <BusFleetManagement />;
      case 'trips':
        return <TripsManagement />;
      case 'docs':
        return <APIDocumentation />;
      case 'health':
        return <HealthMonitor />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar activeTab={activeTab} onTabChange={(tab: string) => setActiveTab(tab as TabType)} />
      <div className="flex-1 overflow-hidden">
        <Header 
          title={getPageTitle(activeTab)} 
          subtitle={getPageSubtitle(activeTab)}
          onAddNew={() => {
            // Handle add new based on current tab
            console.log(`Add new for ${activeTab}`);
          }}
        />
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <AppContent />
    </TooltipProvider>
  );
}

export default App;
