<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-vue-next';

type AlertVariant = 'info' | 'success' | 'warning' | 'error' | 'destructive';

interface Props {
    variant?: AlertVariant;
    class?: string;
    dismissible?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    variant: 'info',
    dismissible: false,
});

const emit = defineEmits<{
    (e: 'dismiss'): void;
}>();

const variantConfig: Record<Exclude<AlertVariant, 'destructive'>, { bg: string; border: string; text: string; icon: any }> = {
    info: {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-200 dark:border-blue-800',
        text: 'text-blue-800 dark:text-blue-300',
        icon: Info,
    },
    success: {
        bg: 'bg-green-50 dark:bg-green-900/20',
        border: 'border-green-200 dark:border-green-800',
        text: 'text-green-800 dark:text-green-300',
        icon: CheckCircle2,
    },
    warning: {
        bg: 'bg-yellow-50 dark:bg-yellow-900/20',
        border: 'border-yellow-200 dark:border-yellow-800',
        text: 'text-yellow-800 dark:text-yellow-300',
        icon: AlertTriangle,
    },
    error: {
        bg: 'bg-red-50 dark:bg-red-900/20',
        border: 'border-red-200 dark:border-red-800',
        text: 'text-red-800 dark:text-red-300',
        icon: AlertCircle,
    },
};

const config = computed(() => variantConfig[props.variant === 'destructive' ? 'error' : props.variant]);
const Icon = computed(() => config.value.icon);

const alertClasses = computed(() =>
    cn(
        'relative rounded-lg border p-4',
        config.value.bg,
        config.value.border,
        props.class,
    ),
);
</script>

<template>
    <div :class="alertClasses" role="alert">
        <div class="flex items-start gap-3">
            <Icon :class="cn('h-5 w-5 shrink-0', config.text)" />
            <div class="flex-1">
                <slot />
            </div>
            <button
                v-if="dismissible"
                @click="emit('dismiss')"
                :class="cn('shrink-0 rounded-md p-1 transition-modern hover:bg-black/5', config.text)"
            >
                <X class="h-4 w-4" />
            </button>
        </div>
    </div>
</template>
