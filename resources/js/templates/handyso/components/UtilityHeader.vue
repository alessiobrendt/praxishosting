<script setup lang="ts">
import { computed } from 'vue';
import { Mail, Phone, Facebook, Twitter, Linkedin, Instagram } from 'lucide-vue-next';

const props = withDefaults(
    defineProps<{
        data: Record<string, unknown>;
        designMode?: boolean;
    }>(),
    { designMode: false },
);

const email = computed(() => (props.data.email as string) ?? '');
const phone = computed(() => (props.data.phone as string) ?? '');
const seeAllServiceText = computed(() => (props.data.seeAllServiceText as string) ?? 'See All Service');
const seeAllServiceHref = computed(() => (props.data.seeAllServiceHref as string) ?? '#');
const socialLinks = computed(() => (props.data.socialLinks as Array<{ name: string; href: string; icon: string }>) ?? []);

const iconMap: Record<string, typeof Facebook> = {
    Facebook,
    Twitter,
    Linkedin,
    Instagram,
};
</script>

<template>
    <div class="bg-[#010b1a] text-white">
        <div class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-2 sm:px-6 @sm:px-6">
            <div class="flex flex-wrap items-center gap-6 text-sm">
                <a
                    v-if="email"
                    :href="designMode ? '#' : `mailto:${email}`"
                    class="flex items-center gap-2 hover:opacity-90"
                    @click="designMode && $event.preventDefault()"
                >
                    <Mail class="h-4 w-4 shrink-0 text-[#fd7f2b]" aria-hidden />
                    {{ email }}
                </a>
                <a
                    v-if="phone"
                    :href="designMode ? '#' : `tel:${phone.replace(/\s/g, '')}`"
                    class="flex items-center gap-2 hover:opacity-90"
                    @click="designMode && $event.preventDefault()"
                >
                    <Phone class="h-4 w-4 shrink-0 text-[#fd7f2b]" aria-hidden />
                    {{ phone }}
                </a>
            </div>
            <div class="flex items-center gap-4">
                <div class="flex items-center gap-3">
                    <a
                        v-for="(social, i) in socialLinks"
                        :key="i"
                        :href="designMode ? '#' : (social.href ?? '#')"
                        class="text-white/80 transition hover:text-[#fd7f2b]"
                        :aria-label="social.name"
                        @click="designMode && $event.preventDefault()"
                    >
                        <component :is="iconMap[social.icon] ?? Facebook" class="h-5 w-5" />
                    </a>
                </div>
                <a
                    :href="designMode ? '#' : seeAllServiceHref"
                    class="shrink-0 rounded bg-white px-4 py-2 text-sm font-medium text-[#010b1a] transition hover:bg-gray-100"
                    @click="designMode && $event.preventDefault()"
                >
                    {{ seeAllServiceText }}
                </a>
            </div>
        </div>
    </div>
</template>
