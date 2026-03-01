import type { User } from './user';
import type { Pagination } from './api';

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

export interface AdminResponse {
    success: boolean;
    metrics: AdminMetrics;
    users: User[];
    pagination: Pagination;
}
