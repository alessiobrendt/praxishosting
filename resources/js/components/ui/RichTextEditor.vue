<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3';
import { BubbleMenu } from '@tiptap/vue-3/menus';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { watch, onBeforeUnmount, inject, ref } from 'vue';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAiGenerateText, PROMPT_TEMPLATES, type PromptTemplateValue } from '@/pages/PageDesigner/composables/useAiGenerateText';
import { Bold, Italic, Underline, Sparkles } from 'lucide-vue-next';

const props = withDefaults(
    defineProps<{
        modelValue?: string;
        placeholder?: string;
        minHeight?: string;
        id?: string;
        disabled?: boolean;
        pageName?: string | null;
        blockType?: string | null;
        showAiToolbar?: boolean;
    }>(),
    {
        modelValue: '',
        placeholder: '',
        minHeight: '80px',
        disabled: false,
        pageName: null,
        blockType: null,
        showAiToolbar: false,
    },
);

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
            heading: { levels: [1, 2, 3] },
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
                'min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 [&_p]:mb-1 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6',
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

const refreshAiBalance = inject<() => Promise<void>>('refreshAiBalance', async () => {});
const aiPopoverOpen = ref(false);
const promptTemplate = ref<PromptTemplateValue>('expand');
const additionalPrompt = ref('');
const aiError = ref<string | null>(null);

const { loading: aiLoading, generateText } = useAiGenerateText({
    refreshBalance: refreshAiBalance,
    onError: (err) => {
        aiError.value = err.message;
    },
    onSuccess: () => {
        aiError.value = null;
    },
});

async function onAiGenerate(): void {
    const ed = editor.value;
    if (!ed) return;
    const { from, to } = ed.state.selection;
    const context = ed.state.doc.textBetween(from, to, ' ').trim();
    if (!context) return;

    aiError.value = null;
    const result = await generateText(
        context,
        promptTemplate.value,
        additionalPrompt.value.trim() || null,
        props.pageName,
        props.blockType,
    );

    if (result != null) {
        ed.chain().focus().insertContent(result).run();
        aiPopoverOpen.value = false;
    }
}
</script>

<template>
    <div
        class="tiptap-editor-wrapper rounded-md border border-input bg-background"
        :class="{ 'opacity-60 cursor-not-allowed': disabled }"
        :style="{ minHeight }"
    >
        <EditorContent
            v-if="editor"
            :editor="editor"
            :id="id"
            class="prose prose-sm max-w-none dark:prose-invert"
        />
        <BubbleMenu
            v-if="editor && showAiToolbar"
            :editor="editor"
            class="flex items-center gap-0.5 rounded-lg border border-border bg-popover px-1 py-0.5 shadow-md"
        >
            <DropdownMenu v-model:open="aiPopoverOpen">
                <DropdownMenuTrigger as-child>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        class="h-8 w-8"
                        title="KI-Author"
                    >
                        <Sparkles class="h-3.5 w-3.5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    class="min-w-[200px]"
                    align="center"
                    :side="'top'"
                >
                    <div class="space-y-2 p-2">
                        <label class="text-xs font-medium">Vorlage</label>
                        <select
                            v-model="promptTemplate"
                            class="w-full rounded border border-input bg-background px-2 py-1.5 text-sm"
                        >
                            <option
                                v-for="t in PROMPT_TEMPLATES"
                                :key="t.value"
                                :value="t.value"
                            >
                                {{ t.label }}
                            </option>
                        </select>
                        <label class="text-xs font-medium">Zusatz (optional)</label>
                        <input
                            v-model="additionalPrompt"
                            type="text"
                            class="w-full rounded border border-input bg-background px-2 py-1.5 text-sm"
                            placeholder="z.B. im Ton von XY"
                        >
                        <p v-if="aiError" class="text-xs text-destructive">
                            {{ aiError }}
                        </p>
                        <Button
                            type="button"
                            size="sm"
                            class="w-full"
                            :disabled="aiLoading"
                            @click="onAiGenerate"
                        >
                            <span v-if="aiLoading" class="animate-pulse">Generieren…</span>
                            <span v-else>Generieren</span>
                        </Button>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
            <div class="h-4 w-px bg-border" />
            <Button
                type="button"
                variant="ghost"
                size="icon"
                class="h-8 w-8"
                title="Fett"
                @click="editor?.chain().focus().toggleBold().run()"
            >
                <Bold class="h-3.5 w-3.5" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                class="h-8 w-8"
                title="Kursiv"
                @click="editor?.chain().focus().toggleItalic().run()"
            >
                <Italic class="h-3.5 w-3.5" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                class="h-8 w-8"
                title="Unterstrichen"
                @click="editor?.chain().focus().toggleUnderline().run()"
            >
                <Underline class="h-3.5 w-3.5" />
            </Button>
        </BubbleMenu>
    </div>
</template>
