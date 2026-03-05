<script setup lang="ts">
import { usePage } from '@inertiajs/vue3';
import { computed } from 'vue';

const page = usePage();

interface Props {
    /** Standard-Logo oder kleines Logo für eingeklappte Sidebar */
    variant?: 'default' | 'collapsed';
}

const props = withDefaults(defineProps<Props>(), {
    variant: 'default',
});

const brand = page.props.brand as { name?: string; logoUrl?: string; logoCollapsedUrl?: string } | null;

const logoUrl = computed(() => {
    if (!brand) return null;
    if (props.variant === 'collapsed' && brand.logoCollapsedUrl) return brand.logoCollapsedUrl;
    return brand.logoUrl ?? null;
});
</script>

<template>
    <div class="flex items-center gap-2">
        <div
            :class="[
                variant === 'collapsed' ? 'flex h-8 w-8 shrink-0 items-center justify-center' : 'ml-1 grid min-w-0 flex-1 text-left text-sm',
            ]"
        >
            <img
                v-if="logoUrl"
                :src="logoUrl"
                alt="Logo"
                :class="variant === 'collapsed' ? 'h-8 w-8 object-contain object-center' : 'size-64'"
            />
            <span
                v-else
                :class="[
                    'truncate leading-tight font-semibold',
                    variant === 'collapsed' ? 'text-xs' : 'mb-0.5',
                ]"
            >
                {{ brand?.name ?? 'Logo' }}
            </span>
        </div>
    </div>
</template>
