<script setup lang="ts">
type LinkItem = {
    text: string;
    href: string;
    variant?: string;
};

type ImageData = {
    src: string;
    alt: string;
};

type Props = {
    data: {
        heading: string;
        text: string;
        links?: LinkItem[];
        image?: ImageData;
    };
};

defineProps<Props>();
</script>

<template>
    <section class="py-16 px-4 bg-[var(--quaternary)]">
        <div class="container mx-auto grid gap-8 md:grid-cols-2 md:items-center">
            <div>
                <h2 class="text-2xl font-bold md:text-3xl" style="color: var(--secondary)">
                    {{ data.heading }}
                </h2>
                <p class="mt-4 text-[var(--tertiary)]">
                    {{ data.text }}
                </p>
                <div v-if="data.links?.length" class="mt-6 flex flex-wrap gap-3">
                    <a
                        v-for="(link, i) in data.links"
                        :key="i"
                        :href="link.href"
                        :class="[
                            'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors',
                            link.variant === 'secondary'
                                ? 'border border-[var(--tertiary)] text-[var(--tertiary)] hover:bg-[var(--quinary)]'
                                : 'bg-[var(--primary)] text-white hover:opacity-90',
                        ]"
                    >
                        {{ link.text }}
                    </a>
                </div>
            </div>
            <div v-if="data.image" class="rounded-xl overflow-hidden">
                <img
                    :src="data.image.src"
                    :alt="data.image.alt"
                    class="w-full h-auto object-cover"
                />
            </div>
        </div>
    </section>
</template>
