import { usePage } from '@inertiajs/vue3'
import { computed } from 'vue'
import type { MenuItemType } from '@/types/paces'

function hasPermission(
  userPermissions: string[] | undefined,
  key: string,
): boolean {
  if (!userPermissions) return false
  return userPermissions.includes('*') || userPermissions.includes(key)
}

function hasPermissionOrView(
  userPermissions: string[] | undefined,
  baseKey: string,
): boolean {
  return (
    hasPermission(userPermissions, baseKey) ||
    hasPermission(userPermissions, `${baseKey}.view`)
  )
}

export function useSidebarMenu(): { menuItems: ReturnType<typeof computed<MenuItemType[]>> } {
  const page = usePage()

  const menuItems = computed<MenuItemType[]>(() => {
    const isAdminDomain = (page.props.isAdminDomain as boolean) === true
    const auth = page.props.auth as {
      openTicketsCount?: number
      adminOpenTicketsCount?: number
      userPermissions?: string[]
      activeUserModules?: string[]
    } | undefined
    const brandFeatures = (page.props.brandFeatures ?? {}) as Record<string, boolean>
    const discordInviteUrl = page.props.discordInviteUrl as string | null | undefined
    const userPermissions = auth?.userPermissions ?? []

    if (isAdminDomain) {
      return buildAdminMenuItems(auth, brandFeatures, userPermissions)
    }
    return buildDefaultMenuItems(auth, brandFeatures, discordInviteUrl ?? null)
  })

  return { menuItems }
}

