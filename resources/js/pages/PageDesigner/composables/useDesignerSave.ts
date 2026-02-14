import { ref } from 'vue';
import designRoutes from '@/routes/admin/templates/design';
import designer from '@/routes/sites/designer';
import { notify } from '@/composables/useNotify';

export type DesignerSaveContext = {
    getFullCustomPageData: () => Record<string, unknown>;
    getSite: () => { uuid: string } | undefined;
    getSiteFaviconUrl?: () => string | null;
    getTemplate: () => { id: number } | undefined;
    isTemplateMode: () => boolean;
    getCurrentPageSlug: () => string;
    getPageData: () => Record<string, unknown>;
    getCsrfToken: () => string;
    pushPreviewDraft: () => void;
    getUpdatedAt: () => string | null | undefined;
    setUpdatedAt?: (value: string | null) => void;
};

export function useDesignerSave(ctx: DesignerSaveContext) {
    const saveInProgress = ref(false);

    function saveToTemplate(): void {
        if (!ctx.getTemplate() || !ctx.isTemplateMode()) return;
        saveInProgress.value = true;
        const data = {
            layout_components: (ctx.getPageData().layout_components ?? []) as unknown[],
            colors: ctx.getPageData().colors ?? undefined,
        };
        fetch(designRoutes.update.url({ template: ctx.getTemplate()!.id }), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-XSRF-TOKEN': ctx.getCsrfToken(),
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify({ page_slug: ctx.getCurrentPageSlug(), data }),
            credentials: 'same-origin',
        })
            .then((res) => {
                if (res.ok) notify.success('Gespeichert.');
                else notify.error('Fehler beim Speichern.');
            })
            .catch(() => notify.error('Fehler beim Speichern.'))
            .finally(() => {
                saveInProgress.value = false;
            });
    }

    function saveToSite(): void {
        if (ctx.isTemplateMode() || !ctx.getSite()) return;
        saveInProgress.value = true;
        const data = ctx.getFullCustomPageData();
        const payload = {
            custom_page_data: data,
            custom_colors: (data.colors as Record<string, string>) ?? {},
            favicon_url: ctx.getSiteFaviconUrl?.() ?? undefined,
            updated_at: ctx.getUpdatedAt?.() ?? null,
        };
        fetch(designer.publish({ site: ctx.getSite()!.uuid }).url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-XSRF-TOKEN': ctx.getCsrfToken(),
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify(payload),
            credentials: 'same-origin',
        })
            .then(async (res) => {
                if (res.ok) {
                    const data = await res.json();
                    ctx.setUpdatedAt?.(data?.updated_at ?? null);
                    notify.success('Gespeichert.');
                    ctx.pushPreviewDraft();
                } else if (res.status === 409) {
                    notify.error('Konflikt: Die Seite wurde woanders geändert. Bitte laden Sie neu.');
                } else {
                    notify.error('Fehler beim Speichern.');
                }
            })
            .catch(() => notify.error('Fehler beim Speichern.'))
            .finally(() => {
                saveInProgress.value = false;
            });
    }

    return {
        saveInProgress,
        saveToSite,
        saveToTemplate,
    };
}
