<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { Calendar, CalendarPlus, ExternalLink, RefreshCcw, Server } from 'lucide-vue-next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { formatPeriodDate, statusVariant, displayStatus } from '@/composables/useGamingAccountFormatters';
import type { ServerOverview } from '@/composables/useGamingAccountFormatters';

type GameServerAccount = {
    id: number;
    name: string;
    status: string;
    current_period_ends_at: string | null;
    cancel_at_period_end: boolean;
    hosting_plan?: { name: string };
};

const props = withDefaults(
    defineProps<{
        gameServerAccount: GameServerAccount;
        planLabel: string;
        periodEnd: string | null;
        loginUrl: string | null;
        displayOverview: ServerOverview | null;
        isSuspendedOrExpired?: boolean;
        showRenewButton?: boolean;
        showAutoRenewButton?: boolean;
        showAboVerwalten?: boolean;
        isCloudAccount?: boolean;
        cloudSubscriptionUrl?: string | null;
        cancelAtPeriodEnd?: boolean;
    }>(),
    {
        isSuspendedOrExpired: false,
        showRenewButton: false,
        showAutoRenewButton: false,
        showAboVerwalten: false,
        isCloudAccount: false,
        cloudSubscriptionUrl: null,
        cancelAtPeriodEnd: false,
    },
);

defineEmits<{
    renewClick: [];
    autoRenewClick: [];
}>();
</script>

<template>
    <Card class="rounded-lg p-4">
        <div class="border-b pb-3 text-center">
            <div class="mb-3 flex items-center justify-between">
                <Badge :variant="statusVariant(displayOverview, gameServerAccount.status)" class="gap-1">
                    <span
                        v-if="statusVariant(displayOverview, gameServerAccount.status) === 'success'"
                        class="relative flex h-1.5 w-1.5"
                    >
                        <span
                            class="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75"
                        />
                        <span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
                    </span>
                    {{ displayStatus(displayOverview, gameServerAccount.status) }}
                </Badge>
            </div>
            <div class="flex justify-center text-muted-foreground">
                <Server class="h-12 w-12" />
            </div>
            <Heading level="h5" class="mt-2">Game Server</Heading>
            <Text class="mt-0.5 text-sm" muted>{{ gameServerAccount.name }}</Text>
            <Text class="mt-0.5 text-xs" muted>{{ planLabel }}</Text>
            <div class="mt-3 rounded-lg border bg-muted/40 px-3 py-2 text-center">
                <div class="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar class="h-3.5 w-3.5 shrink-0" />
                    <span>Läuft bis</span>
                </div>
                <div class="mt-0.5 text-sm font-semibold">
                    {{ formatPeriodDate(periodEnd) }}
                </div>
                <div
                    v-if="cancelAtPeriodEnd"
                    class="mt-1 text-xs text-amber-600 dark:text-amber-400"
                >
                    Kündigung zum Periodenende
                </div>
            </div>
        </div>
        <div class="mt-4 flex flex-col gap-3">
            <template v-if="isSuspendedOrExpired">
                <Button class="w-full justify-start gap-2" disabled>
                    <ExternalLink class="h-4 w-4" />
                    Gesperrt – bitte verlängern
                </Button>
            </template>
            <Link v-else-if="loginUrl" :href="loginUrl" target="_blank" rel="noopener noreferrer">
                <Button class="w-full justify-start gap-2">
                    <ExternalLink class="h-4 w-4" />
                    Zum Pterodactyl-Panel
                </Button>
            </Link>
            <Link
                v-else-if="isCloudAccount && cloudSubscriptionUrl"
                :href="cloudSubscriptionUrl"
            >
                <Button variant="default" class="w-full justify-start gap-2">
                    <CalendarPlus class="h-4 w-4" />
                    Abo verlängern
                </Button>
            </Link>
            <template v-else-if="showRenewButton">
                <Button
                    variant="default"
                    class="w-full justify-start gap-2"
                    @click="$emit('renewClick')"
                >
                    <CalendarPlus class="h-4 w-4" />
                    Verlängern
                </Button>
            </template>
            <template v-if="showAutoRenewButton">
                <Button
                    variant="outline"
                    class="w-full justify-start gap-2"
                    @click="$emit('autoRenewClick')"
                >
                    <RefreshCcw class="h-4 w-4" />
                    Auto Renew
                </Button>
            </template>
            <Link v-if="showAboVerwalten" href="/billing/subscriptions">
                <Button variant="outline" class="w-full justify-start gap-2">
                    Abo verwalten
                </Button>
            </Link>
        </div>
    </Card>
</template>
