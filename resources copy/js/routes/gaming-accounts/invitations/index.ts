import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ProductShareController::destroy
 * @see app/Http/Controllers/ProductShareController.php:282
 * @route '/gaming-accounts/{game_server_account}/invitations/{invitation}'
 */
export const destroy = (args: { game_server_account: string | { uuid: string }, invitation: number | { id: number } } | [game_server_account: string | { uuid: string }, invitation: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/gaming-accounts/{game_server_account}/invitations/{invitation}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ProductShareController::destroy
 * @see app/Http/Controllers/ProductShareController.php:282
 * @route '/gaming-accounts/{game_server_account}/invitations/{invitation}'
 */
destroy.url = (args: { game_server_account: string | { uuid: string }, invitation: number | { id: number } } | [game_server_account: string | { uuid: string }, invitation: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    game_server_account: args[0],
                    invitation: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        game_server_account: typeof args.game_server_account === 'object'
                ? args.game_server_account.uuid
                : args.game_server_account,
                                invitation: typeof args.invitation === 'object'
                ? args.invitation.id
                : args.invitation,
                }

    return destroy.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace('{invitation}', parsedArgs.invitation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductShareController::destroy
 * @see app/Http/Controllers/ProductShareController.php:282
 * @route '/gaming-accounts/{game_server_account}/invitations/{invitation}'
 */
destroy.delete = (args: { game_server_account: string | { uuid: string }, invitation: number | { id: number } } | [game_server_account: string | { uuid: string }, invitation: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ProductShareController::destroy
 * @see app/Http/Controllers/ProductShareController.php:282
 * @route '/gaming-accounts/{game_server_account}/invitations/{invitation}'
 */
    const destroyForm = (args: { game_server_account: string | { uuid: string }, invitation: number | { id: number } } | [game_server_account: string | { uuid: string }, invitation: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/ProductShareController.php:282
 * @route '/gaming-accounts/{game_server_account}/invitations/{invitation}'
 */
        destroyForm.delete = (args: { game_server_account: string | { uuid: string }, invitation: number | { id: number } } | [game_server_account: string | { uuid: string }, invitation: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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