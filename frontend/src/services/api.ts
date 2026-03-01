import apiClient from './apiClient';

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
 * Auth Service
 */
export const authApi = {
    login: (data: Record<string, string>) => apiClient.post<unknown, any>('/users/login', data),
    register: (data: Record<string, string>) => apiClient.post<unknown, any>('/users/register', data),
    getMe: () => apiClient.get<unknown, any>('/users/me'),
    getAdminMetrics: (page: number = 1, limit: number = 10) => apiClient.get<unknown, any>(`/users/admin-metrics?page=${page}&limit=${limit}`),
    logout: () => apiClient.get<unknown, any>('/users/logout'),
    updateUserStatus: (id: string, status: string) => apiClient.put<unknown, any>(`/users/${id}/status`, { status }),
};
