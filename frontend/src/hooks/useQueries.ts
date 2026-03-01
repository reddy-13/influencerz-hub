import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { videoApi, sponsorshipApi, taskApi, expenseApi } from '../services/api';

export interface VideoData {
    _id: string;
    title: string;
    description: string;
    url: string;
    user?: { name: string; email: string };
    createdAt: string;
}

export interface SponsorshipData {
    _id: string;
    brand: string;
    amount: number;
    user?: { name: string; email: string };
    createdAt: string;
}

export interface TaskData {
    _id: string;
    content: string;
    status: 'ideas' | 'scripting' | 'filming' | 'editing' | 'published';
    tag: string;
    order: number;
    createdAt: string;
}

export interface ExpenseData {
    _id: string;
    category: string;
    amount: number;
    description: string;
    date: string;
}

// --- Video Hooks ---
export const useVideos = () => {
    return useQuery<VideoData[]>({
        queryKey: ['videos'],
        queryFn: videoApi.getAll as () => Promise<VideoData[]>,
    });
};

export const useUploadVideo = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: videoApi.upload,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['videos'] });
        },
    });
};

// --- Sponsorship Hooks ---
export const useSponsorships = () => {
    return useQuery<SponsorshipData[]>({
        queryKey: ['sponsorships'],
        queryFn: sponsorshipApi.getAll as () => Promise<SponsorshipData[]>,
    });
};

export const useCreateSponsorship = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: sponsorshipApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sponsorships'] });
        },
    });
};

// --- Task (Kanban) Hooks ---
export const useTasks = () => {
    return useQuery<TaskData[]>({
        queryKey: ['tasks'],
        queryFn: taskApi.getAll as () => Promise<TaskData[]>,
    });
};

export const useCreateTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: taskApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });
};

export const useReorderTasks = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: taskApi.reorder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });
};

export const useDeleteTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: taskApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });
};

// --- Expense Hooks ---
export const useExpenses = () => {
    return useQuery<ExpenseData[]>({
        queryKey: ['expenses'],
        queryFn: expenseApi.getAll as () => Promise<ExpenseData[]>,
    });
};

export const useCreateExpense = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: expenseApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses'] });
        },
    });
};
