<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ColorPicker from '@/components/ColorPicker.vue';
import { Plus, Trash2, HelpCircle, Edit } from 'lucide-vue-next';
import Tooltip from '@/components/ui/tooltip/Tooltip.vue';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

interface Props {
    id: string;
    name: string;
    label: string;
    modelValue: any[];
    placeholder?: string;
    showLabel?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
    'update:modelValue': [value: any[]];
}>();

// Initialize items from props
const initializeItems = (): any[] => {
    console.log('ArrayBuilder: Initializing with modelValue:', props.modelValue, 'Type:', typeof props.modelValue, 'IsArray:', Array.isArray(props.modelValue));
    
    if (!props.modelValue) {
        console.log('ArrayBuilder: modelValue is null/undefined, creating empty object');
        return [{}];
    }
    
    if (!Array.isArray(props.modelValue)) {
        console.log('ArrayBuilder: modelValue is not an array, creating empty object');
        return [{}];
    }
    
    if (props.modelValue.length === 0) {
        console.log('ArrayBuilder: Array is empty, creating empty object');
        return [{}];
    }
    
    console.log('ArrayBuilder: Found', props.modelValue.length, 'items');
    return [...props.modelValue];
};

const items = ref<any[]>(initializeItems());

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
    console.log('ArrayBuilder: modelValue changed:', newValue, 'Type:', typeof newValue, 'IsArray:', Array.isArray(newValue));
    
    if (!newValue) {
        items.value = [{}];
        return;
    }
    
    if (!Array.isArray(newValue)) {
        console.warn('ArrayBuilder: modelValue is not an array:', newValue);
        items.value = [{}];
        return;
    }
    
    if (newValue.length > 0) {
        items.value = [...newValue];
    } else {
        items.value = [{}];
    }
}, { deep: true, immediate: true });

// Get template from first item
const template = computed(() => {
    if (items.value.length === 0) {
        return {};
    }
    return items.value[0] || {};
});

// Get keys from template
const fieldKeys = computed(() => {
    return Object.keys(template.value);
});

const addItem = () => {
    // Create new item based on template
    const newItem: Record<string, any> = {};
    for (const key of fieldKeys.value) {
        const templateValue = template.value[key];
        if (Array.isArray(templateValue)) {
            newItem[key] = [];
        } else if (typeof templateValue === 'object' && templateValue !== null) {
            newItem[key] = { ...templateValue };
        } else {
            newItem[key] = typeof templateValue === 'string' ? '' : (typeof templateValue === 'number' ? 0 : false);
        }
    }
    items.value.push(newItem);
    emit('update:modelValue', items.value);
};

const removeItem = (index: number) => {
    if (items.value.length > 1) {
        items.value.splice(index, 1);
        emit('update:modelValue', items.value);
    }
};

const updateItemField = (index: number, key: string, value: any) => {
    if (!items.value[index]) {
        items.value[index] = {};
    }
    items.value[index][key] = value;
    emit('update:modelValue', [...items.value]);
};

const getFieldType = (value: any): string => {
    if (typeof value === 'boolean') return 'checkbox';
    if (typeof value === 'number') return 'number';
    if (Array.isArray(value)) return 'array';
    if (typeof value === 'object' && value !== null) return 'object';
    if (typeof value === 'string') {
        if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value) || value.startsWith('rgb') || value.startsWith('hsl')) {
            return 'color';
        }
        if (value.startsWith('http') || value.startsWith('/')) {
            return 'url';
        }
        if (value.length > 50) {
            return 'textarea';
        }
        return 'text';
    }
    return 'text';
};

const formatLabel = (key: string): string => {
    return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase())
        .trim();
};

const hrefTooltip = `URLs können sein:
• Absolute URLs: https://example.com/page
• Relative URLs: /page oder /about
• Anchors: #section
• Query-Parameter: /page?param=value`;

const isOpen = ref(false);

const saveAndClose = () => {
    emit('update:modelValue', items.value);
    isOpen.value = false;
};

const getItemCount = computed(() => {
    if (!props.modelValue || !Array.isArray(props.modelValue)) {
        return 0;
    }
    return props.modelValue.length;
});
</script>

