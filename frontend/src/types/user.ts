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
