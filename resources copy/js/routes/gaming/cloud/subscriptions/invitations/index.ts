import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\ProductShareController::destroy
 * @see app/Http/Controllers/ProductShareController.php:292
 * @route '/gaming/cloud/subscriptions/{subscription}/invitations/{invitation}'
 */
export const destroy = (args: { subscription: string | { uuid: string }, invitation: number | { id: number } } | [subscription: string | { uuid: string }, invitation: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/gaming/cloud/subscriptions/{subscription}/invitations/{invitation}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ProductShareController::destroy
 * @see app/Http/Controllers/ProductShareController.php:292
 * @route '/gaming/cloud/subscriptions/{subscription}/invitations/{invitation}'
 */
destroy.url = (args: { subscription: string | { uuid: string }, invitation: number | { id: number } } | [subscription: string | { uuid: string }, invitation: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    subscription: args[0],
                    invitation: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        subscription: typeof args.subscription === 'object'
                ? args.subscription.uuid
                : args.subscription,
                                invitation: typeof args.invitation === 'object'
                ? args.invitation.id
                : args.invitation,
                }

    return destroy.definition.url
            .replace('{subscription}', parsedArgs.subscription.toString())
            .replace('{invitation}', parsedArgs.invitation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductShareController::destroy
 * @see app/Http/Controllers/ProductShareController.php:292
 * @route '/gaming/cloud/subscriptions/{subscription}/invitations/{invitation}'
 */
destroy.delete = (args: { subscription: string | { uuid: string }, invitation: number | { id: number } } | [subscription: string | { uuid: string }, invitation: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ProductShareController::destroy
 * @see app/Http/Controllers/ProductShareController.php:292
 * @route '/gaming/cloud/subscriptions/{subscription}/invitations/{invitation}'
 */
    const destroyForm = (args: { subscription: string | { uuid: string }, invitation: number | { id: number } } | [subscription: string | { uuid: string }, invitation: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/ProductShareController.php:292
 * @route '/gaming/cloud/subscriptions/{subscription}/invitations/{invitation}'
 */
        destroyForm.delete = (args: { subscription: string | { uuid: string }, invitation: number | { id: number } } | [subscription: string | { uuid: string }, invitation: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const invitations = {
    destroy: Object.assign(destroy, destroy),
}

export default invitations