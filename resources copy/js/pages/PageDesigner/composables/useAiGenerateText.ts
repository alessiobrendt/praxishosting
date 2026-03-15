import { ref } from 'vue';

export const PROMPT_TEMPLATES = [
    { value: 'expand', label: 'Erweitern' },
    { value: 'shorten', label: 'Kürzen' },
    { value: 'professional', label: 'Professioneller' },
    { value: 'ad_copy', label: 'Werbetext' },
] as const;

export type PromptTemplateValue = (typeof PROMPT_TEMPLATES)[number]['value'];

export type AiGenerateTextError =
    | { type: 'insufficient_tokens'; message: string }
    | { type: 'rate_limit'; message: string }
    | { type: 'unavailable'; message: string }
    | { type: 'error'; message: string };

export function useAiGenerateText(options?: {
    onSuccess?: () => void;
    onError?: (err: AiGenerateTextError) => void;
    refreshBalance?: () => void;
}) {
    const loading = ref(false);

    async function generateText(
        context: string,
        promptTemplate: PromptTemplateValue,
        additionalPrompt?: string | null,
        pageName?: string | null,
        blockType?: string | null,
    ): Promise<string | null> {
        loading.value = true;
        try {
            const res = await fetch('/api/ai/generate-text', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-XSRF-TOKEN': getCsrfToken(),
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'include',
                body: JSON.stringify({
                    context,
                    prompt_template: promptTemplate,
                    prompt: additionalPrompt || undefined,
                    page_name: pageName,
                    block_type: blockType,
                }),
            });

            const data = await res.json().catch(() => ({}));

            if (res.ok) {
                options?.refreshBalance?.();
                options?.onSuccess?.();
                return data.text ?? '';
            }

            if (res.status === 402) {
                options?.onError?.({ type: 'insufficient_tokens', message: data.message ?? 'Nicht genügend AI-Tokens.' });
                return null;
            }
            if (res.status === 429) {
                options?.onError?.({ type: 'rate_limit', message: 'Bitte kurz warten.' });
                return null;
            }
            if (res.status === 503) {
                options?.onError?.({ type: 'unavailable', message: data.message ?? 'AI-Service nicht verfügbar.' });
                return null;
            }
            options?.onError?.({ type: 'error', message: data.message ?? 'Ein Fehler ist aufgetreten.' });
            return null;
        } catch {
            options?.onError?.({ type: 'error', message: 'Ein Fehler ist aufgetreten.' });
            return null;
        } finally {
            loading.value = false;
        }
    }

    return { loading, generateText };
}

function getCsrfToken(): string {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}
