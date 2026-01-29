<script lang="ts" setup>

defineProps<{
    title: string;
    icon: any;
    highlight: string;
    desc: string;
    href?: string;
}>();

</script>

<template>
    <div class="flex items-start gap-4 rounded-lg border bg-white p-5 shadow-sm">
        <component :is="icon" class="h-6 w-6 text-red-700" aria-hidden="true" />
        <div>
            <h2 class="text-lg font-semibold text-slate-900">{{ title }}</h2>
            <p class="mt-1 text-sm text-slate-700">{{ desc }}</p>
            <p class="mt-2 text-base font-semibold"><a :href="href" class="text-red-700 underline">{{ highlight }}</a></p>
        </div>
    </div>
</template>