import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\SiteDomainController::index
 * @see app/Http/Controllers/SiteDomainController.php:21
 * @route '/sites/{site}/domains'
 */
export const index = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/sites/{site}/domains',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SiteDomainController::index
 * @see app/Http/Controllers/SiteDomainController.php:21
 * @route '/sites/{site}/domains'
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
* @see \App\Http\Controllers\SiteDomainController::index
 * @see app/Http/Controllers/SiteDomainController.php:21
 * @route '/sites/{site}/domains'
 */
index.get = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SiteDomainController::index
 * @see app/Http/Controllers/SiteDomainController.php:21
 * @route '/sites/{site}/domains'
 */
index.head = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SiteDomainController::index
 * @see app/Http/Controllers/SiteDomainController.php:21
 * @route '/sites/{site}/domains'
 */
    const indexForm = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SiteDomainController::index
 * @see app/Http/Controllers/SiteDomainController.php:21
 * @route '/sites/{site}/domains'
 */
        indexForm.get = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SiteDomainController::index
 * @see app/Http/Controllers/SiteDomainController.php:21
 * @route '/sites/{site}/domains'
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
* @see \App\Http\Controllers\SiteDomainController::store
 * @see app/Http/Controllers/SiteDomainController.php:33
 * @route '/sites/{site}/domains'
 */
export const store = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/sites/{site}/domains',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SiteDomainController::store
 * @see app/Http/Controllers/SiteDomainController.php:33
 * @route '/sites/{site}/domains'
 */
