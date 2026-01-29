<script setup lang="ts">
type ButtonItem = {
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
        buttons?: ButtonItem[];
        image?: ImageData;
    };
};

defineProps<Props>();
</script>

<template>
    <section class="py-16 px-4 bg-[var(--quaternary)]">
        <div class="container mx-auto grid gap-8 md:grid-cols-2 md:items-center">
            <div>
                <h1 class="text-3xl font-bold md:text-4xl" style="color: var(--secondary)">
                    {{ data.heading }}
                </h1>
                <p class="mt-4 text-lg text-[var(--tertiary)]">
                    {{ data.text }}
                </p>
                <div v-if="data.buttons?.length" class="mt-6 flex flex-wrap gap-3">
                    <a
                        v-for="(btn, i) in data.buttons"
                        :key="i"
                        :href="btn.href"
                        :class="[
                            'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors',
                            btn.variant === 'outline'
                                ? 'border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary-light)]'
                                : 'bg-[var(--primary)] text-white hover:opacity-90',
                        ]"
                    >
                        {{ btn.text }}
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
