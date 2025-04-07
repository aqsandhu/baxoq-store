import API from './api';

// Mock user data for demo purposes
const MOCK_ADMIN = {
  _id: 'admin123',
  name: 'Admin User',
  email: 'admin@baxoq.store',
  isAdmin: true
};

const MOCK_TOKEN = 'mock-jwt-token-for-development-only';

// Auth service functions
const login = async (email: string, password: string) => {
  try {
    // For development/demo purposes - mock admin login
    if (email === 'admin@baxoq.store' && password === 'admin123') {
      // Store mock data in localStorage
      localStorage.setItem('token', MOCK_TOKEN);
      localStorage.setItem('user', JSON.stringify(MOCK_ADMIN));
      
      return { 
        success: true, 
        token: MOCK_TOKEN,
        user: MOCK_ADMIN 
      };
    }
    
    // Regular API login
    const response = await API.post('/users/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

const register = async (userData: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    // For development/demo purposes - mock registration
    // Create a mock user based on the registration data
    const mockUser = {
      _id: 'user_' + Math.random().toString(36).substring(2, 11),
      name: userData.name,
      email: userData.email,
      isAdmin: false
    };
    
    // Store mock data in localStorage
    localStorage.setItem('token', MOCK_TOKEN);
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    return {
      success: true,
      token: MOCK_TOKEN,
      user: mockUser
    };
    
    // In a real app with backend, you would use this code:
    // const response = await API.post('/users/register', userData);
    // if (response.data.token) {
    //   localStorage.setItem('token', response.data.token);
    //   localStorage.setItem('user', JSON.stringify(response.data.user));
    // }
    // return response.data;
  } catch (error) {
    throw error;
  }
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

const updateProfile = async (userData: any) => {
  try {
    // For development/demo purposes - mock profile update
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('Not authenticated');
    }
    
    const updatedUser = {
      ...currentUser,
      ...userData
    };
    
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    return updatedUser;
    
    // In a real app with backend, you would use this code:
    // const response = await API.put('/users/profile', userData);
    // if (response.data) {
    //   localStorage.setItem('user', JSON.stringify(response.data));
    // }
    // return response.data;
  } catch (error) {
    throw error;
  }
};

// Check if the user is authenticated
const checkAuth = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No token found in localStorage');
      return false;
    }
    
    // For mock authentication in development
    if (token === MOCK_TOKEN) {
      console.log('Using mock authentication token');
      return true;
    }
    
    // For real API auth check:
    // const response = await API.get('/users/profile');
    // return !!response.data;
    
    return true;
  } catch (error) {
    console.error('Authentication check failed:', error);
    return false;
  }
};

const authService = {
  login,
  register,
  logout,
  getCurrentUser,
  updateProfile,
  checkAuth
};

export default authService;
