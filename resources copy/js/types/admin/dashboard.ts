export interface LayoutItem {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
}

export interface WidgetRegistryItem {
    key: string;
    title: string;
    description: string;
    defaultW: number;
    defaultH: number;
    demoData?: Record<string, unknown>;
}
