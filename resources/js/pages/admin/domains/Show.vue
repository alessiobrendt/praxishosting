<!-- Admin: Domain anzeigen -->
<script setup lang="ts">
import { Head, Link, router, useForm } from '@inertiajs/vue3';
import { ref, onMounted } from 'vue';
import {
    BRow,
    BCol,
    BCard,
    BCardHeader,
    BCardTitle,
    BCardBody,
    BForm,
    BFormGroup,
    BFormInput,
    BFormSelect,
    BButton,
    BBadge,
    BModal,
} from 'bootstrap-vue-next';
import InputError from '@/components/InputError.vue';
import { pushAdminRecent } from '@/composables/useAdminRecent';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type User = {
    id: number;
    name: string;
    email: string;
} | null;

type Domain = {
    id: number;
    uuid: string;
    domain: string;
    user_id: number | null;
    skrime_id: string | null;
    status: string;
    registered_at: string | null;
    expires_at: string | null;
    auto_renew: boolean;
    purchase_price: string | null;
    sale_price: string | null;
    profit_margin: number;
    tld: string | null;
    nameservers: string[];
    user?: User;
};

type Customer = {
    id: number;
    name: string;
    email: string;
};

type Props = {
    domain: Domain;
    customers: Customer[];
};

const props = defineProps<Props>();
const { domain, customers } = props;

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Domains', href: '/admin/domains' },
    { title: props.domain.domain, href: '#' },
];

const customerForm = useForm({
    user_id: props.domain.user_id ?? '',
});

const nameserverForm = useForm({
    nameservers: props.domain.nameservers?.length
        ? [...props.domain.nameservers]
        : ['', ''],
});

const authcodeDialogOpen = ref(false);
const authcodeValue = ref('');
const authcodeLoading = ref(false);
const authcodeError = ref('');

const customerOptions = [
    { value: '', text: '– Kein Kunde –' },
    ...customers.map((c) => ({ value: String(c.id), text: `${c.name} (${c.email})` })),
];

const submitCustomer = () => {
    customerForm.put(`/admin/domains/${props.domain.uuid}/customer`, {
        preserveScroll: true,
    });
};

const renew = () => {
    router.post(`/admin/domains/${props.domain.uuid}/renew`);
};

const setAutoRenew = (enabled: boolean) => {
    router.post(`/admin/domains/${props.domain.uuid}/autorenew`, { auto_renew: enabled });
};

const fetchAuthcode = async () => {
    authcodeLoading.value = true;
    authcodeError.value = '';
    authcodeValue.value = '';
    authcodeDialogOpen.value = true;
    try {
        const res = await fetch(`/admin/domains/${props.domain.uuid}/authcode`);
        const data = await res.json();
        if (!res.ok) {
            authcodeError.value = data.error ?? 'Unbekannter Fehler';
            return;
        }
        authcodeValue.value = data.authcode ?? '';
    } catch (e) {
        authcodeError.value = e instanceof Error ? e.message : 'Fehler beim Laden';
    } finally {
        authcodeLoading.value = false;
    }
};

const cancelDomain = () => {
    if (confirm('Domain wirklich als gekündigt markieren?')) {
        router.post(`/admin/domains/${props.domain.id}/cancel`);
    }
};

const submitNameserver = () => {
    const ns = nameserverForm.nameservers.filter(Boolean);
    if (ns.length < 2 || ns.length > 6) {
        nameserverForm.setError('nameservers', 'Es sind 2 bis 6 Nameserver erforderlich.');
        return;
    }
    nameserverForm.nameservers = ns;
    nameserverForm.put(`/admin/domains/${props.domain.uuid}/nameserver`, {
        preserveScroll: true,
    });
};

const addNameserverSlot = () => {
    if (nameserverForm.nameservers.length < 6) {
        nameserverForm.nameservers.push('');
    }
};

const removeNameserverSlot = (index: number) => {
    if (nameserverForm.nameservers.length > 2) {
        nameserverForm.nameservers.splice(index, 1);
    }
};

