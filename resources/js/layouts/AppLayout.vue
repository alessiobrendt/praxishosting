<template>
    <DefaultLayout>
        <div v-if="breadcrumbs.length" class="page-title-head d-flex align-items-center mb-3">
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb mb-0 py-0">
                    <li
                        v-for="(item, index) in breadcrumbs"
                        :key="index"
                        class="breadcrumb-item d-flex align-items-center"
                        :class="{ active: index === breadcrumbs.length - 1 }"
                    >
                        <Link v-if="index < breadcrumbs.length - 1 && item.href" :href="item.href">
                            {{ item.title }}
                        </Link>
                        <span v-else>{{ item.title }}</span>
                    </li>
                </ol>
            </nav>
        </div>

        <slot />
    </DefaultLayout>
</template>

<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import type { BreadcrumbItem } from '@/types';

interface Props {
    breadcrumbs?: BreadcrumbItem[];
}

withDefaults(defineProps<Props>(), {
    breadcrumbs: () => [],
});
</script>
