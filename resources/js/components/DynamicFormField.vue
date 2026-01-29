<script setup lang="ts">
import { computed, watch } from 'vue';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ColorPicker from '@/components/ColorPicker.vue';
import ArrayBuilder from '@/components/ArrayBuilder.vue';

interface Props {
    id: string;
    name: string;
    label: string;
    modelValue: any;
    placeholder?: string;
    showLabel?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    showLabel: true,
});

const emit = defineEmits<{
    'update:modelValue': [value: any];
}>();

// Debug: Log modelValue changes
watch(() => props.modelValue, (newVal) => {
    console.log(`DynamicFormField [${props.id}]: modelValue changed:`, newVal, 'Type:', typeof newVal);
}, { immediate: true });

const fieldType = computed(() => {
    const value = props.modelValue;
    
    if (typeof value === 'boolean') {
        return 'checkbox';
    }
    if (typeof value === 'number') {
        return 'number';
    }
    if (Array.isArray(value)) {
        return 'array';
    }
    if (typeof value === 'object' && value !== null) {
        return 'object';
    }
    if (typeof value === 'string') {
        // Check if it's a color (hex, rgb, etc.)
        if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value) || value.startsWith('rgb') || value.startsWith('hsl')) {
            return 'color';
        }
        // Check if it's a URL
        if (value.startsWith('http') || value.startsWith('/')) {
            return 'url';
        }
        // Check if it's a long text (more than 50 chars)
        if (value.length > 50) {
            return 'textarea';
        }
        return 'text';
    }
    return 'text';
});

const updateValue = (newValue: any) => {
    emit('update:modelValue', newValue);
};

const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    updateValue(target.value);
};

const handleTextarea = (event: Event) => {
    const target = event.target as HTMLTextAreaElement;
    updateValue(target.value);
};

const handleNumber = (event: Event) => {
    const target = event.target as HTMLInputElement;
    updateValue(target.value ? parseFloat(target.value) : 0);
};

const handleCheckbox = (event: Event) => {
    const target = event.target as HTMLInputElement;
    updateValue(target.checked);
};
</script>

<template>
    <div class="grid gap-2">
        <Label v-if="showLabel && label" :for="id" class="text-xs">{{ label }}</Label>
     
        <!-- Text Input -->
        <Input
            v-if="fieldType === 'text' || fieldType === 'url'"
            :id="id"
            :name="name"
            :model-value="String(modelValue ?? '')"
            :placeholder="placeholder"
            @update:model-value="updateValue"
        />
        
        <!-- Textarea -->
        <Textarea
            v-else-if="fieldType === 'textarea'"
            :id="id"
            :name="name"
            :model-value="String(modelValue ?? '')"
            :placeholder="placeholder"
            @update:model-value="updateValue"
            :rows="3"
        />
        
        <!-- Number Input -->
        <Input
            v-else-if="fieldType === 'number'"
            :id="id"
            :name="name"
            type="number"
            :model-value="modelValue ?? 0"
            :placeholder="placeholder"
            @update:model-value="(val) => updateValue(val ? parseFloat(String(val)) : 0)"
        />
        
        <!-- Color Picker -->
        <ColorPicker
            v-else-if="fieldType === 'color'"
            :id="id"
            :name="name"
            :model-value="modelValue ?? ''"
            :placeholder="placeholder || '#000000'"
            @update:model-value="updateValue"
        />
        
        <!-- Checkbox -->
        <div v-else-if="fieldType === 'checkbox'" class="flex items-center space-x-2">
            <input
                :id="id"
                :name="name"
                type="checkbox"
                :checked="modelValue"
                @change="handleCheckbox"
                class="h-4 w-4 rounded border-input"
            />
            <Label :for="id" class="text-sm font-normal">{{ modelValue ? 'Ja' : 'Nein' }}</Label>
        </div>
        
        <!-- Array Builder -->
        <ArrayBuilder
            v-else-if="fieldType === 'array'"
            :id="id"
            :name="name"
            :label="label"
            :model-value="Array.isArray(modelValue) ? modelValue : []"
            :placeholder="placeholder"
            @update:model-value="updateValue",
            :showLabel="false"
        />
        
        <!-- Object - Show as JSON string for now -->
        <Textarea
            v-else
            :id="id"
            :name="name"
            :value="JSON.stringify(modelValue, null, 2)"
            :placeholder="placeholder"
            @input="(e: Event) => { try { updateValue(JSON.parse((e.target as HTMLTextAreaElement).value)); } catch {} }"
            :rows="4"
            class="font-mono text-sm"
        />
    </div>
</template>
