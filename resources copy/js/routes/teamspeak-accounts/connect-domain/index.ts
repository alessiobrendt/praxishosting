import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\TeamSpeakAccountController::show
 * @see app/Http/Controllers/TeamSpeakAccountController.php:186
 * @route '/teamspeak-accounts/{team_speak_server_account}/connect-domain'
 */
export const show = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/teamspeak-accounts/{team_speak_server_account}/connect-domain',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TeamSpeakAccountController::show
 * @see app/Http/Controllers/TeamSpeakAccountController.php:186
 * @route '/teamspeak-accounts/{team_speak_server_account}/connect-domain'
 */
show.url = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{team_speak_server_account}', parsedArgs.team_speak_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TeamSpeakAccountController::show
 * @see app/Http/Controllers/TeamSpeakAccountController.php:186
 * @route '/teamspeak-accounts/{team_speak_server_account}/connect-domain'
 */
show.get = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TeamSpeakAccountController::show
 * @see app/Http/Controllers/TeamSpeakAccountController.php:186
 * @route '/teamspeak-accounts/{team_speak_server_account}/connect-domain'
 */
show.head = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TeamSpeakAccountController::show
 * @see app/Http/Controllers/TeamSpeakAccountController.php:186
 * @route '/teamspeak-accounts/{team_speak_server_account}/connect-domain'
 */
    const showForm = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TeamSpeakAccountController::show
 * @see app/Http/Controllers/TeamSpeakAccountController.php:186
 * @route '/teamspeak-accounts/{team_speak_server_account}/connect-domain'
 */
        showForm.get = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TeamSpeakAccountController::show
 * @see app/Http/Controllers/TeamSpeakAccountController.php:186
 * @route '/teamspeak-accounts/{team_speak_server_account}/connect-domain'
 */
        showForm.head = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\TeamSpeakAccountController::store
 * @see app/Http/Controllers/TeamSpeakAccountController.php:227
 * @route '/teamspeak-accounts/{team_speak_server_account}/connect-domain'
 */
export const store = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/teamspeak-accounts/{team_speak_server_account}/connect-domain',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TeamSpeakAccountController::store
 * @see app/Http/Controllers/TeamSpeakAccountController.php:227
 * @route '/teamspeak-accounts/{team_speak_server_account}/connect-domain'
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
 * @see app/Http/Controllers/TeamSpeakAccountController.php:227
 * @route '/teamspeak-accounts/{team_speak_server_account}/connect-domain'
 */
store.post = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TeamSpeakAccountController::store
 * @see app/Http/Controllers/TeamSpeakAccountController.php:227
 * @route '/teamspeak-accounts/{team_speak_server_account}/connect-domain'
 */
    const storeForm = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TeamSpeakAccountController::store
 * @see app/Http/Controllers/TeamSpeakAccountController.php:227
 * @route '/teamspeak-accounts/{team_speak_server_account}/connect-domain'
 */
        storeForm.post = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
const connectDomain = {
    show: Object.assign(show, show),
store: Object.assign(store, store),
}

export default connectDomain