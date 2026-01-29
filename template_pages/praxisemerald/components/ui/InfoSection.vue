<script setup lang="ts">

defineProps<{
    title: string;
    icon: any;
}>();

</script>

<template>
    <div className="rounded-lg border bg-white p-5 shadow-sm">
        <div className="mb-2 flex flex-row items-center gap-2">
            <component :is="icon" className="h-5 w-5 text-emerald-700" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-slate-900">{{ title }}</h2>
        </div>
        <div className="text-sm text-slate-700 ">
            <slot />
        </div>
    </div>
</template>