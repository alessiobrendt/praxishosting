<script setup lang="ts">
import { ref } from 'vue';
import { Head, Link, router, usePage } from '@inertiajs/vue3';
import { Plus, Eye, Edit, Cloud, Server, Pencil, Trash2, Gamepad2, Headphones } from 'lucide-vue-next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Heading, Text } from '@/components/ui/typography';
import AdminLayout from '@/layouts/AdminLayout.vue';
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
    stripe_price_id: string | null;
    is_active: boolean;
    webspace_accounts_count: number;
};

type HostingServer = { id: number; name: string; hostname: string };

type GameserverCloudPlan = {
    id: number;
    name: string;
    price: string;
    is_active: boolean;
    sort_order: number;
    hosting_server: HostingServer | null;
};

/** Pterodactyl/TeamSpeak HostingPlan (shared fields + hosting_server, config) */
type HostingPlanPanel = HostingPlan & {
    hosting_server?: HostingServer | null;
    config?: Record<string, unknown> | null;
    game_server_accounts_count?: number;
};

type Props = {
    hostingPlans: {
        data: HostingPlan[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    hostingPlansPterodactyl: {
        data: HostingPlanPanel[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    hostingPlansTeamSpeak: {
        data: HostingPlanPanel[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    gameserverCloudPlans: {
        data: GameserverCloudPlan[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    brandHasGaming: boolean;
    brandHasTeamSpeak: boolean;
    brandHasGameserverCloud: boolean;
};

const props = withDefaults(defineProps<Props>(), {
    brandHasGaming: false,
    brandHasTeamSpeak: false,
    brandHasGameserverCloud: false,
});

const page = usePage();
const urlTab = (page.url.split('?')[1] || '')
    .split('&')
    .find((p) => p.startsWith('tab='))
    ?.split('=')[1];
const validTabs = ['webspace'];
if (props.brandHasGaming) validTabs.push('pterodactyl');
if (props.brandHasTeamSpeak) validTabs.push('teamspeak');
if (props.brandHasGameserverCloud) validTabs.push('cloud');
const activeTab = ref(
    urlTab && validTabs.includes(urlTab) ? urlTab : 'webspace',
);

function setTab(value: string) {
    activeTab.value = value;
    const url = new URL(window.location.href);
    url.searchParams.set('tab', value);
    router.get(url.pathname + url.search, {}, { preserveState: true });
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Hosting-Pläne', href: '/admin/hosting-plans' },
];

function handlePagination(url: string) {
    const parsed = new URL(url, window.location.origin);
    parsed.searchParams.set('tab', activeTab.value);
    window.location.href = parsed.toString();
}

const specsShort = (plan: HostingPlan) =>
    `${plan.disk_gb} GB / ${plan.traffic_gb} GB Traffic / ${plan.domains} Dom.`;

function hostingPlanBadgeVariant(active: boolean): 'success' | 'error' {
    return active ? 'success' : 'error';
}

function hostingPlanStatusLabel(active: boolean): string {
    return active ? 'Aktiv' : 'Inaktiv';
}

function cloudPlanBadgeVariant(active: boolean): 'success' | 'secondary' {
    return active ? 'success' : 'secondary';
}

function destroyCloudPlan(plan: GameserverCloudPlan) {
    if (!confirm(`Plan „${plan.name}" wirklich löschen?`)) return;
    router.delete(`/admin/gameserver-cloud-plans/${plan.id}`);
}
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Hosting-Pläne" />

        <div class="space-y-6">
            <div class="flex items-center justify-between">
                <div>
                    <Heading level="h1">Hosting-Pläne</Heading>
                    <Text class="mt-2" muted>
                        Webspace-Pakete (Plesk), Pterodactyl- und TeamSpeak-Pläne sowie Gameserver-Cloud-Pläne
                    </Text>
                </div>
            </div>

            <Tabs v-model="activeTab" class="w-full" @update:model-value="setTab">
                <TabsList class="mb-4 flex w-full gap-1">
                    <TabsTrigger value="webspace" class="min-w-0 flex-1 gap-2">
                        <Server class="h-4 w-4" />
                        Webspace-Pakete
                    </TabsTrigger>
                    <TabsTrigger value="pterodactyl" class="min-w-0 flex-1 gap-2" :disabled="!brandHasGaming">
                        <Gamepad2 class="h-4 w-4" />
                        Game-Server-Pläne
                    </TabsTrigger>
                    <TabsTrigger value="teamspeak" class="min-w-0 flex-1 gap-2" :disabled="!brandHasTeamSpeak">
                        <Headphones class="h-4 w-4" />
                        TeamSpeak-Pläne
                    </TabsTrigger>
                    <TabsTrigger value="cloud" class="min-w-0 flex-1 gap-2" :disabled="!brandHasGameserverCloud">
                        <Cloud class="h-4 w-4" />
                        Gameserver-Cloud-Pläne
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="webspace" class="mt-0 space-y-4">
                    <Card class="border-primary/20 bg-primary/5">
                        <CardContent class="flex flex-row items-center gap-4 py-4">
                            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                <Server class="h-6 w-6 text-primary" />
                            </div>
                            <div class="min-w-0 flex-1">
                                <h3 class="font-semibold">Webspace-Pakete</h3>
                                <p class="text-sm text-muted-foreground">
                                    Plesk-Pakete für den Verkauf. Plesk-Paketname = exakter Service-Plan-Name in Plesk.
                                </p>
                            </div>
                            <Link href="/admin/hosting-plans/create">
                                <Button>
                                    <Plus class="mr-2 h-4 w-4" />
                                    Neues Paket
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Alle Pakete</CardTitle>
                            <CardDescription>Plesk-Paketname = exakter Service-Plan-Name in Plesk</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Plesk-Paketname</TableHead>
                                        <TableHead>Specs</TableHead>
                                        <TableHead>Preis</TableHead>
                                        <TableHead>Accounts</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead class="text-right">Aktionen</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow v-for="plan in props.hostingPlans.data" :key="plan.id">
                                        <TableCell class="font-medium">{{ plan.name }}</TableCell>
                                        <TableCell>
                                            <code class="rounded bg-muted px-2 py-1 text-sm">
                                                {{ plan.plesk_package_name || '–' }}
                                            </code>
                                        </TableCell>
                                        <TableCell class="text-sm text-muted-foreground">
                                            {{ specsShort(plan) }}
                                        </TableCell>
                                        <TableCell>{{ plan.price }} €</TableCell>
                                        <TableCell>{{ plan.webspace_accounts_count }}</TableCell>
                                        <TableCell>
                                            <Badge :variant="hostingPlanBadgeVariant(plan.is_active)">
                                                {{ hostingPlanStatusLabel(plan.is_active) }}
                                            </Badge>
                                        </TableCell>
                                        <TableCell class="text-right">
                                            <div class="flex items-center justify-end gap-2">
                                                <Link :href="`/admin/hosting-plans/${plan.id}`">
                                                    <Button variant="ghost" size="sm">
                                                        <Eye class="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Link :href="`/admin/hosting-plans/${plan.id}/edit`">
                                                    <Button variant="ghost" size="sm">
                                                        <Edit class="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow v-if="props.hostingPlans.data.length === 0">
                                        <TableCell colspan="7" class="text-center text-muted-foreground">
                                            Keine Pakete vorhanden
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <div v-if="props.hostingPlans.links && props.hostingPlans.links.length > 3" class="flex justify-center">
                        <Pagination :links="props.hostingPlans.links" @navigate="handlePagination" />
                    </div>
                </TabsContent>

                <TabsContent value="pterodactyl" class="mt-0 space-y-4">
                    <Card class="border-primary/20 bg-primary/5">
                        <CardContent class="flex flex-row items-center gap-4 py-4">
                            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                <Gamepad2 class="h-6 w-6 text-primary" />
                            </div>
                            <div class="min-w-0 flex-1">
                                <h3 class="font-semibold">Game-Server-Pläne (Pterodactyl)</h3>
                                <p class="text-sm text-muted-foreground">
                                    Pterodactyl-Pläne für Game-Server. Server und Limits in Plan bearbeiten.
                                </p>
                            </div>
                            <Link href="/admin/hosting-plans/create">
                                <Button>
                                    <Plus class="mr-2 h-4 w-4" />
                                    Neuer Plan
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Alle Game-Server-Pläne</CardTitle>
                            <CardDescription>Pterodactyl-Server und Konfiguration pro Plan</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Pterodactyl-Server</TableHead>
                                        <TableHead>Preis</TableHead>
                                        <TableHead>Accounts</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead class="text-right">Aktionen</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow
                                        v-for="plan in props.hostingPlansPterodactyl.data"
                                        :key="plan.id"
                                    >
                                        <TableCell class="font-medium">{{ plan.name }}</TableCell>
                                        <TableCell class="text-sm text-muted-foreground">
                                            {{ plan.hosting_server?.name ?? plan.hosting_server?.hostname ?? '–' }}
                                        </TableCell>
                                        <TableCell>{{ plan.price }} €</TableCell>
                                        <TableCell>{{ plan.game_server_accounts_count ?? 0 }}</TableCell>
                                        <TableCell>
                                            <Badge :variant="hostingPlanBadgeVariant(plan.is_active)">
                                                {{ hostingPlanStatusLabel(plan.is_active) }}
                                            </Badge>
                                        </TableCell>
                                        <TableCell class="text-right">
                                            <div class="flex items-center justify-end gap-2">
                                                <Link :href="`/admin/hosting-plans/${plan.id}`">
                                                    <Button variant="ghost" size="sm">
                                                        <Eye class="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Link :href="`/admin/hosting-plans/${plan.id}/edit`">
                                                    <Button variant="ghost" size="sm">
                                                        <Edit class="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow v-if="props.hostingPlansPterodactyl.data.length === 0">
                                        <TableCell colspan="6" class="text-center text-muted-foreground">
                                            Keine Game-Server-Pläne vorhanden
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            <div
                                v-if="props.hostingPlansPterodactyl.links && props.hostingPlansPterodactyl.links.length > 3"
                                class="mt-4 flex justify-center"
                            >
                                <Pagination
                                    :links="props.hostingPlansPterodactyl.links"
                                    @navigate="handlePagination"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="teamspeak" class="mt-0 space-y-4">
                    <Card class="border-primary/20 bg-primary/5">
                        <CardContent class="flex flex-row items-center gap-4 py-4">
                            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                <Headphones class="h-6 w-6 text-primary" />
                            </div>
                            <div class="min-w-0 flex-1">
                                <h3 class="font-semibold">TeamSpeak-Pläne</h3>
                                <p class="text-sm text-muted-foreground">
                                    TeamSpeak-Server-Pläne (Slots etc.). Konfiguration in Plan bearbeiten.
                                </p>
                            </div>
                            <Link href="/admin/hosting-plans/create">
                                <Button>
                                    <Plus class="mr-2 h-4 w-4" />
                                    Neuer Plan
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Alle TeamSpeak-Pläne</CardTitle>
                            <CardDescription>Slots und Einstellungen in config</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Slots</TableHead>
                                        <TableHead>Preis</TableHead>
                                        <TableHead>Accounts</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead class="text-right">Aktionen</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow
                                        v-for="plan in props.hostingPlansTeamSpeak.data"
                                        :key="plan.id"
                                    >
                                        <TableCell class="font-medium">{{ plan.name }}</TableCell>
                                        <TableCell class="text-sm text-muted-foreground">
                                            {{ plan.config?.slots ?? '–' }}
                                        </TableCell>
                                        <TableCell>{{ plan.price }} €</TableCell>
                                        <TableCell>{{ plan.game_server_accounts_count ?? 0 }}</TableCell>
                                        <TableCell>
                                            <Badge :variant="hostingPlanBadgeVariant(plan.is_active)">
                                                {{ hostingPlanStatusLabel(plan.is_active) }}
                                            </Badge>
                                        </TableCell>
                                        <TableCell class="text-right">
                                            <div class="flex items-center justify-end gap-2">
                                                <Link :href="`/admin/hosting-plans/${plan.id}`">
                                                    <Button variant="ghost" size="sm">
                                                        <Eye class="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Link :href="`/admin/hosting-plans/${plan.id}/edit`">
                                                    <Button variant="ghost" size="sm">
                                                        <Edit class="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow v-if="props.hostingPlansTeamSpeak.data.length === 0">
                                        <TableCell colspan="6" class="text-center text-muted-foreground">
                                            Keine TeamSpeak-Pläne vorhanden
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            <div
                                v-if="props.hostingPlansTeamSpeak.links && props.hostingPlansTeamSpeak.links.length > 3"
                                class="mt-4 flex justify-center"
                            >
                                <Pagination
                                    :links="props.hostingPlansTeamSpeak.links"
                                    @navigate="handlePagination"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="cloud" class="mt-0 space-y-4">
                    <Card class="border-primary/20 bg-primary/5">
                        <CardContent class="flex flex-row items-center gap-4 py-4">
                            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                <Cloud class="h-6 w-6 text-primary" />
                            </div>
                            <div class="min-w-0 flex-1">
                                <h3 class="font-semibold">Gameserver-Cloud-Pläne</h3>
                                <p class="text-sm text-muted-foreground">
                                    Cloud-Pläne mit Ressourcen-Pool (CPU, RAM, Disk) für Pterodactyl Game-Server. Kunden kaufen ein Abo und legen daraus beliebig viele Game-Server an.
                                </p>
                            </div>
                            <Link href="/admin/gameserver-cloud-plans/create">
                                <Button>
                                    <Plus class="mr-2 h-4 w-4" />
                                    Neuer Plan
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Alle Pläne</CardTitle>
                            <CardDescription>Pro Brand; Pterodactyl-Server und Limits (max_cpu, max_memory_mb, max_disk_gb) in config.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Preis</TableHead>
                                        <TableHead>Pterodactyl-Server</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead class="text-right">Aktionen</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow
                                        v-for="plan in props.gameserverCloudPlans.data"
                                        :key="plan.id"
                                    >
                                        <TableCell class="font-medium">{{ plan.name }}</TableCell>
                                        <TableCell>{{ plan.price }} €</TableCell>
                                        <TableCell class="text-sm text-muted-foreground">
                                            {{ plan.hosting_server?.name ?? plan.hosting_server?.hostname ?? '–' }}
                                        </TableCell>
                                        <TableCell>
                                            <Badge :variant="cloudPlanBadgeVariant(plan.is_active)">
                                                {{ hostingPlanStatusLabel(plan.is_active) }}
                                            </Badge>
                                        </TableCell>
                                        <TableCell class="text-right">
                                            <Link :href="`/admin/gameserver-cloud-plans/${plan.id}/edit`">
                                                <Button variant="ghost" size="icon" title="Bearbeiten">
                                                    <Pencil class="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                title="Löschen"
                                                @click="destroyCloudPlan(plan)"
                                            >
                                                <Trash2 class="h-4 w-4 text-destructive" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            <div
                                v-if="props.gameserverCloudPlans.data.length === 0"
                                class="py-8 text-center text-muted-foreground"
                            >
                                Keine Gameserver-Cloud-Pläne vorhanden
                            </div>
                            <Pagination
                                v-if="props.gameserverCloudPlans.links && props.gameserverCloudPlans.links.length > 3"
                                :links="props.gameserverCloudPlans.links"
                                @navigate="handlePagination"
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    </AdminLayout>
</template>
