<script lang="ts">
export const meta = {
    type: 'contactinfo',
    label: 'Kontaktinformationen',
    placement: 'above_main' as const,
    category: 'Inhalt',
    defaultData: { address: '', phone: '', email: '', openingLine: '' },
    fields: [
        { key: 'address', label: 'Adresse', type: 'text' as const },
        { key: 'phone', label: 'Telefon', type: 'text' as const },
        { key: 'email', label: 'E-Mail', type: 'text' as const },
        { key: 'openingLine', label: 'Öffnungszeiten', type: 'text' as const },
    ],
};
</script>

<script setup lang="ts">
import { MapPin, Phone, Mail, Clock } from 'lucide-vue-next';

const props = defineProps<{ data: Record<string, unknown> }>();
</script>

<template>
    <div class="mx-auto max-w-6xl px-4 py-4 sm:px-6 @sm:px-6">
        <dl class="grid grid-cols-1 gap-4 rounded-lg border bg-white p-4 shadow-sm sm:grid-cols-2 @sm:grid-cols-2">
            <div v-if="props.data.address">
                <dt class="flex items-center gap-2 text-sm font-medium text-slate-900">
                    <MapPin class="h-4 w-4" style="color: var(--primary-dark)" aria-hidden="true" />
                    Adresse
                </dt>
                <dd class="mt-1 text-sm text-slate-700">{{ props.data.address }}</dd>
            </div>
            <div v-if="props.data.phone">
                <dt class="flex items-center gap-2 text-sm font-medium text-slate-900">
                    <Phone class="h-4 w-4" style="color: var(--primary-dark)" aria-hidden="true" />
                    Telefon
                </dt>
                <dd class="mt-1 text-sm">
                    <a :href="`tel:${String(props.data.phone).replace(/\s/g, '')}`" class="text-slate-700 underline">
                        {{ props.data.phone }}
                    </a>
                </dd>
            </div>
            <div v-if="props.data.email">
                <dt class="flex items-center gap-2 text-sm font-medium text-slate-900">
                    <Mail class="h-4 w-4" style="color: var(--primary-dark)" aria-hidden="true" />
                    E-Mail
                </dt>
                <dd class="mt-1 text-sm">
                    <a :href="`mailto:${props.data.email}`" class="text-slate-700 underline">
                        {{ props.data.email }}
                    </a>
                </dd>
            </div>
            <div v-if="props.data.openingLine">
                <dt class="flex items-center gap-2 text-sm font-medium text-slate-900">
                    <Clock class="h-4 w-4" style="color: var(--primary-dark)" aria-hidden="true" />
                    Öffnungszeiten
                </dt>
                <dd class="mt-1 text-sm text-slate-700">{{ props.data.openingLine }}</dd>
            </div>
        </dl>
        <p v-if="!props.data.address && !props.data.phone && !props.data.email && !props.data.openingLine" class="text-sm text-slate-500">
            Kontaktdaten im Kontext-Panel eingeben.
        </p>
    </div>
</template>
