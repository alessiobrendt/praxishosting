import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\GamingAccountController::check
 * @see app/Http/Controllers/GamingAccountController.php:447
 * @route '/gaming-accounts/{game_server_account}/subdomain/check'
 */
export const check = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: check.url(args, options),
    method: 'get',
})

check.definition = {
    methods: ["get","head"],
    url: '/gaming-accounts/{game_server_account}/subdomain/check',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GamingAccountController::check
 * @see app/Http/Controllers/GamingAccountController.php:447
 * @route '/gaming-accounts/{game_server_account}/subdomain/check'
 */
check.url = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return check.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::check
 * @see app/Http/Controllers/GamingAccountController.php:447
 * @route '/gaming-accounts/{game_server_account}/subdomain/check'
 */
check.get = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: check.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GamingAccountController::check
 * @see app/Http/Controllers/GamingAccountController.php:447
 * @route '/gaming-accounts/{game_server_account}/subdomain/check'
 */
check.head = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: check.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::check
 * @see app/Http/Controllers/GamingAccountController.php:447
 * @route '/gaming-accounts/{game_server_account}/subdomain/check'
 */
    const checkForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: check.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::check
 * @see app/Http/Controllers/GamingAccountController.php:447
 * @route '/gaming-accounts/{game_server_account}/subdomain/check'
 */
        checkForm.get = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: check.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\GamingAccountController::check
 * @see app/Http/Controllers/GamingAccountController.php:447
 * @route '/gaming-accounts/{game_server_account}/subdomain/check'
 */
        checkForm.head = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: check.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    check.form = checkForm
/**
* @see \App\Http\Controllers\GamingAccountController::update
 * @see app/Http/Controllers/GamingAccountController.php:500
 * @route '/gaming-accounts/{game_server_account}/subdomain'
 */
export const update = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/gaming-accounts/{game_server_account}/subdomain',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\GamingAccountController::update
 * @see app/Http/Controllers/GamingAccountController.php:500
 * @route '/gaming-accounts/{game_server_account}/subdomain'
 */
update.url = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::update
 * @see app/Http/Controllers/GamingAccountController.php:500
 * @route '/gaming-accounts/{game_server_account}/subdomain'
 */
update.put = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::update
 * @see app/Http/Controllers/GamingAccountController.php:500
 * @route '/gaming-accounts/{game_server_account}/subdomain'
 */
    const updateForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::update
 * @see app/Http/Controllers/GamingAccountController.php:500
 * @route '/gaming-accounts/{game_server_account}/subdomain'
 */
        updateForm.put = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
const subdomain = {
    check: Object.assign(check, check),
update: Object.assign(update, update),
}

export default subdomain