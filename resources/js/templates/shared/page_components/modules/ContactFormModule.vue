<script setup lang="ts">
import { ref, inject, computed } from 'vue';
import { useModuleSubmit } from '@/composables/useModuleSubmit';

const props = defineProps<{
    data: Record<string, unknown>;
    moduleInstanceId?: string;
}>();

const injectedSite = inject<{ value: { uuid: string; name: string; slug: string } } | { uuid: string; name: string; slug: string } | undefined>('site');
const site = computed(() => {
    const s = injectedSite;
    if (!s) return undefined;
    return 'value' in s && s.value != null ? s.value : (s as { uuid: string; name: string; slug: string });
});
const { pending, submit } = useModuleSubmit();

const formData = ref<Record<string, string>>({});
const honeypot = ref('');
const successMessage = ref<string | null>(null);
const errors = ref<Record<string, string[]>>({});

const fieldsConfig = computed(() => {
    const f = props.data?.fields;
    return Array.isArray(f) ? f : [];
});

const defaultFields = computed(() => {
    if (fieldsConfig.value.length > 0) {
        return fieldsConfig.value.map((f: { key: string }) => f.key);
    }
    return ['name', 'email', 'message'];
});

function getFieldLabel(key: string): string {
    const field = fieldsConfig.value.find((f: { key: string; label?: string }) => f.key === key);
    return (field as { label?: string } | undefined)?.label ?? key;
}

async function handleSubmit() {
    const siteValue = site.value;
    if (!siteValue?.uuid) return;
    successMessage.value = null;
    errors.value = {};

    const result = await submit(
        {
            siteUuid: siteValue.uuid,
            moduleType: 'contact',
            moduleInstanceId: props.moduleInstanceId,
            moduleConfig: { fields: fieldsConfig.value },
        },
        formData.value as unknown as Record<string, unknown>,
        honeypot.value,
    );

    if (result.success && result.message) {
        successMessage.value = result.message;
        formData.value = {};
    } else if (result.errors) {
        errors.value = result.errors;
    }
}

function getFieldError(key: string): string | undefined {
    const errs = errors.value[key] ?? errors.value[`data.${key}`];
    return Array.isArray(errs) ? errs[0] : undefined;
}
</script>

<template>
    <div class="mx-auto max-w-6xl px-4 py-4 sm:px-6 @sm:px-6">
        <p v-if="data?.note" class="mb-4 text-sm text-slate-600">
            {{ (data.note as string) ?? '' }}
        </p>

        <div v-if="successMessage" class="rounded-md p-4 bg-primary/10" style="color: var(--primary-dark)">
            {{ successMessage }}
        </div>

        <form v-else class="space-y-4" @submit.prevent="handleSubmit">
            <input
                v-model="honeypot"
                type="text"
                name="website"
                class="hidden"
                tabindex="-1"
                autocomplete="off"
                aria-hidden="true"
            />

            <template v-if="fieldsConfig.length > 0">
                <div
                    v-for="field in fieldsConfig"
                    :key="(field as { key: string }).key"
                    class="space-y-1"
                >
                    <label
                        :for="`contact-${(field as { key: string }).key}`"
                        class="block text-sm font-medium text-slate-700"
                    >
                        {{ (field as { label?: string }).label ?? (field as { key: string }).key }}
                        <span v-if="(field as { required?: boolean }).required">*</span>
                    </label>
                    <input
                        v-if="(field as { type?: string }).type !== 'textarea' && (field as { type?: string }).type !== 'checkbox'"
                        :id="`contact-${(field as { key: string }).key}`"
                        v-model="formData[(field as { key: string }).key]"
                        :type="(field as { type?: string }).type === 'email' ? 'email' : (field as { type?: string }).type === 'tel' ? 'tel' : 'text'"
                        class="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:ring-primary"
                    />
                    <textarea
                        v-else-if="(field as { type?: string }).type === 'textarea'"
                        :id="`contact-${(field as { key: string }).key}`"
                        v-model="formData[(field as { key: string }).key]"
                        rows="4"
                        class="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:ring-primary"
                    />
                    <div v-else class="flex items-center gap-2">
                        <input
                            :id="`contact-${(field as { key: string }).key}`"
                            v-model="formData[(field as { key: string }).key]"
                            type="checkbox"
                            class="rounded border-input"
                        />
                    </div>
                    <p v-if="getFieldError((field as { key: string }).key)" class="text-sm text-red-600">
                        {{ getFieldError((field as { key: string }).key) }}
                    </p>
                </div>
            </template>
            <template v-else>
                <div class="space-y-1">
                    <label for="contact-name" class="block text-sm font-medium text-slate-700">Name *</label>
                    <input
                        id="contact-name"
                        v-model="formData.name"
                        type="text"
                        class="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:ring-primary"
                    />
                    <p v-if="getFieldError('name')" class="text-sm text-red-600">{{ getFieldError('name') }}</p>
                </div>
                <div class="space-y-1">
                    <label for="contact-email" class="block text-sm font-medium text-slate-700">E-Mail *</label>
                    <input
                        id="contact-email"
                        v-model="formData.email"
                        type="email"
                        class="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:ring-primary"
                    />
                    <p v-if="getFieldError('email')" class="text-sm text-red-600">{{ getFieldError('email') }}</p>
                </div>
                <div class="space-y-1">
                    <label for="contact-message" class="block text-sm font-medium text-slate-700">Nachricht *</label>
                    <textarea
                        id="contact-message"
                        v-model="formData.message"
                        rows="4"
                        class="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:ring-primary"
                    />
                    <p v-if="getFieldError('message')" class="text-sm text-red-600">{{ getFieldError('message') }}</p>
                </div>
            </template>

            <button
                type="submit"
                :disabled="pending"
                class="rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50 bg-primary text-primary-foreground hover:opacity-90"
            >
                {{ pending ? 'Wird gesendet…' : 'Nachricht senden' }}
            </button>
        </form>
    </div>
</template>
