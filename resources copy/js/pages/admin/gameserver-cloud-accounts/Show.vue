<script setup lang="ts">
import { ref, watch } from 'vue';
import { Head, Link, useForm } from '@inertiajs/vue3';
import { ArrowLeft, Eye, Pencil, Server } from 'lucide-vue-next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from '@/components/ui/table';
import { Heading, Text } from '@/components/ui/typography';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import InputError from '@/components/InputError.vue';

type User = { id: number; name: string; email: string } | null;
type GameserverCloudPlanSummary = { id: number; name: string; config?: Record<string, number> };

type Subscription = {
    id: number;
    user: User;
    gameserver_cloud_plan: GameserverCloudPlanSummary;
    plan_display_user_defined: boolean;
    custom_max_cpu: number | null;
    custom_max_memory_mb: number | null;
    custom_max_disk_gb: number | null;
    custom_price: string | null;
    display_price: string | null;
    status: string;
    current_period_ends_at: string | null;
    cancel_at_period_end?: boolean;
    used_cpu: number;
    used_memory_mb: number;
    used_disk_mb: number;
    remaining_cpu: number;
    remaining_memory_mb: number;
    remaining_disk_mb: number;
    max_cpu: number;
    max_memory_mb: number;
    max_disk_gb: number;
};

type GameServerAccountSummary = {
    id: number;
    name: string;
    identifier: string | null;
    status: string;
    allocation_manually_set: boolean;
    allocation: { cpu: number; memory_mb: number; disk_mb: number };
};

type PlanOption = { id: number; name: string };

type Props = {
    subscription: Subscription;
    gameServerAccounts: GameServerAccountSummary[];
    gameserverCloudPlans: PlanOption[];
};

const props = defineProps<Props>();

const subscriptionPlanLabel = () =>
    props.subscription.plan_display_user_defined
        ? 'Benutzer definiert'
        : (props.subscription.gameserver_cloud_plan?.name ?? 'Abo');

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Gameserver-Cloud-Accounts', href: '/admin/gameserver-cloud-accounts' },
    { title: `Cloud: ${subscriptionPlanLabel()}`, href: '#' },
];

const planForm = useForm({
    plan_display_user_defined: props.subscription.plan_display_user_defined ?? false,
    gameserver_cloud_plan_id:
        props.subscription.plan_display_user_defined ? '' : (props.subscription.gameserver_cloud_plan?.id ?? ''),
    custom_max_cpu: props.subscription.custom_max_cpu ?? '',
    custom_max_memory_mb: props.subscription.custom_max_memory_mb ?? '',
    custom_max_disk_gb: props.subscription.custom_max_disk_gb ?? '',
    custom_price: props.subscription.custom_price ?? '',
});

function periodEndsAtDateValue(): string {
    const d = props.subscription.current_period_ends_at;
    if (!d) return '';
    return d.slice(0, 10);
}

const periodAndStatusForm = useForm({
    current_period_ends_at: periodEndsAtDateValue(),
    status: props.subscription.status || 'active',
    cancel_at_period_end: props.subscription.cancel_at_period_end ?? false,
});

const planSelectValue = ref<string | number>(
    props.subscription.plan_display_user_defined ? 'user_defined' : (props.subscription.gameserver_cloud_plan?.id ?? '')
);

watch(
    () => [
        props.subscription.plan_display_user_defined,
        props.subscription.gameserver_cloud_plan?.id,
        props.subscription.custom_max_cpu,
        props.subscription.custom_max_memory_mb,
        props.subscription.custom_max_disk_gb,
        props.subscription.custom_price,
    ],
    () => {
        planSelectValue.value = props.subscription.plan_display_user_defined
            ? 'user_defined'
            : (props.subscription.gameserver_cloud_plan?.id ?? '');
        planForm.custom_max_cpu = props.subscription.custom_max_cpu ?? '';
        planForm.custom_max_memory_mb = props.subscription.custom_max_memory_mb ?? '';
        planForm.custom_max_disk_gb = props.subscription.custom_max_disk_gb ?? '';
        planForm.custom_price = props.subscription.custom_price ?? '';
    }
);

