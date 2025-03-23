import api from "./api";
import { jwtDecode } from "jwt-decode";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthResponse {
  token: string;
  user: User;
  message: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData extends LoginCredentials {
  name: string;
}

const authService = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    try {
      console.log('Login attempt with credentials:', credentials);
      console.log('API base URL:', api.defaults.baseURL);
      
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      console.log('Login response:', response.data);
      
      const { token, user } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      return user;
    } catch (error) {
      console.error('Login error details:', error);
      throw error;
    }
  },
  
  register: async (userData: RegisterData): Promise<User> => {
    try {
      console.log('Register attempt with data:', userData);
      console.log('API base URL:', api.defaults.baseURL);
      
      const response = await api.post<AuthResponse>('/auth/register', userData);
      console.log('Register response:', response.data);
      
      const { token, user } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      return user;
    } catch (error) {
      console.error('Register error details:', error);
      throw error;
    }
  },
  
  logout: (): void => {
    localStorage.removeItem('token');
  },
  
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const response = await api.get<{ user: User }>('/auth/me');
      return response.data.user;
    } catch (error) {
      return null;
    }
  },
  
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      // Check if token is expired
      const decoded = jwtDecode<{ exp: number }>(token);
      const currentTime = Date.now() / 1000;
      
      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  }
};

export default authService; 