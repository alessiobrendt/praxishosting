import { createInertiaApp } from '@inertiajs/vue3';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import type { DefineComponent } from 'vue';
import { createApp, h } from 'vue';
import '../css/app.css';
import { initializeTheme } from './composables/useAppearance';
import AppRoot from './components/AppRoot.vue';

import * as Sentry from '@sentry/vue';

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

        app.use(plugin).mount(el);
    },
    progress: {
        color: '#4B5563',
    },
});



// This will set light / dark mode on page load...
initializeTheme();
