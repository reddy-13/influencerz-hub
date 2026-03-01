import apiClient from './apiClient';
import type { AdminResponse, AuthResponse, GenericResponse } from '../types';

/**
 * Videos Service
 */
export const videoApi = {
    getAll: () => apiClient.get<unknown, unknown[]>('/videos'),
    upload: (data: Record<string, unknown>) => apiClient.post<unknown, unknown>('/videos/upload', data),
};

/**
 * Sponsorships Service
 */
export const sponsorshipApi = {
    getAll: () => apiClient.get<unknown, unknown[]>('/sponsorships'),
    create: (data: Record<string, unknown>) => apiClient.post<unknown, unknown>('/sponsorships/create', data),
};

/**
 * Tasks Service (Kanban)
 */
export const taskApi = {
    getAll: () => apiClient.get<unknown, unknown[]>('/tasks'),
    create: (data: { content: string; status: string; tag?: string }) => apiClient.post<unknown, unknown>('/tasks', data),
    reorder: (tasks: { _id: string; status: string; order: number }[]) => apiClient.put<unknown, { message: string }>('/tasks/reorder', { tasks }),
    delete: (id: string) => apiClient.delete<unknown, { message: string }>(`/tasks/${id}`),
};

/**
 * Expenses Service
 */
export const expenseApi = {
    getAll: () => apiClient.get<unknown, unknown[]>('/expenses'),
    create: (data: Record<string, unknown>) => apiClient.post<unknown, unknown>('/expenses', data),
    delete: (id: string) => apiClient.delete<unknown, { message: string }>(`/expenses/${id}`),
};

/**
 * Auth Service
 */
export const authApi = {
    login: (data: Record<string, string>) => apiClient.post<unknown, AuthResponse>('/users/login', data),
    register: (data: Record<string, string>) => apiClient.post<unknown, AuthResponse>('/users/register', data),
    getMe: () => apiClient.get<unknown, { success: boolean, data: import('../types').User }>('/users/me'),
    getAdminMetrics: (page: number = 1, limit: number = 10) => apiClient.get<unknown, AdminResponse>(`/users/admin-metrics?page=${page}&limit=${limit}`),
    logout: () => apiClient.get<unknown, GenericResponse>('/users/logout'),
    updateUserStatus: (id: string, status: string) => apiClient.put<unknown, GenericResponse>(`/users/${id}/status`, { status }),
};
