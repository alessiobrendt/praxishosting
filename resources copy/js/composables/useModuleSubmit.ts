import { ref } from 'vue';

export interface ModuleSubmitOptions {
    siteUuid: string;
    moduleType: string;
    moduleInstanceId?: string;
    moduleConfig?: Record<string, unknown>;
}

export function useModuleSubmit() {
    const pending = ref(false);
    const error = ref<string | null>(null);

    async function submit(
        options: ModuleSubmitOptions,
        data: Record<string, unknown>,
        honeypot = '',
    ): Promise<{ success: boolean; message?: string; errors?: Record<string, string[]> }> {
        if (options.siteUuid == null || options.siteUuid === undefined || options.siteUuid === '') {
            return {
                success: false,
                errors: { _: ['Seiten-Kontext fehlt. Bitte Seite neu laden.'] },
            };
        }

        pending.value = true;
        error.value = null;

        const csrfMatch = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
        const csrfToken = csrfMatch ? decodeURIComponent(csrfMatch[1]) : '';

        try {
            const response = await fetch(`/api/sites/${options.siteUuid}/modules/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-XSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    module_type: options.moduleType,
                    module_instance_id: options.moduleInstanceId,
                    module_config: options.moduleConfig,
                    data,
                    honeypot,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    errors: result.errors ?? { _: [result.message ?? 'Ein Fehler ist aufgetreten.'] },
                };
            }

            return { success: true, message: result.message };
        } catch (e) {
            error.value = e instanceof Error ? e.message : 'Netzwerkfehler';
            return {
                success: false,
                errors: { _: [error.value] },
            };
        } finally {
            pending.value = false;
        }
    }

    return { pending, error, submit };
}
