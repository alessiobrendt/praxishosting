<template>
  <div class="mb-4">
    <div class="row g-4">
      <aside class="col-12 col-lg-3">
        <nav class="nav flex-column nav-pills gap-1" aria-label="Einstellungen">
          <Link
            v-for="item in sidebarNavItems"
            :key="item.href"
            :href="item.href"
            class="nav-link d-flex align-items-center gap-2"
            :class="{ active: isCurrentUrl(item.href) }"
          >
            <Icon :icon="item.icon" class="flex-shrink-0" />
            {{ item.title }}
          </Link>
        </nav>
      </aside>

      <div class="col-12 col-lg-9">
        <section class="w-100">
          <slot />
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Link } from '@inertiajs/vue3'
import Icon from '@/components/wrappers/Icon.vue'
import { useCurrentUrl } from '@/composables/useCurrentUrl'

const { isCurrentUrl } = useCurrentUrl()

const sidebarNavItems: { title: string; href: string; icon: string }[] = [
  { title: 'Profil', href: '/settings/profile', icon: 'user' },
  { title: 'Benachrichtigungen', href: '/settings/notifications', icon: 'bell' },
  { title: 'Integration', href: '/settings/integration', icon: 'link' },
  { title: 'Passwort', href: '/settings/password', icon: 'lock' },
  { title: 'Sicherheit', href: '/settings/security', icon: 'shield-check' },
  { title: 'Zwei-Faktor-Authentifizierung', href: '/settings/two-factor', icon: 'shield' },
  { title: 'Erscheinungsbild', href: '/settings/appearance', icon: 'palette' },
  { title: 'API-Tokens', href: '/settings/api-tokens', icon: 'key' },
]
</script>