function buildDefaultMenuItems(
  auth: { openTicketsCount?: number; activeUserModules?: string[] } | undefined,
  brandFeatures: Record<string, boolean>,
  discordInviteUrl: string | null,
): MenuItemType[] {
  const openTicketsCount = auth?.openTicketsCount ?? 0
  const activeUserModules = auth?.activeUserModules ?? []

  const helpChildren: MenuItemType[] = []
  if (discordInviteUrl) {
    helpChildren.push({
      slug: 'help-discord',
      label: 'Hilfe der Community',
      url: discordInviteUrl,
      icon: 'message-circle',
      target: '_blank',
    })
  }
  helpChildren.push({
    slug: 'support-tickets',
    label: 'Support Tickets',
    url: '/support',
    icon: 'message-circle',
    ...(openTicketsCount > 0 && {
      badge: { className: 'bg-danger', text: String(openTicketsCount) },
    }),
  })

  const items: MenuItemType[] = [
    {
      slug: 'main',
      label: 'Main',
      isTitle: true,
      icon: 'layout-dashboard',
      children: [
        {
          slug: 'dashboard',
          label: 'Dashboard',
          url: '/dashboard',
          icon: 'layout-dashboard',
        },
        ...(brandFeatures.sites_editor !== false
          ? [
              {
                slug: 'pages',
                label: 'Seiten',
                icon: 'world',
                children: [
                  {
                    slug: 'sites-create',
                    label: 'Seite bestellen',
                    url: '/sites/create',
                    icon: 'package',
                  },
                  {
                    slug: 'sites-index',
                    label: 'Meine Seiten',
                    url: '/sites',
                    icon: 'world',
                  },
                ],
              } as MenuItemType,
            ]
          : []),
        {
          slug: 'domains',
          label: 'Domains',
          icon: 'world',
          children: [
            { slug: 'domains-search', label: 'Domain bestellen', url: '/domains/search', icon: 'world' },
            { slug: 'domains-portfolio', label: 'Domain Portfolio', url: '/domains', icon: 'file-text' },
          ],
        },
        ...(brandFeatures.webspace !== false
          ? [
              {
                slug: 'webspaces',
                label: 'Webspaces',
                icon: 'server',
                children: [
                  { slug: 'webspace-checkout', label: 'Plesk-Webspace bestellen', url: '/webspace/checkout', icon: 'package' },
                  { slug: 'webspace-accounts', label: 'Deine Plesk-Webspaces', url: '/webspace-accounts', icon: 'server' },
                ],
              } as MenuItemType,
            ]
          : []),
        ...(brandFeatures.gaming === true || brandFeatures.gameserver_cloud === true
          ? [
              {
                slug: 'gameserver',
                label: 'Gameserver',
                icon: 'server',
                children: [
                  ...(brandFeatures.gaming === true
                    ? [
                          { slug: 'gaming-checkout', label: 'Gameserver bestellen', url: '/gaming/checkout', icon: 'package' },
                          { slug: 'gaming-accounts', label: 'Deine Gameserver', url: '/gaming', icon: 'server' },
                      ]
                    : []),
                  ...(brandFeatures.gameserver_cloud === true
                    ? [
                          { slug: 'gaming-cloud', label: 'Gameserver Cloud', url: '/gaming/cloud', icon: 'cloud' },
                          { slug: 'gaming-cloud-subscriptions', label: 'Meine Cloud-Abos', url: '/gaming/cloud/subscriptions', icon: 'server' },
                      ]
                    : []),
                ],
              } as MenuItemType,
            ]
          : []),
        ...(brandFeatures.teamspeak === true
          ? [
              {
                slug: 'teamspeak',
                label: 'TeamSpeak',
                icon: 'headphones',
                children: [
                  { slug: 'teamspeak-order', label: 'TeamSpeak-Server mieten', url: '/teamspeak', icon: 'package' },
                  { slug: 'teamspeak-accounts', label: 'Deine TeamSpeak-Server', url: '/teamspeak-accounts', icon: 'headphones' },
                ],
              } as MenuItemType,
            ]
          : []),
        {
          slug: 'help-support',
          label: 'Hilfe und Support',
          icon: 'help-circle',
          children: helpChildren,
        },
        {
          slug: 'account',
          label: 'Account',
          icon: 'user',
          children: [
            { slug: 'settings-profile', label: 'Einstellungen', url: '/settings/profile', icon: 'settings-2' },
            { slug: 'billing', label: 'Guthaben & Rechnungen', url: '/billing', icon: 'file-text' },
            { slug: 'billing-redeem', label: 'Gutscheincode einlösen', url: '/billing/redeem-voucher', icon: 'package' },
            { slug: 'postfach', label: 'Postfach', url: '/account/postfach', icon: 'mail' },
          ],
        },
      ],
    },
  ]

  if (activeUserModules.length > 0) {
    const moduleChildren: MenuItemType[] = []
    if (activeUserModules.includes('newsletter')) {
      moduleChildren.push({
        slug: 'modules-newsletter',
        label: 'Newsletter',
        url: '/modules/newsletter',
        icon: 'mail',
      })
    }
    if (activeUserModules.includes('contactform')) {
      moduleChildren.push({
        slug: 'modules-contact',
        label: 'Kontaktformular',
        url: '/modules/contact',
        icon: 'message-circle',
      })
    }
    if (moduleChildren.length > 0) {
      items[0].children!.push({
        slug: 'modules',
        label: 'Module',
        icon: 'package-check',
        children: moduleChildren,
      })
    }
  }

  return items
}

