import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
import invitations from './invitations'
/**
* @see \App\Http\Controllers\ProductShareController::update
 * @see app/Http/Controllers/ProductShareController.php:194
 * @route '/gaming/cloud/subscriptions/{subscription}/shares/{share}'
 */
export const update = (args: { subscription: string | { uuid: string }, share: number | { id: number } } | [subscription: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/gaming/cloud/subscriptions/{subscription}/shares/{share}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\ProductShareController::update
 * @see app/Http/Controllers/ProductShareController.php:194
 * @route '/gaming/cloud/subscriptions/{subscription}/shares/{share}'
 */
update.url = (args: { subscription: string | { uuid: string }, share: number | { id: number } } | [subscription: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    subscription: args[0],
                    share: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        subscription: typeof args.subscription === 'object'
                ? args.subscription.uuid
                : args.subscription,
                                share: typeof args.share === 'object'
                ? args.share.id
                : args.share,
                }

    return update.definition.url
            .replace('{subscription}', parsedArgs.subscription.toString())
            .replace('{share}', parsedArgs.share.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductShareController::update
 * @see app/Http/Controllers/ProductShareController.php:194
 * @route '/gaming/cloud/subscriptions/{subscription}/shares/{share}'
 */
update.patch = (args: { subscription: string | { uuid: string }, share: number | { id: number } } | [subscription: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ProductShareController::update
 * @see app/Http/Controllers/ProductShareController.php:194
 * @route '/gaming/cloud/subscriptions/{subscription}/shares/{share}'
 */
    const updateForm = (args: { subscription: string | { uuid: string }, share: number | { id: number } } | [subscription: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/ProductShareController.php:194
 * @route '/gaming/cloud/subscriptions/{subscription}/shares/{share}'
 */
        updateForm.patch = (args: { subscription: string | { uuid: string }, share: number | { id: number } } | [subscription: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/ProductShareController.php:243
 * @route '/gaming/cloud/subscriptions/{subscription}/shares/{share}'
 */
export const destroy = (args: { subscription: string | { uuid: string }, share: number | { id: number } } | [subscription: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/gaming/cloud/subscriptions/{subscription}/shares/{share}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ProductShareController::destroy
 * @see app/Http/Controllers/ProductShareController.php:243
 * @route '/gaming/cloud/subscriptions/{subscription}/shares/{share}'
 */
destroy.url = (args: { subscription: string | { uuid: string }, share: number | { id: number } } | [subscription: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    subscription: args[0],
                    share: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        subscription: typeof args.subscription === 'object'
                ? args.subscription.uuid
                : args.subscription,
                                share: typeof args.share === 'object'
                ? args.share.id
                : args.share,
                }

    return destroy.definition.url
            .replace('{subscription}', parsedArgs.subscription.toString())
            .replace('{share}', parsedArgs.share.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductShareController::destroy
 * @see app/Http/Controllers/ProductShareController.php:243
 * @route '/gaming/cloud/subscriptions/{subscription}/shares/{share}'
 */
destroy.delete = (args: { subscription: string | { uuid: string }, share: number | { id: number } } | [subscription: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ProductShareController::destroy
 * @see app/Http/Controllers/ProductShareController.php:243
 * @route '/gaming/cloud/subscriptions/{subscription}/shares/{share}'
 */
    const destroyForm = (args: { subscription: string | { uuid: string }, share: number | { id: number } } | [subscription: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/ProductShareController.php:243
 * @route '/gaming/cloud/subscriptions/{subscription}/shares/{share}'
 */
        destroyForm.delete = (args: { subscription: string | { uuid: string }, share: number | { id: number } } | [subscription: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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