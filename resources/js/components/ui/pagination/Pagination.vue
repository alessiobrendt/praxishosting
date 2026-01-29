<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';

interface Link {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    links: Link[];
    class?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
    (e: 'navigate', url: string): void;
}>();

const handleClick = (url: string | null) => {
    if (url) {
        emit('navigate', url);
    }
};
</script>

<template>
    <nav :class="cn('flex items-center justify-center gap-1', props.class)" aria-label="Pagination">
        <button
            v-for="(link, index) in links"
            :key="index"
            @click="handleClick(link.url)"
            :disabled="!link.url"
            :class="cn(
                'flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium transition-modern',
                'disabled:pointer-events-none disabled:opacity-50',
                link.active
                    ? 'gradient-primary text-white shadow-emerald'
                    : 'bg-white text-gray-900 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700',
                !link.url && 'cursor-not-allowed opacity-50',
            )"
            v-html="link.label"
        />
    </nav>
</template>
