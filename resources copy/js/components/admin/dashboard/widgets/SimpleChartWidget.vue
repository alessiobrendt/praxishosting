<script setup lang="ts">
import { Chart, registerables } from 'chart.js';
import { ref, onMounted, watch } from 'vue';
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

Chart.register(...registerables);

const props = defineProps<{
    data?: { labels?: string[]; values?: number[]; [key: string]: unknown } | null;
    title?: string;
    description?: string;
    /** 'bar' | 'line' | 'doughnut' */
    chartType?: 'bar' | 'line' | 'doughnut';
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

function getChartData() {
    const d = props.data;
    if (!d || typeof d !== 'object') return { labels: [], values: [] };
    if (Array.isArray(d.labels) && Array.isArray(d.values)) return { labels: d.labels, values: d.values };
    const keys = Object.keys(d).filter((k) => k !== 'labels' && k !== 'values' && typeof d[k] === 'number');
    return { labels: keys, values: keys.map((k) => Number(d[k])) };
}

function buildChart() {
    if (!canvasRef.value || !props.data) return;
    const { labels, values } = getChartData();
    if (!labels.length && !values.length) return;
    if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
    }
    const type = props.chartType ?? 'bar';
    chartInstance = new Chart(canvasRef.value, {
        type,
        data: {
            labels: labels.length ? labels : values.map((_, i) => String(i + 1)),
            datasets: [{
                label: props.title ?? 'Wert',
                data: values,
                backgroundColor: type === 'doughnut' ? ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'].slice(0, 10) : undefined,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { display: type === 'doughnut' } },
            scales: type !== 'doughnut' ? { y: { beginAtZero: true } } : undefined,
        },
    });
}

onMounted(buildChart);
watch(() => props.data, buildChart, { deep: true });
</script>

<template>
    <CardHeader class="py-3">
        <CardTitle class="text-sm font-medium">{{ title }}</CardTitle>
        <CardDescription v-if="description" class="text-xs">{{ description }}</CardDescription>
    </CardHeader>
    <CardContent class="pt-0">
        <div class="h-[180px]">
            <canvas v-if="data" ref="canvasRef" class="max-h-[180px]" />
            <p v-else class="text-sm text-muted-foreground">Keine Daten.</p>
        </div>
    </CardContent>
</template>
