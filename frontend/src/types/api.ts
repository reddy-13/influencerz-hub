import type { AuthUser } from './user';

export interface Pagination {
    page: number;
    limit: number;
    totalPages: number;
    totalCount: number;
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
