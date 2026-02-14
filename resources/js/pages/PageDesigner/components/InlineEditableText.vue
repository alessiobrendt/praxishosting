<script setup lang="ts">
import { ref, watch, nextTick, computed, inject } from 'vue';

const props = withDefaults(
    defineProps<{
        modelValue: string;
        designMode?: boolean;
        isSelected?: boolean;
        entryId: string;
        fieldKey: string;
        tag?: string;
        placeholder?: string;
        html?: boolean;
        class?: string;
    }>(),
    { designMode: false, isSelected: false, tag: 'span', placeholder: '', html: false },
);

const updateBlockField = inject<(entryId: string, fieldKey: string, value: string) => void>('updateBlockField', null);

const editable = ref<HTMLElement | null>(null);
const isEditing = ref(false);

const canEdit = computed(() => props.designMode && (props.isSelected || isEditing.value));

function startEdit(): void {
    if (!props.designMode) return;
    isEditing.value = true;
    nextTick(() => {
        editable.value?.focus();
        if (editable.value && document.getSelection()) {
            const range = document.createRange();
            range.selectNodeContents(editable.value);
            document.getSelection()?.removeAllRanges();
            document.getSelection()?.addRange(range);
        }
    });
}

function onBlur(): void {
    if (!editable.value) return;
    const val = props.html ? editable.value.innerHTML : (editable.value.textContent ?? '').trim();
    if (updateBlockField) {
        updateBlockField(props.entryId, props.fieldKey, val);
    }
    emit('update:modelValue', val);
    isEditing.value = false;
}

function onKeydown(e: KeyboardEvent): void {
    if (e.key === 'Escape') {
        (e.target as HTMLElement).blur();
    }
}

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
}>();

watch(
    () => props.modelValue,
    (val) => {
        if (editable.value && document.activeElement !== editable.value) {
            if (props.html) {
                editable.value.innerHTML = val ?? '';
            } else {
                editable.value.textContent = val ?? '';
            }
        }
    },
    { immediate: true },
);

watch(canEdit, (active) => {
    if (active) {
        nextTick(() => {
            if (editable.value) {
                if (props.html) {
                    editable.value.innerHTML = props.modelValue ?? '';
                } else {
                    editable.value.textContent = props.modelValue ?? '';
                }
            }
        });
    }
});
</script>

<template>
    <component
        :is="tag"
        v-if="!canEdit && html"
        :class="[props.class, 'prose prose-sm max-w-none', designMode && 'cursor-text rounded px-0.5 py-0 hover:bg-primary/10']"
        v-html="modelValue || placeholder || '\u200B'"
        @click="startEdit"
    />
    <component
        :is="tag"
        v-else-if="!canEdit"
        :class="[props.class, designMode && 'cursor-text rounded px-0.5 py-0 hover:bg-primary/10']"
        @click="startEdit"
    >
        {{ modelValue || placeholder }}
    </component>
    <component
        :is="tag"
        v-else
        ref="editable"
        contenteditable="true"
        role="textbox"
        :class="[props.class, html ? 'prose prose-sm max-w-none' : '', 'min-w-0 rounded px-0.5 py-0 outline-none ring-1 ring-primary/50 focus:ring-primary']"
        :data-placeholder="placeholder"
        @blur="onBlur"
        @keydown="onKeydown"
    />
</template>
