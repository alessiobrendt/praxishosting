<script setup lang="ts">
import { Head, router, useForm } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import InputError from '@/components/InputError.vue';
import { index as adminSitesIndex } from '@/routes/admin/sites';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { ref, onMounted } from 'vue';
import { pushAdminRecent } from '@/composables/useAdminRecent';

type SiteSubscription = {
    id: number;
    stripe_status: string;
    current_period_ends_at: string | null;
    current_period_ends_at_formatted: string | null;
    current_period_ends_at_date: string | null;
    cancel_at_period_end: boolean;
};

type Site = {
    uuid: string;
    name: string;
    slug: string;
    status: string;
    is_legacy: boolean;
    template?: { name: string };
    user?: { id: number; name: string; email: string };
    site_subscription?: SiteSubscription | null;
};

type ActivityLogEntry = {
    id: number;
    action: string;
    created_at: string;
    user?: { id: number; name: string };
};

type Props = {
    site: Site;
    activityLog?: ActivityLogEntry[];
};

const props = defineProps<Props>();

const actionLabels: Record<string, string> = {
    site_status_updated: 'Status geändert',
    site_subscription_period_updated: 'Laufzeitende geändert',
    site_subscription_cancelled: 'Abo gekündigt',
    site_subscription_reactivated: 'Kündigung zurückgenommen',
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Sites', href: adminSitesIndex().url },
    { title: props.site.name, href: '#' },
];

const periodForm = useForm({
    current_period_ends_at: props.site.site_subscription?.current_period_ends_at_date ?? '',
});

const submitPeriod = () => {
    periodForm.put(`/admin/sites/${props.site.uuid}/subscription`, {
        preserveScroll: true,
        onSuccess: () => periodForm.reset(),
    });
};

const updateStatus = (status: 'active' | 'suspended') => {
    router.put(`/admin/sites/${props.site.uuid}/status`, { status });
};

const cancelSubscription = () => {
    router.post(`/admin/sites/${props.site.uuid}/subscription/cancel`);
};

const reactivateSubscription = () => {
    router.post(`/admin/sites/${props.site.uuid}/subscription/reactivate`);
};

const syncSubscription = () => {
    router.post(`/admin/sites/${props.site.uuid}/subscription/sync`);
};

const suspendDialogOpen = ref(false);
const cancelSubDialogOpen = ref(false);

