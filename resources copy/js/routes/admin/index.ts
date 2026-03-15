import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults, validateParameters } from './../../wayfinder'
import dashboard074181 from './dashboard'
import activityLog from './activity-log'
import cronStatistics from './cron-statistics'
import jobsMonitor from './jobs-monitor'
import waitingJobs from './waiting-jobs'
import finishedBatches from './finished-batches'
import failedJobs from './failed-jobs'
import invoices from './invoices'
import dunningLetters from './dunning-letters'
import subscriptions from './subscriptions'
import sites from './sites'
import legacyMigration from './legacy-migration'
import emails from './emails'
import api from './api'
import settings from './settings'
import update from './update'
import brands from './brands'
import discountCodes from './discount-codes'
import partners from './partners'
import vouchers from './vouchers'
import products from './products'
import hostingServers from './hosting-servers'
import hostingPlans from './hosting-plans'
import gameserverCloudPlans from './gameserver-cloud-plans'
import webspaceAccounts from './webspace-accounts'
import gamingAccounts from './gaming-accounts'
import gameserverCloudAccounts from './gameserver-cloud-accounts'
import subdomains from './subdomains'
import teamspeakAccounts from './teamspeak-accounts'
import templates from './templates'
import domains from './domains'
import customers from './customers'
import tickets from './tickets'
import ticketCategories from './ticket-categories'
import ticketMessageTemplates from './ticket-message-templates'
import ticketPriorities from './ticket-priorities'
import groups from './groups'
import permissions from './permissions'
/**
 * @see routes/web.php:380
 * @route '/admin/login'
 */
export const login = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})

