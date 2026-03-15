import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ProductShareController::store
 * @see app/Http/Controllers/ProductShareController.php:119
 * @route '/webspace-accounts/{webspace_account}/shares/invitations'
 */
export const store = (args: { webspace_account: string | { uuid: string } } | [webspace_account: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/webspace-accounts/{webspace_account}/shares/invitations',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProductShareController::store
 * @see app/Http/Controllers/ProductShareController.php:119
 * @route '/webspace-accounts/{webspace_account}/shares/invitations'
 */
store.url = (args: { webspace_account: string | { uuid: string } } | [webspace_account: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { webspace_account: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { webspace_account: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    webspace_account: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        webspace_account: typeof args.webspace_account === 'object'
                ? args.webspace_account.uuid
                : args.webspace_account,
                }

    return store.definition.url
            .replace('{webspace_account}', parsedArgs.webspace_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductShareController::store
 * @see app/Http/Controllers/ProductShareController.php:119
 * @route '/webspace-accounts/{webspace_account}/shares/invitations'
 */
store.post = (args: { webspace_account: string | { uuid: string } } | [webspace_account: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ProductShareController::store
 * @see app/Http/Controllers/ProductShareController.php:119
 * @route '/webspace-accounts/{webspace_account}/shares/invitations'
 */
    const storeForm = (args: { webspace_account: string | { uuid: string } } | [webspace_account: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProductShareController::store
 * @see app/Http/Controllers/ProductShareController.php:119
 * @route '/webspace-accounts/{webspace_account}/shares/invitations'
 */
        storeForm.post = (args: { webspace_account: string | { uuid: string } } | [webspace_account: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
const invitations = {
    store: Object.assign(store, store),
}

export default invitations