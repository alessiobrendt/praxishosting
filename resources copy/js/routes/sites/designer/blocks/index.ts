import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\SiteDesignerController::update
 * @see app/Http/Controllers/SiteDesignerController.php:120
 * @route '/sites/{site}/designer/blocks/{blockId}'
 */
export const update = (args: { site: string | { uuid: string }, blockId: string | number } | [site: string | { uuid: string }, blockId: string | number ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/sites/{site}/designer/blocks/{blockId}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\SiteDesignerController::update
 * @see app/Http/Controllers/SiteDesignerController.php:120
 * @route '/sites/{site}/designer/blocks/{blockId}'
 */
update.url = (args: { site: string | { uuid: string }, blockId: string | number } | [site: string | { uuid: string }, blockId: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    site: args[0],
                    blockId: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        site: typeof args.site === 'object'
                ? args.site.uuid
                : args.site,
                                blockId: args.blockId,
                }

    return update.definition.url
            .replace('{site}', parsedArgs.site.toString())
            .replace('{blockId}', parsedArgs.blockId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SiteDesignerController::update
 * @see app/Http/Controllers/SiteDesignerController.php:120
 * @route '/sites/{site}/designer/blocks/{blockId}'
 */
update.patch = (args: { site: string | { uuid: string }, blockId: string | number } | [site: string | { uuid: string }, blockId: string | number ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\SiteDesignerController::update
 * @see app/Http/Controllers/SiteDesignerController.php:120
 * @route '/sites/{site}/designer/blocks/{blockId}'
 */
    const updateForm = (args: { site: string | { uuid: string }, blockId: string | number } | [site: string | { uuid: string }, blockId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SiteDesignerController::update
 * @see app/Http/Controllers/SiteDesignerController.php:120
 * @route '/sites/{site}/designer/blocks/{blockId}'
 */
        updateForm.patch = (args: { site: string | { uuid: string }, blockId: string | number } | [site: string | { uuid: string }, blockId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\SiteDesignerController::store
 * @see app/Http/Controllers/SiteDesignerController.php:150
 * @route '/sites/{site}/designer/blocks'
 */
export const store = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/sites/{site}/designer/blocks',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SiteDesignerController::store
 * @see app/Http/Controllers/SiteDesignerController.php:150
 * @route '/sites/{site}/designer/blocks'
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
* @see \App\Http\Controllers\SiteDesignerController::store
 * @see app/Http/Controllers/SiteDesignerController.php:150
 * @route '/sites/{site}/designer/blocks'
 */
store.post = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SiteDesignerController::store
 * @see app/Http/Controllers/SiteDesignerController.php:150
 * @route '/sites/{site}/designer/blocks'
 */
    const storeForm = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SiteDesignerController::store
 * @see app/Http/Controllers/SiteDesignerController.php:150
 * @route '/sites/{site}/designer/blocks'
 */
        storeForm.post = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\SiteDesignerController::destroy
 * @see app/Http/Controllers/SiteDesignerController.php:193
 * @route '/sites/{site}/designer/blocks/{blockId}'
 */
export const destroy = (args: { site: string | { uuid: string }, blockId: string | number } | [site: string | { uuid: string }, blockId: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/sites/{site}/designer/blocks/{blockId}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\SiteDesignerController::destroy
 * @see app/Http/Controllers/SiteDesignerController.php:193
 * @route '/sites/{site}/designer/blocks/{blockId}'
 */
destroy.url = (args: { site: string | { uuid: string }, blockId: string | number } | [site: string | { uuid: string }, blockId: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    site: args[0],
                    blockId: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        site: typeof args.site === 'object'
                ? args.site.uuid
                : args.site,
                                blockId: args.blockId,
                }

    return destroy.definition.url
            .replace('{site}', parsedArgs.site.toString())
            .replace('{blockId}', parsedArgs.blockId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SiteDesignerController::destroy
 * @see app/Http/Controllers/SiteDesignerController.php:193
 * @route '/sites/{site}/designer/blocks/{blockId}'
 */
destroy.delete = (args: { site: string | { uuid: string }, blockId: string | number } | [site: string | { uuid: string }, blockId: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\SiteDesignerController::destroy
 * @see app/Http/Controllers/SiteDesignerController.php:193
 * @route '/sites/{site}/designer/blocks/{blockId}'
 */
    const destroyForm = (args: { site: string | { uuid: string }, blockId: string | number } | [site: string | { uuid: string }, blockId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SiteDesignerController::destroy
 * @see app/Http/Controllers/SiteDesignerController.php:193
 * @route '/sites/{site}/designer/blocks/{blockId}'
 */
        destroyForm.delete = (args: { site: string | { uuid: string }, blockId: string | number } | [site: string | { uuid: string }, blockId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const blocks = {
    update: Object.assign(update, update),
store: Object.assign(store, store),
destroy: Object.assign(destroy, destroy),
}

export default blocks