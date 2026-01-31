import type { LayoutComponentEntry, LayoutComponentType } from '@/types/layout-components';
import { acceptsChildren } from '@/templates/praxisemerald/combined-registry';

export interface FlatEntry {
    entry: LayoutComponentEntry;
    depth: number;
}

/**
 * Flattens a tree of layout entries to a list of { entry, depth } in pre-order.
 * depth 0 = root level, 1 = direct child, etc.
 */
export function treeToFlat(
    entries: LayoutComponentEntry[],
    depth = 0,
): FlatEntry[] {
    const result: FlatEntry[] = [];
    for (const entry of entries) {
        result.push({ entry, depth });
        if (acceptsChildren(entry.type as LayoutComponentType)) {
            const children = entry.children;
            if (Array.isArray(children)) {
                result.push(...treeToFlat(children, depth + 1));
            }
        }
    }
    return result;
}

/**
 * After a drag, normalises depths so that an item dropped right after a container
 * becomes its child: if the previous item accepts children and current depth <= previous depth,
 * set current depth = previous depth + 1.
 */
export function normalizeDepthsAfterDrop(flat: FlatEntry[]): FlatEntry[] {
    const result = flat.map((item) => ({ ...item, depth: item.depth }));
    for (let i = 1; i < result.length; i++) {
        const prev = result[i - 1];
        const cur = result[i];
        if (
            acceptsChildren(prev.entry.type as LayoutComponentType) &&
            cur.depth <= prev.depth
        ) {
            cur.depth = prev.depth + 1;
        }
    }
    return result;
}

/**
 * Rebuilds a tree from a flat list of { entry, depth }.
 * Same depth = siblings; greater depth = child of the previous entry with depth - 1.
 */
export function flatToTree(flat: FlatEntry[]): LayoutComponentEntry[] {
    if (flat.length === 0) {
        return [];
    }

    const root: LayoutComponentEntry[] = [];
    const stack: { depth: number; children: LayoutComponentEntry[] }[] = [{ depth: -1, children: root }];

    for (const { entry, depth } of flat) {
        const cloned: LayoutComponentEntry = {
            id: entry.id,
            type: entry.type,
            data: { ...(entry.data ?? {}) },
        };
        if (acceptsChildren(entry.type as LayoutComponentType)) {
            cloned.children = [];
        }

        while (stack.length > 1 && stack[stack.length - 1].depth >= depth) {
            stack.pop();
        }
        const parent = stack[stack.length - 1];
        parent.children.push(cloned);

        if (acceptsChildren(entry.type as LayoutComponentType)) {
            stack.push({ depth, children: cloned.children ?? [] });
        }
    }

    return root;
}
