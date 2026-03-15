import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\GamingAccountController::list
 * @see app/Http/Controllers/GamingAccountController.php:1122
 * @route '/gaming-accounts/{game_server_account}/api/databases'
 */
export const list = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: list.url(args, options),
    method: 'get',
})

list.definition = {
    methods: ["get","head"],
    url: '/gaming-accounts/{game_server_account}/api/databases',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GamingAccountController::list
 * @see app/Http/Controllers/GamingAccountController.php:1122
 * @route '/gaming-accounts/{game_server_account}/api/databases'
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
 * @see app/Http/Controllers/GamingAccountController.php:1122
 * @route '/gaming-accounts/{game_server_account}/api/databases'
 */
list.get = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: list.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GamingAccountController::list
 * @see app/Http/Controllers/GamingAccountController.php:1122
 * @route '/gaming-accounts/{game_server_account}/api/databases'
 */
list.head = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: list.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::list
 * @see app/Http/Controllers/GamingAccountController.php:1122
 * @route '/gaming-accounts/{game_server_account}/api/databases'
 */
    const listForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: list.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::list
 * @see app/Http/Controllers/GamingAccountController.php:1122
 * @route '/gaming-accounts/{game_server_account}/api/databases'
 */
        listForm.get = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: list.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\GamingAccountController::list
 * @see app/Http/Controllers/GamingAccountController.php:1122
 * @route '/gaming-accounts/{game_server_account}/api/databases'
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
* @see \App\Http\Controllers\GamingAccountController::credentials
 * @see app/Http/Controllers/GamingAccountController.php:1141
 * @route '/gaming-accounts/{game_server_account}/api/databases/{databaseId}/credentials'
 */
export const credentials = (args: { game_server_account: string | number, databaseId: string | number } | [game_server_account: string | number, databaseId: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: credentials.url(args, options),
    method: 'get',
})

credentials.definition = {
    methods: ["get","head"],
    url: '/gaming-accounts/{game_server_account}/api/databases/{databaseId}/credentials',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GamingAccountController::credentials
 * @see app/Http/Controllers/GamingAccountController.php:1141
 * @route '/gaming-accounts/{game_server_account}/api/databases/{databaseId}/credentials'
 */
credentials.url = (args: { game_server_account: string | number, databaseId: string | number } | [game_server_account: string | number, databaseId: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    game_server_account: args[0],
                    databaseId: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        game_server_account: args.game_server_account,
                                databaseId: args.databaseId,
                }

    return credentials.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace('{databaseId}', parsedArgs.databaseId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::credentials
 * @see app/Http/Controllers/GamingAccountController.php:1141
 * @route '/gaming-accounts/{game_server_account}/api/databases/{databaseId}/credentials'
 */
credentials.get = (args: { game_server_account: string | number, databaseId: string | number } | [game_server_account: string | number, databaseId: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: credentials.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GamingAccountController::credentials
 * @see app/Http/Controllers/GamingAccountController.php:1141
 * @route '/gaming-accounts/{game_server_account}/api/databases/{databaseId}/credentials'
 */
credentials.head = (args: { game_server_account: string | number, databaseId: string | number } | [game_server_account: string | number, databaseId: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: credentials.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::credentials
 * @see app/Http/Controllers/GamingAccountController.php:1141
 * @route '/gaming-accounts/{game_server_account}/api/databases/{databaseId}/credentials'
 */
    const credentialsForm = (args: { game_server_account: string | number, databaseId: string | number } | [game_server_account: string | number, databaseId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: credentials.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::credentials
 * @see app/Http/Controllers/GamingAccountController.php:1141
 * @route '/gaming-accounts/{game_server_account}/api/databases/{databaseId}/credentials'
 */
        credentialsForm.get = (args: { game_server_account: string | number, databaseId: string | number } | [game_server_account: string | number, databaseId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: credentials.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\GamingAccountController::credentials
 * @see app/Http/Controllers/GamingAccountController.php:1141
 * @route '/gaming-accounts/{game_server_account}/api/databases/{databaseId}/credentials'
 */
        credentialsForm.head = (args: { game_server_account: string | number, databaseId: string | number } | [game_server_account: string | number, databaseId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: credentials.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    credentials.form = credentialsForm
/**
* @see \App\Http\Controllers\GamingAccountController::phpmyadmin
 * @see app/Http/Controllers/GamingAccountController.php:1159
 * @route '/gaming-accounts/{game_server_account}/api/databases/{databaseId}/phpmyadmin'
 */
export const phpmyadmin = (args: { game_server_account: string | number, databaseId: string | number } | [game_server_account: string | number, databaseId: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: phpmyadmin.url(args, options),
    method: 'get',
})

phpmyadmin.definition = {
    methods: ["get","head"],
    url: '/gaming-accounts/{game_server_account}/api/databases/{databaseId}/phpmyadmin',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GamingAccountController::phpmyadmin
 * @see app/Http/Controllers/GamingAccountController.php:1159
 * @route '/gaming-accounts/{game_server_account}/api/databases/{databaseId}/phpmyadmin'
 */
phpmyadmin.url = (args: { game_server_account: string | number, databaseId: string | number } | [game_server_account: string | number, databaseId: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    game_server_account: args[0],
                    databaseId: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        game_server_account: args.game_server_account,
                                databaseId: args.databaseId,
                }

    return phpmyadmin.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace('{databaseId}', parsedArgs.databaseId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::phpmyadmin
 * @see app/Http/Controllers/GamingAccountController.php:1159
 * @route '/gaming-accounts/{game_server_account}/api/databases/{databaseId}/phpmyadmin'
 */
phpmyadmin.get = (args: { game_server_account: string | number, databaseId: string | number } | [game_server_account: string | number, databaseId: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: phpmyadmin.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GamingAccountController::phpmyadmin
 * @see app/Http/Controllers/GamingAccountController.php:1159
 * @route '/gaming-accounts/{game_server_account}/api/databases/{databaseId}/phpmyadmin'
 */
phpmyadmin.head = (args: { game_server_account: string | number, databaseId: string | number } | [game_server_account: string | number, databaseId: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: phpmyadmin.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::phpmyadmin
 * @see app/Http/Controllers/GamingAccountController.php:1159
 * @route '/gaming-accounts/{game_server_account}/api/databases/{databaseId}/phpmyadmin'
 */
    const phpmyadminForm = (args: { game_server_account: string | number, databaseId: string | number } | [game_server_account: string | number, databaseId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: phpmyadmin.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::phpmyadmin
 * @see app/Http/Controllers/GamingAccountController.php:1159
 * @route '/gaming-accounts/{game_server_account}/api/databases/{databaseId}/phpmyadmin'
 */
        phpmyadminForm.get = (args: { game_server_account: string | number, databaseId: string | number } | [game_server_account: string | number, databaseId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: phpmyadmin.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\GamingAccountController::phpmyadmin
 * @see app/Http/Controllers/GamingAccountController.php:1159
 * @route '/gaming-accounts/{game_server_account}/api/databases/{databaseId}/phpmyadmin'
 */
        phpmyadminForm.head = (args: { game_server_account: string | number, databaseId: string | number } | [game_server_account: string | number, databaseId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: phpmyadmin.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    phpmyadmin.form = phpmyadminForm
/**
* @see \App\Http\Controllers\GamingAccountController::exportMethod
 * @see app/Http/Controllers/GamingAccountController.php:1237
 * @route '/gaming-accounts/{game_server_account}/api/databases/{databaseId}/export'
 */
export const exportMethod = (args: { game_server_account: string | number, databaseId: string | number } | [game_server_account: string | number, databaseId: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(args, options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/gaming-accounts/{game_server_account}/api/databases/{databaseId}/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GamingAccountController::exportMethod
 * @see app/Http/Controllers/GamingAccountController.php:1237
 * @route '/gaming-accounts/{game_server_account}/api/databases/{databaseId}/export'
 */
exportMethod.url = (args: { game_server_account: string | number, databaseId: string | number } | [game_server_account: string | number, databaseId: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    game_server_account: args[0],
                    databaseId: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        game_server_account: args.game_server_account,
                                databaseId: args.databaseId,
                }

    return exportMethod.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace('{databaseId}', parsedArgs.databaseId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::exportMethod
 * @see app/Http/Controllers/GamingAccountController.php:1237
 * @route '/gaming-accounts/{game_server_account}/api/databases/{databaseId}/export'
 */
exportMethod.get = (args: { game_server_account: string | number, databaseId: string | number } | [game_server_account: string | number, databaseId: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GamingAccountController::exportMethod
 * @see app/Http/Controllers/GamingAccountController.php:1237
 * @route '/gaming-accounts/{game_server_account}/api/databases/{databaseId}/export'
 */
exportMethod.head = (args: { game_server_account: string | number, databaseId: string | number } | [game_server_account: string | number, databaseId: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::exportMethod
 * @see app/Http/Controllers/GamingAccountController.php:1237
 * @route '/gaming-accounts/{game_server_account}/api/databases/{databaseId}/export'
 */
    const exportMethodForm = (args: { game_server_account: string | number, databaseId: string | number } | [game_server_account: string | number, databaseId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportMethod.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::exportMethod
 * @see app/Http/Controllers/GamingAccountController.php:1237
 * @route '/gaming-accounts/{game_server_account}/api/databases/{databaseId}/export'
 */
        exportMethodForm.get = (args: { game_server_account: string | number, databaseId: string | number } | [game_server_account: string | number, databaseId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\GamingAccountController::exportMethod
 * @see app/Http/Controllers/GamingAccountController.php:1237
 * @route '/gaming-accounts/{game_server_account}/api/databases/{databaseId}/export'
 */
        exportMethodForm.head = (args: { game_server_account: string | number, databaseId: string | number } | [game_server_account: string | number, databaseId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportMethod.form = exportMethodForm
const databases = {
    list: Object.assign(list, list),
credentials: Object.assign(credentials, credentials),
phpmyadmin: Object.assign(phpmyadmin, phpmyadmin),
export: Object.assign(exportMethod, exportMethod),
}

export default databases