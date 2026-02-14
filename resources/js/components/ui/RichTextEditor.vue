<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { watch, onBeforeUnmount } from 'vue';

const props = withDefaults(
    defineProps<{
        modelValue?: string;
        placeholder?: string;
        minHeight?: string;
        id?: string;
        disabled?: boolean;
    }>(),
    {
        modelValue: '',
        placeholder: '',
        minHeight: '80px',
        disabled: false,
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
    </div>
</template>
