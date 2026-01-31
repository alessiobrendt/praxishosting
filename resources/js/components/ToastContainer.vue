<script setup lang="ts">
import { useNotify } from '@/composables/useNotify';
import type { Toast, ToastType } from '@/composables/useNotify';
import { AnimatePresence, motion } from 'motion-v';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-vue-next';

const { toasts, removeToast } = useNotify();

const typeConfig: Record<
    ToastType,
    { icon: typeof CheckCircle2; bg: string; text: string; role: string }
> = {
    success: {
        icon: CheckCircle2,
        bg: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
        text: 'text-green-800 dark:text-green-300',
        role: 'status',
    },
    error: {
        icon: AlertCircle,
        bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
        text: 'text-red-800 dark:text-red-300',
        role: 'alert',
    },
    info: {
        icon: Info,
        bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
        text: 'text-blue-800 dark:text-blue-300',
        role: 'status',
    },
};

function configFor(toast: Toast) {
    return typeConfig[toast.type];
}
</script>

<template>
    <Teleport to="#toast-portal">
        <div
            class="pointer-events-none fixed bottom-4 right-4 z-[9999] flex max-w-[min(24rem,calc(100vw-2rem))] flex-col gap-2"
            aria-live="polite"
        >
            <AnimatePresence mode="sync" :initial="false">
                <motion.div
                    v-for="toast in toasts"
                    :key="toast.id"
                    class="pointer-events-auto flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-900"
                    :class="[configFor(toast).bg, configFor(toast).text]"
                    :role="configFor(toast).role"
                    :initial="{
                        opacity: 0,
                        x: 24,
                        scale: 0.96,
                    }"
                    :animate="{
                        opacity: 1,
                        x: 0,
                        scale: 1,
                        transition: {
                            type: 'spring',
                            stiffness: 400,
                            damping: 30,
                        },
                    }"
                    :exit="{
                        opacity: 0,
                        x: 24,
                        scale: 0.96,
                        transition: {
                            duration: 0.2,
                            ease: [0.4, 0, 1, 1],
                        },
                    }"
                >
                    <component
                        :is="configFor(toast).icon"
                        class="h-5 w-5 shrink-0"
                        aria-hidden
                    />
                    <p class="min-w-0 flex-1 text-sm">
                        {{ toast.message }}
                    </p>
                    <button
                        type="button"
                        class="shrink-0 rounded p-1 transition-modern hover:opacity-80"
                        aria-label="Schließen"
                        @click="removeToast(toast.id)"
                    >
                        <X class="h-4 w-4" />
                    </button>
                </motion.div>
            </AnimatePresence>
        </div>
    </Teleport>
</template>
