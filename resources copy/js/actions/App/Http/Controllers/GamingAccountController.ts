import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\GamingAccountController::phpmyadminSignonCredentials
 * @see app/Http/Controllers/GamingAccountController.php:1213
 * @route '/phpmyadmin-signon-credentials'
 */
export const phpmyadminSignonCredentials = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: phpmyadminSignonCredentials.url(options),
    method: 'get',
})

phpmyadminSignonCredentials.definition = {
    methods: ["get","head"],
    url: '/phpmyadmin-signon-credentials',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GamingAccountController::phpmyadminSignonCredentials
 * @see app/Http/Controllers/GamingAccountController.php:1213
 * @route '/phpmyadmin-signon-credentials'
 */
phpmyadminSignonCredentials.url = (options?: RouteQueryOptions) => {
    return phpmyadminSignonCredentials.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::phpmyadminSignonCredentials
 * @see app/Http/Controllers/GamingAccountController.php:1213
 * @route '/phpmyadmin-signon-credentials'
 */
phpmyadminSignonCredentials.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: phpmyadminSignonCredentials.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GamingAccountController::phpmyadminSignonCredentials
 * @see app/Http/Controllers/GamingAccountController.php:1213
 * @route '/phpmyadmin-signon-credentials'
 */
phpmyadminSignonCredentials.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: phpmyadminSignonCredentials.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::phpmyadminSignonCredentials
 * @see app/Http/Controllers/GamingAccountController.php:1213
 * @route '/phpmyadmin-signon-credentials'
 */
    const phpmyadminSignonCredentialsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: phpmyadminSignonCredentials.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::phpmyadminSignonCredentials
 * @see app/Http/Controllers/GamingAccountController.php:1213
 * @route '/phpmyadmin-signon-credentials'
 */
        phpmyadminSignonCredentialsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: phpmyadminSignonCredentials.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\GamingAccountController::phpmyadminSignonCredentials
 * @see app/Http/Controllers/GamingAccountController.php:1213
 * @route '/phpmyadmin-signon-credentials'
 */
        phpmyadminSignonCredentialsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: phpmyadminSignonCredentials.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    phpmyadminSignonCredentials.form = phpmyadminSignonCredentialsForm
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
* @see \App\Http\Controllers\GamingAccountController::showConnectDomain
 * @see app/Http/Controllers/GamingAccountController.php:290
 * @route '/gaming-accounts/{game_server_account}/connect-domain'
 */
export const showConnectDomain = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showConnectDomain.url(args, options),
    method: 'get',
})

showConnectDomain.definition = {
    methods: ["get","head"],
    url: '/gaming-accounts/{game_server_account}/connect-domain',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GamingAccountController::showConnectDomain
 * @see app/Http/Controllers/GamingAccountController.php:290
 * @route '/gaming-accounts/{game_server_account}/connect-domain'
 */
showConnectDomain.url = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return showConnectDomain.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::showConnectDomain
 * @see app/Http/Controllers/GamingAccountController.php:290
 * @route '/gaming-accounts/{game_server_account}/connect-domain'
 */
showConnectDomain.get = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showConnectDomain.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GamingAccountController::showConnectDomain
 * @see app/Http/Controllers/GamingAccountController.php:290
 * @route '/gaming-accounts/{game_server_account}/connect-domain'
 */
showConnectDomain.head = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showConnectDomain.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::showConnectDomain
 * @see app/Http/Controllers/GamingAccountController.php:290
 * @route '/gaming-accounts/{game_server_account}/connect-domain'
 */
    const showConnectDomainForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: showConnectDomain.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::showConnectDomain
 * @see app/Http/Controllers/GamingAccountController.php:290
 * @route '/gaming-accounts/{game_server_account}/connect-domain'
 */
        showConnectDomainForm.get = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showConnectDomain.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\GamingAccountController::showConnectDomain
 * @see app/Http/Controllers/GamingAccountController.php:290
 * @route '/gaming-accounts/{game_server_account}/connect-domain'
 */
        showConnectDomainForm.head = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\GamingAccountController::storeConnectDomain
 * @see app/Http/Controllers/GamingAccountController.php:354
 * @route '/gaming-accounts/{game_server_account}/connect-domain'
 */
export const storeConnectDomain = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeConnectDomain.url(args, options),
    method: 'post',
})

storeConnectDomain.definition = {
    methods: ["post"],
    url: '/gaming-accounts/{game_server_account}/connect-domain',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GamingAccountController::storeConnectDomain
 * @see app/Http/Controllers/GamingAccountController.php:354
 * @route '/gaming-accounts/{game_server_account}/connect-domain'
 */
storeConnectDomain.url = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return storeConnectDomain.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::storeConnectDomain
 * @see app/Http/Controllers/GamingAccountController.php:354
 * @route '/gaming-accounts/{game_server_account}/connect-domain'
 */
storeConnectDomain.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeConnectDomain.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::storeConnectDomain
 * @see app/Http/Controllers/GamingAccountController.php:354
 * @route '/gaming-accounts/{game_server_account}/connect-domain'
 */
    const storeConnectDomainForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeConnectDomain.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::storeConnectDomain
 * @see app/Http/Controllers/GamingAccountController.php:354
 * @route '/gaming-accounts/{game_server_account}/connect-domain'
 */
        storeConnectDomainForm.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeConnectDomain.url(args, options),
            method: 'post',
        })
    
    storeConnectDomain.form = storeConnectDomainForm
/**
* @see \App\Http\Controllers\GamingAccountController::checkSubdomain
 * @see app/Http/Controllers/GamingAccountController.php:447
 * @route '/gaming-accounts/{game_server_account}/subdomain/check'
 */
export const checkSubdomain = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkSubdomain.url(args, options),
    method: 'get',
})

checkSubdomain.definition = {
    methods: ["get","head"],
    url: '/gaming-accounts/{game_server_account}/subdomain/check',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GamingAccountController::checkSubdomain
 * @see app/Http/Controllers/GamingAccountController.php:447
 * @route '/gaming-accounts/{game_server_account}/subdomain/check'
 */
checkSubdomain.url = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return checkSubdomain.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::checkSubdomain
 * @see app/Http/Controllers/GamingAccountController.php:447
 * @route '/gaming-accounts/{game_server_account}/subdomain/check'
 */
checkSubdomain.get = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkSubdomain.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GamingAccountController::checkSubdomain
 * @see app/Http/Controllers/GamingAccountController.php:447
 * @route '/gaming-accounts/{game_server_account}/subdomain/check'
 */
checkSubdomain.head = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: checkSubdomain.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::checkSubdomain
 * @see app/Http/Controllers/GamingAccountController.php:447
 * @route '/gaming-accounts/{game_server_account}/subdomain/check'
 */
    const checkSubdomainForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: checkSubdomain.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::checkSubdomain
 * @see app/Http/Controllers/GamingAccountController.php:447
 * @route '/gaming-accounts/{game_server_account}/subdomain/check'
 */
        checkSubdomainForm.get = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: checkSubdomain.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\GamingAccountController::checkSubdomain
 * @see app/Http/Controllers/GamingAccountController.php:447
 * @route '/gaming-accounts/{game_server_account}/subdomain/check'
 */
        checkSubdomainForm.head = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: checkSubdomain.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    checkSubdomain.form = checkSubdomainForm
/**
* @see \App\Http\Controllers\GamingAccountController::updateSubdomain
 * @see app/Http/Controllers/GamingAccountController.php:500
 * @route '/gaming-accounts/{game_server_account}/subdomain'
 */
export const updateSubdomain = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateSubdomain.url(args, options),
    method: 'put',
})

updateSubdomain.definition = {
    methods: ["put"],
    url: '/gaming-accounts/{game_server_account}/subdomain',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\GamingAccountController::updateSubdomain
 * @see app/Http/Controllers/GamingAccountController.php:500
 * @route '/gaming-accounts/{game_server_account}/subdomain'
 */
updateSubdomain.url = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return updateSubdomain.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::updateSubdomain
 * @see app/Http/Controllers/GamingAccountController.php:500
 * @route '/gaming-accounts/{game_server_account}/subdomain'
 */
updateSubdomain.put = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateSubdomain.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::updateSubdomain
 * @see app/Http/Controllers/GamingAccountController.php:500
 * @route '/gaming-accounts/{game_server_account}/subdomain'
 */
    const updateSubdomainForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateSubdomain.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::updateSubdomain
 * @see app/Http/Controllers/GamingAccountController.php:500
 * @route '/gaming-accounts/{game_server_account}/subdomain'
 */
        updateSubdomainForm.put = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateSubdomain.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateSubdomain.form = updateSubdomainForm
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
* @see \App\Http\Controllers\GamingAccountController::cancelSubscription
 * @see app/Http/Controllers/GamingAccountController.php:1524
 * @route '/gaming-accounts/{game_server_account}/subscription/cancel'
 */
export const cancelSubscription = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancelSubscription.url(args, options),
    method: 'post',
})

