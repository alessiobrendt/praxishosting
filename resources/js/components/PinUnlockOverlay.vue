<script setup lang="ts">
import { computed } from 'vue';
import AppLogoIcon from '@/components/AppLogoIcon.vue';
import PinInputForm from '@/components/PinInputForm.vue';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePage } from '@inertiajs/vue3';

const emit = defineEmits<{ unlocked: [] }>();

const page = usePage();
const user = computed(
    () => (page.props.auth as { user?: { pin_length?: number } })?.user,
);
const pinLength = computed(() => Math.min(8, Math.max(1, Number(user.value?.pin_length) || 4)));

function onSuccess(): void {
    emit('unlocked');
}
</script>

<template>
    <div
        class="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pin-unlock-title"
    >
        <Card class="w-full max-w-md mx-4 shadow-lg">
            <CardHeader class="text-center">
                <div class="flex justify-center mb-2">
                    <AppLogoIcon
                        class="size-9 fill-current text-foreground"
                    />
                </div>
                <CardTitle id="pin-unlock-title">Sitzung gesperrt</CardTitle>
                <CardDescription>
                    Geben Sie Ihre PIN ein, um fortzufahren.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <PinInputForm
                    :pin-length="pinLength"
                    submit-label="Entsperren"
                    @success="onSuccess"
                />
            </CardContent>
        </Card>
    </div>
</template>
