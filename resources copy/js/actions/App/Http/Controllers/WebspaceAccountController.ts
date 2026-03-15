import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
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
* @see \App\Http\Controllers\WebspaceAccountController::showConnectDomain
 * @see app/Http/Controllers/WebspaceAccountController.php:167
 * @route '/webspace-accounts/{webspace_account}/connect-domain'
 */
export const showConnectDomain = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showConnectDomain.url(args, options),
    method: 'get',
})

showConnectDomain.definition = {
    methods: ["get","head"],
    url: '/webspace-accounts/{webspace_account}/connect-domain',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WebspaceAccountController::showConnectDomain
 * @see app/Http/Controllers/WebspaceAccountController.php:167
 * @route '/webspace-accounts/{webspace_account}/connect-domain'
 */
showConnectDomain.url = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return showConnectDomain.definition.url
            .replace('{webspace_account}', parsedArgs.webspace_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WebspaceAccountController::showConnectDomain
 * @see app/Http/Controllers/WebspaceAccountController.php:167
 * @route '/webspace-accounts/{webspace_account}/connect-domain'
 */
showConnectDomain.get = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showConnectDomain.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\WebspaceAccountController::showConnectDomain
 * @see app/Http/Controllers/WebspaceAccountController.php:167
 * @route '/webspace-accounts/{webspace_account}/connect-domain'
 */
showConnectDomain.head = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showConnectDomain.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\WebspaceAccountController::showConnectDomain
 * @see app/Http/Controllers/WebspaceAccountController.php:167
 * @route '/webspace-accounts/{webspace_account}/connect-domain'
 */
    const showConnectDomainForm = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: showConnectDomain.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\WebspaceAccountController::showConnectDomain
 * @see app/Http/Controllers/WebspaceAccountController.php:167
 * @route '/webspace-accounts/{webspace_account}/connect-domain'
 */
        showConnectDomainForm.get = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showConnectDomain.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\WebspaceAccountController::showConnectDomain
 * @see app/Http/Controllers/WebspaceAccountController.php:167
 * @route '/webspace-accounts/{webspace_account}/connect-domain'
 */
        showConnectDomainForm.head = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showConnectDomain.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    showConnectDomain.form = showConnectDomainForm
/**
* @see \App\Http\Controllers\WebspaceAccountController::storeConnectDomain
 * @see app/Http/Controllers/WebspaceAccountController.php:206
 * @route '/webspace-accounts/{webspace_account}/connect-domain'
 */
export const storeConnectDomain = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeConnectDomain.url(args, options),
    method: 'post',
})

storeConnectDomain.definition = {
    methods: ["post"],
    url: '/webspace-accounts/{webspace_account}/connect-domain',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WebspaceAccountController::storeConnectDomain
 * @see app/Http/Controllers/WebspaceAccountController.php:206
 * @route '/webspace-accounts/{webspace_account}/connect-domain'
 */
storeConnectDomain.url = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return storeConnectDomain.definition.url
            .replace('{webspace_account}', parsedArgs.webspace_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WebspaceAccountController::storeConnectDomain
 * @see app/Http/Controllers/WebspaceAccountController.php:206
 * @route '/webspace-accounts/{webspace_account}/connect-domain'
 */
storeConnectDomain.post = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeConnectDomain.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\WebspaceAccountController::storeConnectDomain
 * @see app/Http/Controllers/WebspaceAccountController.php:206
 * @route '/webspace-accounts/{webspace_account}/connect-domain'
 */
    const storeConnectDomainForm = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeConnectDomain.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\WebspaceAccountController::storeConnectDomain
 * @see app/Http/Controllers/WebspaceAccountController.php:206
 * @route '/webspace-accounts/{webspace_account}/connect-domain'
 */
        storeConnectDomainForm.post = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeConnectDomain.url(args, options),
            method: 'post',
        })
    
    storeConnectDomain.form = storeConnectDomainForm
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
* @see \App\Http\Controllers\WebspaceAccountController::cancelSubscription
 * @see app/Http/Controllers/WebspaceAccountController.php:496
 * @route '/webspace-accounts/{webspace_account}/subscription/cancel'
 */
export const cancelSubscription = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancelSubscription.url(args, options),
    method: 'post',
})

