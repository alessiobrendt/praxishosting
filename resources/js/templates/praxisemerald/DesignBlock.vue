<script setup lang="ts">
import { computed, inject } from 'vue';
import Button from '@/templates/praxisemerald/components/ui/Button.vue';
import HoursTable from '@/templates/praxisemerald/components/ui/HoursTable.vue';
import InlineEditableText from '@/pages/PageDesigner/components/InlineEditableText.vue';
import {
    HeartPulse,
    ShieldCheck,
    Stethoscope,
    Syringe,
    Clock,
} from 'lucide-vue-next';
import type {
    HeroComponentData,
    CtaComponentData,
    AboutComponentData,
    HoursComponentData,
} from '@/types/layout-components';
import type { LayoutComponentEntry } from '@/types/layout-components';

const props = defineProps<{
    entry: LayoutComponentEntry;
    designMode: boolean;
}>();

const layoutEntry = inject<{ value: { id: string } } | null>('layoutEntry', null);
const selectedModuleId = inject<{ value: string | null } | null>(
    'selectedModuleId',
    null,
);
const isSelected = computed(
    () =>
        !!layoutEntry?.value &&
        layoutEntry.value.id === selectedModuleId?.value,
);

const data = computed(() => props.entry.data ?? {});
const entryId = computed(() => props.entry.id);

const heroData = computed(() => data.value as Partial<HeroComponentData>);
const ctaData = computed(() => data.value as Partial<CtaComponentData>);
const aboutData = computed(() => data.value as Partial<AboutComponentData>);
const hoursData = computed(() => data.value as Partial<HoursComponentData>);

const iconMap = {
    Stethoscope,
    Syringe,
    ShieldCheck,
    HeartPulse,
    Clock,
};
type FeatureIcon = keyof typeof iconMap;
</script>

