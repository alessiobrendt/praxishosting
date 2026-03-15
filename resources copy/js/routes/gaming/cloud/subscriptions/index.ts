import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
import servers from './servers'
import shares from './shares'
import invitations from './invitations'
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
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::autoRenewBalance
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:770
 * @route '/gaming/cloud/subscriptions/{subscription}/auto-renew-balance'
 */
export const autoRenewBalance = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: autoRenewBalance.url(args, options),
    method: 'post',
})

autoRenewBalance.definition = {
    methods: ["post"],
    url: '/gaming/cloud/subscriptions/{subscription}/auto-renew-balance',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::autoRenewBalance
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:770
 * @route '/gaming/cloud/subscriptions/{subscription}/auto-renew-balance'
 */
autoRenewBalance.url = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return autoRenewBalance.definition.url
            .replace('{subscription}', parsedArgs.subscription.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::autoRenewBalance
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:770
 * @route '/gaming/cloud/subscriptions/{subscription}/auto-renew-balance'
 */
autoRenewBalance.post = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: autoRenewBalance.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::autoRenewBalance
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:770
 * @route '/gaming/cloud/subscriptions/{subscription}/auto-renew-balance'
 */
    const autoRenewBalanceForm = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: autoRenewBalance.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::autoRenewBalance
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:770
 * @route '/gaming/cloud/subscriptions/{subscription}/auto-renew-balance'
 */
        autoRenewBalanceForm.post = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: autoRenewBalance.url(args, options),
            method: 'post',
        })
    
    autoRenewBalance.form = autoRenewBalanceForm
/**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::autoRenewMollieSubscription
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:805
 * @route '/gaming/cloud/subscriptions/{subscription}/auto-renew-mollie-subscription'
 */
export const autoRenewMollieSubscription = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: autoRenewMollieSubscription.url(args, options),
    method: 'post',
})

autoRenewMollieSubscription.definition = {
    methods: ["post"],
    url: '/gaming/cloud/subscriptions/{subscription}/auto-renew-mollie-subscription',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::autoRenewMollieSubscription
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:805
 * @route '/gaming/cloud/subscriptions/{subscription}/auto-renew-mollie-subscription'
 */
autoRenewMollieSubscription.url = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return autoRenewMollieSubscription.definition.url
            .replace('{subscription}', parsedArgs.subscription.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::autoRenewMollieSubscription
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:805
 * @route '/gaming/cloud/subscriptions/{subscription}/auto-renew-mollie-subscription'
 */
autoRenewMollieSubscription.post = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: autoRenewMollieSubscription.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::autoRenewMollieSubscription
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:805
 * @route '/gaming/cloud/subscriptions/{subscription}/auto-renew-mollie-subscription'
 */
    const autoRenewMollieSubscriptionForm = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: autoRenewMollieSubscription.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GameserverCloudSubscriptionController::autoRenewMollieSubscription
 * @see app/Http/Controllers/GameserverCloudSubscriptionController.php:805
 * @route '/gaming/cloud/subscriptions/{subscription}/auto-renew-mollie-subscription'
 */
        autoRenewMollieSubscriptionForm.post = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: autoRenewMollieSubscription.url(args, options),
            method: 'post',
        })
    
    autoRenewMollieSubscription.form = autoRenewMollieSubscriptionForm
const subscriptions = {
    index: Object.assign(index, index),
show: Object.assign(show, show),
eggVariables: Object.assign(eggVariables, eggVariables),
servers: Object.assign(servers, servers),
renew: Object.assign(renew, renew),
autoRenewBalance: Object.assign(autoRenewBalance, autoRenewBalance),
autoRenewMollieSubscription: Object.assign(autoRenewMollieSubscription, autoRenewMollieSubscription),
shares: Object.assign(shares, shares),
invitations: Object.assign(invitations, invitations),
}

export default subscriptions