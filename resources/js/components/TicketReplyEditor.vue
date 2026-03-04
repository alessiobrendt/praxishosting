<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { watch, onBeforeUnmount, ref } from 'vue';
import { Bold, Italic, Underline, Quote, Code, RemoveFormatting, LayoutTemplate } from 'lucide-vue-next';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export type TicketMessageTemplateItem = {
    id: number;
    name: string;
    body: string | null;
};

const props = withDefaults(
    defineProps<{
        modelValue?: string;
        placeholder?: string;
        minHeight?: string;
        id?: string;
        disabled?: boolean;
        showTemplates?: boolean;
        templates?: TicketMessageTemplateItem[];
        templateReplacements?: Record<string, string>;
    }>(),
    {
        modelValue: '',
        placeholder: 'Nachricht...',
        minHeight: '120px',
        disabled: false,
        showTemplates: false,
        templates: () => [],
        templateReplacements: () => ({}),
    },
);

const templatesModalOpen = ref(false);

function replacePlaceholders(text: string): string {
    if (!text) return '';
    const repl = props.templateReplacements ?? {};
    return text.replace(/\{\{(\w+)\}\}/g, (_, key) => repl[key] ?? '');
}

function insertTemplate(templateBody: string | null) {
    if (!templateBody || !editor.value) return;
    const html = replacePlaceholders(templateBody);
    editor.value.chain().focus().insertContent(html).run();
    templatesModalOpen.value = false;
}

function stripHtmlPreview(html: string | null): string {
    if (!html) return '';
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent?.trim().slice(0, 60) ?? '';
}

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
}>();

function toHtml(val: string | undefined): string {
    if (!val || typeof val !== 'string') return '';
    const trimmed = val.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('<') && trimmed.includes('>')) return val;
    return `<p>${trimmed.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`;
}

const editor = useEditor({
    content: toHtml(props.modelValue),
    editable: !props.disabled,
    extensions: [
        StarterKit.configure({
            heading: false,
            codeBlock: true,
        }),
        Placeholder.configure({
            placeholder: props.placeholder,
        }),
    ],
    onUpdate: ({ editor }) => {
        emit('update:modelValue', editor.getHTML());
    },
    editorProps: {
        attributes: {
            class:
                'min-h-[120px] w-full px-3 py-2 text-sm focus:outline-none prose prose-sm max-w-none dark:prose-invert [&_p]:mb-1 [&_p:last-child]:mb-0',
        },
    },
});

watch(
    () => props.modelValue,
    (val) => {
        if (editor.value) {
            const html = toHtml(val);
            if (html !== editor.value.getHTML()) {
                editor.value.commands.setContent(html, false);
            }
        }
    },
);

watch(
    () => props.disabled,
    (val) => {
        editor.value?.setEditable(!val);
    },
);

onBeforeUnmount(() => {
    editor.value?.destroy();
});

function clearFormatting() {
    editor.value?.chain().focus().clearNodes().unsetAllMarks().run();
}
</script>

<template>
    <div
        class="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
        :class="{ 'opacity-60 cursor-not-allowed': disabled }"
        :style="{ minHeight }"
    >
        <!-- Toolbar (wie Quill ql-toolbar) -->
        <div
            v-if="editor"
            role="toolbar"
            aria-label="Formatierung"
            class="flex flex-wrap items-center gap-0.5 border-b border-gray-200 bg-gray-50 px-2 py-1 dark:border-gray-700 dark:bg-gray-800/50"
        >
            <span v-if="showTemplates" class="flex items-center gap-0.5">
                <button
                    type="button"
                    class="rounded p-1.5 text-gray-600 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                    aria-label="Vorlagen"
                    title="Vorlagen"
                    @click="templatesModalOpen = true"
                >
                    <LayoutTemplate class="h-4 w-4" />
                </button>
            </span>
            <span v-if="showTemplates" class="mx-1 w-px self-stretch bg-gray-200 dark:bg-gray-600" />
            <span class="flex items-center gap-0.5">
                <button
                    type="button"
                    class="rounded p-1.5 text-gray-600 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                    aria-label="Fett"
                    :aria-pressed="editor.isActive('bold')"
                    @click="editor.chain().focus().toggleBold().run()"
                >
                    <Bold class="h-4 w-4" />
                </button>
                <button
                    type="button"
                    class="rounded p-1.5 text-gray-600 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                    aria-label="Kursiv"
                    :aria-pressed="editor.isActive('italic')"
                    @click="editor.chain().focus().toggleItalic().run()"
                >
                    <Italic class="h-4 w-4" />
                </button>
                <button
                    type="button"
                    class="rounded p-1.5 text-gray-600 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                    aria-label="Unterstrichen"
                    :aria-pressed="editor.isActive('underline')"
                    @click="editor.chain().focus().toggleUnderline().run()"
                >
                    <Underline class="h-4 w-4" />
                </button>
            </span>
            <span class="mx-1 w-px self-stretch bg-gray-200 dark:bg-gray-600" />
            <span class="flex items-center gap-0.5">
                <button
                    type="button"
                    class="rounded p-1.5 text-gray-600 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                    aria-label="Zitat"
                    :aria-pressed="editor.isActive('blockquote')"
                    @click="editor.chain().focus().toggleBlockquote().run()"
                >
                    <Quote class="h-4 w-4" />
                </button>
                <button
                    type="button"
                    class="rounded p-1.5 text-gray-600 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                    aria-label="Code"
                    :aria-pressed="editor.isActive('code')"
                    @click="editor.chain().focus().toggleCode().run()"
                >
                    <Code class="h-4 w-4" />
                </button>
            </span>
            <span class="mx-1 w-px self-stretch bg-gray-200 dark:bg-gray-600" />
            <button
                type="button"
                class="rounded p-1.5 text-gray-600 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                aria-label="Formatierung entfernen"
                @click="clearFormatting"
            >
                <RemoveFormatting class="h-4 w-4" />
            </button>
        </div>
        <EditorContent
            v-if="editor"
            :editor="editor"
            :id="id"
            class="min-h-[100px]"
        />

        <Dialog v-if="showTemplates" :open="templatesModalOpen" @update:open="(v: boolean) => (templatesModalOpen = v)">
            <DialogContent class="w-full max-w-2xl sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Vorlagen</DialogTitle>
                    <DialogDescription>Vorlage wählen – Platzhalter werden beim Einfügen ersetzt.</DialogDescription>
                </DialogHeader>
                <div class="max-h-[60vh] space-y-1 overflow-y-auto py-2">
                    <button
                        v-for="t in templates"
                        :key="t.id"
                        type="button"
                        class="flex w-full flex-col gap-0.5 rounded-lg border border-gray-200 px-3 py-2.5 text-left text-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                        @click="insertTemplate(t.body)"
                    >
                        <span class="font-medium text-gray-900 dark:text-gray-100">{{ t.name }}</span>
                        <span v-if="t.body" class="truncate text-xs text-gray-500 dark:text-gray-400">{{ stripHtmlPreview(t.body) }}</span>
                    </button>
                    <p v-if="templates.length === 0" class="py-4 text-center text-sm text-gray-500 dark:text-gray-400">Keine Vorlagen vorhanden.</p>
                </div>
            </DialogContent>
        </Dialog>
    </div>
</template>
