<!-- Admin: Marken / Unternehmen -->
<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import {
    BRow,
    BCol,
    BCard,
    BCardBody,
    BButton,
    BBadge,
} from 'bootstrap-vue-next';
import AdminLayout from '@/layouts/AdminLayout.vue';
import Icon from '@/components/wrappers/Icon.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type Brand = {
    id: number;
    key: string;
    name: string;
    is_default: boolean;
    domains: string[] | null;
    logo_url: string | null;
    logo_collapsed_url: string | null;
    theme_colors: Record<string, string> | null;
    features: Record<string, boolean | number> | null;
    salutation: string | null;
    seo: Record<string, string> | null;
};

type Props = {
    brands: Brand[];
};

defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Marken', href: '#' },
];

function firstDomains(domains: string[] | null, max = 2): string[] {
    if (!domains?.length) return [];
    return domains.slice(0, max);
}

function primaryColor(brand: Brand): string {
    return (
        brand.theme_colors?.primary ??
        brand.seo?.theme_color ??
        'var(--bs-primary, #0d6efd)'
    );
}

const FEATURE_LABELS: Record<string, string> = {
    sites_editor: 'Sites',
    webspace: 'Webspace',
    domains_shop: 'Domains',
    ai_tokens: 'AI',
    gaming: 'Gaming',
    prepaid_balance: 'Guthaben',
    balance_topup: 'Aufladung',
};

function activeFeatures(features: Record<string, boolean | number> | null): string[] {
    if (!features) return [];
    return Object.entries(FEATURE_LABELS)
        .filter(([key]) => features[key] === true)
        .map(([, label]) => label);
}

function salutationLabel(salutation: string | null): string {
    return salutation === 'informal' ? 'Du' : 'Sie';
}
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Marken" />

        <BRow>
            <BCol>
                <div class="mb-3">
                    <h4 class="mb-1">Marken / Unternehmen</h4>
                    <p class="text-muted small mb-0">
                        B2B und Privat/Gaming: Name, Domains, Farben, Features und E-Mail pro Marke
                    </p>
                </div>

                <BRow>
                    <BCol v-for="brand in brands" :key="brand.id" md="6" class="mb-4">
                        <Link
                            :href="`/admin/brands/${brand.id}/edit`"
                            class="text-decoration-none text-body d-block h-100"
                        >
                            <BCard
                                no-body
                                class="h-100 border-2 overflow-hidden"
                                :style="{
                                    borderLeftColor: primaryColor(brand),
                                    borderLeftWidth: '4px',
                                }"
                            >
                                <div class="d-flex flex-column flex-sm-row">
                                    <div
                                        class="d-flex align-items-center justify-content-center p-4 flex-shrink-0"
                                        :style="{
                                            backgroundColor: `${primaryColor(brand)}20`,
                                            minWidth: '8rem',
                                        }"
                                    >
                                        <img
                                            v-if="brand.logo_url || brand.logo_collapsed_url"
                                            :src="brand.logo_url || brand.logo_collapsed_url!"
                                            :alt="brand.name"
                                            class="img-fluid"
                                            style="max-height: 5rem; width: auto; object-fit: contain"
                                            loading="lazy"
                                        />
                                        <div
                                            v-else
                                            class="rounded d-flex align-items-center justify-content-center text-white"
                                            style="width: 4rem; height: 4rem"
                                            :style="{ backgroundColor: primaryColor(brand) }"
                                        >
                                            <Icon icon="building-store" class="fs-4" />
                                        </div>
                                        <span
                                            class="rounded-circle border mt-2 d-inline-block"
                                            style="width: 1rem; height: 1rem"
                                            :style="{ backgroundColor: primaryColor(brand) }"
                                            :title="primaryColor(brand)"
                                        />
                                    </div>
                                    <BCardBody class="d-flex flex-column">
                                        <div class="d-flex flex-wrap align-items-center gap-2">
                                            <span class="fs-5 fw-semibold">{{ brand.name }}</span>
                                            <BBadge v-if="brand.is_default" variant="secondary">Standard</BBadge>
                                        </div>
                                        <p class="text-muted small mb-1">{{ brand.key }}</p>
                                        <div
                                            v-if="firstDomains(brand.domains).length"
                                            class="small text-muted d-flex align-items-center gap-1 mb-1"
                                        >
                                            <Icon icon="world" class="flex-shrink-0" />
                                            {{ firstDomains(brand.domains).join(', ') }}
                                            <span v-if="brand.domains && brand.domains.length > 2">
                                                (+{{ brand.domains.length - 2 }} weitere)
                                            </span>
                                        </div>
                                        <div class="small text-muted d-flex align-items-center gap-1 mb-2">
                                            <Icon icon="mail" class="flex-shrink-0" />
                                            Anrede: {{ salutationLabel(brand.salutation) }}
                                        </div>
                                        <div v-if="activeFeatures(brand.features).length" class="d-flex flex-wrap gap-1">
                                            <BBadge
                                                v-for="label in activeFeatures(brand.features)"
                                                :key="label"
                                                variant="secondary"
                                                class="small"
                                            >
                                                {{ label }}
                                            </BBadge>
                                        </div>
                                        <div class="mt-auto pt-2">
                                            <BButton variant="outline-primary" size="sm">
                                                <Icon icon="pencil" class="me-1" />
                                                Bearbeiten
                                            </BButton>
                                        </div>
                                    </BCardBody>
                                </div>
                            </BCard>
                        </Link>
                    </BCol>
                </BRow>
            </BCol>
        </BRow>
    </AdminLayout>
</template>
