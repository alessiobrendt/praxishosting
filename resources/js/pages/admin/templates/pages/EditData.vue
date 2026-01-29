<script setup lang="ts">
import { router, Head, Link, usePage } from '@inertiajs/vue3';
import InputError from '@/components/InputError.vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading } from '@/components/ui/typography';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import DynamicFormField from '@/components/DynamicFormField.vue';
import JsonViewer from '@/components/JsonViewer.vue';
import templates from '@/routes/admin/templates';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { ref, computed, watch, onMounted } from 'vue';
import { Upload, ChevronDown, ArrowLeft, Sparkles } from 'lucide-vue-next';

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
};

const props = defineProps<Props>();
const page = usePage();

// Dynamisches data-Objekt, das sich aus der JSON erweitert
const pageData = ref<Record<string, any>>({});

// Initialize pageData from props
const initializePageData = () => {
    let data = props.page.data;
    
    console.log('Initializing pageData, data from props:', data);
    
    // Handle case where data might be double-nested: { data: { ... } }
    if (data && typeof data === 'object' && !Array.isArray(data)) {
        // If data contains a nested data key, unwrap it
        if ('data' in data && data.data && typeof data.data === 'object' && !Array.isArray(data.data)) {
            console.log('Unwrapping double-nested data');
            data = data.data as Record<string, unknown>;
        }
        
        // Deep clone to ensure reactivity
        pageData.value = JSON.parse(JSON.stringify(data));
        console.log('Using data directly, final pageData.value:', pageData.value);
    } else {
        console.log('No data found or invalid format, initializing empty object');
        pageData.value = {};
    }
    
    console.log('Final pageData.value keys:', Object.keys(pageData.value));
};

// Initialize on mount
onMounted(() => {
    initializePageData();
    initializeExpertFields();
});

// Watch for prop changes (e.g., after Inertia reload)
watch(() => props.page.data, () => {
    initializePageData();
}, { immediate: true });

const errors = computed(() => (page.props.errors as Record<string, string>) ?? {});
const processing = ref(false);

const jsonImport = ref('');

// Expert Mode
const expertMode = ref(false);
const expertFields = ref<Set<string>>(new Set());

// Initialize expert fields from data._expertFields if it exists
const initializeExpertFields = () => {
    if (pageData.value._expertFields && Array.isArray(pageData.value._expertFields)) {
        expertFields.value = new Set(pageData.value._expertFields);
    }
};

// Watch for pageData changes to reinitialize expert fields
watch(() => pageData.value._expertFields, () => {
    initializeExpertFields();
}, { immediate: true });

// Save expert fields to pageData
const saveExpertFields = () => {
    if (expertFields.value.size > 0) {
        pageData.value._expertFields = Array.from(expertFields.value);
    } else {
        delete pageData.value._expertFields;
    }
    // Force reactivity update
    pageData.value = { ...pageData.value };
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
const pageDataJson = computed(() => {
    return JSON.stringify(pageData.value, null, 2);
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
        const preservedExpertFields = pageData.value._expertFields;

        // Merge all data from the parsed JSON into pageData
        // Create a new object to ensure reactivity
        const merged = {
            ...pageData.value,
            ...parsed,
        };
        
        // Deep merge nested objects
        for (const [key, value] of Object.entries(parsed)) {
            if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
                merged[key] = {
                    ...(pageData.value[key] || {}),
                    ...value,
                };
            }
        }
        
        // Restore expert fields if they were preserved
        if (preservedExpertFields) {
            merged._expertFields = preservedExpertFields;
            expertFields.value = new Set(preservedExpertFields);
        }
        
        pageData.value = merged;

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
    
    // Transform pageData into the correct format - everything goes into data
    const submitData: Record<string, any> = {
        data: pageData.value,
    };
    
    router.put(
        `/admin/templates/${props.template.id}/pages/${props.page.id}/data`,
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
        
        // All fields go to data[key][subkey]
        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
            // Recursively flatten nested objects
            const nestedFields = flattenObject(value, currentPath, currentGroup);
            nestedFields.forEach(field => {
                // Update formName to use data prefix
                field.formName = `data[${field.path}]`;
            });
            fields.push(...nestedFields);
            continue;
        }
        
        fields.push({
            key: prefix ? `${prefix}_${key}` : key,
            path: currentPath,
            value,
            label: currentLabel,
            formName: `data[${currentPath}]`,
            group: currentGroup,
        });
    }
    
    return fields;
};

const formFields = computed(() => {
    return flattenObject(pageData.value);
});

// Group fields by their top-level key and filter by expert mode
const groupedFields = computed(() => {
    const groups: Record<string, Array<{ key: string; path: string; value: any; label: string; formName: string; group: string }>> = {};
    
    for (const field of formFields.value) {
        // Skip _expertFields metadata field
        if (field.path === '_expertFields') {
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
    let current: any = pageData.value;
    
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!current[key] || typeof current[key] !== 'object') {
            current[key] = {};
        }
        current = current[key];
    }
    
    current[keys[keys.length - 1]] = value;
    
    // Force reactivity update
    pageData.value = { ...pageData.value };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Templates', href: templates.index().url },
    { title: props.template.name, href: templates.show({ template: props.template.id }).url },
    { title: 'Seiten', href: templates.pages.index({ template: props.template.id }).url },
    { title: props.page.name, href: templates.pages.show({ template: props.template.id, page: props.page.id }).url },
    { title: 'Daten bearbeiten', href: '#' },
];
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head :title="`Daten bearbeiten: ${props.page.name}`" />

        <div class="space-y-6">
            <div class="flex items-center justify-between">
                <Heading level="h1">Seiten-Daten bearbeiten</Heading>
                <Link :href="templates.pages.show({ template: props.template.id, page: props.page.id }).url">
                    <Button variant="outline">
                        <ArrowLeft class="mr-2 h-4 w-4" />
                        Zurück
                    </Button>
                </Link>
            </div>

            <form @submit.prevent="submit">
                <Card>
                    <CardHeader>
                        <div class="flex items-center justify-between">
                            <div>
                                <CardTitle>Seiten-Daten</CardTitle>
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
                                            placeholder='{ "hero": { "heading": "..." }, "about": { "heading": "..." } }'
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
                                    <JsonViewer :value="pageDataJson" max-height="400px" />
                                </CollapsibleContent>
                            </Collapsible>
                            
                            <InputError :message="errors.data" />
                        </div>
                    </CardContent>
                </Card>

                <div class="flex gap-2 mt-6">
                    <Button type="submit" :disabled="processing">
                        {{ processing ? 'Speichern...' : 'Speichern' }}
                    </Button>
                    <Link :href="templates.pages.show({ template: props.template.id, page: props.page.id }).url">
                        <Button type="button" variant="outline">Abbrechen</Button>
                    </Link>
                </div>
            </form>
        </div>
    </AppLayout>
</template>
