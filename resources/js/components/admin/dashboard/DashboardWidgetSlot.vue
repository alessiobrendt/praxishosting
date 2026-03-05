<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import WidgetRenderer from '@/components/admin/dashboard/WidgetRenderer.vue';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import adminDashboard from '@/routes/admin/dashboard';
import type { WidgetRegistryItem } from '@/types/admin/dashboard';

const props = withDefaults(
    defineProps<{
        widgetKey: string;
        registryItem?: WidgetRegistryItem | null;
        preview?: boolean;
        demoData?: Record<string, unknown> | null;
    }>(),
    { preview: false, registryItem: null, demoData: null },
);

const data = ref<Record<string, unknown> | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

const isClientOnly = computed(() =>
    ['global-search', 'recent-items'].includes(props.widgetKey),
);

async function fetchData() {
    if (props.preview && props.demoData) {
        data.value = props.demoData;
        loading.value = false;
        return;
    }
    if (props.preview) {
        data.value = (props.registryItem?.demoData ?? null) as Record<string, unknown> | null;
        loading.value = false;
        return;
    }
    if (isClientOnly.value) {
        loading.value = false;
        return;
    }
    loading.value = true;
    error.value = null;
    try {
        const url = adminDashboard.widgets.show.url({ widgetKey: props.widgetKey });
        const res = await fetch(url, { headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' } });
        if (!res.ok) throw new Error(res.statusText);
        const json = await res.json();
        data.value = json;
    } catch (e) {
        error.value = e instanceof Error ? e.message : 'Fehler';
        data.value = null;
    } finally {
        loading.value = false;
    }
}

onMounted(fetchData);
watch(() => [props.widgetKey, props.preview], fetchData);

defineExpose({ refresh: fetchData });
</script>

<template>
    <Card class="h-full overflow-hidden">
        <div v-if="loading" class="space-y-2 p-4">
            <Skeleton class="h-6 w-1/2" />
            <Skeleton class="h-8 w-full" />
            <Skeleton class="h-4 w-2/3" />
        </div>
        <div v-else-if="error" class="p-4 text-sm text-destructive">
            {{ error }}
        </div>
        <WidgetRenderer
            v-else
            :widget-key="widgetKey"
            :data="data"
            :registry-item="registryItem"
        />
    </Card>
</template>
