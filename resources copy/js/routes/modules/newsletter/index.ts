import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
import posts from './posts'
/**
* @see \App\Http\Controllers\ModuleController::site
 * @see app/Http/Controllers/ModuleController.php:70
 * @route '/modules/newsletter/sites/{site}'
 */
export const site = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: site.url(args, options),
    method: 'get',
})

site.definition = {
    methods: ["get","head"],
    url: '/modules/newsletter/sites/{site}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ModuleController::site
 * @see app/Http/Controllers/ModuleController.php:70
 * @route '/modules/newsletter/sites/{site}'
 */
site.url = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return site.definition.url
            .replace('{site}', parsedArgs.site.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuleController::site
 * @see app/Http/Controllers/ModuleController.php:70
 * @route '/modules/newsletter/sites/{site}'
 */
site.get = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: site.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ModuleController::site
 * @see app/Http/Controllers/ModuleController.php:70
 * @route '/modules/newsletter/sites/{site}'
 */
site.head = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: site.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ModuleController::site
 * @see app/Http/Controllers/ModuleController.php:70
 * @route '/modules/newsletter/sites/{site}'
 */
    const siteForm = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: site.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ModuleController::site
 * @see app/Http/Controllers/ModuleController.php:70
 * @route '/modules/newsletter/sites/{site}'
 */
        siteForm.get = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: site.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ModuleController::site
 * @see app/Http/Controllers/ModuleController.php:70
 * @route '/modules/newsletter/sites/{site}'
 */
        siteForm.head = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: site.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    site.form = siteForm
/**
* @see \App\Http\Controllers\ModuleController::index
 * @see app/Http/Controllers/ModuleController.php:23
 * @route '/modules/newsletter'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/modules/newsletter',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ModuleController::index
 * @see app/Http/Controllers/ModuleController.php:23
 * @route '/modules/newsletter'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuleController::index
 * @see app/Http/Controllers/ModuleController.php:23
 * @route '/modules/newsletter'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ModuleController::index
 * @see app/Http/Controllers/ModuleController.php:23
 * @route '/modules/newsletter'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ModuleController::index
 * @see app/Http/Controllers/ModuleController.php:23
 * @route '/modules/newsletter'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ModuleController::index
 * @see app/Http/Controllers/ModuleController.php:23
 * @route '/modules/newsletter'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ModuleController::index
 * @see app/Http/Controllers/ModuleController.php:23
 * @route '/modules/newsletter'
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
const newsletter = {
    site: Object.assign(site, site),
posts: Object.assign(posts, posts),
index: Object.assign(index, index),
}

export default newsletter