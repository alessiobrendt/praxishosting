<!-- Admin: Hosting-Server Seitenkopf (Titel, Beschreibung, Aktion) -->
<script setup lang="ts">
defineProps<{
    title: string;
    description?: string;
}>();
</script>

<template>
    <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <div>
            <h4 class="mb-1">{{ title }}</h4>
            <p v-if="description" class="text-muted small mb-0">{{ description }}</p>
        </div>
        <slot name="action" />
    </div>
</template>
