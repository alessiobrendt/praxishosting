import type { LayoutComponentEntry, LayoutComponentType } from '@/types/layout-components';
import { acceptsChildren as defaultAcceptsChildren } from '@/templates/praxisemerald/combined-registry';

export interface FlatEntry {
    entry: LayoutComponentEntry;
    depth: number;
}

export type AcceptsChildrenFn = (type: LayoutComponentType | string) => boolean;

/**
 * Flattens a tree of layout entries to a list of { entry, depth } in pre-order.
 * depth 0 = root level, 1 = direct child, etc.
 * Optional getAcceptsChildren uses template-specific registry when provided (e.g. Handyso).
 */
export function treeToFlat(
    entries: LayoutComponentEntry[],
    depth = 0,
    getAcceptsChildren: AcceptsChildrenFn = defaultAcceptsChildren,
): FlatEntry[] {
    const result: FlatEntry[] = [];
    for (const entry of entries) {
        result.push({ entry, depth });
        if (getAcceptsChildren(entry.type as LayoutComponentType)) {
            const children = entry.children;
            if (Array.isArray(children)) {
                result.push(...treeToFlat(children, depth + 1, getAcceptsChildren));
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
export function normalizeDepthsAfterDrop(
    flat: FlatEntry[],
    getAcceptsChildren: AcceptsChildrenFn = defaultAcceptsChildren,
): FlatEntry[] {
    const result = flat.map((item) => ({ ...item, depth: item.depth }));
    for (let i = 1; i < result.length; i++) {
        const prev = result[i - 1];
        const cur = result[i];
        if (
            getAcceptsChildren(prev.entry.type as LayoutComponentType) &&
            cur.depth <= prev.depth
        ) {
            cur.depth = prev.depth + 1;
        }
    }
    return result;
}

/**
 * Returns the inclusive end index of the subtree starting at flatIndex.
 * The subtree includes the entry at flatIndex and all descendants (entries with greater depth).
 */
export function getSubtreeEndIndex(
    flat: FlatEntry[],
    startIndex: number,
): number {
    if (startIndex >= flat.length) return startIndex;
    const startDepth = flat[startIndex].depth;
    let i = startIndex + 1;
    while (i < flat.length && flat[i].depth > startDepth) {
        i += 1;
    }
    return i - 1;
}

/**
 * Returns the slice of flat that is the subtree at startIndex (inclusive).
 * Used when reordering only visible nodes: each visible node stands for its full subtree.
 */
export function getSubtreeSlice(
    flat: FlatEntry[],
    startIndex: number,
): FlatEntry[] {
    if (startIndex >= flat.length) return [];
    const end = getSubtreeEndIndex(flat, startIndex);
    return flat.slice(startIndex, end + 1);
}

/**
 * Returns the start index of the subtree that immediately precedes flatIndex.
 * Used when moving up: we insert our subtree before this preceding subtree.
 */
export function getPreviousSiblingStart(flat: FlatEntry[], flatIndex: number): number {
    if (flatIndex <= 0) return 0;
    const ourDepth = flat[flatIndex].depth;
    let i = flatIndex - 1;
    while (i >= 0 && flat[i].depth > ourDepth) {
        i -= 1;
    }
    if (i < 0) return 0;
    const prevRootDepth = flat[i].depth;
    while (i > 0 && flat[i - 1].depth >= prevRootDepth) {
        i -= 1;
    }
    return i;
}

/**
 * Moves a subtree (flat range [fromStart, fromEnd]) to insertAt in the array without that range.
 * insertAt is the index in the "without" array where extracted should be inserted.
 */
export function moveFlatSubtree(
    flat: FlatEntry[],
    fromStart: number,
    fromEnd: number,
    insertAt: number,
): FlatEntry[] {
    const extracted = flat.slice(fromStart, fromEnd + 1);
    const without = [...flat.slice(0, fromStart), ...flat.slice(fromEnd + 1)];
    const pos = Math.max(0, Math.min(insertAt, without.length));
    return [...without.slice(0, pos), ...extracted, ...without.slice(pos)];
}

/**
 * Rebuilds a tree from a flat list of { entry, depth }.
 * Same depth = siblings; greater depth = child of the previous entry with depth - 1.
 */
export function flatToTree(
    flat: FlatEntry[],
    getAcceptsChildren: AcceptsChildrenFn = defaultAcceptsChildren,
): LayoutComponentEntry[] {
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
        if (getAcceptsChildren(entry.type as LayoutComponentType)) {
            cloned.children = [];
        }

        while (stack.length > 1 && stack[stack.length - 1].depth >= depth) {
            stack.pop();
        }
        const parent = stack[stack.length - 1];
        parent.children.push(cloned);

        if (getAcceptsChildren(entry.type as LayoutComponentType)) {
            stack.push({ depth, children: cloned.children ?? [] });
        }
    }

    return root;
}

/**
 * Valid layout entry (has id and type). Used for normalization.
 */
function isValidLayoutEntry(e: unknown): e is LayoutComponentEntry {
    return (
        e !== null &&
        typeof e === 'object' &&
        typeof (e as LayoutComponentEntry).id === 'string' &&
        typeof (e as LayoutComponentEntry).type === 'string'
    );
}

/**
 * Single source of truth for layout tree normalization.
 * Returns a deep clone with:
 * - Only valid entries (id, type)
 * - Duplicate IDs removed (first occurrence in pre-order wins)
 * Use this whenever reading a tree from drag state or before persisting.
 */
export function normalizeLayoutTree(
    entries: LayoutComponentEntry[],
    getAcceptsChildren: AcceptsChildrenFn = defaultAcceptsChildren,
    seenIds: Set<string> = new Set(),
): LayoutComponentEntry[] {
    const result: LayoutComponentEntry[] = [];
    for (const e of entries) {
        if (!isValidLayoutEntry(e)) continue;
        if (seenIds.has(e.id)) continue;
        seenIds.add(e.id);
        const cloned: LayoutComponentEntry = {
            id: e.id,
            type: e.type,
            data: e.data != null && typeof e.data === 'object' ? { ...e.data } : {},
        };
        if (getAcceptsChildren(e.type as LayoutComponentType)) {
            const raw = e.children;
            cloned.children = Array.isArray(raw)
                ? normalizeLayoutTree(
                      raw.filter(isValidLayoutEntry) as LayoutComponentEntry[],
                      getAcceptsChildren,
                      seenIds,
                  )
                : [];
        }
        result.push(cloned);
    }
    return result;
}
