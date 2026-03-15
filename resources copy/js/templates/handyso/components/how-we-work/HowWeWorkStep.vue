<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next';

const props = withDefaults(
    defineProps<{
        data: Record<string, unknown>;
        designMode?: boolean;
        showArrow?: boolean;
    }>(),
    { designMode: false, showArrow: true },
);

const number = () => (props.data?.number as string) ?? '01';
const imageSrc = () => (props.data?.imageSrc as string) ?? '';
const imageAlt = () => (props.data?.imageAlt as string) ?? (props.data?.title as string) ?? '';
const title = () => (props.data?.title as string) ?? '';
const desc = () => (props.data?.desc as string) ?? '';
</script>

<template>
    <div class="flex min-w-[200px] flex-1 flex-col">
        <div class="flex items-center gap-2">
            <span
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fd7f2b] text-sm font-bold text-white"
            >
                {{ number() }}
            </span>
            <ChevronRight
                v-if="showArrow"
                class="hidden h-5 w-5 shrink-0 text-gray-300 lg:block @lg:block"
                aria-hidden
            />
        </div>
        <div class="mt-4 overflow-hidden rounded-lg bg-gray-100">
            <img
                v-if="imageSrc()"
                :src="imageSrc()"
                :alt="imageAlt()"
                class="h-40 w-full object-cover"
            />
            <div
                v-else
                class="flex h-40 w-full items-center justify-center text-gray-400"
            >
                Schritt {{ number() }}
            </div>
        </div>
        <h3 class="mt-3 font-semibold text-gray-900">{{ title() }}</h3>
        <p class="mt-1 text-sm text-gray-600">{{ desc() }}</p>
    </div>
</template>
