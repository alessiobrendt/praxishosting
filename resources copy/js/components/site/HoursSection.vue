<script setup lang="ts">
type DayHours = {
    day: string;
    hours: string;
};

type Props = {
    data: {
        heading: string;
        icon?: string;
        infoText?: string;
        hours?: DayHours[];
    };
};

defineProps<Props>();
</script>

<template>
    <section class="py-16 px-4 bg-[var(--quinary)]">
        <div class="container mx-auto">
            <h2 class="text-2xl font-bold md:text-3xl" style="color: var(--secondary)">
                {{ data.heading }}
            </h2>
            <p v-if="data.infoText" class="mt-2 text-[var(--tertiary)]">
                {{ data.infoText }}
            </p>
            <div v-if="data.hours?.length" class="mt-8 max-w-md">
                <table class="w-full text-sm">
                    <tbody>
                        <tr
                            v-for="(row, i) in data.hours"
                            :key="i"
                            class="border-b border-sidebar-border"
                        >
                            <td class="py-2 font-medium" style="color: var(--secondary)">
                                {{ row.day }}
                            </td>
                            <td class="py-2 text-muted-foreground">
                                {{ row.hours }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </section>
</template>