onMounted(() => {
    pushAdminRecent({
        type: 'site',
        id: props.site.uuid,
        label: props.site.name,
        url: `/admin/sites/${props.site.uuid}`,
    });
});
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head :title="`Site: ${site.name} (Admin)`" />

        <div class="space-y-6">
            <div>
                <Heading level="h1">{{ site.name }}</Heading>
                <Text class="mt-2" muted>
                    Admin-Verwaltung: Site, Abo und Aktionen
                </Text>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Site</CardTitle>
                    <CardDescription>Name, Slug, Besitzer, Template, Status</CardDescription>
                </CardHeader>
                <CardContent class="space-y-3">
                    <div class="grid gap-2 sm:grid-cols-2">
                        <div>
                            <Text variant="small" muted>Name</Text>
                            <Text class="font-medium">{{ site.name }}</Text>
                        </div>
                        <div>
                            <Text variant="small" muted>Slug</Text>
                            <code class="rounded bg-muted px-2 py-1 text-sm">{{ site.slug }}</code>
                        </div>
                        <div>
                            <Text variant="small" muted>Besitzer</Text>
                            <Text v-if="site.user">{{ site.user.name }} ({{ site.user.email }})</Text>
                            <Text v-else>–</Text>
                        </div>
                        <div>
                            <Text variant="small" muted>Template</Text>
                            <Text>{{ site.template?.name ?? '–' }}</Text>
                        </div>
                        <div>
                            <Text variant="small" muted>Status</Text>
                            <Badge :variant="site.status === 'active' ? 'success' : 'secondary'">{{ site.status }}</Badge>
                        </div>
                        <div>
                            <Text variant="small" muted>Legacy</Text>
                            <Text>{{ site.is_legacy ? 'Ja' : 'Nein' }}</Text>
                        </div>
                    </div>
                    <div class="mt-4 flex flex-wrap gap-2">
                        <template v-if="site.status === 'active'">
                            <Dialog v-model:open="suspendDialogOpen">
                                <DialogTrigger as-child>
                                    <Button variant="destructive" size="sm">Sperren</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Site sperren?</DialogTitle>
                                        <DialogDescription>
                                            Die Site „{{ site.name }}“ wird gesperrt. Der Besitzer erhält eine E-Mail. Die Site ist danach nicht mehr erreichbar, bis sie wieder entsperrt wird.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <Button variant="outline" @click="suspendDialogOpen = false">Abbrechen</Button>
                                        <Button variant="destructive" @click="updateStatus('suspended')">Sperren</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </template>
                        <template v-else>
                            <Button variant="default" size="sm" @click="updateStatus('active')">Entsperren</Button>
                        </template>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Abo</CardTitle>
                    <CardDescription>Stripe-Status, Laufzeitende, Kündigung</CardDescription>
                </CardHeader>
                <CardContent class="space-y-3">
                    <template v-if="site.site_subscription">
                        <div class="grid gap-2 sm:grid-cols-2">
                            <div>
                                <Text variant="small" muted>Stripe-Status</Text>
                                <Badge :variant="site.site_subscription.stripe_status === 'active' ? 'success' : 'secondary'">
                                    {{ site.site_subscription.stripe_status }}
                                </Badge>
                            </div>
                            <div>
                                <Text variant="small" muted>Laufzeitende</Text>
                                <Text>{{ site.site_subscription.current_period_ends_at_formatted ?? '–' }}</Text>
                            </div>
                            <div>
                                <Text variant="small" muted>Kündigung zum Periodenende</Text>
                                <Text>{{ site.site_subscription.cancel_at_period_end ? 'Ja' : 'Nein' }}</Text>
                            </div>
                        </div>
                        <form @submit.prevent="submitPeriod" class="mt-4 space-y-3 border-t pt-4">
                            <Text variant="small" muted class="block">Laufzeitende anpassen (nur lokal, Stripe unverändert)</Text>
                            <div class="flex flex-wrap items-end gap-2">
                                <div class="space-y-2">
                                    <Label for="current_period_ends_at">Laufzeitende</Label>
                                    <Input
                                        id="current_period_ends_at"
                                        v-model="periodForm.current_period_ends_at"
                                        type="date"
                                        :aria-invalid="!!periodForm.errors.current_period_ends_at"
                                    />
                                    <InputError :message="periodForm.errors.current_period_ends_at" />
                                </div>
                                <Button type="submit" size="sm" :disabled="periodForm.processing">Speichern</Button>
                            </div>
                        </form>
                        <div class="mt-4 flex flex-wrap gap-2 border-t pt-4">
                            <template v-if="site.site_subscription.stripe_status === 'active' && !site.site_subscription.cancel_at_period_end">
                                <Dialog v-model:open="cancelSubDialogOpen">
                                    <DialogTrigger as-child>
                                        <Button variant="outline" size="sm">Abo kündigen</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Abo kündigen?</DialogTitle>
                                            <DialogDescription>
                                                Das Abo wird zum Periodenende ({{ site.site_subscription.current_period_ends_at_formatted }}) gekündigt. Der Kunde kann die Kündigung bis dahin zurücknehmen.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter>
                                            <Button variant="outline" @click="cancelSubDialogOpen = false">Abbrechen</Button>
                                            <Button variant="destructive" @click="cancelSubscription">Kündigen</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </template>
                            <template v-else-if="site.site_subscription.cancel_at_period_end">
                                <Button variant="default" size="sm" @click="reactivateSubscription">Kündigung zurücknehmen</Button>
                            </template>
                            <Button
                                variant="outline"
                                size="sm"
                                class="mt-2"
                                @click="syncSubscription"
                            >
                                Abo mit Stripe abgleichen
                            </Button>
                        </div>
                    </template>
                    <template v-else>
                        <Text muted>Kein Abo verknüpft.</Text>
                    </template>
                </CardContent>
            </Card>

            <Card v-if="activityLog?.length">
                <CardHeader>
                    <CardTitle>Letzte Änderungen</CardTitle>
                    <CardDescription>Aktivitätslog für diese Site</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul class="space-y-2">
                        <li
                            v-for="entry in activityLog"
                            :key="entry.id"
                            class="flex flex-wrap items-center gap-2 rounded-md border border-border px-3 py-2 text-sm"
                        >
                            <span class="font-medium">{{ actionLabels[entry.action] ?? entry.action }}</span>
                            <span class="text-muted-foreground">{{ entry.created_at }}</span>
                            <span v-if="entry.user" class="text-muted-foreground">· {{ entry.user.name }}</span>
                        </li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
