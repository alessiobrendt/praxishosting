import { ref } from 'vue';

export type ToastType = 'success' | 'error' | 'info';

export type Toast = {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
};

const DEFAULT_DURATION = 4000;

const toasts = ref<Toast[]>([]);

const timers = new Map<string, ReturnType<typeof setTimeout>>();

function removeToast(id: string): void {
    const t = timers.get(id);
    if (t) {
        clearTimeout(t);
        timers.delete(id);
    }
    toasts.value = toasts.value.filter((toast) => toast.id !== id);
}

function addToast(
    type: ToastType,
    message: string,
    duration: number = DEFAULT_DURATION,
): void {
    const id =
        typeof crypto !== 'undefined' && crypto.randomUUID
            ? crypto.randomUUID()
            : `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const toast: Toast = { id, type, message, duration };
    toasts.value = [...toasts.value, toast];

    if (duration > 0) {
        const timer = setTimeout(() => {
            removeToast(id);
        }, duration);
        timers.set(id, timer);
    }
}

export function useNotify(): {
    toasts: typeof toasts;
    removeToast: (id: string) => void;
} {
    return { toasts, removeToast };
}

export const notify = {
    success: (message: string, duration?: number): void => {
        addToast('success', message, duration ?? DEFAULT_DURATION);
    },
    error: (message: string, duration?: number): void => {
        addToast('error', message, duration ?? DEFAULT_DURATION);
    },
    info: (message: string, duration?: number): void => {
        addToast('info', message, duration ?? DEFAULT_DURATION);
    },
};
