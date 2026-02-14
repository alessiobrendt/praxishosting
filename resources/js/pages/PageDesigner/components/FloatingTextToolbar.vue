<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';
import { Button } from '@/components/ui/button';
import { useAiGenerateText, PROMPT_TEMPLATES, type PromptTemplateValue } from '@/pages/PageDesigner/composables/useAiGenerateText';
import { Bold, Italic, Underline, RemoveFormatting, Sparkles } from 'lucide-vue-next';

const props = withDefaults(
    defineProps<{
        editableRef: HTMLDivElement | HTMLSpanElement | null;
        isFocused?: boolean;
        pageName?: string | null;
        blockType?: string | null;
        onTextReplaced?: (text: string) => void;
        refreshBalance?: () => void;
    }>(),
    { isFocused: false, pageName: null, blockType: null },
);

const emit = defineEmits<{
    (e: 'replaceText', text: string): void;
}>();

const show = ref(false);
const rect = ref<DOMRect | null>(null);
const savedRange = ref<Range | null>(null);
const savedEditable = ref<HTMLDivElement | HTMLSpanElement | null>(null);
const aiPopoverOpen = ref(false);
let hideToolbarTimeout: ReturnType<typeof setTimeout> | null = null;
const promptTemplate = ref<PromptTemplateValue>('expand');
const additionalPrompt = ref('');
const aiError = ref<string | null>(null);

const { loading: aiLoading, generateText } = useAiGenerateText({
    refreshBalance: props.refreshBalance,
    onError: (err) => {
        aiError.value = err.message;
    },
    onSuccess: () => {
        aiError.value = null;
    },
});

function getEditableEl(): HTMLDivElement | HTMLSpanElement | null {
    const r = props.editableRef;
    if (!r) return null;
    if (r instanceof HTMLElement) return r as HTMLDivElement | HTMLSpanElement;
    if (typeof r === 'object' && r !== null && 'value' in r) {
        const v = (r as { value: unknown }).value;
        return v instanceof HTMLElement ? (v as HTMLDivElement | HTMLSpanElement) : null;
    }
    return null;
}

function getToolbarRect(): DOMRect | null {
    const sel = window.getSelection();
    if (sel && !sel.isCollapsed && sel.rangeCount > 0) {
        return sel.getRangeAt(0).getBoundingClientRect();
    }
    const el = getEditableEl();
    return el ? el.getBoundingClientRect() : null;
}

function hasSelection(): boolean {
    const el = getEditableEl();
    if (!el) return false;
    const sel = window.getSelection();
    if (sel && !sel.isCollapsed && sel.anchorNode != null) {
        return el.contains(sel.anchorNode) || el === sel.anchorNode;
    }
    return props.isFocused && document.activeElement !== null && (el.contains(document.activeElement) || el === document.activeElement);
}

function updatePosition(): void {
    if (hasSelection()) {
        if (hideToolbarTimeout) {
            clearTimeout(hideToolbarTimeout);
            hideToolbarTimeout = null;
        }
        rect.value = getToolbarRect();
        show.value = true;
        const el = getEditableEl();
        const sel = window.getSelection();
        if (el && sel && sel.rangeCount > 0) {
            savedRange.value = sel.getRangeAt(0).cloneRange();
            savedEditable.value = el;
        }
    } else {
        if (aiPopoverOpen.value) {
            return;
        }
        if (hideToolbarTimeout) clearTimeout(hideToolbarTimeout);
        hideToolbarTimeout = setTimeout(() => {
            hideToolbarTimeout = null;
            if (!hasSelection() && !aiPopoverOpen.value) {
                show.value = false;
                rect.value = null;
            }
        }, 200);
    }
}

function restoreSelection(): boolean {
    const range = savedRange.value;
    const el = savedEditable.value;
    if (!range || !el) return false;
    try {
        el.focus();
        const sel = window.getSelection();
        if (sel) {
            sel.removeAllRanges();
            sel.addRange(range);
            return true;
        }
    } catch {
        // range may be invalid if DOM changed
    }
    return false;
}

function escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

const FORMAT_STYLES: Record<'bold' | 'italic' | 'underline' | 'normal', string> = {
    bold: 'font-weight: 700 !important',
    italic: 'font-style: italic !important',
    underline: 'text-decoration: underline !important',
    normal: 'font-weight: 400 !important; font-style: normal !important; text-decoration: none !important',
};

function execFormat(cmd: 'bold' | 'italic' | 'underline' | 'normal'): void {
    const el = savedEditable.value ?? getEditableEl();
    if (!el) return;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0).cloneRange();
    if (range.collapsed) return;
    if (!el.contains(range.commonAncestorContainer)) return;
    const text = range.toString();
    if (!text) return;
    setTimeout(() => {
        try {
            el.focus();
            const s = window.getSelection();
            if (!s) return;
            s.removeAllRanges();
            s.addRange(range);
            range.deleteContents();
            const span = document.createElement('span');
            span.setAttribute('style', FORMAT_STYLES[cmd]);
            span.appendChild(document.createTextNode(text));
            range.insertNode(span);
            updatePosition();
        } catch {
            updatePosition();
        }
    }, 0);
}

