import DOMPurify from 'dompurify';

const ALLOWED_TAGS = ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'blockquote', 'pre', 'code', 'ul', 'ol', 'li'];

/**
 * Sanitize HTML for safe display (e.g. ticket message body).
 */
export function sanitizeHtml(html: string): string {
    return DOMPurify.sanitize(html, { ALLOWED_TAGS });
}

/**
 * Returns true if the string looks like HTML (contains tags).
 */
export function isHtml(str: string | null | undefined): boolean {
    if (!str || typeof str !== 'string') return false;
    return /<[a-z][\s\S]*>/i.test(str.trim());
}
