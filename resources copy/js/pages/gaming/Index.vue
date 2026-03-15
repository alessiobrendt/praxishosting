<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { Gamepad2 } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import AppLayout from '@/layouts/AppLayout.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type HostingPlan = {
    id: number;
    name: string;
    price: string;
    config?: { memory?: number; disk?: number; cpu?: number };
};

type Props = {
    hostingPlans: HostingPlan[];
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Game Server', href: '/gaming' },
];

function planSpec(plan: HostingPlan): string {
    const c = plan.config ?? {};
    const mem = c.memory ?? 0;
    const disk = c.disk ?? 0;
    const cpu = c.cpu ?? 0;
    const parts = [];
    if (mem) parts.push(`${mem} MB RAM`);
    if (disk) parts.push(`${Math.round(disk / 1024)} GB SSD`);
    if (cpu) parts.push(`${cpu} % CPU`);
    return parts.length ? parts.join(' · ') : 'Game Server';
}
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Game Server" />

        <div class="space-y-8">
            <div>
                <Heading level="h1">Game Server mieten</Heading>
                <Text class="mt-2" muted>
                    Pterodactyl Game Server – wählen Sie Ihr Paket
                </Text>
            </div>

            <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card
                    v-for="plan in props.hostingPlans"
                    :key="plan.id"
                    class="flex flex-col"
                >
                    <CardHeader>
                        <CardTitle class="flex items-center gap-2">
                            <Gamepad2 class="h-5 w-5" />
                            {{ plan.name }}
                        </CardTitle>
                        <CardDescription>
                            {{ planSpec(plan) }}
                        </CardDescription>
                    </CardHeader>
                    <CardContent class="flex-1 space-y-4">
                        <ul class="space-y-2 text-sm text-muted-foreground">
                            <li>Eigener Game Server (Pterodactyl)</li>
                            <li>Vollständiger Zugang zum Panel</li>
                            <li>Start, Stop, Restart nach Bedarf</li>
                        </ul>
                        <div class="text-2xl font-semibold">{{ plan.price }} € <span class="text-sm font-normal text-muted-foreground">/ Monat</span></div>
                    </CardContent>
                    <CardContent class="pt-0">
                        <Link :href="`/gaming/checkout?plan=${plan.id}`">
                            <Button class="w-full">Jetzt buchen</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>

            <p v-if="props.hostingPlans.length === 0" class="text-muted-foreground">
                Derzeit sind keine Game-Server-Pakete verfügbar.
            </p>
        </div>
    </AppLayout>
</template>