async function onAiGenerate(): void {
    const el = savedEditable.value ?? getEditableEl();
    if (!el) return;

    const context = (el.innerText ?? el.textContent ?? '').trim();
    if (!context) {
        aiError.value = 'Kein Text zum Bearbeiten.';
        return;
    }

    aiError.value = null;
    const result = await generateText(
        context,
        promptTemplate.value,
        additionalPrompt.value.trim() || null,
        props.pageName,
        props.blockType,
    );

    if (result != null) {
        const isProse = el.classList.contains('prose') || el.querySelector('p');
        if (isProse) {
            el.innerHTML = `<p>${escapeHtml(result)}</p>`;
        } else {
            el.textContent = result;
        }
        props.onTextReplaced?.(result);
        emit('replaceText', result);
        aiPopoverOpen.value = false;
    }
}

onMounted(() => {
    window.addEventListener('selectionchange', updatePosition);
});

onUnmounted(() => {
    window.removeEventListener('selectionchange', updatePosition);
    if (hideToolbarTimeout) clearTimeout(hideToolbarTimeout);
});

watch(
    () => [props.editableRef, props.isFocused],
    () => updatePosition(),
    { immediate: true },
);

watch(aiPopoverOpen, (open) => {
    if (!open && !hasSelection()) {
        show.value = false;
        rect.value = null;
    }
});

const toolbarStyle = computed(() => {
    const r = rect.value;
    if (!r) return undefined;
    const innerHeight = typeof window !== 'undefined' ? window.innerHeight : 0;
    return {
        left: `${r.left + r.width / 2}px`,
        bottom: `${innerHeight - r.top + 8}px`,
        transform: 'translate(-50%, 0)',
    };
});
</script>

<template>
    <Teleport to="body">
        <div
            v-if="show && rect"
            class="fixed z-[100] flex items-center gap-0.5 rounded-lg border border-border bg-popover px-1 py-0.5 shadow-md"
            :style="toolbarStyle"
        >
            <div class="relative">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    class="h-8 w-8"
                    title="KI-Author"
                    @mousedown.prevent="aiPopoverOpen = !aiPopoverOpen"
                >
                    <Sparkles class="h-3.5 w-3.5" />
                </Button>
                <div
                    v-if="aiPopoverOpen"
                    class="absolute bottom-full left-1/2 z-[110] mb-1 min-w-[220px] -translate-x-1/2 rounded-lg border border-border bg-popover p-2 shadow-lg"
                >
                    <p class="text-xs font-medium">Vorlage</p>
                    <div class="mt-1 flex flex-wrap gap-1">
                        <button
                            v-for="t in PROMPT_TEMPLATES"
                            :key="t.value"
                            type="button"
                            class="rounded border px-2 py-1 text-xs transition-colors"
                            :class="promptTemplate === t.value ? 'border-primary bg-primary/10 text-primary' : 'border-input bg-background hover:bg-muted'"
                            @mousedown.prevent
                            @click="promptTemplate = t.value"
                        >
                            {{ t.label }}
                        </button>
                    </div>
                    <label class="mt-2 block text-xs font-medium">Zusatz (optional)</label>
                    <input
                        v-model="additionalPrompt"
                        type="text"
                        class="mt-1 w-full rounded border border-input bg-background px-2 py-1.5 text-sm"
                        placeholder="z.B. im Ton von XY"
                        @mousedown.stop
                    >
                    <p v-if="aiError" class="mt-1 text-xs text-destructive">
                        {{ aiError }}
                    </p>
                    <Button
                        type="button"
                        size="sm"
                        class="mt-2 w-full"
                        :disabled="aiLoading"
                        @mousedown.prevent
                        @click="onAiGenerate"
                    >
                        <span v-if="aiLoading" class="animate-pulse">Generieren…</span>
                        <span v-else>Generieren</span>
                    </Button>
                </div>
            </div>
            <div class="h-4 w-px bg-border" />
            <Button
                type="button"
                variant="ghost"
                size="icon"
                class="h-8 w-8"
                title="Fett"
                @mousedown.prevent="execFormat('bold')"
            >
                <Bold class="h-3.5 w-3.5" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                class="h-8 w-8"
                title="Kursiv"
                @mousedown.prevent="execFormat('italic')"
            >
                <Italic class="h-3.5 w-3.5" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                class="h-8 w-8"
                title="Unterstrichen"
                @mousedown.prevent="execFormat('underline')"
            >
                <Underline class="h-3.5 w-3.5" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                class="h-8 w-8"
                title="Normale Schrift"
                @mousedown.prevent="execFormat('normal')"
            >
                <RemoveFormatting class="h-3.5 w-3.5" />
            </Button>
        </div>
    </Teleport>
</template>