store.url = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return store.definition.url
            .replace('{site}', parsedArgs.site.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SiteDomainController::store
 * @see app/Http/Controllers/SiteDomainController.php:33
 * @route '/sites/{site}/domains'
 */
store.post = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SiteDomainController::store
 * @see app/Http/Controllers/SiteDomainController.php:33
 * @route '/sites/{site}/domains'
 */
    const storeForm = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SiteDomainController::store
 * @see app/Http/Controllers/SiteDomainController.php:33
 * @route '/sites/{site}/domains'
 */
        storeForm.post = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\SiteDomainController::verify
 * @see app/Http/Controllers/SiteDomainController.php:82
 * @route '/sites/{site}/domains/{domain}/verify'
 */
export const verify = (args: { site: string | { uuid: string }, domain: number | { id: number } } | [site: string | { uuid: string }, domain: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verify.url(args, options),
    method: 'post',
})

verify.definition = {
    methods: ["post"],
    url: '/sites/{site}/domains/{domain}/verify',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SiteDomainController::verify
 * @see app/Http/Controllers/SiteDomainController.php:82
 * @route '/sites/{site}/domains/{domain}/verify'
 */
verify.url = (args: { site: string | { uuid: string }, domain: number | { id: number } } | [site: string | { uuid: string }, domain: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    site: args[0],
                    domain: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        site: typeof args.site === 'object'
                ? args.site.uuid
                : args.site,
                                domain: typeof args.domain === 'object'
                ? args.domain.id
                : args.domain,
                }

    return verify.definition.url
            .replace('{site}', parsedArgs.site.toString())
            .replace('{domain}', parsedArgs.domain.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SiteDomainController::verify
 * @see app/Http/Controllers/SiteDomainController.php:82
 * @route '/sites/{site}/domains/{domain}/verify'
 */
verify.post = (args: { site: string | { uuid: string }, domain: number | { id: number } } | [site: string | { uuid: string }, domain: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verify.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SiteDomainController::verify
 * @see app/Http/Controllers/SiteDomainController.php:82
 * @route '/sites/{site}/domains/{domain}/verify'
 */
    const verifyForm = (args: { site: string | { uuid: string }, domain: number | { id: number } } | [site: string | { uuid: string }, domain: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: verify.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SiteDomainController::verify
 * @see app/Http/Controllers/SiteDomainController.php:82
 * @route '/sites/{site}/domains/{domain}/verify'
 */
        verifyForm.post = (args: { site: string | { uuid: string }, domain: number | { id: number } } | [site: string | { uuid: string }, domain: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: verify.url(args, options),
            method: 'post',
        })
    
    verify.form = verifyForm
/**
* @see \App\Http\Controllers\SiteDomainController::setPrimary
 * @see app/Http/Controllers/SiteDomainController.php:96
 * @route '/sites/{site}/domains/{domain}/set-primary'
 */
export const setPrimary = (args: { site: string | { uuid: string }, domain: number | { id: number } } | [site: string | { uuid: string }, domain: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: setPrimary.url(args, options),
    method: 'post',
})

setPrimary.definition = {
    methods: ["post"],
    url: '/sites/{site}/domains/{domain}/set-primary',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SiteDomainController::setPrimary
 * @see app/Http/Controllers/SiteDomainController.php:96
 * @route '/sites/{site}/domains/{domain}/set-primary'
 */
setPrimary.url = (args: { site: string | { uuid: string }, domain: number | { id: number } } | [site: string | { uuid: string }, domain: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    site: args[0],
                    domain: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        site: typeof args.site === 'object'
                ? args.site.uuid
                : args.site,
                                domain: typeof args.domain === 'object'
                ? args.domain.id
                : args.domain,
                }

    return setPrimary.definition.url
            .replace('{site}', parsedArgs.site.toString())
            .replace('{domain}', parsedArgs.domain.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SiteDomainController::setPrimary
 * @see app/Http/Controllers/SiteDomainController.php:96
 * @route '/sites/{site}/domains/{domain}/set-primary'
 */
setPrimary.post = (args: { site: string | { uuid: string }, domain: number | { id: number } } | [site: string | { uuid: string }, domain: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: setPrimary.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SiteDomainController::setPrimary
 * @see app/Http/Controllers/SiteDomainController.php:96
 * @route '/sites/{site}/domains/{domain}/set-primary'
 */
    const setPrimaryForm = (args: { site: string | { uuid: string }, domain: number | { id: number } } | [site: string | { uuid: string }, domain: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: setPrimary.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SiteDomainController::setPrimary
 * @see app/Http/Controllers/SiteDomainController.php:96
 * @route '/sites/{site}/domains/{domain}/set-primary'
 */
        setPrimaryForm.post = (args: { site: string | { uuid: string }, domain: number | { id: number } } | [site: string | { uuid: string }, domain: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: setPrimary.url(args, options),
            method: 'post',
        })
    
    setPrimary.form = setPrimaryForm
/**
* @see \App\Http\Controllers\SiteDomainController::destroy
 * @see app/Http/Controllers/SiteDomainController.php:113
 * @route '/sites/{site}/domains/{domain}'
 */
export const destroy = (args: { site: string | { uuid: string }, domain: number | { id: number } } | [site: string | { uuid: string }, domain: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/sites/{site}/domains/{domain}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\SiteDomainController::destroy
 * @see app/Http/Controllers/SiteDomainController.php:113
 * @route '/sites/{site}/domains/{domain}'
 */
destroy.url = (args: { site: string | { uuid: string }, domain: number | { id: number } } | [site: string | { uuid: string }, domain: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    site: args[0],
                    domain: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        site: typeof args.site === 'object'
                ? args.site.uuid
                : args.site,
                                domain: typeof args.domain === 'object'
                ? args.domain.id
                : args.domain,
                }

    return destroy.definition.url
            .replace('{site}', parsedArgs.site.toString())
            .replace('{domain}', parsedArgs.domain.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SiteDomainController::destroy
 * @see app/Http/Controllers/SiteDomainController.php:113
 * @route '/sites/{site}/domains/{domain}'
 */
destroy.delete = (args: { site: string | { uuid: string }, domain: number | { id: number } } | [site: string | { uuid: string }, domain: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\SiteDomainController::destroy
 * @see app/Http/Controllers/SiteDomainController.php:113
 * @route '/sites/{site}/domains/{domain}'
 */
    const destroyForm = (args: { site: string | { uuid: string }, domain: number | { id: number } } | [site: string | { uuid: string }, domain: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SiteDomainController::destroy
 * @see app/Http/Controllers/SiteDomainController.php:113
 * @route '/sites/{site}/domains/{domain}'
 */
        destroyForm.delete = (args: { site: string | { uuid: string }, domain: number | { id: number } } | [site: string | { uuid: string }, domain: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const SiteDomainController = { index, store, verify, setPrimary, destroy }

export default SiteDomainController