function buildAdminMenuItems(
  auth: { adminOpenTicketsCount?: number } | undefined,
  brandFeatures: Record<string, boolean>,
  userPermissions: string[],
): MenuItemType[] {
  const adminOpenTicketsCount = auth?.adminOpenTicketsCount ?? 0
  const hp = (key: string) => hasPermissionOrView(userPermissions, key)

  const items: MenuItemType[] = []

  if (hp('admin.dashboard') || hp('admin.activity-log')) {
    const overviewChildren: MenuItemType[] = []
    if (hp('admin.dashboard')) overviewChildren.push({ slug: 'admin-dashboard', label: 'Dashboard (Admin)', url: '/admin', icon: 'layout-dashboard' })
    if (hp('admin.activity-log')) overviewChildren.push({ slug: 'admin-activity-log', label: 'Aktivitätslog', url: '/admin/activity-log', icon: 'layout-dashboard' })
    items.push({
      slug: 'admin-overview',
      label: 'Übersicht',
      icon: 'layout-dashboard',
      children: overviewChildren,
    })
  }

  if (
    hp('admin.invoices') ||
    hp('admin.domains') ||
    hp('admin.dunning-letters') ||
    hp('admin.subscriptions') ||
    hp('admin.products')
  ) {
    const vertrieb: MenuItemType[] = []
    if (hp('admin.invoices')) vertrieb.push({ slug: 'admin-invoices', label: 'Rechnungen', url: '/admin/invoices', icon: 'file-text' })
    if (hp('admin.domains')) {
      vertrieb.push({ slug: 'admin-domains', label: 'Domains', url: '/admin/domains', icon: 'world' })
      vertrieb.push({ slug: 'admin-domains-tld', label: 'TLD-Preise', url: '/admin/domains/tld-pricelist', icon: 'world' })
    }
    if (hp('admin.dunning-letters')) vertrieb.push({ slug: 'admin-dunning', label: 'Mahnungen', url: '/admin/dunning-letters', icon: 'file-text' })
    if (hp('admin.subscriptions')) vertrieb.push({ slug: 'admin-subscriptions', label: 'Abos', url: '/admin/subscriptions', icon: 'repeat' })
    if (hp('admin.products')) vertrieb.push({ slug: 'admin-products', label: 'Produkte', url: '/admin/products', icon: 'package' })
    if (vertrieb.length > 0) {
      items.push({ slug: 'admin-vertrieb', label: 'Vertrieb', icon: 'file-text', children: vertrieb })
    }
  }

  const hostingChildren: MenuItemType[] = []
  if (hp('admin.hosting-servers')) hostingChildren.push({ slug: 'admin-hosting-servers', label: 'Hosting-Server', url: '/admin/hosting-servers', icon: 'git-branch' })
  if (hp('admin.hosting-plans') || (hp('admin.gameserver-cloud-plans') && brandFeatures.gameserver_cloud === true)) {
    hostingChildren.push({ slug: 'admin-hosting-plans', label: 'Hosting-Pläne', url: '/admin/hosting-plans', icon: 'package' })
  }
  if (hp('admin.webspace-accounts') && brandFeatures.webspace !== false) hostingChildren.push({ slug: 'admin-webspace-accounts', label: 'Webspace-Accounts', url: '/admin/webspace-accounts', icon: 'layout-dashboard' })
  if (hp('admin.gaming-accounts') && brandFeatures.gaming === true) hostingChildren.push({ slug: 'admin-gaming-accounts', label: 'Game-Server-Accounts', url: '/admin/gaming-accounts', icon: 'layout-dashboard' })
  if (hp('admin.gaming-accounts') && brandFeatures.gameserver_cloud === true) {
    hostingChildren.push({ slug: 'admin-gameserver-cloud', label: 'Gameserver-Cloud-Accounts', url: '/admin/gameserver-cloud-accounts', icon: 'layout-dashboard' })
    hostingChildren.push({ slug: 'admin-subdomains', label: 'Subdomains', url: '/admin/subdomains', icon: 'world' })
  }
  if (hp('admin.hosting-servers') && brandFeatures.teamspeak === true) hostingChildren.push({ slug: 'admin-teamspeak-accounts', label: 'TeamSpeak-Server-Accounts', url: '/admin/teamspeak-accounts', icon: 'layout-dashboard' })
  if (hostingChildren.length > 0) {
    items.push({ slug: 'admin-hosting', label: 'Hosting', icon: 'package-check', children: hostingChildren })
  }

  if (hp('admin.sites') || hp('admin.templates')) {
    const inhalte: MenuItemType[] = []
    if (hp('admin.sites')) inhalte.push({ slug: 'admin-sites', label: 'Sites', url: '/admin/sites', icon: 'world' })
    if (hp('admin.templates')) inhalte.push({ slug: 'admin-templates', label: 'Templates', url: '/admin/templates', icon: 'layout-dashboard' })
    if (inhalte.length > 0) items.push({ slug: 'admin-inhalte', label: 'Inhalte', icon: 'world', children: inhalte })
  }

  if (hp('admin.discount-codes') || hp('admin.vouchers') || hp('admin.partners') || hp('admin.emails')) {
    const marketing: MenuItemType[] = []
    if (hp('admin.discount-codes')) marketing.push({ slug: 'admin-discount-codes', label: 'Rabattcodes', url: '/admin/discount-codes', icon: 'package' })
    if (hp('admin.partners')) marketing.push({ slug: 'admin-partners', label: 'Partner', url: '/admin/partners', icon: 'users' })
    if (hp('admin.vouchers')) marketing.push({ slug: 'admin-vouchers', label: 'Gutscheine', url: '/admin/vouchers', icon: 'package' })
    if (hp('admin.emails')) marketing.push({ slug: 'admin-emails', label: 'E-Mails', url: '/admin/emails', icon: 'mail' })
    if (marketing.length > 0) items.push({ slug: 'admin-marketing', label: 'Marketing', icon: 'mail', children: marketing })
  }

  if (hp('admin.tickets')) {
    items.push({
      slug: 'admin-support',
      label: 'Support',
      icon: 'message-circle',
      children: [
        {
          slug: 'admin-tickets',
          label: 'Tickets',
          url: '/admin/tickets',
          icon: 'message-circle',
          ...(adminOpenTicketsCount > 0 && { badge: { className: 'bg-danger', text: String(adminOpenTicketsCount) } }),
        },
      ],
    })
  }

  if (
    hp('admin.settings') ||
    hp('admin.jobs-monitor') ||
    hp('admin.cron-statistics') ||
    hp('admin.customers') ||
    hp('admin.groups') ||
    hp('admin.permissions') ||
    hp('admin.legacy-migration') ||
    hp('admin.update')
  ) {
    const system: MenuItemType[] = []
    system.push({ slug: 'admin-api', label: 'API', url: '/admin/api', icon: 'settings-2' })
    if (hp('admin.settings')) system.push({ slug: 'admin-settings', label: 'Einstellungen', url: '/admin/settings', icon: 'settings-2' })
    if (hp('admin.jobs-monitor')) system.push({ slug: 'admin-jobs', label: 'Jobs-Monitor', url: '/admin/jobs-monitor', icon: 'settings-2' })
    if (hp('admin.cron-statistics')) system.push({ slug: 'admin-cron', label: 'Cron / Worker-Statistik', url: '/admin/cron-statistics', icon: 'settings-2' })
    if (hp('admin.update')) system.push({ slug: 'admin-update', label: 'Panel-Update', url: '/admin/update', icon: 'upload' })
    if (hp('admin.customers')) system.push({ slug: 'admin-customers', label: 'Kunden', url: '/admin/customers', icon: 'users' })
    if (hp('admin.groups')) system.push({ slug: 'admin-groups', label: 'Gruppen', url: '/admin/groups', icon: 'users' })
    if (hp('admin.permissions')) system.push({ slug: 'admin-permissions', label: 'Berechtigungen', url: '/admin/permissions', icon: 'settings-2' })
    if (hp('admin.legacy-migration')) system.push({ slug: 'admin-legacy', label: 'Legacy-Migration', url: '/admin/legacy-migration', icon: 'archive' })
    if (system.length > 0) items.push({ slug: 'admin-system', label: 'System', icon: 'settings-2', children: system })
  }

  if (items.length === 0) return []

  return [
    {
      slug: 'admin',
      label: 'Admin',
      isTitle: true,
      icon: 'settings-2',
      children: items,
    },
  ]
}
