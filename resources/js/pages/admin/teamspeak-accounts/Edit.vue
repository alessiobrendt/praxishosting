<!-- Admin: TeamSpeak-Server-Account bearbeiten -->
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
    BFormCheckbox,
    BButton,
} from 'bootstrap-vue-next';
import InputError from '@/components/InputError.vue';
import AdminLayout from '@/layouts/AdminLayout.vue';
import Icon from '@/components/wrappers/Icon.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type User = { id: number; name: string; email: string };
type HostingPlan = { id: number; name: string };
type HostingServer = { id: number; name: string | null; hostname: string } | null;

type TeamSpeakServerAccount = {
    id: number;
    uuid: string;
    name: string;
    port: number | null;
    virtual_server_id: number | null;
    status: string;
    current_period_ends_at: string | null;
    option_values: Record<string, unknown> | null;
    custom_monthly_price?: number | string | null;
    user: User;
    hosting_plan: HostingPlan;
    hosting_server: HostingServer;
};

type Props = {
    teamSpeakServerAccount: TeamSpeakServerAccount;
};

const props = defineProps<Props>();

const slotsDefault = (props.teamSpeakServerAccount.option_values?.slots as number) ?? 32;
const slotsNum = typeof slotsDefault === 'number' ? slotsDefault : parseInt(String(slotsDefault), 10) || 32;

const customPrice = props.teamSpeakServerAccount.custom_monthly_price;
const customPriceStr =
    customPrice === null || customPrice === undefined || customPrice === ''
        ? ''
        : String(customPrice);

const form = useForm({
    name: props.teamSpeakServerAccount.name,
    port: props.teamSpeakServerAccount.port ?? '',
    slots: slotsNum,
    current_period_ends_at: props.teamSpeakServerAccount.current_period_ends_at
        ? new Date(props.teamSpeakServerAccount.current_period_ends_at).toISOString().slice(0, 10)
        : '',
    status: props.teamSpeakServerAccount.status || 'active',
    custom_monthly_price: customPriceStr,
});

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'TeamSpeak-Server-Accounts', href: '/admin/teamspeak-accounts' },
    { title: props.teamSpeakServerAccount.name, href: `/admin/teamspeak-accounts/${props.teamSpeakServerAccount.uuid}` },
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
        <Head :title="`TeamSpeak bearbeiten: ${teamSpeakServerAccount.name}`" />

        <BRow>
            <BCol>
                <div class="mb-3 d-flex align-items-center gap-2">
                    <Icon icon="headphones" class="fs-4 text-primary" />
                    <div>
                        <h4 class="mb-1">TeamSpeak-Account bearbeiten</h4>
                        <p class="text-muted small mb-0">
                            {{ teamSpeakServerAccount.name }} – Kunde: {{ teamSpeakServerAccount.user.name }}
                        </p>
                    </div>
                </div>

                <BCard no-body class="mb-4">
                    <BCardHeader>
                        <BCardTitle class="mb-0">Stammdaten</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">
                            Name, Port (nur in der Datenbank), Slots (wird am TeamSpeak-Server übernommen), Laufzeit und Status.
                        </p>
                    </BCardHeader>
                    <BForm @submit.prevent="form.put(`/admin/teamspeak-accounts/${teamSpeakServerAccount.uuid}`)">
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
                            <BFormGroup label="Port" label-for="port">
                                <BFormInput
                                    id="port"
                                    v-model="form.port"
                                    type="number"
                                    min="1"
                                    max="65535"
                                    placeholder="z. B. 9987"
                                    :aria-invalid="!!form.errors.port"
                                />
                                <p class="text-muted small mb-0 mt-1">Nur in der Datenbank gespeichert. Port-Änderung am TeamSpeak-Host wird hier nicht durchgeführt.</p>
                                <InputError :message="form.errors.port" />
                            </BFormGroup>
                            <BFormGroup label="Slots (Max. Clients) *" label-for="slots">
                                <BFormInput
                                    id="slots"
                                    v-model.number="form.slots"
                                    type="number"
                                    min="1"
                                    max="9999"
                                    required
                                    :aria-invalid="!!form.errors.slots"
                                />
                                <p class="text-muted small mb-0 mt-1">Wird am TeamSpeak-Server übernommen.</p>
                                <InputError :message="form.errors.slots" />
                            </BFormGroup>
                            <BFormGroup label="Abo-Ende (Laufzeit)" label-for="current_period_ends_at">
                                <BFormInput
                                    id="current_period_ends_at"
                                    v-model="form.current_period_ends_at"
                                    type="date"
                                    :aria-invalid="!!form.errors.current_period_ends_at"
                                />
                                <InputError :message="form.errors.current_period_ends_at" />
                            </BFormGroup>
                            <BFormGroup label="Status *" label-for="status">
                                <BFormSelect
                                    id="status"
                                    v-model="form.status"
                                    :options="statusOptions"
                                    required
                                    :aria-invalid="!!form.errors.status"
                                />
                                <InputError :message="form.errors.status" />
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
                                <p class="text-muted small mb-0 mt-1">Optional. Wenn gesetzt, wird dieser Betrag für Abo/Verlängerung verwendet.</p>
                                <InputError :message="form.errors.custom_monthly_price" />
                            </BFormGroup>
                        </BCardBody>
                        <BCardFooter class="d-flex flex-wrap gap-2">
                            <BButton type="submit" variant="primary" :disabled="form.processing">
                                <Icon icon="device-floppy" class="me-1" />
                                {{ form.processing ? 'Speichern …' : 'Speichern' }}
                            </BButton>
                            <Link :href="`/admin/teamspeak-accounts/${teamSpeakServerAccount.uuid}`">
                                <BButton type="button" variant="outline-secondary">Abbrechen</BButton>
                            </Link>
                        </BCardFooter>
                    </BForm>
                </BCard>
            </BCol>
        </BRow>
    </AdminLayout>
</template>