login.definition = {
    methods: ["get","head"],
    url: '/admin/login',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:380
 * @route '/admin/login'
 */
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:380
 * @route '/admin/login'
 */
login.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:380
 * @route '/admin/login'
 */
login.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: login.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:380
 * @route '/admin/login'
 */
    const loginForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: login.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:380
 * @route '/admin/login'
 */
        loginForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: login.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:380
 * @route '/admin/login'
 */
        loginForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: login.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    login.form = loginForm
/**
* @see \Lab404\Impersonate\Controllers\ImpersonateController::impersonate
 * @see vendor/lab404/laravel-impersonate/src/Controllers/ImpersonateController.php:32
 * @route '/admin/impersonate/take/{id}/{guardName?}'
 */
export const impersonate = (args: { id: string | number, guardName?: string | number } | [id: string | number, guardName: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: impersonate.url(args, options),
    method: 'get',
})

impersonate.definition = {
    methods: ["get","head"],
    url: '/admin/impersonate/take/{id}/{guardName?}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Lab404\Impersonate\Controllers\ImpersonateController::impersonate
 * @see vendor/lab404/laravel-impersonate/src/Controllers/ImpersonateController.php:32
 * @route '/admin/impersonate/take/{id}/{guardName?}'
 */
impersonate.url = (args: { id: string | number, guardName?: string | number } | [id: string | number, guardName: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                    guardName: args[1],
                }
    }

    args = applyUrlDefaults(args)

    validateParameters(args, [
            "guardName",
        ])

    const parsedArgs = {
                        id: args.id,
                                guardName: args.guardName,
                }

    return impersonate.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace('{guardName?}', parsedArgs.guardName?.toString() ?? '')
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \Lab404\Impersonate\Controllers\ImpersonateController::impersonate
 * @see vendor/lab404/laravel-impersonate/src/Controllers/ImpersonateController.php:32
 * @route '/admin/impersonate/take/{id}/{guardName?}'
 */
impersonate.get = (args: { id: string | number, guardName?: string | number } | [id: string | number, guardName: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: impersonate.url(args, options),
    method: 'get',
})
/**
* @see \Lab404\Impersonate\Controllers\ImpersonateController::impersonate
 * @see vendor/lab404/laravel-impersonate/src/Controllers/ImpersonateController.php:32
 * @route '/admin/impersonate/take/{id}/{guardName?}'
 */
impersonate.head = (args: { id: string | number, guardName?: string | number } | [id: string | number, guardName: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: impersonate.url(args, options),
    method: 'head',
})

    /**
* @see \Lab404\Impersonate\Controllers\ImpersonateController::impersonate
 * @see vendor/lab404/laravel-impersonate/src/Controllers/ImpersonateController.php:32
 * @route '/admin/impersonate/take/{id}/{guardName?}'
 */
    const impersonateForm = (args: { id: string | number, guardName?: string | number } | [id: string | number, guardName: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: impersonate.url(args, options),
        method: 'get',
    })

            /**
* @see \Lab404\Impersonate\Controllers\ImpersonateController::impersonate
 * @see vendor/lab404/laravel-impersonate/src/Controllers/ImpersonateController.php:32
 * @route '/admin/impersonate/take/{id}/{guardName?}'
 */
        impersonateForm.get = (args: { id: string | number, guardName?: string | number } | [id: string | number, guardName: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: impersonate.url(args, options),
            method: 'get',
        })
            /**
* @see \Lab404\Impersonate\Controllers\ImpersonateController::impersonate
 * @see vendor/lab404/laravel-impersonate/src/Controllers/ImpersonateController.php:32
 * @route '/admin/impersonate/take/{id}/{guardName?}'
 */
        impersonateForm.head = (args: { id: string | number, guardName?: string | number } | [id: string | number, guardName: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: impersonate.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    impersonate.form = impersonateForm
/**
* @see \App\Http\Controllers\Admin\DashboardController::dashboard
 * @see app/Http/Controllers/Admin/DashboardController.php:22
 * @route '/admin'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/admin',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\DashboardController::dashboard
 * @see app/Http/Controllers/Admin/DashboardController.php:22
 * @route '/admin'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DashboardController::dashboard
 * @see app/Http/Controllers/Admin/DashboardController.php:22
 * @route '/admin'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\DashboardController::dashboard
 * @see app/Http/Controllers/Admin/DashboardController.php:22
 * @route '/admin'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\DashboardController::dashboard
 * @see app/Http/Controllers/Admin/DashboardController.php:22
 * @route '/admin'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\DashboardController::dashboard
 * @see app/Http/Controllers/Admin/DashboardController.php:22
 * @route '/admin'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\DashboardController::dashboard
 * @see app/Http/Controllers/Admin/DashboardController.php:22
 * @route '/admin'
 */
        dashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dashboard.form = dashboardForm
/**
* @see \App\Http\Controllers\Admin\SearchController::search
 * @see app/Http/Controllers/Admin/SearchController.php:21
 * @route '/admin/search'
 */
export const search = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})

search.definition = {
    methods: ["get","head"],
    url: '/admin/search',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\SearchController::search
 * @see app/Http/Controllers/Admin/SearchController.php:21
 * @route '/admin/search'
 */
search.url = (options?: RouteQueryOptions) => {
    return search.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SearchController::search
 * @see app/Http/Controllers/Admin/SearchController.php:21
 * @route '/admin/search'
 */
search.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\SearchController::search
 * @see app/Http/Controllers/Admin/SearchController.php:21
 * @route '/admin/search'
 */
search.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: search.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\SearchController::search
 * @see app/Http/Controllers/Admin/SearchController.php:21
 * @route '/admin/search'
 */
    const searchForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: search.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\SearchController::search
 * @see app/Http/Controllers/Admin/SearchController.php:21
 * @route '/admin/search'
 */
        searchForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: search.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\SearchController::search
 * @see app/Http/Controllers/Admin/SearchController.php:21
 * @route '/admin/search'
 */
        searchForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: search.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    search.form = searchForm
const admin = {
    login: Object.assign(login, login),
impersonate: Object.assign(impersonate, impersonate),
dashboard: Object.assign(dashboard, dashboard074181),
search: Object.assign(search, search),
activityLog: Object.assign(activityLog, activityLog),
cronStatistics: Object.assign(cronStatistics, cronStatistics),
jobsMonitor: Object.assign(jobsMonitor, jobsMonitor),
waitingJobs: Object.assign(waitingJobs, waitingJobs),
finishedBatches: Object.assign(finishedBatches, finishedBatches),
failedJobs: Object.assign(failedJobs, failedJobs),
invoices: Object.assign(invoices, invoices),
dunningLetters: Object.assign(dunningLetters, dunningLetters),
subscriptions: Object.assign(subscriptions, subscriptions),
sites: Object.assign(sites, sites),
legacyMigration: Object.assign(legacyMigration, legacyMigration),
emails: Object.assign(emails, emails),
api: Object.assign(api, api),
settings: Object.assign(settings, settings),
update: Object.assign(update, update),
brands: Object.assign(brands, brands),
discountCodes: Object.assign(discountCodes, discountCodes),
partners: Object.assign(partners, partners),
vouchers: Object.assign(vouchers, vouchers),
products: Object.assign(products, products),
hostingServers: Object.assign(hostingServers, hostingServers),
hostingPlans: Object.assign(hostingPlans, hostingPlans),
gameserverCloudPlans: Object.assign(gameserverCloudPlans, gameserverCloudPlans),
webspaceAccounts: Object.assign(webspaceAccounts, webspaceAccounts),
gamingAccounts: Object.assign(gamingAccounts, gamingAccounts),
gameserverCloudAccounts: Object.assign(gameserverCloudAccounts, gameserverCloudAccounts),
subdomains: Object.assign(subdomains, subdomains),
teamspeakAccounts: Object.assign(teamspeakAccounts, teamspeakAccounts),
templates: Object.assign(templates, templates),
domains: Object.assign(domains, domains),
customers: Object.assign(customers, customers),
tickets: Object.assign(tickets, tickets),
ticketCategories: Object.assign(ticketCategories, ticketCategories),
ticketMessageTemplates: Object.assign(ticketMessageTemplates, ticketMessageTemplates),
ticketPriorities: Object.assign(ticketPriorities, ticketPriorities),
groups: Object.assign(groups, groups),
permissions: Object.assign(permissions, permissions),
}

export default admin