<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { Cloud, ChevronRight } from 'lucide-vue-next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import AppLayout from '@/layouts/AppLayout.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type Subscription = {
    uuid: string;
    status: string;
    current_period_ends_at: string | null;
    is_shared_with_me?: boolean;
    plan: { id: number; name: string; price: string; config: Record<string, number> };
    used_cpu: number;
    used_memory_mb: number;
    used_disk_mb: number;
    remaining_cpu: number;
    remaining_memory_mb: number;
    remaining_disk_mb: number;
};

type Props = {
    subscriptions: Subscription[];
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Gameserver Cloud', href: '/gaming/cloud' },
    { title: 'Meine Cloud-Abos', href: '#' },
];

function formatDate(d: string | null): string {
    return d ? new Date(d).toLocaleDateString('de-DE', { timeZone: 'UTC' }) : '–';
}
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Meine Gameserver-Cloud-Abos" />

        <div class="space-y-6">
            <div>
                <Heading level="h1">Meine Gameserver-Cloud-Abos</Heading>
                <Text class="mt-2" muted>
                    Verwalten Sie Ihre Cloud-Abos und legen Sie Game-Server aus dem Ressourcen-Pool an.
                </Text>
            </div>

            <div v-if="props.subscriptions.length === 0" class="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                <Cloud class="mx-auto h-12 w-12 opacity-50" />
                <p class="mt-2">Sie haben noch kein Cloud-Abo.</p>
                <Link href="/gaming/cloud">
                    <Button class="mt-4">Pläne ansehen</Button>
                </Link>
            </div>

            <div v-else class="grid gap-4 md:grid-cols-2">
                <Card
                    v-for="sub in props.subscriptions"
                    :key="sub.uuid"
                    class="flex flex-col"
                >
                    <CardHeader>
                        <CardTitle class="flex items-center justify-between gap-2">
                            <span class="flex items-center gap-2">
                                <Cloud class="h-5 w-5" />
                                {{ sub.plan.name }}
                                <Badge v-if="sub.is_shared_with_me" variant="secondary" size="sm">Geteilt</Badge>
                            </span>
                            <Badge :variant="sub.status === 'active' ? 'success' : 'secondary'">
                                {{ sub.status === 'active' ? 'Aktiv' : sub.status }}
                            </Badge>
                        </CardTitle>
                        <CardDescription>
                            Läuft bis {{ formatDate(sub.current_period_ends_at) }}
                        </CardDescription>
                    </CardHeader>
                    <CardContent class="flex-1 space-y-2 text-sm text-muted-foreground">
                        <p>Genutzt: {{ sub.used_cpu }} % CPU · {{ Math.round(sub.used_memory_mb / 1024) }} GB RAM · {{ Math.round(sub.used_disk_mb / 1024) }} GB Disk</p>
                        <p>Verfügbar: {{ sub.remaining_cpu }} % CPU · {{ Math.round(sub.remaining_memory_mb / 1024) }} GB RAM · {{ Math.round(sub.remaining_disk_mb / 1024) }} GB Disk</p>
                    </CardContent>
                    <CardContent class="pt-0">
                        <Link :href="`/gaming/cloud/subscriptions/${sub.uuid}`">
                            <Button variant="outline" class="w-full justify-between">
                                Abo verwalten
                                <ChevronRight class="h-4 w-4" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    </AppLayout>
</template>