cancelSubscription.definition = {
    methods: ["post"],
    url: '/gaming-accounts/{game_server_account}/subscription/cancel',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GamingAccountController::cancelSubscription
 * @see app/Http/Controllers/GamingAccountController.php:1524
 * @route '/gaming-accounts/{game_server_account}/subscription/cancel'
 */
cancelSubscription.url = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return cancelSubscription.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::cancelSubscription
 * @see app/Http/Controllers/GamingAccountController.php:1524
 * @route '/gaming-accounts/{game_server_account}/subscription/cancel'
 */
cancelSubscription.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancelSubscription.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::cancelSubscription
 * @see app/Http/Controllers/GamingAccountController.php:1524
 * @route '/gaming-accounts/{game_server_account}/subscription/cancel'
 */
    const cancelSubscriptionForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cancelSubscription.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::cancelSubscription
 * @see app/Http/Controllers/GamingAccountController.php:1524
 * @route '/gaming-accounts/{game_server_account}/subscription/cancel'
 */
        cancelSubscriptionForm.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cancelSubscription.url(args, options),
            method: 'post',
        })
    
    cancelSubscription.form = cancelSubscriptionForm
/**
* @see \App\Http\Controllers\GamingAccountController::setAutoRenewWithBalance
 * @see app/Http/Controllers/GamingAccountController.php:1566
 * @route '/gaming-accounts/{game_server_account}/auto-renew-balance'
 */
export const setAutoRenewWithBalance = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: setAutoRenewWithBalance.url(args, options),
    method: 'post',
})

setAutoRenewWithBalance.definition = {
    methods: ["post"],
    url: '/gaming-accounts/{game_server_account}/auto-renew-balance',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GamingAccountController::setAutoRenewWithBalance
 * @see app/Http/Controllers/GamingAccountController.php:1566
 * @route '/gaming-accounts/{game_server_account}/auto-renew-balance'
 */
setAutoRenewWithBalance.url = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return setAutoRenewWithBalance.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::setAutoRenewWithBalance
 * @see app/Http/Controllers/GamingAccountController.php:1566
 * @route '/gaming-accounts/{game_server_account}/auto-renew-balance'
 */
setAutoRenewWithBalance.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: setAutoRenewWithBalance.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::setAutoRenewWithBalance
 * @see app/Http/Controllers/GamingAccountController.php:1566
 * @route '/gaming-accounts/{game_server_account}/auto-renew-balance'
 */
    const setAutoRenewWithBalanceForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: setAutoRenewWithBalance.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::setAutoRenewWithBalance
 * @see app/Http/Controllers/GamingAccountController.php:1566
 * @route '/gaming-accounts/{game_server_account}/auto-renew-balance'
 */
        setAutoRenewWithBalanceForm.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: setAutoRenewWithBalance.url(args, options),
            method: 'post',
        })
    
    setAutoRenewWithBalance.form = setAutoRenewWithBalanceForm
/**
* @see \App\Http\Controllers\GamingAccountController::createMollieSubscription
 * @see app/Http/Controllers/GamingAccountController.php:1607
 * @route '/gaming-accounts/{game_server_account}/auto-renew-mollie-subscription'
 */
export const createMollieSubscription = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createMollieSubscription.url(args, options),
    method: 'post',
})

createMollieSubscription.definition = {
    methods: ["post"],
    url: '/gaming-accounts/{game_server_account}/auto-renew-mollie-subscription',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GamingAccountController::createMollieSubscription
 * @see app/Http/Controllers/GamingAccountController.php:1607
 * @route '/gaming-accounts/{game_server_account}/auto-renew-mollie-subscription'
 */
createMollieSubscription.url = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return createMollieSubscription.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::createMollieSubscription
 * @see app/Http/Controllers/GamingAccountController.php:1607
 * @route '/gaming-accounts/{game_server_account}/auto-renew-mollie-subscription'
 */
createMollieSubscription.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createMollieSubscription.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::createMollieSubscription
 * @see app/Http/Controllers/GamingAccountController.php:1607
 * @route '/gaming-accounts/{game_server_account}/auto-renew-mollie-subscription'
 */
    const createMollieSubscriptionForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: createMollieSubscription.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::createMollieSubscription
 * @see app/Http/Controllers/GamingAccountController.php:1607
 * @route '/gaming-accounts/{game_server_account}/auto-renew-mollie-subscription'
 */
        createMollieSubscriptionForm.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: createMollieSubscription.url(args, options),
            method: 'post',
        })
    
    createMollieSubscription.form = createMollieSubscriptionForm
/**
* @see \App\Http\Controllers\GamingAccountController::consoleWebsocket
 * @see app/Http/Controllers/GamingAccountController.php:673
 * @route '/gaming-accounts/{game_server_account}/api/console/websocket'
 */
export const consoleWebsocket = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: consoleWebsocket.url(args, options),
    method: 'get',
})

consoleWebsocket.definition = {
    methods: ["get","head"],
    url: '/gaming-accounts/{game_server_account}/api/console/websocket',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GamingAccountController::consoleWebsocket
 * @see app/Http/Controllers/GamingAccountController.php:673
 * @route '/gaming-accounts/{game_server_account}/api/console/websocket'
 */
consoleWebsocket.url = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return consoleWebsocket.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::consoleWebsocket
 * @see app/Http/Controllers/GamingAccountController.php:673
 * @route '/gaming-accounts/{game_server_account}/api/console/websocket'
 */
consoleWebsocket.get = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: consoleWebsocket.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GamingAccountController::consoleWebsocket
 * @see app/Http/Controllers/GamingAccountController.php:673
 * @route '/gaming-accounts/{game_server_account}/api/console/websocket'
 */
consoleWebsocket.head = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: consoleWebsocket.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::consoleWebsocket
 * @see app/Http/Controllers/GamingAccountController.php:673
 * @route '/gaming-accounts/{game_server_account}/api/console/websocket'
 */
    const consoleWebsocketForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: consoleWebsocket.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::consoleWebsocket
 * @see app/Http/Controllers/GamingAccountController.php:673
 * @route '/gaming-accounts/{game_server_account}/api/console/websocket'
 */
        consoleWebsocketForm.get = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: consoleWebsocket.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\GamingAccountController::consoleWebsocket
 * @see app/Http/Controllers/GamingAccountController.php:673
 * @route '/gaming-accounts/{game_server_account}/api/console/websocket'
 */
        consoleWebsocketForm.head = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: consoleWebsocket.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    consoleWebsocket.form = consoleWebsocketForm
/**
* @see \App\Http\Controllers\GamingAccountController::consoleCommand
 * @see app/Http/Controllers/GamingAccountController.php:692
 * @route '/gaming-accounts/{game_server_account}/api/console/command'
 */
export const consoleCommand = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: consoleCommand.url(args, options),
    method: 'post',
})

consoleCommand.definition = {
    methods: ["post"],
    url: '/gaming-accounts/{game_server_account}/api/console/command',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GamingAccountController::consoleCommand
 * @see app/Http/Controllers/GamingAccountController.php:692
 * @route '/gaming-accounts/{game_server_account}/api/console/command'
 */
consoleCommand.url = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return consoleCommand.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::consoleCommand
 * @see app/Http/Controllers/GamingAccountController.php:692
 * @route '/gaming-accounts/{game_server_account}/api/console/command'
 */
consoleCommand.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: consoleCommand.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::consoleCommand
 * @see app/Http/Controllers/GamingAccountController.php:692
 * @route '/gaming-accounts/{game_server_account}/api/console/command'
 */
    const consoleCommandForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: consoleCommand.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::consoleCommand
 * @see app/Http/Controllers/GamingAccountController.php:692
 * @route '/gaming-accounts/{game_server_account}/api/console/command'
 */
        consoleCommandForm.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: consoleCommand.url(args, options),
            method: 'post',
        })
    
    consoleCommand.form = consoleCommandForm
/**
* @see \App\Http\Controllers\GamingAccountController::filesList
 * @see app/Http/Controllers/GamingAccountController.php:715
 * @route '/gaming-accounts/{game_server_account}/api/files/list'
 */
export const filesList = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: filesList.url(args, options),
    method: 'get',
})

