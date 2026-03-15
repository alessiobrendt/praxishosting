import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\GamingAccountController::create
 * @see app/Http/Controllers/GamingAccountController.php:1404
 * @route '/gaming-accounts/{game_server_account}/api/schedules/{schedule}/tasks'
 */
export const create = (args: { game_server_account: string | number, schedule: string | number } | [game_server_account: string | number, schedule: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: create.url(args, options),
    method: 'post',
})

create.definition = {
    methods: ["post"],
    url: '/gaming-accounts/{game_server_account}/api/schedules/{schedule}/tasks',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GamingAccountController::create
 * @see app/Http/Controllers/GamingAccountController.php:1404
 * @route '/gaming-accounts/{game_server_account}/api/schedules/{schedule}/tasks'
 */
create.url = (args: { game_server_account: string | number, schedule: string | number } | [game_server_account: string | number, schedule: string | number ], options?: RouteQueryOptions) => {
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

    return create.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace('{schedule}', parsedArgs.schedule.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::create
 * @see app/Http/Controllers/GamingAccountController.php:1404
 * @route '/gaming-accounts/{game_server_account}/api/schedules/{schedule}/tasks'
 */
create.post = (args: { game_server_account: string | number, schedule: string | number } | [game_server_account: string | number, schedule: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: create.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::create
 * @see app/Http/Controllers/GamingAccountController.php:1404
 * @route '/gaming-accounts/{game_server_account}/api/schedules/{schedule}/tasks'
 */
    const createForm = (args: { game_server_account: string | number, schedule: string | number } | [game_server_account: string | number, schedule: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: create.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::create
 * @see app/Http/Controllers/GamingAccountController.php:1404
 * @route '/gaming-accounts/{game_server_account}/api/schedules/{schedule}/tasks'
 */
        createForm.post = (args: { game_server_account: string | number, schedule: string | number } | [game_server_account: string | number, schedule: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: create.url(args, options),
            method: 'post',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\GamingAccountController::deleteMethod
 * @see app/Http/Controllers/GamingAccountController.php:1436
 * @route '/gaming-accounts/{game_server_account}/api/schedules/{schedule}/tasks/{task}'
 */
export const deleteMethod = (args: { game_server_account: string | number, schedule: string | number, task: string | number } | [game_server_account: string | number, schedule: string | number, task: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMethod.url(args, options),
    method: 'delete',
})

deleteMethod.definition = {
    methods: ["delete"],
    url: '/gaming-accounts/{game_server_account}/api/schedules/{schedule}/tasks/{task}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\GamingAccountController::deleteMethod
 * @see app/Http/Controllers/GamingAccountController.php:1436
 * @route '/gaming-accounts/{game_server_account}/api/schedules/{schedule}/tasks/{task}'
 */
deleteMethod.url = (args: { game_server_account: string | number, schedule: string | number, task: string | number } | [game_server_account: string | number, schedule: string | number, task: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    game_server_account: args[0],
                    schedule: args[1],
                    task: args[2],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        game_server_account: args.game_server_account,
                                schedule: args.schedule,
                                task: args.task,
                }

    return deleteMethod.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace('{schedule}', parsedArgs.schedule.toString())
            .replace('{task}', parsedArgs.task.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::deleteMethod
 * @see app/Http/Controllers/GamingAccountController.php:1436
 * @route '/gaming-accounts/{game_server_account}/api/schedules/{schedule}/tasks/{task}'
 */
deleteMethod.delete = (args: { game_server_account: string | number, schedule: string | number, task: string | number } | [game_server_account: string | number, schedule: string | number, task: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMethod.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::deleteMethod
 * @see app/Http/Controllers/GamingAccountController.php:1436
 * @route '/gaming-accounts/{game_server_account}/api/schedules/{schedule}/tasks/{task}'
 */
    const deleteMethodForm = (args: { game_server_account: string | number, schedule: string | number, task: string | number } | [game_server_account: string | number, schedule: string | number, task: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/GamingAccountController.php:1436
 * @route '/gaming-accounts/{game_server_account}/api/schedules/{schedule}/tasks/{task}'
 */
        deleteMethodForm.delete = (args: { game_server_account: string | number, schedule: string | number, task: string | number } | [game_server_account: string | number, schedule: string | number, task: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: deleteMethod.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    deleteMethod.form = deleteMethodForm
const tasks = {
    create: Object.assign(create, create),
delete: Object.assign(deleteMethod, deleteMethod),
}

export default tasks