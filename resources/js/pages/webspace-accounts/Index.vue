<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Server, ChevronRight, Calendar, Package } from 'lucide-vue-next';

type HostingPlan = { id: number; name: string };

type WebspaceAccount = {
    id: number;
    domain: string;
    status: string;
    current_period_ends_at: string | null;
    hosting_plan: HostingPlan;
};

type Props = {
    webspaceAccounts: WebspaceAccount[];
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Meine Webspace-Accounts', href: '/webspace-accounts' },
];

const formatDate = (d: string | null) => (d ? new Date(d).toLocaleDateString('de-DE') : '–');

function statusVariant(status: string): 'success' | 'default' | 'error' {
    const s = status?.toLowerCase() ?? '';
    if (s === 'active' || s === 'aktiv') return 'success';
    if (s === 'suspended' || s === 'gesperrt' || s === 'cancelled') return 'error';
    return 'default';
}

function displayStatus(status: string): string {
    const s = status?.toLowerCase() ?? '';
    if (s === 'active' || s === 'aktiv') return 'Aktiv';
    if (s === 'pending' || s === 'ausstehend') return 'Ausstehend';
    if (s === 'suspended' || s === 'gesperrt') return 'Gesperrt';
    if (s === 'cancelled') return 'Gekündigt';
    return status || '–';
}
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Meine Webspace-Accounts" />

        <div class="space-y-6">
            <div class="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <Heading level="h1">Meine Webspace-Accounts</Heading>
                    <Text class="mt-2" muted>
                        Ihre Plesk-Webspace-Accounts – Status, Paket und Verlängerung
                    </Text>
                </div>
                <Link href="/webspace">
                    <Button>
                        <Server class="mr-2 h-4 w-4" />
                        Webspace buchen
                    </Button>
                </Link>
            </div>

            <div
                v-if="props.webspaceAccounts.length === 0"
                class="rounded-xl border border-dashed border-muted-foreground/25 bg-muted/30 p-12 text-center"
            >
                <Server class="mx-auto h-12 w-12 text-muted-foreground/50" />
                <Heading level="h2" class="mt-4 text-lg font-semibold">Noch keine Webspace-Accounts</Heading>
                <Text class="mt-2" muted>
                    Sie haben noch keine Webspace-Accounts. Buchen Sie Ihren ersten Webspace.
                </Text>
                <Link href="/webspace">
                    <Button class="mt-4">Webspace buchen</Button>
                </Link>
            </div>

            <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Link
                    v-for="acc in props.webspaceAccounts"
                    :key="acc.id"
                    :href="`/webspace-accounts/${acc.id}`"
                    class="group block"
                >
                    <Card class="h-full transition-colors hover:border-primary/40 hover:bg-muted/30">
                        <CardHeader class="pb-2">
                            <div class="flex items-start justify-between gap-2">
                                <div class="flex min-w-0 items-center gap-3">
                                    <div
                                        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
                                    >
                                        <Server class="h-5 w-5" />
                                    </div>
                                    <div class="min-w-0">
                                        <CardTitle class="truncate font-mono text-base">{{ acc.domain }}</CardTitle>
                                        <div class="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                                            <Package class="h-3.5 w-3.5 shrink-0" />
                                            <span class="truncate">{{ acc.hosting_plan.name }}</span>
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
                                <Badge :variant="statusVariant(acc.status)" size="sm" class="shrink-0">
                                    <span
                                        class="mr-1.5 inline-block h-1.5 w-1.5 rounded-full"
                                        :class="{
                                            'bg-green-500': statusVariant(acc.status) === 'success',
                                            'bg-red-500': statusVariant(acc.status) === 'error',
                                            'bg-muted-foreground': statusVariant(acc.status) === 'default',
                                        }"
                                    />
                                    {{ displayStatus(acc.status) }}
                                </Badge>
                            </div>
                            <div class="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar class="h-3.5 w-3.5 shrink-0" />
                                <span>Verlängerung: {{ formatDate(acc.current_period_ends_at) }}</span>
                            </div>
                            <div class="flex justify-end pt-1">
                                <Button variant="ghost" size="sm" class="text-primary" as="span">
                                    Account öffnen
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    </AppLayout>
</template>
