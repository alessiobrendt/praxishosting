import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import connectDomain from './connect-domain'
import subdomain from './subdomain'
import subscription from './subscription'
import shares from './shares'
import invitations from './invitations'
import api from './api'
/**
* @see \App\Http\Controllers\GamingAccountController::index
 * @see app/Http/Controllers/GamingAccountController.php:50
 * @route '/gaming-accounts'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/gaming-accounts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GamingAccountController::index
 * @see app/Http/Controllers/GamingAccountController.php:50
 * @route '/gaming-accounts'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::index
 * @see app/Http/Controllers/GamingAccountController.php:50
 * @route '/gaming-accounts'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GamingAccountController::index
 * @see app/Http/Controllers/GamingAccountController.php:50
 * @route '/gaming-accounts'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::index
 * @see app/Http/Controllers/GamingAccountController.php:50
 * @route '/gaming-accounts'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::index
 * @see app/Http/Controllers/GamingAccountController.php:50
 * @route '/gaming-accounts'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\GamingAccountController::index
 * @see app/Http/Controllers/GamingAccountController.php:50
 * @route '/gaming-accounts'
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
* @see \App\Http\Controllers\GamingAccountController::show
 * @see app/Http/Controllers/GamingAccountController.php:102
 * @route '/gaming-accounts/{game_server_account}'
 */
export const show = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/gaming-accounts/{game_server_account}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GamingAccountController::show
 * @see app/Http/Controllers/GamingAccountController.php:102
 * @route '/gaming-accounts/{game_server_account}'
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
* @see \App\Http\Controllers\GamingAccountController::show
 * @see app/Http/Controllers/GamingAccountController.php:102
 * @route '/gaming-accounts/{game_server_account}'
 */
show.get = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GamingAccountController::show
 * @see app/Http/Controllers/GamingAccountController.php:102
 * @route '/gaming-accounts/{game_server_account}'
 */
show.head = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::show
 * @see app/Http/Controllers/GamingAccountController.php:102
 * @route '/gaming-accounts/{game_server_account}'
 */
    const showForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::show
 * @see app/Http/Controllers/GamingAccountController.php:102
 * @route '/gaming-accounts/{game_server_account}'
 */
        showForm.get = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\GamingAccountController::show
 * @see app/Http/Controllers/GamingAccountController.php:102
 * @route '/gaming-accounts/{game_server_account}'
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
/**
* @see \App\Http\Controllers\GamingAccountController::overview
 * @see app/Http/Controllers/GamingAccountController.php:614
 * @route '/gaming-accounts/{game_server_account}/overview'
 */
export const overview = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: overview.url(args, options),
    method: 'get',
})

overview.definition = {
    methods: ["get","head"],
    url: '/gaming-accounts/{game_server_account}/overview',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GamingAccountController::overview
 * @see app/Http/Controllers/GamingAccountController.php:614
 * @route '/gaming-accounts/{game_server_account}/overview'
 */
overview.url = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return overview.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::overview
 * @see app/Http/Controllers/GamingAccountController.php:614
 * @route '/gaming-accounts/{game_server_account}/overview'
 */
overview.get = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: overview.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GamingAccountController::overview
 * @see app/Http/Controllers/GamingAccountController.php:614
 * @route '/gaming-accounts/{game_server_account}/overview'
 */
overview.head = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: overview.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::overview
 * @see app/Http/Controllers/GamingAccountController.php:614
 * @route '/gaming-accounts/{game_server_account}/overview'
 */
    const overviewForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: overview.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::overview
 * @see app/Http/Controllers/GamingAccountController.php:614
 * @route '/gaming-accounts/{game_server_account}/overview'
 */
        overviewForm.get = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: overview.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\GamingAccountController::overview
 * @see app/Http/Controllers/GamingAccountController.php:614
 * @route '/gaming-accounts/{game_server_account}/overview'
 */
        overviewForm.head = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: overview.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    overview.form = overviewForm
/**
* @see \App\Http\Controllers\GamingAccountController::power
 * @see app/Http/Controllers/GamingAccountController.php:251
 * @route '/gaming-accounts/{game_server_account}/power'
 */
export const power = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: power.url(args, options),
    method: 'post',
})

power.definition = {
    methods: ["post"],
    url: '/gaming-accounts/{game_server_account}/power',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GamingAccountController::power
 * @see app/Http/Controllers/GamingAccountController.php:251
 * @route '/gaming-accounts/{game_server_account}/power'
 */
power.url = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return power.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::power
 * @see app/Http/Controllers/GamingAccountController.php:251
 * @route '/gaming-accounts/{game_server_account}/power'
 */
power.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: power.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::power
 * @see app/Http/Controllers/GamingAccountController.php:251
 * @route '/gaming-accounts/{game_server_account}/power'
 */
    const powerForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: power.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::power
 * @see app/Http/Controllers/GamingAccountController.php:251
 * @route '/gaming-accounts/{game_server_account}/power'
 */
        powerForm.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: power.url(args, options),
            method: 'post',
        })
    
    power.form = powerForm
/**
* @see \App\Http\Controllers\GamingAccountController::renew
 * @see app/Http/Controllers/GamingAccountController.php:1455
 * @route '/gaming-accounts/{game_server_account}/renew'
 */
