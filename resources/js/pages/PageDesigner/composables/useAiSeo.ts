import { ref } from 'vue';
import type { DesignerStore } from '@/pages/PageDesigner/stores/useDesignerStore';

export type AiSeoError =
    | { type: 'insufficient_tokens'; message: string }
    | { type: 'rate_limit'; message: string }
    | { type: 'unavailable'; message: string }
    | { type: 'error'; message: string };

export function useAiSeo(
    designer: DesignerStore,
    options: { onSuccess?: () => void; onError?: (err: AiSeoError) => void; refreshBalance?: () => void },
) {
    const loading = ref(false);

    async function optimizeSeo(): Promise<void> {
        const site = designer.props.site;
        if (!site?.uuid || designer.isTemplateMode) return;

        loading.value = true;
        const layoutComponents =
            designer.currentPageSlug === 'index'
                ? (designer.fullCustomPageData.layout_components ?? [])
                : ((designer.fullCustomPageData.pages as Record<string, { layout_components?: unknown[] }>)?.[
                      designer.currentPageSlug
                  ]?.layout_components ?? []);

        try {
            const res = await fetch('/api/ai/seo-suggestions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-XSRF-TOKEN': getCsrfToken() },
                credentials: 'include',
                body: JSON.stringify({
                    site_uuid: site.uuid,
                    page_slug: designer.currentPageSlug,
                    page_title: designer.currentPageSeo.meta_title ?? designer.getPageLabel(designer.currentPageSlug),
                    layout_components: layoutComponents,
                }),
            });

            const data = await res.json().catch(() => ({}));

            if (res.ok) {
                const raw = {
                    meta_title: (data.meta_title ?? '').trim(),
                    meta_description: (data.meta_description ?? '').trim(),
                    og_title: (data.og_title ?? '').trim(),
                    og_description: (data.og_description ?? '').trim(),
                    og_image: (data.og_image ?? '').trim(),
                    twitter_card: (data.twitter_card ?? '').trim(),
                    twitter_title: (data.twitter_title ?? '').trim(),
                    twitter_description: (data.twitter_description ?? '').trim(),
                    twitter_image: (data.twitter_image ?? '').trim(),
                };
                const updates: Record<string, string> = {};
                if (raw.meta_title) updates.meta_title = raw.meta_title;
                if (raw.meta_description) updates.meta_description = raw.meta_description;
                if (raw.og_title) updates.og_title = raw.og_title;
                if (raw.og_description) updates.og_description = raw.og_description;
                if (raw.og_image) updates.og_image = raw.og_image;
                if (raw.twitter_card) updates.twitter_card = raw.twitter_card;
                if (raw.twitter_title) updates.twitter_title = raw.twitter_title;
                if (raw.twitter_description) updates.twitter_description = raw.twitter_description;
                if (raw.twitter_image) updates.twitter_image = raw.twitter_image;

                const hasAny = raw.meta_title || raw.meta_description || raw.og_title || raw.og_description;
                if (!hasAny) {
                    options.onError?.({ type: 'error', message: 'KI konnte keine Vorschläge erzeugen. Bitte versuchen Sie es erneut.' });
                    return;
                }

                designer.setPageSeo(designer.currentPageSlug, updates);
                options.refreshBalance?.();
                options.onSuccess?.();
                return;
            }

            if (res.status === 402) {
                options.onError?.({ type: 'insufficient_tokens', message: data.message ?? 'Nicht genügend AI-Tokens.' });
                return;
            }
            if (res.status === 429) {
                options.onError?.({ type: 'rate_limit', message: 'Bitte kurz warten.' });
                return;
            }
            if (res.status === 503) {
                options.onError?.({ type: 'unavailable', message: data.message ?? 'AI-Service nicht verfügbar.' });
                return;
            }
            options.onError?.({ type: 'error', message: data.message ?? 'Ein Fehler ist aufgetreten.' });
        } catch {
            options.onError?.({ type: 'error', message: 'Ein Fehler ist aufgetreten.' });
        } finally {
            loading.value = false;
        }
    }

    return { loading, optimizeSeo };
}

function getCsrfToken(): string {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}
