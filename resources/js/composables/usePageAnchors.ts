import type { LayoutComponentEntry } from '@/types/layout-components';

export type PageAnchor = { value: string; label: string };

const KNOWN_BLOCK_ANCHORS: Record<string, { id: string; label: string }> = {
    hero: { id: 'hero-heading', label: 'Hero' },
    cta: { id: 'cta-block-heading', label: 'CTA-Bereich' },
    about: { id: 'about-block-heading', label: 'Über uns' },
    hours: { id: 'hours-block-heading', label: 'Öffnungszeiten' },
};

function collectAnchors(entries: LayoutComponentEntry[] | undefined, seen: Set<string>): PageAnchor[] {
    const result: PageAnchor[] = [];
    if (!Array.isArray(entries)) return result;

    for (const entry of entries) {
        const customAnchor = entry.data?.anchor as string | undefined;
        if (customAnchor && typeof customAnchor === 'string' && customAnchor.trim()) {
            const val = customAnchor.trim();
            if (!seen.has(val)) {
                seen.add(val);
                result.push({ value: val, label: val });
            }
        } else {
            const known = KNOWN_BLOCK_ANCHORS[entry.type];
            if (known && !seen.has(known.id)) {
                seen.add(known.id);
                result.push({ value: known.id, label: known.label });
            }
        }
        const children = entry.children;
        if (Array.isArray(children)) {
            result.push(...collectAnchors(children, seen));
        }
    }
    return result;
}

/**
 * Extracts anchors from layout_components for use in LinkPicker.
 * Priority: entry.data.anchor if set, otherwise known block IDs (hero-heading, etc.).
 */
export function usePageAnchors(layoutComponents: LayoutComponentEntry[] | undefined): PageAnchor[] {
    return collectAnchors(layoutComponents ?? [], new Set());
}
