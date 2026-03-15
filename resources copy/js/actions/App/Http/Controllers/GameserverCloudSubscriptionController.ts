import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::index
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:43
 * @route '/gaming/cloud/subscriptions'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/gaming/cloud/subscriptions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::index
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:43
 * @route '/gaming/cloud/subscriptions'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::index
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:43
 * @route '/gaming/cloud/subscriptions'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::index
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:43
 * @route '/gaming/cloud/subscriptions'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::index
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:43
 * @route '/gaming/cloud/subscriptions'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::index
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:43
 * @route '/gaming/cloud/subscriptions'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::index
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:43
 * @route '/gaming/cloud/subscriptions'
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
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::show
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:85
 * @route '/gaming/cloud/subscriptions/{subscription}'
 */
export const show = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/gaming/cloud/subscriptions/{subscription}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::show
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:85
 * @route '/gaming/cloud/subscriptions/{subscription}'
 */
show.url = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{subscription}', parsedArgs.subscription.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::show
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:85
 * @route '/gaming/cloud/subscriptions/{subscription}'
 */
show.get = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::show
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:85
 * @route '/gaming/cloud/subscriptions/{subscription}'
 */
show.head = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::show
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:85
 * @route '/gaming/cloud/subscriptions/{subscription}'
 */
    const showForm = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::show
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:85
 * @route '/gaming/cloud/subscriptions/{subscription}'
 */
        showForm.get = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::show
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:85
 * @route '/gaming/cloud/subscriptions/{subscription}'
 */
        showForm.head = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::eggVariables
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:222
 * @route '/gaming/cloud/subscriptions/{subscription}/egg-variables'
 */
export const eggVariables = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: eggVariables.url(args, options),
    method: 'get',
})

eggVariables.definition = {
    methods: ["get","head"],
    url: '/gaming/cloud/subscriptions/{subscription}/egg-variables',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::eggVariables
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:222
 * @route '/gaming/cloud/subscriptions/{subscription}/egg-variables'
 */
eggVariables.url = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return eggVariables.definition.url
            .replace('{subscription}', parsedArgs.subscription.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::eggVariables
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:222
 * @route '/gaming/cloud/subscriptions/{subscription}/egg-variables'
 */
eggVariables.get = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: eggVariables.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::eggVariables
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:222
 * @route '/gaming/cloud/subscriptions/{subscription}/egg-variables'
 */
eggVariables.head = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: eggVariables.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::eggVariables
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:222
 * @route '/gaming/cloud/subscriptions/{subscription}/egg-variables'
 */
    const eggVariablesForm = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: eggVariables.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::eggVariables
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:222
 * @route '/gaming/cloud/subscriptions/{subscription}/egg-variables'
 */
        eggVariablesForm.get = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: eggVariables.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::eggVariables
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:222
 * @route '/gaming/cloud/subscriptions/{subscription}/egg-variables'
 */
        eggVariablesForm.head = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: eggVariables.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    eggVariables.form = eggVariablesForm
/**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::storeServer
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:298
 * @route '/gaming/cloud/subscriptions/{subscription}/servers'
 */
export const storeServer = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeServer.url(args, options),
    method: 'post',
})

storeServer.definition = {
    methods: ["post"],
    url: '/gaming/cloud/subscriptions/{subscription}/servers',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::storeServer
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:298
 * @route '/gaming/cloud/subscriptions/{subscription}/servers'
 */
storeServer.url = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return storeServer.definition.url
            .replace('{subscription}', parsedArgs.subscription.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::storeServer
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:298
 * @route '/gaming/cloud/subscriptions/{subscription}/servers'
 */
storeServer.post = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeServer.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::storeServer
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:298
 * @route '/gaming/cloud/subscriptions/{subscription}/servers'
 */
    const storeServerForm = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeServer.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::storeServer
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:298
 * @route '/gaming/cloud/subscriptions/{subscription}/servers'
 */
        storeServerForm.post = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeServer.url(args, options),
            method: 'post',
        })
    
    storeServer.form = storeServerForm
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
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::powerServer
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:884
 * @route '/gaming/cloud/subscriptions/{subscription}/servers/{game_server_account}/power'
 */
export const powerServer = (args: { subscription: string | { uuid: string }, game_server_account: string | number } | [subscription: string | { uuid: string }, game_server_account: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: powerServer.url(args, options),
    method: 'post',
})

