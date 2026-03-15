import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
import invitations from './invitations'
/**
* @see \App\Http\Controllers\ProductShareController::update
 * @see app/Http/Controllers/ProductShareController.php:189
 * @route '/teamspeak-accounts/{team_speak_server_account}/shares/{share}'
 */
export const update = (args: { team_speak_server_account: string | { uuid: string }, share: number | { id: number } } | [team_speak_server_account: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/teamspeak-accounts/{team_speak_server_account}/shares/{share}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\ProductShareController::update
 * @see app/Http/Controllers/ProductShareController.php:189
 * @route '/teamspeak-accounts/{team_speak_server_account}/shares/{share}'
 */
update.url = (args: { team_speak_server_account: string | { uuid: string }, share: number | { id: number } } | [team_speak_server_account: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    team_speak_server_account: args[0],
                    share: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        team_speak_server_account: typeof args.team_speak_server_account === 'object'
                ? args.team_speak_server_account.uuid
                : args.team_speak_server_account,
                                share: typeof args.share === 'object'
                ? args.share.id
                : args.share,
                }

    return update.definition.url
            .replace('{team_speak_server_account}', parsedArgs.team_speak_server_account.toString())
            .replace('{share}', parsedArgs.share.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductShareController::update
 * @see app/Http/Controllers/ProductShareController.php:189
 * @route '/teamspeak-accounts/{team_speak_server_account}/shares/{share}'
 */
update.patch = (args: { team_speak_server_account: string | { uuid: string }, share: number | { id: number } } | [team_speak_server_account: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ProductShareController::update
 * @see app/Http/Controllers/ProductShareController.php:189
 * @route '/teamspeak-accounts/{team_speak_server_account}/shares/{share}'
 */
    const updateForm = (args: { team_speak_server_account: string | { uuid: string }, share: number | { id: number } } | [team_speak_server_account: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProductShareController::update
 * @see app/Http/Controllers/ProductShareController.php:189
 * @route '/teamspeak-accounts/{team_speak_server_account}/shares/{share}'
 */
        updateForm.patch = (args: { team_speak_server_account: string | { uuid: string }, share: number | { id: number } } | [team_speak_server_account: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\ProductShareController::destroy
 * @see app/Http/Controllers/ProductShareController.php:238
 * @route '/teamspeak-accounts/{team_speak_server_account}/shares/{share}'
 */
export const destroy = (args: { team_speak_server_account: string | { uuid: string }, share: number | { id: number } } | [team_speak_server_account: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/teamspeak-accounts/{team_speak_server_account}/shares/{share}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ProductShareController::destroy
 * @see app/Http/Controllers/ProductShareController.php:238
 * @route '/teamspeak-accounts/{team_speak_server_account}/shares/{share}'
 */
destroy.url = (args: { team_speak_server_account: string | { uuid: string }, share: number | { id: number } } | [team_speak_server_account: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    team_speak_server_account: args[0],
                    share: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        team_speak_server_account: typeof args.team_speak_server_account === 'object'
                ? args.team_speak_server_account.uuid
                : args.team_speak_server_account,
                                share: typeof args.share === 'object'
                ? args.share.id
                : args.share,
                }

    return destroy.definition.url
            .replace('{team_speak_server_account}', parsedArgs.team_speak_server_account.toString())
            .replace('{share}', parsedArgs.share.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductShareController::destroy
 * @see app/Http/Controllers/ProductShareController.php:238
 * @route '/teamspeak-accounts/{team_speak_server_account}/shares/{share}'
 */
destroy.delete = (args: { team_speak_server_account: string | { uuid: string }, share: number | { id: number } } | [team_speak_server_account: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ProductShareController::destroy
 * @see app/Http/Controllers/ProductShareController.php:238
 * @route '/teamspeak-accounts/{team_speak_server_account}/shares/{share}'
 */
    const destroyForm = (args: { team_speak_server_account: string | { uuid: string }, share: number | { id: number } } | [team_speak_server_account: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProductShareController::destroy
 * @see app/Http/Controllers/ProductShareController.php:238
 * @route '/teamspeak-accounts/{team_speak_server_account}/shares/{share}'
 */
        destroyForm.delete = (args: { team_speak_server_account: string | { uuid: string }, share: number | { id: number } } | [team_speak_server_account: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const shares = {
    invitations: Object.assign(invitations, invitations),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default shares