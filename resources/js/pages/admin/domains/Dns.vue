<!-- Admin: DNS-Zone bearbeiten -->
<script setup lang="ts">
import { Head, router, useForm } from '@inertiajs/vue3';
import {
    BRow,
    BCol,
    BCard,
    BCardHeader,
    BCardTitle,
    BCardBody,
    BForm,
    BFormInput,
    BFormSelect,
    BButton,
} from 'bootstrap-vue-next';
import Icon from '@/components/wrappers/Icon.vue';
import InputError from '@/components/InputError.vue';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type DnsRecord = {
    name: string;
    type: string;
    data: string;
};

type Domain = {
    id: number;
    uuid: string;
    domain: string;
};

type Props = {
    domain: Domain;
    records: DnsRecord[];
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Domains', href: '/admin/domains' },
    { title: props.domain.domain, href: `/admin/domains/${props.domain.uuid}` },
    { title: 'DNS', href: '#' },
];

const recordTypes = ['A', 'AAAA', 'CNAME', 'ALIAS', 'MX', 'SRV', 'TXT', 'CAA', 'PTR', 'TLSA', 'DS', 'DNSKEY'];

const recordTypeOptions = recordTypes.map((t) => ({ value: t, text: t }));

const form = useForm({
    records: props.records.length
        ? props.records.map((r) => ({ name: r.name, type: r.type, data: r.data }))
        : [{ name: '@', type: 'A', data: '' }],
});

const addRecord = () => {
    form.records.push({ name: '', type: 'A', data: '' });
};

const removeRecord = (index: number) => {
    form.records.splice(index, 1);
};

const submit = () => {
    const valid = form.records.filter((r) => r.name.trim() && r.data.trim());
    form.records = valid;
    form.put(`/admin/domains/${props.domain.uuid}/dns`, { preserveScroll: true });
};
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head :title="`DNS: ${domain.domain}`" />

        <BRow>
            <BCol>
                <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                    <div>
                        <h4 class="mb-1">DNS-Zone: {{ domain.domain }}</h4>
                        <p class="text-muted small mb-0">
                            Alle Einträge müssen übermittelt werden. Löschen = Eintrag entfernen und speichern.
                        </p>
                    </div>
                    <BButton variant="outline-primary" @click="addRecord">
                        <Icon icon="plus" class="me-2" />
                        Neuer Record
                    </BButton>
                </div>

                <BCard no-body>
                    <BCardHeader>
                        <BCardTitle class="mb-0">DNS-Records</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">Typ, Name, Wert – mind. 2–6 Nameserver bei Skrime konfiguriert lassen</p>
                    </BCardHeader>
                    <BCardBody>
                        <BForm @submit.prevent="submit">
                            <div class="table-responsive">
                                <table class="table table-sm table-bordered mb-3">
                                    <thead>
                                        <tr>
                                            <th>Typ</th>
                                            <th>Name</th>
                                            <th>Wert (Data)</th>
                                            <th class="text-end" style="width: 6rem">Aktion</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(rec, idx) in form.records" :key="idx">
                                            <td>
                                                <BFormSelect
                                                    v-model="form.records[idx].type"
                                                    :options="recordTypeOptions"
                                                    size="sm"
                                                    class="w-100"
                                                />
                                            </td>
                                            <td>
                                                <BFormInput
                                                    v-model="form.records[idx].name"
                                                    size="sm"
                                                    placeholder="@ oder www"
                                                />
                                            </td>
                                            <td>
                                                <BFormInput
                                                    v-model="form.records[idx].data"
                                                    size="sm"
                                                    placeholder="127.0.0.1 oder Ziel"
                                                />
                                            </td>
                                            <td class="text-end">
                                                <BButton
                                                    type="button"
                                                    variant="outline-danger"
                                                    size="sm"
                                                    :disabled="form.records.length <= 1"
                                                    @click="removeRecord(idx)"
                                                    aria-label="Eintrag entfernen"
                                                >
                                                    <Icon icon="trash" />
                                                </BButton>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <InputError :message="form.errors.records" />
                            <div class="d-flex gap-2">
                                <BButton type="submit" variant="primary" :disabled="form.processing">
                                    DNS-Zone speichern
                                </BButton>
                                <BButton
                                    type="button"
                                    variant="outline-secondary"
                                    :disabled="form.processing"
                                    @click="router.visit(`/admin/domains/${domain.uuid}`)"
                                >
                                    Zurück zur Domain
                                </BButton>
                            </div>
                        </BForm>
                    </BCardBody>
                </BCard>
            </BCol>
        </BRow>
    </AdminLayout>
</template>