powerServer.definition = {
    methods: ["post"],
    url: '/gaming/cloud/subscriptions/{subscription}/servers/{game_server_account}/power',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::powerServer
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:884
 * @route '/gaming/cloud/subscriptions/{subscription}/servers/{game_server_account}/power'
 */
powerServer.url = (args: { subscription: string | { uuid: string }, game_server_account: string | number } | [subscription: string | { uuid: string }, game_server_account: string | number ], options?: RouteQueryOptions) => {
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

    return powerServer.definition.url
            .replace('{subscription}', parsedArgs.subscription.toString())
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::powerServer
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:884
 * @route '/gaming/cloud/subscriptions/{subscription}/servers/{game_server_account}/power'
 */
powerServer.post = (args: { subscription: string | { uuid: string }, game_server_account: string | number } | [subscription: string | { uuid: string }, game_server_account: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: powerServer.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::powerServer
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:884
 * @route '/gaming/cloud/subscriptions/{subscription}/servers/{game_server_account}/power'
 */
    const powerServerForm = (args: { subscription: string | { uuid: string }, game_server_account: string | number } | [subscription: string | { uuid: string }, game_server_account: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: powerServer.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::powerServer
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:884
 * @route '/gaming/cloud/subscriptions/{subscription}/servers/{game_server_account}/power'
 */
        powerServerForm.post = (args: { subscription: string | { uuid: string }, game_server_account: string | number } | [subscription: string | { uuid: string }, game_server_account: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: powerServer.url(args, options),
            method: 'post',
        })
    
    powerServer.form = powerServerForm
/**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::destroyServer
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:576
 * @route '/gaming/cloud/subscriptions/{subscription}/servers/{game_server_account}'
 */
export const destroyServer = (args: { subscription: string | { uuid: string }, game_server_account: string | number } | [subscription: string | { uuid: string }, game_server_account: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyServer.url(args, options),
    method: 'delete',
})

destroyServer.definition = {
    methods: ["delete"],
    url: '/gaming/cloud/subscriptions/{subscription}/servers/{game_server_account}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::destroyServer
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:576
 * @route '/gaming/cloud/subscriptions/{subscription}/servers/{game_server_account}'
 */
destroyServer.url = (args: { subscription: string | { uuid: string }, game_server_account: string | number } | [subscription: string | { uuid: string }, game_server_account: string | number ], options?: RouteQueryOptions) => {
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

    return destroyServer.definition.url
            .replace('{subscription}', parsedArgs.subscription.toString())
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::destroyServer
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:576
 * @route '/gaming/cloud/subscriptions/{subscription}/servers/{game_server_account}'
 */
destroyServer.delete = (args: { subscription: string | { uuid: string }, game_server_account: string | number } | [subscription: string | { uuid: string }, game_server_account: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyServer.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::destroyServer
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:576
 * @route '/gaming/cloud/subscriptions/{subscription}/servers/{game_server_account}'
 */
    const destroyServerForm = (args: { subscription: string | { uuid: string }, game_server_account: string | number } | [subscription: string | { uuid: string }, game_server_account: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroyServer.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::destroyServer
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:576
 * @route '/gaming/cloud/subscriptions/{subscription}/servers/{game_server_account}'
 */
        destroyServerForm.delete = (args: { subscription: string | { uuid: string }, game_server_account: string | number } | [subscription: string | { uuid: string }, game_server_account: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroyServer.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroyServer.form = destroyServerForm
/**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::updateServerResources
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:615
 * @route '/gaming/cloud/subscriptions/{subscription}/servers/{game_server_account}/resources'
 */
export const updateServerResources = (args: { subscription: string | { uuid: string }, game_server_account: string | number } | [subscription: string | { uuid: string }, game_server_account: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateServerResources.url(args, options),
    method: 'put',
})

updateServerResources.definition = {
    methods: ["put"],
    url: '/gaming/cloud/subscriptions/{subscription}/servers/{game_server_account}/resources',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::updateServerResources
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:615
 * @route '/gaming/cloud/subscriptions/{subscription}/servers/{game_server_account}/resources'
 */
updateServerResources.url = (args: { subscription: string | { uuid: string }, game_server_account: string | number } | [subscription: string | { uuid: string }, game_server_account: string | number ], options?: RouteQueryOptions) => {
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

    return updateServerResources.definition.url
            .replace('{subscription}', parsedArgs.subscription.toString())
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::updateServerResources
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:615
 * @route '/gaming/cloud/subscriptions/{subscription}/servers/{game_server_account}/resources'
 */
updateServerResources.put = (args: { subscription: string | { uuid: string }, game_server_account: string | number } | [subscription: string | { uuid: string }, game_server_account: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateServerResources.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::updateServerResources
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:615
 * @route '/gaming/cloud/subscriptions/{subscription}/servers/{game_server_account}/resources'
 */
    const updateServerResourcesForm = (args: { subscription: string | { uuid: string }, game_server_account: string | number } | [subscription: string | { uuid: string }, game_server_account: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateServerResources.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::updateServerResources
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:615
 * @route '/gaming/cloud/subscriptions/{subscription}/servers/{game_server_account}/resources'
 */
        updateServerResourcesForm.put = (args: { subscription: string | { uuid: string }, game_server_account: string | number } | [subscription: string | { uuid: string }, game_server_account: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateServerResources.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateServerResources.form = updateServerResourcesForm
/**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::renew
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:678
 * @route '/gaming/cloud/subscriptions/{subscription}/renew'
 */
export const renew = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: renew.url(args, options),
    method: 'post',
})

renew.definition = {
    methods: ["post"],
    url: '/gaming/cloud/subscriptions/{subscription}/renew',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::renew
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:678
 * @route '/gaming/cloud/subscriptions/{subscription}/renew'
 */
renew.url = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return renew.definition.url
            .replace('{subscription}', parsedArgs.subscription.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::renew
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:678
 * @route '/gaming/cloud/subscriptions/{subscription}/renew'
 */
renew.post = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: renew.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::renew
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:678
 * @route '/gaming/cloud/subscriptions/{subscription}/renew'
 */
    const renewForm = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: renew.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::renew
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:678
 * @route '/gaming/cloud/subscriptions/{subscription}/renew'
 */
        renewForm.post = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: renew.url(args, options),
            method: 'post',
        })
    
    renew.form = renewForm
/**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::setAutoRenewWithBalance
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:770
 * @route '/gaming/cloud/subscriptions/{subscription}/auto-renew-balance'
 */
export const setAutoRenewWithBalance = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: setAutoRenewWithBalance.url(args, options),
    method: 'post',
})

setAutoRenewWithBalance.definition = {
    methods: ["post"],
    url: '/gaming/cloud/subscriptions/{subscription}/auto-renew-balance',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::setAutoRenewWithBalance
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:770
 * @route '/gaming/cloud/subscriptions/{subscription}/auto-renew-balance'
 */
setAutoRenewWithBalance.url = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return setAutoRenewWithBalance.definition.url
            .replace('{subscription}', parsedArgs.subscription.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::setAutoRenewWithBalance
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:770
 * @route '/gaming/cloud/subscriptions/{subscription}/auto-renew-balance'
 */
setAutoRenewWithBalance.post = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: setAutoRenewWithBalance.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::setAutoRenewWithBalance
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:770
 * @route '/gaming/cloud/subscriptions/{subscription}/auto-renew-balance'
 */
    const setAutoRenewWithBalanceForm = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: setAutoRenewWithBalance.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::setAutoRenewWithBalance
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:770
 * @route '/gaming/cloud/subscriptions/{subscription}/auto-renew-balance'
 */
        setAutoRenewWithBalanceForm.post = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: setAutoRenewWithBalance.url(args, options),
            method: 'post',
        })
    
    setAutoRenewWithBalance.form = setAutoRenewWithBalanceForm
/**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::createMollieSubscription
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:805
 * @route '/gaming/cloud/subscriptions/{subscription}/auto-renew-mollie-subscription'
 */
export const createMollieSubscription = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createMollieSubscription.url(args, options),
    method: 'post',
})

createMollieSubscription.definition = {
    methods: ["post"],
    url: '/gaming/cloud/subscriptions/{subscription}/auto-renew-mollie-subscription',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::createMollieSubscription
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:805
 * @route '/gaming/cloud/subscriptions/{subscription}/auto-renew-mollie-subscription'
 */
createMollieSubscription.url = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return createMollieSubscription.definition.url
            .replace('{subscription}', parsedArgs.subscription.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::createMollieSubscription
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:805
 * @route '/gaming/cloud/subscriptions/{subscription}/auto-renew-mollie-subscription'
 */
createMollieSubscription.post = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createMollieSubscription.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::createMollieSubscription
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:805
 * @route '/gaming/cloud/subscriptions/{subscription}/auto-renew-mollie-subscription'
 */
    const createMollieSubscriptionForm = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: createMollieSubscription.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::createMollieSubscription
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:805
 * @route '/gaming/cloud/subscriptions/{subscription}/auto-renew-mollie-subscription'
 */
        createMollieSubscriptionForm.post = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: createMollieSubscription.url(args, options),
            method: 'post',
        })
    
    createMollieSubscription.form = createMollieSubscriptionForm
const GameserverCloudSubscriptionController = { index, show, eggVariables, storeServer, powerAll, powerServer, destroyServer, updateServerResources, renew, setAutoRenewWithBalance, createMollieSubscription }

export default GameserverCloudSubscriptionController