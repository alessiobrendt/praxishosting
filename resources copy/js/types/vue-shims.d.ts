declare module '*.vue' {
    import type { DefineComponent } from 'vue';
    const component: DefineComponent;
    export default component;
}

declare module 'vue-grid-layout-v3' {
    import type { Component } from 'vue';
    export const GridLayout: Component;
    export const GridItem: Component;
}
