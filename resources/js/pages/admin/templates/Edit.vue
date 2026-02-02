<script setup lang="ts">
import { router, Head, Link, usePage } from '@inertiajs/vue3';
import InputError from '@/components/InputError.vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import DynamicFormField from '@/components/DynamicFormField.vue';
import JsonViewer from '@/components/JsonViewer.vue';
import {
    index as templatesIndex,
    show as templatesShow,
} from '@/routes/admin/templates';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { ref, computed, watch, onMounted } from 'vue';
import { Upload, ChevronDown, Sparkles, Plus, Trash2, GripVertical } from 'lucide-vue-next';
import { getTemplateEntry } from '@/templates/template-registry';
import type { LayoutComponentType } from '@/types/layout-components';

type Template = {
    id: number;
    name: string;
    slug: string;
    price: string;
    is_active: boolean;
    preview_image?: string | null;
    page_data?: Record<string, any> | null;
};

type Props = {
    template: Template;
};

const props = defineProps<Props>();
const page = usePage();

const templateEntry = computed(() => getTemplateEntry(props.template.slug));
const componentRegistry = computed(() => templateEntry.value?.getComponentRegistry?.());

// Dynamisches data-Objekt, das sich aus der JSON erweitert
// Struktur: { colors: {...}, site: {...}, branding: {...}, etc. }
const templateData = ref<Record<string, any>>({});

// Initialize templateData from props
const initializeTemplateData = () => {
    let pageData = props.template.page_data;
    
    console.log('Initializing templateData, page_data from props:', pageData);
    console.log('Type of pageData:', typeof pageData, 'Is array:', Array.isArray(pageData));
    
    // Handle case where page_data might be double-nested: { page_data: { ... } }
    if (pageData && typeof pageData === 'object' && !Array.isArray(pageData)) {
        // If page_data contains a nested page_data key, unwrap it
        if ('page_data' in pageData && pageData.page_data && typeof pageData.page_data === 'object') {
            console.log('Unwrapping double-nested page_data');
            pageData = pageData.page_data;
        }
        
        // Deep clone to ensure reactivity
        templateData.value = JSON.parse(JSON.stringify(pageData));
        if (!Array.isArray(templateData.value.layout_components)) {
            templateData.value.layout_components = [];
        }
        console.log('Using page_data directly, final templateData.value:', templateData.value);
    } else {
        console.log('No page_data found or invalid format, initializing empty object');
        templateData.value = { layout_components: [] };
    }

    if (!Array.isArray(templateData.value.layout_components)) {
        templateData.value.layout_components = [];
    }
    console.log('Final templateData.value keys:', Object.keys(templateData.value));
};

// Initialize on mount
onMounted(() => {
    initializeTemplateData();
    initializeExpertFields();
});

// Watch for prop changes (e.g., after Inertia reload)
watch(() => props.template.page_data, () => {
    initializeTemplateData();
}, { immediate: true });

const formData = ref({
    name: props.template.name,
    slug: props.template.slug,
    price: props.template.price,
    is_active: props.template.is_active ?? false,
    preview_image: props.template.preview_image ?? '',
});

const errors = computed(() => (page.props.errors as Record<string, string>) ?? {});
const processing = ref(false);

const jsonImport = ref('');

// Expert Mode
const expertMode = ref(false);
const expertFields = ref<Set<string>>(new Set());

// Initialize expert fields from page_data._expertFields if it exists
const initializeExpertFields = () => {
    if (templateData.value._expertFields && Array.isArray(templateData.value._expertFields)) {
        expertFields.value = new Set(templateData.value._expertFields);
    }
};

// Watch for templateData changes to reinitialize expert fields
watch(() => templateData.value._expertFields, () => {
    initializeExpertFields();
}, { immediate: true });

// Save expert fields to templateData
const saveExpertFields = () => {
    if (expertFields.value.size > 0) {
        templateData.value._expertFields = Array.from(expertFields.value);
    } else {
        delete templateData.value._expertFields;
    }
    // Force reactivity update
    templateData.value = { ...templateData.value };
};

// Toggle expert status for a field
const toggleExpertField = (path: string) => {
    if (expertFields.value.has(path)) {
        expertFields.value.delete(path);
    } else {
        expertFields.value.add(path);
    }
    saveExpertFields();
};