<template>
    <div class="grid gap-2">
        <div class="flex items-center justify-between">
            <Label :for="id" class="text-xs" v-if="showLabel">{{ label }}</Label>
            <Dialog v-model="isOpen">
                <DialogTrigger as-child>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        class="h-7"
                    >
                        <Edit class="h-3 w-3 mr-1" />
                        Bearbeiten ({{ getItemCount }})
                    </Button>
                </DialogTrigger>
                <DialogContent class="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{{ label }} bearbeiten</DialogTitle>
                    </DialogHeader>
                    
                    <div class="space-y-4">
                        <div class="flex justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                @click="addItem"
                                class="h-7"
                            >
                                <Plus class="h-3 w-3 mr-1" />
                                Hinzufügen
                            </Button>
                        </div>

                        <div class="space-y-4">
            <div
                v-for="(item, index) in items"
                :key="index"
                class="space-y-3 rounded-md border border-input/50 bg-muted/30 p-4"
            >
                <div class="flex items-center justify-between">
                    <span class="text-xs font-medium text-muted-foreground">
                        Eintrag #{{ index + 1 }}
                    </span>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        @click="removeItem(index)"
                        :disabled="items.length === 1"
                        class="h-6 w-6 p-0 text-destructive hover:text-destructive"
                    >
                        <Trash2 class="h-3 w-3" />
                    </Button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                        v-for="key in fieldKeys"
                        :key="key"
                        class="grid gap-2"
                    >
                        <div class="flex items-center gap-1.5 min-h-[20px]">
                            <Label :for="`${id}-${index}-${key}`" class="text-xs leading-tight flex-shrink-0">
                                {{ formatLabel(key) }}
                            </Label>
                            <Tooltip v-if="key.toLowerCase().includes('href') || key.toLowerCase().includes('url')" position="top">
                                <button type="button" class="inline-flex items-center flex-shrink-0">
                                    <HelpCircle class="h-3 w-3 text-muted-foreground cursor-help" />
                                </button>
                                <template #content>
                                    <p class="text-xs whitespace-pre-line">{{ hrefTooltip }}</p>
                                </template>
                            </Tooltip>
                        </div>

                        <!-- Render appropriate input based on field type -->
                        <Input
                            v-if="getFieldType(item[key]) === 'text' || getFieldType(item[key]) === 'url'"
                            :id="`${id}-${index}-${key}`"
                            :name="`${name}[${index}][${key}]`"
                            :model-value="String(item[key] ?? '')"
                            :placeholder="placeholder"
                            @update:model-value="(val) => updateItemField(index, key, val)"
                        />

                        <Textarea
                            v-else-if="getFieldType(item[key]) === 'textarea'"
                            :id="`${id}-${index}-${key}`"
                            :name="`${name}[${index}][${key}]`"
                            :model-value="String(item[key] ?? '')"
                            :placeholder="placeholder"
                            @update:model-value="(val) => updateItemField(index, key, val)"
                            rows="3"
                        />

                        <Input
                            v-else-if="getFieldType(item[key]) === 'number'"
                            :id="`${id}-${index}-${key}`"
                            :name="`${name}[${index}][${key}]`"
                            type="number"
                            :model-value="item[key] ?? 0"
                            @update:model-value="(val) => updateItemField(index, key, val ? parseFloat(String(val)) : 0)"
                        />

                        <ColorPicker
                            v-else-if="getFieldType(item[key]) === 'color'"
                            :id="`${id}-${index}-${key}`"
                            :name="`${name}[${index}][${key}]`"
                            :model-value="String(item[key] ?? '')"
                            :placeholder="placeholder || '#000000'"
                            @update:model-value="(val) => updateItemField(index, key, val)"
                        />

                        <div v-else-if="getFieldType(item[key]) === 'checkbox'" class="flex items-center space-x-2">
                            <input
                                :id="`${id}-${index}-${key}`"
                                :name="`${name}[${index}][${key}]`"
                                type="checkbox"
                                :checked="item[key] ?? false"
                                @change="(e) => updateItemField(index, key, (e.target as HTMLInputElement).checked)"
                                class="h-4 w-4 rounded border-input"
                            />
                            <Label :for="`${id}-${index}-${key}`" class="text-sm font-normal">
                                {{ item[key] ? 'Ja' : 'Nein' }}
                            </Label>
                        </div>

                        <Textarea
                            v-else
                            :id="`${id}-${index}-${key}`"
                            :name="`${name}[${index}][${key}]`"
                            :model-value="JSON.stringify(item[key], null, 2)"
                            @update:model-value="(val) => { try { updateItemField(index, key, JSON.parse(val)); } catch {} }"
                            rows="4"
                            class="font-mono text-sm"
                        />
                    </div>
                </div>
            </div>

                            <div v-if="items.length === 0" class="text-center text-sm text-muted-foreground py-4">
                                Keine Einträge vorhanden. Klicken Sie auf "Hinzufügen", um einen Eintrag zu erstellen.
                            </div>
                        </div>
                        
                        <div class="flex justify-end gap-2 pt-4 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                @click="isOpen = false"
                            >
                                Abbrechen
                            </Button>
                            <Button
                                type="button"
                                @click="saveAndClose"
                            >
                                Speichern
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    </div>
</template>
