import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\GamingAccountController::show
 * @see app/Http/Controllers/GamingAccountController.php:290
 * @route '/gaming-accounts/{game_server_account}/connect-domain'
 */
export const show = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/gaming-accounts/{game_server_account}/connect-domain',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GamingAccountController::show
 * @see app/Http/Controllers/GamingAccountController.php:290
 * @route '/gaming-accounts/{game_server_account}/connect-domain'
 */
show.url = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { game_server_account: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    game_server_account: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        game_server_account: args.game_server_account,
                }

    return show.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::show
 * @see app/Http/Controllers/GamingAccountController.php:290
 * @route '/gaming-accounts/{game_server_account}/connect-domain'
 */
show.get = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GamingAccountController::show
 * @see app/Http/Controllers/GamingAccountController.php:290
 * @route '/gaming-accounts/{game_server_account}/connect-domain'
 */
show.head = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::show
 * @see app/Http/Controllers/GamingAccountController.php:290
 * @route '/gaming-accounts/{game_server_account}/connect-domain'
 */
    const showForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::show
 * @see app/Http/Controllers/GamingAccountController.php:290
 * @route '/gaming-accounts/{game_server_account}/connect-domain'
 */
        showForm.get = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\GamingAccountController::show
 * @see app/Http/Controllers/GamingAccountController.php:290
 * @route '/gaming-accounts/{game_server_account}/connect-domain'
 */
        showForm.head = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\GamingAccountController::store
 * @see app/Http/Controllers/GamingAccountController.php:354
 * @route '/gaming-accounts/{game_server_account}/connect-domain'
 */
export const store = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/gaming-accounts/{game_server_account}/connect-domain',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GamingAccountController::store
 * @see app/Http/Controllers/GamingAccountController.php:354
 * @route '/gaming-accounts/{game_server_account}/connect-domain'
 */
store.url = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { game_server_account: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    game_server_account: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        game_server_account: args.game_server_account,
                }

    return store.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::store
 * @see app/Http/Controllers/GamingAccountController.php:354
 * @route '/gaming-accounts/{game_server_account}/connect-domain'
 */
store.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::store
 * @see app/Http/Controllers/GamingAccountController.php:354
 * @route '/gaming-accounts/{game_server_account}/connect-domain'
 */
    const storeForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::store
 * @see app/Http/Controllers/GamingAccountController.php:354
 * @route '/gaming-accounts/{game_server_account}/connect-domain'
 */
        storeForm.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
const connectDomain = {
    show: Object.assign(show, show),
store: Object.assign(store, store),
}

export default connectDomain