<!-- Admin: Dashboard mit konfigurierbaren Widgets -->
<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3';
import { ref, computed, onMounted, watch } from 'vue';
import { GridLayout, GridItem } from 'vue-grid-layout-v3';
import { BButton } from 'bootstrap-vue-next';
import DashboardWidgetSlot from '@/components/admin/dashboard/DashboardWidgetSlot.vue';
import WidgetGalleryModal from '@/components/admin/dashboard/WidgetGalleryModal.vue';
import { getAdminRecent } from '@/composables/useAdminRecent';
import type { AdminRecentItem } from '@/composables/useAdminRecent';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { dashboard } from '@/routes';
import adminDashboard from '@/routes/admin/dashboard';
import type { BreadcrumbItem } from '@/types';
import type { LayoutItem, WidgetRegistryItem } from '@/types/admin/dashboard';

type Stats = {
    activeSubscriptions: number;
    sitesTotal: number;
    sitesLegacy: number;
    sitesSuspended: number;
    customersTotal: number;
    revenueToday: number;
    revenueMonth: number;
    revenueYear: number;
    unpaidSum: number;
    overdueCount: number;
    subscriptionsEndingThisWeek: number;
    cancellationsAtPeriodEnd: number;
};

type ActionItems = {
    expiringSubscriptions: Array<{ site_uuid: string | null; site_name: string | null; current_period_ends_at: string | null }>;
    overdueOrFailedInvoices: Array<{ id: number; number: string; user_id: number; user_name: string | null; status: string; due_date: string | null }>;
    openDunningInvoices: Array<{ id: number; number: string; user_id: number; user_name: string | null; max_level: number }>;
};

type Props = {
    layout: LayoutItem[];
    defaultLayout: LayoutItem[];
    widgetRegistry: WidgetRegistryItem[];
    stats: Stats;
    actionItems: ActionItems;
    lastWebhookMinutesAgo?: number | null;
};

const props = defineProps<Props>();

const recentItems = ref<AdminRecentItem[]>([]);
const isEditMode = ref(false);
const layoutLocal = ref<LayoutItem[]>([]);
const galleryOpen = ref(false);
const saving = ref(false);
const saveError = ref<string | null>(null);

onMounted(() => {
    recentItems.value = getAdminRecent();
    layoutLocal.value = [...props.layout];
});

watch(
    () => props.layout,
    (newLayout) => {
        layoutLocal.value = [...newLayout];
    },
    { deep: true },
);

const defaultLayout = computed(() => props.defaultLayout ?? props.layout);

const registryByKey = computed(() => {
    const map: Record<string, WidgetRegistryItem> = {};
    for (const w of props.widgetRegistry) {
        map[w.key] = w;
    }
    return map;
});

function openGallery() {
    galleryOpen.value = true;
}

function closeGallery() {
    galleryOpen.value = false;
}

function addWidget(key: string) {
    const reg = registryByKey.value[key];
    const defaultW = reg?.defaultW ?? 2;
    const defaultH = (reg?.defaultH ?? 1) * 2;
    const maxY = layoutLocal.value.length
        ? Math.max(...layoutLocal.value.map((it) => it.y + it.h), 0)
        : 0;
    const newItem: LayoutItem = {
        i: key,
        x: 0,
        y: maxY,
        w: defaultW,
        h: defaultH,
    };
    layoutLocal.value = [...layoutLocal.value, newItem];
    closeGallery();
}

function onLayoutUpdated(newLayout: LayoutItem[]) {
    layoutLocal.value = newLayout;
}

function _removeWidget(key: string) {
    if (!isEditMode.value) return;
    layoutLocal.value = layoutLocal.value.filter((it) => it.i !== key);
}

function getCsrfToken(): string {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    if (match) {
        try {
            return decodeURIComponent(match[1]);
        } catch {
            return '';
        }
    }
    return '';
}

async function saveLayout() {
    saving.value = true;
    saveError.value = null;
    try {
        const url = adminDashboard.layout.update.url();
        const res = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-XSRF-TOKEN': getCsrfToken(),
            },
            body: JSON.stringify({ layout: layoutLocal.value }),
        });
        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.message ?? res.statusText);
        }
        isEditMode.value = false;
        router.reload();
    } catch (e) {
        saveError.value = e instanceof Error ? e.message : 'Speichern fehlgeschlagen';
    } finally {
        saving.value = false;
    }
}

function resetToDefault() {
    layoutLocal.value = [...defaultLayout.value];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '#' },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Admin Dashboard" />

        <div class="mb-4">
            <div class="d-flex flex-wrap align-items-center justify-content-between gap-2">
                <div>
                    <h4 class="mb-1">Admin Dashboard</h4>
                    <p class="text-muted small mb-0">Übersicht Umsatz, Abos und Webseiten</p>
                </div>
                <div class="d-flex flex-wrap gap-2">
                    <template v-if="isEditMode">
                        <BButton variant="outline-secondary" size="sm" :disabled="saving" @click="resetToDefault">
                            Zurücksetzen
                        </BButton>
                        <BButton variant="outline-primary" size="sm" @click="openGallery">
                            Widget hinzufügen
                        </BButton>
                        <BButton variant="primary" size="sm" :disabled="saving" @click="saveLayout">
                            {{ saving ? 'Speichern…' : 'Speichern' }}
                        </BButton>
                        <BButton variant="outline-secondary" size="sm" @click="isEditMode = false">
                            Abbrechen
                        </BButton>
                    </template>
                    <BButton v-else variant="outline-primary" size="sm" @click="isEditMode = true">
                        Dashboard bearbeiten
                    </BButton>
                </div>
            </div>
            <p v-if="saveError" class="text-danger small mt-2 mb-0">
                {{ saveError }}
            </p>
        </div>

        <GridLayout
                :layout="layoutLocal"
                :col-num="12"
                :row-height="20"
                :is-draggable="isEditMode"
                :is-resizable="isEditMode"
                :vertical-compact="true"
                :margin="[12, 12]"
                @update:layout="onLayoutUpdated"
            >
                <GridItem
                    v-for="item in layoutLocal"
                    :key="item.i"
                    :x="item.x"
                    :y="item.y"
                    :w="item.w"
                    :h="item.h"
                    :i="item.i"
                    :static="!isEditMode"
                >
                    <div class="h-full w-full overflow-auto p-1">
                        <DashboardWidgetSlot
                            :widget-key="item.i"
                            :registry-item="registryByKey[item.i] ?? null"
                            :preview="false"
                        />
                    </div>
                </GridItem>
        </GridLayout>

        <WidgetGalleryModal
            :open="galleryOpen"
            :widget-registry="widgetRegistry"
            @close="closeGallery"
            @add-widget="addWidget"
        />
    </AdminLayout>
</template>
