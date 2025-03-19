import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./pages/Dashboard";
import DevLoginPage from "./pages/DevLoginPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import RegisterPage from "./pages/RegisterPage";
import useAuthStore from "./store/authStore";
import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

// Auth components

// Store

// Placeholder components for now
const Notes = () => <div>Notes Page</div>;
const Tasks = () => <div>Tasks Page</div>;
const Lectures = () => <div>Lectures Page</div>;

function App() {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
      setAppLoading(false);
    };
    
    initAuth();
  }, [checkAuth]);

  if (appLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" />} />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
        <Route path="/lectures" element={<ProtectedRoute><Lectures /></ProtectedRoute>} />
        
        {/* Dev login route */}
        <Route path="/dev-login" element={<DevLoginPage />} />
        
        {/* Default route */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </>
  );
}

export default App;
