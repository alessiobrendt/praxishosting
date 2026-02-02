<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text, Link as TypographyLink } from '@/components/ui/typography';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { show as sitesShow, create as sitesCreate } from '@/routes/sites';
import gallery from '@/routes/gallery';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Plus, ExternalLink } from 'lucide-vue-next';

type SiteSubscription = {
    id: number;
    stripe_status: string;
    current_period_ends_at: string | null;
    cancel_at_period_end: boolean;
};

type Site = {
    uuid: string;
    name: string;
    slug: string;
    template?: { name: string };
    site_subscription?: SiteSubscription | null;
};

type Props = {
    sites: Site[];
    collaboratingSites: (Site & { user?: { name: string } })[];
};

defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Meine Sites', href: '#' },
];
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Meine Sites" />

        <div class="space-y-6">
            <div class="flex items-center justify-between">
                <div>
                    <Heading level="h1">Meine Sites</Heading>
                    <Text class="mt-2" muted>
                        Ihre Webseiten und gemeinsam bearbeitete Sites
                    </Text>
                </div>
                <Link :href="sitesCreate().url">
                    <Button>
                        <Plus class="mr-2 h-4 w-4" />
                        Neue Site erstellen
                    </Button>
                </Link>
            </div>

            <!-- Own Sites -->
            <Card>
                <CardHeader>
                    <CardTitle>Eigene Sites</CardTitle>
                    <CardDescription>Von Ihnen gekaufte Templates</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Template</TableHead>
                                <TableHead>Abo-Status</TableHead>
                                <TableHead class="text-right">Aktionen</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="site in sites" :key="site.uuid">
                                <TableCell class="font-medium">{{ site.name }}</TableCell>
                                <TableCell>
                                    <code class="rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-800">
                                        {{ site.slug }}
                                    </code>
                                </TableCell>
                                <TableCell>{{ site.template?.name ?? '-' }}</TableCell>
                                <TableCell>
                                    <template v-if="site.site_subscription">
                                        <span
                                            v-if="site.site_subscription.stripe_status === 'active' && !site.site_subscription.cancel_at_period_end"
                                            class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                        >
                                            Aktiv
                                        </span>
                                        <span
                                            v-else-if="site.site_subscription.cancel_at_period_end"
                                            class="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                                        >
                                            Läuft aus
                                        </span>
                                        <span
                                            v-else
                                            class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                                        >
                                            {{ site.site_subscription.stripe_status }}
                                        </span>
                                    </template>
                                    <span v-else class="text-muted">–</span>
                                </TableCell>
                                <TableCell class="text-right">
                                    <Link :href="sitesShow({ site: site.uuid }).url">
                                        <Button variant="ghost" size="sm">
                                            Bearbeiten
                                            <ExternalLink class="ml-2 h-3 w-3" />
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                            <TableRow v-if="sites.length === 0">
                                <TableCell colspan="5" class="text-center text-gray-500 dark:text-gray-400">
                                    Keine Sites vorhanden
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <!-- Collaborating Sites -->
            <Card v-if="collaboratingSites?.length">
                <CardHeader>
                    <CardTitle>Gemeinsam bearbeitete Sites</CardTitle>
                    <CardDescription>Sites, an denen Sie mitarbeiten</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Besitzer</TableHead>
                                <TableHead class="text-right">Aktionen</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="site in collaboratingSites" :key="site.uuid">
                                <TableCell class="font-medium">{{ site.name }}</TableCell>
                                <TableCell>
                                    <code class="rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-800">
                                        {{ site.slug }}
                                    </code>
                                </TableCell>
                                <TableCell>{{ site.user?.name ?? '-' }}</TableCell>
                                <TableCell class="text-right">
                                    <Link :href="sitesShow({ site: site.uuid }).url">
                                        <Button variant="ghost" size="sm">
                                            Bearbeiten
                                            <ExternalLink class="ml-2 h-3 w-3" />
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div class="flex justify-center">
                <Link :href="gallery.index().url">
                    <Button variant="outline">
                        Weitere Templates in der Galerie ansehen
                        <ExternalLink class="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </div>
        </div>
    </AppLayout>
</template>
