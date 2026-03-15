import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
import tasks from './tasks'
/**
* @see \App\Http\Controllers\GamingAccountController::list
 * @see app/Http/Controllers/GamingAccountController.php:1293
 * @route '/gaming-accounts/{game_server_account}/api/schedules'
 */
export const list = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: list.url(args, options),
    method: 'get',
})

list.definition = {
    methods: ["get","head"],
    url: '/gaming-accounts/{game_server_account}/api/schedules',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GamingAccountController::list
 * @see app/Http/Controllers/GamingAccountController.php:1293
 * @route '/gaming-accounts/{game_server_account}/api/schedules'
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
 * @see app/Http/Controllers/GamingAccountController.php:1293
 * @route '/gaming-accounts/{game_server_account}/api/schedules'
 */
list.get = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: list.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GamingAccountController::list
 * @see app/Http/Controllers/GamingAccountController.php:1293
 * @route '/gaming-accounts/{game_server_account}/api/schedules'
 */
list.head = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: list.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::list
 * @see app/Http/Controllers/GamingAccountController.php:1293
 * @route '/gaming-accounts/{game_server_account}/api/schedules'
 */
    const listForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: list.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::list
 * @see app/Http/Controllers/GamingAccountController.php:1293
 * @route '/gaming-accounts/{game_server_account}/api/schedules'
 */
        listForm.get = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: list.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\GamingAccountController::list
 * @see app/Http/Controllers/GamingAccountController.php:1293
 * @route '/gaming-accounts/{game_server_account}/api/schedules'
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
 * @see app/Http/Controllers/GamingAccountController.php:1312
 * @route '/gaming-accounts/{game_server_account}/api/schedules'
 */
export const create = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: create.url(args, options),
    method: 'post',
})

