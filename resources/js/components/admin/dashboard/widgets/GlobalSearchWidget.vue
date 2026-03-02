<script setup lang="ts">
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import AdminSearch from '@/components/AdminSearch.vue';
</script>

<template>
    <CardHeader class="py-3">
        <CardTitle>Globale Suche</CardTitle>
        <CardDescription>Sites, Kunden, Rechnungen, Abos (Stripe-ID) durchsuchen</CardDescription>
    </CardHeader>
    <CardContent class="pt-0">
        <AdminSearch />
    </CardContent>
</template>