// Check if a field is marked as expert
const isExpertField = (path: string): boolean => {
    return expertFields.value.has(path);
};

// Computed für die JSON-Vorschau
const templateDataJson = computed(() => {
    return JSON.stringify(templateData.value, null, 2);
});

const importJson = () => {
    if (!jsonImport.value.trim()) {
        alert('Bitte geben Sie JSON-Daten ein.');
        return;
    }

    try {
        let parsed: any;
        try {
            parsed = JSON.parse(jsonImport.value);
        } catch {
            // Try to evaluate as JavaScript object literal
            parsed = new Function('return ' + jsonImport.value)();
        }

        // Preserve expert fields metadata
        const preservedExpertFields = templateData.value._expertFields;

        // Merge all data from the parsed JSON into templateData
        // Create a new object to ensure reactivity
        const merged = {
            ...templateData.value,
            ...parsed,
        };
        
        // Deep merge nested objects
        for (const [key, value] of Object.entries(parsed)) {
            if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
                merged[key] = {
                    ...(templateData.value[key] || {}),
                    ...value,
                };
            }
        }
        
        // Restore expert fields if they were preserved
        if (preservedExpertFields) {
            merged._expertFields = preservedExpertFields;
            expertFields.value = new Set(preservedExpertFields);
        }
        
        templateData.value = merged;

        alert('JSON erfolgreich importiert!');
        jsonImport.value = '';
    } catch (error) {
        alert('Fehler beim Parsen der JSON-Daten: ' + (error as Error).message);
    }
};

const handleFileUpload = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const content = e.target?.result as string;
        jsonImport.value = content;
        importJson();
    };
    reader.readAsText(file);
};

const formatLabel = (key: string): string => {
    // Convert camelCase/PascalCase to readable label
    return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase())
        .trim();
};

const submit = () => {
    processing.value = true;
    
    // Transform templateData into the correct format - everything goes into page_data
    const submitData: Record<string, any> = {
        name: formData.value.name,
        slug: formData.value.slug,
        price: formData.value.price,
        is_active: formData.value.is_active,
        preview_image: formData.value.preview_image || null,
        page_data: templateData.value,
    };
    
    router.put(
        `/admin/templates/${props.template.id}`,
        submitData,
        {
            preserveScroll: true,
            onError: () => {
                processing.value = false;
            },
            onSuccess: () => {
                processing.value = false;
            },
            onFinish: () => {
                processing.value = false;
            },
        }
    );
};

// Flatten nested objects for form fields, grouped by top-level key
const flattenObject = (obj: Record<string, any>, prefix = '', groupKey = ''): Array<{ key: string; path: string; value: any; label: string; formName: string; group: string }> => {
    const fields: Array<{ key: string; path: string; value: any; label: string; formName: string; group: string }> = [];
    
    for (const [key, value] of Object.entries(obj)) {
        const currentPath = prefix ? `${prefix}[${key}]` : key;
        const currentLabel = formatLabel(key);
        const currentGroup = groupKey || key;
        
        // All fields go to page_data[key][subkey]
        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
            // Recursively flatten nested objects
            const nestedFields = flattenObject(value, currentPath, currentGroup);
            nestedFields.forEach(field => {
                // Update formName to use page_data prefix
                field.formName = `page_data[${field.path}]`;
            });
            fields.push(...nestedFields);
            continue;
        }
        
        fields.push({
            key: prefix ? `${prefix}_${key}` : key,
            path: currentPath,
            value,
            label: currentLabel,
            formName: `page_data[${currentPath}]`,
            group: currentGroup,
        });
    }
    
    return fields;
};

const formFields = computed(() => {
    return flattenObject(templateData.value);
});

// Group fields by their top-level key and filter by expert mode
const groupedFields = computed(() => {
    const groups: Record<string, Array<{ key: string; path: string; value: any; label: string; formName: string; group: string }>> = {};
    
    for (const field of formFields.value) {
        // Skip _expertFields metadata and layout_components (edited in Komponenten section)
        if (field.path === '_expertFields' || field.path === 'layout_components') {
            continue;
        }
        
        // Filter fields based on expert mode
        if (!expertMode.value) {
            // In normal mode: hide expert fields
            if (isExpertField(field.path)) {
                continue;
            }
        }
        // In expert mode: show all fields (no filtering)
        
        if (!groups[field.group]) {
            groups[field.group] = [];
        }
        groups[field.group].push(field);
    }
    
    return groups;
});

