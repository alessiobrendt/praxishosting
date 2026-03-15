import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ProductShareController::destroy
 * @see app/Http/Controllers/ProductShareController.php:287
 * @route '/teamspeak-accounts/{team_speak_server_account}/invitations/{invitation}'
 */
export const destroy = (args: { team_speak_server_account: string | { uuid: string }, invitation: number | { id: number } } | [team_speak_server_account: string | { uuid: string }, invitation: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/teamspeak-accounts/{team_speak_server_account}/invitations/{invitation}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ProductShareController::destroy
 * @see app/Http/Controllers/ProductShareController.php:287
 * @route '/teamspeak-accounts/{team_speak_server_account}/invitations/{invitation}'
 */
destroy.url = (args: { team_speak_server_account: string | { uuid: string }, invitation: number | { id: number } } | [team_speak_server_account: string | { uuid: string }, invitation: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    team_speak_server_account: args[0],
                    invitation: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        team_speak_server_account: typeof args.team_speak_server_account === 'object'
                ? args.team_speak_server_account.uuid
                : args.team_speak_server_account,
                                invitation: typeof args.invitation === 'object'
                ? args.invitation.id
                : args.invitation,
                }

    return destroy.definition.url
            .replace('{team_speak_server_account}', parsedArgs.team_speak_server_account.toString())
            .replace('{invitation}', parsedArgs.invitation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductShareController::destroy
 * @see app/Http/Controllers/ProductShareController.php:287
 * @route '/teamspeak-accounts/{team_speak_server_account}/invitations/{invitation}'
 */
destroy.delete = (args: { team_speak_server_account: string | { uuid: string }, invitation: number | { id: number } } | [team_speak_server_account: string | { uuid: string }, invitation: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ProductShareController::destroy
 * @see app/Http/Controllers/ProductShareController.php:287
 * @route '/teamspeak-accounts/{team_speak_server_account}/invitations/{invitation}'
 */
    const destroyForm = (args: { team_speak_server_account: string | { uuid: string }, invitation: number | { id: number } } | [team_speak_server_account: string | { uuid: string }, invitation: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/ProductShareController.php:287
 * @route '/teamspeak-accounts/{team_speak_server_account}/invitations/{invitation}'
 */
        destroyForm.delete = (args: { team_speak_server_account: string | { uuid: string }, invitation: number | { id: number } } | [team_speak_server_account: string | { uuid: string }, invitation: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const invitations = {
    destroy: Object.assign(destroy, destroy),
}

export default invitations