onMounted(() => {
    pushAdminRecent({
        type: 'domain',
        id: props.domain.uuid,
        label: props.domain.domain,
        url: `/admin/domains/${props.domain.uuid}`,
    });
});
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head :title="`Domain: ${domain.domain}`" />

        <BRow>
            <BCol>
                <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                    <div>
                        <h4 class="mb-1">{{ domain.domain }}</h4>
                        <p class="text-muted small mb-0">
                            Skrime-ID: {{ domain.skrime_id ?? '–' }} · Status:
                            <BBadge :variant="domain.status === 'active' ? 'success' : 'secondary'">
                                {{ domain.status }}
                            </BBadge>
                        </p>
                    </div>
                    <div class="d-flex flex-wrap gap-2">
                        <BButton
                            v-if="domain.skrime_id"
                            variant="outline-primary"
                            @click="renew"
                        >
                            Verlängern
                        </BButton>
                        <BButton
                            v-if="domain.skrime_id"
                            :variant="domain.auto_renew ? 'secondary' : 'outline-primary'"
                            @click="setAutoRenew(!domain.auto_renew)"
                        >
                            {{ domain.auto_renew ? 'Auto-Renew aus' : 'Auto-Renew an' }}
                        </BButton>
                        <BButton variant="outline-primary" @click="fetchAuthcode">
                            Auth-Code anzeigen
                        </BButton>
                        <BButton
                            v-if="domain.status === 'active'"
                            variant="danger"
                            @click="cancelDomain"
                        >
                            Kündigen
                        </BButton>
                    </div>
                </div>

                <BCard no-body class="mb-3">
                    <BCardHeader>
                        <BCardTitle class="mb-0">Domain-Daten</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">Registrierung, Ablauf, Preise</p>
                    </BCardHeader>
                    <BCardBody>
                        <p class="mb-1"><span class="fw-medium">Registriert:</span> {{ domain.registered_at ?? '–' }}</p>
                        <p class="mb-1"><span class="fw-medium">Ablaufdatum:</span> {{ domain.expires_at ?? '–' }}</p>
                        <p class="mb-1"><span class="fw-medium">Auto-Renew:</span> {{ domain.auto_renew ? 'Ja' : 'Nein' }}</p>
                        <p class="mb-1"><span class="fw-medium">Einkaufspreis:</span> {{ domain.purchase_price != null ? `${domain.purchase_price} €` : '–' }}</p>
                        <p class="mb-1"><span class="fw-medium">Verkaufspreis:</span> {{ domain.sale_price != null ? `${domain.sale_price} €` : '–' }}</p>
                        <p class="mb-0"><span class="fw-medium">Gewinn:</span> {{ domain.profit_margin != null ? `${domain.profit_margin} €` : '–' }}</p>
                    </BCardBody>
                </BCard>

                <BCard no-body class="mb-3">
                    <BCardHeader>
                        <BCardTitle class="mb-0">Kunde zuweisen</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">Domain einem Kunden zuordnen oder Zuweisung aufheben</p>
                    </BCardHeader>
                    <BCardBody>
                        <BForm @submit.prevent="submitCustomer" class="d-flex flex-wrap align-items-end gap-3">
                            <BFormGroup label="Kunde" class="mb-0 flex-grow-1" style="min-width: 12rem">
                                <BFormSelect
                                    id="user_id"
                                    v-model="customerForm.user_id"
                                    :options="customerOptions"
                                    :aria-invalid="!!customerForm.errors.user_id"
                                />
                                <InputError :message="customerForm.errors.user_id" />
                            </BFormGroup>
                            <BButton type="submit" variant="primary" :disabled="customerForm.processing">
                                Zuweisen
                            </BButton>
                        </BForm>
                        <p v-if="domain.user" class="text-muted small mb-0 mt-2">
                            Aktuell: {{ domain.user.name }} ({{ domain.user.email }})
                        </p>
                    </BCardBody>
                </BCard>

                <BCard no-body class="mb-3">
                    <BCardHeader>
                        <BCardTitle class="mb-0">Nameserver</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">2–6 Nameserver (Skrime-Standard oder eigene)</p>
                    </BCardHeader>
                    <BCardBody>
                        <BForm @submit.prevent="submitNameserver">
                            <div
                                v-for="(ns, idx) in nameserverForm.nameservers"
                                :key="idx"
                                class="d-flex gap-2 align-items-center mb-2"
                            >
                                <BFormInput
                                    v-model="nameserverForm.nameservers[idx]"
                                    placeholder="ns.example.com"
                                    class="flex-grow-1"
                                />
                                <BButton
                                    v-if="nameserverForm.nameservers.length > 2"
                                    type="button"
                                    variant="outline-danger"
                                    size="sm"
                                    @click="removeNameserverSlot(idx)"
                                >
                                    Entfernen
                                </BButton>
                            </div>
                            <div class="d-flex gap-2">
                                <BButton
                                    v-if="nameserverForm.nameservers.length < 6"
                                    type="button"
                                    variant="outline-primary"
                                    size="sm"
                                    @click="addNameserverSlot"
                                >
                                    + Nameserver
                                </BButton>
                                <BButton type="submit" variant="primary" :disabled="nameserverForm.processing">
                                    Nameserver speichern
                                </BButton>
                            </div>
                            <InputError :message="nameserverForm.errors.nameservers" />
                        </BForm>
                    </BCardBody>
                </BCard>

                <BCard v-if="domain.skrime_id" no-body>
                    <BCardHeader>
                        <BCardTitle class="mb-0">DNS verwalten</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">A-, AAAA-, MX-, TXT-, CNAME-Records etc.</p>
                    </BCardHeader>
                    <BCardBody>
                        <Link :href="`/admin/domains/${domain.uuid}/dns`">
                            <BButton variant="outline-primary">DNS-Zone bearbeiten</BButton>
                        </Link>
                    </BCardBody>
                </BCard>
            </BCol>
        </BRow>

        <BModal
            v-model="authcodeDialogOpen"
            title="Auth-Code (Transfer)"
            hide-footer
        >
            <p class="text-muted small mb-3">
                Dieser Code wird beim Domain-Transfer beim neuen Anbieter benötigt.
            </p>
            <div v-if="authcodeLoading" class="py-4 text-center text-muted">Laden …</div>
            <div v-else-if="authcodeError" class="py-4 text-danger">{{ authcodeError }}</div>
            <div v-else class="py-4">
                <p class="font-monospace fs-6 text-break mb-0">{{ authcodeValue || '–' }}</p>
            </div>
            <div class="d-flex justify-content-end">
                <BButton variant="outline-secondary" @click="authcodeDialogOpen = false">Schließen</BButton>
            </div>
        </BModal>
    </AdminLayout>
</template>
