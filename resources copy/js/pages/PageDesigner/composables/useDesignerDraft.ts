import { ref } from 'vue';
import designer from '@/routes/sites/designer';

export type DesignerDraftContext = {
    getFullCustomPageData: () => Record<string, unknown>;
    getSite: () => { uuid: string } | undefined;
    isTemplateMode: () => boolean;
    getCsrfToken: () => string;
};

export function useDesignerDraft(ctx: DesignerDraftContext) {
    const draftSavedAt = ref<number | null>(null);
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    function postDraft(): Promise<Response> | null {
        if (ctx.isTemplateMode() || !ctx.getSite()) return null;
        const data = ctx.getFullCustomPageData();
        const payload = {
            custom_page_data: data,
            custom_colors: (data.colors as Record<string, string>) ?? {},
        };
        return fetch(designer.draft({ site: ctx.getSite()!.uuid }).url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-XSRF-TOKEN': ctx.getCsrfToken(),
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify(payload),
            credentials: 'same-origin',
        }).then((res) => {
            if (res.ok) draftSavedAt.value = Date.now();
            return res;
        });
    }

    function pushPreviewDraft(): void {
        if (ctx.isTemplateMode()) return;
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            debounceTimer = null;
            postDraft();
        }, 400);
    }

    function clearDebounce(): void {
        if (debounceTimer) {
            clearTimeout(debounceTimer);
            debounceTimer = null;
        }
    }

    return {
        draftSavedAt,
        postDraft,
        pushPreviewDraft,
        clearDebounce,
    };
}