const updateField = (path: string, value: any) => {
    const keys = path.split(/[\[\]]/).filter(k => k);
    let current: any = templateData.value;
    
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!current[key] || typeof current[key] !== 'object') {
            current[key] = {};
        }
        current = current[key];
    }
    
    current[keys[keys.length - 1]] = value;
    
    // Force reactivity update
    templateData.value = { ...templateData.value };
};

// Layout components (modular)
const layoutComponents = computed({
    get: () => (templateData.value.layout_components as Array<{ id: string; type: string; data: Record<string, unknown> }>) ?? [],
    set: (val) => {
        templateData.value.layout_components = val;
        templateData.value = { ...templateData.value };
    },
});

function addLayoutComponent(type: LayoutComponentType) {
    const registry = componentRegistry.value;
    if (!registry) return;
    const list = (templateData.value.layout_components as Array<{ id: string; type: string; data: Record<string, unknown> }>) ?? [];
    list.push({
        id: registry.generateLayoutComponentId(),
        type,
        data: registry.getDefaultDataForType(type),
    });
    templateData.value.layout_components = list;
    templateData.value = { ...templateData.value };
}

function removeLayoutComponent(index: number) {
    const list = [...(layoutComponents.value ?? [])];
    list.splice(index, 1);
    templateData.value.layout_components = list;
    templateData.value = { ...templateData.value };
}

function moveLayoutComponent(index: number, direction: 'up' | 'down') {
    const list = [...(layoutComponents.value ?? [])];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= list.length) return;
    [list[index], list[target]] = [list[target], list[index]];
    templateData.value.layout_components = list;
    templateData.value = { ...templateData.value };
}

function updateLayoutComponentData(index: number, data: Record<string, unknown>) {
    const list = (templateData.value.layout_components as Array<{ id: string; type: string; data: Record<string, unknown> }>) ?? [];
    if (list[index]) list[index].data = data;
    templateData.value = { ...templateData.value };
}

function getComponentLabel(type: string, entry?: { data?: Record<string, unknown> }): string {
    const label = entry?.data?.moduleLabel;
    if (typeof label === 'string' && label.trim() !== '') {
        return label.trim();
    }
    return componentRegistry.value?.LAYOUT_COMPONENT_REGISTRY.find((r) => r.type === type)?.label ?? type;
}

function updateJsonComponentData(index: number, jsonString: string) {
    try {
        const parsed = JSON.parse(jsonString) as Record<string, unknown>;
        const list = (templateData.value.layout_components as Array<{ id: string; type: string; data: Record<string, unknown> }>) ?? [];
        if (list[index]) list[index].data = parsed;
        templateData.value = { ...templateData.value };
    } catch {
        // ignore invalid JSON
    }
}

