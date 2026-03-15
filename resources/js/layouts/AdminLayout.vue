<template>
    <DefaultLayout>
        <div
            v-if="impersonating"
            class="d-flex flex-wrap align-items-center justify-content-center gap-2 bg-warning bg-opacity-25 px-4 py-2 text-dark small"
        >
            <span>Sie sind angemeldet als {{ userName }}.</span>
            <a href="/impersonate/leave" class="btn btn-warning btn-sm">Impersonation beenden</a>
        </div>

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
import { Link, usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import type { BreadcrumbItem } from '@/types';

interface Props {
    breadcrumbs?: BreadcrumbItem[];
}

withDefaults(defineProps<Props>(), {
    breadcrumbs: () => [],
});

const page = usePage();
const impersonating = computed(
    () => (page.props.auth as { impersonating?: boolean })?.impersonating ?? false,
);
const userName = computed(
    () => (page.props.auth?.user as { name?: string })?.name ?? 'Kunde',
);
</script>
