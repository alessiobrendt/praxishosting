<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { formatBytes, formatCpu } from '@/composables/useGamingAccountFormatters';
import type { ServerOverview } from '@/composables/useGamingAccountFormatters';

defineProps<{
    displayOverview: ServerOverview | null;
}>();
</script>

<template>
    <Card :class="$attrs.class">
        <CardHeader>
            <CardTitle>Ressourcen</CardTitle>
            <CardDescription>
                Nutzung von CPU, Arbeitsspeicher und Festplatte (Live-Aktualisierung).
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div
                v-if="displayOverview"
                class="grid grid-cols-1 gap-4 sm:grid-cols-3"
            >
                <div class="rounded-lg border bg-muted/30 p-4">
                    <p class="text-xs text-muted-foreground">CPU</p>
                    <p class="text-xl font-semibold">
                        {{ formatCpu(displayOverview.usage.cpu_absolute) }}
                        <span class="text-sm font-normal text-muted-foreground">
                            / {{ formatCpu(displayOverview.limits.cpu) }}
                        </span>
                    </p>
                </div>
                <div class="rounded-lg border bg-muted/30 p-4">
                    <p class="text-xs text-muted-foreground">RAM</p>
                    <p class="text-xl font-semibold">
                        {{ formatBytes(displayOverview.usage.memory_bytes) }}
                        <span class="text-sm font-normal text-muted-foreground">
                            / {{ formatBytes(displayOverview.limits.memory * 1024 * 1024) }}
                        </span>
                    </p>
                </div>
                <div class="rounded-lg border bg-muted/30 p-4">
                    <p class="text-xs text-muted-foreground">Disk</p>
                    <p class="text-xl font-semibold">
                        {{ formatBytes(displayOverview.usage.disk_bytes) }}
                        <span class="text-sm font-normal text-muted-foreground">
                            / {{ formatBytes(displayOverview.limits.disk * 1024 * 1024) }}
                        </span>
                    </p>
                </div>
            </div>
            <p v-else class="text-sm text-muted-foreground">
                Live-Daten werden vom Panel geladen. Seite neu laden oder im Panel prüfen.
            </p>
        </CardContent>
    </Card>
</template>
