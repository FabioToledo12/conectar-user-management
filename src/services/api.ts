import axios from 'axios';
import { AuthResponse, LoginCredentials, RegisterData, User, UpdateProfileData } from '../types';

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para lidar com erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (credentials: LoginCredentials): Promise<AuthResponse> =>
    api.post('/auth/login', credentials).then((res) => res.data),

  register: (data: RegisterData): Promise<AuthResponse> =>
    api.post('/auth/register', data).then((res) => res.data),
};

export const usersApi = {
  getProfile: (): Promise<User> =>
    api.get('/users/profile').then((res) => res.data),

  updateProfile: (data: UpdateProfileData): Promise<User> =>
    api.patch('/users/profile', data).then((res) => res.data),

  getAllUsers: (params?: { role?: string; sortBy?: string; order?: string }): Promise<User[]> =>
    api.get('/users', { params }).then((res) => res.data),

  getInactiveUsers: (): Promise<User[]> =>
    api.get('/users/inactive').then((res) => res.data),

  deleteUser: (id: string): Promise<void> =>
    api.delete(`/users/${id}`).then((res) => res.data),

  updateUser: (id: string, data: Partial<User>): Promise<User> =>
    api.patch(`/users/${id}`, data).then((res) => res.data),
};

export default api;