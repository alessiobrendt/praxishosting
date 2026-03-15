export const allRoutes = [
  {
    path: '',
    component: () => import('~/layouts/default.vue'),
    redirect: '/dashboard/ecommerce',
    children: [
        {
            path: '/dashboard/ecommerce',
            name: 'dashboard.ecommerce',
            meta: { title: 'Ecommerce' },
            component: () => import('~/views/admin/dashboard/ecommerce/index.vue')
        },
        {
            path: '/icons/tabler',
            name: 'icons.tabler',
            meta: { title: 'Tabler' },
            component: () => import('~/views/admin/icons/tabler/index.vue')
        },
        {
            path: '/layouts/boxed',
            name: 'layouts.boxed',
            meta: { title: 'Boxed' },
            component: () => import('~/views/admin/layouts/boxed/index.vue')
        },
        {
            path: '/layouts/compact',
            name: 'layouts.compact',
            meta: { title: 'Compact' },
            component: () => import('~/views/admin/layouts/compact/index.vue')
        },
        {
            path: '/layouts/horizontal',
            name: 'layouts.horizontal',
            meta: { title: 'Horizontal' },
            component: () => import('~/views/admin/layouts/horizontal/index.vue')
        },
        {
            path: '/layouts/preloader',
            name: 'layouts.preloader',
            meta: { title: 'Preloader' },
            component: () => import('~/views/admin/layouts/preloader/index.vue')
        },
        {
            path: '/layouts/scrollable',
            name: 'layouts.scrollable',
            meta: { title: 'Scrollable' },
            component: () => import('~/views/admin/layouts/scrollable/index.vue')
        },
        {
            path: '/layouts/sidebar-compact',
            name: 'layouts.sidebar-compact',
            meta: { title: 'Sidebar compact' },
            component: () => import('~/views/admin/layouts/sidebar-compact/index.vue')
        },
        {
            path: '/layouts/sidebar-gradient',
            name: 'layouts.sidebar-gradient',
            meta: { title: 'Sidebar gradient' },
            component: () => import('~/views/admin/layouts/sidebar-gradient/index.vue')
        },
        {
            path: '/layouts/sidebar-gray',
            name: 'layouts.sidebar-gray',
            meta: { title: 'Sidebar gray' },
            component: () => import('~/views/admin/layouts/sidebar-gray/index.vue')
        },
        {
            path: '/layouts/sidebar-image',
            name: 'layouts.sidebar-image',
            meta: { title: 'Sidebar image' },
            component: () => import('~/views/admin/layouts/sidebar-image/index.vue')
        },
        {
            path: '/layouts/sidebar-light',
            name: 'layouts.sidebar-light',
            meta: { title: 'Sidebar light' },
            component: () => import('~/views/admin/layouts/sidebar-light/index.vue')
        },
        {
            path: '/layouts/sidebar-no-icons',
            name: 'layouts.sidebar-no-icons',
            meta: { title: 'Sidebar no icons' },
            component: () => import('~/views/admin/layouts/sidebar-no-icons/index.vue')
        },
        {
            path: '/layouts/sidebar-offcanvas',
            name: 'layouts.sidebar-offcanvas',
            meta: { title: 'Sidebar offcanvas' },
            component: () => import('~/views/admin/layouts/sidebar-offcanvas/index.vue')
        },
        {
            path: '/layouts/sidebar-on-hover',
            name: 'layouts.sidebar-on-hover',
            meta: { title: 'Sidebar on hover' },
            component: () => import('~/views/admin/layouts/sidebar-on-hover/index.vue')
        },
        {
            path: '/layouts/sidebar-with-lines',
            name: 'layouts.sidebar-with-lines',
            meta: { title: 'Sidebar with lines' },
            component: () => import('~/views/admin/layouts/sidebar-with-lines/index.vue')
        },
        {
            path: '/layouts/topbar-dark',
            name: 'layouts.topbar-dark',
            meta: { title: 'Topbar dark' },
            component: () => import('~/views/admin/layouts/topbar-dark/index.vue')
        },
        {
            path: '/layouts/topbar-gradient',
            name: 'layouts.topbar-gradient',
            meta: { title: 'Topbar gradient' },
            component: () => import('~/views/admin/layouts/topbar-gradient/index.vue')
        },
        {
            path: '/layouts/topbar-gray',
            name: 'layouts.topbar-gray',
            meta: { title: 'Topbar gray' },
            component: () => import('~/views/admin/layouts/topbar-gray/index.vue')
        },
        {
            path: '/pages/empty',
            name: 'pages.empty',
            meta: { title: 'Empty' },
            component: () => import('~/views/admin/pages/empty/index.vue')
        },
    ],
  },
        {
            path: '/auth/card/delete-account',
            name: 'auth.card.delete-account',
            meta: { title: 'Delete account' },
            component: () => import('~/views/auth/card/delete-account/index.vue')
        },
        {
            path: '/auth/card/lock-screen',
            name: 'auth.card.lock-screen',
            meta: { title: 'Lock screen' },
            component: () => import('~/views/auth/card/lock-screen/index.vue')
        },
        {
            path: '/auth/card/login-pin',
            name: 'auth.card.login-pin',
            meta: { title: 'Login pin' },
            component: () => import('~/views/auth/card/login-pin/index.vue')
        },
        {
            path: '/auth/card/new-pass',
            name: 'auth.card.new-pass',
            meta: { title: 'New pass' },
            component: () => import('~/views/auth/card/new-pass/index.vue')
        },
        {
            path: '/auth/card/reset-pass',
            name: 'auth.card.reset-pass',
            meta: { title: 'Reset pass' },
            component: () => import('~/views/auth/card/reset-pass/index.vue')
        },
        {
            path: '/auth/card/sign-in',
            name: 'auth.card.sign-in',
            meta: { title: 'Sign in' },
            component: () => import('~/views/auth/card/sign-in/index.vue')
        },
        {
            path: '/auth/card/sign-up',
            name: 'auth.card.sign-up',
            meta: { title: 'Sign up' },
            component: () => import('~/views/auth/card/sign-up/index.vue')
        },
        {
            path: '/auth/card/success-mail',
            name: 'auth.card.success-mail',
            meta: { title: 'Success mail' },
            component: () => import('~/views/auth/card/success-mail/index.vue')
        },
        {
            path: '/auth/card/two-factor',
            name: 'auth.card.two-factor',
            meta: { title: 'Two factor' },
            component: () => import('~/views/auth/card/two-factor/index.vue')
        },
        {
            path: '/auth/delete-account',
            name: 'auth.delete-account',
            meta: { title: 'Delete account' },
            component: () => import('~/views/auth/basic/delete-account/index.vue')
        },
        {
            path: '/auth/lock-screen',
            name: 'auth.lock-screen',
            meta: { title: 'Lock screen' },
            component: () => import('~/views/auth/basic/lock-screen/index.vue')
        },
        {
            path: '/auth/login-pin',
            name: 'auth.login-pin',
            meta: { title: 'Login pin' },
            component: () => import('~/views/auth/basic/login-pin/index.vue')
        },
        {
            path: '/auth/new-pass',
            name: 'auth.new-pass',
            meta: { title: 'New pass' },
            component: () => import('~/views/auth/basic/new-pass/index.vue')
        },
        {
            path: '/auth/reset-pass',
            name: 'auth.reset-pass',
            meta: { title: 'Reset pass' },
            component: () => import('~/views/auth/basic/reset-pass/index.vue')
        },
        {
            path: '/auth/sign-in',
            name: 'auth.sign-in',
            meta: { title: 'Sign in' },
            component: () => import('~/views/auth/basic/sign-in/index.vue')
        },
        {
            path: '/auth/sign-up',
            name: 'auth.sign-up',
            meta: { title: 'Sign up' },
            component: () => import('~/views/auth/basic/sign-up/index.vue')
        },
        {
            path: '/auth/split/delete-account',
            name: 'auth.split.delete-account',
            meta: { title: 'Delete account' },
            component: () => import('~/views/auth/split/delete-account/index.vue')
        },
        {
            path: '/auth/split/lock-screen',
            name: 'auth.split.lock-screen',
            meta: { title: 'Lock screen' },
            component: () => import('~/views/auth/split/lock-screen/index.vue')
        },
        {
            path: '/auth/split/login-pin',
            name: 'auth.split.login-pin',
            meta: { title: 'Login pin' },
            component: () => import('~/views/auth/split/login-pin/index.vue')
        },
        {
            path: '/auth/split/new-pass',
            name: 'auth.split.new-pass',
            meta: { title: 'New pass' },
            component: () => import('~/views/auth/split/new-pass/index.vue')
        },
        {
            path: '/auth/split/reset-pass',
            name: 'auth.split.reset-pass',
            meta: { title: 'Reset pass' },
            component: () => import('~/views/auth/split/reset-pass/index.vue')
        },
        {
            path: '/auth/split/sign-in',
            name: 'auth.split.sign-in',
            meta: { title: 'Sign in' },
            component: () => import('~/views/auth/split/sign-in/index.vue')
        },
        {
            path: '/auth/split/sign-up',
            name: 'auth.split.sign-up',
            meta: { title: 'Sign up' },
            component: () => import('~/views/auth/split/sign-up/index.vue')
        },
        {
            path: '/auth/split/success-mail',
            name: 'auth.split.success-mail',
            meta: { title: 'Success mail' },
            component: () => import('~/views/auth/split/success-mail/index.vue')
        },
        {
            path: '/auth/split/two-factor',
            name: 'auth.split.two-factor',
            meta: { title: 'Two factor' },
            component: () => import('~/views/auth/split/two-factor/index.vue')
        },
        {
            path: '/auth/success-mail',
            name: 'auth.success-mail',
            meta: { title: 'Success mail' },
            component: () => import('~/views/auth/basic/success-mail/index.vue')
        },
        {
            path: '/auth/two-factor',
            name: 'auth.two-factor',
            meta: { title: 'Two factor' },
            component: () => import('~/views/auth/basic/two-factor/index.vue')
        },
        {
            path: '/error/400',
            name: 'error.400',
            meta: { title: '400' },
            component: () => import('~/views/error/400/index.vue')
        },
        {
            path: '/error/401',
            name: 'error.401',
            meta: { title: '401' },
            component: () => import('~/views/error/401/index.vue')
        },
        {
            path: '/error/403',
            name: 'error.403',
            meta: { title: '403' },
            component: () => import('~/views/error/403/index.vue')
        },
        {
            path: '/error/404',
            name: 'error.404',
            meta: { title: '404' },
            component: () => import('~/views/error/404/index.vue')
        },
        {
            path: '/error/408',
            name: 'error.408',
            meta: { title: '408' },
            component: () => import('~/views/error/408/index.vue')
        },
        {
            path: '/error/500',
            name: 'error.500',
            meta: { title: '500' },
            component: () => import('~/views/error/500/index.vue')
        },
        {
            path: '/error/maintenance',
            name: 'error.maintenance',
            meta: { title: 'Maintenance' },
            component: () => import('~/views/error/maintenance/index.vue')
        },
]
