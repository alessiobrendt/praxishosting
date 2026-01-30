<script setup lang="ts">
import { computed } from 'vue';
import HoursTable from '@/templates/praxisemerald/components/ui/HoursTable.vue';
import type { HoursComponentData } from '@/types/layout-components';
import { Clock } from 'lucide-vue-next';

const props = defineProps<{
    data: Partial<HoursComponentData>;
}>();

const heading = computed(() => props.data.heading ?? '');
const icon = computed(() => props.data.icon ?? 'Clock');
const infoText = computed(() => props.data.infoText ?? '');
const hours = computed(() => props.data.hours ?? []);
</script>

<template>
    <section aria-labelledby="hours-block-heading" class="space-y-4">
        <h2
            id="hours-block-heading"
            class="flex items-center gap-2 text-xl font-semibold"
            style="color: var(--secondary)"
        >
            <Clock class="h-5 w-5" style="color: var(--primary-dark)" aria-hidden="true" />
            {{ heading }}
        </h2>
        <HoursTable :hours="hours" />
        <div
            class="rounded-md border p-3 text-sm"
            style="background-color: var(--primary-light); color: var(--primary-dark)"
        >
            {{ infoText }}
        </div>
    </section>
</template>
