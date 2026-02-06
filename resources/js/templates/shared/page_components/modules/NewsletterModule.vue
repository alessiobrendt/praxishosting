<script setup lang="ts">
import { ref, inject, computed, onMounted } from 'vue';
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

const email = ref('');
const successMessage = ref<string | null>(null);
const errors = ref<Record<string, string[]>>({});
const subscribed = ref(false);
const honeypot = ref('');

async function checkStatus() {
    const siteValue = site.value;
    if (!siteValue?.uuid) return;
    try {
        const res = await fetch(`/api/sites/${siteValue.uuid}/modules/newsletter/status`, {
            credentials: 'same-origin',
        });
        const data = await res.json();
        subscribed.value = data.subscribed === true;
    } catch {
        subscribed.value = false;
    }
}

async function handleSubmit() {
    const siteValue = site.value;
    if (!siteValue?.id) return;
    successMessage.value = null;
    errors.value = {};

    const result = await submit(
        {
            siteUuid: siteValue.uuid,
            moduleType: 'newsletter',
            moduleInstanceId: props.moduleInstanceId,
            moduleConfig: props.data,
        },
        { email: email.value } as unknown as Record<string, unknown>,
        honeypot.value,
    );

    if (result.success && result.message) {
        successMessage.value = result.message;
        subscribed.value = true;
        email.value = '';
        document.cookie = `newsletter_subscribed_${siteValue.uuid}=1; path=/; max-age=31536000; SameSite=Lax`;
    } else if (result.errors) {
        errors.value = result.errors;
    }
}

function getError(field: string): string | undefined {
    const errs = errors.value[field] ?? errors.value[`data.${field}`];
    return Array.isArray(errs) ? errs[0] : undefined;
}

onMounted(checkStatus);
</script>

<template>
    <div class="space-y-3">
        <p v-if="data?.heading" class="text-sm font-medium text-slate-700">
            {{ (data.heading as string) ?? '' }}
        </p>

        <div v-if="subscribed" class="rounded-md p-3 text-sm bg-primary/10" style="color: var(--primary-dark)">
            {{ (data.subscribedMessage as string) ?? 'Sie sind bereits für unseren Newsletter angemeldet.' }}
        </div>

        <form v-else class="flex flex-col gap-2 sm:flex-row sm:items-end" @submit.prevent="handleSubmit">
            <input
                v-model="honeypot"
                type="text"
                name="website"
                class="hidden"
                tabindex="-1"
                autocomplete="off"
                aria-hidden="true"
            />
            <div class="min-w-0 flex-1 space-y-1">
                <label for="newsletter-email" class="sr-only">E-Mail</label>
                <input
                    id="newsletter-email"
                    v-model="email"
                    type="email"
                    required
                    placeholder="E-Mail-Adresse"
                    class="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:ring-primary"
                />
                <p v-if="getError('email')" class="text-xs text-red-600">{{ getError('email') }}</p>
            </div>
            <button
                type="submit"
                :disabled="pending"
                class="shrink-0 rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50 bg-primary text-primary-foreground hover:opacity-90"
            >
                {{ (data.buttonText as string) ?? 'Anmelden' }}
            </button>
        </form>

        <p v-if="successMessage" class="text-sm" style="color: var(--primary)">
            {{ successMessage }}
        </p>
    </div>
</template>
