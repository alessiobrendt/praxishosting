<template>
  <div id="user-dropdown-detailed" class="topbar-item nav-user">
    <BDropdown
      v-model="isOpen"
      teleport-disabled
      toggle-class="topbar-link"
      no-caret
      placement="bottom-end"
      offset="5"
    >
      <template #button-content>
        <img
          :src="userAvatar"
          width="32"
          height="32"
          class="rounded-circle me-lg-2 d-flex"
          alt=""
        />
        <div class="d-lg-flex align-items-center gap-1 d-none">
          <span>
            <h5 class="my-0 lh-1 pro-username">{{ user?.name ?? 'User' }}</h5>
            <span v-if="isAdminDomain && groupLabelsWithColors.length > 0" class="fs-xs lh-1 d-flex flex-wrap gap-1 mt-1">
              <span
                v-for="g in groupLabelsWithColors"
                :key="g.label"
                class="badge rounded-pill"
                :class="g.color ? '' : 'bg-primary-subtle text-primary'"
                :style="g.color ? { backgroundColor: `${g.color}22`, color: g.color } : undefined"
              >
                {{ g.label }}
              </span>
            </span>
            <span v-else-if="showBalance" class="fs-xs lh-1 text-muted">
              {{ formatCurrency(customerBalance) }} €
            </span>
            <span v-else class="fs-xs lh-1 text-muted">
              {{ isAdminDomain ? 'Admin' : '' }}
            </span>
          </span>
          <Icon icon="chevron-down" class="align-middle" />
        </div>
      </template>
      <template v-if="isOpen">
        <BDropdownHeader class="noti-title">
          <h6 class="text-overflow m-0">Welcome back 👋!</h6>
        </BDropdownHeader>

        <template v-if="isAdminDomain">
          <Link :href="dashboardUrl" class="dropdown-item">
            <Icon icon="layout-dashboard" class="me-1 fs-lg align-middle" />
            <span class="align-middle">Zum Kundenbereich</span>
          </Link>
          <Link :href="profileEditUrl" class="dropdown-item">
            <Icon icon="settings-2" class="me-1 fs-lg align-middle" />
            <span class="align-middle">Einstellungen</span>
          </Link>
        </template>
        <template v-else>
          <Link :href="profileEditUrl" class="dropdown-item">
            <Icon icon="settings-2" class="me-1 fs-lg align-middle" />
            <span class="align-middle">Einstellungen</span>
          </Link>
          <Link :href="billingIndexUrl" class="dropdown-item">
            <Icon icon="wallet" class="me-1 fs-lg align-middle" />
            <span class="align-middle">Guthaben aufladen</span>
          </Link>
          <Link :href="supportCreateUrl" class="dropdown-item">
            <Icon icon="file-text" class="me-1 fs-lg align-middle" />
            <span class="align-middle">Ticket erstellen</span>
          </Link>
          <Link :href="postfachIndexUrl" class="dropdown-item">
            <Icon icon="mail" class="me-1 fs-lg align-middle" />
            <span class="align-middle">Postfach</span>
          </Link>
          <Link :href="billingRedeemUrl" class="dropdown-item">
            <Icon icon="gift" class="me-1 fs-lg align-middle" />
            <span class="align-middle">Gutscheincode einlösen</span>
          </Link>
        </template>

        <BDropdownDivider />
        <div class="dropdown-item-text">
          <button
            type="button"
            class="btn btn-link p-0 text-danger fw-semibold text-decoration-none d-flex align-items-center w-100"
            @click="onLogout"
          >
            <Icon icon="logout" class="me-1 fs-lg align-middle" />
            <span class="align-middle">Abmelden</span>
          </button>
        </div>
      </template>
    </BDropdown>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { Link, router, usePage } from '@inertiajs/vue3'
import { BDropdown, BDropdownHeader, BDropdownDivider } from 'bootstrap-vue-next'
import Icon from '@/components/wrappers/Icon.vue'
import { topbarDropdownKey } from '@/composables/useTopbarDropdown'

type GroupLabelWithColor = { label: string; color: string | null }

const page = usePage()
const topbarDropdown = inject(topbarDropdownKey)
const DROPDOWN_ID = 'user'
const isOpen = computed({
  get: () => topbarDropdown?.openDropdownId.value === DROPDOWN_ID,
  set: (v: boolean) => topbarDropdown?.setOpen(v ? DROPDOWN_ID : null),
})

const auth = computed(() => page.props.auth as { user?: { name: string; email?: string; avatar?: string }; customerBalance?: number; group_labels?: string[]; group_labels_with_colors?: GroupLabelWithColor[] } | undefined)
const brandFeatures = computed(() => page.props.brandFeatures as Record<string, boolean> | undefined)
const isAdminDomain = computed(() => (page.props.isAdminDomain as boolean) === true)

const user = computed(() => auth.value?.user)
const customerBalance = computed(() => auth.value?.customerBalance ?? 0)
const showBalance = computed(
  () =>
    (brandFeatures.value?.prepaid_balance === true) &&
    typeof auth.value?.customerBalance === 'number',
)
const groupLabelsWithColors = computed((): GroupLabelWithColor[] => {
  const withColors = auth.value?.group_labels_with_colors
  if (withColors?.length) return withColors
  const labels = auth.value?.group_labels ?? []
  return labels.map((label: string) => ({ label, color: null }))
})

const userAvatar = computed(() => user.value?.avatar ?? '/images/users/user-1.jpg')

const profileEditUrl = '/settings/profile'
const billingIndexUrl = '/billing'
const billingRedeemUrl = '/billing/redeem-voucher'
const supportCreateUrl = '/support/create'
const postfachIndexUrl = '/account/postfach'
const dashboardUrl = '/dashboard'

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function onLogout(): void {
  router.post('/logout')
}
</script>
