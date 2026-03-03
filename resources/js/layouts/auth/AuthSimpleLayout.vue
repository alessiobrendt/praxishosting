<script setup lang="ts">
import { computed } from 'vue';
import { usePage } from '@inertiajs/vue3';
import { Lock } from 'lucide-vue-next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface Props {
    title?: string;
    description?: string;
    restrictedAccess?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    title: 'Welcome',
    description: '',
    restrictedAccess: false,
});

const page = usePage();
const brand = computed(() => page.props.brand as { themeColors?: Record<string, string> } | null);
const brandThemeStyle = computed(() => {
    if (props.restrictedAccess) return undefined;
    const colors = brand.value?.themeColors;
    if (!colors || typeof colors !== 'object') return undefined;
    const vars: Record<string, string> = {};
    for (const [key, value] of Object.entries(colors)) {
        if (value) vars[`--${key.replace(/_/g, '-')}`] = value;
    }
    return Object.keys(vars).length ? vars : undefined;
});
</script>

<template>
    <div
        :style="brandThemeStyle"
        class="flex min-h-screen items-center justify-center p-4"
        :class="
            props.restrictedAccess
                ? 'bg-slate-100 dark:bg-slate-950'
                : 'bg-gradient-to-br from-gray-50 via-white to-primary/10 dark:from-gray-950 dark:via-gray-900 dark:to-primary/20'
        "
    >
        <div class="w-full max-w-md">
            <p
                v-if="props.restrictedAccess"
                class="mb-3 text-center text-xs font-medium uppercase tracking-widest text-slate-500 dark:text-slate-400"
            >
                Geschützter Bereich
            </p>
            <Card
                class="shadow-modern-xl"
                :class="
                    props.restrictedAccess
                        ? 'border-slate-200 dark:border-slate-700 border-l-4 border-l-amber-500 dark:border-l-amber-600'
                        : ''
                "
            >
                <CardHeader class="text-center">
                    <div
                        v-if="props.restrictedAccess"
                        class="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950/50"
                    >
                        <Lock class="h-6 w-6 text-amber-600 dark:text-amber-500" />
                    </div>
                    <CardTitle class="text-2xl">{{ title }}</CardTitle>
                    <CardDescription v-if="description" class="mt-2">
                        {{ description }}
                    </CardDescription>
                    <p
                        v-if="props.restrictedAccess"
                        class="mt-3 text-center text-sm text-slate-600 dark:text-slate-400"
                    >
                        Zugang nur für berechtigte Personen. Unbefugter Zugriff ist untersagt.
                    </p>
                </CardHeader>
                <CardContent>
                    <slot />
                </CardContent>
            </Card>
        </div>
    </div>
</template>
