<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { usePage } from '@inertiajs/vue3';
import { Transition } from 'vue';
import Button from '@/components/ui/button/Button.vue';
import Modal from '@/components/ui/modal/Modal.vue';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Switch from '@/components/ui/switch/Switch.vue';

const COOKIE_CONSENT_NAME = 'cookie_consent';
const COOKIE_MAX_AGE_DAYS = 365;

export interface ConsentState {
    preferences: boolean;
    statistics: boolean;
    marketing: boolean;
}

const page = usePage();
const visible = ref(false);
const settingsOpen = ref(false);

const brand = computed(
    () => page.props.brand as { logoUrl?: string; name?: string; themeColors?: Record<string, string> } | null,
);
const privacyUrl = computed(() => (page.props.privacyUrl as string) ?? '#');

const preferences = ref(true);
const statistics = ref(true);
const marketing = ref(true);

const brandThemeStyle = computed(() => {
    const colors = brand.value?.themeColors;
    if (!colors || typeof colors !== 'object') return undefined;
    const vars: Record<string, string> = {};
    for (const [key, value] of Object.entries(colors)) {
        if (value) vars[`--${key.replace(/_/g, '-')}`] = value;
    }
    if (colors.primary_dark && !colors.primary) {
        vars['--primary'] = colors.primary_dark;
    }
    if (colors.primary_dark && !colors.primary_hover) {
        vars['--primary-hover'] = colors.primary_dark;
    }
    const primary = vars['--primary'] ?? colors.primary ?? colors.primary_dark;
    if (primary) {
        vars['--sidebar-primary'] = primary;
        vars['--sidebar-primary-foreground'] = '#ffffff';
        vars['--ring'] = primary;
        vars['--accent'] = primary;
        vars['--accent-foreground'] = '#ffffff';
        vars['--sidebar-ring'] = primary;
    }
    return Object.keys(vars).length ? vars : undefined;
});

function getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
}

function setConsentCookie(value: string): void {
    if (typeof document === 'undefined') return;
    const maxAge = COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;
    document.cookie = `${COOKIE_CONSENT_NAME}=${encodeURIComponent(value)};path=/;max-age=${maxAge};SameSite=Lax`;
}

function parseConsent(raw: string | null): ConsentState | 'all' | 'necessary' | null {
    if (!raw) return null;
    if (raw === 'all') return 'all';
    if (raw === 'necessary') return 'necessary';
    try {
        const parsed = JSON.parse(raw) as { p?: number; s?: number; m?: number };
        return {
            preferences: parsed.p === 1,
            statistics: parsed.s === 1,
            marketing: parsed.m === 1,
        };
    } catch {
        return null;
    }
}

function consentToCookie(value: ConsentState): string {
    return JSON.stringify({
        p: value.preferences ? 1 : 0,
        s: value.statistics ? 1 : 0,
        m: value.marketing ? 1 : 0,
    });
}

function applyConsentToToggles(consent: ConsentState | 'all' | 'necessary'): void {
    if (consent === 'all') {
        preferences.value = true;
        statistics.value = true;
        marketing.value = true;
    } else if (consent === 'necessary') {
        preferences.value = false;
        statistics.value = false;
        marketing.value = false;
    } else {
        preferences.value = consent.preferences;
        statistics.value = consent.statistics;
        marketing.value = consent.marketing;
    }
}

function hideBanner(): void {
    visible.value = false;
    settingsOpen.value = false;
}

function acceptAll(): void {
    setConsentCookie('all');
    hideBanner();
}

function rejectAll(): void {
    setConsentCookie('necessary');
    hideBanner();
}

function allowSelection(): void {
    setConsentCookie(consentToCookie({
        preferences: preferences.value,
        statistics: statistics.value,
        marketing: marketing.value,
    }));
    hideBanner();
}

function openSettings(): void {
    const raw = getCookie(COOKIE_CONSENT_NAME);
    const consent = parseConsent(raw);
    if (consent) {
        applyConsentToToggles(consent);
    } else {
        preferences.value = true;
        statistics.value = true;
        marketing.value = true;
    }
    settingsOpen.value = true;
}

onMounted(() => {
    const raw = getCookie(COOKIE_CONSENT_NAME);
    const consent = parseConsent(raw);
    visible.value = consent === null;
});
</script>