export const renew = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: renew.url(args, options),
    method: 'post',
})

renew.definition = {
    methods: ["post"],
    url: '/gaming-accounts/{game_server_account}/renew',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GamingAccountController::renew
 * @see app/Http/Controllers/GamingAccountController.php:1455
 * @route '/gaming-accounts/{game_server_account}/renew'
 */
renew.url = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return renew.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::renew
 * @see app/Http/Controllers/GamingAccountController.php:1455
 * @route '/gaming-accounts/{game_server_account}/renew'
 */
renew.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: renew.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::renew
 * @see app/Http/Controllers/GamingAccountController.php:1455
 * @route '/gaming-accounts/{game_server_account}/renew'
 */
    const renewForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: renew.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::renew
 * @see app/Http/Controllers/GamingAccountController.php:1455
 * @route '/gaming-accounts/{game_server_account}/renew'
 */
        renewForm.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: renew.url(args, options),
            method: 'post',
        })
    
    renew.form = renewForm
/**
* @see \App\Http\Controllers\GamingAccountController::autoRenewBalance
 * @see app/Http/Controllers/GamingAccountController.php:1566
 * @route '/gaming-accounts/{game_server_account}/auto-renew-balance'
 */
export const autoRenewBalance = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: autoRenewBalance.url(args, options),
    method: 'post',
})

autoRenewBalance.definition = {
    methods: ["post"],
    url: '/gaming-accounts/{game_server_account}/auto-renew-balance',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GamingAccountController::autoRenewBalance
 * @see app/Http/Controllers/GamingAccountController.php:1566
 * @route '/gaming-accounts/{game_server_account}/auto-renew-balance'
 */
autoRenewBalance.url = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return autoRenewBalance.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::autoRenewBalance
 * @see app/Http/Controllers/GamingAccountController.php:1566
 * @route '/gaming-accounts/{game_server_account}/auto-renew-balance'
 */
autoRenewBalance.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: autoRenewBalance.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::autoRenewBalance
 * @see app/Http/Controllers/GamingAccountController.php:1566
 * @route '/gaming-accounts/{game_server_account}/auto-renew-balance'
 */
    const autoRenewBalanceForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: autoRenewBalance.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::autoRenewBalance
 * @see app/Http/Controllers/GamingAccountController.php:1566
 * @route '/gaming-accounts/{game_server_account}/auto-renew-balance'
 */
        autoRenewBalanceForm.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: autoRenewBalance.url(args, options),
            method: 'post',
        })
    
    autoRenewBalance.form = autoRenewBalanceForm
/**
* @see \App\Http\Controllers\GamingAccountController::autoRenewMollieSubscription
 * @see app/Http/Controllers/GamingAccountController.php:1607
 * @route '/gaming-accounts/{game_server_account}/auto-renew-mollie-subscription'
 */
export const autoRenewMollieSubscription = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: autoRenewMollieSubscription.url(args, options),
    method: 'post',
})

autoRenewMollieSubscription.definition = {
    methods: ["post"],
    url: '/gaming-accounts/{game_server_account}/auto-renew-mollie-subscription',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GamingAccountController::autoRenewMollieSubscription
 * @see app/Http/Controllers/GamingAccountController.php:1607
 * @route '/gaming-accounts/{game_server_account}/auto-renew-mollie-subscription'
 */
autoRenewMollieSubscription.url = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return autoRenewMollieSubscription.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::autoRenewMollieSubscription
 * @see app/Http/Controllers/GamingAccountController.php:1607
 * @route '/gaming-accounts/{game_server_account}/auto-renew-mollie-subscription'
 */
autoRenewMollieSubscription.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: autoRenewMollieSubscription.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::autoRenewMollieSubscription
 * @see app/Http/Controllers/GamingAccountController.php:1607
 * @route '/gaming-accounts/{game_server_account}/auto-renew-mollie-subscription'
 */
    const autoRenewMollieSubscriptionForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: autoRenewMollieSubscription.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::autoRenewMollieSubscription
 * @see app/Http/Controllers/GamingAccountController.php:1607
 * @route '/gaming-accounts/{game_server_account}/auto-renew-mollie-subscription'
 */
        autoRenewMollieSubscriptionForm.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: autoRenewMollieSubscription.url(args, options),
            method: 'post',
        })
    
    autoRenewMollieSubscription.form = autoRenewMollieSubscriptionForm
const gamingAccounts = {
    index: Object.assign(index, index),
show: Object.assign(show, show),
connectDomain: Object.assign(connectDomain, connectDomain),
subdomain: Object.assign(subdomain, subdomain),
overview: Object.assign(overview, overview),
power: Object.assign(power, power),
renew: Object.assign(renew, renew),
subscription: Object.assign(subscription, subscription),
autoRenewBalance: Object.assign(autoRenewBalance, autoRenewBalance),
autoRenewMollieSubscription: Object.assign(autoRenewMollieSubscription, autoRenewMollieSubscription),
shares: Object.assign(shares, shares),
invitations: Object.assign(invitations, invitations),
api: Object.assign(api, api),
}

export default gamingAccounts