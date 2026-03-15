import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import connectDomain from './connect-domain'
import subscription from './subscription'
import shares from './shares'
import invitations from './invitations'
/**
* @see \App\Http\Controllers\WebspaceAccountController::index
 * @see app/Http/Controllers/WebspaceAccountController.php:32
 * @route '/webspace-accounts'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/webspace-accounts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WebspaceAccountController::index
 * @see app/Http/Controllers/WebspaceAccountController.php:32
 * @route '/webspace-accounts'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WebspaceAccountController::index
 * @see app/Http/Controllers/WebspaceAccountController.php:32
 * @route '/webspace-accounts'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\WebspaceAccountController::index
 * @see app/Http/Controllers/WebspaceAccountController.php:32
 * @route '/webspace-accounts'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\WebspaceAccountController::index
 * @see app/Http/Controllers/WebspaceAccountController.php:32
 * @route '/webspace-accounts'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\WebspaceAccountController::index
 * @see app/Http/Controllers/WebspaceAccountController.php:32
 * @route '/webspace-accounts'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\WebspaceAccountController::index
 * @see app/Http/Controllers/WebspaceAccountController.php:32
 * @route '/webspace-accounts'
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
* @see \App\Http\Controllers\WebspaceAccountController::pleskLogin
 * @see app/Http/Controllers/WebspaceAccountController.php:531
 * @route '/webspace-accounts/{webspace_account}/plesk-login'
 */
export const pleskLogin = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pleskLogin.url(args, options),
    method: 'get',
})

pleskLogin.definition = {
    methods: ["get","head"],
    url: '/webspace-accounts/{webspace_account}/plesk-login',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WebspaceAccountController::pleskLogin
 * @see app/Http/Controllers/WebspaceAccountController.php:531
 * @route '/webspace-accounts/{webspace_account}/plesk-login'
 */
pleskLogin.url = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { webspace_account: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    webspace_account: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        webspace_account: args.webspace_account,
                }

    return pleskLogin.definition.url
            .replace('{webspace_account}', parsedArgs.webspace_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WebspaceAccountController::pleskLogin
 * @see app/Http/Controllers/WebspaceAccountController.php:531
 * @route '/webspace-accounts/{webspace_account}/plesk-login'
 */
pleskLogin.get = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pleskLogin.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\WebspaceAccountController::pleskLogin
 * @see app/Http/Controllers/WebspaceAccountController.php:531
 * @route '/webspace-accounts/{webspace_account}/plesk-login'
 */
pleskLogin.head = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pleskLogin.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\WebspaceAccountController::pleskLogin
 * @see app/Http/Controllers/WebspaceAccountController.php:531
 * @route '/webspace-accounts/{webspace_account}/plesk-login'
 */
    const pleskLoginForm = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: pleskLogin.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\WebspaceAccountController::pleskLogin
 * @see app/Http/Controllers/WebspaceAccountController.php:531
 * @route '/webspace-accounts/{webspace_account}/plesk-login'
 */
        pleskLoginForm.get = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pleskLogin.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\WebspaceAccountController::pleskLogin
 * @see app/Http/Controllers/WebspaceAccountController.php:531
 * @route '/webspace-accounts/{webspace_account}/plesk-login'
 */
        pleskLoginForm.head = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pleskLogin.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    pleskLogin.form = pleskLoginForm
/**
* @see \App\Http\Controllers\WebspaceAccountController::show
 * @see app/Http/Controllers/WebspaceAccountController.php:55
 * @route '/webspace-accounts/{webspace_account}'
 */
export const show = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/webspace-accounts/{webspace_account}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WebspaceAccountController::show
 * @see app/Http/Controllers/WebspaceAccountController.php:55
 * @route '/webspace-accounts/{webspace_account}'
 */
show.url = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { webspace_account: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    webspace_account: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        webspace_account: args.webspace_account,
                }

    return show.definition.url
            .replace('{webspace_account}', parsedArgs.webspace_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WebspaceAccountController::show
 * @see app/Http/Controllers/WebspaceAccountController.php:55
 * @route '/webspace-accounts/{webspace_account}'
 */
show.get = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\WebspaceAccountController::show
 * @see app/Http/Controllers/WebspaceAccountController.php:55
 * @route '/webspace-accounts/{webspace_account}'
 */
show.head = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\WebspaceAccountController::show
 * @see app/Http/Controllers/WebspaceAccountController.php:55
 * @route '/webspace-accounts/{webspace_account}'
 */
    const showForm = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\WebspaceAccountController::show
 * @see app/Http/Controllers/WebspaceAccountController.php:55
 * @route '/webspace-accounts/{webspace_account}'
 */
        showForm.get = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\WebspaceAccountController::show
 * @see app/Http/Controllers/WebspaceAccountController.php:55
 * @route '/webspace-accounts/{webspace_account}'
 */
        showForm.head = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\WebspaceAccountController::renew
 * @see app/Http/Controllers/WebspaceAccountController.php:272
 * @route '/webspace-accounts/{webspace_account}/renew'
 */
export const renew = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: renew.url(args, options),
    method: 'post',
})

renew.definition = {
    methods: ["post"],
    url: '/webspace-accounts/{webspace_account}/renew',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WebspaceAccountController::renew
 * @see app/Http/Controllers/WebspaceAccountController.php:272
 * @route '/webspace-accounts/{webspace_account}/renew'
 */
renew.url = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { webspace_account: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    webspace_account: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        webspace_account: args.webspace_account,
                }

    return renew.definition.url
            .replace('{webspace_account}', parsedArgs.webspace_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WebspaceAccountController::renew
 * @see app/Http/Controllers/WebspaceAccountController.php:272
 * @route '/webspace-accounts/{webspace_account}/renew'
 */
renew.post = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: renew.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\WebspaceAccountController::renew
 * @see app/Http/Controllers/WebspaceAccountController.php:272
 * @route '/webspace-accounts/{webspace_account}/renew'
 */
    const renewForm = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: renew.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\WebspaceAccountController::renew
 * @see app/Http/Controllers/WebspaceAccountController.php:272
 * @route '/webspace-accounts/{webspace_account}/renew'
 */
        renewForm.post = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: renew.url(args, options),
            method: 'post',
        })
    
    renew.form = renewForm
/**
* @see \App\Http\Controllers\WebspaceAccountController::autoRenewBalance
 * @see app/Http/Controllers/WebspaceAccountController.php:376
 * @route '/webspace-accounts/{webspace_account}/auto-renew-balance'
 */
export const autoRenewBalance = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: autoRenewBalance.url(args, options),
    method: 'post',
})

