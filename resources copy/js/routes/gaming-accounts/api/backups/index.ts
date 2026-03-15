import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\GamingAccountController::list
 * @see app/Http/Controllers/GamingAccountController.php:1018
 * @route '/gaming-accounts/{game_server_account}/api/backups'
 */
export const list = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: list.url(args, options),
    method: 'get',
})

list.definition = {
    methods: ["get","head"],
    url: '/gaming-accounts/{game_server_account}/api/backups',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GamingAccountController::list
 * @see app/Http/Controllers/GamingAccountController.php:1018
 * @route '/gaming-accounts/{game_server_account}/api/backups'
 */
list.url = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return list.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::list
 * @see app/Http/Controllers/GamingAccountController.php:1018
 * @route '/gaming-accounts/{game_server_account}/api/backups'
 */
list.get = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: list.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GamingAccountController::list
 * @see app/Http/Controllers/GamingAccountController.php:1018
 * @route '/gaming-accounts/{game_server_account}/api/backups'
 */
list.head = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: list.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::list
 * @see app/Http/Controllers/GamingAccountController.php:1018
 * @route '/gaming-accounts/{game_server_account}/api/backups'
 */
    const listForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: list.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::list
 * @see app/Http/Controllers/GamingAccountController.php:1018
 * @route '/gaming-accounts/{game_server_account}/api/backups'
 */
        listForm.get = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: list.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\GamingAccountController::list
 * @see app/Http/Controllers/GamingAccountController.php:1018
 * @route '/gaming-accounts/{game_server_account}/api/backups'
 */
        listForm.head = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: list.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    list.form = listForm
/**
* @see \App\Http\Controllers\GamingAccountController::create
 * @see app/Http/Controllers/GamingAccountController.php:1037
 * @route '/gaming-accounts/{game_server_account}/api/backups'
 */
export const create = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: create.url(args, options),
    method: 'post',
})

