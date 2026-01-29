<script lang="ts" setup>

import { LucideChevronDown, LucideChevronUp } from '#components';
const isOpen = ref(false);

defineProps<{
    question: string;
    answer: string;
}>();

function toggleAccordion() {
    isOpen.value = !isOpen.value;
}

</script>

<template>


    <div class="flex flex-col">
        <div>
            <div class="flex items-center justify-between">
                <h2 class="font-semibold text-md text-slate-900 hover:underline" @click="toggleAccordion">{{ question }}
                </h2>
                <component class="text-slate-600 text-xs" :is="isOpen ? LucideChevronUp : LucideChevronDown">
                </component>
            </div>
            <hr />
        </div>
        <p class="mt-2 text-sm text-slate-700" v-if="isOpen">{{ answer }}</p>
    </div>
</template>