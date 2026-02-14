<?php

/**
 * Unit tests for responsive block data logic (mirrors resources/js/lib/responsive-styles.ts).
 * Validates hasResponsiveValues and getEffectiveDataAtBreakpoint.
 */
test('hasResponsiveValues returns false for empty data', function () {
    expect(hasResponsiveValues([]))->toBeFalse();
});

test('hasResponsiveValues returns false for data without responsive keys', function () {
    expect(hasResponsiveValues(['padding' => '1rem', 'gap' => '1rem']))->toBeFalse();
});

test('hasResponsiveValues returns true for legacy columnsSm', function () {
    expect(hasResponsiveValues(['columns' => '1fr', 'columnsSm' => 'repeat(2, 1fr)']))->toBeTrue();
});

test('hasResponsiveValues returns true for responsive.tablet', function () {
    $data = [
        'columns' => 'repeat(2, 1fr)',
        'responsive' => [
            'tablet' => ['columns' => 'repeat(3, 1fr)'],
            'mobile' => [],
        ],
    ];
    expect(hasResponsiveValues($data))->toBeTrue();
});

test('hasResponsiveValues returns true for responsive.mobile', function () {
    $data = [
        'columns' => 'repeat(2, 1fr)',
        'responsive' => [
            'tablet' => [],
            'mobile' => ['columns' => '1fr'],
        ],
    ];
    expect(hasResponsiveValues($data))->toBeTrue();
});

test('getEffectiveDataAtBreakpoint returns base for desktop without responsive', function () {
    $data = ['padding' => '2rem', 'gap' => '1rem'];
    $result = getEffectiveDataAtBreakpoint($data, 'desktop');
    expect($result)->toBe(['padding' => '2rem', 'gap' => '1rem']);
});

test('getEffectiveDataAtBreakpoint returns merged data for tablet', function () {
    $data = [
        'padding' => '2rem',
        'gap' => '1rem',
        'responsive' => [
            'tablet' => ['padding' => '1.5rem'],
            'mobile' => [],
        ],
    ];
    $result = getEffectiveDataAtBreakpoint($data, 'tablet');
    expect($result['padding'])->toBe('1.5rem');
    expect($result['gap'])->toBe('1rem');
});

test('getEffectiveDataAtBreakpoint returns merged data for mobile', function () {
    $data = [
        'padding' => '2rem',
        'gap' => '1rem',
        'responsive' => [
            'tablet' => ['padding' => '1.5rem'],
            'mobile' => ['padding' => '1rem', 'gap' => '0.5rem'],
        ],
    ];
    $result = getEffectiveDataAtBreakpoint($data, 'mobile');
    expect($result['padding'])->toBe('1rem');
    expect($result['gap'])->toBe('0.5rem');
});

test('getEffectiveDataAtBreakpoint excludes responsive key from result', function () {
    $data = [
        'columns' => '1fr',
        'responsive' => ['tablet' => [], 'mobile' => []],
    ];
    $result = getEffectiveDataAtBreakpoint($data, 'desktop');
    expect($result)->not->toHaveKey('responsive');
    expect($result['columns'])->toBe('1fr');
});

/**
 * Mirrors hasResponsiveValues from resources/js/lib/responsive-styles.ts
 */
function hasResponsiveValues(array $data): bool
{
    if (isset($data['responsive']) && is_array($data['responsive'])) {
        $r = $data['responsive'];
        $tablet = $r['tablet'] ?? [];
        $mobile = $r['mobile'] ?? [];
        if (count($tablet) > 0 || count($mobile) > 0) {
            return true;
        }
    }
    $legacyKeys = [
        'columnsSm', 'columnsMd', 'columnsLg', 'columnsXl',
        'gapSm', 'gapMd', 'gapLg', 'gapXl',
        'directionSm', 'directionMd', 'directionLg', 'directionXl',
        'justifySm', 'justifyMd', 'justifyLg', 'justifyXl',
        'alignSm', 'alignMd', 'alignLg', 'alignXl',
    ];
    foreach ($legacyKeys as $key) {
        if (array_key_exists($key, $data)) {
            return true;
        }
    }

    return false;
}

/**
 * Mirrors getEffectiveDataAtBreakpoint from resources/js/lib/responsive-styles.ts
 */
function getEffectiveDataAtBreakpoint(array $data, string $breakpoint): array
{
    $responsive = $data['responsive'] ?? null;
    $base = array_diff_key($data, ['responsive' => true]);
    if (! is_array($responsive)) {
        return $base;
    }
    $r = $responsive;
    $tablet = $r['tablet'] ?? [];
    $mobile = $r['mobile'] ?? [];

    return match ($breakpoint) {
        'desktop' => $base,
        'tablet' => array_merge($base, $tablet),
        'mobile' => array_merge($base, $mobile),
        default => $base,
    };
}
