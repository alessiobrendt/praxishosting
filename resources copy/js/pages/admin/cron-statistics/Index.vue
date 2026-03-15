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
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Heading, Text } from '@/components/ui/typography';
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

const applyFilters = () => {
    router.get('/admin/cron-statistics', { days: filterDays.value }, { preserveState: true });
};

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart<'line'> | null = null;

const chartData = () => {
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
};

const buildChart = () => {
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
};

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
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Cron / Worker-Statistik" />

        <div class="space-y-6">
            <div>
                <Heading level="h1">Cron-Statistik</Heading>
                <Text class="mt-2" muted>
                    Scheduler-Läufe und tägliche Metriken (Rechnungen, Suspendierungen, Tickets, Bezahlungen)
                </Text>
            </div>

            <div class="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle class="text-sm font-medium">Letzter Scheduler-Lauf</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <span class="text-lg font-semibold">{{ formatDateTime(lastSchedulerRunAt) }}</span>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle class="text-sm font-medium">Letzter Cron-Lauf</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <span class="text-lg font-semibold">{{ formatDateTime(lastCronRunAt) }}</span>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle class="text-sm font-medium">Nächster Cron-Lauf</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <span class="text-lg font-semibold">{{ nextCronRunDescription }}</span>
                        <Text variant="small" muted class="mt-1 block">
                            Nächster täglicher Lauf: {{ formatNextDaily(nextDailyRunAt) }}
                        </Text>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <CardTitle>Cron-Diagramm</CardTitle>
                        <CardDescription>Metriken pro Tag (letzte {{ filterDays }} Tage) – Linien mit transparentem Verlauf</CardDescription>
                    </div>
                    <form @submit.prevent="applyFilters" class="flex flex-shrink-0 items-end gap-2">
                        <div class="space-y-1.5">
                            <Label for="filter_days" class="text-xs">Zeitraum</Label>
                            <Select id="filter_days" v-model="filterDays" class="w-32">
                                <option :value="7">7 Tage</option>
                                <option :value="14">14 Tage</option>
                                <option :value="30">30 Tage</option>
                            </Select>
                        </div>
                        <Button type="submit" size="sm">Anwenden</Button>
                    </form>
                </CardHeader>
                <CardContent>
                    <div v-if="dailyStats.length" class="h-[300px] w-full">
                        <canvas ref="chartCanvas" class="h-full w-full"></canvas>
                    </div>
                    <div v-else class="flex min-h-[200px] items-center justify-center rounded-md border border-dashed border-muted-foreground/25 bg-muted/30 text-muted-foreground">
                        Keine Daten für den gewählten Zeitraum.
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Legende</CardTitle>
                </CardHeader>
                <CardContent class="space-y-2 text-sm text-muted-foreground">
                    <p>
                        <strong>Rechnungen erstellt:</strong> Verlängerungs-Rechnungen (Site- und Domain-Abos), die an diesem Tag erstellt wurden.
                    </p>
                    <p>
                        <strong>Dienste bestellt:</strong> Site-Abos, die an diesem Tag angelegt wurden.
                    </p>
                    <p>
                        <strong>Dienste verlängert:</strong> Abo-Verlängerungs-Rechnungen, die an diesem Tag bezahlt wurden.
                    </p>
                    <p>
                        <strong>Dienste gesperrt:</strong> Abos, die an diesem Tag nach Ablauf der Laufzeit auf „gesperrt“ gesetzt wurden.
                    </p>
                    <p>
                        <strong>Dienste beendet:</strong> Abos/Seiten, die nach Ablauf der Schonfrist an diesem Tag gekündigt/entfernt wurden.
                    </p>
                    <p>
                        <strong>Tickets erstellt:</strong> Tickets, die an diesem Tag angelegt wurden.
                    </p>
                    <p>
                        <strong>Tickets geschlossen:</strong> Inaktive Tickets, die an diesem Tag automatisch geschlossen wurden.
                    </p>
                    <p>
                        <strong>Rechnungen bezahlt:</strong> Rechnungen, die an diesem Tag als bezahlt markiert wurden.
                    </p>
                </CardContent>
            </Card>
        </div>
    </AdminLayout>
</template>
