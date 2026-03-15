import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
import invitations from './invitations'
/**
* @see \App\Http\Controllers\ProductShareController::update
 * @see app/Http/Controllers/ProductShareController.php:199
 * @route '/domains/{reseller_domain}/shares/{share}'
 */
export const update = (args: { reseller_domain: string | { uuid: string }, share: number | { id: number } } | [reseller_domain: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/domains/{reseller_domain}/shares/{share}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\ProductShareController::update
 * @see app/Http/Controllers/ProductShareController.php:199
 * @route '/domains/{reseller_domain}/shares/{share}'
 */
update.url = (args: { reseller_domain: string | { uuid: string }, share: number | { id: number } } | [reseller_domain: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    reseller_domain: args[0],
                    share: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reseller_domain: typeof args.reseller_domain === 'object'
                ? args.reseller_domain.uuid
                : args.reseller_domain,
                                share: typeof args.share === 'object'
                ? args.share.id
                : args.share,
                }

    return update.definition.url
            .replace('{reseller_domain}', parsedArgs.reseller_domain.toString())
            .replace('{share}', parsedArgs.share.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductShareController::update
 * @see app/Http/Controllers/ProductShareController.php:199
 * @route '/domains/{reseller_domain}/shares/{share}'
 */
update.patch = (args: { reseller_domain: string | { uuid: string }, share: number | { id: number } } | [reseller_domain: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ProductShareController::update
 * @see app/Http/Controllers/ProductShareController.php:199
 * @route '/domains/{reseller_domain}/shares/{share}'
 */
    const updateForm = (args: { reseller_domain: string | { uuid: string }, share: number | { id: number } } | [reseller_domain: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProductShareController::update
 * @see app/Http/Controllers/ProductShareController.php:199
 * @route '/domains/{reseller_domain}/shares/{share}'
 */
        updateForm.patch = (args: { reseller_domain: string | { uuid: string }, share: number | { id: number } } | [reseller_domain: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\ProductShareController::destroy
 * @see app/Http/Controllers/ProductShareController.php:248
 * @route '/domains/{reseller_domain}/shares/{share}'
 */
export const destroy = (args: { reseller_domain: string | { uuid: string }, share: number | { id: number } } | [reseller_domain: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/domains/{reseller_domain}/shares/{share}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ProductShareController::destroy
 * @see app/Http/Controllers/ProductShareController.php:248
 * @route '/domains/{reseller_domain}/shares/{share}'
 */
destroy.url = (args: { reseller_domain: string | { uuid: string }, share: number | { id: number } } | [reseller_domain: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    reseller_domain: args[0],
                    share: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reseller_domain: typeof args.reseller_domain === 'object'
                ? args.reseller_domain.uuid
                : args.reseller_domain,
                                share: typeof args.share === 'object'
                ? args.share.id
                : args.share,
                }

    return destroy.definition.url
            .replace('{reseller_domain}', parsedArgs.reseller_domain.toString())
            .replace('{share}', parsedArgs.share.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductShareController::destroy
 * @see app/Http/Controllers/ProductShareController.php:248
 * @route '/domains/{reseller_domain}/shares/{share}'
 */
destroy.delete = (args: { reseller_domain: string | { uuid: string }, share: number | { id: number } } | [reseller_domain: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ProductShareController::destroy
 * @see app/Http/Controllers/ProductShareController.php:248
 * @route '/domains/{reseller_domain}/shares/{share}'
 */
    const destroyForm = (args: { reseller_domain: string | { uuid: string }, share: number | { id: number } } | [reseller_domain: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProductShareController::destroy
 * @see app/Http/Controllers/ProductShareController.php:248
 * @route '/domains/{reseller_domain}/shares/{share}'
 */
        destroyForm.delete = (args: { reseller_domain: string | { uuid: string }, share: number | { id: number } } | [reseller_domain: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const shares = {
    invitations: Object.assign(invitations, invitations),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default shares