watch(
    () => [
        props.subscription.current_period_ends_at,
        props.subscription.status,
        props.subscription.cancel_at_period_end,
    ],
    () => {
        periodAndStatusForm.current_period_ends_at = periodEndsAtDateValue();
        periodAndStatusForm.status = props.subscription.status || 'active';
        periodAndStatusForm.cancel_at_period_end = props.subscription.cancel_at_period_end ?? false;
    }
);

function onPlanSelectChange(value: string) {
    if (value === 'user_defined') {
        planForm.plan_display_user_defined = true;
        planForm.gameserver_cloud_plan_id = '';
    } else {
        planForm.plan_display_user_defined = false;
        planForm.gameserver_cloud_plan_id = value === '' ? '' : Number(value);
    }
    planSelectValue.value = value;
}

const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('de-DE', { timeZone: 'UTC' }) : '–';

function submitPlanChange() {
    const payload: Record<string, unknown> = {
        plan_display_user_defined: planForm.plan_display_user_defined,
    };
    if (planForm.plan_display_user_defined) {
        payload.custom_max_cpu = planForm.custom_max_cpu === '' ? null : Number(planForm.custom_max_cpu);
        payload.custom_max_memory_mb =
            planForm.custom_max_memory_mb === '' ? null : Number(planForm.custom_max_memory_mb);
        payload.custom_max_disk_gb =
            planForm.custom_max_disk_gb === '' ? null : Number(planForm.custom_max_disk_gb);
        payload.custom_price = planForm.custom_price === '' ? null : Number(planForm.custom_price);
    } else if (planForm.gameserver_cloud_plan_id !== '') {
        payload.gameserver_cloud_plan_id = Number(planForm.gameserver_cloud_plan_id);
    }
    planForm.transform(() => payload).put(`/admin/gameserver-cloud-accounts/${props.subscription.id}`, {
        preserveScroll: true,
        onSuccess: () => planForm.reset(),
    });
}

function submitPeriodAndStatus() {
    const payload: Record<string, string | boolean> = {
        status: periodAndStatusForm.status,
        cancel_at_period_end: periodAndStatusForm.cancel_at_period_end,
    };
    if (periodAndStatusForm.current_period_ends_at) {
        payload.current_period_ends_at = periodAndStatusForm.current_period_ends_at;
    }
    periodAndStatusForm.transform(() => payload).put(
        `/admin/gameserver-cloud-accounts/${props.subscription.id}/period-and-status`,
        { preserveScroll: true, onSuccess: () => periodAndStatusForm.reset() }
    );
}

const resourcesDialogOpen = ref(false);
const editingAccount = ref<GameServerAccountSummary | null>(null);

const resourcesForm = useForm({
    cpu: 0,
    memory_mb: 0,
    disk_mb: 0,
});

function openResourcesDialog(acc: GameServerAccountSummary) {
    editingAccount.value = acc;
    resourcesForm.cpu = acc.allocation?.cpu ?? 0;
    resourcesForm.memory_mb = acc.allocation?.memory_mb ?? 0;
    resourcesForm.disk_mb = acc.allocation?.disk_mb ?? 0;
    resourcesForm.clearErrors();
    resourcesDialogOpen.value = true;
}

function submitResources() {
    const acc = editingAccount.value;
    if (!acc) return;
    resourcesForm.put(
        `/admin/gameserver-cloud-accounts/${props.subscription.id}/servers/${acc.id}/resources`,
        {
            preserveScroll: true,
            onSuccess: () => {
                resourcesDialogOpen.value = false;
                editingAccount.value = null;
            },
        }
    );
}

