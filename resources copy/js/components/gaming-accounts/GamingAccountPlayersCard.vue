<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import type { ServerOverview } from '@/composables/useGamingAccountFormatters';

defineProps<{
    displayOverview: ServerOverview | null;
}>();
</script>

<template>
    <Card :class="$attrs.class">
        <CardHeader>
            <CardTitle>Spieler</CardTitle>
            <CardDescription>
                Aktuelle Spieleranzahl (Live-Aktualisierung, sofern für dieses Spiel konfiguriert).
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div
                v-if="displayOverview?.server_query != null && displayOverview.server_query.max_players > 0"
                class="rounded-lg border bg-muted/30 p-4"
            >
                <p class="text-xs text-muted-foreground">Online</p>
                <p class="text-lg font-semibold">
                    {{ displayOverview.server_query.num_players }} / {{ displayOverview.server_query.max_players }}
                    <span class="text-sm font-normal text-muted-foreground">Spieler</span>
                </p>
            </div>
            <p v-else class="text-sm text-muted-foreground">
                Keine Spieler-Anzeige für dieses Spiel konfiguriert. In der Nest-Verwaltung kann ein GameQ-Typ gesetzt werden.
            </p>
        </CardContent>
    </Card>
</template>
