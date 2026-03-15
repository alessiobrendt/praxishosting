import { createInertiaApp } from '@inertiajs/vue3';
import * as Sentry from '@sentry/vue';
import { createBootstrap } from 'bootstrap-vue-next';
import { loader as monacoLoader } from '@guolao/vue-monaco-editor';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import type { DefineComponent } from 'vue';
import { createApp, h } from 'vue';
import '../css/app.css';
import '../scss/app.scss';
import AppRoot from './components/AppRoot.vue';
import { initializeTheme } from './composables/useAppearance';

monacoLoader.config({
    paths: {
        vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.54.0/min/vs',
    },
});

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.vue`,
            import.meta.glob<DefineComponent>('./pages/**/*.vue'),
        ),
    setup({ el, App, props, plugin }) {
        const app = createApp({
            render: () =>
                h(AppRoot, {
                    appComponent: App,
                    appProps: props,
                }),
        });

        Sentry.init({
            app,
            dsn: 'https://6d7c87cf1d1174e61caf86babcf1a375@o769981.ingest.us.sentry.io/4510988908494848',
            sendDefaultPii: true,
            integrations: [Sentry.replayIntegration()],
            replaysSessionSampleRate: 0.1,
            replaysOnErrorSampleRate: 1.0,
        });

        const pinia = createPinia().use(piniaPluginPersistedstate);
        app.use(plugin).use(pinia).use(createBootstrap()).mount(el);
    },
    progress: {
        color: '#4B5563',
    },
});



// This will set light / dark mode on page load...
initializeTheme();
