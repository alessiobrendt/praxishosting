<script setup lang="ts">
import { Heading, Text } from '@/components/ui/typography';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface Props {
    title?: string;
    description?: string;
}

withDefaults(defineProps<Props>(), {
    title: 'Welcome',
    description: '',
});
</script>

<template>
    <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 p-4 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/20">
        <div class="w-full max-w-md">
            <Card class="shadow-modern-xl">
                <CardHeader class="text-center">
                    <CardTitle class="text-2xl">{{ title }}</CardTitle>
                    <CardDescription v-if="description" class="mt-2">
                        {{ description }}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <slot />
                </CardContent>
            </Card>
        </div>
    </div>
</template>
