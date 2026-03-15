import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\TeamSpeakAccountController::store
 * @see app/Http/Controllers/TeamSpeakAccountController.php:595
 * @route '/teamspeak-accounts/{team_speak_server_account}/backups'
 */
export const store = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/teamspeak-accounts/{team_speak_server_account}/backups',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TeamSpeakAccountController::store
 * @see app/Http/Controllers/TeamSpeakAccountController.php:595
 * @route '/teamspeak-accounts/{team_speak_server_account}/backups'
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
 * @see app/Http/Controllers/TeamSpeakAccountController.php:595
 * @route '/teamspeak-accounts/{team_speak_server_account}/backups'
 */
store.post = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TeamSpeakAccountController::store
 * @see app/Http/Controllers/TeamSpeakAccountController.php:595
 * @route '/teamspeak-accounts/{team_speak_server_account}/backups'
 */
    const storeForm = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TeamSpeakAccountController::store
 * @see app/Http/Controllers/TeamSpeakAccountController.php:595
 * @route '/teamspeak-accounts/{team_speak_server_account}/backups'
 */
        storeForm.post = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\TeamSpeakAccountController::deploy
 * @see app/Http/Controllers/TeamSpeakAccountController.php:628
 * @route '/teamspeak-accounts/{team_speak_server_account}/backups/{snapshot}/deploy'
 */
export const deploy = (args: { team_speak_server_account: string | number, snapshot: number | { id: number } } | [team_speak_server_account: string | number, snapshot: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: deploy.url(args, options),
    method: 'post',
})

deploy.definition = {
    methods: ["post"],
    url: '/teamspeak-accounts/{team_speak_server_account}/backups/{snapshot}/deploy',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TeamSpeakAccountController::deploy
 * @see app/Http/Controllers/TeamSpeakAccountController.php:628
 * @route '/teamspeak-accounts/{team_speak_server_account}/backups/{snapshot}/deploy'
 */
deploy.url = (args: { team_speak_server_account: string | number, snapshot: number | { id: number } } | [team_speak_server_account: string | number, snapshot: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    team_speak_server_account: args[0],
                    snapshot: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        team_speak_server_account: args.team_speak_server_account,
                                snapshot: typeof args.snapshot === 'object'
                ? args.snapshot.id
                : args.snapshot,
                }

    return deploy.definition.url
            .replace('{team_speak_server_account}', parsedArgs.team_speak_server_account.toString())
            .replace('{snapshot}', parsedArgs.snapshot.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TeamSpeakAccountController::deploy
 * @see app/Http/Controllers/TeamSpeakAccountController.php:628
 * @route '/teamspeak-accounts/{team_speak_server_account}/backups/{snapshot}/deploy'
 */
deploy.post = (args: { team_speak_server_account: string | number, snapshot: number | { id: number } } | [team_speak_server_account: string | number, snapshot: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: deploy.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TeamSpeakAccountController::deploy
 * @see app/Http/Controllers/TeamSpeakAccountController.php:628
 * @route '/teamspeak-accounts/{team_speak_server_account}/backups/{snapshot}/deploy'
 */
    const deployForm = (args: { team_speak_server_account: string | number, snapshot: number | { id: number } } | [team_speak_server_account: string | number, snapshot: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: deploy.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TeamSpeakAccountController::deploy
 * @see app/Http/Controllers/TeamSpeakAccountController.php:628
 * @route '/teamspeak-accounts/{team_speak_server_account}/backups/{snapshot}/deploy'
 */
        deployForm.post = (args: { team_speak_server_account: string | number, snapshot: number | { id: number } } | [team_speak_server_account: string | number, snapshot: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: deploy.url(args, options),
            method: 'post',
        })
    
    deploy.form = deployForm
/**
* @see \App\Http\Controllers\TeamSpeakAccountController::destroy
 * @see app/Http/Controllers/TeamSpeakAccountController.php:668
 * @route '/teamspeak-accounts/{team_speak_server_account}/backups/{snapshot}'
 */
export const destroy = (args: { team_speak_server_account: string | number, snapshot: number | { id: number } } | [team_speak_server_account: string | number, snapshot: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/teamspeak-accounts/{team_speak_server_account}/backups/{snapshot}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\TeamSpeakAccountController::destroy
 * @see app/Http/Controllers/TeamSpeakAccountController.php:668
 * @route '/teamspeak-accounts/{team_speak_server_account}/backups/{snapshot}'
 */
destroy.url = (args: { team_speak_server_account: string | number, snapshot: number | { id: number } } | [team_speak_server_account: string | number, snapshot: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    team_speak_server_account: args[0],
                    snapshot: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        team_speak_server_account: args.team_speak_server_account,
                                snapshot: typeof args.snapshot === 'object'
                ? args.snapshot.id
                : args.snapshot,
                }

    return destroy.definition.url
            .replace('{team_speak_server_account}', parsedArgs.team_speak_server_account.toString())
            .replace('{snapshot}', parsedArgs.snapshot.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TeamSpeakAccountController::destroy
 * @see app/Http/Controllers/TeamSpeakAccountController.php:668
 * @route '/teamspeak-accounts/{team_speak_server_account}/backups/{snapshot}'
 */
destroy.delete = (args: { team_speak_server_account: string | number, snapshot: number | { id: number } } | [team_speak_server_account: string | number, snapshot: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\TeamSpeakAccountController::destroy
 * @see app/Http/Controllers/TeamSpeakAccountController.php:668
 * @route '/teamspeak-accounts/{team_speak_server_account}/backups/{snapshot}'
 */
    const destroyForm = (args: { team_speak_server_account: string | number, snapshot: number | { id: number } } | [team_speak_server_account: string | number, snapshot: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TeamSpeakAccountController::destroy
 * @see app/Http/Controllers/TeamSpeakAccountController.php:668
 * @route '/teamspeak-accounts/{team_speak_server_account}/backups/{snapshot}'
 */
        destroyForm.delete = (args: { team_speak_server_account: string | number, snapshot: number | { id: number } } | [team_speak_server_account: string | number, snapshot: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const backups = {
    store: Object.assign(store, store),
deploy: Object.assign(deploy, deploy),
destroy: Object.assign(destroy, destroy),
}

export default backups