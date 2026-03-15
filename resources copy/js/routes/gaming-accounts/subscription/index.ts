import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\GamingAccountController::cancel
 * @see app/Http/Controllers/GamingAccountController.php:1524
 * @route '/gaming-accounts/{game_server_account}/subscription/cancel'
 */
export const cancel = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

cancel.definition = {
    methods: ["post"],
    url: '/gaming-accounts/{game_server_account}/subscription/cancel',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GamingAccountController::cancel
 * @see app/Http/Controllers/GamingAccountController.php:1524
 * @route '/gaming-accounts/{game_server_account}/subscription/cancel'
 */
cancel.url = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return cancel.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::cancel
 * @see app/Http/Controllers/GamingAccountController.php:1524
 * @route '/gaming-accounts/{game_server_account}/subscription/cancel'
 */
cancel.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::cancel
 * @see app/Http/Controllers/GamingAccountController.php:1524
 * @route '/gaming-accounts/{game_server_account}/subscription/cancel'
 */
    const cancelForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cancel.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::cancel
 * @see app/Http/Controllers/GamingAccountController.php:1524
 * @route '/gaming-accounts/{game_server_account}/subscription/cancel'
 */
        cancelForm.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cancel.url(args, options),
            method: 'post',
        })
    
    cancel.form = cancelForm
const subscription = {
    cancel: Object.assign(cancel, cancel),
}

export default subscription