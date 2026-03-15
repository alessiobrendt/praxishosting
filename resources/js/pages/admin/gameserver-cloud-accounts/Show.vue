<!-- Admin: Gameserver-Cloud-Abo (Detail) -->
<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { Head, Link, useForm } from '@inertiajs/vue3';
import {
    BRow,
    BCol,
    BCard,
    BCardHeader,
    BCardTitle,
    BCardBody,
    BTable,
    BButton,
    BBadge,
    BForm,
    BFormGroup,
    BFormInput,
    BFormSelect,
    BFormCheckbox,
    BModal,
} from 'bootstrap-vue-next';
import AdminLayout from '@/layouts/AdminLayout.vue';
import Icon from '@/components/wrappers/Icon.vue';
import InputError from '@/components/InputError.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type User = { id: number; name: string; email: string } | null;
type GameserverCloudPlanSummary = { id: number; name: string; config?: Record<string, number> };

type Subscription = {
    id: number;
    uuid: string;
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
    uuid: string;
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
    planForm.transform(() => payload).put(`/admin/gameserver-cloud-accounts/${props.subscription.uuid}`, {
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
        `/admin/gameserver-cloud-accounts/${props.subscription.uuid}/period-and-status`,
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
        `/admin/gameserver-cloud-accounts/${props.subscription.uuid}/servers/${acc.uuid}/resources`,
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

const planSelectOptions = computed(() => [
    { value: 'user_defined', text: 'Benutzer definiert' },
    ...props.gameserverCloudPlans.map((p) => ({ value: String(p.id), text: p.name })),
]);

const statusOptions = [
    { value: 'active', text: 'Aktiv' },
    { value: 'suspended', text: 'Gesperrt' },
    { value: 'cancelled', text: 'Gekündigt' },
];

const serversTableFields = [
    { key: 'name', label: 'Name', sortable: false },
    { key: 'plan_display', label: 'Plan', sortable: false },
    { key: 'identifier', label: 'Identifier', sortable: false },
    { key: 'cpu', label: 'CPU', sortable: false },
    { key: 'ram', label: 'RAM', sortable: false },
    { key: 'disk', label: 'Disk', sortable: false },
    { key: 'status', label: 'Status', sortable: false },
    { key: 'actions', label: 'Aktionen', sortable: false, thClass: 'text-end' },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head :title="`Cloud-Abo: ${subscriptionPlanLabel()}`" />

        <BRow>
            <BCol>
                <div class="d-flex align-items-center gap-3 mb-4">
                    <Link href="/admin/gameserver-cloud-accounts">
                        <BButton variant="outline-secondary" size="sm">
                            <Icon icon="arrow-left" class="me-1" />
                            Zurück
                        </BButton>
                    </Link>
                    <div>
                        <h4 class="mb-1">Cloud-Abo: {{ subscriptionPlanLabel() }}</h4>
                        <p class="text-muted small mb-0">
                            Gemietete Cloud – Kunde: {{ subscription.user?.name ?? '–' }}
                        </p>
                    </div>
                </div>

                <BCard no-body class="mb-4">
                    <BCardHeader>
                        <BCardTitle class="mb-0">Abo-Übersicht</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">Kunde, Plan, Status, Laufzeit, Ressourcen</p>
                    </BCardHeader>
                    <BCardBody>
                        <BRow>
                            <BCol sm="6" class="mb-3">
                                <p class="text-muted small mb-1">Kunde</p>
                                <template v-if="subscription.user">
                                    <div class="fw-medium">{{ subscription.user.name }}</div>
                                    <div class="small text-muted">{{ subscription.user.email }}</div>
                                </template>
                                <span v-else class="text-muted">–</span>
                            </BCol>
                            <BCol sm="6" class="mb-3">
                                <p class="text-muted small mb-1">Aktueller Plan</p>
                                <p class="fw-medium mb-0">{{ subscriptionPlanLabel() }}</p>
                            </BCol>
                            <BCol sm="6" class="mb-3">
                                <p class="text-muted small mb-1">Status</p>
                                <BBadge variant="secondary">{{ subscription.status }}</BBadge>
                            </BCol>
                            <BCol sm="6" class="mb-3">
                                <p class="text-muted small mb-1">Abo-Ende</p>
                                <p class="mb-0">{{ formatDate(subscription.current_period_ends_at) }}</p>
                            </BCol>
                            <BCol
                                v-if="subscription.display_price !== null && subscription.display_price !== undefined"
                                sm="6"
                                class="mb-3"
                            >
                                <p class="text-muted small mb-1">Preis (monatlich)</p>
                                <p class="fw-medium mb-0">{{ subscription.display_price }} €</p>
                            </BCol>
                        </BRow>
                        <p class="text-muted small mb-1">Ressourcen (genutzt / verfügbar)</p>
                        <p class="small mb-1">
                            {{ subscription.used_cpu }} / {{ subscription.max_cpu }} % CPU
                            ·
                            {{ (subscription.used_memory_mb / 1024).toFixed(1) }} /
                            {{ (subscription.max_memory_mb / 1024).toFixed(1) }} GB RAM
                            ·
                            {{ (subscription.used_disk_mb / 1024).toFixed(1) }} / {{ subscription.max_disk_gb }} GB Disk
                        </p>
                        <p class="small text-muted mb-0">
                            Verbleibend: {{ subscription.remaining_cpu }} % CPU,
                            {{ Math.round(subscription.remaining_memory_mb / 1024) }} GB RAM,
                            {{ Math.round(subscription.remaining_disk_mb / 1024) }} GB Disk
                        </p>
                    </BCardBody>
                </BCard>

                <BCard no-body class="mb-4">
                    <BCardHeader>
                        <BCardTitle class="mb-0">Leistung anpassen</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">
                            Cloud-Plan wechseln oder „Benutzer definiert“ mit eigenen Ressourcen und Preis
                        </p>
                    </BCardHeader>
                    <BCardBody>
                        <BForm @submit.prevent="submitPlanChange">
                            <div class="d-flex flex-wrap align-items-end gap-3 mb-3">
                                <BFormGroup label="Plan / Anzeige" label-for="plan" class="mb-0" style="min-width: 220px">
                                    <BFormSelect
                                        id="plan"
                                        :model-value="planSelectValue"
                                        :options="planSelectOptions"
                                        :aria-invalid="!!planForm.errors.gameserver_cloud_plan_id"
                                        @update:model-value="onPlanSelectChange"
                                    />
                                    <InputError :message="planForm.errors.gameserver_cloud_plan_id" />
                                </BFormGroup>
                                <BButton type="submit" variant="primary" :disabled="planForm.processing">
                                    {{ planForm.processing ? 'Wird gespeichert…' : 'Übernehmen' }}
                                </BButton>
                            </div>
                            <div
                                v-if="planForm.plan_display_user_defined"
                                class="rounded border border-secondary bg-light p-3 mb-0"
                            >
                                <BRow>
                                    <BCol md="6" lg="2" class="mb-3">
                                        <BFormGroup label="CPU (%)" label-for="custom_max_cpu" class="mb-0">
                                            <BFormInput
                                                id="custom_max_cpu"
                                                v-model.number="planForm.custom_max_cpu"
                                                type="number"
                                                min="0"
                                                placeholder="z. B. 200"
                                                :aria-invalid="!!planForm.errors.custom_max_cpu"
                                            />
                                            <InputError :message="planForm.errors.custom_max_cpu" />
                                        </BFormGroup>
                                    </BCol>
                                    <BCol md="6" lg="2" class="mb-3">
                                        <BFormGroup label="RAM (MB)" label-for="custom_max_memory_mb" class="mb-0">
                                            <BFormInput
                                                id="custom_max_memory_mb"
                                                v-model.number="planForm.custom_max_memory_mb"
                                                type="number"
                                                min="0"
                                                placeholder="z. B. 4096"
                                                :aria-invalid="!!planForm.errors.custom_max_memory_mb"
                                            />
                                            <InputError :message="planForm.errors.custom_max_memory_mb" />
                                        </BFormGroup>
                                    </BCol>
                                    <BCol md="6" lg="2" class="mb-3">
                                        <BFormGroup label="Disk (GB)" label-for="custom_max_disk_gb" class="mb-0">
                                            <BFormInput
                                                id="custom_max_disk_gb"
                                                v-model.number="planForm.custom_max_disk_gb"
                                                type="number"
                                                min="0"
                                                placeholder="z. B. 20"
                                                :aria-invalid="!!planForm.errors.custom_max_disk_gb"
                                            />
                                            <InputError :message="planForm.errors.custom_max_disk_gb" />
                                        </BFormGroup>
                                    </BCol>
                                    <BCol md="6" lg="2" class="mb-3">
                                        <BFormGroup label="Preis (€/Monat)" label-for="custom_price" class="mb-0">
                                            <BFormInput
                                                id="custom_price"
                                                v-model="planForm.custom_price"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                placeholder="z. B. 29.99"
                                                :aria-invalid="!!planForm.errors.custom_price"
                                            />
                                            <InputError :message="planForm.errors.custom_price" />
                                        </BFormGroup>
                                    </BCol>
                                </BRow>
                            </div>
                        </BForm>
                    </BCardBody>
                </BCard>

                <BCard no-body class="mb-4">
                    <BCardHeader>
                        <BCardTitle class="mb-0">Laufzeit &amp; Status (Admin)</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">
                            Abo-Ende, Status und Kündigung zum Periodenende anpassen
                        </p>
                    </BCardHeader>
                    <BCardBody>
                        <BForm @submit.prevent="submitPeriodAndStatus">
                            <BRow class="align-items-end">
                                <BCol md="6" lg="3" class="mb-3">
                                    <BFormGroup label="Abo-Ende (Datum)" label-for="current_period_ends_at" class="mb-0">
                                        <BFormInput
                                            id="current_period_ends_at"
                                            v-model="periodAndStatusForm.current_period_ends_at"
                                            type="date"
                                            :aria-invalid="!!periodAndStatusForm.errors.current_period_ends_at"
                                        />
                                        <InputError :message="periodAndStatusForm.errors.current_period_ends_at" />
                                    </BFormGroup>
                                </BCol>
                                <BCol md="6" lg="3" class="mb-3">
                                    <BFormGroup label="Status" label-for="status" class="mb-0">
                                        <BFormSelect
                                            id="status"
                                            v-model="periodAndStatusForm.status"
                                            :options="statusOptions"
                                            :aria-invalid="!!periodAndStatusForm.errors.status"
                                        />
                                        <InputError :message="periodAndStatusForm.errors.status" />
                                    </BFormGroup>
                                </BCol>
                                <BCol md="6" lg="3" class="mb-3">
                                    <BFormGroup class="mb-0">
                                        <BFormCheckbox v-model="periodAndStatusForm.cancel_at_period_end">
                                            Kündigung zum Periodenende
                                        </BFormCheckbox>
                                    </BFormGroup>
                                </BCol>
                                <BCol md="6" lg="3" class="mb-3">
                                    <BButton type="submit" variant="primary" :disabled="periodAndStatusForm.processing">
                                        {{ periodAndStatusForm.processing ? 'Wird gespeichert…' : 'Speichern' }}
                                    </BButton>
                                </BCol>
                            </BRow>
                        </BForm>
                    </BCardBody>
                </BCard>

                <BCard no-body class="mb-4">
                    <BCardHeader>
                        <BCardTitle class="mb-0">Server auf dieser Cloud</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">Game-Server, die zu diesem Abo gehören</p>
                    </BCardHeader>
                    <BCardBody class="p-0">
                        <BTable
                            :items="gameServerAccounts"
                            :fields="serversTableFields"
                            striped
                            responsive
                            class="mb-0"
                            show-empty
                            empty-text="Keine Server in dieser Cloud"
                        >
                            <template #cell(name)="row">
                                <span class="fw-medium">{{ row.item.name }}</span>
                            </template>
                            <template #cell(plan_display)="row">
                                <span
                                    :class="row.item.allocation_manually_set ? 'fw-medium text-primary' : ''"
                                >
                                    {{ planLabel(row.item) }}
                                </span>
                            </template>
                            <template #cell(identifier)="row">
                                <code v-if="row.item.identifier" class="small bg-light px-2 py-1 rounded">
                                    {{ row.item.identifier }}
                                </code>
                                <span v-else class="text-muted">–</span>
                            </template>
                            <template #cell(cpu)="row">
                                {{ row.item.allocation?.cpu ?? '–' }} %
                            </template>
                            <template #cell(ram)="row">
                                {{
                                    row.item.allocation?.memory_mb
                                        ? (row.item.allocation.memory_mb / 1024).toFixed(1) + ' GB'
                                        : '–'
                                }}
                            </template>
                            <template #cell(disk)="row">
                                {{
                                    row.item.allocation?.disk_mb
                                        ? (row.item.allocation.disk_mb / 1024).toFixed(1) + ' GB'
                                        : '–'
                                }}
                            </template>
                            <template #cell(status)="row">
                                <BBadge variant="secondary">{{ row.item.status }}</BBadge>
                            </template>
                            <template #cell(actions)="row">
                                <BButton
                                    variant="outline-primary"
                                    size="sm"
                                    class="me-1"
                                    title="Ressourcen anpassen"
                                    @click="openResourcesDialog(row.item)"
                                >
                                    <Icon icon="pencil" />
                                </BButton>
                                <Link :href="`/admin/gaming-accounts/${row.item.uuid}`">
                                    <BButton variant="outline-secondary" size="sm" title="Ansehen">
                                        <Icon icon="eye" />
                                    </BButton>
                                </Link>
                            </template>
                        </BTable>
                    </BCardBody>
                </BCard>

                <BModal
                    v-model="resourcesDialogOpen"
                    title="Ressourcen anpassen"
                    hide-footer
                    @hidden="editingAccount = null"
                >
                    <p class="text-muted small mb-3">
                        CPU, RAM und Disk für {{ editingAccount?.name ?? 'Server' }} anpassen. Danach wird bei Plan
                        „Benutzer definiert“ angezeigt.
                    </p>
                    <BForm @submit.prevent="submitResources">
                        <BRow>
                            <BCol md="4" class="mb-3">
                                <BFormGroup label="CPU (%)" label-for="resources_cpu">
                                    <BFormInput
                                        id="resources_cpu"
                                        v-model.number="resourcesForm.cpu"
                                        type="number"
                                        min="0"
                                        step="1"
                                        :aria-invalid="!!resourcesForm.errors.cpu"
                                    />
                                    <InputError :message="resourcesForm.errors.cpu" />
                                </BFormGroup>
                            </BCol>
                            <BCol md="4" class="mb-3">
                                <BFormGroup label="RAM (MB)" label-for="resources_memory_mb">
                                    <BFormInput
                                        id="resources_memory_mb"
                                        v-model.number="resourcesForm.memory_mb"
                                        type="number"
                                        min="64"
                                        step="64"
                                        :aria-invalid="!!resourcesForm.errors.memory_mb"
                                    />
                                    <InputError :message="resourcesForm.errors.memory_mb" />
                                </BFormGroup>
                            </BCol>
                            <BCol md="4" class="mb-3">
                                <BFormGroup label="Disk (MB)" label-for="resources_disk_mb">
                                    <BFormInput
                                        id="resources_disk_mb"
                                        v-model.number="resourcesForm.disk_mb"
                                        type="number"
                                        min="256"
                                        step="256"
                                        :aria-invalid="!!resourcesForm.errors.disk_mb"
                                    />
                                    <InputError :message="resourcesForm.errors.disk_mb" />
                                </BFormGroup>
                            </BCol>
                        </BRow>
                        <div class="d-flex justify-content-end gap-2">
                            <BButton type="button" variant="outline-secondary" @click="resourcesDialogOpen = false">
                                Abbrechen
                            </BButton>
                            <BButton type="submit" variant="primary" :disabled="resourcesForm.processing">
                                {{ resourcesForm.processing ? 'Wird gespeichert…' : 'Speichern' }}
                            </BButton>
                        </div>
                    </BForm>
                </BModal>
            </BCol>
        </BRow>
    </AdminLayout>
</template>
