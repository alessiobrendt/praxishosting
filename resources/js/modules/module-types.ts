import type { Component } from 'vue';

export interface ModuleConfigField {
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'email' | 'tel' | 'select' | 'checkbox';
    required?: boolean;
    options?: string[] | { value: string; label: string }[];
    validation?: string;
}

export interface ModuleMeta {
    type: string;
    label: string;
    category?: string;
    defaultConfig: Record<string, unknown>;
    configFields?: ModuleConfigField[];
    Editor?: Component;
    showInNavbar?: boolean;
}

const moduleRegistry: ModuleMeta[] = [];

export function registerModule(meta: ModuleMeta): void {
    if (!moduleRegistry.find((m) => m.type === meta.type)) {
        moduleRegistry.push(meta);
    }
}

export function getModuleMeta(type: string): ModuleMeta | undefined {
    return moduleRegistry.find((m) => m.type === type);
}

export function getAllModules(): ModuleMeta[] {
    return [...moduleRegistry];
}
