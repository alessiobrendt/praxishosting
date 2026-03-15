<script setup lang="ts">
import { computed } from 'vue';
import ActionItemsWidget from '@/components/admin/dashboard/widgets/ActionItemsWidget.vue';
import CountWidget from '@/components/admin/dashboard/widgets/CountWidget.vue';
import GenericCardWidget from '@/components/admin/dashboard/widgets/GenericCardWidget.vue';
import GenericDataWidget from '@/components/admin/dashboard/widgets/GenericDataWidget.vue';
import GenericListWidget from '@/components/admin/dashboard/widgets/GenericListWidget.vue';
import GlobalSearchWidget from '@/components/admin/dashboard/widgets/GlobalSearchWidget.vue';
import LastWebhookWidget from '@/components/admin/dashboard/widgets/LastWebhookWidget.vue';
import RecentItemsWidget from '@/components/admin/dashboard/widgets/RecentItemsWidget.vue';
import RevenueKpiWidget from '@/components/admin/dashboard/widgets/RevenueKpiWidget.vue';
import SimpleChartWidget from '@/components/admin/dashboard/widgets/SimpleChartWidget.vue';
import SitesStatsWidget from '@/components/admin/dashboard/widgets/SitesStatsWidget.vue';
import UnpaidOverdueWidget from '@/components/admin/dashboard/widgets/UnpaidOverdueWidget.vue';
import type { WidgetRegistryItem } from '@/types/admin/dashboard';

const props = defineProps<{
    widgetKey: string;
    data?: Record<string, unknown> | null;
    registryItem?: WidgetRegistryItem | null;
}>();

const componentMap: Record<string, unknown> = {
    'revenue-today': RevenueKpiWidget,
    'revenue-month': RevenueKpiWidget,
    'revenue-year': RevenueKpiWidget,
    'revenue-chart-daily': SimpleChartWidget,
    'revenue-chart-monthly': SimpleChartWidget,
    'sites-stats': SitesStatsWidget,
    'sites-suspended': CountWidget,
    'unpaid-overdue': UnpaidOverdueWidget,
    'last-mollie-webhook': LastWebhookWidget,
    'active-subscriptions': CountWidget,
    'subscriptions-ending-week': CountWidget,
    'cancellations-period-end': CountWidget,
    'subscriptions-chart-daily': SimpleChartWidget,
    'customers-total': CountWidget,
    'newest-customer': GenericCardWidget,
    'last-purchase': GenericCardWidget,
    'recent-invoices': GenericListWidget,
    'new-customers-chart': SimpleChartWidget,
    'overdue-failed-invoices': GenericListWidget,
    'open-dunning-invoices': GenericListWidget,
    'invoice-status-pie': SimpleChartWidget,
    'expiring-subscriptions': GenericListWidget,
    'pterodactyl-nodes-load': GenericListWidget,
    'pterodactyl-nodes-summary': GenericDataWidget,
    'hosting-servers-status': GenericListWidget,
    'hosting-servers-overview': GenericDataWidget,
    'open-tickets': CountWidget,
    'tickets-by-priority': SimpleChartWidget,
    'tickets-by-category': SimpleChartWidget,
    'recent-tickets': GenericListWidget,
    'tickets-created-chart': SimpleChartWidget,
    'failed-jobs': CountWidget,
    'waiting-jobs': CountWidget,
    'cron-last-run': GenericDataWidget,
    'cron-daily-stats-chart': SimpleChartWidget,
    'recent-activity': GenericListWidget,
    'game-server-accounts': CountWidget,
    'game-servers-pending': CountWidget,
    'webspace-accounts': CountWidget,
    'webspace-pending-plesk': CountWidget,
    'action-items': ActionItemsWidget,
    'global-search': GlobalSearchWidget,
    'recent-items': RecentItemsWidget,
    'discount-codes-active': CountWidget,
    'vouchers-remaining': GenericDataWidget,
    'domains-expiring': GenericListWidget,
    'templates-count': GenericDataWidget,
};