cancelSubscription.definition = {
    methods: ["post"],
    url: '/webspace-accounts/{webspace_account}/subscription/cancel',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WebspaceAccountController::cancelSubscription
 * @see app/Http/Controllers/WebspaceAccountController.php:496
 * @route '/webspace-accounts/{webspace_account}/subscription/cancel'
 */
cancelSubscription.url = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return cancelSubscription.definition.url
            .replace('{webspace_account}', parsedArgs.webspace_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WebspaceAccountController::cancelSubscription
 * @see app/Http/Controllers/WebspaceAccountController.php:496
 * @route '/webspace-accounts/{webspace_account}/subscription/cancel'
 */
cancelSubscription.post = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancelSubscription.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\WebspaceAccountController::cancelSubscription
 * @see app/Http/Controllers/WebspaceAccountController.php:496
 * @route '/webspace-accounts/{webspace_account}/subscription/cancel'
 */
    const cancelSubscriptionForm = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cancelSubscription.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\WebspaceAccountController::cancelSubscription
 * @see app/Http/Controllers/WebspaceAccountController.php:496
 * @route '/webspace-accounts/{webspace_account}/subscription/cancel'
 */
        cancelSubscriptionForm.post = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cancelSubscription.url(args, options),
            method: 'post',
        })
    
    cancelSubscription.form = cancelSubscriptionForm
/**
* @see \App\Http\Controllers\WebspaceAccountController::setAutoRenewWithBalance
 * @see app/Http/Controllers/WebspaceAccountController.php:376
 * @route '/webspace-accounts/{webspace_account}/auto-renew-balance'
 */
export const setAutoRenewWithBalance = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: setAutoRenewWithBalance.url(args, options),
    method: 'post',
})

setAutoRenewWithBalance.definition = {
    methods: ["post"],
    url: '/webspace-accounts/{webspace_account}/auto-renew-balance',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WebspaceAccountController::setAutoRenewWithBalance
 * @see app/Http/Controllers/WebspaceAccountController.php:376
 * @route '/webspace-accounts/{webspace_account}/auto-renew-balance'
 */
setAutoRenewWithBalance.url = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return setAutoRenewWithBalance.definition.url
            .replace('{webspace_account}', parsedArgs.webspace_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WebspaceAccountController::setAutoRenewWithBalance
 * @see app/Http/Controllers/WebspaceAccountController.php:376
 * @route '/webspace-accounts/{webspace_account}/auto-renew-balance'
 */
setAutoRenewWithBalance.post = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: setAutoRenewWithBalance.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\WebspaceAccountController::setAutoRenewWithBalance
 * @see app/Http/Controllers/WebspaceAccountController.php:376
 * @route '/webspace-accounts/{webspace_account}/auto-renew-balance'
 */
    const setAutoRenewWithBalanceForm = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: setAutoRenewWithBalance.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\WebspaceAccountController::setAutoRenewWithBalance
 * @see app/Http/Controllers/WebspaceAccountController.php:376
 * @route '/webspace-accounts/{webspace_account}/auto-renew-balance'
 */
        setAutoRenewWithBalanceForm.post = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: setAutoRenewWithBalance.url(args, options),
            method: 'post',
        })
    
    setAutoRenewWithBalance.form = setAutoRenewWithBalanceForm
/**
* @see \App\Http\Controllers\WebspaceAccountController::createMollieSubscription
 * @see app/Http/Controllers/WebspaceAccountController.php:410
 * @route '/webspace-accounts/{webspace_account}/auto-renew-mollie-subscription'
 */
export const createMollieSubscription = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createMollieSubscription.url(args, options),
    method: 'post',
})

createMollieSubscription.definition = {
    methods: ["post"],
    url: '/webspace-accounts/{webspace_account}/auto-renew-mollie-subscription',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WebspaceAccountController::createMollieSubscription
 * @see app/Http/Controllers/WebspaceAccountController.php:410
 * @route '/webspace-accounts/{webspace_account}/auto-renew-mollie-subscription'
 */
createMollieSubscription.url = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return createMollieSubscription.definition.url
            .replace('{webspace_account}', parsedArgs.webspace_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WebspaceAccountController::createMollieSubscription
 * @see app/Http/Controllers/WebspaceAccountController.php:410
 * @route '/webspace-accounts/{webspace_account}/auto-renew-mollie-subscription'
 */
createMollieSubscription.post = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createMollieSubscription.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\WebspaceAccountController::createMollieSubscription
 * @see app/Http/Controllers/WebspaceAccountController.php:410
 * @route '/webspace-accounts/{webspace_account}/auto-renew-mollie-subscription'
 */
    const createMollieSubscriptionForm = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: createMollieSubscription.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\WebspaceAccountController::createMollieSubscription
 * @see app/Http/Controllers/WebspaceAccountController.php:410
 * @route '/webspace-accounts/{webspace_account}/auto-renew-mollie-subscription'
 */
        createMollieSubscriptionForm.post = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: createMollieSubscription.url(args, options),
            method: 'post',
        })
    
    createMollieSubscription.form = createMollieSubscriptionForm
const WebspaceAccountController = { index, pleskLogin, showConnectDomain, storeConnectDomain, show, renew, cancelSubscription, setAutoRenewWithBalance, createMollieSubscription }

export default WebspaceAccountController