<template>
    <Transition
        enter-active-class="transition-all duration-300"
        enter-from-class="opacity-0 translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-200"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-4"
    >
        <div
            v-if="visible"
            class="fixed bottom-4 left-4 right-4 z-40 mx-auto max-w-3xl rounded-2xl border border-border border-l-4 border-l-primary bg-card px-4 py-3.5 text-card-foreground shadow-modern-xl"
            :style="brandThemeStyle"
        >
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <div v-if="brand?.logoUrl" class="shrink-0 self-start sm:self-center">
                    <img
                        :src="brand.logoUrl"
                        :alt="brand.name ?? ''"
                        class="h-8 max-h-8 w-auto object-contain object-left"
                    />
                </div>
                <div class="min-w-0 flex-1 text-sm leading-snug sm:max-w-md">
                    <p class="text-muted-foreground">
                        Wir verwenden Cookies, um die Nutzung zu verbessern und die Seite zu analysieren.
                        <a
                            :href="privacyUrl"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="font-medium text-primary underline-offset-2 hover:underline"
                        >
                            Datenschutzerklärung
                        </a>
                    </p>
                </div>
                <div class="flex shrink-0 flex-wrap items-center gap-2 sm:gap-2.5">
                    <Button type="button" variant="ghost" size="sm" class="text-foreground" @click="openSettings">
                        Einstellungen
                    </Button>
                    <Button type="button" variant="outline" size="sm" @click="rejectAll">
                        Ablehnen
                    </Button>
                    <Button type="button" size="sm" @click="acceptAll">
                        Alle zulassen
                    </Button>
                </div>
            </div>
        </div>
    </Transition>

    <Modal v-model="settingsOpen" size="lg" class="bg-card text-card-foreground">
        <div class="p-5" :style="brandThemeStyle">
            <div v-if="brand?.logoUrl" class="mb-4">
                <img
                    :src="brand.logoUrl"
                    :alt="brand.name ?? ''"
                    class="h-10 w-auto object-contain object-left"
                />
            </div>
            <Tabs default-tab="consent" class="w-full">
                <TabsList class="mb-4 w-full">
                    <TabsTrigger value="consent">
                        Zustimmung
                    </TabsTrigger>
                    <TabsTrigger value="details">
                        Details
                    </TabsTrigger>
                    <TabsTrigger value="about">
                        Über Cookies
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="consent" class="mt-4">
                    <h2 class="mb-3 text-lg font-semibold text-foreground">
                        Diese Webseite verwendet Cookies
                    </h2>
                    <p class="mb-5 text-sm text-muted-foreground">
                        Wir verwenden Cookies, um Inhalte und Anzeigen zu personalisieren, Funktionen für soziale Medien
                        anzubieten und die Zugriffe auf unsere Website zu analysieren. Außerdem geben wir Informationen
                        zu Ihrer Nutzung unserer Website an unsere Partner für soziale Medien, Werbung und Analysen
                        weiter. Weitere Informationen finden Sie in unserer
                        <a
                            :href="privacyUrl"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="text-primary underline-offset-4 hover:underline"
                        >
                            Datenschutzerklärung
                        </a>.
                    </p>
                    <div class="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <div class="flex flex-col items-center gap-2 rounded-lg border border-border bg-muted/30 p-4 text-center">
                            <span class="text-sm font-medium text-foreground">Notwendig</span>
                            <Switch :model-value="true" disabled class="pointer-events-none" />
                            <span class="text-xs text-muted-foreground">Immer aktiv</span>
                        </div>
                        <div class="flex flex-col items-center gap-2 rounded-lg border border-border bg-muted/30 p-4 text-center">
                            <span class="text-sm font-medium text-foreground">Präferenzen</span>
                            <Switch v-model="preferences" />
                        </div>
                        <div class="flex flex-col items-center gap-2 rounded-lg border border-border bg-muted/30 p-4 text-center">
                            <span class="text-sm font-medium text-foreground">Statistiken</span>
                            <Switch v-model="statistics" />
                        </div>
                        <div class="flex flex-col items-center gap-2 rounded-lg border border-border bg-muted/30 p-4 text-center">
                            <span class="text-sm font-medium text-foreground">Marketing</span>
                            <Switch v-model="marketing" />
                        </div>
                    </div>
                    <div class="flex flex-wrap items-center justify-end gap-2">
                        <Button type="button" variant="outline" @click="rejectAll">
                            Ablehnen
                        </Button>
                        <Button type="button" variant="outline" @click="allowSelection">
                            Auswahl erlauben
                        </Button>
                        <Button type="button" @click="acceptAll">
                            Alle zulassen
                        </Button>
                    </div>
                </TabsContent>
                <TabsContent value="details" class="mt-4">
                    <p class="text-sm text-muted-foreground">
                        In den Details finden Sie eine Auflistung der verwendeten Cookies nach Kategorien. Die
                        Einstellungen können Sie auf dem Tab „Zustimmung“ anpassen.
                    </p>
                    <div class="mt-4 rounded-lg border border-border bg-muted/30 p-4">
                        <p class="text-xs text-muted-foreground">
                            Notwendig: Sitzung, CSRF, Cookie-Consent-Speicherung.<br>
                            Präferenzen: Sprache, Darstellung.<br>
                            Statistiken: anonymisierte Nutzungsanalyse.<br>
                            Marketing: personalisierte Anzeigen (falls aktiviert).
                        </p>
                    </div>
                </TabsContent>
                <TabsContent value="about" class="mt-4">
                    <p class="text-sm text-muted-foreground">
                        Cookies sind kleine Textdateien, die von Webseiten auf Ihrem Gerät gespeichert werden. Sie
                        dienen dazu, die Nutzung zu erleichtern, Inhalte anzupassen und Zugriffe auszuwerten. Sie
                        können Ihre Auswahl jederzeit in den Einstellungen ändern.
                    </p>
                </TabsContent>
            </Tabs>
        </div>
    </Modal>
</template>
