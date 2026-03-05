<script setup lang="ts">
import DashboardWidgetSlot from '@/components/admin/dashboard/DashboardWidgetSlot.vue';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { WidgetRegistryItem } from '@/types/admin/dashboard';

defineProps<{
    open: boolean;
    widgetRegistry: WidgetRegistryItem[];
}>();

const emit = defineEmits<{
    close: [];
    addWidget: [key: string];
}>();

function select(key: string) {
    emit('addWidget', key);
    emit('close');
}
</script>

<template>
    <Dialog :open="open" @update:open="(v) => !v && emit('close')">
        <DialogContent class="max-h-[90vh] w-[95vw] max-w-[240rem] overflow-hidden flex flex-col sm:max-w-7xl">
            <DialogHeader>
                <DialogTitle>Widget hinzufügen <span class="text-sm rounded-md px-2 py-1 bg-muted">({{ widgetRegistry.length }} Widgets verfügbar)</span></DialogTitle>
                <DialogDescription>
                    Wählen Sie ein Widget. Die Vorschau zeigt Demo-Daten.
                </DialogDescription>
            </DialogHeader>
            <div class="flex-1 overflow-y-auto">
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 py-4">
                    <button
                        v-for="widget in widgetRegistry"
                        :key="widget.key"
                        type="button"
                        class="rounded-xl border border-gray-200 bg-white p-4 text-left shadow-modern transition-modern hover:border-primary hover:shadow-modern-lg dark:border-gray-800 dark:bg-gray-900"
                        @click="select(widget.key)"
                    >
                        <div class="pointer-events-none min-h-[120px] scale-90 origin-top-left [width:111%]">
                            <DashboardWidgetSlot
                                :widget-key="widget.key"
                                :registry-item="widget"
                                :preview="true"
                                :demo-data="widget.demoData ?? null"
                            />
                        </div>
                        <p class="mt-2 font-medium">{{ widget.title }}</p>
                        <p class="text-xs text-muted-foreground">{{ widget.description }}</p>
                    </button>
                </div>
            </div>
        </DialogContent>
    </Dialog>
</template>
