<script setup lang="ts">
import { Head, Link, usePage } from '@inertiajs/vue3';
import { Search, Globe, ChevronRight, Calendar } from 'lucide-vue-next';
import { watch } from 'vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { notify } from '@/composables/useNotify';
import AppLayout from '@/layouts/AppLayout.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type Domain = {
    uuid: string;
    domain: string;
    status: string;
    expires_at: string | null;
    auto_renew: boolean;
    is_shared_with_me?: boolean;
};

type Props = {
    domains: Domain[];
};

const props = defineProps<Props>();

const page = usePage();
watch(
    () => (page.props.flash as { error?: string; success?: string })?.error,
    (message) => {
        if (message) notify.error(message);
    },
    { immediate: true },
);
watch(
    () => (page.props.flash as { error?: string; success?: string })?.success,
    (message) => {
        if (message) notify.success(message);
    },
    { immediate: true },
);

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Meine Domains', href: '/domains' },
];

function statusVariant(status: string): 'success' | 'default' | 'error' {
    const s = status?.toLowerCase() ?? '';
    if (s === 'active' || s === 'aktiv') return 'success';
    if (s === 'expired' || s === 'abgelaufen' || s === 'cancelled') return 'error';
    return 'default';
}

function displayStatus(status: string): string {
    const s = status?.toLowerCase() ?? '';
    if (s === 'active' || s === 'aktiv') return 'Aktiv';
    if (s === 'expired' || s === 'abgelaufen') return 'Abgelaufen';
    if (s === 'cancelled') return 'Gekündigt';
    if (s === 'pending') return 'Ausstehend';
    return status || '–';
}
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Meine Domains" />

        <div class="space-y-6">
            <div class="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <Heading level="h1">Meine Domains</Heading>
                    <Text class="mt-2" muted>
                        Ihre über uns registrierten Domains – Status und Ablaufdatum
                    </Text>
                </div>
                <Link href="/domains/search">
                    <Button>
                        <Search class="mr-2 h-4 w-4" />
                        Domain suchen
                    </Button>
                </Link>
            </div>

            <div
                v-if="props.domains.length === 0"
                class="rounded-xl border border-dashed border-muted-foreground/25 bg-muted/30 p-12 text-center"
            >
                <Globe class="mx-auto h-12 w-12 text-muted-foreground/50" />
                <Heading level="h2" class="mt-4 text-lg font-semibold">Noch keine Domains</Heading>
                <Text class="mt-2" muted>
                    Sie haben noch keine Domains. Suchen Sie eine Domain und bestellen Sie sie.
                </Text>
                <Link href="/domains/search">
                    <Button class="mt-4">Domain suchen</Button>
                </Link>
            </div>

            <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Link
                    v-for="d in props.domains"
                    :key="d.uuid"
                    :href="`/domains/${d.uuid}`"
                    class="group block"
                >
                    <Card class="h-full transition-colors hover:border-primary/40 hover:bg-muted/30">
                        <CardHeader class="pb-2">
                            <div class="flex items-start justify-between gap-2">
                                <div class="flex min-w-0 items-center gap-3">
                                    <div
                                        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
                                    >
                                        <Globe class="h-5 w-5" />
                                    </div>
                                    <div class="min-w-0">
                                        <div class="flex items-center gap-2">
                                            <CardTitle class="truncate font-mono text-base">{{ d.domain }}</CardTitle>
                                            <Badge v-if="d.is_shared_with_me" variant="secondary" size="sm">Geteilt</Badge>
                                        </div>
                                        <div class="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                                            <span>{{ d.auto_renew ? 'Auto-Verlängerung: Ja' : 'Auto-Verlängerung: Nein' }}</span>
                                        </div>
                                    </div>
                                </div>
                                <ChevronRight
                                    class="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                                />
                            </div>
                        </CardHeader>
                        <CardContent class="space-y-3 pt-0">
                            <div class="flex items-center justify-between gap-2">
                                <span class="text-sm text-muted-foreground">Status</span>
                                <Badge :variant="statusVariant(d.status)" size="sm" class="shrink-0">
                                    <span
                                        class="mr-1.5 inline-block h-1.5 w-1.5 rounded-full"
                                        :class="{
                                            'bg-green-500': statusVariant(d.status) === 'success',
                                            'bg-red-500': statusVariant(d.status) === 'error',
                                            'bg-muted-foreground': statusVariant(d.status) === 'default',
                                        }"
                                    />
                                    {{ displayStatus(d.status) }}
                                </Badge>
                            </div>
                            <div class="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar class="h-3.5 w-3.5 shrink-0" />
                                <span>Ablauf: {{ d.expires_at ?? '–' }}</span>
                            </div>
                            <div class="flex justify-end pt-1">
                                <Button variant="ghost" size="sm" class="text-primary" as="span">
                                    Domain verwalten
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    </AppLayout>
</template>