autoRenewBalance.definition = {
    methods: ["post"],
    url: '/webspace-accounts/{webspace_account}/auto-renew-balance',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WebspaceAccountController::autoRenewBalance
 * @see app/Http/Controllers/WebspaceAccountController.php:376
 * @route '/webspace-accounts/{webspace_account}/auto-renew-balance'
 */
autoRenewBalance.url = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { webspace_account: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    webspace_account: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        webspace_account: args.webspace_account,
                }

    return autoRenewBalance.definition.url
            .replace('{webspace_account}', parsedArgs.webspace_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WebspaceAccountController::autoRenewBalance
 * @see app/Http/Controllers/WebspaceAccountController.php:376
 * @route '/webspace-accounts/{webspace_account}/auto-renew-balance'
 */
autoRenewBalance.post = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: autoRenewBalance.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\WebspaceAccountController::autoRenewBalance
 * @see app/Http/Controllers/WebspaceAccountController.php:376
 * @route '/webspace-accounts/{webspace_account}/auto-renew-balance'
 */
    const autoRenewBalanceForm = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: autoRenewBalance.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\WebspaceAccountController::autoRenewBalance
 * @see app/Http/Controllers/WebspaceAccountController.php:376
 * @route '/webspace-accounts/{webspace_account}/auto-renew-balance'
 */
        autoRenewBalanceForm.post = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: autoRenewBalance.url(args, options),
            method: 'post',
        })
    
    autoRenewBalance.form = autoRenewBalanceForm
/**
* @see \App\Http\Controllers\WebspaceAccountController::autoRenewMollieSubscription
 * @see app/Http/Controllers/WebspaceAccountController.php:410
 * @route '/webspace-accounts/{webspace_account}/auto-renew-mollie-subscription'
 */
export const autoRenewMollieSubscription = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: autoRenewMollieSubscription.url(args, options),
    method: 'post',
})

autoRenewMollieSubscription.definition = {
    methods: ["post"],
    url: '/webspace-accounts/{webspace_account}/auto-renew-mollie-subscription',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WebspaceAccountController::autoRenewMollieSubscription
 * @see app/Http/Controllers/WebspaceAccountController.php:410
 * @route '/webspace-accounts/{webspace_account}/auto-renew-mollie-subscription'
 */
autoRenewMollieSubscription.url = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { webspace_account: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    webspace_account: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        webspace_account: args.webspace_account,
                }

    return autoRenewMollieSubscription.definition.url
            .replace('{webspace_account}', parsedArgs.webspace_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WebspaceAccountController::autoRenewMollieSubscription
 * @see app/Http/Controllers/WebspaceAccountController.php:410
 * @route '/webspace-accounts/{webspace_account}/auto-renew-mollie-subscription'
 */
autoRenewMollieSubscription.post = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: autoRenewMollieSubscription.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\WebspaceAccountController::autoRenewMollieSubscription
 * @see app/Http/Controllers/WebspaceAccountController.php:410
 * @route '/webspace-accounts/{webspace_account}/auto-renew-mollie-subscription'
 */
    const autoRenewMollieSubscriptionForm = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: autoRenewMollieSubscription.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\WebspaceAccountController::autoRenewMollieSubscription
 * @see app/Http/Controllers/WebspaceAccountController.php:410
 * @route '/webspace-accounts/{webspace_account}/auto-renew-mollie-subscription'
 */
        autoRenewMollieSubscriptionForm.post = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: autoRenewMollieSubscription.url(args, options),
            method: 'post',
        })
    
    autoRenewMollieSubscription.form = autoRenewMollieSubscriptionForm
const webspaceAccounts = {
    index: Object.assign(index, index),
pleskLogin: Object.assign(pleskLogin, pleskLogin),
connectDomain: Object.assign(connectDomain, connectDomain),
show: Object.assign(show, show),
renew: Object.assign(renew, renew),
subscription: Object.assign(subscription, subscription),
autoRenewBalance: Object.assign(autoRenewBalance, autoRenewBalance),
autoRenewMollieSubscription: Object.assign(autoRenewMollieSubscription, autoRenewMollieSubscription),
shares: Object.assign(shares, shares),
invitations: Object.assign(invitations, invitations),
}

export default webspaceAccounts