export interface ResponsiveConfig {
    base?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
}

/**
 * Generates CSS with media queries for responsive styles.
 * Uses mobile-first approach: base styles apply to mobile, then breakpoints override.
 *
 * @param selector CSS selector (e.g., '.grid-block[data-id="abc123"]')
 * @param property CSS property name (e.g., 'grid-template-columns')
 * @param config Responsive values for different breakpoints
 * @returns CSS string with base styles and media queries
 */
export function generateResponsiveCSS(
    selector: string,
    property: string,
    config: ResponsiveConfig
): string {
    const rules: string[] = [];

    if (config.base) {
        rules.push(`${selector} { ${property}: ${config.base}; }`);
    }

    if (config.sm) {
        rules.push(
            `@media (min-width: 640px) { ${selector} { ${property}: ${config.sm}; } }`
        );
    }
    if (config.md) {
        rules.push(
            `@media (min-width: 768px) { ${selector} { ${property}: ${config.md}; } }`
        );
    }
    if (config.lg) {
        rules.push(
            `@media (min-width: 1024px) { ${selector} { ${property}: ${config.lg}; } }`
        );
    }
    if (config.xl) {
        rules.push(
            `@media (min-width: 1280px) { ${selector} { ${property}: ${config.xl}; } }`
        );
    }

    return rules.join('\n');
}

/**
 * Checks if a component has any responsive values set.
 */
export function hasResponsiveValues(data: Record<string, unknown>): boolean {
    const responsiveKeys = [
        'columnsSm',
        'columnsMd',
        'columnsLg',
        'columnsXl',
        'gapSm',
        'gapMd',
        'gapLg',
        'gapXl',
        'directionSm',
        'directionMd',
        'directionLg',
        'directionXl',
        'justifySm',
        'justifyMd',
        'justifyLg',
        'justifyXl',
        'alignSm',
        'alignMd',
        'alignLg',
        'alignXl',
    ];
    return responsiveKeys.some((key) => data[key] !== undefined);
}
