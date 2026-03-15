import type { InjectionKey, Ref } from 'vue'

export type TopbarDropdownContext = {
    openDropdownId: Ref<string | null>
    setOpen: (id: string | null) => void
}

export const topbarDropdownKey: InjectionKey<TopbarDropdownContext> = Symbol('topbarDropdown')
