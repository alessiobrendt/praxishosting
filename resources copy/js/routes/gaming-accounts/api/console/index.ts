import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\GamingAccountController::websocket
 * @see app/Http/Controllers/GamingAccountController.php:673
 * @route '/gaming-accounts/{game_server_account}/api/console/websocket'
 */
export const websocket = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: websocket.url(args, options),
    method: 'get',
})

websocket.definition = {
    methods: ["get","head"],
    url: '/gaming-accounts/{game_server_account}/api/console/websocket',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GamingAccountController::websocket
 * @see app/Http/Controllers/GamingAccountController.php:673
 * @route '/gaming-accounts/{game_server_account}/api/console/websocket'
 */
websocket.url = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return websocket.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::websocket
 * @see app/Http/Controllers/GamingAccountController.php:673
 * @route '/gaming-accounts/{game_server_account}/api/console/websocket'
 */
websocket.get = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: websocket.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GamingAccountController::websocket
 * @see app/Http/Controllers/GamingAccountController.php:673
 * @route '/gaming-accounts/{game_server_account}/api/console/websocket'
 */
websocket.head = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: websocket.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::websocket
 * @see app/Http/Controllers/GamingAccountController.php:673
 * @route '/gaming-accounts/{game_server_account}/api/console/websocket'
 */
    const websocketForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: websocket.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::websocket
 * @see app/Http/Controllers/GamingAccountController.php:673
 * @route '/gaming-accounts/{game_server_account}/api/console/websocket'
 */
        websocketForm.get = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: websocket.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\GamingAccountController::websocket
 * @see app/Http/Controllers/GamingAccountController.php:673
 * @route '/gaming-accounts/{game_server_account}/api/console/websocket'
 */
        websocketForm.head = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: websocket.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    websocket.form = websocketForm
/**
* @see \App\Http\Controllers\GamingAccountController::command
 * @see app/Http/Controllers/GamingAccountController.php:692
 * @route '/gaming-accounts/{game_server_account}/api/console/command'
 */
export const command = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: command.url(args, options),
    method: 'post',
})

command.definition = {
    methods: ["post"],
    url: '/gaming-accounts/{game_server_account}/api/console/command',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GamingAccountController::command
 * @see app/Http/Controllers/GamingAccountController.php:692
 * @route '/gaming-accounts/{game_server_account}/api/console/command'
 */
command.url = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return command.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::command
 * @see app/Http/Controllers/GamingAccountController.php:692
 * @route '/gaming-accounts/{game_server_account}/api/console/command'
 */
command.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: command.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::command
 * @see app/Http/Controllers/GamingAccountController.php:692
 * @route '/gaming-accounts/{game_server_account}/api/console/command'
 */
    const commandForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: command.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::command
 * @see app/Http/Controllers/GamingAccountController.php:692
 * @route '/gaming-accounts/{game_server_account}/api/console/command'
 */
        commandForm.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: command.url(args, options),
            method: 'post',
        })
    
    command.form = commandForm
const console = {
    websocket: Object.assign(websocket, websocket),
command: Object.assign(command, command),
}

export default console