const component = computed(() => componentMap[props.widgetKey] ?? null);

const componentProps = computed(() => {
    const key = props.widgetKey;
    const reg = props.registryItem;
    const data = props.data as Record<string, unknown> | undefined;
    const base = { data, title: reg?.title, description: reg?.description };
    if (key === 'revenue-today') return { ...base, title: 'Umsatz heute' };
    if (key === 'revenue-month') return { ...base, title: 'Umsatz Monat' };
    if (key === 'revenue-year') return { ...base, title: 'Umsatz Jahr' };
    if (['revenue-chart-daily', 'revenue-chart-monthly', 'subscriptions-chart-daily', 'new-customers-chart', 'tickets-created-chart'].includes(key)) {
        return { ...base, chartType: 'bar' as const };
    }
    if (key === 'invoice-status-pie') return { ...base, chartType: 'doughnut' as const };
    if (key === 'tickets-by-priority' || key === 'tickets-by-category') return { ...base, chartType: 'doughnut' as const };
    if (key === 'cron-daily-stats-chart' && data?.labels && Array.isArray(data.invoices)) {
        return { ...base, data: { labels: data.labels, values: data.invoices as number[] }, chartType: 'bar' as const };
    }
    if (['active-subscriptions', 'customers-total'].includes(key)) {
        return { ...base, linkHref: key === 'active-subscriptions' ? '/admin/subscriptions' : undefined, linkLabel: 'Anzeigen' };
    }
    if (key === 'sites-suspended') return { ...base, linkHref: '/admin/sites', linkLabel: 'Sites' };
    if (key === 'subscriptions-ending-week') return { ...base, description: 'Laufzeitende diese Woche', linkHref: '/admin/subscriptions', linkLabel: 'Abos' };
    if (key === 'cancellations-period-end') return { ...base, description: 'Abos mit Kündigung', linkHref: '/admin/subscriptions', linkLabel: 'Abos' };
    if (key === 'open-tickets') return { ...base, linkHref: '/admin/tickets', linkLabel: 'Tickets' };
    if (key === 'failed-jobs') return { ...base, linkHref: '/admin/failed-jobs', linkLabel: 'Anzeigen' };
    if (key === 'waiting-jobs') return { ...base, linkHref: '/admin/jobs-monitor', linkLabel: 'Jobs' };
    if (key === 'game-server-accounts') return { ...base, linkHref: '/admin/gaming-accounts', linkLabel: 'Anzeigen' };
    if (key === 'game-servers-pending') return { ...base, linkHref: '/admin/gaming-accounts', linkLabel: 'Anzeigen' };
    if (key === 'webspace-accounts') return { ...base, linkHref: '/admin/webspace-accounts', linkLabel: 'Anzeigen' };
    if (key === 'webspace-pending-plesk') return { ...base, linkHref: '/admin/webspace-accounts', linkLabel: 'Anzeigen' };
    if (key === 'discount-codes-active') return { ...base, linkHref: '/admin/discount-codes', linkLabel: 'Rabattcodes' };
    if (key === 'pterodactyl-nodes-summary') return { ...base, keys: ['total', 'maintenance', 'memory_percent', 'disk_percent'] };
    if (key === 'hosting-servers-overview') return { ...base, keys: ['total', 'online', 'offline'] };
    if (key === 'cron-last-run') return { ...base, keys: ['lastRunAt'] };
    if (key === 'vouchers-remaining') return { ...base, keys: ['count', 'totalValue'] };
    if (key === 'templates-count') return { ...base, keys: ['templates', 'pages'] };
    if (key === 'newest-customer') {
        const d = data as { name?: string; email?: string; created_at?: string; id?: number } | undefined;
        return { ...base, primary: d?.name, secondary: d?.email, tertiary: d?.created_at, linkHref: d?.id ? `/admin/customers/${d.id}` : undefined };
    }
    if (key === 'last-purchase') {
        const d = data as { number?: string; amount?: number; user_name?: string; paid_at?: string; id?: number } | undefined;
        return { ...base, primary: d?.number, secondary: d?.user_name ? `${d.user_name} – ${d?.amount ?? 0} €` : `${d?.amount ?? 0} €`, tertiary: d?.paid_at, linkHref: d?.uuid ? `/admin/invoices/${d.uuid}` : undefined };
    }
    if (key === 'overdue-failed-invoices') {
        return { ...base, title: 'Überfällige Rechnungen', itemLink: (item: Record<string, unknown>) => `/admin/invoices/${item.uuid}`, itemLabel: (item: Record<string, unknown>) => `Rechnung ${(item as { number?: string }).number}` };
    }
    if (key === 'open-dunning-invoices') {
        return { ...base, title: 'Offene Mahnungen', itemLink: (item: Record<string, unknown>) => `/admin/invoices/${item.uuid}`, itemLabel: (item: Record<string, unknown>) => `Rechnung ${(item as { number?: string }).number} (Stufe ${(item as { max_level?: number }).max_level})` };
    }
    if (key === 'expiring-subscriptions') {
        return { ...base, title: 'Auslaufende Abos', itemLink: (item: Record<string, unknown>) => (item.site_uuid ? `/admin/sites/${item.site_uuid}` : '#'), itemLabel: (item: Record<string, unknown>) => `${(item as { site_name?: string }).site_name} – ${(item as { current_period_ends_at?: string }).current_period_ends_at}` };
    }
    if (key === 'recent-invoices') {
        return { ...base, itemLink: (item: Record<string, unknown>) => `/admin/invoices/${item.uuid}`, itemLabel: (item: Record<string, unknown>) => `#${(item as { number?: string }).number} ${(item as { amount?: number }).amount} €` };
    }
    if (key === 'pterodactyl-nodes-load') {
        return { ...base, itemsKey: 'nodes', itemLabel: (item: Record<string, unknown>) => `${(item as { name?: string }).name} – ${(item as { memory_allocated_mb?: number }).memory_allocated_mb ?? 0}/${(item as { memory_total_mb?: number }).memory_total_mb ?? 0} MB` };
    }
    if (key === 'hosting-servers-status') {
        return { ...base, itemsKey: 'servers', itemLink: (item: Record<string, unknown>) => `/admin/hosting-servers/${item.id}`, itemLabel: (item: Record<string, unknown>) => `${(item as { name?: string }).name} (${(item as { api_check_status?: string }).api_check_status ?? '-'})` };
    }
    if (key === 'recent-tickets') {
        return { ...base, itemLink: (item: Record<string, unknown>) => `/admin/tickets/${item.id}`, itemLabel: (item: Record<string, unknown>) => `${(item as { subject?: string }).subject} – ${(item as { priority?: string }).priority} (${(item as { created_at?: string }).created_at})` };
    }
    if (key === 'recent-activity') {
        return { ...base, itemLabel: (item: Record<string, unknown>) => `${(item as { action?: string }).action} ${(item as { model_type?: string }).model_type} – ${(item as { created_at?: string }).created_at}` };
    }
    if (key === 'domains-expiring') {
        return { ...base, itemLink: (item: Record<string, unknown>) => `/admin/domains/${item.id}`, itemLabel: (item: Record<string, unknown>) => `${(item as { domain?: string }).domain} – ${(item as { expires_at?: string }).expires_at}` };
    }
    return base;
});
</script>

<template>
    <component
        v-if="component"
        :is="component"
        v-bind="componentProps"
    />
    <div v-else class="py-2 text-sm text-muted-foreground">
        Widget „{{ widgetKey }}“ – keine Komponente zugewiesen.
    </div>
</template>
