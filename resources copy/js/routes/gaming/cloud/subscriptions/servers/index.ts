import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
import resources from './resources'
/**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::store
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:298
 * @route '/gaming/cloud/subscriptions/{subscription}/servers'
 */
export const store = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/gaming/cloud/subscriptions/{subscription}/servers',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::store
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:298
 * @route '/gaming/cloud/subscriptions/{subscription}/servers'
 */
store.url = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { subscription: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { subscription: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    subscription: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        subscription: typeof args.subscription === 'object'
                ? args.subscription.uuid
                : args.subscription,
                }

    return store.definition.url
            .replace('{subscription}', parsedArgs.subscription.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::store
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:298
 * @route '/gaming/cloud/subscriptions/{subscription}/servers'
 */
store.post = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::store
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:298
 * @route '/gaming/cloud/subscriptions/{subscription}/servers'
 */
    const storeForm = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::store
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:298
 * @route '/gaming/cloud/subscriptions/{subscription}/servers'
 */
        storeForm.post = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::powerAll
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:732
 * @route '/gaming/cloud/subscriptions/{subscription}/servers/power-all'
 */
export const powerAll = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: powerAll.url(args, options),
    method: 'post',
})

powerAll.definition = {
    methods: ["post"],
    url: '/gaming/cloud/subscriptions/{subscription}/servers/power-all',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::powerAll
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:732
 * @route '/gaming/cloud/subscriptions/{subscription}/servers/power-all'
 */
powerAll.url = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { subscription: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { subscription: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    subscription: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        subscription: typeof args.subscription === 'object'
                ? args.subscription.uuid
                : args.subscription,
                }

    return powerAll.definition.url
            .replace('{subscription}', parsedArgs.subscription.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::powerAll
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:732
 * @route '/gaming/cloud/subscriptions/{subscription}/servers/power-all'
 */
powerAll.post = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: powerAll.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::powerAll
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:732
 * @route '/gaming/cloud/subscriptions/{subscription}/servers/power-all'
 */
    const powerAllForm = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: powerAll.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::powerAll
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:732
 * @route '/gaming/cloud/subscriptions/{subscription}/servers/power-all'
 */
        powerAllForm.post = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: powerAll.url(args, options),
            method: 'post',
        })
    
    powerAll.form = powerAllForm
/**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::power
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:884
 * @route '/gaming/cloud/subscriptions/{subscription}/servers/{game_server_account}/power'
 */
export const power = (args: { subscription: string | { uuid: string }, game_server_account: string | number } | [subscription: string | { uuid: string }, game_server_account: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: power.url(args, options),
    method: 'post',
})

power.definition = {
    methods: ["post"],
    url: '/gaming/cloud/subscriptions/{subscription}/servers/{game_server_account}/power',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::power
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:884
 * @route '/gaming/cloud/subscriptions/{subscription}/servers/{game_server_account}/power'
 */
power.url = (args: { subscription: string | { uuid: string }, game_server_account: string | number } | [subscription: string | { uuid: string }, game_server_account: string | number ], options?: RouteQueryOptions) => {
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

    return power.definition.url
            .replace('{subscription}', parsedArgs.subscription.toString())
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::power
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:884
 * @route '/gaming/cloud/subscriptions/{subscription}/servers/{game_server_account}/power'
 */
power.post = (args: { subscription: string | { uuid: string }, game_server_account: string | number } | [subscription: string | { uuid: string }, game_server_account: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: power.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::power
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:884
 * @route '/gaming/cloud/subscriptions/{subscription}/servers/{game_server_account}/power'
 */
    const powerForm = (args: { subscription: string | { uuid: string }, game_server_account: string | number } | [subscription: string | { uuid: string }, game_server_account: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: power.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::power
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:884
 * @route '/gaming/cloud/subscriptions/{subscription}/servers/{game_server_account}/power'
 */
        powerForm.post = (args: { subscription: string | { uuid: string }, game_server_account: string | number } | [subscription: string | { uuid: string }, game_server_account: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: power.url(args, options),
            method: 'post',
        })
    
    power.form = powerForm
/**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::destroy
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:576
 * @route '/gaming/cloud/subscriptions/{subscription}/servers/{game_server_account}'
 */
export const destroy = (args: { subscription: string | { uuid: string }, game_server_account: string | number } | [subscription: string | { uuid: string }, game_server_account: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/gaming/cloud/subscriptions/{subscription}/servers/{game_server_account}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::destroy
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:576
 * @route '/gaming/cloud/subscriptions/{subscription}/servers/{game_server_account}'
 */
destroy.url = (args: { subscription: string | { uuid: string }, game_server_account: string | number } | [subscription: string | { uuid: string }, game_server_account: string | number ], options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{subscription}', parsedArgs.subscription.toString())
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::destroy
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:576
 * @route '/gaming/cloud/subscriptions/{subscription}/servers/{game_server_account}'
 */
destroy.delete = (args: { subscription: string | { uuid: string }, game_server_account: string | number } | [subscription: string | { uuid: string }, game_server_account: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::destroy
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:576
 * @route '/gaming/cloud/subscriptions/{subscription}/servers/{game_server_account}'
 */
    const destroyForm = (args: { subscription: string | { uuid: string }, game_server_account: string | number } | [subscription: string | { uuid: string }, game_server_account: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::destroy
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:576
 * @route '/gaming/cloud/subscriptions/{subscription}/servers/{game_server_account}'
 */
        destroyForm.delete = (args: { subscription: string | { uuid: string }, game_server_account: string | number } | [subscription: string | { uuid: string }, game_server_account: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const servers = {
    store: Object.assign(store, store),
powerAll: Object.assign(powerAll, powerAll),
power: Object.assign(power, power),
destroy: Object.assign(destroy, destroy),
resources: Object.assign(resources, resources),
}

export default servers