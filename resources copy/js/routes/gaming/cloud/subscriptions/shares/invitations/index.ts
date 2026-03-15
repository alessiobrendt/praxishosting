import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\ProductShareController::store
 * @see app/Http/Controllers/ProductShareController.php:134
 * @route '/gaming/cloud/subscriptions/{subscription}/shares/invitations'
 */
export const store = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/gaming/cloud/subscriptions/{subscription}/shares/invitations',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProductShareController::store
 * @see app/Http/Controllers/ProductShareController.php:134
 * @route '/gaming/cloud/subscriptions/{subscription}/shares/invitations'
 */
store.url = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { subscription: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { subscription: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    subscription: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        subscription: typeof args.subscription === 'object'
                ? args.subscription.uuid
                : args.subscription,
                }

    return store.definition.url
            .replace('{subscription}', parsedArgs.subscription.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductShareController::store
 * @see app/Http/Controllers/ProductShareController.php:134
 * @route '/gaming/cloud/subscriptions/{subscription}/shares/invitations'
 */
store.post = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ProductShareController::store
 * @see app/Http/Controllers/ProductShareController.php:134
 * @route '/gaming/cloud/subscriptions/{subscription}/shares/invitations'
 */
    const storeForm = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProductShareController::store
 * @see app/Http/Controllers/ProductShareController.php:134
 * @route '/gaming/cloud/subscriptions/{subscription}/shares/invitations'
 */
        storeForm.post = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
const invitations = {
    store: Object.assign(store, store),
}

export default invitations