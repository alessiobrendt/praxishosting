<script setup lang="ts">
import { Head, Link, router, usePage } from '@inertiajs/vue3';
import { Server, Gamepad2, Headphones, ExternalLink } from 'lucide-vue-next';
import { computed, watch } from 'vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from '@/components/ui/table';
import { Heading, Text } from '@/components/ui/typography';
import { notify } from '@/composables/useNotify';
import AppLayout from '@/layouts/AppLayout.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type SubscriptionItem = {
    id: number;
    type: 'gaming' | 'webspace' | 'teamspeak';
    name: string;
    plan_name: string | null;
    current_period_ends_at: string | null;
    cancel_at_period_end: boolean;
    show_url: string;
    cancel_url: string;
};

type Props = {
    gameServerSubscriptions: SubscriptionItem[];
    webspaceSubscriptions: SubscriptionItem[];
    teamSpeakSubscriptions: SubscriptionItem[];
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Abo verwalten', href: '#' },
];

const allSubscriptions = computed(() => [
    ...props.gameServerSubscriptions,
    ...props.webspaceSubscriptions,
    ...props.teamSpeakSubscriptions,
]);

function formatDate(iso: string | null): string {
    if (!iso) return '–';
    return new Date(iso).toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'UTC',
    });
}

function cancelSubscription(cancelUrl: string): void {
    router.post(cancelUrl, {}, {
        preserveScroll: true,
        onSuccess: () => notify.success('Abo zum Periodenende gekündigt.'),
        onError: (errors) => notify.error(Object.values(errors).flat().join(' ') || 'Kündigung fehlgeschlagen.'),
    });
}

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
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Abo verwalten" />

        <div class="space-y-6">
            <div>
                <Heading level="h1">Abo verwalten</Heading>
                <Text class="mt-2" muted>
                    Ihre aktiven Abos (Game-Server, TeamSpeak-Server und Webspace). Sie können ein Abo zum Periodenende kündigen.
                </Text>
            </div>

            <Card v-if="allSubscriptions.length === 0">
                <CardContent class="pt-6">
                    <Text class="text-muted-foreground">
                        Sie haben derzeit keine Abos mit monatlicher Abbuchung. Prepaid-Produkte verlängern Sie direkt
                        auf der jeweiligen Account-Seite (Verlängern).
                    </Text>
                    <Link :href="dashboard().url" class="mt-4 inline-block">
                        <Button variant="outline">Zum Dashboard</Button>
                    </Link>
                </CardContent>
            </Card>

            <template v-else>
                <Card v-if="gameServerSubscriptions.length > 0">
                    <CardHeader>
                        <CardTitle class="flex items-center gap-2">
                            <Gamepad2 class="h-5 w-5" />
                            Game-Server-Abos
                        </CardTitle>
                        <CardDescription>
                            Abos mit monatlicher Abbuchung – Kündigung zum Ende der aktuellen Abrechnungsperiode.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Paket</TableHead>
                                    <TableHead>Läuft bis</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead class="text-right">Aktionen</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow v-for="sub in gameServerSubscriptions" :key="`g-${sub.id}`">
                                    <TableCell class="font-medium">{{ sub.name }}</TableCell>
                                    <TableCell>{{ sub.plan_name ?? '–' }}</TableCell>
                                    <TableCell>{{ formatDate(sub.current_period_ends_at) }}</TableCell>
                                    <TableCell>
                                        <Badge v-if="sub.cancel_at_period_end" variant="secondary">
                                            Zum Periodenende gekündigt
                                        </Badge>
                                        <Badge v-else variant="default">Aktiv</Badge>
                                    </TableCell>
                                    <TableCell class="text-right space-x-2">
                                        <Link :href="sub.show_url">
                                            <Button variant="ghost" size="sm" class="gap-1">
                                                <ExternalLink class="h-3.5 w-3.5" />
                                                Zum Account
                                            </Button>
                                        </Link>
                                        <Button
                                            v-if="!sub.cancel_at_period_end"
                                            variant="outline"
                                            size="sm"
                                            @click="cancelSubscription(sub.cancel_url)"
                                        >
                                            Zum Periodenende kündigen
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card v-if="teamSpeakSubscriptions.length > 0">
                    <CardHeader>
                        <CardTitle class="flex items-center gap-2">
                            <Headphones class="h-5 w-5" />
                            TeamSpeak-Server-Abos
                        </CardTitle>
                        <CardDescription>
                            Abos mit monatlicher Abbuchung – Kündigung zum Ende der aktuellen Abrechnungsperiode.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Paket</TableHead>
                                    <TableHead>Läuft bis</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead class="text-right">Aktionen</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow v-for="sub in teamSpeakSubscriptions" :key="`t-${sub.id}`">
                                    <TableCell class="font-medium">{{ sub.name }}</TableCell>
                                    <TableCell>{{ sub.plan_name ?? '–' }}</TableCell>
                                    <TableCell>{{ formatDate(sub.current_period_ends_at) }}</TableCell>
                                    <TableCell>
                                        <Badge v-if="sub.cancel_at_period_end" variant="secondary">
                                            Zum Periodenende gekündigt
                                        </Badge>
                                        <Badge v-else variant="default">Aktiv</Badge>
                                    </TableCell>
                                    <TableCell class="text-right space-x-2">
                                        <Link :href="sub.show_url">
                                            <Button variant="ghost" size="sm" class="gap-1">
                                                <ExternalLink class="h-3.5 w-3.5" />
                                                Zum Account
                                            </Button>
                                        </Link>
                                        <Button
                                            v-if="!sub.cancel_at_period_end"
                                            variant="outline"
                                            size="sm"
                                            @click="cancelSubscription(sub.cancel_url)"
                                        >
                                            Zum Periodenende kündigen
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card v-if="webspaceSubscriptions.length > 0">
                    <CardHeader>
                        <CardTitle class="flex items-center gap-2">
                            <Server class="h-5 w-5" />
                            Webspace-Abos
                        </CardTitle>
                        <CardDescription>
                            Abos mit monatlicher Abbuchung – Kündigung zum Ende der aktuellen Abrechnungsperiode.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Domain</TableHead>
                                    <TableHead>Paket</TableHead>
                                    <TableHead>Läuft bis</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead class="text-right">Aktionen</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow v-for="sub in webspaceSubscriptions" :key="`w-${sub.id}`">
                                    <TableCell class="font-mono text-sm font-medium">{{ sub.name }}</TableCell>
                                    <TableCell>{{ sub.plan_name ?? '–' }}</TableCell>
                                    <TableCell>{{ formatDate(sub.current_period_ends_at) }}</TableCell>
                                    <TableCell>
                                        <Badge v-if="sub.cancel_at_period_end" variant="secondary">
                                            Zum Periodenende gekündigt
                                        </Badge>
                                        <Badge v-else variant="default">Aktiv</Badge>
                                    </TableCell>
                                    <TableCell class="text-right space-x-2">
                                        <Link :href="sub.show_url">
                                            <Button variant="ghost" size="sm" class="gap-1">
                                                <ExternalLink class="h-3.5 w-3.5" />
                                                Zum Account
                                            </Button>
                                        </Link>
                                        <Button
                                            v-if="!sub.cancel_at_period_end"
                                            variant="outline"
                                            size="sm"
                                            @click="cancelSubscription(sub.cancel_url)"
                                        >
                                            Zum Periodenende kündigen
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </template>
        </div>
    </AppLayout>
</template>
