import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
import subscription from './subscription'
/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::index
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:35
 * @route '/admin/gaming-accounts'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/gaming-accounts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::index
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:35
 * @route '/admin/gaming-accounts'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::index
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:35
 * @route '/admin/gaming-accounts'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::index
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:35
 * @route '/admin/gaming-accounts'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\GameServerAccountController::index
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:35
 * @route '/admin/gaming-accounts'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\GameServerAccountController::index
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:35
 * @route '/admin/gaming-accounts'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\GameServerAccountController::index
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:35
 * @route '/admin/gaming-accounts'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::edit
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:416
 * @route '/admin/gaming-accounts/{game_server_account}/edit'
 */
export const edit = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/gaming-accounts/{game_server_account}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::edit
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:416
 * @route '/admin/gaming-accounts/{game_server_account}/edit'
 */
edit.url = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::edit
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:416
 * @route '/admin/gaming-accounts/{game_server_account}/edit'
 */
edit.get = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::edit
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:416
 * @route '/admin/gaming-accounts/{game_server_account}/edit'
 */
edit.head = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\GameServerAccountController::edit
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:416
 * @route '/admin/gaming-accounts/{game_server_account}/edit'
 */
    const editForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\GameServerAccountController::edit
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:416
 * @route '/admin/gaming-accounts/{game_server_account}/edit'
 */
        editForm.get = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\GameServerAccountController::edit
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:416
 * @route '/admin/gaming-accounts/{game_server_account}/edit'
 */
        editForm.head = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::update
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:475
 * @route '/admin/gaming-accounts/{game_server_account}'
 */
export const update = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/gaming-accounts/{game_server_account}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::update
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:475
 * @route '/admin/gaming-accounts/{game_server_account}'
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
* @see \App\Http\Controllers\Admin\GameServerAccountController::update
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:475
 * @route '/admin/gaming-accounts/{game_server_account}'
 */
update.put = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\GameServerAccountController::update
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:475
 * @route '/admin/gaming-accounts/{game_server_account}'
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
* @see \App\Http\Controllers\Admin\GameServerAccountController::update
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:475
 * @route '/admin/gaming-accounts/{game_server_account}'
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
/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::retryProvisioning
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:589
 * @route '/admin/gaming-accounts/{game_server_account}/retry-provisioning'
 */
export const retryProvisioning = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retryProvisioning.url(args, options),
    method: 'post',
})

retryProvisioning.definition = {
    methods: ["post"],
    url: '/admin/gaming-accounts/{game_server_account}/retry-provisioning',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::retryProvisioning
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:589
 * @route '/admin/gaming-accounts/{game_server_account}/retry-provisioning'
 */
retryProvisioning.url = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return retryProvisioning.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::retryProvisioning
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:589
 * @route '/admin/gaming-accounts/{game_server_account}/retry-provisioning'
 */
retryProvisioning.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retryProvisioning.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\GameServerAccountController::retryProvisioning
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:589
 * @route '/admin/gaming-accounts/{game_server_account}/retry-provisioning'
 */
    const retryProvisioningForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: retryProvisioning.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\GameServerAccountController::retryProvisioning
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:589
 * @route '/admin/gaming-accounts/{game_server_account}/retry-provisioning'
 */
        retryProvisioningForm.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: retryProvisioning.url(args, options),
            method: 'post',
        })
    
    retryProvisioning.form = retryProvisioningForm
/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::show
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:337
 * @route '/admin/gaming-accounts/{game_server_account}'
 */
export const show = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/gaming-accounts/{game_server_account}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::show
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:337
 * @route '/admin/gaming-accounts/{game_server_account}'
 */
show.url = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::show
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:337
 * @route '/admin/gaming-accounts/{game_server_account}'
 */
show.get = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::show
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:337
 * @route '/admin/gaming-accounts/{game_server_account}'
 */
show.head = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\GameServerAccountController::show
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:337
 * @route '/admin/gaming-accounts/{game_server_account}'
 */
    const showForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\GameServerAccountController::show
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:337
 * @route '/admin/gaming-accounts/{game_server_account}'
 */
        showForm.get = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\GameServerAccountController::show
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:337
 * @route '/admin/gaming-accounts/{game_server_account}'
 */
        showForm.head = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const gamingAccounts = {
    index: Object.assign(index, index),
subscription: Object.assign(subscription, subscription),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
retryProvisioning: Object.assign(retryProvisioning, retryProvisioning),
show: Object.assign(show, show),
}

export default gamingAccounts