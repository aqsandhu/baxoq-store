import api from './api';

export interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

const getAllUsers = async (): Promise<User[]> => {
  const response = await api.get('/api/users');
  return response.data;
};

const getUserById = async (id: string): Promise<User> => {
  const response = await api.get(`/api/users/${id}`);
  return response.data;
};

const deleteUser = async (id: string): Promise<{ message: string }> => {
  const response = await api.delete(`/api/users/${id}`);
  return response.data;
};

const updateUserRole = async (id: string, isAdmin: boolean): Promise<User> => {
  const response = await api.put(`/api/users/${id}`, { isAdmin });
  return response.data;
};

const userService = {
  getAllUsers,
  getUserById,
  deleteUser,
  updateUserRole,
};

export default userService; 