create.definition = {
    methods: ["post"],
    url: '/gaming-accounts/{game_server_account}/api/backups',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GamingAccountController::create
 * @see app/Http/Controllers/GamingAccountController.php:1037
 * @route '/gaming-accounts/{game_server_account}/api/backups'
 */
create.url = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return create.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::create
 * @see app/Http/Controllers/GamingAccountController.php:1037
 * @route '/gaming-accounts/{game_server_account}/api/backups'
 */
create.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: create.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::create
 * @see app/Http/Controllers/GamingAccountController.php:1037
 * @route '/gaming-accounts/{game_server_account}/api/backups'
 */
    const createForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: create.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::create
 * @see app/Http/Controllers/GamingAccountController.php:1037
 * @route '/gaming-accounts/{game_server_account}/api/backups'
 */
        createForm.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: create.url(args, options),
            method: 'post',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\GamingAccountController::download
 * @see app/Http/Controllers/GamingAccountController.php:1061
 * @route '/gaming-accounts/{game_server_account}/api/backups/{backupUuid}/download'
 */
export const download = (args: { game_server_account: string | number, backupUuid: string | number } | [game_server_account: string | number, backupUuid: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/gaming-accounts/{game_server_account}/api/backups/{backupUuid}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GamingAccountController::download
 * @see app/Http/Controllers/GamingAccountController.php:1061
 * @route '/gaming-accounts/{game_server_account}/api/backups/{backupUuid}/download'
 */
download.url = (args: { game_server_account: string | number, backupUuid: string | number } | [game_server_account: string | number, backupUuid: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    game_server_account: args[0],
                    backupUuid: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        game_server_account: args.game_server_account,
                                backupUuid: args.backupUuid,
                }

    return download.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace('{backupUuid}', parsedArgs.backupUuid.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::download
 * @see app/Http/Controllers/GamingAccountController.php:1061
 * @route '/gaming-accounts/{game_server_account}/api/backups/{backupUuid}/download'
 */
download.get = (args: { game_server_account: string | number, backupUuid: string | number } | [game_server_account: string | number, backupUuid: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GamingAccountController::download
 * @see app/Http/Controllers/GamingAccountController.php:1061
 * @route '/gaming-accounts/{game_server_account}/api/backups/{backupUuid}/download'
 */
download.head = (args: { game_server_account: string | number, backupUuid: string | number } | [game_server_account: string | number, backupUuid: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::download
 * @see app/Http/Controllers/GamingAccountController.php:1061
 * @route '/gaming-accounts/{game_server_account}/api/backups/{backupUuid}/download'
 */
    const downloadForm = (args: { game_server_account: string | number, backupUuid: string | number } | [game_server_account: string | number, backupUuid: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: download.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::download
 * @see app/Http/Controllers/GamingAccountController.php:1061
 * @route '/gaming-accounts/{game_server_account}/api/backups/{backupUuid}/download'
 */
        downloadForm.get = (args: { game_server_account: string | number, backupUuid: string | number } | [game_server_account: string | number, backupUuid: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\GamingAccountController::download
 * @see app/Http/Controllers/GamingAccountController.php:1061
 * @route '/gaming-accounts/{game_server_account}/api/backups/{backupUuid}/download'
 */
        downloadForm.head = (args: { game_server_account: string | number, backupUuid: string | number } | [game_server_account: string | number, backupUuid: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    download.form = downloadForm
/**
* @see \App\Http\Controllers\GamingAccountController::restore
 * @see app/Http/Controllers/GamingAccountController.php:1084
 * @route '/gaming-accounts/{game_server_account}/api/backups/{backupUuid}/restore'
 */
export const restore = (args: { game_server_account: string | number, backupUuid: string | number } | [game_server_account: string | number, backupUuid: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: restore.url(args, options),
    method: 'post',
})

restore.definition = {
    methods: ["post"],
    url: '/gaming-accounts/{game_server_account}/api/backups/{backupUuid}/restore',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GamingAccountController::restore
 * @see app/Http/Controllers/GamingAccountController.php:1084
 * @route '/gaming-accounts/{game_server_account}/api/backups/{backupUuid}/restore'
 */
restore.url = (args: { game_server_account: string | number, backupUuid: string | number } | [game_server_account: string | number, backupUuid: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    game_server_account: args[0],
                    backupUuid: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        game_server_account: args.game_server_account,
                                backupUuid: args.backupUuid,
                }

    return restore.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace('{backupUuid}', parsedArgs.backupUuid.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::restore
 * @see app/Http/Controllers/GamingAccountController.php:1084
 * @route '/gaming-accounts/{game_server_account}/api/backups/{backupUuid}/restore'
 */
restore.post = (args: { game_server_account: string | number, backupUuid: string | number } | [game_server_account: string | number, backupUuid: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: restore.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::restore
 * @see app/Http/Controllers/GamingAccountController.php:1084
 * @route '/gaming-accounts/{game_server_account}/api/backups/{backupUuid}/restore'
 */
    const restoreForm = (args: { game_server_account: string | number, backupUuid: string | number } | [game_server_account: string | number, backupUuid: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: restore.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::restore
 * @see app/Http/Controllers/GamingAccountController.php:1084
 * @route '/gaming-accounts/{game_server_account}/api/backups/{backupUuid}/restore'
 */
        restoreForm.post = (args: { game_server_account: string | number, backupUuid: string | number } | [game_server_account: string | number, backupUuid: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: restore.url(args, options),
            method: 'post',
        })
    
    restore.form = restoreForm
/**
* @see \App\Http\Controllers\GamingAccountController::deleteMethod
 * @see app/Http/Controllers/GamingAccountController.php:1103
 * @route '/gaming-accounts/{game_server_account}/api/backups/{backupUuid}'
 */
export const deleteMethod = (args: { game_server_account: string | number, backupUuid: string | number } | [game_server_account: string | number, backupUuid: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMethod.url(args, options),
    method: 'delete',
})

deleteMethod.definition = {
    methods: ["delete"],
    url: '/gaming-accounts/{game_server_account}/api/backups/{backupUuid}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\GamingAccountController::deleteMethod
 * @see app/Http/Controllers/GamingAccountController.php:1103
 * @route '/gaming-accounts/{game_server_account}/api/backups/{backupUuid}'
 */
deleteMethod.url = (args: { game_server_account: string | number, backupUuid: string | number } | [game_server_account: string | number, backupUuid: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    game_server_account: args[0],
                    backupUuid: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        game_server_account: args.game_server_account,
                                backupUuid: args.backupUuid,
                }

    return deleteMethod.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace('{backupUuid}', parsedArgs.backupUuid.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::deleteMethod
 * @see app/Http/Controllers/GamingAccountController.php:1103
 * @route '/gaming-accounts/{game_server_account}/api/backups/{backupUuid}'
 */
deleteMethod.delete = (args: { game_server_account: string | number, backupUuid: string | number } | [game_server_account: string | number, backupUuid: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMethod.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::deleteMethod
 * @see app/Http/Controllers/GamingAccountController.php:1103
 * @route '/gaming-accounts/{game_server_account}/api/backups/{backupUuid}'
 */
    const deleteMethodForm = (args: { game_server_account: string | number, backupUuid: string | number } | [game_server_account: string | number, backupUuid: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: deleteMethod.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::deleteMethod
 * @see app/Http/Controllers/GamingAccountController.php:1103
 * @route '/gaming-accounts/{game_server_account}/api/backups/{backupUuid}'
 */
        deleteMethodForm.delete = (args: { game_server_account: string | number, backupUuid: string | number } | [game_server_account: string | number, backupUuid: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: deleteMethod.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    deleteMethod.form = deleteMethodForm
const backups = {
    list: Object.assign(list, list),
create: Object.assign(create, create),
download: Object.assign(download, download),
restore: Object.assign(restore, restore),
delete: Object.assign(deleteMethod, deleteMethod),
}

export default backups