const ADMIN_RECENT_KEY = 'admin_recent';
const ADMIN_RECENT_MAX = 10;

export type AdminRecentItem = {
    type: string;
    id: number | string;
    label: string;
    url: string;
};

export function pushAdminRecent(item: AdminRecentItem): void {
    try {
        const raw = sessionStorage.getItem(ADMIN_RECENT_KEY);
        const list: AdminRecentItem[] = raw ? (JSON.parse(raw) as AdminRecentItem[]) : [];
        const next = [item, ...list.filter((x) => x.url !== item.url)].slice(0, ADMIN_RECENT_MAX);
        sessionStorage.setItem(ADMIN_RECENT_KEY, JSON.stringify(next));
    } catch {
        // ignore
    }
}

export function getAdminRecent(): AdminRecentItem[] {
    try {
        const raw = sessionStorage.getItem(ADMIN_RECENT_KEY);
        if (!raw) return [];
        const arr = JSON.parse(raw) as AdminRecentItem[];
        return Array.isArray(arr) ? arr.slice(0, ADMIN_RECENT_MAX) : [];
    } catch {
        return [];
    }
}