function planLabel(acc: GameServerAccountSummary): string {
    return acc.allocation_manually_set ? 'Benutzer definiert' : (props.subscription.gameserver_cloud_plan?.name ?? '–');
}
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head :title="`Cloud-Abo: ${subscriptionPlanLabel()}`" />

        <div class="space-y-6">
            <div class="flex items-center gap-4">
                <Link href="/admin/gameserver-cloud-accounts">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft class="h-4 w-4" />
                    </Button>
                </Link>
                <div class="flex items-center gap-2">
                    <Server class="h-8 w-8" />
                    <div>
                        <Heading level="h1">Cloud-Abo: {{ subscriptionPlanLabel() }}</Heading>
                        <Text class="mt-2" muted>
                            Gemietete Cloud – Kunde: {{ subscription.user?.name ?? '–' }}
                        </Text>
                    </div>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Abo-Übersicht</CardTitle>
                    <CardDescription>Kunde, Plan, Status, Laufzeit, Ressourcen</CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                    <div class="grid gap-4 sm:grid-cols-2">
                        <div>
                            <Text variant="small" muted>Kunde</Text>
                            <div v-if="subscription.user" class="font-medium">{{ subscription.user.name }}</div>
                            <div v-if="subscription.user" class="text-sm text-muted-foreground">{{ subscription.user.email }}</div>
                            <span v-else class="text-muted-foreground">–</span>
                        </div>
                        <div>
                            <Text variant="small" muted>Aktueller Plan</Text>
                            <p class="font-medium">{{ subscriptionPlanLabel() }}</p>
                        </div>
                        <div>
                            <Text variant="small" muted>Status</Text>
                            <Badge variant="secondary">{{ subscription.status }}</Badge>
                        </div>
                        <div>
                            <Text variant="small" muted>Abo-Ende</Text>
                            <p>{{ formatDate(subscription.current_period_ends_at) }}</p>
                        </div>
                        <div v-if="subscription.display_price !== null && subscription.display_price !== undefined">
                            <Text variant="small" muted>Preis (monatlich)</Text>
                            <p class="font-medium">{{ subscription.display_price }} €</p>
                        </div>
                    </div>
                    <div>
                        <Text variant="small" muted>Ressourcen (genutzt / verfügbar)</Text>
                        <p class="mt-1 text-sm">
                            {{ subscription.used_cpu }} / {{ subscription.max_cpu }} % CPU
                            ·
                            {{ (subscription.used_memory_mb / 1024).toFixed(1) }} / {{ (subscription.max_memory_mb / 1024).toFixed(1) }} GB RAM
                            ·
                            {{ (subscription.used_disk_mb / 1024).toFixed(1) }} / {{ subscription.max_disk_gb }} GB Disk
                        </p>
                        <p class="text-xs text-muted-foreground">
                            Verbleibend: {{ subscription.remaining_cpu }} % CPU, {{ Math.round(subscription.remaining_memory_mb / 1024) }} GB RAM, {{ Math.round(subscription.remaining_disk_mb / 1024) }} GB Disk
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Leistung anpassen</CardTitle>
                    <CardDescription>
                        Cloud-Plan wechseln oder „Benutzer definiert“ mit eigenen Ressourcen und Preis
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form @submit.prevent="submitPlanChange" class="space-y-4">
                        <div class="flex flex-wrap items-end gap-4">
                            <div class="min-w-[220px] space-y-2">
                                <Label for="plan">Plan / Anzeige</Label>
                                <select
                                    id="plan"
                                    :value="planSelectValue"
                                    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    :aria-invalid="!!planForm.errors.gameserver_cloud_plan_id"
                                    @change="onPlanSelectChange(($event.target as HTMLSelectElement).value)"
                                >
                                    <option value="user_defined">Benutzer definiert</option>
                                    <option
                                        v-for="p in gameserverCloudPlans"
                                        :key="p.id"
                                        :value="p.id"
                                    >
                                        {{ p.name }}
                                    </option>
                                </select>
                                <InputError :message="planForm.errors.gameserver_cloud_plan_id" />
                            </div>
                            <Button type="submit" :disabled="planForm.processing">
                                {{ planForm.processing ? 'Wird gespeichert…' : 'Übernehmen' }}
                            </Button>
                        </div>
                        <div
                            v-if="planForm.plan_display_user_defined"
                            class="grid gap-4 rounded-lg border border-border bg-muted/30 p-4 sm:grid-cols-2 lg:grid-cols-5"
                        >
                            <div class="space-y-2">
                                <Label for="custom_max_cpu">CPU (%)</Label>
                                <Input
                                    id="custom_max_cpu"
                                    v-model.number="planForm.custom_max_cpu"
                                    type="number"
                                    min="0"
                                    placeholder="z. B. 200"
                                    :aria-invalid="!!planForm.errors.custom_max_cpu"
                                />
                                <InputError :message="planForm.errors.custom_max_cpu" />
                            </div>
                            <div class="space-y-2">
                                <Label for="custom_max_memory_mb">RAM (MB)</Label>
                                <Input
                                    id="custom_max_memory_mb"
                                    v-model.number="planForm.custom_max_memory_mb"
                                    type="number"
                                    min="0"
                                    placeholder="z. B. 4096"
                                    :aria-invalid="!!planForm.errors.custom_max_memory_mb"
                                />
                                <InputError :message="planForm.errors.custom_max_memory_mb" />
                            </div>
                            <div class="space-y-2">
                                <Label for="custom_max_disk_gb">Disk (GB)</Label>
                                <Input
                                    id="custom_max_disk_gb"
                                    v-model.number="planForm.custom_max_disk_gb"
                                    type="number"
                                    min="0"
                                    placeholder="z. B. 20"
                                    :aria-invalid="!!planForm.errors.custom_max_disk_gb"
                                />
                                <InputError :message="planForm.errors.custom_max_disk_gb" />
                            </div>
                            <div class="space-y-2">
                                <Label for="custom_price">Preis (€/Monat)</Label>
                                <Input
                                    id="custom_price"
                                    v-model.number="planForm.custom_price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="z. B. 29.99"
                                    :aria-invalid="!!planForm.errors.custom_price"
                                />
                                <InputError :message="planForm.errors.custom_price" />
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Laufzeit &amp; Status (Admin)</CardTitle>
                    <CardDescription>
                        Abo-Ende, Status und Kündigung zum Periodenende anpassen
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form @submit.prevent="submitPeriodAndStatus" class="space-y-4">
                        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div class="space-y-2">
                                <Label for="current_period_ends_at">Abo-Ende (Datum)</Label>
                                <Input
                                    id="current_period_ends_at"
                                    v-model="periodAndStatusForm.current_period_ends_at"
                                    type="date"
                                    :aria-invalid="!!periodAndStatusForm.errors.current_period_ends_at"
                                />
                                <InputError :message="periodAndStatusForm.errors.current_period_ends_at" />
                            </div>
                            <div class="space-y-2">
                                <Label for="status">Status</Label>
                                <select
                                    id="status"
                                    v-model="periodAndStatusForm.status"
                                    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    :aria-invalid="!!periodAndStatusForm.errors.status"
                                >
                                    <option value="active">Aktiv</option>
                                    <option value="suspended">Gesperrt</option>
                                    <option value="cancelled">Gekündigt</option>
                                </select>
                                <InputError :message="periodAndStatusForm.errors.status" />
                            </div>
                            <div class="flex items-end pb-2">
                                <label class="flex cursor-pointer items-center gap-2">
                                    <input
                                        v-model="periodAndStatusForm.cancel_at_period_end"
                                        type="checkbox"
                                        class="h-4 w-4 rounded border-input"
                                    />
                                    <span class="text-sm">Kündigung zum Periodenende</span>
                                </label>
                            </div>
                            <div class="flex items-end pb-2">
                                <Button type="submit" :disabled="periodAndStatusForm.processing">
                                    {{ periodAndStatusForm.processing ? 'Wird gespeichert…' : 'Speichern' }}
                                </Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Server auf dieser Cloud</CardTitle>
                    <CardDescription>Game-Server, die zu diesem Abo gehören</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Plan</TableHead>
                                <TableHead>Identifier</TableHead>
                                <TableHead>CPU</TableHead>
                                <TableHead>RAM</TableHead>
                                <TableHead>Disk</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead class="text-right">Aktionen</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow
                                v-for="acc in gameServerAccounts"
                                :key="acc.id"
                            >
                                <TableCell class="font-medium">{{ acc.name }}</TableCell>
                                <TableCell>
                                    <span :class="acc.allocation_manually_set ? 'font-medium text-primary' : ''">
                                        {{ planLabel(acc) }}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <code
                                        v-if="acc.identifier"
                                        class="rounded bg-muted px-2 py-1 text-sm"
                                    >
                                        {{ acc.identifier }}
                                    </code>
                                    <span v-else class="text-muted-foreground">–</span>
                                </TableCell>
                                <TableCell>{{ acc.allocation?.cpu ?? '–' }} %</TableCell>
                                <TableCell>{{ acc.allocation?.memory_mb ? (acc.allocation.memory_mb / 1024).toFixed(1) + ' GB' : '–' }}</TableCell>
                                <TableCell>{{ acc.allocation?.disk_mb ? (acc.allocation.disk_mb / 1024).toFixed(1) + ' GB' : '–' }}</TableCell>
                                <TableCell>
                                    <Badge variant="secondary">{{ acc.status }}</Badge>
                                </TableCell>
                                <TableCell class="text-right">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        title="Ressourcen anpassen"
                                        @click="openResourcesDialog(acc)"
                                    >
                                        <Pencil class="h-4 w-4" />
                                    </Button>
                                    <Link :href="`/admin/gaming-accounts/${acc.id}`">
                                        <Button variant="ghost" size="sm" title="Ansehen">
                                            <Eye class="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                            <TableRow v-if="gameServerAccounts.length === 0">
                                <TableCell
                                    colspan="8"
                                    class="text-center text-muted-foreground"
                                >
                                    Keine Server in dieser Cloud
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog v-model:open="resourcesDialogOpen">
                <DialogContent class="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Ressourcen anpassen</DialogTitle>
                        <DialogDescription>
                            CPU, RAM und Disk für
                            {{ editingAccount?.name ?? 'Server' }}
                            anpassen. Danach wird bei Plan „Benutzer definiert“ angezeigt.
                        </DialogDescription>
                    </DialogHeader>
                    <form @submit.prevent="submitResources" class="space-y-4">
                        <div class="grid gap-4 sm:grid-cols-3">
                            <div class="space-y-2">
                                <Label for="resources_cpu">CPU (%)</Label>
                                <Input
                                    id="resources_cpu"
                                    v-model.number="resourcesForm.cpu"
                                    type="number"
                                    min="0"
                                    step="1"
                                    :aria-invalid="!!resourcesForm.errors.cpu"
                                />
                                <InputError :message="resourcesForm.errors.cpu" />
                            </div>
                            <div class="space-y-2">
                                <Label for="resources_memory_mb">RAM (MB)</Label>
                                <Input
                                    id="resources_memory_mb"
                                    v-model.number="resourcesForm.memory_mb"
                                    type="number"
                                    min="64"
                                    step="64"
                                    :aria-invalid="!!resourcesForm.errors.memory_mb"
                                />
                                <InputError :message="resourcesForm.errors.memory_mb" />
                            </div>
                            <div class="space-y-2">
                                <Label for="resources_disk_mb">Disk (MB)</Label>
                                <Input
                                    id="resources_disk_mb"
                                    v-model.number="resourcesForm.disk_mb"
                                    type="number"
                                    min="256"
                                    step="256"
                                    :aria-invalid="!!resourcesForm.errors.disk_mb"
                                />
                                <InputError :message="resourcesForm.errors.disk_mb" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                @click="resourcesDialogOpen = false"
                            >
                                Abbrechen
                            </Button>
                            <Button type="submit" :disabled="resourcesForm.processing">
                                {{ resourcesForm.processing ? 'Wird gespeichert…' : 'Speichern' }}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    </AdminLayout>
</template>
