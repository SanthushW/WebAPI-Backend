interface HeaderProps {
  title: string;
  subtitle: string;
  onAddNew?: () => void;
}

export default function Header({ title, subtitle, onAddNew }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-600">{subtitle}</p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Health Status Indicator */}
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">API Healthy</span>
          </div>

          {/* Notification Bell */}
          <button className="relative p-2 text-gray-400 hover:text-gray-600" data-testid="button-notifications">
            <span className="material-icons text-xl">notifications</span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-error-500 rounded-full"></span>
          </button>

          {/* Add New Button */}
          {onAddNew && (
            <button
              onClick={onAddNew}
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center space-x-2"
              data-testid="button-add-new"
            >
              <span className="material-icons text-sm">add</span>
              <span>Add New</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
