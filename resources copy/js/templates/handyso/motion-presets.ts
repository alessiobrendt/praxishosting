export interface MotionPresetConfig {
    initial: Record<string, unknown>;
    animate: Record<string, unknown>;
    transition?: Record<string, unknown>;
}

export const MOTION_PRESET_IDS = [
    '',
    'fadeIn',
    'fadeInUp',
    'fadeInDown',
    'slideInLeft',
    'slideInRight',
    'scaleIn',
    'slideUpSpring',
] as const;

const MOTION_PRESETS: Record<string, MotionPresetConfig> = {
    fadeIn: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
    },
    fadeInUp: {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
    },
    fadeInDown: {
        initial: { opacity: 0, y: -16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
    },
    slideInLeft: {
        initial: { opacity: 0, x: -24 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
    },
    slideInRight: {
        initial: { opacity: 0, x: 24 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
    },
    scaleIn: {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
    },
    slideUpSpring: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { type: 'spring', stiffness: 400, damping: 30 },
    },
};

const PRESET_LABELS: Record<string, string> = {
    fadeIn: 'Einblenden',
    fadeInUp: 'Von unten einblenden',
    fadeInDown: 'Von oben einblenden',
    slideInLeft: 'Von links einblenden',
    slideInRight: 'Von rechts einblenden',
    scaleIn: 'Vergrößern einblenden',
    slideUpSpring: 'Von unten (Feder)',
};

export function getMotionPreset(
    id: string | undefined,
): MotionPresetConfig | undefined {
    if (!id || id === '') return undefined;
    return MOTION_PRESETS[id];
}

export function getMotionPresetLabel(id: string | undefined): string {
    if (!id || id === '') return 'Keine';
    return PRESET_LABELS[id] ?? id;
}

export function getMotionPresetList(): { id: string; label: string }[] {
    return MOTION_PRESET_IDS.filter((id) => id !== '').map((id) => ({
        id,
        label: getMotionPresetLabel(id),
    }));
}
