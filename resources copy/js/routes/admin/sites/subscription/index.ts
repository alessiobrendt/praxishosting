import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\SiteController::update
 * @see app/Http/Controllers/Admin/SiteController.php:105
 * @route '/admin/sites/{site}/subscription'
 */
export const update = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/sites/{site}/subscription',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\SiteController::update
 * @see app/Http/Controllers/Admin/SiteController.php:105
 * @route '/admin/sites/{site}/subscription'
 */
update.url = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{site}', parsedArgs.site.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SiteController::update
 * @see app/Http/Controllers/Admin/SiteController.php:105
 * @route '/admin/sites/{site}/subscription'
 */
update.put = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\SiteController::update
 * @see app/Http/Controllers/Admin/SiteController.php:105
 * @route '/admin/sites/{site}/subscription'
 */
    const updateForm = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\SiteController::update
 * @see app/Http/Controllers/Admin/SiteController.php:105
 * @route '/admin/sites/{site}/subscription'
 */
        updateForm.put = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Admin\SiteController::cancel
 * @see app/Http/Controllers/Admin/SiteController.php:135
 * @route '/admin/sites/{site}/subscription/cancel'
 */
export const cancel = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

cancel.definition = {
    methods: ["post"],
    url: '/admin/sites/{site}/subscription/cancel',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\SiteController::cancel
 * @see app/Http/Controllers/Admin/SiteController.php:135
 * @route '/admin/sites/{site}/subscription/cancel'
 */
cancel.url = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return cancel.definition.url
            .replace('{site}', parsedArgs.site.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SiteController::cancel
 * @see app/Http/Controllers/Admin/SiteController.php:135
 * @route '/admin/sites/{site}/subscription/cancel'
 */
cancel.post = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\SiteController::cancel
 * @see app/Http/Controllers/Admin/SiteController.php:135
 * @route '/admin/sites/{site}/subscription/cancel'
 */
    const cancelForm = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cancel.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\SiteController::cancel
 * @see app/Http/Controllers/Admin/SiteController.php:135
 * @route '/admin/sites/{site}/subscription/cancel'
 */
        cancelForm.post = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cancel.url(args, options),
            method: 'post',
        })
    
    cancel.form = cancelForm
/**
* @see \App\Http\Controllers\Admin\SiteController::reactivate
 * @see app/Http/Controllers/Admin/SiteController.php:177
 * @route '/admin/sites/{site}/subscription/reactivate'
 */
export const reactivate = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reactivate.url(args, options),
    method: 'post',
})

reactivate.definition = {
    methods: ["post"],
    url: '/admin/sites/{site}/subscription/reactivate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\SiteController::reactivate
 * @see app/Http/Controllers/Admin/SiteController.php:177
 * @route '/admin/sites/{site}/subscription/reactivate'
 */
reactivate.url = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return reactivate.definition.url
            .replace('{site}', parsedArgs.site.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SiteController::reactivate
 * @see app/Http/Controllers/Admin/SiteController.php:177
 * @route '/admin/sites/{site}/subscription/reactivate'
 */
reactivate.post = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reactivate.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\SiteController::reactivate
 * @see app/Http/Controllers/Admin/SiteController.php:177
 * @route '/admin/sites/{site}/subscription/reactivate'
 */
    const reactivateForm = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reactivate.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\SiteController::reactivate
 * @see app/Http/Controllers/Admin/SiteController.php:177
 * @route '/admin/sites/{site}/subscription/reactivate'
 */
        reactivateForm.post = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reactivate.url(args, options),
            method: 'post',
        })
    
    reactivate.form = reactivateForm
/**
* @see \App\Http\Controllers\Admin\SiteController::sync
 * @see app/Http/Controllers/Admin/SiteController.php:224
 * @route '/admin/sites/{site}/subscription/sync'
 */
export const sync = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sync.url(args, options),
    method: 'post',
})

sync.definition = {
    methods: ["post"],
    url: '/admin/sites/{site}/subscription/sync',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\SiteController::sync
 * @see app/Http/Controllers/Admin/SiteController.php:224
 * @route '/admin/sites/{site}/subscription/sync'
 */
sync.url = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return sync.definition.url
            .replace('{site}', parsedArgs.site.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SiteController::sync
 * @see app/Http/Controllers/Admin/SiteController.php:224
 * @route '/admin/sites/{site}/subscription/sync'
 */
sync.post = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sync.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\SiteController::sync
 * @see app/Http/Controllers/Admin/SiteController.php:224
 * @route '/admin/sites/{site}/subscription/sync'
 */
    const syncForm = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: sync.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\SiteController::sync
 * @see app/Http/Controllers/Admin/SiteController.php:224
 * @route '/admin/sites/{site}/subscription/sync'
 */
        syncForm.post = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: sync.url(args, options),
            method: 'post',
        })
    
    sync.form = syncForm
const subscription = {
    update: Object.assign(update, update),
cancel: Object.assign(cancel, cancel),
reactivate: Object.assign(reactivate, reactivate),
sync: Object.assign(sync, sync),
}

export default subscription