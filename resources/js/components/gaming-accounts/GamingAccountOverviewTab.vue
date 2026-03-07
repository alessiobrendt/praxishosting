<script setup lang="ts">
import { Copy } from 'lucide-vue-next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from '@/components/ui/table';
import { formatBytes, formatCpu, displayStatus, statusVariant } from '@/composables/useGamingAccountFormatters';
import type { ServerOverview } from '@/composables/useGamingAccountFormatters';
import GamingAccountPowerCard from '@/components/gaming-accounts/GamingAccountPowerCard.vue';
import GamingAccountResourcesCard from '@/components/gaming-accounts/GamingAccountResourcesCard.vue';
import GamingAccountNetworkCard from '@/components/gaming-accounts/GamingAccountNetworkCard.vue';
import GamingAccountPlayersCard from '@/components/gaming-accounts/GamingAccountPlayersCard.vue';

type GameServerAccount = {
    id: number;
    name: string;
    identifier: string | null;
};

withDefaults(
    defineProps<{
        gameServerAccount: GameServerAccount;
        displayOverview: ServerOverview | null;
        isSuspendedOrExpired: boolean;
        canRenew: boolean;
        powerLoading: string | null;
        periodEnd?: string | null;
        cancelAtPeriodEnd?: boolean;
    }>(),
    { periodEnd: null, cancelAtPeriodEnd: false },
);

const emit = defineEmits<{
    sendPower: [action: 'start' | 'stop' | 'restart' | 'kill'];
    copyToClipboard: [text: string];
}>();

function copyToClipboard(text: string) {
    emit('copyToClipboard', text);
}
</script>

<template>
    <div class="grid gap-4 md:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>Informationen</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableHead class="w-36 font-medium">Server-Name</TableHead>
                            <TableCell>{{ displayOverview?.name ?? gameServerAccount.name }}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead class="font-medium">IP & Port</TableHead>
                            <TableCell class="font-mono text-sm">
                                {{ displayOverview?.allocation ?? '—' }}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead class="font-medium">Status</TableHead>
                            <TableCell>
                                <Badge :variant="statusVariant(displayOverview, gameServerAccount.status)">
                                    {{ displayStatus(displayOverview, gameServerAccount.status) }}
                                </Badge>
                            </TableCell>
                        </TableRow>
                        <TableRow v-if="gameServerAccount.identifier">
                            <TableHead class="font-medium">Identifier</TableHead>
                            <TableCell class="flex items-center gap-1">
                                <code class="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">{{
                                    gameServerAccount.identifier
                                }}</code>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    class="h-7 w-7"
                                    title="Kopieren"
                                    @click="copyToClipboard(gameServerAccount.identifier!)"
                                >
                                    <Copy class="h-3.5 w-3.5" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

        <GamingAccountPowerCard
            :display-overview="displayOverview"
            :is-suspended-or-expired="isSuspendedOrExpired"
            :can-renew="canRenew"
            :game-server-account="gameServerAccount"
            :power-loading="powerLoading"
            :period-end="periodEnd"
            :cancel-at-period-end="cancelAtPeriodEnd"
            @send-power="(a) => $emit('sendPower', a)"
        />
    </div>

    <GamingAccountResourcesCard class="mt-4" :display-overview="displayOverview" />
    <div class="mt-4 grid gap-4 md:grid-cols-2">
        <GamingAccountNetworkCard :display-overview="displayOverview" />
        <GamingAccountPlayersCard :display-overview="displayOverview" />
    </div>
</template>
