<script setup lang="ts">
import * as LucideIcons from 'lucide-vue-next';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ref, computed, nextTick, watch } from 'vue';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';

const icons = LucideIcons as unknown as Record<string, (typeof LucideIcons)['Stethoscope']>;

const nonIconExports = new Set(['createLucideIcon', 'Icon']);

const iconNames = Object.keys(LucideIcons)
    .filter((k) => typeof (LucideIcons as Record<string, unknown>)[k] === 'function')
    .filter((k) => !nonIconExports.has(k))
    .sort((a, b) => a.localeCompare(b));

const PAGE_SIZE = 48;

const props = defineProps<{
    modelValue: string;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
}>();

const search = ref('');
const open = ref(false);
const currentPage = ref(1);

function onOpenChange(value: boolean) {
    nextTick(() => {
        open.value = value;
        if (!value) {
            currentPage.value = 1;
        }
    });
}

const filteredIconNames = computed(() => {
    const q = search.value.trim().toLowerCase();
    const list = q ? iconNames.filter((name) => name.toLowerCase().includes(q)) : iconNames;
    return list.filter((name) => icons[name]);
});

const totalPages = computed(() =>
    Math.max(1, Math.ceil(filteredIconNames.value.length / PAGE_SIZE)),
);

const paginatedIconNames = computed(() => {
    const list = filteredIconNames.value;
    const start = (currentPage.value - 1) * PAGE_SIZE;
    return list.slice(start, start + PAGE_SIZE);
});

watch(filteredIconNames, () => {
    currentPage.value = 1;
});

const currentIconComponent = computed(() => {
    const name = props.modelValue;
    if (!name) return LucideIcons.Circle;
    return icons[name] ?? LucideIcons.Circle;
});

function select(name: string) {
    emit('update:modelValue', name);
    open.value = false;
}

function goToPage(page: number) {
    currentPage.value = Math.max(1, Math.min(page, totalPages.value));
}
</script>

<template>
    <DropdownMenu :open="open" @update:open="onOpenChange">
        <DropdownMenuTrigger as-child>
            <button
                type="button"
                class="inline-flex h-10 w-full items-center justify-start gap-2 rounded-lg border-2 border-input bg-background px-4 py-2 text-sm font-medium text-foreground shadow-modern outline-none transition-modern hover:border-primary hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
                <component
                    :is="currentIconComponent"
                    class="h-4 w-4 shrink-0"
                    aria-hidden
                />
                <span class="min-w-0 truncate">
                    {{ modelValue || 'Icon wählen' }}
                </span>
            </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-[320px]" align="start" @close-auto-focus="search = ''">
            <div class="p-2 pb-0">
                <Input
                    v-model="search"
                    placeholder="Icon suchen…"
                    class="h-8"
                    autocomplete="off"
                />
            </div>
            <div
                class="grid max-h-[280px] grid-cols-6 gap-0.5 overflow-y-auto p-2"
                style="grid-auto-rows: 2rem"
            >
                <button
                    v-for="name in paginatedIconNames"
                    :key="name"
                    type="button"
                    class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
                    :title="name"
                    :aria-label="name"
                    @click="select(name)"
                >
                    <component
                        :is="icons[name]"
                        class="h-4 w-4"
                        aria-hidden
                    />
                </button>
            </div>
            <p
                v-if="filteredIconNames.length === 0"
                class="p-2 text-center text-muted-foreground text-xs"
            >
                Kein Icon gefunden
            </p>
            <div
                v-else-if="totalPages > 1"
                class="flex items-center justify-between gap-2 border-t border-border px-2 py-1.5"
            >
                <button
                    type="button"
                    class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md hover:bg-accent disabled:pointer-events-none disabled:opacity-50"
                    :disabled="currentPage <= 1"
                    aria-label="Vorherige Seite"
                    @click="goToPage(currentPage - 1)"
                >
                    <ChevronLeft class="h-4 w-4" />
                </button>
                <span class="text-muted-foreground text-xs">
                    {{ currentPage }} / {{ totalPages }}
                </span>
                <button
                    type="button"
                    class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md hover:bg-accent disabled:pointer-events-none disabled:opacity-50"
                    :disabled="currentPage >= totalPages"
                    aria-label="Nächste Seite"
                    @click="goToPage(currentPage + 1)"
                >
                    <ChevronRight class="h-4 w-4" />
                </button>
            </div>
        </DropdownMenuContent>
    </DropdownMenu>
</template>
