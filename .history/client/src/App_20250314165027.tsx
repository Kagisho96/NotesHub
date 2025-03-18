import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

// Placeholder components - will be replaced with actual components
const Dashboard = () => <div className="p-4">Dashboard</div>;
const Notes = () => <div className="p-4">Notes</div>;
const Tasks = () => <div className="p-4">Tasks</div>;
const Lectures = () => <div className="p-4">Lecture Recordings</div>;
const Login = () => <div className="p-4">Login</div>;
const Register = () => <div className="p-4">Register</div>;

// Layout component with navigation
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-primary-700 text-white">
        <div className="p-4">
          <h1 className="text-xl font-bold">NotesHub</h1>
        </div>
        <nav className="mt-6">
          <ul>
            <li className="px-4 py-2 hover:bg-primary-600">
              <a href="/dashboard">Dashboard</a>
            </li>
            <li className="px-4 py-2 hover:bg-primary-600">
              <a href="/notes">Notes</a>
            </li>
            <li className="px-4 py-2 hover:bg-primary-600">
              <a href="/tasks">Tasks</a>
            </li>
            <li className="px-4 py-2 hover:bg-primary-600">
              <a href="/lectures">Lecture Recordings</a>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Main content */}
      <div className="flex-1 bg-gray-100">
        <header className="bg-white shadow-sm">
          <div className="mx-auto px-4 py-3 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Student Portal</h2>
            <button className="btn btn-outline">Sign Out</button>
          </div>
        </header>
        <main className="p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Placeholder for authentication logic
  const isAuthenticated = true; // Will be replaced with actual auth check

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
};

function App() {
  // This will be replaced with proper auth state management
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking authentication status
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
      <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
      <Route path="/lectures" element={<ProtectedRoute><Lectures /></ProtectedRoute>} />
      
      {/* Redirect to dashboard by default */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