filesList.definition = {
    methods: ["get","head"],
    url: '/gaming-accounts/{game_server_account}/api/files/list',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GamingAccountController::filesList
 * @see app/Http/Controllers/GamingAccountController.php:715
 * @route '/gaming-accounts/{game_server_account}/api/files/list'
 */
filesList.url = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return filesList.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::filesList
 * @see app/Http/Controllers/GamingAccountController.php:715
 * @route '/gaming-accounts/{game_server_account}/api/files/list'
 */
filesList.get = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: filesList.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GamingAccountController::filesList
 * @see app/Http/Controllers/GamingAccountController.php:715
 * @route '/gaming-accounts/{game_server_account}/api/files/list'
 */
filesList.head = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: filesList.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::filesList
 * @see app/Http/Controllers/GamingAccountController.php:715
 * @route '/gaming-accounts/{game_server_account}/api/files/list'
 */
    const filesListForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: filesList.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::filesList
 * @see app/Http/Controllers/GamingAccountController.php:715
 * @route '/gaming-accounts/{game_server_account}/api/files/list'
 */
        filesListForm.get = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: filesList.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\GamingAccountController::filesList
 * @see app/Http/Controllers/GamingAccountController.php:715
 * @route '/gaming-accounts/{game_server_account}/api/files/list'
 */
        filesListForm.head = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: filesList.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    filesList.form = filesListForm
/**
* @see \App\Http\Controllers\GamingAccountController::filesContents
 * @see app/Http/Controllers/GamingAccountController.php:738
 * @route '/gaming-accounts/{game_server_account}/api/files/contents'
 */
export const filesContents = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: filesContents.url(args, options),
    method: 'get',
})

filesContents.definition = {
    methods: ["get","head"],
    url: '/gaming-accounts/{game_server_account}/api/files/contents',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GamingAccountController::filesContents
 * @see app/Http/Controllers/GamingAccountController.php:738
 * @route '/gaming-accounts/{game_server_account}/api/files/contents'
 */
filesContents.url = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return filesContents.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::filesContents
 * @see app/Http/Controllers/GamingAccountController.php:738
 * @route '/gaming-accounts/{game_server_account}/api/files/contents'
 */
filesContents.get = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: filesContents.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GamingAccountController::filesContents
 * @see app/Http/Controllers/GamingAccountController.php:738
 * @route '/gaming-accounts/{game_server_account}/api/files/contents'
 */
filesContents.head = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: filesContents.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::filesContents
 * @see app/Http/Controllers/GamingAccountController.php:738
 * @route '/gaming-accounts/{game_server_account}/api/files/contents'
 */
    const filesContentsForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: filesContents.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::filesContents
 * @see app/Http/Controllers/GamingAccountController.php:738
 * @route '/gaming-accounts/{game_server_account}/api/files/contents'
 */
        filesContentsForm.get = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: filesContents.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\GamingAccountController::filesContents
 * @see app/Http/Controllers/GamingAccountController.php:738
 * @route '/gaming-accounts/{game_server_account}/api/files/contents'
 */
        filesContentsForm.head = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: filesContents.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    filesContents.form = filesContentsForm
/**
* @see \App\Http\Controllers\GamingAccountController::filesWrite
 * @see app/Http/Controllers/GamingAccountController.php:761
 * @route '/gaming-accounts/{game_server_account}/api/files/write'
 */
export const filesWrite = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: filesWrite.url(args, options),
    method: 'post',
})

filesWrite.definition = {
    methods: ["post"],
    url: '/gaming-accounts/{game_server_account}/api/files/write',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GamingAccountController::filesWrite
 * @see app/Http/Controllers/GamingAccountController.php:761
 * @route '/gaming-accounts/{game_server_account}/api/files/write'
 */
filesWrite.url = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return filesWrite.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::filesWrite
 * @see app/Http/Controllers/GamingAccountController.php:761
 * @route '/gaming-accounts/{game_server_account}/api/files/write'
 */
filesWrite.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: filesWrite.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::filesWrite
 * @see app/Http/Controllers/GamingAccountController.php:761
 * @route '/gaming-accounts/{game_server_account}/api/files/write'
 */
    const filesWriteForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: filesWrite.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::filesWrite
 * @see app/Http/Controllers/GamingAccountController.php:761
 * @route '/gaming-accounts/{game_server_account}/api/files/write'
 */
        filesWriteForm.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: filesWrite.url(args, options),
            method: 'post',
        })
    
    filesWrite.form = filesWriteForm
/**
* @see \App\Http\Controllers\GamingAccountController::filesDownload
 * @see app/Http/Controllers/GamingAccountController.php:788
 * @route '/gaming-accounts/{game_server_account}/api/files/download'
 */
export const filesDownload = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: filesDownload.url(args, options),
    method: 'get',
})

filesDownload.definition = {
    methods: ["get","head"],
    url: '/gaming-accounts/{game_server_account}/api/files/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GamingAccountController::filesDownload
 * @see app/Http/Controllers/GamingAccountController.php:788
 * @route '/gaming-accounts/{game_server_account}/api/files/download'
 */
filesDownload.url = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return filesDownload.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::filesDownload
 * @see app/Http/Controllers/GamingAccountController.php:788
 * @route '/gaming-accounts/{game_server_account}/api/files/download'
 */
filesDownload.get = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: filesDownload.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GamingAccountController::filesDownload
 * @see app/Http/Controllers/GamingAccountController.php:788
 * @route '/gaming-accounts/{game_server_account}/api/files/download'
 */
filesDownload.head = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: filesDownload.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::filesDownload
 * @see app/Http/Controllers/GamingAccountController.php:788
 * @route '/gaming-accounts/{game_server_account}/api/files/download'
 */
    const filesDownloadForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: filesDownload.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::filesDownload
 * @see app/Http/Controllers/GamingAccountController.php:788
 * @route '/gaming-accounts/{game_server_account}/api/files/download'
 */
        filesDownloadForm.get = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: filesDownload.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\GamingAccountController::filesDownload
 * @see app/Http/Controllers/GamingAccountController.php:788
 * @route '/gaming-accounts/{game_server_account}/api/files/download'
 */
        filesDownloadForm.head = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: filesDownload.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    filesDownload.form = filesDownloadForm
/**
* @see \App\Http\Controllers\GamingAccountController::filesCreateFolder
 * @see app/Http/Controllers/GamingAccountController.php:826
 * @route '/gaming-accounts/{game_server_account}/api/files/create-folder'
 */
export const filesCreateFolder = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: filesCreateFolder.url(args, options),
    method: 'post',
})

filesCreateFolder.definition = {
    methods: ["post"],
    url: '/gaming-accounts/{game_server_account}/api/files/create-folder',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GamingAccountController::filesCreateFolder
 * @see app/Http/Controllers/GamingAccountController.php:826
 * @route '/gaming-accounts/{game_server_account}/api/files/create-folder'
 */
filesCreateFolder.url = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return filesCreateFolder.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::filesCreateFolder
 * @see app/Http/Controllers/GamingAccountController.php:826
 * @route '/gaming-accounts/{game_server_account}/api/files/create-folder'
 */
filesCreateFolder.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: filesCreateFolder.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::filesCreateFolder
 * @see app/Http/Controllers/GamingAccountController.php:826
 * @route '/gaming-accounts/{game_server_account}/api/files/create-folder'
 */
    const filesCreateFolderForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: filesCreateFolder.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::filesCreateFolder
 * @see app/Http/Controllers/GamingAccountController.php:826
 * @route '/gaming-accounts/{game_server_account}/api/files/create-folder'
 */
        filesCreateFolderForm.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: filesCreateFolder.url(args, options),
            method: 'post',
        })
    
    filesCreateFolder.form = filesCreateFolderForm
/**
* @see \App\Http\Controllers\GamingAccountController::filesDelete
 * @see app/Http/Controllers/GamingAccountController.php:853
 * @route '/gaming-accounts/{game_server_account}/api/files/delete'
 */
export const filesDelete = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: filesDelete.url(args, options),
    method: 'post',
})

filesDelete.definition = {
    methods: ["post"],
    url: '/gaming-accounts/{game_server_account}/api/files/delete',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GamingAccountController::filesDelete
 * @see app/Http/Controllers/GamingAccountController.php:853
 * @route '/gaming-accounts/{game_server_account}/api/files/delete'
 */
filesDelete.url = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return filesDelete.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::filesDelete
 * @see app/Http/Controllers/GamingAccountController.php:853
 * @route '/gaming-accounts/{game_server_account}/api/files/delete'
 */
filesDelete.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: filesDelete.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::filesDelete
 * @see app/Http/Controllers/GamingAccountController.php:853
 * @route '/gaming-accounts/{game_server_account}/api/files/delete'
 */
    const filesDeleteForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: filesDelete.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::filesDelete
 * @see app/Http/Controllers/GamingAccountController.php:853
 * @route '/gaming-accounts/{game_server_account}/api/files/delete'
 */
        filesDeleteForm.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: filesDelete.url(args, options),
            method: 'post',
        })
    
    filesDelete.form = filesDeleteForm
