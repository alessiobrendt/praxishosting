<!-- Admin: Game-Server-Account bearbeiten -->
<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import {
    BRow,
    BCol,
    BCard,
    BCardHeader,
    BCardTitle,
    BCardBody,
    BCardFooter,
    BForm,
    BFormGroup,
    BFormInput,
    BFormSelect,
    BButton,
} from 'bootstrap-vue-next';
import AdminLayout from '@/layouts/AdminLayout.vue';
import Icon from '@/components/wrappers/Icon.vue';
import InputError from '@/components/InputError.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type User = { id: number; name: string; email: string };
type HostingPlan = { id: number; name: string };
type HostingServer = { id: number; name: string | null; hostname: string } | null;

type GameServerAccount = {
    id: number;
    uuid: string;
    name: string;
    status: string;
    current_period_ends_at: string | null;
    option_values: Record<string, unknown> | null;
    custom_monthly_price?: number | string | null;
    user: User;
    hosting_plan: HostingPlan | null;
    hosting_server: HostingServer;
};

type PlanOption = { id: string; name: string; type?: string; min?: number; max?: number; unit?: string };
type HostingPlanConfig = {
    plan_options?: PlanOption[];
    memory?: number;
    disk?: number;
    swap?: number;
    io?: number;
    cpu?: number;
    databases?: number;
    backups?: number;
};

type Props = {
    gameServerAccount: GameServerAccount;
    hostingPlanConfig: HostingPlanConfig;
    isCloudAccount?: boolean;
};

const props = withDefaults(defineProps<Props>(), { isCloudAccount: false });

const config = props.hostingPlanConfig ?? {};
const opt = props.gameServerAccount.option_values ?? {};
const num = (v: unknown, def: number) => (v != null && v !== '' ? Number(v) : def);
const defaultMemory = num(opt.memory, config.memory ?? 512);
const defaultDisk = num(opt.disk, config.disk ?? 5120);
const defaultSwap = num(opt.swap, config.swap ?? 0);
const defaultIo = num(opt.io, config.io ?? 500);
const defaultCpu = num(opt.cpu, config.cpu ?? 0);
const defaultDatabases = num(opt.databases, config.databases ?? 0);
const defaultBackups = num(opt.backups, config.backups ?? 0);

const customPrice = props.gameServerAccount.custom_monthly_price;
const customPriceStr =
    customPrice === null || customPrice === undefined || customPrice === ''
        ? ''
        : String(customPrice);

const form = useForm({
    name: props.gameServerAccount.name,
    status: props.gameServerAccount.status || 'active',
    current_period_ends_at: props.gameServerAccount.current_period_ends_at
        ? new Date(props.gameServerAccount.current_period_ends_at).toISOString().slice(0, 10)
        : '',
    custom_monthly_price: customPriceStr,
    option_values: {
        memory: defaultMemory,
        disk: defaultDisk,
        swap: defaultSwap,
        io: defaultIo,
        cpu: defaultCpu,
        databases: defaultDatabases,
        backups: defaultBackups,
    },
});

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Game-Server-Accounts', href: '/admin/gaming-accounts' },
    { title: props.gameServerAccount.name, href: `/admin/gaming-accounts/${props.gameServerAccount.uuid}` },
    { title: 'Bearbeiten', href: '#' },
];

