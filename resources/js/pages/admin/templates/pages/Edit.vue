<script setup lang="ts">
import { ref, computed } from 'vue';
import { router, Head, Link, usePage } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Heading } from '@/components/ui/typography';
import InputError from '@/components/InputError.vue';
import JsonEditor from '@/components/JsonEditor.vue';
import templates from '@/routes/admin/templates';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { ArrowLeft } from 'lucide-vue-next';

type TemplatePage = {
    id: number;
    name: string;
    slug: string;
    order: number;
    data: Record<string, unknown> | null;
};

type Template = {
    id: number;
    name: string;
    slug: string;
};

type Props = {
    template: Template;
    page: TemplatePage;
    errors?: Record<string, string>;
};

const props = defineProps<Props>();
const page = usePage();

const formData = ref({
    name: props.page.name,
    slug: props.page.slug,
    order: props.page.order,
    pageData: JSON.stringify(props.page.data ?? {}, null, 2),
});

const errors = computed(() => (page.props.errors as Record<string, string>) ?? {});
const processing = ref(false);

const submit = () => {
    processing.value = true;
    
    // Validate and parse JSON/JavaScript object before submitting
    let parsedData = null;
    try {
        // First try JSON.parse
        parsedData = JSON.parse(formData.value.pageData);
    } catch (e) {
        try {
            // If JSON.parse fails, try evaluating as JavaScript object (wrapped in parentheses)
            // This allows JavaScript object syntax without quotes around keys
            // We use Function constructor instead of eval for better security
            const wrapped = `return (${formData.value.pageData})`;
            parsedData = new Function(wrapped)();
            
            // Validate it's actually an object/array
            if (typeof parsedData !== 'object' || parsedData === null) {
                throw new Error('Result is not an object');
            }
            
            // Ensure it's serializable (no functions, etc.)
            JSON.stringify(parsedData);
        } catch (e2) {
            console.error('Invalid JSON/Object:', e2);
            errors.value = { data: 'Ungültiges Format. Bitte verwenden Sie gültiges JSON oder JavaScript-Objekt-Syntax (ohne Funktionen).' };
            processing.value = false;
            return;
        }
    }
    
    console.log('Submitting data:', {
        name: formData.value.name,
        slug: formData.value.slug,
        order: formData.value.order,
        data: parsedData,
    });
    
    router.put(
        `/admin/templates/${props.template.id}/pages/${props.page.id}`,
        {
            name: formData.value.name,
            slug: formData.value.slug,
            order: formData.value.order,
            data: parsedData, // Send as object, not string
        },
        {
            preserveScroll: true,
            onError: (pageErrors) => {
                console.error('Validation errors:', pageErrors);
                processing.value = false;
            },
            onSuccess: () => {
                console.log('Success!');
                processing.value = false;
            },
            onFinish: () => {
                processing.value = false;
            },
        }
    );
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Templates', href: templates.index().url },
    { title: props.template.name, href: templates.show({ template: props.template.id }).url },
    { title: 'Seiten', href: templates.pages.index({ template: props.template.id }).url },
    { title: props.page.name, href: templates.pages.show({ template: props.template.id, page: props.page.id }).url },
    { title: 'Bearbeiten', href: '#' },
];
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head :title="`Bearbeiten: ${props.page.name}`" />

        <div class="space-y-6">
            <div class="flex items-center justify-between">
                <Heading level="h1">Seite bearbeiten</Heading>
                    <Link :href="templates.pages.show({ template: props.template.id, page: props.page.id }).url">
                        <Button variant="outline">
                            <ArrowLeft class="mr-2 h-4 w-4" />
                            Zurück
                        </Button>
                    </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Seiten-Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form @submit.prevent="submit" class="space-y-6">
                        <div class="grid gap-2">
                            <Label for="name">Name</Label>
                            <Input
                                id="name"
                                v-model="formData.name"
                                required
                            />
                            <InputError :message="errors.name" />
                        </div>
                        <div class="grid gap-2">
                            <Label for="slug">Slug</Label>
                            <Input
                                id="slug"
                                v-model="formData.slug"
                                required
                            />
                            <InputError :message="errors.slug" />
                        </div>
                        <div class="grid gap-2">
                            <Label for="order">Reihenfolge</Label>
                            <Input
                                id="order"
                                type="number"
                                v-model.number="formData.order"
                                min="0"
                            />
                            <InputError :message="errors.order" />
                        </div>
                        <div v-if="Object.keys(errors).length > 0" class="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                            <p class="text-sm font-semibold text-destructive">Fehler beim Speichern:</p>
                            <ul class="mt-2 list-disc list-inside text-sm text-destructive">
                                <li v-for="(error, field) in errors" :key="field">
                                    {{ field }}: {{ error }}
                                </li>
                            </ul>
                        </div>
                        <div class="grid gap-2">
                            <div class="flex items-center justify-between">
                                <Label for="data">Daten (JSON)</Label>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    @click.prevent="
                                        const example = {
                                            hero: {
                                                heading: 'Willkommen in der Praxis Mustermann',
                                                text: 'Ihre hausärztliche Versorgung mit Herz und Verstand – persönlich, modern und nah.',
                                                buttons: [
                                                    { text: 'Termin anfragen', href: '', variant: 'default' },
                                                    { text: 'Unsere Leistungen', href: '/leistungen', variant: 'outline' },
                                                ],
                                                image: { src: '/images/image1.webp', alt: 'Behandlungszimmer der Praxis Mustermann' },
                                            },
                                            about: {
                                                heading: 'Kurzvorstellung',
                                                text: 'In unserer Praxis steht der Mensch im Mittelpunkt.',
                                                features: [
                                                    { icon: 'Stethoscope', title: 'Allgemeinmedizin', desc: 'Hausärztliche Versorgung.' },
                                                ],
                                            },
                                            hours: {
                                                heading: 'Öffnungszeiten',
                                                icon: 'Clock',
                                                infoText: 'Bitte vereinbaren Sie nach Möglichkeit einen Termin.',
                                                hours: [
                                                    { day: 'Montag', hours: '08:00–12:00, 15:00–18:00' },
                                                    { day: 'Dienstag', hours: '08:00–12:00' },
                                                ],
                                            },
                                            cta: {
                                                heading: 'Neu bei uns?',
                                                text: 'Hier finden Sie Informationen für Ihren ersten Besuch.',
                                                links: [
                                                    { text: 'Patienteninformationen', href: '/patienteninformationen', variant: 'primary' },
                                                ],
                                                image: { src: '/images/image2.webp', alt: 'Empfangsbereich' },
                                            },
                                        };
                                        formData.pageData = JSON.stringify(example, null, 2);
                                    "
                                >
                                    Beispiel einfügen
                                </Button>
                            </div>
                            <JsonEditor
                                id="data"
                                v-model="formData.pageData"
                                placeholder="Geben Sie hier Ihr JSON oder JavaScript-Objekt ein..."
                            />
                            <p class="text-xs text-muted-foreground">
                                Nach dem Speichern können Sie die Daten strukturiert unter "Daten bearbeiten" bearbeiten.
                            </p>
                            <InputError :message="errors.data" />
                        </div>
                        <div class="flex gap-2">
                            <Button type="submit" :disabled="processing">Speichern</Button>
                            <Link :href="templates.pages.show({ template: props.template.id, page: props.page.id }).url">
                                <Button type="button" variant="outline">Abbrechen</Button>
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
