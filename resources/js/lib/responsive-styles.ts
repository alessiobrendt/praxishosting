export interface ResponsiveConfig {
    base?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
}

const RESPONSIVE_BREAKPOINTS = { sm: 640, md: 768, lg: 1024, xl: 1280 } as const;

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
            `@media (min-width: ${RESPONSIVE_BREAKPOINTS.sm}px) { ${selector} { ${property}: ${config.sm}; } }`
        );
    }
    if (config.md) {
        rules.push(
            `@media (min-width: ${RESPONSIVE_BREAKPOINTS.md}px) { ${selector} { ${property}: ${config.md}; } }`
        );
    }
    if (config.lg) {
        rules.push(
            `@media (min-width: ${RESPONSIVE_BREAKPOINTS.lg}px) { ${selector} { ${property}: ${config.lg}; } }`
        );
    }
    if (config.xl) {
        rules.push(
            `@media (min-width: ${RESPONSIVE_BREAKPOINTS.xl}px) { ${selector} { ${property}: ${config.xl}; } }`
        );
    }

    return rules.join('\n');
}

/**
 * Generates CSS with container queries instead of media queries.
 * Use when the component is inside the Page Designer preview so breakpoints
 * follow the preview container width, not the viewport.
 *
 * @param selector CSS selector
 * @param property CSS property name
 * @param config Responsive values for different breakpoints
 * @param containerName Name of the CSS container (must match the preview wrapper)
 */
export function generateResponsiveContainerCSS(
    selector: string,
    property: string,
    config: ResponsiveConfig,
    containerName: string = 'page-designer-preview'
): string {
    const rules: string[] = [];

    if (config.base) {
        rules.push(`${selector} { ${property}: ${config.base}; }`);
    }

    if (config.sm) {
        rules.push(
            `@container ${containerName} (min-width: ${RESPONSIVE_BREAKPOINTS.sm}px) { ${selector} { ${property}: ${config.sm}; } }`
        );
    }
    if (config.md) {
        rules.push(
            `@container ${containerName} (min-width: ${RESPONSIVE_BREAKPOINTS.md}px) { ${selector} { ${property}: ${config.md}; } }`
        );
    }
    if (config.lg) {
        rules.push(
            `@container ${containerName} (min-width: ${RESPONSIVE_BREAKPOINTS.lg}px) { ${selector} { ${property}: ${config.lg}; } }`
        );
    }
    if (config.xl) {
        rules.push(
            `@container ${containerName} (min-width: ${RESPONSIVE_BREAKPOINTS.xl}px) { ${selector} { ${property}: ${config.xl}; } }`
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
