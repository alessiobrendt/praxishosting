<script setup lang="ts">
type Feature = {
    icon: string;
    title: string;
    desc: string;
};

type Props = {
    data: {
        heading: string;
        text: string;
        features?: Feature[];
    };
};

defineProps<Props>();
</script>

<template>
    <section class="py-16 px-4 bg-background">
        <div class="container mx-auto">
            <h2 class="text-2xl font-bold md:text-3xl" style="color: var(--secondary)">
                {{ data.heading }}
            </h2>
            <p class="mt-4 text-[var(--tertiary)] max-w-2xl">
                {{ data.text }}
            </p>
            <div
                v-if="data.features?.length"
                class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
                <div
                    v-for="(feature, i) in data.features"
                    :key="i"
                    class="rounded-xl border border-sidebar-border bg-card p-4"
                >
                    <div
                        class="mb-2 text-2xl font-semibold"
                        style="color: var(--primary)"
                    >
                        {{ feature.icon }}
                    </div>
                    <h3 class="font-semibold" style="color: var(--secondary)">
                        {{ feature.title }}
                    </h3>
                    <p class="mt-1 text-sm text-muted-foreground">
                        {{ feature.desc }}
                    </p>
                </div>
            </div>
        </div>
    </section>
</template>
