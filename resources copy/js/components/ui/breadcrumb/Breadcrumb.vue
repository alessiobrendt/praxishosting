<script setup lang="ts">
import { computed } from 'vue';
import { Link } from '@inertiajs/vue3';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-vue-next';
import type { BreadcrumbItem } from '@/types';

interface Props {
    items: BreadcrumbItem[];
    class?: string;
}

const props = defineProps<Props>();

const breadcrumbClasses = computed(() =>
    cn('flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400', props.class),
);
</script>

<template>
    <nav :class="breadcrumbClasses" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-1">
            <li
                v-for="(item, index) in items"
                :key="index"
                class="flex items-center"
            >
                <Link
                    v-if="item.href && index < items.length - 1"
                    :href="item.href"
                    class="transition-modern hover:text-gray-900 dark:hover:text-gray-100"
                >
                    {{ item.title }}
                </Link>
                <span
                    v-else
                    :class="index === items.length - 1 ? 'font-medium text-gray-900 dark:text-gray-100' : ''"
                >
                    {{ item.title }}
                </span>
                <ChevronRight
                    v-if="index < items.length - 1"
                    class="mx-1 h-4 w-4 text-gray-400"
                />
            </li>
        </ol>
    </nav>
</template>

