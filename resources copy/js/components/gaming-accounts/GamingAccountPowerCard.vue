<script setup lang="ts">
import { computed } from 'vue';
import { Loader2, Power, PowerOff, RotateCw } from 'lucide-vue-next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { formatPeriodDate } from '@/composables/useGamingAccountFormatters';
import type { ServerOverview } from '@/composables/useGamingAccountFormatters';

type GameServerAccount = {
    current_period_ends_at: string | null;
    cancel_at_period_end: boolean;
};

const props = withDefaults(
    defineProps<{
        displayOverview: ServerOverview | null;
        isSuspendedOrExpired: boolean;
        canRenew: boolean;
        gameServerAccount: GameServerAccount;
        powerLoading: string | null;
        periodEnd?: string | null;
        cancelAtPeriodEnd?: boolean;
    }>(),
    { periodEnd: undefined, cancelAtPeriodEnd: undefined },
);

const effectivePeriodEnd = computed(() => props.periodEnd ?? props.gameServerAccount.current_period_ends_at);
const effectiveCancelAtPeriodEnd = computed(
    () => props.cancelAtPeriodEnd ?? props.gameServerAccount.cancel_at_period_end,
);

defineEmits<{
    sendPower: [action: 'start' | 'stop' | 'restart'];
}>();
</script>

<template>
    <Card>
        <CardHeader>
            <CardTitle>Steuerung & Abo</CardTitle>
            <CardDescription v-if="displayOverview?.can_power">
                Start, Stop und Neustart des Game-Servers.
            </CardDescription>
            <CardDescription v-else>
                Power-Steuerung im Panel oder Client-API nicht verfügbar.
            </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
            <div
                v-if="isSuspendedOrExpired"
                class="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200"
            >
                Der Server ist gesperrt oder abgelaufen. Bitte verlängern Sie, um die Steuerung wieder zu nutzen.
            </div>
            <div v-else-if="displayOverview?.can_power" class="flex flex-wrap gap-2">
                <Button
                    size="sm"
                    class="bg-green-600 hover:bg-green-700"
                    :disabled="!!powerLoading"
                    @click="$emit('sendPower', 'start')"
                >
                    <Loader2
                        v-if="powerLoading === 'start'"
                        class="mr-2 h-4 w-4 animate-spin"
                    />
                    <Power v-else class="mr-2 h-4 w-4" />
                    Start
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    class="border-orange-600 bg-orange-600 text-white hover:bg-orange-700 hover:border-orange-700 dark:border-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 dark:hover:border-orange-700"
                    :disabled="!!powerLoading"
                    @click="$emit('sendPower', 'restart')"
                >
                    <Loader2
                        v-if="powerLoading === 'restart'"
                        class="mr-2 h-4 w-4 animate-spin"
                    />
                    <RotateCw v-else class="mr-2 h-4 w-4" />
                    Neustart
                </Button>
                <Button
                    size="sm"
                    variant="destructive"
                    :disabled="!!powerLoading"
                    @click="$emit('sendPower', 'stop')"
                >
                    <Loader2
                        v-if="powerLoading === 'stop'"
                        class="mr-2 h-4 w-4 animate-spin"
                    />
                    <PowerOff v-else class="mr-2 h-4 w-4" />
                    Stop
                </Button>
            </div>
            <dl v-if="!canRenew" class="grid gap-2 text-sm">
                <div class="flex justify-between border-b py-2">
                    <dt class="text-muted-foreground">Nächste Verlängerung</dt>
                    <dd>{{ formatPeriodDate(effectivePeriodEnd) }}</dd>
                </div>
                <div class="flex justify-between py-2">
                    <span class="text-muted-foreground">Kündigung zum Periodenende</span>
                    <Badge v-if="effectiveCancelAtPeriodEnd" variant="default">
                        Ja
                    </Badge>
                    <span v-else>Nein</span>
                </div>
            </dl>
        </CardContent>
    </Card>
</template>