/**
* @see \App\Http\Controllers\GamingAccountController::filesRename
 * @see app/Http/Controllers/GamingAccountController.php:884
 * @route '/gaming-accounts/{game_server_account}/api/files/rename'
 */
export const filesRename = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: filesRename.url(args, options),
    method: 'put',
})

filesRename.definition = {
    methods: ["put"],
    url: '/gaming-accounts/{game_server_account}/api/files/rename',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\GamingAccountController::filesRename
 * @see app/Http/Controllers/GamingAccountController.php:884
 * @route '/gaming-accounts/{game_server_account}/api/files/rename'
 */
filesRename.url = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return filesRename.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::filesRename
 * @see app/Http/Controllers/GamingAccountController.php:884
 * @route '/gaming-accounts/{game_server_account}/api/files/rename'
 */
filesRename.put = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: filesRename.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::filesRename
 * @see app/Http/Controllers/GamingAccountController.php:884
 * @route '/gaming-accounts/{game_server_account}/api/files/rename'
 */
    const filesRenameForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: filesRename.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::filesRename
 * @see app/Http/Controllers/GamingAccountController.php:884
 * @route '/gaming-accounts/{game_server_account}/api/files/rename'
 */
        filesRenameForm.put = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: filesRename.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    filesRename.form = filesRenameForm
/**
* @see \App\Http\Controllers\GamingAccountController::filesUpload
 * @see app/Http/Controllers/GamingAccountController.php:920
 * @route '/gaming-accounts/{game_server_account}/api/files/upload'
 */
export const filesUpload = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: filesUpload.url(args, options),
    method: 'post',
})

filesUpload.definition = {
    methods: ["post"],
    url: '/gaming-accounts/{game_server_account}/api/files/upload',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GamingAccountController::filesUpload
 * @see app/Http/Controllers/GamingAccountController.php:920
 * @route '/gaming-accounts/{game_server_account}/api/files/upload'
 */
filesUpload.url = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return filesUpload.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::filesUpload
 * @see app/Http/Controllers/GamingAccountController.php:920
 * @route '/gaming-accounts/{game_server_account}/api/files/upload'
 */
filesUpload.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: filesUpload.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::filesUpload
 * @see app/Http/Controllers/GamingAccountController.php:920
 * @route '/gaming-accounts/{game_server_account}/api/files/upload'
 */
    const filesUploadForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: filesUpload.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::filesUpload
 * @see app/Http/Controllers/GamingAccountController.php:920
 * @route '/gaming-accounts/{game_server_account}/api/files/upload'
 */
        filesUploadForm.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: filesUpload.url(args, options),
            method: 'post',
        })
    
    filesUpload.form = filesUploadForm
/**
* @see \App\Http\Controllers\GamingAccountController::filesCompress
 * @see app/Http/Controllers/GamingAccountController.php:960
 * @route '/gaming-accounts/{game_server_account}/api/files/compress'
 */
export const filesCompress = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: filesCompress.url(args, options),
    method: 'post',
})

filesCompress.definition = {
    methods: ["post"],
    url: '/gaming-accounts/{game_server_account}/api/files/compress',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GamingAccountController::filesCompress
 * @see app/Http/Controllers/GamingAccountController.php:960
 * @route '/gaming-accounts/{game_server_account}/api/files/compress'
 */
filesCompress.url = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return filesCompress.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::filesCompress
 * @see app/Http/Controllers/GamingAccountController.php:960
 * @route '/gaming-accounts/{game_server_account}/api/files/compress'
 */
filesCompress.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: filesCompress.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::filesCompress
 * @see app/Http/Controllers/GamingAccountController.php:960
 * @route '/gaming-accounts/{game_server_account}/api/files/compress'
 */
    const filesCompressForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: filesCompress.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::filesCompress
 * @see app/Http/Controllers/GamingAccountController.php:960
 * @route '/gaming-accounts/{game_server_account}/api/files/compress'
 */
        filesCompressForm.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: filesCompress.url(args, options),
            method: 'post',
        })
    
    filesCompress.form = filesCompressForm
/**
* @see \App\Http\Controllers\GamingAccountController::filesDecompress
 * @see app/Http/Controllers/GamingAccountController.php:991
 * @route '/gaming-accounts/{game_server_account}/api/files/decompress'
 */
export const filesDecompress = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: filesDecompress.url(args, options),
    method: 'post',
})

filesDecompress.definition = {
    methods: ["post"],
    url: '/gaming-accounts/{game_server_account}/api/files/decompress',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GamingAccountController::filesDecompress
 * @see app/Http/Controllers/GamingAccountController.php:991
 * @route '/gaming-accounts/{game_server_account}/api/files/decompress'
 */
filesDecompress.url = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return filesDecompress.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::filesDecompress
 * @see app/Http/Controllers/GamingAccountController.php:991
 * @route '/gaming-accounts/{game_server_account}/api/files/decompress'
 */
filesDecompress.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: filesDecompress.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::filesDecompress
 * @see app/Http/Controllers/GamingAccountController.php:991
 * @route '/gaming-accounts/{game_server_account}/api/files/decompress'
 */
    const filesDecompressForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: filesDecompress.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::filesDecompress
 * @see app/Http/Controllers/GamingAccountController.php:991
 * @route '/gaming-accounts/{game_server_account}/api/files/decompress'
 */
        filesDecompressForm.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: filesDecompress.url(args, options),
            method: 'post',
        })
    
    filesDecompress.form = filesDecompressForm
/**
* @see \App\Http\Controllers\GamingAccountController::backupsList
 * @see app/Http/Controllers/GamingAccountController.php:1018
 * @route '/gaming-accounts/{game_server_account}/api/backups'
 */
export const backupsList = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: backupsList.url(args, options),
    method: 'get',
})

backupsList.definition = {
    methods: ["get","head"],
    url: '/gaming-accounts/{game_server_account}/api/backups',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GamingAccountController::backupsList
 * @see app/Http/Controllers/GamingAccountController.php:1018
 * @route '/gaming-accounts/{game_server_account}/api/backups'
 */
backupsList.url = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return backupsList.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::backupsList
 * @see app/Http/Controllers/GamingAccountController.php:1018
 * @route '/gaming-accounts/{game_server_account}/api/backups'
 */
backupsList.get = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: backupsList.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GamingAccountController::backupsList
 * @see app/Http/Controllers/GamingAccountController.php:1018
 * @route '/gaming-accounts/{game_server_account}/api/backups'
 */
backupsList.head = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: backupsList.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::backupsList
 * @see app/Http/Controllers/GamingAccountController.php:1018
 * @route '/gaming-accounts/{game_server_account}/api/backups'
 */
    const backupsListForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: backupsList.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::backupsList
 * @see app/Http/Controllers/GamingAccountController.php:1018
 * @route '/gaming-accounts/{game_server_account}/api/backups'
 */
        backupsListForm.get = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: backupsList.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\GamingAccountController::backupsList
 * @see app/Http/Controllers/GamingAccountController.php:1018
 * @route '/gaming-accounts/{game_server_account}/api/backups'
 */
        backupsListForm.head = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: backupsList.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    backupsList.form = backupsListForm
/**
* @see \App\Http\Controllers\GamingAccountController::backupsCreate
 * @see app/Http/Controllers/GamingAccountController.php:1037
 * @route '/gaming-accounts/{game_server_account}/api/backups'
 */
export const backupsCreate = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: backupsCreate.url(args, options),
    method: 'post',
})

backupsCreate.definition = {
    methods: ["post"],
    url: '/gaming-accounts/{game_server_account}/api/backups',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GamingAccountController::backupsCreate
 * @see app/Http/Controllers/GamingAccountController.php:1037
 * @route '/gaming-accounts/{game_server_account}/api/backups'
 */
backupsCreate.url = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return backupsCreate.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::backupsCreate
 * @see app/Http/Controllers/GamingAccountController.php:1037
 * @route '/gaming-accounts/{game_server_account}/api/backups'
 */
backupsCreate.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: backupsCreate.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::backupsCreate
 * @see app/Http/Controllers/GamingAccountController.php:1037
 * @route '/gaming-accounts/{game_server_account}/api/backups'
 */
    const backupsCreateForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: backupsCreate.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::backupsCreate
 * @see app/Http/Controllers/GamingAccountController.php:1037
 * @route '/gaming-accounts/{game_server_account}/api/backups'
 */
        backupsCreateForm.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: backupsCreate.url(args, options),
            method: 'post',
        })
    
    backupsCreate.form = backupsCreateForm
