import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
import invitations from './invitations'
/**
* @see \App\Http\Controllers\ProductShareController::update
 * @see app/Http/Controllers/ProductShareController.php:184
 * @route '/gaming-accounts/{game_server_account}/shares/{share}'
 */
export const update = (args: { game_server_account: string | { uuid: string }, share: number | { id: number } } | [game_server_account: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/gaming-accounts/{game_server_account}/shares/{share}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\ProductShareController::update
 * @see app/Http/Controllers/ProductShareController.php:184
 * @route '/gaming-accounts/{game_server_account}/shares/{share}'
 */
update.url = (args: { game_server_account: string | { uuid: string }, share: number | { id: number } } | [game_server_account: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    game_server_account: args[0],
                    share: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        game_server_account: typeof args.game_server_account === 'object'
                ? args.game_server_account.uuid
                : args.game_server_account,
                                share: typeof args.share === 'object'
                ? args.share.id
                : args.share,
                }

    return update.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace('{share}', parsedArgs.share.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductShareController::update
 * @see app/Http/Controllers/ProductShareController.php:184
 * @route '/gaming-accounts/{game_server_account}/shares/{share}'
 */
update.patch = (args: { game_server_account: string | { uuid: string }, share: number | { id: number } } | [game_server_account: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ProductShareController::update
 * @see app/Http/Controllers/ProductShareController.php:184
 * @route '/gaming-accounts/{game_server_account}/shares/{share}'
 */
    const updateForm = (args: { game_server_account: string | { uuid: string }, share: number | { id: number } } | [game_server_account: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/ProductShareController.php:184
 * @route '/gaming-accounts/{game_server_account}/shares/{share}'
 */
        updateForm.patch = (args: { game_server_account: string | { uuid: string }, share: number | { id: number } } | [game_server_account: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/ProductShareController.php:233
 * @route '/gaming-accounts/{game_server_account}/shares/{share}'
 */
export const destroy = (args: { game_server_account: string | { uuid: string }, share: number | { id: number } } | [game_server_account: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/gaming-accounts/{game_server_account}/shares/{share}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ProductShareController::destroy
 * @see app/Http/Controllers/ProductShareController.php:233
 * @route '/gaming-accounts/{game_server_account}/shares/{share}'
 */
destroy.url = (args: { game_server_account: string | { uuid: string }, share: number | { id: number } } | [game_server_account: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    game_server_account: args[0],
                    share: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        game_server_account: typeof args.game_server_account === 'object'
                ? args.game_server_account.uuid
                : args.game_server_account,
                                share: typeof args.share === 'object'
                ? args.share.id
                : args.share,
                }

    return destroy.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace('{share}', parsedArgs.share.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductShareController::destroy
 * @see app/Http/Controllers/ProductShareController.php:233
 * @route '/gaming-accounts/{game_server_account}/shares/{share}'
 */
destroy.delete = (args: { game_server_account: string | { uuid: string }, share: number | { id: number } } | [game_server_account: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ProductShareController::destroy
 * @see app/Http/Controllers/ProductShareController.php:233
 * @route '/gaming-accounts/{game_server_account}/shares/{share}'
 */
    const destroyForm = (args: { game_server_account: string | { uuid: string }, share: number | { id: number } } | [game_server_account: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/ProductShareController.php:233
 * @route '/gaming-accounts/{game_server_account}/shares/{share}'
 */
        destroyForm.delete = (args: { game_server_account: string | { uuid: string }, share: number | { id: number } } | [game_server_account: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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