<template>
    <!-- Hero -->
    <section
        v-if="entry.type === 'hero'"
        aria-labelledby="hero-heading"
        class="relative"
    >
        <div
            class="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 py-12 sm:px-6 @sm:px-6 md:grid-cols-2 @md:grid-cols-2"
        >
            <div>
                <InlineEditableText
                    id="hero-heading"
                    :model-value="heroData.heading ?? ''"
                    :design-mode="designMode"
                    :is-selected="isSelected"
                    :entry-id="entryId"
                    field-key="heading"
                    tag="h1"
                    class="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl @sm:text-4xl"
                />
                <InlineEditableText
                    :model-value="heroData.text ?? ''"
                    :design-mode="designMode"
                    :is-selected="isSelected"
                    :entry-id="entryId"
                    field-key="text"
                    tag="div"
                    class="mt-4 text-slate-700"
                    placeholder="Beschreibungstext…"
                    html
                />
                <div class="mt-6 flex flex-wrap gap-3">
                    <div
                        v-for="(btn, idx) in (heroData.buttons ?? [])"
                        :key="idx"
                    >
                        <Button
                            :variant="
                                (btn.variant as 'default' | 'outline') ?? 'default'
                            "
                        >
                            <a
                                :href="designMode ? '#' : btn.href"
                                :class="
                                    btn.variant === 'default'
                                        ? 'text-white'
                                        : 'text-black'
                                "
                                @click="designMode && $event.preventDefault()"
                            >
                                {{ btn.text }}
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
            <div
                v-if="(heroData.image ?? { src: '', alt: '' }).src"
                class="relative"
            >
                <div
                    class="relative aspect-[4/3] overflow-hidden rounded-lg border shadow-sm"
                >
                    <img
                        :src="(heroData.image ?? {}).src"
                        :alt="(heroData.image ?? {}).alt"
                        loading="eager"
                        class="h-full w-full object-cover"
                    />
                </div>
            </div>
        </div>
    </section>

    <!-- CtaBlock -->
    <section
        v-else-if="entry.type === 'cta'"
        aria-labelledby="cta-block-heading"
        class="border-t px-4 py-12"
        style="background-color: var(--quaternary)"
    >
        <div
            class="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center sm:px-6 @sm:px-6"
        >
            <InlineEditableText
                id="cta-block-heading"
                :model-value="ctaData.heading ?? ''"
                :design-mode="designMode"
                :is-selected="isSelected"
                :entry-id="entryId"
                field-key="heading"
                tag="h2"
                class="text-2xl font-semibold"
                :style="{ color: 'var(--secondary)' }"
            />
            <InlineEditableText
                :model-value="ctaData.text ?? ''"
                :design-mode="designMode"
                :is-selected="isSelected"
                :entry-id="entryId"
                field-key="text"
                tag="div"
                class="max-w-2xl prose prose-sm max-w-none"
                :style="{ color: 'var(--tertiary)' }"
                placeholder="Text hier eingeben…"
                html
            />
            <div class="flex flex-wrap items-center justify-center gap-3">
                <a
                    v-for="(link, index) in (ctaData.links ?? [])"
                    :key="index"
                    :href="designMode ? '#' : link.href"
                    class="rounded-md px-4 py-2 transition-colors"
                    @click="designMode && $event.preventDefault()"
                    :style="
                        link.variant === 'primary'
                            ? {
                                  backgroundColor: 'var(--primary)',
                                  color: '#ffffff',
                              }
                            : {
                                  color: 'var(--secondary)',
                                  border: '1px solid var(--tertiary)',
                              }
                    "
                    @mouseenter="
                        (e) => {
                            if (link.variant === 'primary') {
                                (e.target as HTMLElement).style.backgroundColor =
                                    'var(--primary-hover)';
                            } else {
                                (e.target as HTMLElement).style.backgroundColor =
                                    'var(--quinary)';
                            }
                        }
                    "
                    @mouseleave="
                        (e) => {
                            if (link.variant === 'primary') {
                                (e.target as HTMLElement).style.backgroundColor =
                                    'var(--primary)';
                            } else {
                                (e.target as HTMLElement).style.backgroundColor =
                                    'transparent';
                            }
                        }
                    "
                >
                    {{ link.text }}
                </a>
            </div>
            <div
                v-if="(ctaData.image ?? { src: '', alt: '' }).src"
                class="relative mt-6 w-48 overflow-hidden rounded-lg border"
            >
                <img
                    :src="(ctaData.image ?? {}).src"
                    :alt="(ctaData.image ?? {}).alt"
                    loading="lazy"
                    class="h-full w-full object-cover"
                />
            </div>
        </div>
    </section>

    <!-- AboutBlock -->
    <section
        v-else-if="entry.type === 'about'"
        aria-labelledby="about-block-heading"
        class="mx-auto max-w-6xl px-4 py-12 sm:px-6 @sm:px-6"
    >
        <InlineEditableText
            id="about-block-heading"
            :model-value="aboutData.heading ?? ''"
            :design-mode="designMode"
            :is-selected="isSelected"
            :entry-id="entryId"
            field-key="heading"
            tag="h2"
            class="text-2xl font-semibold"
            :style="{ color: 'var(--secondary)' }"
        />
        <InlineEditableText
            :model-value="aboutData.text ?? ''"
            :design-mode="designMode"
            :is-selected="isSelected"
            :entry-id="entryId"
            field-key="text"
            tag="div"
            class="mt-4 prose prose-sm max-w-none"
            :style="{ color: 'var(--tertiary)' }"
            placeholder="Text hier eingeben…"
            html
        />
        <div class="mt-6 grid gap-4 sm:grid-cols-2 @sm:grid-cols-2">
            <div
                v-for="(feature, index) in (aboutData.features ?? [])"
                :key="index"
                class="flex items-start gap-3 rounded-lg border bg-white p-4 shadow-sm"
            >
                <component
                    :is="
                        iconMap[feature.icon as FeatureIcon] ?? Stethoscope
                    "
                    class="mt-0.5 h-5 w-5 shrink-0"
                    style="color: var(--primary-dark)"
                    aria-hidden="true"
                />
                <div>
                    <h3 class="font-medium">{{ feature.title }}</h3>
                    <p
                        class="text-sm"
                        style="color: var(--tertiary)"
                    >
                        {{ feature.desc }}
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- HoursBlock -->
    <section
        v-else-if="entry.type === 'hours'"
        aria-labelledby="hours-block-heading"
        class="space-y-4"
    >
        <h2
            id="hours-block-heading"
            class="flex items-center gap-2 text-xl font-semibold"
            style="color: var(--secondary)"
        >
            <Clock
                class="h-5 w-5"
                style="color: var(--primary-dark)"
                aria-hidden="true"
            />
            <InlineEditableText
                :model-value="hoursData.heading ?? ''"
                :design-mode="designMode"
                :is-selected="isSelected"
                :entry-id="entryId"
                field-key="heading"
                tag="span"
                class="inline"
            />
        </h2>
        <HoursTable :hours="hoursData.hours ?? []" />
        <div
            class="rounded-md border p-3 text-sm"
            style="
                background-color: var(--primary-light);
                color: var(--primary-dark);
            "
        >
            <InlineEditableText
                :model-value="hoursData.infoText ?? ''"
                :design-mode="designMode"
                :is-selected="isSelected"
                :entry-id="entryId"
                field-key="infoText"
                tag="span"
                class="inline"
                placeholder="Zusätzliche Informationen…"
            />
        </div>
    </section>
</template>
