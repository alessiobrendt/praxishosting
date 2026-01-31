<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { computed } from 'vue';
import PinInputForm from '@/components/PinInputForm.vue';
import AuthLayout from '@/layouts/auth/AuthCardLayout.vue';
import { usePage } from '@inertiajs/vue3';

const page = usePage();
const user = computed(
    () => (page.props.auth as { user?: { pin_length?: number; has_pin?: boolean } })?.user,
);
const pinLength = computed(() => Math.min(8, Math.max(1, Number(user.value?.pin_length) || 4)));
</script>

<template>
    <AuthLayout
        title="PIN eingeben"
        description="Geben Sie Ihre PIN ein, um fortzufahren."
    >
        <Head title="PIN bestätigen" />

        <PinInputForm
            :pin-length="pinLength"
            submit-label="Fortfahren"
        />
    </AuthLayout>
</template>
