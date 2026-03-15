<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { Server } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import AppLayout from '@/layouts/AppLayout.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type HostingPlan = {
    id: number;
    name: string;
    plesk_package_name: string;
    disk_gb: number;
    traffic_gb: number;
    domains: number;
    subdomains: number;
    mailboxes: number;
    databases: number;
    price: string;
};

type Props = {
    hostingPlans: HostingPlan[];
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Webspace', href: '/webspace' },
];
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Webspace" />

        <div class="space-y-8">
            <div>
                <Heading level="h1">Webspace</Heading>
                <Text class="mt-2" muted>
                    Professioneller Webspace mit Plesk – wählen Sie Ihr Paket
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
                            <Server class="h-5 w-5" />
                            {{ plan.name }}
                        </CardTitle>
                        <CardDescription>
                            {{ plan.disk_gb }} GB NVMe · {{ plan.traffic_gb }} GB Traffic/Monat
                        </CardDescription>
                    </CardHeader>
                    <CardContent class="flex-1 space-y-4">
                        <ul class="space-y-2 text-sm text-muted-foreground">
                            <li>{{ plan.disk_gb }} GB NVMe Webspace</li>
                            <li>{{ plan.traffic_gb }} GB Traffic im Monat</li>
                            <li>{{ plan.domains }} Domain / {{ plan.subdomains }} Subdomains</li>
                            <li>{{ plan.mailboxes }} Mailpostfächer</li>
                            <li>{{ plan.databases }} Datenbanken</li>
                        </ul>
                        <div class="text-2xl font-semibold">{{ plan.price }} € <span class="text-sm font-normal text-muted-foreground">/ Monat</span></div>
                    </CardContent>
                    <CardContent class="pt-0">
                        <Link :href="`/webspace/checkout?plan=${plan.id}`">
                            <Button class="w-full">Jetzt buchen</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>

            <p v-if="props.hostingPlans.length === 0" class="text-muted-foreground">
                Derzeit sind keine Webspace-Pakete verfügbar.
            </p>
        </div>
    </AppLayout>
</template>
