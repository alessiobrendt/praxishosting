<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/typography';

type Data = {
    expiringSubscriptions?: Array<{ site_uuid?: string; site_name?: string; current_period_ends_at?: string }>;
    overdueOrFailedInvoices?: Array<{ id: number; number: string; user_id?: number; user_name?: string; status: string }>;
    openDunningInvoices?: Array<{ id: number; number: string; user_name?: string; max_level: number }>;
};

defineProps<{ data?: Data | null }>();

const invoiceStatusLabel: Record<string, string> = {
    paid: 'Bezahlt',
    pending: 'Ausstehend',
    draft: 'Entwurf',
    sent: 'Gesendet',
    failed: 'Fehlgeschlagen',
};
</script>

<template>
    <CardHeader class="py-3">
        <CardTitle>Zu erledigen</CardTitle>
        <CardDescription>Handlungsbedarf: Abos, Rechnungen, Mahnungen</CardDescription>
    </CardHeader>
    <CardContent class="space-y-6 pt-0">
        <div v-if="data?.expiringSubscriptions?.length" class="space-y-1">
            <Text variant="small" muted class="font-medium">Abos, die in den nächsten 7 Tagen auslaufen</Text>
            <ul class="mt-2 space-y-1">
                <li v-for="(item, i) in data.expiringSubscriptions" :key="i">
                    <Link
                        v-if="item.site_uuid"
                        :href="`/admin/sites/${item.site_uuid}`"
                        class="text-primary hover:underline"
                    >
                        {{ item.site_name }} – {{ item.current_period_ends_at }}
                    </Link>
                    <span v-else>{{ item.site_name }} – {{ item.current_period_ends_at }}</span>
                </li>
            </ul>
        </div>
        <div v-if="data?.overdueOrFailedInvoices?.length" class="space-y-1">
            <Text variant="small" muted class="font-medium">Rechnungen überfällig oder Zahlung fehlgeschlagen</Text>
            <ul class="mt-2 space-y-1">
                <li v-for="inv in data.overdueOrFailedInvoices" :key="inv.uuid">
                    <Link :href="`/admin/invoices/${inv.uuid}`" class="text-primary hover:underline">
                        Rechnung {{ inv.number }}
                    </Link>
                    <span class="text-muted-foreground"> · {{ invoiceStatusLabel[inv.status] ?? inv.status }}</span>
                    <Link
                        v-if="inv.user_id"
                        :href="`/admin/customers/${inv.user_id}`"
                        class="ml-1 text-primary hover:underline"
                    >
                        ({{ inv.user_name }})
                    </Link>
                </li>
            </ul>
        </div>
        <div v-if="data?.openDunningInvoices?.length" class="space-y-1">
            <Text variant="small" muted class="font-medium">Offene Mahnungen (2. oder 3. Mahnung)</Text>
            <ul class="mt-2 space-y-1">
                <li v-for="inv in data.openDunningInvoices" :key="inv.uuid">
                    <Link :href="`/admin/invoices/${inv.uuid}`" class="text-primary hover:underline">
                        Rechnung {{ inv.number }} (Mahnstufe {{ inv.max_level }})
                    </Link>
                    <span v-if="inv.user_name" class="ml-1">({{ inv.user_name }})</span>
                </li>
            </ul>
        </div>
        <p v-if="!data?.expiringSubscriptions?.length && !data?.overdueOrFailedInvoices?.length && !data?.openDunningInvoices?.length" class="text-sm text-muted-foreground">
            Keine offenen Punkte.
        </p>
    </CardContent>
</template>
