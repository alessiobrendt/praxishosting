<script setup lang="ts">
interface Hour {
    day: string;
    hours: string;
}

const props = defineProps<{
    hours?: Hour[];
}>();

const defaultHours: Hour[] = [
    { day: 'Montag', hours: '08:00–12:00, 15:00–18:00' },
    { day: 'Dienstag', hours: '08:00–12:00' },
    { day: 'Mittwoch', hours: '08:00–12:00' },
    { day: 'Donnerstag', hours: '08:00–12:00, 15:00–18:00' },
    { day: 'Freitag', hours: '08:00–12:00' },
    { day: 'Samstag', hours: 'geschlossen' },
    { day: 'Sonntag', hours: 'geschlossen' },
];

const Hours = props.hours ?? defaultHours;
</script>

<template>
    <div class="overflow-hidden rounded-md border">
        <table class="w-full text-sm">
            <caption class="sr-only">Sprechzeiten</caption>
            <thead class="bg-slate-50 text-left font-medium text-slate-700">
                <tr>
                    <th class="px-3 py-2">Tag</th>
                    <th class="px-3 py-2">Uhrzeit</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="(h, i) in Hours"
                    :key="`${h.day}-${i}`"
                    class="border-t"
                >
                    <td class="px-3 py-2">{{ h.day }}</td>
                    <td class="px-3 py-2">{{ h.hours }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
