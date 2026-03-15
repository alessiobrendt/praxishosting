export type ServerQuery = {
    num_players: number;
    max_players: number;
    hostname?: string | null;
} | null;

export type ServerOverview = {
    name: string;
    status: string;
    allocation: string;
    limits: { memory: number; disk: number; cpu: number; swap?: number; io?: number };
    usage: {
        memory_bytes: number;
        disk_bytes: number;
        cpu_absolute: number;
        network_rx_bytes: number;
        network_tx_bytes: number;
    };
    can_power: boolean;
    is_installing?: boolean;
    suspended?: boolean;
    server_query?: ServerQuery;
};

export function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const gb = bytes / (1024 * 1024 * 1024);
    if (gb >= 1) return `${gb.toFixed(2)} GB`;
    const mb = bytes / (1024 * 1024);
    if (mb >= 1) return `${mb.toFixed(2)} MB`;
    const kb = bytes / 1024;
    return `${kb.toFixed(1)} KB`;
}

/** Wie formatBytes, aber MB/GB als ganze Zahl (z. B. 1008.92 MB → 1008 MB). */
export function formatBytesRounded(bytes: number): string {
    if (bytes === 0) return '0 B';
    const gb = bytes / (1024 * 1024 * 1024);
    if (gb >= 1) return `${Math.floor(gb)} GB`;
    const mb = bytes / (1024 * 1024);
    if (mb >= 1) return `${Math.floor(mb)} MB`;
    const kb = bytes / 1024;
    return `${Math.floor(kb)} KB`;
}

export function formatCpu(cpu: number): string {
    if (cpu === 0) return '∞';
    return `${Number(cpu).toFixed(1)}%`;
}

export function displayStatus(
    overview: ServerOverview | null,
    fallbackStatus: string,
): string {
    if (overview?.suspended) return 'Gesperrt';
    if (overview?.is_installing) return 'Installation';
    if (overview?.status) {
        const s = overview.status.toLowerCase();
        if (s === 'running' || s === 'started') return 'Online';
        if (s === 'stopped' || s === 'offline') return 'Offline';
        if (s === 'stopping') return 'Wird gestoppt …';
        if (s === 'starting') return 'Wird gestartet …';
        return overview.status;
    }
    return fallbackStatus;
}

export function statusVariant(
    overview: ServerOverview | null,
    fallbackStatus: string,
): 'success' | 'default' | 'error' {
    if (overview?.suspended) return 'error';
    const s = overview?.status?.toLowerCase() ?? fallbackStatus?.toLowerCase();
    if (s === 'running' || s === 'started') return 'success';
    if (s === 'stopping' || s === 'starting') return 'default';
    return 'default';
}

export function copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text);
}

export function formatPeriodDate(d: string | null): string {
    return d
        ? new Date(d).toLocaleDateString('de-DE', { timeZone: 'UTC' })
        : '–';
}
