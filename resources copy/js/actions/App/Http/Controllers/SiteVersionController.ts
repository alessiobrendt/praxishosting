import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\SiteVersionController::index
 * @see app/Http/Controllers/SiteVersionController.php:14
 * @route '/sites/{site}/versions'
 */
export const index = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/sites/{site}/versions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SiteVersionController::index
 * @see app/Http/Controllers/SiteVersionController.php:14
 * @route '/sites/{site}/versions'
 */
index.url = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return index.definition.url
            .replace('{site}', parsedArgs.site.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SiteVersionController::index
 * @see app/Http/Controllers/SiteVersionController.php:14
 * @route '/sites/{site}/versions'
 */
index.get = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SiteVersionController::index
 * @see app/Http/Controllers/SiteVersionController.php:14
 * @route '/sites/{site}/versions'
 */
index.head = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SiteVersionController::index
 * @see app/Http/Controllers/SiteVersionController.php:14
 * @route '/sites/{site}/versions'
 */
    const indexForm = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SiteVersionController::index
 * @see app/Http/Controllers/SiteVersionController.php:14
 * @route '/sites/{site}/versions'
 */
        indexForm.get = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SiteVersionController::index
 * @see app/Http/Controllers/SiteVersionController.php:14
 * @route '/sites/{site}/versions'
 */
        indexForm.head = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\SiteVersionController::publish
 * @see app/Http/Controllers/SiteVersionController.php:40
 * @route '/sites/{site}/versions/{version}/publish'
 */
export const publish = (args: { site: string | { uuid: string }, version: number | { id: number } } | [site: string | { uuid: string }, version: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: publish.url(args, options),
    method: 'post',
})

publish.definition = {
    methods: ["post"],
    url: '/sites/{site}/versions/{version}/publish',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SiteVersionController::publish
 * @see app/Http/Controllers/SiteVersionController.php:40
 * @route '/sites/{site}/versions/{version}/publish'
 */
publish.url = (args: { site: string | { uuid: string }, version: number | { id: number } } | [site: string | { uuid: string }, version: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    site: args[0],
                    version: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        site: typeof args.site === 'object'
                ? args.site.uuid
                : args.site,
                                version: typeof args.version === 'object'
                ? args.version.id
                : args.version,
                }

    return publish.definition.url
            .replace('{site}', parsedArgs.site.toString())
            .replace('{version}', parsedArgs.version.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SiteVersionController::publish
 * @see app/Http/Controllers/SiteVersionController.php:40
 * @route '/sites/{site}/versions/{version}/publish'
 */
publish.post = (args: { site: string | { uuid: string }, version: number | { id: number } } | [site: string | { uuid: string }, version: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: publish.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SiteVersionController::publish
 * @see app/Http/Controllers/SiteVersionController.php:40
 * @route '/sites/{site}/versions/{version}/publish'
 */
    const publishForm = (args: { site: string | { uuid: string }, version: number | { id: number } } | [site: string | { uuid: string }, version: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: publish.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SiteVersionController::publish
 * @see app/Http/Controllers/SiteVersionController.php:40
 * @route '/sites/{site}/versions/{version}/publish'
 */
        publishForm.post = (args: { site: string | { uuid: string }, version: number | { id: number } } | [site: string | { uuid: string }, version: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: publish.url(args, options),
            method: 'post',
        })
    
    publish.form = publishForm
/**
* @see \App\Http\Controllers\SiteVersionController::rollback
 * @see app/Http/Controllers/SiteVersionController.php:69
 * @route '/sites/{site}/versions/{version}/rollback'
 */
export const rollback = (args: { site: string | { uuid: string }, version: number | { id: number } } | [site: string | { uuid: string }, version: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rollback.url(args, options),
    method: 'post',
})

rollback.definition = {
    methods: ["post"],
    url: '/sites/{site}/versions/{version}/rollback',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SiteVersionController::rollback
 * @see app/Http/Controllers/SiteVersionController.php:69
 * @route '/sites/{site}/versions/{version}/rollback'
 */
rollback.url = (args: { site: string | { uuid: string }, version: number | { id: number } } | [site: string | { uuid: string }, version: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    site: args[0],
                    version: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        site: typeof args.site === 'object'
                ? args.site.uuid
                : args.site,
                                version: typeof args.version === 'object'
                ? args.version.id
                : args.version,
                }

    return rollback.definition.url
            .replace('{site}', parsedArgs.site.toString())
            .replace('{version}', parsedArgs.version.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SiteVersionController::rollback
 * @see app/Http/Controllers/SiteVersionController.php:69
 * @route '/sites/{site}/versions/{version}/rollback'
 */
rollback.post = (args: { site: string | { uuid: string }, version: number | { id: number } } | [site: string | { uuid: string }, version: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rollback.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SiteVersionController::rollback
 * @see app/Http/Controllers/SiteVersionController.php:69
 * @route '/sites/{site}/versions/{version}/rollback'
 */
    const rollbackForm = (args: { site: string | { uuid: string }, version: number | { id: number } } | [site: string | { uuid: string }, version: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: rollback.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SiteVersionController::rollback
 * @see app/Http/Controllers/SiteVersionController.php:69
 * @route '/sites/{site}/versions/{version}/rollback'
 */
        rollbackForm.post = (args: { site: string | { uuid: string }, version: number | { id: number } } | [site: string | { uuid: string }, version: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: rollback.url(args, options),
            method: 'post',
        })
    
    rollback.form = rollbackForm
const SiteVersionController = { index, publish, rollback }

export default SiteVersionController