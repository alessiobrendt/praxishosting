import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::update
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:275
 * @route '/admin/gameserver-cloud-accounts/{subscription}/servers/{game_server_account}/resources'
 */
export const update = (args: { subscription: string | { uuid: string }, game_server_account: string | number } | [subscription: string | { uuid: string }, game_server_account: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/gameserver-cloud-accounts/{subscription}/servers/{game_server_account}/resources',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::update
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:275
 * @route '/admin/gameserver-cloud-accounts/{subscription}/servers/{game_server_account}/resources'
 */
update.url = (args: { subscription: string | { uuid: string }, game_server_account: string | number } | [subscription: string | { uuid: string }, game_server_account: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    subscription: args[0],
                    game_server_account: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        subscription: typeof args.subscription === 'object'
                ? args.subscription.uuid
                : args.subscription,
                                game_server_account: args.game_server_account,
                }

    return update.definition.url
            .replace('{subscription}', parsedArgs.subscription.toString())
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::update
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:275
 * @route '/admin/gameserver-cloud-accounts/{subscription}/servers/{game_server_account}/resources'
 */
update.put = (args: { subscription: string | { uuid: string }, game_server_account: string | number } | [subscription: string | { uuid: string }, game_server_account: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\GameServerAccountController::update
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:275
 * @route '/admin/gameserver-cloud-accounts/{subscription}/servers/{game_server_account}/resources'
 */
    const updateForm = (args: { subscription: string | { uuid: string }, game_server_account: string | number } | [subscription: string | { uuid: string }, game_server_account: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\GameServerAccountController::update
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:275
 * @route '/admin/gameserver-cloud-accounts/{subscription}/servers/{game_server_account}/resources'
 */
        updateForm.put = (args: { subscription: string | { uuid: string }, game_server_account: string | number } | [subscription: string | { uuid: string }, game_server_account: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
const resources = {
    update: Object.assign(update, update),
}

export default resources