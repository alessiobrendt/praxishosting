<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { Headphones } from 'lucide-vue-next';
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
    config?: { plan_options?: { id: string; name: string; min?: number; max?: number; price_per_unit?: number }[] };
};

type Props = {
    hostingPlans: HostingPlan[];
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'TeamSpeak Server', href: '/teamspeak' },
];

function planSpec(plan: HostingPlan): string {
    const opts = plan.config?.plan_options ?? [];
    const slotsOpt = opts.find((o) => o.id === 'slots');
    if (slotsOpt && typeof slotsOpt.min === 'number' && typeof slotsOpt.max === 'number') {
        return `${slotsOpt.min}–${slotsOpt.max} Slots wählbar`;
    }
    return 'TeamSpeak Voice Server';
}

function planPriceDisplay(plan: HostingPlan): string {
    const priceNum = Number(plan.price ?? 0);
    if (priceNum > 0) {
        return `${plan.price} € / Monat`;
    }
    const opts = plan.config?.plan_options ?? [];
    const slotsOpt = opts.find((o) => o.id === 'slots');
    const slotPrice = slotsOpt?.price_per_unit ?? 0;
    if (slotPrice > 0) {
        return `ab ${slotPrice.toLocaleString('de-DE', { minimumFractionDigits: 2 })} € pro Slot`;
    }
    return 'Preis pro Slot';
}
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="TeamSpeak Server" />

        <div class="space-y-8">
            <div>
                <Heading level="h1">TeamSpeak Server mieten</Heading>
                <Text class="mt-2" muted>
                    Eigenen TeamSpeak-Server – wählen Sie Ihr Paket
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
                            <Headphones class="h-5 w-5" />
                            {{ plan.name }}
                        </CardTitle>
                        <CardDescription>
                            {{ planSpec(plan) }}
                        </CardDescription>
                    </CardHeader>
                    <CardContent class="flex-1 space-y-4">
                        <ul class="space-y-2 text-sm text-muted-foreground">
                            <li>Eigener virtueller TeamSpeak-Server</li>
                            <li>Slots nach Bedarf wählbar</li>
                            <li>Token-Verwaltung & Backups</li>
                        </ul>
                        <div class="text-2xl font-semibold">{{ planPriceDisplay(plan) }}</div>
                    </CardContent>
                    <CardContent class="pt-0">
                        <Link :href="`/teamspeak/checkout?plan=${plan.id}`">
                            <Button class="w-full">Jetzt buchen</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>

            <p v-if="props.hostingPlans.length === 0" class="text-muted-foreground">
                Derzeit sind keine TeamSpeak-Pakete verfügbar.
            </p>
        </div>
    </AppLayout>
</template>
