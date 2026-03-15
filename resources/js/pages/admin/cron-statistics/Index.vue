<!-- Admin: Cron-Statistik -->
<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3';
import {
    Chart,
    LineController,
    LineElement,
    PointElement,
    Filler,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from 'chart.js';
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import {
    BRow,
    BCol,
    BCard,
    BCardBody,
    BCardHeader,
    BCardTitle,
    BButton,
    BFormSelect,
    BFormGroup,
} from 'bootstrap-vue-next';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

Chart.register(
    LineController,
    LineElement,
    PointElement,
    Filler,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
);

type DailyStat = {
    date: string;
    date_formatted: string;
    invoices_created: number;
    services_suspended: number;
    services_terminated: number;
    tickets_closed: number;
    invoices_charged: number;
    services_ordered: number;
    services_renewed: number;
    tickets_created: number;
};

type Props = {
    lastSchedulerRunAt: string | null;
    lastCronRunAt: string | null;
    nextCronRunDescription: string;
    nextDailyRunAt: string;
    dailyStats: DailyStat[];
    filterDays: number;
};

const props = defineProps<Props>();

const filterDays = ref(props.filterDays);

watch(
    () => props.filterDays,
    (v) => {
        filterDays.value = v;
    },
);

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Cron / Worker-Statistik', href: '#' },
];

function formatDateTime(iso: string | null): string {
    if (!iso) return 'Nie';
    try {
        const d = new Date(iso);
        return d.toLocaleString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return iso;
    }
}

function formatNextDaily(iso: string): string {
    try {
        const d = new Date(iso);
        return d.toLocaleString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return iso;
    }
}

function applyFilters(): void {
    router.get('/admin/cron-statistics', { days: filterDays.value }, { preserveState: true });
}

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart<'line'> | null = null;

function chartData(): { labels: string[]; datasets: object[] } {
    const stats = [...props.dailyStats].reverse();
    return {
        labels: stats.map((d) => d.date_formatted),
        datasets: [
            {
                label: 'Rechnungen erstellt',
                data: stats.map((d) => d.invoices_created),
                borderColor: 'rgb(34, 197, 94)',
                backgroundColor: 'rgba(34, 197, 94, 0.15)',
                fill: true,
                tension: 0.3,
            },
            {
                label: 'Dienste bestellt',
                data: stats.map((d) => d.services_ordered),
                borderColor: 'rgb(20, 184, 166)',
                backgroundColor: 'rgba(20, 184, 166, 0.15)',
                fill: true,
                tension: 0.3,
            },
            {
                label: 'Dienste verlängert',
                data: stats.map((d) => d.services_renewed),
                borderColor: 'rgb(34, 197, 94)',
                backgroundColor: 'rgba(34, 197, 94, 0.15)',
                fill: true,
                tension: 0.3,
            },
            {
                label: 'Dienste gesperrt',
                data: stats.map((d) => d.services_suspended),
                borderColor: 'rgb(234, 179, 8)',
                backgroundColor: 'rgba(234, 179, 8, 0.15)',
                fill: true,
                tension: 0.3,
            },
            {
                label: 'Dienste beendet',
                data: stats.map((d) => d.services_terminated),
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                fill: true,
                tension: 0.3,
            },
            {
                label: 'Tickets erstellt',
                data: stats.map((d) => d.tickets_created),
                borderColor: 'rgb(14, 165, 233)',
                backgroundColor: 'rgba(14, 165, 233, 0.15)',
                fill: true,
                tension: 0.3,
            },
            {
                label: 'Tickets geschlossen',
                data: stats.map((d) => d.tickets_closed),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                fill: true,
                tension: 0.3,
            },
            {
                label: 'Rechnungen bezahlt',
                data: stats.map((d) => d.invoices_charged),
                borderColor: 'rgb(168, 85, 247)',
                backgroundColor: 'rgba(168, 85, 247, 0.15)',
                fill: true,
                tension: 0.3,
            },
        ],
    };
}

function buildChart(): void {
    if (!chartCanvas.value || !props.dailyStats.length) return;
    if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
    }
    chartInstance = new Chart(chartCanvas.value, {
        type: 'line',
        data: chartData(),
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: { display: true, text: 'Datum' },
                },
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Anzahl' },
                    ticks: { stepSize: 1 },
                },
            },
            plugins: {
                legend: { position: 'top' },
                tooltip: { mode: 'index', intersect: false },
            },
        },
    });
}

onMounted(() => {
    buildChart();
});

onBeforeUnmount(() => {
    if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
    }
});

watch(
    () => [props.dailyStats, props.filterDays],
    () => {
        buildChart();
    },
    { deep: true },
);

