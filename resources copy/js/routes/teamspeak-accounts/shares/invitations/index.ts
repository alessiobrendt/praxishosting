import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ProductShareController::store
 * @see app/Http/Controllers/ProductShareController.php:129
 * @route '/teamspeak-accounts/{team_speak_server_account}/shares/invitations'
 */
export const store = (args: { team_speak_server_account: string | { uuid: string } } | [team_speak_server_account: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/teamspeak-accounts/{team_speak_server_account}/shares/invitations',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProductShareController::store
 * @see app/Http/Controllers/ProductShareController.php:129
 * @route '/teamspeak-accounts/{team_speak_server_account}/shares/invitations'
 */
store.url = (args: { team_speak_server_account: string | { uuid: string } } | [team_speak_server_account: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { team_speak_server_account: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { team_speak_server_account: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    team_speak_server_account: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        team_speak_server_account: typeof args.team_speak_server_account === 'object'
                ? args.team_speak_server_account.uuid
                : args.team_speak_server_account,
                }

    return store.definition.url
            .replace('{team_speak_server_account}', parsedArgs.team_speak_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductShareController::store
 * @see app/Http/Controllers/ProductShareController.php:129
 * @route '/teamspeak-accounts/{team_speak_server_account}/shares/invitations'
 */
store.post = (args: { team_speak_server_account: string | { uuid: string } } | [team_speak_server_account: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ProductShareController::store
 * @see app/Http/Controllers/ProductShareController.php:129
 * @route '/teamspeak-accounts/{team_speak_server_account}/shares/invitations'
 */
    const storeForm = (args: { team_speak_server_account: string | { uuid: string } } | [team_speak_server_account: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProductShareController::store
 * @see app/Http/Controllers/ProductShareController.php:129
 * @route '/teamspeak-accounts/{team_speak_server_account}/shares/invitations'
 */
        storeForm.post = (args: { team_speak_server_account: string | { uuid: string } } | [team_speak_server_account: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
const invitations = {
    store: Object.assign(store, store),
}

export default invitations