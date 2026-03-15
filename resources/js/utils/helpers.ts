type ToggleDocumentAttributeType = (
    attribute: string,
    value: string,
    remove?: boolean,
    tag?: keyof HTMLElementTagNameMap,
) => void;

export const toggleAttribute: ToggleDocumentAttributeType = (
    attribute,
    value,
    remove,
    tag = 'html',
): void => {
    if (document.documentElement) {
        const element = document.getElementsByTagName(tag.toString())[0];
        const hasAttribute = element?.getAttribute(attribute);
        if (remove && hasAttribute) element?.removeAttribute(attribute);
        else element?.setAttribute(attribute, value);
    }
};

export const easeInOutQuad = (t: number, b: number, c: number, d: number) => {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
};

export const scrollToElement = (element: Element, to: number, duration: number) => {
    const start = element.scrollTop;
    const change = to - start;
    const increment = 20;
    let currentTime = 0;
    const animateScroll = function () {
        currentTime += increment;
        element.scrollTop = easeInOutQuad(currentTime, start, change, duration);
        if (currentTime < duration) {
            setTimeout(animateScroll, increment);
        }
    };

    animateScroll();
};

export const toPascalCase = (value: string) =>
    value
        .replace(/[-_ ]+/g, ' ')
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');

export const toTitleCase = (value: string) =>
    value
        .replace(/[-_]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');

export const abbreviatedNumber = (val: number) => {
    const s = ['', 'k', 'm', 'b', 't'];
    if (val === 0) return 0;
    const sNum = Math.floor(Math.log10(val) / 3);
    let sVal = parseFloat(
        (sNum != 0 ? val / Math.pow(1000, sNum) : val).toPrecision(2),
    );
    if (sVal % 1 != 0) {
        sVal = Number.parseInt(sVal.toFixed(1));
    }
    return sVal + s[sNum]!;
};

export function getColor(v: string, a: number = 1) {
    if (typeof window === 'undefined') return '';

    const html = document.documentElement;
    if (!html) return '';

    const val = getComputedStyle(document.documentElement)
        .getPropertyValue(`--theme-${v}`)
        .trim();

    return v.includes('-rgb') ? `rgba(${val}, ${a})` : val;
}

export function getDefaultFontFamily(): string {
    const body = document.body;
    if (!body) return '';
    const font = getComputedStyle(body).fontFamily;
    return font ?? '';
}

export const formatBytes = (bytes: number, decimals: number = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const generateInitials = (name = ''): string => {
    return name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase();
};
