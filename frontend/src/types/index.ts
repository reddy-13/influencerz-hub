export interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
}

export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
    status: 'active' | 'suspended';
    createdAt: string;
    updatedAt: string;
}

export interface AdminMetrics {
    totalUsers: number;
    activeUsers: number;
    suspendedUsers: number;
    totalVideos: number;
    totalSponsorships: number;
    totalTasks: number;
    totalRevenue: number;
    monthlyRevenue: number;
}

export interface Pagination {
    page: number;
    limit: number;
    totalPages: number;
    totalCount: number;
}

export interface AdminResponse {
    success: boolean;
    metrics: AdminMetrics;
    users: User[];
    pagination: Pagination;
}

export interface AuthResponse {
    success: boolean;
    user: AuthUser;
}

export interface GenericResponse {
    success: boolean;
    message?: string;
    data?: unknown;
}
