<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue';

const props = withDefaults(
    defineProps<{
        modelValue: string;
        designMode?: boolean;
        /** When true, this field is shown as contenteditable (e.g. block is selected). */
        isSelected?: boolean;
        /** HTML tag for static display (e.g. 'h1', 'p', 'span'). */
        tag?: string;
        /** Optional placeholder when empty. */
        placeholder?: string;
        class?: string;
    }>(),
    { designMode: false, isSelected: false, tag: 'span', placeholder: '' },
);

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
}>();

const editable = ref<HTMLDivElement | null>(null);
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
    const text = (editable.value.textContent ?? '').trim();
    emit('update:modelValue', text);
    isEditing.value = false;
}

function onInput(): void {
    if (!editable.value) return;
    emit('update:modelValue', editable.value.textContent ?? '');
}

watch(
    () => props.modelValue,
    (val) => {
        if (editable.value && document.activeElement !== editable.value) {
            editable.value.textContent = val ?? '';
        }
    },
    { immediate: true },
);

watch(canEdit, (active) => {
    if (active) {
        nextTick(() => {
            if (editable.value) editable.value.textContent = props.modelValue ?? '';
        });
    }
});
</script>

<template>
    <component
        :is="tag"
        v-if="!canEdit"
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
        :class="[props.class, 'min-w-0 rounded px-0.5 py-0 outline-none ring-1 ring-primary/50 focus:ring-primary']"
        :data-placeholder="placeholder"
        @blur="onBlur"
        @input="onInput"
    />
</template>
