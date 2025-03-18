import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import RegisterPage from "./pages/RegisterPage";
import useAuthStore from "./store/authStore";
import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { toast } from "react-toastify";

// Auth components

// Placeholder pages - will be replaced with actual components
const Dashboard = () => <div className="p-4">Dashboard</div>;
const Notes = () => <div className="p-4">Notes</div>;
const Tasks = () => <div className="p-4">Tasks</div>;
const Lectures = () => <div className="p-4">Lecture Recordings</div>;

// Auth store

function App() {
  const { checkAuth, isLoading } = useAuthStore();

  useEffect(() => {
    // When the app loads, check if the user is already authenticated
    checkAuth().catch((error) => {
      console.error('Error checking authentication:', error);
      toast.error('Authentication error. Please log in again.');
    });
  }, [checkAuth]);

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
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Protected routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/notes" 
        element={
          <ProtectedRoute>
            <Notes />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/tasks" 
        element={
          <ProtectedRoute>
            <Tasks />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/lectures" 
        element={
          <ProtectedRoute>
            <Lectures />
          </ProtectedRoute>
        } 
      />
      
      {/* Default route redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
