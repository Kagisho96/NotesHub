import useAuthStore from "../../store/authStore";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDarkMode } from "../../contexts/DarkModeContext";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { darkMode, toggleDarkMode } = useDarkMode();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={`min-h-screen flex ${darkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      {/* Sidebar with enhanced shadow */}
      <aside className={`w-64 ${darkMode ? 'bg-gray-800 text-white' : 'bg-primary-700 text-white'} shadow-2xl fixed h-full z-30 border-r ${darkMode ? 'border-gray-700' : 'border-primary-800'}`}>
        <div className="p-4 border-b border-opacity-20 border-white">
          <h1 className="text-xl font-bold text-white">NotesHub</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-primary-100'} mt-1`}>Student Portal</p>
        </div>
        
        <nav className="mt-8">
          <ul className="space-y-1">
            <li>
              <Link
                to="/dashboard"
                className={`block px-4 py-2 w-full text-left transition ${
                  location.pathname === '/dashboard'
                    ? darkMode ? 'bg-gray-700 font-medium text-white' : 'bg-primary-600 font-medium text-white'
                    : darkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-primary-600 text-white'
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
                    ? darkMode ? 'bg-gray-700 font-medium text-white' : 'bg-primary-600 font-medium text-white'
                    : darkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-primary-600 text-white'
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
                    ? darkMode ? 'bg-gray-700 font-medium text-white' : 'bg-primary-600 font-medium text-white'
                    : darkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-primary-600 text-white'
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
                    ? darkMode ? 'bg-gray-700 font-medium text-white' : 'bg-primary-600 font-medium text-white'
                    : darkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-primary-600 text-white'
                }`}
              >
                Lecture Recordings
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="absolute bottom-0 w-64 p-4 border-t border-opacity-20 border-white">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-full ${darkMode ? 'bg-gray-600 text-white' : 'bg-primary-300 text-primary-800'} flex items-center justify-center font-semibold shadow-md`}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="text-sm">
              <p className="font-medium text-white">{user?.name || 'User'}</p>
              <p className={`${darkMode ? 'text-gray-400' : 'text-primary-200'} text-xs`}>{user?.email || 'user@example.com'}</p>
            </div>
          </div>
         
          <button
            onClick={handleLogout}
            className={`w-full text-center py-2 rounded-md transition text-white shadow-md ${
              darkMode
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-primary-600 hover:bg-primary-500'
            }`}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content with padding for sidebar */}
      <main className={`flex-1 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} ml-64`}>
        <header className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} shadow-lg h-16 flex items-center px-6 sticky top-0 z-20`}>
          <div className="flex justify-between items-center w-full">
            <h2 className="text-lg font-semibold text-high-contrast">
              {location.pathname === '/dashboard' && 'Dashboard'}
              {location.pathname.startsWith('/notes') && 'Notes'}
              {location.pathname.startsWith('/tasks') && 'Tasks'}
              {location.pathname.startsWith('/lectures') && 'Lecture Recordings'}
            </h2>
            
            <div className="flex items-center gap-4">
              {/* Dark mode toggle button */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-md shadow-sm ${darkMode ? 'text-yellow-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-200'}`}
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                  </svg>
                )}
              </button>
              
              <button
                className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'} font-medium shadow-sm px-3 py-1 rounded border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
              >
                Help
              </button>
            </div>
          </div>
        </header>
        
        <div className={`p-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout; 