const statusOptions = [
    { value: 'active', text: 'Aktiv' },
    { value: 'suspended', text: 'Gesperrt (suspended)' },
    { value: 'pending', text: 'Ausstehend (pending)' },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head :title="`Game-Server bearbeiten: ${gameServerAccount.name}`" />

        <BRow>
            <BCol cols="12" lg="10" xl="8">
                <div class="mb-3">
                    <h4 class="mb-1">Game-Server-Account bearbeiten</h4>
                    <p class="text-muted small mb-0">
                        {{ gameServerAccount.name }} – Kunde: {{ gameServerAccount.user.name }}
                    </p>
                </div>

                <BCard no-body>
                    <BCardHeader>
                        <BCardTitle class="mb-0">Stammdaten</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">
                            Name, Status, Laufzeit, manueller Monatspreis und Pterodactyl-Limits (RAM, Disk, …).
                        </p>
                    </BCardHeader>
                    <BForm @submit.prevent="form.put(`/admin/gaming-accounts/${gameServerAccount.uuid}`)">
                        <BCardBody>
                            <BFormGroup label="Server-Name *" label-for="name">
                                <BFormInput
                                    id="name"
                                    v-model="form.name"
                                    type="text"
                                    required
                                    maxlength="255"
                                    :aria-invalid="!!form.errors.name"
                                />
                                <InputError :message="form.errors.name" />
                            </BFormGroup>
                            <BFormGroup label="Status *" label-for="status">
                                <BFormSelect
                                    id="status"
                                    v-model="form.status"
                                    required
                                    :options="statusOptions"
                                    :aria-invalid="!!form.errors.status"
                                />
                                <InputError :message="form.errors.status" />
                            </BFormGroup>
                            <template v-if="!isCloudAccount">
                                <BFormGroup label="Abo-Ende (Laufzeit)" label-for="current_period_ends_at">
                                    <BFormInput
                                        id="current_period_ends_at"
                                        v-model="form.current_period_ends_at"
                                        type="date"
                                        :aria-invalid="!!form.errors.current_period_ends_at"
                                    />
                                    <InputError :message="form.errors.current_period_ends_at" />
                                </BFormGroup>
                                <BFormGroup label="Manueller Monatspreis (€)" label-for="custom_monthly_price">
                                    <BFormInput
                                        id="custom_monthly_price"
                                        v-model="form.custom_monthly_price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder="Leer = aus Plan + Optionen"
                                        :aria-invalid="!!form.errors.custom_monthly_price"
                                    />
                                    <p class="text-muted small mb-0 mt-1">
                                        Optional. Wenn gesetzt, wird dieser Betrag für Abo/Verlängerung verwendet.
                                    </p>
                                    <InputError :message="form.errors.custom_monthly_price" />
                                </BFormGroup>
                            </template>
                            <p v-else class="text-muted small">
                                Cloud-Server: Laufzeit und Preis werden über das Cloud-Abo verwaltet.
                            </p>

                            <div class="border-top pt-3 mt-3">
                                <p class="fw-medium mb-1">Pterodactyl-Limits (Upgrade)</p>
                                <p class="text-muted small mb-3">
                                    Änderungen werden im Pterodactyl-Panel übernommen.
                                </p>
                                <BRow>
                                    <BCol sm="6" class="mb-3">
                                        <BFormGroup label="RAM (MB)" label-for="opt_memory">
                                            <BFormInput
                                                id="opt_memory"
                                                v-model.number="form.option_values.memory"
                                                type="number"
                                                min="0"
                                                :aria-invalid="!!form.errors['option_values.memory']"
                                            />
                                            <InputError :message="form.errors['option_values.memory']" />
                                        </BFormGroup>
                                    </BCol>
                                    <BCol sm="6" class="mb-3">
                                        <BFormGroup label="Disk (MB)" label-for="opt_disk">
                                            <BFormInput
                                                id="opt_disk"
                                                v-model.number="form.option_values.disk"
                                                type="number"
                                                min="0"
                                                :aria-invalid="!!form.errors['option_values.disk']"
                                            />
                                            <InputError :message="form.errors['option_values.disk']" />
                                        </BFormGroup>
                                    </BCol>
                                    <BCol sm="6" class="mb-3">
                                        <BFormGroup label="Swap (MB)" label-for="opt_swap">
                                            <BFormInput
                                                id="opt_swap"
                                                v-model.number="form.option_values.swap"
                                                type="number"
                                                min="0"
                                                :aria-invalid="!!form.errors['option_values.swap']"
                                            />
                                            <InputError :message="form.errors['option_values.swap']" />
                                        </BFormGroup>
                                    </BCol>
                                    <BCol sm="6" class="mb-3">
                                        <BFormGroup label="IO" label-for="opt_io">
                                            <BFormInput
                                                id="opt_io"
                                                v-model.number="form.option_values.io"
                                                type="number"
                                                min="0"
                                                :aria-invalid="!!form.errors['option_values.io']"
                                            />
                                            <InputError :message="form.errors['option_values.io']" />
                                        </BFormGroup>
                                    </BCol>
                                    <BCol sm="6" class="mb-3">
                                        <BFormGroup label="CPU (%)" label-for="opt_cpu">
                                            <BFormInput
                                                id="opt_cpu"
                                                v-model.number="form.option_values.cpu"
                                                type="number"
                                                min="0"
                                                :aria-invalid="!!form.errors['option_values.cpu']"
                                            />
                                            <InputError :message="form.errors['option_values.cpu']" />
                                        </BFormGroup>
                                    </BCol>
                                    <BCol sm="6" class="mb-3">
                                        <BFormGroup label="Datenbanken" label-for="opt_databases">
                                            <BFormInput
                                                id="opt_databases"
                                                v-model.number="form.option_values.databases"
                                                type="number"
                                                min="0"
                                                :aria-invalid="!!form.errors['option_values.databases']"
                                            />
                                            <InputError :message="form.errors['option_values.databases']" />
                                        </BFormGroup>
                                    </BCol>
                                    <BCol sm="6" class="mb-3">
                                        <BFormGroup label="Backups" label-for="opt_backups">
                                            <BFormInput
                                                id="opt_backups"
                                                v-model.number="form.option_values.backups"
                                                type="number"
                                                min="0"
                                                :aria-invalid="!!form.errors['option_values.backups']"
                                            />
                                            <InputError :message="form.errors['option_values.backups']" />
                                        </BFormGroup>
                                    </BCol>
                                </BRow>
                            </div>
                        </BCardBody>
                        <BCardFooter class="d-flex gap-2">
                            <BButton type="submit" variant="primary" :disabled="form.processing">
                                <Icon icon="pencil" class="me-2" />
                                {{ form.processing ? 'Speichern …' : 'Speichern' }}
                            </BButton>
                            <Link :href="`/admin/gaming-accounts/${gameServerAccount.uuid}`">
                                <BButton type="button" variant="outline-secondary">Abbrechen</BButton>
                            </Link>
                        </BCardFooter>
                    </BForm>
                </BCard>
            </BCol>
        </BRow>
    </AdminLayout>
</template>
