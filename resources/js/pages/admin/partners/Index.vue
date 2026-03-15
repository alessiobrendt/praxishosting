<!-- Admin: Partner-Übersicht -->
<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3';
import {
    BRow,
    BCol,
    BCard,
    BCardBody,
    BCardHeader,
    BCardTitle,
    BTable,
    BButton,
    BBadge,
} from 'bootstrap-vue-next';
import AdminLayout from '@/layouts/AdminLayout.vue';
import Icon from '@/components/wrappers/Icon.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type Brand = { id: number; key: string; name: string };
type User = { id: number; name: string; email: string } | null;
type Partner = {
    id: number;
    name: string;
    description: string | null;
    image_path: string | null;
    discount_percent: string;
    expires_at: string | null;
    is_active: boolean;
    brand: Brand;
    user: User;
};

type Props = {
    partners: {
        data: Partner[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    brands: Brand[];
};

defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Partner', href: '#' },
];

function destroy(id: number): void {
    if (confirm('Partner wirklich löschen?')) {
        router.delete(`/admin/partners/${id}`);
    }
}

function currentBrandId(): string | number {
    const p = new URLSearchParams(window.location.search).get('brand_id');
    return p ? parseInt(p, 10) : '';
}

function onBrandFilter(e: Event): void {
    const v = (e.target as HTMLSelectElement).value;
    const u = new URL(window.location.href);
    if (v) u.searchParams.set('brand_id', v);
    else u.searchParams.delete('brand_id');
    u.searchParams.set('page', '1');
    window.location.href = u.toString();
}

const tableFields = [
    { key: 'brand_name', label: 'Brand', sortable: false },
    { key: 'name', label: 'Name', sortable: false },
    { key: 'description', label: 'Beschreibung', sortable: false },
    { key: 'discount_percent', label: 'Rabatt %', sortable: false },
    { key: 'user_display', label: 'Nutzer', sortable: false },
    { key: 'expires_at', label: 'Ablauf', sortable: false },
    { key: 'is_active', label: 'Aktiv', sortable: false },
    { key: 'actions', label: 'Aktionen', sortable: false, thClass: 'text-end' },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Partner" />

        <BRow>
            <BCol>
                <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                    <div>
                        <h4 class="mb-1">Partner</h4>
                        <p class="text-muted small mb-0">
                            Partner pro Brand verwalten (Name, Beschreibung, Bild, Nutzer, Rabatt %, Ablauf, Aktiv)
                        </p>
                    </div>
                    <Link href="/admin/partners/create">
                        <BButton variant="primary">
                            <Icon icon="plus" class="me-2" />
                            Neu
                        </BButton>
                    </Link>
                </div>

                <BCard no-body>
                    <BCardHeader>
                        <BCardTitle class="mb-0">Partner</BCardTitle>
                        <p class="text-muted small mb-0 mt-1 d-flex flex-wrap align-items-center gap-2">
                            Filter nach Brand:
                            <select
                                id="filter-brand"
                                class="form-select form-select-sm d-inline-block w-auto"
                                :value="currentBrandId()"
                                @change="onBrandFilter"
                            >
                                <option value="">Alle</option>
                                <option v-for="b in brands" :key="b.id" :value="b.id">{{ b.name }}</option>
                            </select>
                        </p>
                    </BCardHeader>
                    <BCardBody class="p-0">
                        <BTable
                            :items="partners.data"
                            :fields="tableFields"
                            striped
                            responsive
                            class="mb-0"
                            show-empty
                            empty-text="Keine Partner"
                        >
                            <template #cell(brand_name)="row">
                                {{ row.item.brand?.name ?? '–' }}
                            </template>
                            <template #cell(description)="row">
                                <span class="text-truncate d-inline-block" style="max-width: 12rem">
                                    {{ row.item.description || '–' }}
                                </span>
                            </template>
                            <template #cell(user_display)="row">
                                {{ row.item.user ? `${row.item.user.name} (${row.item.user.email})` : '–' }}
                            </template>
                            <template #cell(expires_at)="row">
                                {{ row.item.expires_at ? new Date(row.item.expires_at).toLocaleDateString('de-DE') : '–' }}
                            </template>
                            <template #cell(is_active)="row">
                                <BBadge :variant="row.item.is_active ? 'success' : 'secondary'">
                                    {{ row.item.is_active ? 'Ja' : 'Nein' }}
                                </BBadge>
                            </template>
                            <template #cell(actions)="row">
                                <Link :href="`/admin/partners/${row.item.id}/edit`" class="me-1">
                                    <BButton variant="outline-primary" size="sm">
                                        <Icon icon="pencil" />
                                    </BButton>
                                </Link>
                                <BButton variant="outline-danger" size="sm" @click="destroy(row.item.id)">
                                    <Icon icon="trash" />
                                </BButton>
                            </template>
                        </BTable>
                        <nav v-if="partners.links.length > 3" class="d-flex justify-content-center p-3">
                            <ul class="pagination pagination-sm mb-0">
                                <li
                                    v-for="(link, idx) in partners.links"
                                    :key="idx"
                                    class="page-item"
                                    :class="{ active: link.active, disabled: !link.url }"
                                >
                                    <a v-if="link.url" class="page-link" :href="link.url" v-html="link.label" />
                                    <span v-else class="page-link" v-html="link.label" />
                                </li>
                            </ul>
                        </nav>
                    </BCardBody>
                </BCard>
            </BCol>
        </BRow>
    </AdminLayout>
</template>
