import { Link, useLocation } from "react-router-dom";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-primary-700 text-white shadow-lg z-10">
        <div className="p-4">
          <h1 className="text-xl font-bold">NotesHub</h1>
          <p className="text-sm text-primary-100 mt-1">Student Portal</p>
        </div>
        
        <nav className="mt-8">
          <ul className="space-y-1">
            <li>
              <Link
                to="/dashboard"
                className={`block px-4 py-2 w-full text-left transition ${
                  location.pathname === '/dashboard'
                    ? 'bg-primary-600 font-medium'
                    : 'hover:bg-primary-600'
                }`}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/notes"
                className={`block px-4 py-2 w-full text-left transition ${
                  location.pathname.startsWith('/notes')
                    ? 'bg-primary-600 font-medium'
                    : 'hover:bg-primary-600'
                }`}
              >
                Notes
              </Link>
            </li>
            <li>
              <Link
                to="/tasks"
                className={`block px-4 py-2 w-full text-left transition ${
                  location.pathname.startsWith('/tasks')
                    ? 'bg-primary-600 font-medium'
                    : 'hover:bg-primary-600'
                }`}
              >
                Tasks
              </Link>
            </li>
            <li>
              <Link
                to="/lectures"
                className={`block px-4 py-2 w-full text-left transition ${
                  location.pathname.startsWith('/lectures')
                    ? 'bg-primary-600 font-medium'
                    : 'hover:bg-primary-600'
                }`}
              >
                Lecture Recordings
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="absolute bottom-0 w-64 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary-300 flex items-center justify-center text-primary-800 font-semibold">
              T
            </div>
            <div className="text-sm">
              <p className="font-medium">Test User</p>
              <p className="text-primary-200 text-xs">test@example.com</p>
            </div>
          </div>
         
          <button
            className="w-full text-center py-2 rounded-md bg-primary-600 hover:bg-primary-500 transition"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50">
        <header className="bg-white shadow-sm h-16 flex items-center px-6 sticky top-0 z-10">
          <div className="flex justify-between items-center w-full">
            <h2 className="text-lg font-semibold">
              {location.pathname === '/dashboard' && 'Dashboard'}
              {location.pathname.startsWith('/notes') && 'Notes'}
              {location.pathname.startsWith('/tasks') && 'Tasks'}
              {location.pathname.startsWith('/lectures') && 'Lecture Recordings'}
            </h2>
            
            <div className="flex items-center gap-4">
              <button
                className="text-gray-500 hover:text-gray-700"
              >
                Help
              </button>
            </div>
          </div>
        </header>
        
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout; 