const daysOptions = [
    { value: 7, text: '7 Tage' },
    { value: 14, text: '14 Tage' },
    { value: 30, text: '30 Tage' },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Cron / Worker-Statistik" />

        <BRow>
            <BCol>
                <div class="mb-3">
                    <h4 class="mb-1">Cron-Statistik</h4>
                    <p class="text-muted small mb-0">
                        Scheduler-Läufe und tägliche Metriken (Rechnungen, Suspendierungen, Tickets,
                        Bezahlungen)
                    </p>
                </div>

                <BRow class="mb-4">
                    <BCol md="4" class="mb-3">
                        <BCard no-body>
                            <BCardHeader class="py-3">
                                <BCardTitle class="small fw-medium mb-0">Letzter Scheduler-Lauf</BCardTitle>
                            </BCardHeader>
                            <BCardBody>
                                <span class="fs-5 fw-semibold">{{ formatDateTime(lastSchedulerRunAt) }}</span>
                            </BCardBody>
                        </BCard>
                    </BCol>
                    <BCol md="4" class="mb-3">
                        <BCard no-body>
                            <BCardHeader class="py-3">
                                <BCardTitle class="small fw-medium mb-0">Letzter Cron-Lauf</BCardTitle>
                            </BCardHeader>
                            <BCardBody>
                                <span class="fs-5 fw-semibold">{{ formatDateTime(lastCronRunAt) }}</span>
                            </BCardBody>
                        </BCard>
                    </BCol>
                    <BCol md="4" class="mb-3">
                        <BCard no-body>
                            <BCardHeader class="py-3">
                                <BCardTitle class="small fw-medium mb-0">Nächster Cron-Lauf</BCardTitle>
                            </BCardHeader>
                            <BCardBody>
                                <span class="fs-5 fw-semibold">{{ nextCronRunDescription }}</span>
                                <p class="text-muted small mb-0 mt-1">
                                    Nächster täglicher Lauf: {{ formatNextDaily(nextDailyRunAt) }}
                                </p>
                            </BCardBody>
                        </BCard>
                    </BCol>
                </BRow>

                <BCard no-body class="mb-4">
                    <BCardHeader class="d-flex flex-column flex-sm-row align-items-start justify-content-between gap-3">
                        <div>
                            <BCardTitle class="mb-0">Cron-Diagramm</BCardTitle>
                            <p class="text-muted small mb-0 mt-1">
                                Metriken pro Tag (letzte {{ filterDays }} Tage) – Linien mit transparentem Verlauf
                            </p>
                        </div>
                        <form
                            class="d-flex flex-shrink-0 align-items-end gap-2"
                            @submit.prevent="applyFilters"
                        >
                            <BFormGroup label="Zeitraum" label-for="filter_days" class="mb-0 me-2">
                                <BFormSelect
                                    id="filter_days"
                                    v-model="filterDays"
                                    :options="daysOptions"
                                    class="form-select-sm"
                                    style="min-width: 7rem"
                                />
                            </BFormGroup>
                            <BButton type="submit" size="sm" variant="primary">Anwenden</BButton>
                        </form>
                    </BCardHeader>
                    <BCardBody>
                        <div v-if="dailyStats.length" class="w-100" style="height: 300px">
                            <canvas ref="chartCanvas" class="w-100 h-100"></canvas>
                        </div>
                        <div
                            v-else
                            class="d-flex align-items-center justify-content-center border border-secondary border-2 border-dashed rounded bg-light text-muted"
                            style="min-height: 200px"
                        >
                            Keine Daten für den gewählten Zeitraum.
                        </div>
                    </BCardBody>
                </BCard>

                <BCard no-body>
                    <BCardHeader>
                        <BCardTitle class="mb-0">Legende</BCardTitle>
                    </BCardHeader>
                    <BCardBody class="small text-muted">
                        <p class="mb-2">
                            <strong>Rechnungen erstellt:</strong> Verlängerungs-Rechnungen (Site- und
                            Domain-Abos), die an diesem Tag erstellt wurden.
                        </p>
                        <p class="mb-2">
                            <strong>Dienste bestellt:</strong> Site-Abos, die an diesem Tag angelegt wurden.
                        </p>
                        <p class="mb-2">
                            <strong>Dienste verlängert:</strong> Abo-Verlängerungs-Rechnungen, die an diesem
                            Tag bezahlt wurden.
                        </p>
                        <p class="mb-2">
                            <strong>Dienste gesperrt:</strong> Abos, die an diesem Tag nach Ablauf der
                            Laufzeit auf „gesperrt“ gesetzt wurden.
                        </p>
                        <p class="mb-2">
                            <strong>Dienste beendet:</strong> Abos/Seiten, die nach Ablauf der Schonfrist an
                            diesem Tag gekündigt/entfernt wurden.
                        </p>
                        <p class="mb-2">
                            <strong>Tickets erstellt:</strong> Tickets, die an diesem Tag angelegt wurden.
                        </p>
                        <p class="mb-2">
                            <strong>Tickets geschlossen:</strong> Inaktive Tickets, die an diesem Tag
                            automatisch geschlossen wurden.
                        </p>
                        <p class="mb-0">
                            <strong>Rechnungen bezahlt:</strong> Rechnungen, die an diesem Tag als bezahlt
                            markiert wurden.
                        </p>
                    </BCardBody>
                </BCard>
            </BCol>
        </BRow>
    </AdminLayout>
</template>
