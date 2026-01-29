<script setup lang="ts">
import { ref, watch } from 'vue';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Pipette } from 'lucide-vue-next';

interface Props {
    id?: string;
    name?: string;
    label?: string;
    modelValue?: string;
    placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
    placeholder: '#000000',
});

const emit = defineEmits<{
    'update:modelValue': [value: string];
}>();

const colorValue = ref(props.modelValue || '');

watch(() => props.modelValue, (newValue) => {
    colorValue.value = newValue || '';
});

const updateColor = (value: string) => {
    colorValue.value = value;
    emit('update:modelValue', value);
};

const handleColorInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    updateColor(target.value);
};

const useEyeDropper = async () => {
    if (!('EyeDropper' in window)) {
        alert('EyeDropper API wird von Ihrem Browser nicht unterstützt.');
        return;
    }

    try {
        const eyeDropper = new (window as any).EyeDropper();
        const result = await eyeDropper.open();
        updateColor(result.sRGBHex);
    } catch (error: any) {
        if (error.name !== 'AbortError') {
            console.error('EyeDropper Fehler:', error);
        }
    }
};

const presetColors = [
    '#000000', '#ffffff', '#ef4444', '#f97316', '#f59e0b',
    '#eab308', '#84cc16', '#22c55e', '#10b981', '#14b8a6',
    '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7',
    '#d946ef', '#ec4899', '#f43f5e', '#64748b', '#475569',
];
</script>

<template>
    <div class="grid gap-2">
        <Label v-if="label" :for="id" class="text-xs">{{ label }}</Label>
        <div class="flex gap-2">
            <Input
                :id="id"
                :name="name"
                :model-value="colorValue"
                :placeholder="placeholder"
                @update:model-value="updateColor"
                class="flex-1"
            />
            <DropdownMenu>
                <DropdownMenuTrigger as-child>
                    <Button
                        type="button"
                        variant="outline"
                        class="h-9 w-16 p-0 border border-input"
                        :style="{ backgroundColor: colorValue || 'transparent' }"
                    >
                        <span class="sr-only">Farbe auswählen</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent class="w-64 p-3">
                    <div class="space-y-3">
                        <div class="flex gap-2">
                            <Input
                                type="color"
                                :value="colorValue || '#000000'"
                                @input="handleColorInput"
                                class="h-10 w-20 cursor-pointer"
                            />
                            <Input
                                :model-value="colorValue"
                                @update:model-value="updateColor"
                                placeholder="#000000"
                                class="flex-1"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                @click="useEyeDropper"
                                title="Pipette verwenden"
                            >
                                <Pipette class="h-4 w-4" />
                            </Button>
                        </div>
                        <div>
                            <Label class="text-xs mb-2 block">Vordefinierte Farben</Label>
                            <div class="grid grid-cols-10 gap-1">
                                <button
                                    v-for="color in presetColors"
                                    :key="color"
                                    type="button"
                                    class="h-6 w-6 rounded border border-input hover:scale-110 transition-transform"
                                    :style="{ backgroundColor: color }"
                                    @click="updateColor(color)"
                                    :title="color"
                                />
                            </div>
                        </div>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    </div>
</template>