create.definition = {
    methods: ["post"],
    url: '/gaming-accounts/{game_server_account}/api/schedules',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GamingAccountController::create
 * @see app/Http/Controllers/GamingAccountController.php:1312
 * @route '/gaming-accounts/{game_server_account}/api/schedules'
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
 * @see app/Http/Controllers/GamingAccountController.php:1312
 * @route '/gaming-accounts/{game_server_account}/api/schedules'
 */
create.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: create.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::create
 * @see app/Http/Controllers/GamingAccountController.php:1312
 * @route '/gaming-accounts/{game_server_account}/api/schedules'
 */
    const createForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: create.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::create
 * @see app/Http/Controllers/GamingAccountController.php:1312
 * @route '/gaming-accounts/{game_server_account}/api/schedules'
 */
        createForm.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: create.url(args, options),
            method: 'post',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\GamingAccountController::show
 * @see app/Http/Controllers/GamingAccountController.php:1384
 * @route '/gaming-accounts/{game_server_account}/api/schedules/{schedule}'
 */
export const show = (args: { game_server_account: string | number, schedule: string | number } | [game_server_account: string | number, schedule: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/gaming-accounts/{game_server_account}/api/schedules/{schedule}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GamingAccountController::show
 * @see app/Http/Controllers/GamingAccountController.php:1384
 * @route '/gaming-accounts/{game_server_account}/api/schedules/{schedule}'
 */
show.url = (args: { game_server_account: string | number, schedule: string | number } | [game_server_account: string | number, schedule: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    game_server_account: args[0],
                    schedule: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        game_server_account: args.game_server_account,
                                schedule: args.schedule,
                }

    return show.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace('{schedule}', parsedArgs.schedule.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::show
 * @see app/Http/Controllers/GamingAccountController.php:1384
 * @route '/gaming-accounts/{game_server_account}/api/schedules/{schedule}'
 */
show.get = (args: { game_server_account: string | number, schedule: string | number } | [game_server_account: string | number, schedule: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GamingAccountController::show
 * @see app/Http/Controllers/GamingAccountController.php:1384
 * @route '/gaming-accounts/{game_server_account}/api/schedules/{schedule}'
 */
show.head = (args: { game_server_account: string | number, schedule: string | number } | [game_server_account: string | number, schedule: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::show
 * @see app/Http/Controllers/GamingAccountController.php:1384
 * @route '/gaming-accounts/{game_server_account}/api/schedules/{schedule}'
 */
    const showForm = (args: { game_server_account: string | number, schedule: string | number } | [game_server_account: string | number, schedule: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::show
 * @see app/Http/Controllers/GamingAccountController.php:1384
 * @route '/gaming-accounts/{game_server_account}/api/schedules/{schedule}'
 */
        showForm.get = (args: { game_server_account: string | number, schedule: string | number } | [game_server_account: string | number, schedule: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\GamingAccountController::show
 * @see app/Http/Controllers/GamingAccountController.php:1384
 * @route '/gaming-accounts/{game_server_account}/api/schedules/{schedule}'
 */
        showForm.head = (args: { game_server_account: string | number, schedule: string | number } | [game_server_account: string | number, schedule: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\GamingAccountController::deleteMethod
 * @see app/Http/Controllers/GamingAccountController.php:1346
 * @route '/gaming-accounts/{game_server_account}/api/schedules/{schedule}'
 */
export const deleteMethod = (args: { game_server_account: string | number, schedule: string | number } | [game_server_account: string | number, schedule: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMethod.url(args, options),
    method: 'delete',
})

deleteMethod.definition = {
    methods: ["delete"],
    url: '/gaming-accounts/{game_server_account}/api/schedules/{schedule}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\GamingAccountController::deleteMethod
 * @see app/Http/Controllers/GamingAccountController.php:1346
 * @route '/gaming-accounts/{game_server_account}/api/schedules/{schedule}'
 */
deleteMethod.url = (args: { game_server_account: string | number, schedule: string | number } | [game_server_account: string | number, schedule: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    game_server_account: args[0],
                    schedule: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        game_server_account: args.game_server_account,
                                schedule: args.schedule,
                }

    return deleteMethod.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace('{schedule}', parsedArgs.schedule.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::deleteMethod
 * @see app/Http/Controllers/GamingAccountController.php:1346
 * @route '/gaming-accounts/{game_server_account}/api/schedules/{schedule}'
 */
deleteMethod.delete = (args: { game_server_account: string | number, schedule: string | number } | [game_server_account: string | number, schedule: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMethod.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::deleteMethod
 * @see app/Http/Controllers/GamingAccountController.php:1346
 * @route '/gaming-accounts/{game_server_account}/api/schedules/{schedule}'
 */
    const deleteMethodForm = (args: { game_server_account: string | number, schedule: string | number } | [game_server_account: string | number, schedule: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/GamingAccountController.php:1346
 * @route '/gaming-accounts/{game_server_account}/api/schedules/{schedule}'
 */
        deleteMethodForm.delete = (args: { game_server_account: string | number, schedule: string | number } | [game_server_account: string | number, schedule: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: deleteMethod.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    deleteMethod.form = deleteMethodForm
/**
* @see \App\Http\Controllers\GamingAccountController::execute
 * @see app/Http/Controllers/GamingAccountController.php:1365
 * @route '/gaming-accounts/{game_server_account}/api/schedules/{schedule}/execute'
 */
export const execute = (args: { game_server_account: string | number, schedule: string | number } | [game_server_account: string | number, schedule: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: execute.url(args, options),
    method: 'post',
})

execute.definition = {
    methods: ["post"],
    url: '/gaming-accounts/{game_server_account}/api/schedules/{schedule}/execute',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GamingAccountController::execute
 * @see app/Http/Controllers/GamingAccountController.php:1365
 * @route '/gaming-accounts/{game_server_account}/api/schedules/{schedule}/execute'
 */
execute.url = (args: { game_server_account: string | number, schedule: string | number } | [game_server_account: string | number, schedule: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    game_server_account: args[0],
                    schedule: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        game_server_account: args.game_server_account,
                                schedule: args.schedule,
                }

    return execute.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace('{schedule}', parsedArgs.schedule.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::execute
 * @see app/Http/Controllers/GamingAccountController.php:1365
 * @route '/gaming-accounts/{game_server_account}/api/schedules/{schedule}/execute'
 */
execute.post = (args: { game_server_account: string | number, schedule: string | number } | [game_server_account: string | number, schedule: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: execute.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::execute
 * @see app/Http/Controllers/GamingAccountController.php:1365
 * @route '/gaming-accounts/{game_server_account}/api/schedules/{schedule}/execute'
 */
    const executeForm = (args: { game_server_account: string | number, schedule: string | number } | [game_server_account: string | number, schedule: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: execute.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::execute
 * @see app/Http/Controllers/GamingAccountController.php:1365
 * @route '/gaming-accounts/{game_server_account}/api/schedules/{schedule}/execute'
 */
        executeForm.post = (args: { game_server_account: string | number, schedule: string | number } | [game_server_account: string | number, schedule: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: execute.url(args, options),
            method: 'post',
        })
    
    execute.form = executeForm
const schedules = {
    list: Object.assign(list, list),
create: Object.assign(create, create),
show: Object.assign(show, show),
delete: Object.assign(deleteMethod, deleteMethod),
execute: Object.assign(execute, execute),
tasks: Object.assign(tasks, tasks),
}

export default schedules