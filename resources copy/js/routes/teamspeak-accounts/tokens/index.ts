import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\TeamSpeakAccountController::store
 * @see app/Http/Controllers/TeamSpeakAccountController.php:528
 * @route '/teamspeak-accounts/{team_speak_server_account}/tokens'
 */
export const store = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/teamspeak-accounts/{team_speak_server_account}/tokens',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TeamSpeakAccountController::store
 * @see app/Http/Controllers/TeamSpeakAccountController.php:528
 * @route '/teamspeak-accounts/{team_speak_server_account}/tokens'
 */
store.url = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { team_speak_server_account: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    team_speak_server_account: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        team_speak_server_account: args.team_speak_server_account,
                }

    return store.definition.url
            .replace('{team_speak_server_account}', parsedArgs.team_speak_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TeamSpeakAccountController::store
 * @see app/Http/Controllers/TeamSpeakAccountController.php:528
 * @route '/teamspeak-accounts/{team_speak_server_account}/tokens'
 */
store.post = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TeamSpeakAccountController::store
 * @see app/Http/Controllers/TeamSpeakAccountController.php:528
 * @route '/teamspeak-accounts/{team_speak_server_account}/tokens'
 */
    const storeForm = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TeamSpeakAccountController::store
 * @see app/Http/Controllers/TeamSpeakAccountController.php:528
 * @route '/teamspeak-accounts/{team_speak_server_account}/tokens'
 */
        storeForm.post = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\TeamSpeakAccountController::destroy
 * @see app/Http/Controllers/TeamSpeakAccountController.php:559
 * @route '/teamspeak-accounts/{team_speak_server_account}/tokens/delete'
 */
export const destroy = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: destroy.url(args, options),
    method: 'post',
})

destroy.definition = {
    methods: ["post"],
    url: '/teamspeak-accounts/{team_speak_server_account}/tokens/delete',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TeamSpeakAccountController::destroy
 * @see app/Http/Controllers/TeamSpeakAccountController.php:559
 * @route '/teamspeak-accounts/{team_speak_server_account}/tokens/delete'
 */
destroy.url = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { team_speak_server_account: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    team_speak_server_account: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        team_speak_server_account: args.team_speak_server_account,
                }

    return destroy.definition.url
            .replace('{team_speak_server_account}', parsedArgs.team_speak_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TeamSpeakAccountController::destroy
 * @see app/Http/Controllers/TeamSpeakAccountController.php:559
 * @route '/teamspeak-accounts/{team_speak_server_account}/tokens/delete'
 */
destroy.post = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: destroy.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TeamSpeakAccountController::destroy
 * @see app/Http/Controllers/TeamSpeakAccountController.php:559
 * @route '/teamspeak-accounts/{team_speak_server_account}/tokens/delete'
 */
    const destroyForm = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TeamSpeakAccountController::destroy
 * @see app/Http/Controllers/TeamSpeakAccountController.php:559
 * @route '/teamspeak-accounts/{team_speak_server_account}/tokens/delete'
 */
        destroyForm.post = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, options),
            method: 'post',
        })
    
    destroy.form = destroyForm
const tokens = {
    store: Object.assign(store, store),
destroy: Object.assign(destroy, destroy),
}

export default tokens