/**
* @see \App\Http\Controllers\GamingAccountController::backupsDownload
 * @see app/Http/Controllers/GamingAccountController.php:1061
 * @route '/gaming-accounts/{game_server_account}/api/backups/{backupUuid}/download'
 */
export const backupsDownload = (args: { game_server_account: string | number, backupUuid: string | number } | [game_server_account: string | number, backupUuid: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: backupsDownload.url(args, options),
    method: 'get',
})

backupsDownload.definition = {
    methods: ["get","head"],
    url: '/gaming-accounts/{game_server_account}/api/backups/{backupUuid}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GamingAccountController::backupsDownload
 * @see app/Http/Controllers/GamingAccountController.php:1061
 * @route '/gaming-accounts/{game_server_account}/api/backups/{backupUuid}/download'
 */
backupsDownload.url = (args: { game_server_account: string | number, backupUuid: string | number } | [game_server_account: string | number, backupUuid: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    game_server_account: args[0],
                    backupUuid: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        game_server_account: args.game_server_account,
                                backupUuid: args.backupUuid,
                }

    return backupsDownload.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace('{backupUuid}', parsedArgs.backupUuid.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::backupsDownload
 * @see app/Http/Controllers/GamingAccountController.php:1061
 * @route '/gaming-accounts/{game_server_account}/api/backups/{backupUuid}/download'
 */
backupsDownload.get = (args: { game_server_account: string | number, backupUuid: string | number } | [game_server_account: string | number, backupUuid: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: backupsDownload.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GamingAccountController::backupsDownload
 * @see app/Http/Controllers/GamingAccountController.php:1061
 * @route '/gaming-accounts/{game_server_account}/api/backups/{backupUuid}/download'
 */
backupsDownload.head = (args: { game_server_account: string | number, backupUuid: string | number } | [game_server_account: string | number, backupUuid: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: backupsDownload.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::backupsDownload
 * @see app/Http/Controllers/GamingAccountController.php:1061
 * @route '/gaming-accounts/{game_server_account}/api/backups/{backupUuid}/download'
 */
    const backupsDownloadForm = (args: { game_server_account: string | number, backupUuid: string | number } | [game_server_account: string | number, backupUuid: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: backupsDownload.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::backupsDownload
 * @see app/Http/Controllers/GamingAccountController.php:1061
 * @route '/gaming-accounts/{game_server_account}/api/backups/{backupUuid}/download'
 */
        backupsDownloadForm.get = (args: { game_server_account: string | number, backupUuid: string | number } | [game_server_account: string | number, backupUuid: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: backupsDownload.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\GamingAccountController::backupsDownload
 * @see app/Http/Controllers/GamingAccountController.php:1061
 * @route '/gaming-accounts/{game_server_account}/api/backups/{backupUuid}/download'
 */
        backupsDownloadForm.head = (args: { game_server_account: string | number, backupUuid: string | number } | [game_server_account: string | number, backupUuid: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: backupsDownload.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    backupsDownload.form = backupsDownloadForm
/**
* @see \App\Http\Controllers\GamingAccountController::backupsRestore
 * @see app/Http/Controllers/GamingAccountController.php:1084
 * @route '/gaming-accounts/{game_server_account}/api/backups/{backupUuid}/restore'
 */
export const backupsRestore = (args: { game_server_account: string | number, backupUuid: string | number } | [game_server_account: string | number, backupUuid: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: backupsRestore.url(args, options),
    method: 'post',
})

backupsRestore.definition = {
    methods: ["post"],
    url: '/gaming-accounts/{game_server_account}/api/backups/{backupUuid}/restore',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GamingAccountController::backupsRestore
 * @see app/Http/Controllers/GamingAccountController.php:1084
 * @route '/gaming-accounts/{game_server_account}/api/backups/{backupUuid}/restore'
 */
backupsRestore.url = (args: { game_server_account: string | number, backupUuid: string | number } | [game_server_account: string | number, backupUuid: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    game_server_account: args[0],
                    backupUuid: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        game_server_account: args.game_server_account,
                                backupUuid: args.backupUuid,
                }

    return backupsRestore.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace('{backupUuid}', parsedArgs.backupUuid.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::backupsRestore
 * @see app/Http/Controllers/GamingAccountController.php:1084
 * @route '/gaming-accounts/{game_server_account}/api/backups/{backupUuid}/restore'
 */
backupsRestore.post = (args: { game_server_account: string | number, backupUuid: string | number } | [game_server_account: string | number, backupUuid: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: backupsRestore.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::backupsRestore
 * @see app/Http/Controllers/GamingAccountController.php:1084
 * @route '/gaming-accounts/{game_server_account}/api/backups/{backupUuid}/restore'
 */
    const backupsRestoreForm = (args: { game_server_account: string | number, backupUuid: string | number } | [game_server_account: string | number, backupUuid: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: backupsRestore.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::backupsRestore
 * @see app/Http/Controllers/GamingAccountController.php:1084
 * @route '/gaming-accounts/{game_server_account}/api/backups/{backupUuid}/restore'
 */
        backupsRestoreForm.post = (args: { game_server_account: string | number, backupUuid: string | number } | [game_server_account: string | number, backupUuid: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: backupsRestore.url(args, options),
            method: 'post',
        })
    
    backupsRestore.form = backupsRestoreForm
/**
* @see \App\Http\Controllers\GamingAccountController::backupsDelete
 * @see app/Http/Controllers/GamingAccountController.php:1103
 * @route '/gaming-accounts/{game_server_account}/api/backups/{backupUuid}'
 */
export const backupsDelete = (args: { game_server_account: string | number, backupUuid: string | number } | [game_server_account: string | number, backupUuid: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: backupsDelete.url(args, options),
    method: 'delete',
})

backupsDelete.definition = {
    methods: ["delete"],
    url: '/gaming-accounts/{game_server_account}/api/backups/{backupUuid}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\GamingAccountController::backupsDelete
 * @see app/Http/Controllers/GamingAccountController.php:1103
 * @route '/gaming-accounts/{game_server_account}/api/backups/{backupUuid}'
 */
backupsDelete.url = (args: { game_server_account: string | number, backupUuid: string | number } | [game_server_account: string | number, backupUuid: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    game_server_account: args[0],
                    backupUuid: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        game_server_account: args.game_server_account,
                                backupUuid: args.backupUuid,
                }

    return backupsDelete.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace('{backupUuid}', parsedArgs.backupUuid.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::backupsDelete
 * @see app/Http/Controllers/GamingAccountController.php:1103
 * @route '/gaming-accounts/{game_server_account}/api/backups/{backupUuid}'
 */
backupsDelete.delete = (args: { game_server_account: string | number, backupUuid: string | number } | [game_server_account: string | number, backupUuid: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: backupsDelete.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::backupsDelete
 * @see app/Http/Controllers/GamingAccountController.php:1103
 * @route '/gaming-accounts/{game_server_account}/api/backups/{backupUuid}'
 */
    const backupsDeleteForm = (args: { game_server_account: string | number, backupUuid: string | number } | [game_server_account: string | number, backupUuid: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: backupsDelete.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::backupsDelete
 * @see app/Http/Controllers/GamingAccountController.php:1103
 * @route '/gaming-accounts/{game_server_account}/api/backups/{backupUuid}'
 */
        backupsDeleteForm.delete = (args: { game_server_account: string | number, backupUuid: string | number } | [game_server_account: string | number, backupUuid: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: backupsDelete.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    backupsDelete.form = backupsDeleteForm
/**
* @see \App\Http\Controllers\GamingAccountController::databasesList
 * @see app/Http/Controllers/GamingAccountController.php:1122
 * @route '/gaming-accounts/{game_server_account}/api/databases'
 */
export const databasesList = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: databasesList.url(args, options),
    method: 'get',
})

databasesList.definition = {
    methods: ["get","head"],
    url: '/gaming-accounts/{game_server_account}/api/databases',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GamingAccountController::databasesList
 * @see app/Http/Controllers/GamingAccountController.php:1122
 * @route '/gaming-accounts/{game_server_account}/api/databases'
 */
databasesList.url = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return databasesList.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::databasesList
 * @see app/Http/Controllers/GamingAccountController.php:1122
 * @route '/gaming-accounts/{game_server_account}/api/databases'
 */
databasesList.get = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: databasesList.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GamingAccountController::databasesList
 * @see app/Http/Controllers/GamingAccountController.php:1122
 * @route '/gaming-accounts/{game_server_account}/api/databases'
 */
databasesList.head = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: databasesList.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::databasesList
 * @see app/Http/Controllers/GamingAccountController.php:1122
 * @route '/gaming-accounts/{game_server_account}/api/databases'
 */
    const databasesListForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: databasesList.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::databasesList
 * @see app/Http/Controllers/GamingAccountController.php:1122
 * @route '/gaming-accounts/{game_server_account}/api/databases'
 */
        databasesListForm.get = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: databasesList.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\GamingAccountController::databasesList
 * @see app/Http/Controllers/GamingAccountController.php:1122
 * @route '/gaming-accounts/{game_server_account}/api/databases'
 */
        databasesListForm.head = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: databasesList.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    databasesList.form = databasesListForm
/**
* @see \App\Http\Controllers\GamingAccountController::databaseCredentials
 * @see app/Http/Controllers/GamingAccountController.php:1141
 * @route '/gaming-accounts/{game_server_account}/api/databases/{databaseId}/credentials'
 */
export const databaseCredentials = (args: { game_server_account: string | number, databaseId: string | number } | [game_server_account: string | number, databaseId: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: databaseCredentials.url(args, options),
    method: 'get',
})

databaseCredentials.definition = {
    methods: ["get","head"],
    url: '/gaming-accounts/{game_server_account}/api/databases/{databaseId}/credentials',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GamingAccountController::databaseCredentials
 * @see app/Http/Controllers/GamingAccountController.php:1141
 * @route '/gaming-accounts/{game_server_account}/api/databases/{databaseId}/credentials'
 */
databaseCredentials.url = (args: { game_server_account: string | number, databaseId: string | number } | [game_server_account: string | number, databaseId: string | number ], options?: RouteQueryOptions) => {
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

    return databaseCredentials.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace('{databaseId}', parsedArgs.databaseId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::databaseCredentials
 * @see app/Http/Controllers/GamingAccountController.php:1141
 * @route '/gaming-accounts/{game_server_account}/api/databases/{databaseId}/credentials'
 */
databaseCredentials.get = (args: { game_server_account: string | number, databaseId: string | number } | [game_server_account: string | number, databaseId: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: databaseCredentials.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GamingAccountController::databaseCredentials
 * @see app/Http/Controllers/GamingAccountController.php:1141
 * @route '/gaming-accounts/{game_server_account}/api/databases/{databaseId}/credentials'
 */
databaseCredentials.head = (args: { game_server_account: string | number, databaseId: string | number } | [game_server_account: string | number, databaseId: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: databaseCredentials.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::databaseCredentials
 * @see app/Http/Controllers/GamingAccountController.php:1141
 * @route '/gaming-accounts/{game_server_account}/api/databases/{databaseId}/credentials'
 */
    const databaseCredentialsForm = (args: { game_server_account: string | number, databaseId: string | number } | [game_server_account: string | number, databaseId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: databaseCredentials.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::databaseCredentials
 * @see app/Http/Controllers/GamingAccountController.php:1141
 * @route '/gaming-accounts/{game_server_account}/api/databases/{databaseId}/credentials'
 */
        databaseCredentialsForm.get = (args: { game_server_account: string | number, databaseId: string | number } | [game_server_account: string | number, databaseId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: databaseCredentials.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\GamingAccountController::databaseCredentials
 * @see app/Http/Controllers/GamingAccountController.php:1141
 * @route '/gaming-accounts/{game_server_account}/api/databases/{databaseId}/credentials'
 */
        databaseCredentialsForm.head = (args: { game_server_account: string | number, databaseId: string | number } | [game_server_account: string | number, databaseId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: databaseCredentials.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    databaseCredentials.form = databaseCredentialsForm
/**
* @see \App\Http\Controllers\GamingAccountController::databasePhpMyAdmin
 * @see app/Http/Controllers/GamingAccountController.php:1159
 * @route '/gaming-accounts/{game_server_account}/api/databases/{databaseId}/phpmyadmin'
 */
export const databasePhpMyAdmin = (args: { game_server_account: string | number, databaseId: string | number } | [game_server_account: string | number, databaseId: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: databasePhpMyAdmin.url(args, options),
    method: 'get',
})

databasePhpMyAdmin.definition = {
    methods: ["get","head"],
    url: '/gaming-accounts/{game_server_account}/api/databases/{databaseId}/phpmyadmin',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GamingAccountController::databasePhpMyAdmin
 * @see app/Http/Controllers/GamingAccountController.php:1159
 * @route '/gaming-accounts/{game_server_account}/api/databases/{databaseId}/phpmyadmin'
 */
databasePhpMyAdmin.url = (args: { game_server_account: string | number, databaseId: string | number } | [game_server_account: string | number, databaseId: string | number ], options?: RouteQueryOptions) => {
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

    return databasePhpMyAdmin.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace('{databaseId}', parsedArgs.databaseId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::databasePhpMyAdmin
 * @see app/Http/Controllers/GamingAccountController.php:1159
 * @route '/gaming-accounts/{game_server_account}/api/databases/{databaseId}/phpmyadmin'
 */
databasePhpMyAdmin.get = (args: { game_server_account: string | number, databaseId: string | number } | [game_server_account: string | number, databaseId: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: databasePhpMyAdmin.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GamingAccountController::databasePhpMyAdmin
 * @see app/Http/Controllers/GamingAccountController.php:1159
 * @route '/gaming-accounts/{game_server_account}/api/databases/{databaseId}/phpmyadmin'
 */
databasePhpMyAdmin.head = (args: { game_server_account: string | number, databaseId: string | number } | [game_server_account: string | number, databaseId: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: databasePhpMyAdmin.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::databasePhpMyAdmin
 * @see app/Http/Controllers/GamingAccountController.php:1159
 * @route '/gaming-accounts/{game_server_account}/api/databases/{databaseId}/phpmyadmin'
 */
    const databasePhpMyAdminForm = (args: { game_server_account: string | number, databaseId: string | number } | [game_server_account: string | number, databaseId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: databasePhpMyAdmin.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::databasePhpMyAdmin
 * @see app/Http/Controllers/GamingAccountController.php:1159
 * @route '/gaming-accounts/{game_server_account}/api/databases/{databaseId}/phpmyadmin'
 */
        databasePhpMyAdminForm.get = (args: { game_server_account: string | number, databaseId: string | number } | [game_server_account: string | number, databaseId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: databasePhpMyAdmin.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\GamingAccountController::databasePhpMyAdmin
 * @see app/Http/Controllers/GamingAccountController.php:1159
 * @route '/gaming-accounts/{game_server_account}/api/databases/{databaseId}/phpmyadmin'
 */
        databasePhpMyAdminForm.head = (args: { game_server_account: string | number, databaseId: string | number } | [game_server_account: string | number, databaseId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: databasePhpMyAdmin.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    databasePhpMyAdmin.form = databasePhpMyAdminForm
/**
* @see \App\Http\Controllers\GamingAccountController::databaseExport
 * @see app/Http/Controllers/GamingAccountController.php:1237
 * @route '/gaming-accounts/{game_server_account}/api/databases/{databaseId}/export'
 */
export const databaseExport = (args: { game_server_account: string | number, databaseId: string | number } | [game_server_account: string | number, databaseId: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: databaseExport.url(args, options),
    method: 'get',
})

databaseExport.definition = {
    methods: ["get","head"],
    url: '/gaming-accounts/{game_server_account}/api/databases/{databaseId}/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GamingAccountController::databaseExport
 * @see app/Http/Controllers/GamingAccountController.php:1237
 * @route '/gaming-accounts/{game_server_account}/api/databases/{databaseId}/export'
 */
databaseExport.url = (args: { game_server_account: string | number, databaseId: string | number } | [game_server_account: string | number, databaseId: string | number ], options?: RouteQueryOptions) => {
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

    return databaseExport.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace('{databaseId}', parsedArgs.databaseId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::databaseExport
 * @see app/Http/Controllers/GamingAccountController.php:1237
 * @route '/gaming-accounts/{game_server_account}/api/databases/{databaseId}/export'
 */
databaseExport.get = (args: { game_server_account: string | number, databaseId: string | number } | [game_server_account: string | number, databaseId: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: databaseExport.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GamingAccountController::databaseExport
 * @see app/Http/Controllers/GamingAccountController.php:1237
 * @route '/gaming-accounts/{game_server_account}/api/databases/{databaseId}/export'
 */
databaseExport.head = (args: { game_server_account: string | number, databaseId: string | number } | [game_server_account: string | number, databaseId: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: databaseExport.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::databaseExport
 * @see app/Http/Controllers/GamingAccountController.php:1237
 * @route '/gaming-accounts/{game_server_account}/api/databases/{databaseId}/export'
 */
    const databaseExportForm = (args: { game_server_account: string | number, databaseId: string | number } | [game_server_account: string | number, databaseId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: databaseExport.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::databaseExport
 * @see app/Http/Controllers/GamingAccountController.php:1237
 * @route '/gaming-accounts/{game_server_account}/api/databases/{databaseId}/export'
 */
        databaseExportForm.get = (args: { game_server_account: string | number, databaseId: string | number } | [game_server_account: string | number, databaseId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: databaseExport.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\GamingAccountController::databaseExport
 * @see app/Http/Controllers/GamingAccountController.php:1237
 * @route '/gaming-accounts/{game_server_account}/api/databases/{databaseId}/export'
 */
        databaseExportForm.head = (args: { game_server_account: string | number, databaseId: string | number } | [game_server_account: string | number, databaseId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: databaseExport.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    databaseExport.form = databaseExportForm
/**
* @see \App\Http\Controllers\GamingAccountController::schedulesList
 * @see app/Http/Controllers/GamingAccountController.php:1293
 * @route '/gaming-accounts/{game_server_account}/api/schedules'
 */
export const schedulesList = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: schedulesList.url(args, options),
    method: 'get',
})

schedulesList.definition = {
    methods: ["get","head"],
    url: '/gaming-accounts/{game_server_account}/api/schedules',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GamingAccountController::schedulesList
 * @see app/Http/Controllers/GamingAccountController.php:1293
 * @route '/gaming-accounts/{game_server_account}/api/schedules'
 */
schedulesList.url = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return schedulesList.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::schedulesList
 * @see app/Http/Controllers/GamingAccountController.php:1293
 * @route '/gaming-accounts/{game_server_account}/api/schedules'
 */
schedulesList.get = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: schedulesList.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GamingAccountController::schedulesList
 * @see app/Http/Controllers/GamingAccountController.php:1293
 * @route '/gaming-accounts/{game_server_account}/api/schedules'
 */
schedulesList.head = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: schedulesList.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::schedulesList
 * @see app/Http/Controllers/GamingAccountController.php:1293
 * @route '/gaming-accounts/{game_server_account}/api/schedules'
 */
    const schedulesListForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: schedulesList.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::schedulesList
 * @see app/Http/Controllers/GamingAccountController.php:1293
 * @route '/gaming-accounts/{game_server_account}/api/schedules'
 */
        schedulesListForm.get = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: schedulesList.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\GamingAccountController::schedulesList
 * @see app/Http/Controllers/GamingAccountController.php:1293
 * @route '/gaming-accounts/{game_server_account}/api/schedules'
 */
        schedulesListForm.head = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: schedulesList.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    schedulesList.form = schedulesListForm
/**
* @see \App\Http\Controllers\GamingAccountController::schedulesCreate
 * @see app/Http/Controllers/GamingAccountController.php:1312
 * @route '/gaming-accounts/{game_server_account}/api/schedules'
 */
export const schedulesCreate = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: schedulesCreate.url(args, options),
    method: 'post',
})

schedulesCreate.definition = {
    methods: ["post"],
    url: '/gaming-accounts/{game_server_account}/api/schedules',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GamingAccountController::schedulesCreate
 * @see app/Http/Controllers/GamingAccountController.php:1312
 * @route '/gaming-accounts/{game_server_account}/api/schedules'
 */
schedulesCreate.url = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return schedulesCreate.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::schedulesCreate
 * @see app/Http/Controllers/GamingAccountController.php:1312
 * @route '/gaming-accounts/{game_server_account}/api/schedules'
 */
schedulesCreate.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: schedulesCreate.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::schedulesCreate
 * @see app/Http/Controllers/GamingAccountController.php:1312
 * @route '/gaming-accounts/{game_server_account}/api/schedules'
 */
    const schedulesCreateForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: schedulesCreate.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::schedulesCreate
 * @see app/Http/Controllers/GamingAccountController.php:1312
 * @route '/gaming-accounts/{game_server_account}/api/schedules'
 */
        schedulesCreateForm.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: schedulesCreate.url(args, options),
            method: 'post',
        })
    
    schedulesCreate.form = schedulesCreateForm
/**
* @see \App\Http\Controllers\GamingAccountController::schedulesShow
 * @see app/Http/Controllers/GamingAccountController.php:1384
 * @route '/gaming-accounts/{game_server_account}/api/schedules/{schedule}'
 */
export const schedulesShow = (args: { game_server_account: string | number, schedule: string | number } | [game_server_account: string | number, schedule: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: schedulesShow.url(args, options),
    method: 'get',
})

schedulesShow.definition = {
    methods: ["get","head"],
    url: '/gaming-accounts/{game_server_account}/api/schedules/{schedule}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GamingAccountController::schedulesShow
 * @see app/Http/Controllers/GamingAccountController.php:1384
 * @route '/gaming-accounts/{game_server_account}/api/schedules/{schedule}'
 */
schedulesShow.url = (args: { game_server_account: string | number, schedule: string | number } | [game_server_account: string | number, schedule: string | number ], options?: RouteQueryOptions) => {
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

    return schedulesShow.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace('{schedule}', parsedArgs.schedule.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::schedulesShow
 * @see app/Http/Controllers/GamingAccountController.php:1384
 * @route '/gaming-accounts/{game_server_account}/api/schedules/{schedule}'
 */
schedulesShow.get = (args: { game_server_account: string | number, schedule: string | number } | [game_server_account: string | number, schedule: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: schedulesShow.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GamingAccountController::schedulesShow
 * @see app/Http/Controllers/GamingAccountController.php:1384
 * @route '/gaming-accounts/{game_server_account}/api/schedules/{schedule}'
 */
schedulesShow.head = (args: { game_server_account: string | number, schedule: string | number } | [game_server_account: string | number, schedule: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: schedulesShow.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::schedulesShow
 * @see app/Http/Controllers/GamingAccountController.php:1384
 * @route '/gaming-accounts/{game_server_account}/api/schedules/{schedule}'
 */
    const schedulesShowForm = (args: { game_server_account: string | number, schedule: string | number } | [game_server_account: string | number, schedule: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: schedulesShow.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::schedulesShow
 * @see app/Http/Controllers/GamingAccountController.php:1384
 * @route '/gaming-accounts/{game_server_account}/api/schedules/{schedule}'
 */
        schedulesShowForm.get = (args: { game_server_account: string | number, schedule: string | number } | [game_server_account: string | number, schedule: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: schedulesShow.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\GamingAccountController::schedulesShow
 * @see app/Http/Controllers/GamingAccountController.php:1384
 * @route '/gaming-accounts/{game_server_account}/api/schedules/{schedule}'
 */
        schedulesShowForm.head = (args: { game_server_account: string | number, schedule: string | number } | [game_server_account: string | number, schedule: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: schedulesShow.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    schedulesShow.form = schedulesShowForm
/**
* @see \App\Http\Controllers\GamingAccountController::schedulesDelete
 * @see app/Http/Controllers/GamingAccountController.php:1346
 * @route '/gaming-accounts/{game_server_account}/api/schedules/{schedule}'
 */
export const schedulesDelete = (args: { game_server_account: string | number, schedule: string | number } | [game_server_account: string | number, schedule: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: schedulesDelete.url(args, options),
    method: 'delete',
})

schedulesDelete.definition = {
    methods: ["delete"],
    url: '/gaming-accounts/{game_server_account}/api/schedules/{schedule}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\GamingAccountController::schedulesDelete
 * @see app/Http/Controllers/GamingAccountController.php:1346
 * @route '/gaming-accounts/{game_server_account}/api/schedules/{schedule}'
 */
schedulesDelete.url = (args: { game_server_account: string | number, schedule: string | number } | [game_server_account: string | number, schedule: string | number ], options?: RouteQueryOptions) => {
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

    return schedulesDelete.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace('{schedule}', parsedArgs.schedule.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::schedulesDelete
 * @see app/Http/Controllers/GamingAccountController.php:1346
 * @route '/gaming-accounts/{game_server_account}/api/schedules/{schedule}'
 */
schedulesDelete.delete = (args: { game_server_account: string | number, schedule: string | number } | [game_server_account: string | number, schedule: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: schedulesDelete.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::schedulesDelete
 * @see app/Http/Controllers/GamingAccountController.php:1346
 * @route '/gaming-accounts/{game_server_account}/api/schedules/{schedule}'
 */
    const schedulesDeleteForm = (args: { game_server_account: string | number, schedule: string | number } | [game_server_account: string | number, schedule: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: schedulesDelete.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::schedulesDelete
 * @see app/Http/Controllers/GamingAccountController.php:1346
 * @route '/gaming-accounts/{game_server_account}/api/schedules/{schedule}'
 */
        schedulesDeleteForm.delete = (args: { game_server_account: string | number, schedule: string | number } | [game_server_account: string | number, schedule: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: schedulesDelete.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    schedulesDelete.form = schedulesDeleteForm
/**
* @see \App\Http\Controllers\GamingAccountController::schedulesExecute
 * @see app/Http/Controllers/GamingAccountController.php:1365
 * @route '/gaming-accounts/{game_server_account}/api/schedules/{schedule}/execute'
 */
export const schedulesExecute = (args: { game_server_account: string | number, schedule: string | number } | [game_server_account: string | number, schedule: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: schedulesExecute.url(args, options),
    method: 'post',
})

schedulesExecute.definition = {
    methods: ["post"],
    url: '/gaming-accounts/{game_server_account}/api/schedules/{schedule}/execute',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GamingAccountController::schedulesExecute
 * @see app/Http/Controllers/GamingAccountController.php:1365
 * @route '/gaming-accounts/{game_server_account}/api/schedules/{schedule}/execute'
 */
schedulesExecute.url = (args: { game_server_account: string | number, schedule: string | number } | [game_server_account: string | number, schedule: string | number ], options?: RouteQueryOptions) => {
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

    return schedulesExecute.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace('{schedule}', parsedArgs.schedule.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::schedulesExecute
 * @see app/Http/Controllers/GamingAccountController.php:1365
 * @route '/gaming-accounts/{game_server_account}/api/schedules/{schedule}/execute'
 */
schedulesExecute.post = (args: { game_server_account: string | number, schedule: string | number } | [game_server_account: string | number, schedule: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: schedulesExecute.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::schedulesExecute
 * @see app/Http/Controllers/GamingAccountController.php:1365
 * @route '/gaming-accounts/{game_server_account}/api/schedules/{schedule}/execute'
 */
    const schedulesExecuteForm = (args: { game_server_account: string | number, schedule: string | number } | [game_server_account: string | number, schedule: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: schedulesExecute.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::schedulesExecute
 * @see app/Http/Controllers/GamingAccountController.php:1365
 * @route '/gaming-accounts/{game_server_account}/api/schedules/{schedule}/execute'
 */
        schedulesExecuteForm.post = (args: { game_server_account: string | number, schedule: string | number } | [game_server_account: string | number, schedule: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: schedulesExecute.url(args, options),
            method: 'post',
        })
    
    schedulesExecute.form = schedulesExecuteForm
/**
* @see \App\Http\Controllers\GamingAccountController::scheduleTasksCreate
 * @see app/Http/Controllers/GamingAccountController.php:1404
 * @route '/gaming-accounts/{game_server_account}/api/schedules/{schedule}/tasks'
 */
export const scheduleTasksCreate = (args: { game_server_account: string | number, schedule: string | number } | [game_server_account: string | number, schedule: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: scheduleTasksCreate.url(args, options),
    method: 'post',
})

scheduleTasksCreate.definition = {
    methods: ["post"],
    url: '/gaming-accounts/{game_server_account}/api/schedules/{schedule}/tasks',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GamingAccountController::scheduleTasksCreate
 * @see app/Http/Controllers/GamingAccountController.php:1404
 * @route '/gaming-accounts/{game_server_account}/api/schedules/{schedule}/tasks'
 */
scheduleTasksCreate.url = (args: { game_server_account: string | number, schedule: string | number } | [game_server_account: string | number, schedule: string | number ], options?: RouteQueryOptions) => {
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

    return scheduleTasksCreate.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace('{schedule}', parsedArgs.schedule.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::scheduleTasksCreate
 * @see app/Http/Controllers/GamingAccountController.php:1404
 * @route '/gaming-accounts/{game_server_account}/api/schedules/{schedule}/tasks'
 */
scheduleTasksCreate.post = (args: { game_server_account: string | number, schedule: string | number } | [game_server_account: string | number, schedule: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: scheduleTasksCreate.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::scheduleTasksCreate
 * @see app/Http/Controllers/GamingAccountController.php:1404
 * @route '/gaming-accounts/{game_server_account}/api/schedules/{schedule}/tasks'
 */
    const scheduleTasksCreateForm = (args: { game_server_account: string | number, schedule: string | number } | [game_server_account: string | number, schedule: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: scheduleTasksCreate.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::scheduleTasksCreate
 * @see app/Http/Controllers/GamingAccountController.php:1404
 * @route '/gaming-accounts/{game_server_account}/api/schedules/{schedule}/tasks'
 */
        scheduleTasksCreateForm.post = (args: { game_server_account: string | number, schedule: string | number } | [game_server_account: string | number, schedule: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: scheduleTasksCreate.url(args, options),
            method: 'post',
        })
    
    scheduleTasksCreate.form = scheduleTasksCreateForm
/**
* @see \App\Http\Controllers\GamingAccountController::scheduleTasksDelete
 * @see app/Http/Controllers/GamingAccountController.php:1436
 * @route '/gaming-accounts/{game_server_account}/api/schedules/{schedule}/tasks/{task}'
 */
export const scheduleTasksDelete = (args: { game_server_account: string | number, schedule: string | number, task: string | number } | [game_server_account: string | number, schedule: string | number, task: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: scheduleTasksDelete.url(args, options),
    method: 'delete',
})

scheduleTasksDelete.definition = {
    methods: ["delete"],
    url: '/gaming-accounts/{game_server_account}/api/schedules/{schedule}/tasks/{task}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\GamingAccountController::scheduleTasksDelete
 * @see app/Http/Controllers/GamingAccountController.php:1436
 * @route '/gaming-accounts/{game_server_account}/api/schedules/{schedule}/tasks/{task}'
 */
scheduleTasksDelete.url = (args: { game_server_account: string | number, schedule: string | number, task: string | number } | [game_server_account: string | number, schedule: string | number, task: string | number ], options?: RouteQueryOptions) => {
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

    return scheduleTasksDelete.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace('{schedule}', parsedArgs.schedule.toString())
            .replace('{task}', parsedArgs.task.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::scheduleTasksDelete
 * @see app/Http/Controllers/GamingAccountController.php:1436
 * @route '/gaming-accounts/{game_server_account}/api/schedules/{schedule}/tasks/{task}'
 */
scheduleTasksDelete.delete = (args: { game_server_account: string | number, schedule: string | number, task: string | number } | [game_server_account: string | number, schedule: string | number, task: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: scheduleTasksDelete.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::scheduleTasksDelete
 * @see app/Http/Controllers/GamingAccountController.php:1436
 * @route '/gaming-accounts/{game_server_account}/api/schedules/{schedule}/tasks/{task}'
 */
    const scheduleTasksDeleteForm = (args: { game_server_account: string | number, schedule: string | number, task: string | number } | [game_server_account: string | number, schedule: string | number, task: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: scheduleTasksDelete.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::scheduleTasksDelete
 * @see app/Http/Controllers/GamingAccountController.php:1436
 * @route '/gaming-accounts/{game_server_account}/api/schedules/{schedule}/tasks/{task}'
 */
        scheduleTasksDeleteForm.delete = (args: { game_server_account: string | number, schedule: string | number, task: string | number } | [game_server_account: string | number, schedule: string | number, task: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: scheduleTasksDelete.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    scheduleTasksDelete.form = scheduleTasksDeleteForm
const GamingAccountController = { phpmyadminSignonCredentials, index, show, showConnectDomain, storeConnectDomain, checkSubdomain, updateSubdomain, overview, power, renew, cancelSubscription, setAutoRenewWithBalance, createMollieSubscription, consoleWebsocket, consoleCommand, filesList, filesContents, filesWrite, filesDownload, filesCreateFolder, filesDelete, filesRename, filesUpload, filesCompress, filesDecompress, backupsList, backupsCreate, backupsDownload, backupsRestore, backupsDelete, databasesList, databaseCredentials, databasePhpMyAdmin, databaseExport, schedulesList, schedulesCreate, schedulesShow, schedulesDelete, schedulesExecute, scheduleTasksCreate, scheduleTasksDelete }

export default GamingAccountController