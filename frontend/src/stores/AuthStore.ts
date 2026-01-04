import { makeAutoObservable } from 'mobx';
import { apiClient } from '../services/api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'TEACHER' | 'ADMIN' | 'COUNSELOR';
}

export class AuthStore {
  user: User | null = null;
  token: string | null = null;
  loading: boolean = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        this.token = token;
        this.user = JSON.parse(userStr);
      } catch (e) {
        this.logout();
      }
    }
  }

  async login(email: string, password: string) {
    this.loading = true;
    this.error = null;

    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { accessToken, user } = response.data;

      this.token = accessToken;
      this.user = user;

      localStorage.setItem('auth_token', accessToken);
      localStorage.setItem('user', JSON.stringify(user));

      return true;
    } catch (error: any) {
      this.error = error.response?.data?.message || 'Login failed';
      return false;
    } finally {
      this.loading = false;
    }
  }

  logout() {
    this.user = null;
    this.token = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }

  get isAuthenticated(): boolean {
    return !!this.token && !!this.user;
  }

  get isTeacher(): boolean {
    return this.user?.role === 'TEACHER';
  }

  get isAdmin(): boolean {
    return this.user?.role === 'ADMIN';
  }

  get isCounselor(): boolean {
    return this.user?.role === 'COUNSELOR';
  }
}

