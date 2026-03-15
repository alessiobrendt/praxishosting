<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { Cloud } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import AppLayout from '@/layouts/AppLayout.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type GameserverCloudPlan = {
    id: number;
    name: string;
    price: string;
    config?: { max_cpu?: number; max_memory_mb?: number; max_disk_gb?: number };
};

type Props = {
    gameserverCloudPlans: GameserverCloudPlan[];
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Gameserver Cloud', href: '/gaming/cloud' },
];

function planSpec(plan: GameserverCloudPlan): string {
    const c = plan.config ?? {};
    const cpu = c.max_cpu ?? 0;
    const mem = c.max_memory_mb ?? 0;
    const disk = c.max_disk_gb ?? 0;
    const parts = [];
    if (cpu) parts.push(`${cpu} % CPU`);
    if (mem) parts.push(`${Math.round(mem / 1024)} GB RAM`);
    if (disk) parts.push(`${disk} GB Disk`);
    return parts.length ? parts.join(' · ') : 'Ressourcen-Pool';
}
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Gameserver Cloud" />

        <div class="space-y-8">
            <div>
                <Heading level="h1">Gameserver Cloud</Heading>
                <Text class="mt-2" muted>
                    Kaufen Sie einen Cloud-Plan und legen Sie beliebig viele Game-Server aus Ihrem Ressourcen-Pool an.
                </Text>
            </div>

            <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card
                    v-for="plan in props.gameserverCloudPlans"
                    :key="plan.id"
                    class="flex flex-col"
                >
                    <CardHeader>
                        <CardTitle class="flex items-center gap-2">
                            <Cloud class="h-5 w-5" />
                            {{ plan.name }}
                        </CardTitle>
                        <CardDescription>
                            {{ planSpec(plan) }}
                        </CardDescription>
                    </CardHeader>
                    <CardContent class="flex-1 space-y-4">
                        <ul class="space-y-2 text-sm text-muted-foreground">
                            <li>Ressourcen-Pool (CPU, RAM, Disk)</li>
                            <li>Beliebig viele Game-Server anlegen</li>
                            <li>Ressourcen frei aufteilen</li>
                        </ul>
                        <div class="text-2xl font-semibold">{{ plan.price }} € <span class="text-sm font-normal text-muted-foreground">/ Monat</span></div>
                    </CardContent>
                    <CardContent class="pt-0">
                        <Link :href="`/gaming/cloud/checkout/${plan.id}`">
                            <Button class="w-full">Jetzt buchen</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>

            <p v-if="props.gameserverCloudPlans.length === 0" class="text-muted-foreground">
                Derzeit sind keine Gameserver-Cloud-Pläne verfügbar.
            </p>
        </div>
    </AppLayout>
</template>
