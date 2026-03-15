import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
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
/**
* @see \App\Http\Controllers\Admin\SiteController::updateStatus
 * @see app/Http/Controllers/Admin/SiteController.php:82
 * @route '/admin/sites/{site}/status'
 */
export const updateStatus = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateStatus.url(args, options),
    method: 'put',
})

updateStatus.definition = {
    methods: ["put"],
    url: '/admin/sites/{site}/status',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\SiteController::updateStatus
 * @see app/Http/Controllers/Admin/SiteController.php:82
 * @route '/admin/sites/{site}/status'
 */
updateStatus.url = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return updateStatus.definition.url
            .replace('{site}', parsedArgs.site.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SiteController::updateStatus
 * @see app/Http/Controllers/Admin/SiteController.php:82
 * @route '/admin/sites/{site}/status'
 */
updateStatus.put = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateStatus.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\SiteController::updateStatus
 * @see app/Http/Controllers/Admin/SiteController.php:82
 * @route '/admin/sites/{site}/status'
 */
    const updateStatusForm = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateStatus.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\SiteController::updateStatus
 * @see app/Http/Controllers/Admin/SiteController.php:82
 * @route '/admin/sites/{site}/status'
 */
        updateStatusForm.put = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateStatus.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateStatus.form = updateStatusForm
/**
* @see \App\Http\Controllers\Admin\SiteController::updateSubscription
 * @see app/Http/Controllers/Admin/SiteController.php:105
 * @route '/admin/sites/{site}/subscription'
 */
export const updateSubscription = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateSubscription.url(args, options),
    method: 'put',
})

updateSubscription.definition = {
    methods: ["put"],
    url: '/admin/sites/{site}/subscription',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\SiteController::updateSubscription
 * @see app/Http/Controllers/Admin/SiteController.php:105
 * @route '/admin/sites/{site}/subscription'
 */
updateSubscription.url = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return updateSubscription.definition.url
            .replace('{site}', parsedArgs.site.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SiteController::updateSubscription
 * @see app/Http/Controllers/Admin/SiteController.php:105
 * @route '/admin/sites/{site}/subscription'
 */
updateSubscription.put = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateSubscription.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\SiteController::updateSubscription
 * @see app/Http/Controllers/Admin/SiteController.php:105
 * @route '/admin/sites/{site}/subscription'
 */
    const updateSubscriptionForm = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateSubscription.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\SiteController::updateSubscription
 * @see app/Http/Controllers/Admin/SiteController.php:105
 * @route '/admin/sites/{site}/subscription'
 */
        updateSubscriptionForm.put = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateSubscription.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateSubscription.form = updateSubscriptionForm
/**
* @see \App\Http\Controllers\Admin\SiteController::cancelSubscription
 * @see app/Http/Controllers/Admin/SiteController.php:135
 * @route '/admin/sites/{site}/subscription/cancel'
 */
export const cancelSubscription = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancelSubscription.url(args, options),
    method: 'post',
})

cancelSubscription.definition = {
    methods: ["post"],
    url: '/admin/sites/{site}/subscription/cancel',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\SiteController::cancelSubscription
 * @see app/Http/Controllers/Admin/SiteController.php:135
 * @route '/admin/sites/{site}/subscription/cancel'
 */
cancelSubscription.url = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return cancelSubscription.definition.url
            .replace('{site}', parsedArgs.site.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SiteController::cancelSubscription
 * @see app/Http/Controllers/Admin/SiteController.php:135
 * @route '/admin/sites/{site}/subscription/cancel'
 */
cancelSubscription.post = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancelSubscription.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\SiteController::cancelSubscription
 * @see app/Http/Controllers/Admin/SiteController.php:135
 * @route '/admin/sites/{site}/subscription/cancel'
 */
    const cancelSubscriptionForm = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cancelSubscription.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\SiteController::cancelSubscription
 * @see app/Http/Controllers/Admin/SiteController.php:135
 * @route '/admin/sites/{site}/subscription/cancel'
 */
        cancelSubscriptionForm.post = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cancelSubscription.url(args, options),
            method: 'post',
        })
    
    cancelSubscription.form = cancelSubscriptionForm
/**
* @see \App\Http\Controllers\Admin\SiteController::reactivateSubscription
 * @see app/Http/Controllers/Admin/SiteController.php:177
 * @route '/admin/sites/{site}/subscription/reactivate'
 */
export const reactivateSubscription = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reactivateSubscription.url(args, options),
    method: 'post',
})

reactivateSubscription.definition = {
    methods: ["post"],
    url: '/admin/sites/{site}/subscription/reactivate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\SiteController::reactivateSubscription
 * @see app/Http/Controllers/Admin/SiteController.php:177
 * @route '/admin/sites/{site}/subscription/reactivate'
 */
reactivateSubscription.url = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return reactivateSubscription.definition.url
            .replace('{site}', parsedArgs.site.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SiteController::reactivateSubscription
 * @see app/Http/Controllers/Admin/SiteController.php:177
 * @route '/admin/sites/{site}/subscription/reactivate'
 */
reactivateSubscription.post = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reactivateSubscription.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\SiteController::reactivateSubscription
 * @see app/Http/Controllers/Admin/SiteController.php:177
 * @route '/admin/sites/{site}/subscription/reactivate'
 */
    const reactivateSubscriptionForm = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reactivateSubscription.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\SiteController::reactivateSubscription
 * @see app/Http/Controllers/Admin/SiteController.php:177
 * @route '/admin/sites/{site}/subscription/reactivate'
 */
        reactivateSubscriptionForm.post = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reactivateSubscription.url(args, options),
            method: 'post',
        })
    
    reactivateSubscription.form = reactivateSubscriptionForm
/**
* @see \App\Http\Controllers\Admin\SiteController::syncSubscription
 * @see app/Http/Controllers/Admin/SiteController.php:224
 * @route '/admin/sites/{site}/subscription/sync'
 */
export const syncSubscription = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: syncSubscription.url(args, options),
    method: 'post',
})

syncSubscription.definition = {
    methods: ["post"],
    url: '/admin/sites/{site}/subscription/sync',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\SiteController::syncSubscription
 * @see app/Http/Controllers/Admin/SiteController.php:224
 * @route '/admin/sites/{site}/subscription/sync'
 */
syncSubscription.url = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return syncSubscription.definition.url
            .replace('{site}', parsedArgs.site.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SiteController::syncSubscription
 * @see app/Http/Controllers/Admin/SiteController.php:224
 * @route '/admin/sites/{site}/subscription/sync'
 */
syncSubscription.post = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: syncSubscription.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\SiteController::syncSubscription
 * @see app/Http/Controllers/Admin/SiteController.php:224
 * @route '/admin/sites/{site}/subscription/sync'
 */
    const syncSubscriptionForm = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: syncSubscription.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\SiteController::syncSubscription
 * @see app/Http/Controllers/Admin/SiteController.php:224
 * @route '/admin/sites/{site}/subscription/sync'
 */
        syncSubscriptionForm.post = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: syncSubscription.url(args, options),
            method: 'post',
        })
    
    syncSubscription.form = syncSubscriptionForm
const SiteController = { index, show, updateStatus, updateSubscription, cancelSubscription, reactivateSubscription, syncSubscription }

export default SiteController