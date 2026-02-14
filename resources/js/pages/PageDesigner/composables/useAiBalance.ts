import { ref, onMounted } from 'vue';

export function useAiBalance() {
    const balance = ref<number | null>(null);
    const loading = ref(false);

    async function fetchBalance(): Promise<void> {
        loading.value = true;
        try {
            const res = await fetch('/api/ai/balance', { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                balance.value = data.balance ?? 0;
            } else {
                balance.value = 0;
            }
        } catch {
            balance.value = 0;
        } finally {
            loading.value = false;
        }
    }

    onMounted(fetchBalance);

    return { balance, loading, refresh: fetchBalance };
}
