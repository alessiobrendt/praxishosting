import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
import status from './status'
import subscription from './subscription'
/**
* @see \App\Http\Controllers\Admin\SiteController::index
 * @see app/Http/Controllers/Admin/SiteController.php:55
 * @route '/admin/sites'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/sites',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\SiteController::index
 * @see app/Http/Controllers/Admin/SiteController.php:55
 * @route '/admin/sites'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SiteController::index
 * @see app/Http/Controllers/Admin/SiteController.php:55
 * @route '/admin/sites'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\SiteController::index
 * @see app/Http/Controllers/Admin/SiteController.php:55
 * @route '/admin/sites'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\SiteController::index
 * @see app/Http/Controllers/Admin/SiteController.php:55
 * @route '/admin/sites'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\SiteController::index
 * @see app/Http/Controllers/Admin/SiteController.php:55
 * @route '/admin/sites'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\SiteController::index
 * @see app/Http/Controllers/Admin/SiteController.php:55
 * @route '/admin/sites'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\Admin\SiteController::show
 * @see app/Http/Controllers/Admin/SiteController.php:21
 * @route '/admin/sites/{site}'
 */
export const show = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/sites/{site}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\SiteController::show
 * @see app/Http/Controllers/Admin/SiteController.php:21
 * @route '/admin/sites/{site}'
 */
show.url = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { site: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { site: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    site: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        site: typeof args.site === 'object'
                ? args.site.uuid
                : args.site,
                }

    return show.definition.url
            .replace('{site}', parsedArgs.site.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SiteController::show
 * @see app/Http/Controllers/Admin/SiteController.php:21
 * @route '/admin/sites/{site}'
 */
show.get = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\SiteController::show
 * @see app/Http/Controllers/Admin/SiteController.php:21
 * @route '/admin/sites/{site}'
 */
show.head = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\SiteController::show
 * @see app/Http/Controllers/Admin/SiteController.php:21
 * @route '/admin/sites/{site}'
 */
    const showForm = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\SiteController::show
 * @see app/Http/Controllers/Admin/SiteController.php:21
 * @route '/admin/sites/{site}'
 */
        showForm.get = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\SiteController::show
 * @see app/Http/Controllers/Admin/SiteController.php:21
 * @route '/admin/sites/{site}'
 */
        showForm.head = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const sites = {
    index: Object.assign(index, index),
show: Object.assign(show, show),
status: Object.assign(status, status),
subscription: Object.assign(subscription, subscription),
}

export default sites