const showAddComponentMenu = ref(false);

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Templates', href: templatesIndex().url },
    {
        title: props.template.name,
        href: templatesShow({ template: props.template.id }).url,
    },
    { title: 'Bearbeiten', href: '#' },
];
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head :title="`Template bearbeiten: ${template.name}`" />

        <div class="space-y-6">
            <div>
                <Heading level="h1">Template bearbeiten</Heading>
                <Text class="mt-2" muted>
                    {{ template.name }}
                </Text>
            </div>

            <form @submit.prevent="submit">
                <div class="grid grid-cols-4 gap-6">
                    <!-- Links: Template-Details (25%) -->
                    <Card class="col-span-1">
                        <CardHeader>
                            <CardTitle>Template-Details</CardTitle>
                            <CardDescription>Grundinformationen</CardDescription>
                        </CardHeader>
                        <CardContent class="space-y-6">
                            <div class="space-y-2">
                                <Label for="name">Name</Label>
                                <Input
                                    id="name"
                                    v-model="formData.name"
                                    required
                                    :aria-invalid="!!errors.name"
                                />
                                <InputError :message="errors.name" />
                            </div>
                            <div class="space-y-2">
                                <Label for="slug">Slug</Label>
                                <Input
                                    id="slug"
                                    v-model="formData.slug"
                                    required
                                    :aria-invalid="!!errors.slug"
                                />
                                <InputError :message="errors.slug" />
                            </div>
                            <div class="space-y-2">
                                <Label for="price">Preis (monatlich)</Label>
                                <Input
                                    id="price"
                                    v-model="formData.price"
                                    type="number"
                                    step="0.01"
                                    :aria-invalid="!!errors.price"
                                />
                                <InputError :message="errors.price" />
                            </div>
                            
                            <div class="space-y-2">
                                <div class="flex items-center gap-2">
                                    <Checkbox
                                        id="is_active"
                                        v-model="formData.is_active"
                                        :aria-invalid="!!errors.is_active"
                                    />
                                    <Label for="is_active" class="cursor-pointer">Template ist aktiv</Label>
                                </div>
                                <InputError :message="errors.is_active" />
                            </div>
                            
                            <div class="space-y-2">
                                <Label for="preview_image">Vorschaubild (URL)</Label>
                                <Input
                                    id="preview_image"
                                    v-model="formData.preview_image"
                                    type="text"
                                    placeholder="/images/preview.jpg oder https://example.com/image.jpg"
                                    :aria-invalid="!!errors.preview_image"
                                />
                                <InputError :message="errors.preview_image" />
                                <div v-if="formData.preview_image" class="mt-2">
                                    <img
                                        :src="formData.preview_image"
                                        alt="Vorschaubild"
                                        class="max-w-full h-auto rounded-md border border-input max-h-32 object-cover"
                                        @error="(e) => { (e.target as HTMLImageElement).style.display = 'none'; }"
                                    />
                                </div>
                            </div>

                            <CardFooter class="px-0 pb-0 pt-4">
                                <div class="flex flex-col gap-2 w-full">
                                    <Button type="submit" :disabled="processing" class="w-full">
                                        {{ processing ? 'Speichern...' : 'Speichern' }}
                                    </Button>
                                    <Link :href="templatesShow({ template: template.id }).url" class="w-full">
                                        <Button type="button" variant="outline" class="w-full">Abbrechen</Button>
                                    </Link>
                                </div>
                            </CardFooter>
                        </CardContent>
                    </Card>

                    <!-- Komponenten (Layout) – nur wenn Template eine Component-Registry hat -->
                    <Card v-if="componentRegistry" class="col-span-3">
                        <CardHeader>
                            <CardTitle>Komponenten</CardTitle>
                            <CardDescription>Layout-Komponenten in Reihenfolge (Header, Footer, Hero, …). Komponente hinzufügen, bearbeiten, verschieben oder entfernen.</CardDescription>
                        </CardHeader>
                        <CardContent class="space-y-4">
                            <div class="relative">
                                <Button type="button" variant="outline" size="sm" @click="showAddComponentMenu = !showAddComponentMenu">
                                    <Plus class="h-4 w-4 mr-1" />
                                    Komponente hinzufügen
                                </Button>
                                <div v-if="showAddComponentMenu" class="absolute left-0 top-full z-10 mt-1 flex flex-col gap-1 rounded-md border bg-card p-2 shadow">
                                    <button
                                        v-for="reg in componentRegistry.LAYOUT_COMPONENT_REGISTRY"
                                        :key="reg.type"
                                        type="button"
                                        class="rounded px-3 py-2 text-left text-sm hover:bg-muted"
                                        @click="addLayoutComponent(reg.type as LayoutComponentType); showAddComponentMenu = false"
                                    >
                                        {{ reg.label }}
                                    </button>
                                </div>
                            </div>
                            <div class="space-y-2">
                                <div
                                    v-for="(entry, index) in layoutComponents"
                                    :key="entry.id"
                                    class="flex flex-col gap-2 rounded-lg border p-3"
                                >
                                    <div class="flex items-center gap-2">
                                        <GripVertical class="h-4 w-4 text-muted-foreground" />
                                        <span class="font-medium">{{ getComponentLabel(entry.type, entry) }}</span>
                                        <div class="ml-auto flex gap-1">
                                            <Button type="button" variant="ghost" size="icon" :disabled="index === 0" @click="moveLayoutComponent(index, 'up')">
                                                <ChevronDown class="h-4 w-4 rotate-180" />
                                            </Button>
                                            <Button type="button" variant="ghost" size="icon" :disabled="index === layoutComponents.length - 1" @click="moveLayoutComponent(index, 'down')">
                                                <ChevronDown class="h-4 w-4" />
                                            </Button>
                                            <Button type="button" variant="ghost" size="icon" @click="removeLayoutComponent(index)">
                                                <Trash2 class="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <Collapsible>
                                        <CollapsibleTrigger class="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                                            <ChevronDown class="h-4 w-4" />
                                            Daten bearbeiten
                                        </CollapsibleTrigger>
                                        <CollapsibleContent class="mt-3 space-y-3 pl-6">
                                            <template v-if="entry.type === 'header'">
                                                <div class="grid gap-2 sm:grid-cols-2">
                                                    <div class="space-y-1">
                                                        <Label>Praxisname</Label>
                                                        <Input v-model="(entry.data as Record<string, unknown>).siteName" />
                                                    </div>
                                                    <div class="space-y-1">
                                                        <Label>Logo URL</Label>
                                                        <Input v-model="(entry.data as Record<string, unknown>).logoUrl" />
                                                    </div>
                                                    <div class="space-y-1">
                                                        <Label>CTA Button Text</Label>
                                                        <Input v-model="(entry.data as Record<string, unknown>).ctaButtonText" />
                                                    </div>
                                                    <div class="space-y-1">
                                                        <Label>CTA Button Link</Label>
                                                        <Input v-model="(entry.data as Record<string, unknown>).ctaButtonHref" />
                                                    </div>
                                                </div>
                                                <div class="space-y-1">
                                                    <Label>Navigation (Links: href, label)</Label>
                                                    <Textarea
                                                        :model-value="JSON.stringify((entry.data as Record<string, unknown>).links ?? [], null, 2)"
                                                        class="font-mono text-sm"
                                                        :rows="6"
                                                        @update:model-value="(v) => { try { (entry.data as Record<string, unknown>).links = JSON.parse(v as string); } catch { } }"
                                                    />
                                                </div>
                                            </template>
                                            <template v-else-if="entry.type === 'footer'">
                                                <div class="grid gap-2 sm:grid-cols-2">
                                                    <div class="space-y-1"><Label>Praxisname</Label><Input v-model="(entry.data as Record<string, unknown>).siteName" /></div>
                                                    <div class="space-y-1"><Label>Beschreibung</Label><Input v-model="(entry.data as Record<string, unknown>).description" /></div>
                                                    <div class="space-y-1"><Label>Adresse</Label><Input v-model="(entry.data as Record<string, unknown>).address" /></div>
                                                    <div class="space-y-1"><Label>Telefon</Label><Input v-model="(entry.data as Record<string, unknown>).phone" /></div>
                                                    <div class="space-y-1"><Label>E-Mail</Label><Input v-model="(entry.data as Record<string, unknown>).email" /></div>
                                                    <div class="space-y-1"><Label>Öffnungszeiten (eine Zeile)</Label><Input v-model="(entry.data as Record<string, unknown>).openingLine" /></div>
                                                    <div class="space-y-1"><Label>Copyright-Text</Label><Input v-model="(entry.data as Record<string, unknown>).copyrightText" /></div>
                                                    <div class="space-y-1"><Label>Credit-Zeile</Label><Input v-model="(entry.data as Record<string, unknown>).creditLine" /></div>
                                                </div>
                                                <div class="space-y-1">
                                                    <Label>Links Seiten (JSON Array)</Label>
                                                    <Textarea :model-value="JSON.stringify((entry.data as Record<string, unknown>).linksSeiten ?? [], null, 2)" class="font-mono text-sm" :rows="4" @update:model-value="(v) => { try { (entry.data as Record<string, unknown>).linksSeiten = JSON.parse(v as string); } catch { } }" />
                                                </div>
                                                <div class="space-y-1">
                                                    <Label>Links Rechtliches (JSON Array)</Label>
                                                    <Textarea :model-value="JSON.stringify((entry.data as Record<string, unknown>).linksRechtliches ?? [], null, 2)" class="font-mono text-sm" :rows="3" @update:model-value="(v) => { try { (entry.data as Record<string, unknown>).linksRechtliches = JSON.parse(v as string); } catch { } }" />
                                                </div>
                                            </template>
                                            <template v-else-if="entry.type === 'hero'">
                                                <div class="grid gap-2 sm:grid-cols-2">
                                                    <div class="space-y-1"><Label>Überschrift</Label><Input v-model="(entry.data as Record<string, unknown>).heading" /></div>
                                                    <div class="space-y-1"><Label>Text</Label><Input v-model="(entry.data as Record<string, unknown>).text" /></div>
                                                    <div class="space-y-1">
                                                        <Label>Bild URL</Label>
                                                        <Input
                                                            :model-value="((entry.data as Record<string, unknown>).image as Record<string, string>)?.src ?? ''"
                                                            @update:model-value="(val) => { if (!(entry.data as Record<string, unknown>).image) (entry.data as Record<string, unknown>).image = {}; ((entry.data as Record<string, unknown>).image as Record<string, string>).src = val; }"
                                                        />
                                                    </div>
                                                    <div class="space-y-1">
                                                        <Label>Bild Alt</Label>
                                                        <Input
                                                            :model-value="((entry.data as Record<string, unknown>).image as Record<string, string>)?.alt ?? ''"
                                                            @update:model-value="(val) => { if (!(entry.data as Record<string, unknown>).image) (entry.data as Record<string, unknown>).image = {}; ((entry.data as Record<string, unknown>).image as Record<string, string>).alt = val; }"
                                                        />
                                                    </div>
                                                </div>
                                                <div class="space-y-1">
                                                    <Label>Buttons (JSON Array)</Label>
                                                    <Textarea :model-value="JSON.stringify((entry.data as Record<string, unknown>).buttons ?? [], null, 2)" class="font-mono text-sm" :rows="4" @update:model-value="(v) => { try { (entry.data as Record<string, unknown>).buttons = JSON.parse(v as string); } catch { } }" />
                                                </div>
                                            </template>
                                            <template v-else-if="entry.type === 'mobileNav'">
                                                <div class="space-y-1">
                                                    <Label>Links (JSON Array, gleiche Struktur wie Header)</Label>
                                                    <Textarea :model-value="JSON.stringify((entry.data as Record<string, unknown>).links ?? [], null, 2)" class="font-mono text-sm" :rows="5" @update:model-value="(v) => { try { (entry.data as Record<string, unknown>).links = JSON.parse(v as string); } catch { } }" />
                                                </div>
                                            </template>
                                            <template v-else-if="entry.type === 'json'">
                                                <div class="space-y-1">
                                                    <Label>JSON (beliebige Daten, z. B. text, html, className)</Label>
                                                    <Textarea
                                                        :model-value="JSON.stringify(entry.data ?? {}, null, 2)"
                                                        class="font-mono text-sm"
                                                        :rows="12"
                                                        @update:model-value="(v) => updateJsonComponentData(layoutComponents.indexOf(entry), v as string)"
                                                    />
                                                </div>
                                            </template>
                                        </CollapsibleContent>
                                    </Collapsible>
                                </div>
                            </div>
                            <p v-if="layoutComponents.length === 0" class="text-sm text-muted-foreground">Noch keine Komponenten. „Komponente hinzufügen“ wählen.</p>
                        </CardContent>
                    </Card>

                    <!-- Rechts: Template-Daten (75%) -->
                    <Card class="col-span-3">
                        <CardHeader>
                            <div class="flex items-center justify-between">
                                <div>
                                    <CardTitle>Template-Daten</CardTitle>
                                    <CardDescription>Konfiguration und Inhalte</CardDescription>
                                </div>
                                <div class="flex items-center gap-3">
                                <div class="flex items-center gap-2">
                                    <Sparkles :class="expertMode ? 'h-4 w-4 text-emerald-500' : 'h-4 w-4 text-muted-foreground'" />
                                    <Label for="expert-mode" class="text-sm font-normal cursor-pointer">
                                        Expert-Modus
                                    </Label>
                                    <Switch
                                        id="expert-mode"
                                        v-model="expertMode"
                                    />
                                </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div class="space-y-6">
                                <Collapsible>
                                    <CollapsibleTrigger class="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                                        <ChevronDown class="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                                        <Upload class="h-4 w-4" />
                                        <span>JSON importieren</span>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent class="mt-3 space-y-3">
                                        <div class="space-y-2 w-full">
                                            <Label for="json-import">JSON-Daten</Label>
                                            <Textarea
                                                id="json-import"
                                                v-model="jsonImport"
                                                placeholder='{ "site": { "title": "..." }, "colors": { "primary": "#059669" } }'
                                                :rows="12"
                                                class="font-mono text-sm w-full"
                                            />
                                            <div class="flex gap-2">
                                                <Button type="button" @click="importJson" variant="outline" size="sm">
                                                    Importieren
                                                </Button>
                                                <label class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 cursor-pointer">
                                                    <Upload class="h-4 w-4 mr-2" />
                                                    Datei auswählen
                                                    <input
                                                        type="file"
                                                        accept=".json,application/json"
                                                        @change="handleFileUpload"
                                                        class="hidden"
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    </CollapsibleContent>
                                </Collapsible>
                            
                                <!-- Gruppierte dynamische Felder -->
                                <div v-if="Object.keys(groupedFields).length > 0" class="space-y-6">
                                    <Card
                                        v-for="(fields, groupName) in groupedFields"
                                        :key="groupName"
                                        class="border-2"
                                    >
                                        <CardHeader class="pb-3">
                                            <CardTitle class="text-base">{{ formatLabel(groupName) }}</CardTitle>
                                            <CardDescription class="text-xs">
                                                {{ fields.length }} {{ fields.length === 1 ? 'Feld' : 'Felder' }}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div
                                                    v-for="field in fields"
                                                    :key="field.key"
                                                    :class="[
                                                        'relative rounded-lg p-3 transition-all',
                                                        isExpertField(field.path)
                                                            ? 'bg-emerald-50 dark:bg-emerald-950/30 border-2 border-emerald-200 dark:border-emerald-800'
                                                            : 'border border-transparent'
                                                    ]"
                                                >
                                                    <div class="flex items-start gap-2">
                                                        <div class="flex-1">
                                                            <div class="flex items-center gap-2 mb-2">
                                                                <Label :for="field.key" class="text-xs font-medium">
                                                                    {{ field.label }}
                                                                </Label>
                                                                <Badge
                                                                    v-if="isExpertField(field.path)"
                                                                    variant="success"
                                                                    size="sm"
                                                                    class="flex items-center gap-1"
                                                                >
                                                                    <Sparkles class="h-3 w-3" />
                                                                    Expert
                                                                </Badge>
                                                            </div>
                                                            <DynamicFormField
                                                                :id="field.key"
                                                                :name="field.formName"
                                                                :label="field.label"
                                                                :model-value="field.value"
                                                                :show-label="false"
                                                                @update:model-value="(value) => updateField(field.path, value)"
                                                            />
                                                        </div>
                                                        <button
                                                            type="button"
                                                            @click="toggleExpertField(field.path)"
                                                            :class="[
                                                                'mt-7 p-1.5 rounded-md transition-colors flex-shrink-0',
                                                                isExpertField(field.path)
                                                                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900'
                                                                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                            ]"
                                                            :title="isExpertField(field.path) ? 'Als Expert-Feld entfernen' : 'Als Expert-Feld markieren'"
                                                        >
                                                            <Sparkles class="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                                <div v-else class="rounded-lg border border-input p-8 text-center text-muted-foreground">
                                    <p>Keine Daten definiert. Importieren Sie JSON-Daten, um Felder zu erstellen.</p>
                                </div>
                                
                                <!-- JSON-Vorschau -->
                                <Collapsible v-if="Object.keys(groupedFields).length > 0" class="mt-4">
                                    <CollapsibleTrigger class="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                                        <ChevronDown class="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                                        <span>JSON-Vorschau</span>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent class="mt-3">
                                        <JsonViewer :value="templateDataJson" max-height="400px" />
                                    </CollapsibleContent>
                                </Collapsible>
                                
                                <InputError :message="errors.page_data" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </form>
        </div>
    </AppLayout>
</template>
