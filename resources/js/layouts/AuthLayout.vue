<script setup lang="ts">
import AuthLayout from '@/layouts/auth/AuthSimpleLayout.vue';

defineProps<{
    title?: string;
    description?: string;
    restrictedAccess?: boolean;
}>();
</script>

<template>
    <AuthLayout :title="title" :description="description" :restricted-access="restrictedAccess">
        <slot />
    </AuthLayout>
</template>
