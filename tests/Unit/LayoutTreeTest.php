<?php

/**
 * Unit tests for layout tree flatten/rebuild logic (mirrors resources/js/lib/layout-tree.ts).
 * Validates treeToFlat and flatToTree round-trip: empty tree, single level, nested, order preserved.
 */
test('tree to flat returns empty array for empty tree', function () {
    $flat = layoutTreeToFlat([]);
    expect($flat)->toBeArray()->toBeEmpty();
});

test('flat to tree returns empty array for empty flat list', function () {
    $tree = layoutFlatToTree([]);
    expect($tree)->toBeArray()->toBeEmpty();
});

test('tree to flat single level preserves order', function () {
    $tree = [
        ['id' => 'a', 'type' => 'text', 'data' => [], 'children' => null],
        ['id' => 'b', 'type' => 'heading', 'data' => [], 'children' => null],
    ];
    $flat = layoutTreeToFlat($tree);
    expect($flat)->toHaveCount(2);
    expect($flat[0]['depth'])->toBe(0);
    expect($flat[0]['entry']['id'])->toBe('a');
    expect($flat[1]['depth'])->toBe(0);
    expect($flat[1]['entry']['id'])->toBe('b');
});

test('tree to flat nested adds depth for container children', function () {
    $tree = [
        [
            'id' => 'section-1',
            'type' => 'section',
            'data' => [],
            'children' => [
                ['id' => 'child-1', 'type' => 'text', 'data' => [], 'children' => null],
            ],
        ],
    ];
    $flat = layoutTreeToFlat($tree);
    expect($flat)->toHaveCount(2);
    expect($flat[0]['depth'])->toBe(0);
    expect($flat[0]['entry']['id'])->toBe('section-1');
    expect($flat[1]['depth'])->toBe(1);
    expect($flat[1]['entry']['id'])->toBe('child-1');
});

test('flat to tree rebuilds nested structure', function () {
    $flat = [
        ['entry' => ['id' => 's1', 'type' => 'section', 'data' => []], 'depth' => 0],
        ['entry' => ['id' => 'c1', 'type' => 'text', 'data' => []], 'depth' => 1],
    ];
    $tree = layoutFlatToTree($flat);
    expect($tree)->toHaveCount(1);
    expect($tree[0]['id'])->toBe('s1');
    expect($tree[0]['children'])->toHaveCount(1);
    expect($tree[0]['children'][0]['id'])->toBe('c1');
});

test('round trip tree to flat to tree preserves structure', function () {
    $tree = [
        [
            'id' => 'section-1',
            'type' => 'section',
            'data' => ['key' => 'value'],
            'children' => [
                ['id' => 'text-1', 'type' => 'text', 'data' => [], 'children' => null],
                ['id' => 'text-2', 'type' => 'text', 'data' => [], 'children' => null],
            ],
        ],
        ['id' => 'footer-1', 'type' => 'footer', 'data' => [], 'children' => null],
    ];
    $flat = layoutTreeToFlat($tree);
    $rebuilt = layoutFlatToTree($flat);
    expect($rebuilt)->toHaveCount(2);
    expect($rebuilt[0]['id'])->toBe('section-1');
    expect($rebuilt[0]['data'])->toBe(['key' => 'value']);
    expect($rebuilt[0]['children'])->toHaveCount(2);
    expect($rebuilt[0]['children'][0]['id'])->toBe('text-1');
    expect($rebuilt[0]['children'][1]['id'])->toBe('text-2');
    expect($rebuilt[1]['id'])->toBe('footer-1');
});

function layoutTreeToFlat(array $entries, int $depth = 0): array
{
    $result = [];
    $containerTypes = ['section', 'grid', 'flex'];
    foreach ($entries as $entry) {
        $result[] = ['entry' => $entry, 'depth' => $depth];
        if (in_array($entry['type'] ?? '', $containerTypes, true)) {
            $children = $entry['children'] ?? [];
            if (is_array($children)) {
                $result = array_merge($result, layoutTreeToFlat($children, $depth + 1));
            }
        }
    }

    return $result;
}

function layoutFlatToTree(array $flat): array
{
    if (empty($flat)) {
        return [];
    }
    $root = [];
    $stack = [['depth' => -1, 'children' => &$root]];
    $containerTypes = ['section', 'grid', 'flex'];
    foreach ($flat as $item) {
        $entry = $item['entry'];
        $depth = $item['depth'];
        $cloned = [
            'id' => $entry['id'],
            'type' => $entry['type'],
            'data' => $entry['data'] ?? [],
        ];
        if (in_array($entry['type'] ?? '', $containerTypes, true)) {
            $cloned['children'] = [];
        }
        while (count($stack) > 1 && $stack[count($stack) - 1]['depth'] >= $depth) {
            array_pop($stack);
        }
        $parent = &$stack[count($stack) - 1]['children'];
        $parent[] = $cloned;
        if (in_array($entry['type'] ?? '', $containerTypes, true)) {
            $last = count($parent) - 1;
            $stack[] = ['depth' => $depth, 'children' => &$parent[$last]['children']];
        }
    }

    return $root;
}
