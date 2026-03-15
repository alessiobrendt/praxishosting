<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { formatBytes } from '@/composables/useGamingAccountFormatters';
import type { ServerOverview } from '@/composables/useGamingAccountFormatters';

defineProps<{
    displayOverview: ServerOverview | null;
}>();
</script>

<template>
    <Card :class="$attrs.class">
        <CardHeader>
            <CardTitle>Netzwerk</CardTitle>
            <CardDescription>
                Inbound- und Outbound-Datenverbrauch (Live-Aktualisierung).
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div
                v-if="displayOverview"
                class="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
                <div class="rounded-lg border bg-muted/30 p-4">
                    <p class="text-xs text-muted-foreground">Inbound</p>
                    <p class="text-lg font-semibold">
                        {{ formatBytes(displayOverview.usage.network_rx_bytes) }}
                    </p>
                </div>
                <div class="rounded-lg border bg-muted/30 p-4">
                    <p class="text-xs text-muted-foreground">Outbound</p>
                    <p class="text-lg font-semibold">
                        {{ formatBytes(displayOverview.usage.network_tx_bytes) }}
                    </p>
                </div>
            </div>
            <p v-else class="text-sm text-muted-foreground">
                Live-Daten werden vom Panel geladen. Seite neu laden oder im Panel prüfen.
            </p>
        </CardContent>
    </Card>
</template>
