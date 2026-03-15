import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ProductShareController::store
 * @see app/Http/Controllers/ProductShareController.php:124
 * @route '/gaming-accounts/{game_server_account}/shares/invitations'
 */
export const store = (args: { game_server_account: string | { uuid: string } } | [game_server_account: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/gaming-accounts/{game_server_account}/shares/invitations',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProductShareController::store
 * @see app/Http/Controllers/ProductShareController.php:124
 * @route '/gaming-accounts/{game_server_account}/shares/invitations'
 */
store.url = (args: { game_server_account: string | { uuid: string } } | [game_server_account: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { game_server_account: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { game_server_account: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    game_server_account: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        game_server_account: typeof args.game_server_account === 'object'
                ? args.game_server_account.uuid
                : args.game_server_account,
                }

    return store.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductShareController::store
 * @see app/Http/Controllers/ProductShareController.php:124
 * @route '/gaming-accounts/{game_server_account}/shares/invitations'
 */
store.post = (args: { game_server_account: string | { uuid: string } } | [game_server_account: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ProductShareController::store
 * @see app/Http/Controllers/ProductShareController.php:124
 * @route '/gaming-accounts/{game_server_account}/shares/invitations'
 */
    const storeForm = (args: { game_server_account: string | { uuid: string } } | [game_server_account: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProductShareController::store
 * @see app/Http/Controllers/ProductShareController.php:124
 * @route '/gaming-accounts/{game_server_account}/shares/invitations'
 */
        storeForm.post = (args: { game_server_account: string | { uuid: string } } | [game_server_account: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
const invitations = {
    store: Object.assign(store, store),
}

export default invitations