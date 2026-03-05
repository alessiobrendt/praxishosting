<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { onMounted } from 'vue';
import LoadingAnimation from '@/components/LoadingAnimation.vue';
import { Text } from '@/components/ui/typography';
import AppLayout from '@/layouts/AppLayout.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type Props = {
    redirectUrl: string;
};

const props = defineProps<Props>();

onMounted(() => {
    if (props.redirectUrl && props.redirectUrl.startsWith('https://')) {
        window.location.href = props.redirectUrl;
    }
});

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Weiterleitung', href: '#' },
];
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Weiterleitung zur Zahlung" />

        <div class="flex min-h-[40vh] flex-col items-center justify-center gap-4">
            <LoadingAnimation :size="200" />
            <Text>Weiterleitung zur Zahlung…</Text>
        </div>
    </AppLayout>
</template>
