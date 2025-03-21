import api from "../services/api";
import useAuthStore from "../store/authStore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const DevLoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { clearError } = useAuthStore();
  
  const handleDevLogin = async () => {
    try {
      setIsLoading(true);
      clearError();
      
      const response = await api.post('/auth/dev-login');
      
      // Manually set token and user
      localStorage.setItem('token', response.data.token);
      // Set auth state properly by reloading the page
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Dev login error:', error);
      alert('Development login failed');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Development Login</h2>
        <p className="mb-4 text-gray-600">
          This is a special login for development and testing purposes only.
        </p>
        
        <button
          onClick={handleDevLogin}
          disabled={isLoading}
          className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
        >
          {isLoading ? 'Loading...' : 'Login as Test User'}
        </button>
      </div>
    </div>
  );
};

export default DevLoginPage; 