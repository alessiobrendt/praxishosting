<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';
import { ref, watch } from 'vue';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';

const pinVerifyUrl = '/pin/verify';

const props = withDefaults(
    defineProps<{
        pinLength: number;
        disabled?: boolean;
        submitLabel?: string;
    }>(),
    { disabled: false, submitLabel: 'Fortfahren' },
);

const emit = defineEmits<{ success: [] }>();

const code = ref<string>('');
const form = useForm({ pin: '' });

watch(
    () => form.errors.pin,
    () => {
        if (form.errors.pin) {
            code.value = '';
        }
    },
);

watch(
    () => code.value.length,
    (len, prevLen) => {
        if (len === props.pinLength && prevLen !== props.pinLength && !form.processing) {
            handleSubmit();
        }
    },
);

function handleSubmit(): void {
    if (form.processing || code.value.length !== props.pinLength) {
        return;
    }
    form.pin = code.value;
    form.post(pinVerifyUrl, {
        preserveScroll: true,
        onSuccess: () => emit('success'),
        onError: () => {
            code.value = '';
        },
    });
}
</script>

<template>
    <form class="space-y-4" @submit.prevent="handleSubmit()">
        <div class="flex flex-col items-center justify-center space-y-3 text-center">
            <div class="flex w-full items-center justify-center">
                <InputOTP
                    id="pin-otp"
                    v-model="code"
                    :maxlength="pinLength"
                    :disabled="form.processing || disabled"
                    autofocus
                >
                    <InputOTPGroup>
                        <InputOTPSlot
                            v-for="index in pinLength"
                            :key="index"
                            :index="index - 1"
                            :mask="true"
                        />
                    </InputOTPGroup>
                </InputOTP>
            </div>
            <InputError :message="form.errors.pin" />
        </div>
        <Button type="submit" class="w-full" :disabled="form.processing || disabled">
            {{ submitLabel }}
        </Button>
    </form>
</template>
