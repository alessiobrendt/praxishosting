import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\TeamSpeakAccountController::index
 * @see app/Http/Controllers/TeamSpeakAccountController.php:46
 * @route '/teamspeak-accounts'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/teamspeak-accounts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TeamSpeakAccountController::index
 * @see app/Http/Controllers/TeamSpeakAccountController.php:46
 * @route '/teamspeak-accounts'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TeamSpeakAccountController::index
 * @see app/Http/Controllers/TeamSpeakAccountController.php:46
 * @route '/teamspeak-accounts'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TeamSpeakAccountController::index
 * @see app/Http/Controllers/TeamSpeakAccountController.php:46
 * @route '/teamspeak-accounts'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TeamSpeakAccountController::index
 * @see app/Http/Controllers/TeamSpeakAccountController.php:46
 * @route '/teamspeak-accounts'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TeamSpeakAccountController::index
 * @see app/Http/Controllers/TeamSpeakAccountController.php:46
 * @route '/teamspeak-accounts'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TeamSpeakAccountController::index
 * @see app/Http/Controllers/TeamSpeakAccountController.php:46
 * @route '/teamspeak-accounts'
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
* @see \App\Http\Controllers\TeamSpeakAccountController::show
 * @see app/Http/Controllers/TeamSpeakAccountController.php:93
 * @route '/teamspeak-accounts/{team_speak_server_account}'
 */
export const show = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/teamspeak-accounts/{team_speak_server_account}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TeamSpeakAccountController::show
 * @see app/Http/Controllers/TeamSpeakAccountController.php:93
 * @route '/teamspeak-accounts/{team_speak_server_account}'
 */
show.url = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { team_speak_server_account: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    team_speak_server_account: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        team_speak_server_account: args.team_speak_server_account,
                }

    return show.definition.url
            .replace('{team_speak_server_account}', parsedArgs.team_speak_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TeamSpeakAccountController::show
 * @see app/Http/Controllers/TeamSpeakAccountController.php:93
 * @route '/teamspeak-accounts/{team_speak_server_account}'
 */
show.get = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TeamSpeakAccountController::show
 * @see app/Http/Controllers/TeamSpeakAccountController.php:93
 * @route '/teamspeak-accounts/{team_speak_server_account}'
 */
show.head = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TeamSpeakAccountController::show
 * @see app/Http/Controllers/TeamSpeakAccountController.php:93
 * @route '/teamspeak-accounts/{team_speak_server_account}'
 */
    const showForm = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TeamSpeakAccountController::show
 * @see app/Http/Controllers/TeamSpeakAccountController.php:93
 * @route '/teamspeak-accounts/{team_speak_server_account}'
 */
        showForm.get = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TeamSpeakAccountController::show
 * @see app/Http/Controllers/TeamSpeakAccountController.php:93
 * @route '/teamspeak-accounts/{team_speak_server_account}'
 */
        showForm.head = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\TeamSpeakAccountController::showConnectDomain
 * @see app/Http/Controllers/TeamSpeakAccountController.php:186
 * @route '/teamspeak-accounts/{team_speak_server_account}/connect-domain'
 */
export const showConnectDomain = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showConnectDomain.url(args, options),
    method: 'get',
})

showConnectDomain.definition = {
    methods: ["get","head"],
    url: '/teamspeak-accounts/{team_speak_server_account}/connect-domain',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TeamSpeakAccountController::showConnectDomain
 * @see app/Http/Controllers/TeamSpeakAccountController.php:186
 * @route '/teamspeak-accounts/{team_speak_server_account}/connect-domain'
 */
showConnectDomain.url = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { team_speak_server_account: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    team_speak_server_account: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        team_speak_server_account: args.team_speak_server_account,
                }

    return showConnectDomain.definition.url
            .replace('{team_speak_server_account}', parsedArgs.team_speak_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TeamSpeakAccountController::showConnectDomain
 * @see app/Http/Controllers/TeamSpeakAccountController.php:186
 * @route '/teamspeak-accounts/{team_speak_server_account}/connect-domain'
 */
showConnectDomain.get = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showConnectDomain.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TeamSpeakAccountController::showConnectDomain
 * @see app/Http/Controllers/TeamSpeakAccountController.php:186
 * @route '/teamspeak-accounts/{team_speak_server_account}/connect-domain'
 */
showConnectDomain.head = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showConnectDomain.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TeamSpeakAccountController::showConnectDomain
 * @see app/Http/Controllers/TeamSpeakAccountController.php:186
 * @route '/teamspeak-accounts/{team_speak_server_account}/connect-domain'
 */
    const showConnectDomainForm = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: showConnectDomain.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TeamSpeakAccountController::showConnectDomain
 * @see app/Http/Controllers/TeamSpeakAccountController.php:186
 * @route '/teamspeak-accounts/{team_speak_server_account}/connect-domain'
 */
        showConnectDomainForm.get = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showConnectDomain.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TeamSpeakAccountController::showConnectDomain
 * @see app/Http/Controllers/TeamSpeakAccountController.php:186
 * @route '/teamspeak-accounts/{team_speak_server_account}/connect-domain'
 */
        showConnectDomainForm.head = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\TeamSpeakAccountController::storeConnectDomain
 * @see app/Http/Controllers/TeamSpeakAccountController.php:227
 * @route '/teamspeak-accounts/{team_speak_server_account}/connect-domain'
 */
export const storeConnectDomain = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeConnectDomain.url(args, options),
    method: 'post',
})

storeConnectDomain.definition = {
    methods: ["post"],
    url: '/teamspeak-accounts/{team_speak_server_account}/connect-domain',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TeamSpeakAccountController::storeConnectDomain
 * @see app/Http/Controllers/TeamSpeakAccountController.php:227
 * @route '/teamspeak-accounts/{team_speak_server_account}/connect-domain'
 */
storeConnectDomain.url = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { team_speak_server_account: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    team_speak_server_account: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        team_speak_server_account: args.team_speak_server_account,
                }

    return storeConnectDomain.definition.url
            .replace('{team_speak_server_account}', parsedArgs.team_speak_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TeamSpeakAccountController::storeConnectDomain
 * @see app/Http/Controllers/TeamSpeakAccountController.php:227
 * @route '/teamspeak-accounts/{team_speak_server_account}/connect-domain'
 */
storeConnectDomain.post = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeConnectDomain.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TeamSpeakAccountController::storeConnectDomain
 * @see app/Http/Controllers/TeamSpeakAccountController.php:227
 * @route '/teamspeak-accounts/{team_speak_server_account}/connect-domain'
 */
    const storeConnectDomainForm = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeConnectDomain.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TeamSpeakAccountController::storeConnectDomain
 * @see app/Http/Controllers/TeamSpeakAccountController.php:227
 * @route '/teamspeak-accounts/{team_speak_server_account}/connect-domain'
 */
        storeConnectDomainForm.post = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeConnectDomain.url(args, options),
            method: 'post',
        })
    
    storeConnectDomain.form = storeConnectDomainForm
/**
* @see \App\Http\Controllers\TeamSpeakAccountController::overview
 * @see app/Http/Controllers/TeamSpeakAccountController.php:296
 * @route '/teamspeak-accounts/{team_speak_server_account}/overview'
 */
export const overview = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: overview.url(args, options),
    method: 'get',
})

overview.definition = {
    methods: ["get","head"],
    url: '/teamspeak-accounts/{team_speak_server_account}/overview',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TeamSpeakAccountController::overview
 * @see app/Http/Controllers/TeamSpeakAccountController.php:296
 * @route '/teamspeak-accounts/{team_speak_server_account}/overview'
 */
overview.url = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { team_speak_server_account: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    team_speak_server_account: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        team_speak_server_account: args.team_speak_server_account,
                }

    return overview.definition.url
            .replace('{team_speak_server_account}', parsedArgs.team_speak_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TeamSpeakAccountController::overview
 * @see app/Http/Controllers/TeamSpeakAccountController.php:296
 * @route '/teamspeak-accounts/{team_speak_server_account}/overview'
 */
overview.get = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: overview.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TeamSpeakAccountController::overview
 * @see app/Http/Controllers/TeamSpeakAccountController.php:296
 * @route '/teamspeak-accounts/{team_speak_server_account}/overview'
 */
overview.head = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: overview.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TeamSpeakAccountController::overview
 * @see app/Http/Controllers/TeamSpeakAccountController.php:296
 * @route '/teamspeak-accounts/{team_speak_server_account}/overview'
 */
    const overviewForm = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: overview.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TeamSpeakAccountController::overview
 * @see app/Http/Controllers/TeamSpeakAccountController.php:296
 * @route '/teamspeak-accounts/{team_speak_server_account}/overview'
 */
        overviewForm.get = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: overview.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TeamSpeakAccountController::overview
 * @see app/Http/Controllers/TeamSpeakAccountController.php:296
 * @route '/teamspeak-accounts/{team_speak_server_account}/overview'
 */
        overviewForm.head = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\TeamSpeakAccountController::power
 * @see app/Http/Controllers/TeamSpeakAccountController.php:324
 * @route '/teamspeak-accounts/{team_speak_server_account}/power'
 */
export const power = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: power.url(args, options),
    method: 'post',
})

power.definition = {
    methods: ["post"],
    url: '/teamspeak-accounts/{team_speak_server_account}/power',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TeamSpeakAccountController::power
 * @see app/Http/Controllers/TeamSpeakAccountController.php:324
 * @route '/teamspeak-accounts/{team_speak_server_account}/power'
 */
power.url = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { team_speak_server_account: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    team_speak_server_account: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        team_speak_server_account: args.team_speak_server_account,
                }

    return power.definition.url
            .replace('{team_speak_server_account}', parsedArgs.team_speak_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TeamSpeakAccountController::power
 * @see app/Http/Controllers/TeamSpeakAccountController.php:324
 * @route '/teamspeak-accounts/{team_speak_server_account}/power'
 */
power.post = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: power.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TeamSpeakAccountController::power
 * @see app/Http/Controllers/TeamSpeakAccountController.php:324
 * @route '/teamspeak-accounts/{team_speak_server_account}/power'
 */
    const powerForm = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: power.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TeamSpeakAccountController::power
 * @see app/Http/Controllers/TeamSpeakAccountController.php:324
 * @route '/teamspeak-accounts/{team_speak_server_account}/power'
 */
        powerForm.post = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: power.url(args, options),
            method: 'post',
        })
    
    power.form = powerForm
/**
* @see \App\Http\Controllers\TeamSpeakAccountController::reinstall
 * @see app/Http/Controllers/TeamSpeakAccountController.php:368
 * @route '/teamspeak-accounts/{team_speak_server_account}/reinstall'
 */
export const reinstall = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reinstall.url(args, options),
    method: 'post',
})

reinstall.definition = {
    methods: ["post"],
    url: '/teamspeak-accounts/{team_speak_server_account}/reinstall',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TeamSpeakAccountController::reinstall
 * @see app/Http/Controllers/TeamSpeakAccountController.php:368
 * @route '/teamspeak-accounts/{team_speak_server_account}/reinstall'
 */
reinstall.url = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { team_speak_server_account: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    team_speak_server_account: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        team_speak_server_account: args.team_speak_server_account,
                }

    return reinstall.definition.url
            .replace('{team_speak_server_account}', parsedArgs.team_speak_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TeamSpeakAccountController::reinstall
 * @see app/Http/Controllers/TeamSpeakAccountController.php:368
 * @route '/teamspeak-accounts/{team_speak_server_account}/reinstall'
 */
reinstall.post = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reinstall.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TeamSpeakAccountController::reinstall
 * @see app/Http/Controllers/TeamSpeakAccountController.php:368
 * @route '/teamspeak-accounts/{team_speak_server_account}/reinstall'
 */
    const reinstallForm = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reinstall.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TeamSpeakAccountController::reinstall
 * @see app/Http/Controllers/TeamSpeakAccountController.php:368
 * @route '/teamspeak-accounts/{team_speak_server_account}/reinstall'
 */
        reinstallForm.post = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reinstall.url(args, options),
            method: 'post',
        })
    
    reinstall.form = reinstallForm
/**
* @see \App\Http\Controllers\TeamSpeakAccountController::renew
 * @see app/Http/Controllers/TeamSpeakAccountController.php:426
 * @route '/teamspeak-accounts/{team_speak_server_account}/renew'
 */
export const renew = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: renew.url(args, options),
    method: 'post',
})

renew.definition = {
    methods: ["post"],
    url: '/teamspeak-accounts/{team_speak_server_account}/renew',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TeamSpeakAccountController::renew
 * @see app/Http/Controllers/TeamSpeakAccountController.php:426
 * @route '/teamspeak-accounts/{team_speak_server_account}/renew'
 */
renew.url = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { team_speak_server_account: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    team_speak_server_account: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        team_speak_server_account: args.team_speak_server_account,
                }

    return renew.definition.url
            .replace('{team_speak_server_account}', parsedArgs.team_speak_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TeamSpeakAccountController::renew
 * @see app/Http/Controllers/TeamSpeakAccountController.php:426
 * @route '/teamspeak-accounts/{team_speak_server_account}/renew'
 */
renew.post = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: renew.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TeamSpeakAccountController::renew
 * @see app/Http/Controllers/TeamSpeakAccountController.php:426
 * @route '/teamspeak-accounts/{team_speak_server_account}/renew'
 */
    const renewForm = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: renew.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TeamSpeakAccountController::renew
 * @see app/Http/Controllers/TeamSpeakAccountController.php:426
 * @route '/teamspeak-accounts/{team_speak_server_account}/renew'
 */
        renewForm.post = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: renew.url(args, options),
            method: 'post',
        })
    
    renew.form = renewForm
/**
* @see \App\Http\Controllers\TeamSpeakAccountController::updateName
 * @see app/Http/Controllers/TeamSpeakAccountController.php:501
 * @route '/teamspeak-accounts/{team_speak_server_account}/name'
 */
export const updateName = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateName.url(args, options),
    method: 'post',
})

updateName.definition = {
    methods: ["post"],
    url: '/teamspeak-accounts/{team_speak_server_account}/name',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TeamSpeakAccountController::updateName
 * @see app/Http/Controllers/TeamSpeakAccountController.php:501
 * @route '/teamspeak-accounts/{team_speak_server_account}/name'
 */
updateName.url = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { team_speak_server_account: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    team_speak_server_account: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        team_speak_server_account: args.team_speak_server_account,
                }

    return updateName.definition.url
            .replace('{team_speak_server_account}', parsedArgs.team_speak_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TeamSpeakAccountController::updateName
 * @see app/Http/Controllers/TeamSpeakAccountController.php:501
 * @route '/teamspeak-accounts/{team_speak_server_account}/name'
 */
updateName.post = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateName.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TeamSpeakAccountController::updateName
 * @see app/Http/Controllers/TeamSpeakAccountController.php:501
 * @route '/teamspeak-accounts/{team_speak_server_account}/name'
 */
    const updateNameForm = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateName.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TeamSpeakAccountController::updateName
 * @see app/Http/Controllers/TeamSpeakAccountController.php:501
 * @route '/teamspeak-accounts/{team_speak_server_account}/name'
 */
        updateNameForm.post = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateName.url(args, options),
            method: 'post',
        })
    
    updateName.form = updateNameForm
/**
* @see \App\Http\Controllers\TeamSpeakAccountController::createToken
 * @see app/Http/Controllers/TeamSpeakAccountController.php:528
 * @route '/teamspeak-accounts/{team_speak_server_account}/tokens'
 */
export const createToken = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createToken.url(args, options),
    method: 'post',
})

createToken.definition = {
    methods: ["post"],
    url: '/teamspeak-accounts/{team_speak_server_account}/tokens',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TeamSpeakAccountController::createToken
 * @see app/Http/Controllers/TeamSpeakAccountController.php:528
 * @route '/teamspeak-accounts/{team_speak_server_account}/tokens'
 */
createToken.url = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { team_speak_server_account: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    team_speak_server_account: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        team_speak_server_account: args.team_speak_server_account,
                }

    return createToken.definition.url
            .replace('{team_speak_server_account}', parsedArgs.team_speak_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TeamSpeakAccountController::createToken
 * @see app/Http/Controllers/TeamSpeakAccountController.php:528
 * @route '/teamspeak-accounts/{team_speak_server_account}/tokens'
 */
createToken.post = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createToken.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TeamSpeakAccountController::createToken
 * @see app/Http/Controllers/TeamSpeakAccountController.php:528
 * @route '/teamspeak-accounts/{team_speak_server_account}/tokens'
 */
    const createTokenForm = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: createToken.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TeamSpeakAccountController::createToken
 * @see app/Http/Controllers/TeamSpeakAccountController.php:528
 * @route '/teamspeak-accounts/{team_speak_server_account}/tokens'
 */
        createTokenForm.post = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: createToken.url(args, options),
            method: 'post',
        })
    
    createToken.form = createTokenForm
/**
* @see \App\Http\Controllers\TeamSpeakAccountController::deleteToken
 * @see app/Http/Controllers/TeamSpeakAccountController.php:559
 * @route '/teamspeak-accounts/{team_speak_server_account}/tokens/delete'
 */
export const deleteToken = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: deleteToken.url(args, options),
    method: 'post',
})

deleteToken.definition = {
    methods: ["post"],
    url: '/teamspeak-accounts/{team_speak_server_account}/tokens/delete',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TeamSpeakAccountController::deleteToken
 * @see app/Http/Controllers/TeamSpeakAccountController.php:559
 * @route '/teamspeak-accounts/{team_speak_server_account}/tokens/delete'
 */
deleteToken.url = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { team_speak_server_account: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    team_speak_server_account: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        team_speak_server_account: args.team_speak_server_account,
                }

    return deleteToken.definition.url
            .replace('{team_speak_server_account}', parsedArgs.team_speak_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TeamSpeakAccountController::deleteToken
 * @see app/Http/Controllers/TeamSpeakAccountController.php:559
 * @route '/teamspeak-accounts/{team_speak_server_account}/tokens/delete'
 */
deleteToken.post = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: deleteToken.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TeamSpeakAccountController::deleteToken
 * @see app/Http/Controllers/TeamSpeakAccountController.php:559
 * @route '/teamspeak-accounts/{team_speak_server_account}/tokens/delete'
 */
    const deleteTokenForm = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: deleteToken.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TeamSpeakAccountController::deleteToken
 * @see app/Http/Controllers/TeamSpeakAccountController.php:559
 * @route '/teamspeak-accounts/{team_speak_server_account}/tokens/delete'
 */
        deleteTokenForm.post = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: deleteToken.url(args, options),
            method: 'post',
        })
    
    deleteToken.form = deleteTokenForm
/**
* @see \App\Http\Controllers\TeamSpeakAccountController::createBackup
 * @see app/Http/Controllers/TeamSpeakAccountController.php:595
 * @route '/teamspeak-accounts/{team_speak_server_account}/backups'
 */
export const createBackup = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createBackup.url(args, options),
    method: 'post',
})

createBackup.definition = {
    methods: ["post"],
    url: '/teamspeak-accounts/{team_speak_server_account}/backups',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TeamSpeakAccountController::createBackup
 * @see app/Http/Controllers/TeamSpeakAccountController.php:595
 * @route '/teamspeak-accounts/{team_speak_server_account}/backups'
 */
createBackup.url = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { team_speak_server_account: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    team_speak_server_account: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        team_speak_server_account: args.team_speak_server_account,
                }

    return createBackup.definition.url
            .replace('{team_speak_server_account}', parsedArgs.team_speak_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TeamSpeakAccountController::createBackup
 * @see app/Http/Controllers/TeamSpeakAccountController.php:595
 * @route '/teamspeak-accounts/{team_speak_server_account}/backups'
 */
createBackup.post = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createBackup.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TeamSpeakAccountController::createBackup
 * @see app/Http/Controllers/TeamSpeakAccountController.php:595
 * @route '/teamspeak-accounts/{team_speak_server_account}/backups'
 */
    const createBackupForm = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: createBackup.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TeamSpeakAccountController::createBackup
 * @see app/Http/Controllers/TeamSpeakAccountController.php:595
 * @route '/teamspeak-accounts/{team_speak_server_account}/backups'
 */
        createBackupForm.post = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: createBackup.url(args, options),
            method: 'post',
        })
    
    createBackup.form = createBackupForm
/**
* @see \App\Http\Controllers\TeamSpeakAccountController::deployBackup
 * @see app/Http/Controllers/TeamSpeakAccountController.php:628
 * @route '/teamspeak-accounts/{team_speak_server_account}/backups/{snapshot}/deploy'
 */
export const deployBackup = (args: { team_speak_server_account: string | number, snapshot: number | { id: number } } | [team_speak_server_account: string | number, snapshot: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: deployBackup.url(args, options),
    method: 'post',
})

deployBackup.definition = {
    methods: ["post"],
    url: '/teamspeak-accounts/{team_speak_server_account}/backups/{snapshot}/deploy',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TeamSpeakAccountController::deployBackup
 * @see app/Http/Controllers/TeamSpeakAccountController.php:628
 * @route '/teamspeak-accounts/{team_speak_server_account}/backups/{snapshot}/deploy'
 */
deployBackup.url = (args: { team_speak_server_account: string | number, snapshot: number | { id: number } } | [team_speak_server_account: string | number, snapshot: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    team_speak_server_account: args[0],
                    snapshot: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        team_speak_server_account: args.team_speak_server_account,
                                snapshot: typeof args.snapshot === 'object'
                ? args.snapshot.id
                : args.snapshot,
                }

    return deployBackup.definition.url
            .replace('{team_speak_server_account}', parsedArgs.team_speak_server_account.toString())
            .replace('{snapshot}', parsedArgs.snapshot.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TeamSpeakAccountController::deployBackup
 * @see app/Http/Controllers/TeamSpeakAccountController.php:628
 * @route '/teamspeak-accounts/{team_speak_server_account}/backups/{snapshot}/deploy'
 */
deployBackup.post = (args: { team_speak_server_account: string | number, snapshot: number | { id: number } } | [team_speak_server_account: string | number, snapshot: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: deployBackup.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TeamSpeakAccountController::deployBackup
 * @see app/Http/Controllers/TeamSpeakAccountController.php:628
 * @route '/teamspeak-accounts/{team_speak_server_account}/backups/{snapshot}/deploy'
 */
    const deployBackupForm = (args: { team_speak_server_account: string | number, snapshot: number | { id: number } } | [team_speak_server_account: string | number, snapshot: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: deployBackup.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TeamSpeakAccountController::deployBackup
 * @see app/Http/Controllers/TeamSpeakAccountController.php:628
 * @route '/teamspeak-accounts/{team_speak_server_account}/backups/{snapshot}/deploy'
 */
        deployBackupForm.post = (args: { team_speak_server_account: string | number, snapshot: number | { id: number } } | [team_speak_server_account: string | number, snapshot: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: deployBackup.url(args, options),
            method: 'post',
        })
    
    deployBackup.form = deployBackupForm
/**
* @see \App\Http\Controllers\TeamSpeakAccountController::destroyBackup
 * @see app/Http/Controllers/TeamSpeakAccountController.php:668
 * @route '/teamspeak-accounts/{team_speak_server_account}/backups/{snapshot}'
 */
export const destroyBackup = (args: { team_speak_server_account: string | number, snapshot: number | { id: number } } | [team_speak_server_account: string | number, snapshot: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyBackup.url(args, options),
    method: 'delete',
})

destroyBackup.definition = {
    methods: ["delete"],
    url: '/teamspeak-accounts/{team_speak_server_account}/backups/{snapshot}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\TeamSpeakAccountController::destroyBackup
 * @see app/Http/Controllers/TeamSpeakAccountController.php:668
 * @route '/teamspeak-accounts/{team_speak_server_account}/backups/{snapshot}'
 */
destroyBackup.url = (args: { team_speak_server_account: string | number, snapshot: number | { id: number } } | [team_speak_server_account: string | number, snapshot: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    team_speak_server_account: args[0],
                    snapshot: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        team_speak_server_account: args.team_speak_server_account,
                                snapshot: typeof args.snapshot === 'object'
                ? args.snapshot.id
                : args.snapshot,
                }

    return destroyBackup.definition.url
            .replace('{team_speak_server_account}', parsedArgs.team_speak_server_account.toString())
            .replace('{snapshot}', parsedArgs.snapshot.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TeamSpeakAccountController::destroyBackup
 * @see app/Http/Controllers/TeamSpeakAccountController.php:668
 * @route '/teamspeak-accounts/{team_speak_server_account}/backups/{snapshot}'
 */
destroyBackup.delete = (args: { team_speak_server_account: string | number, snapshot: number | { id: number } } | [team_speak_server_account: string | number, snapshot: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyBackup.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\TeamSpeakAccountController::destroyBackup
 * @see app/Http/Controllers/TeamSpeakAccountController.php:668
 * @route '/teamspeak-accounts/{team_speak_server_account}/backups/{snapshot}'
 */
    const destroyBackupForm = (args: { team_speak_server_account: string | number, snapshot: number | { id: number } } | [team_speak_server_account: string | number, snapshot: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroyBackup.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TeamSpeakAccountController::destroyBackup
 * @see app/Http/Controllers/TeamSpeakAccountController.php:668
 * @route '/teamspeak-accounts/{team_speak_server_account}/backups/{snapshot}'
 */
        destroyBackupForm.delete = (args: { team_speak_server_account: string | number, snapshot: number | { id: number } } | [team_speak_server_account: string | number, snapshot: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroyBackup.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroyBackup.form = destroyBackupForm
/**
* @see \App\Http\Controllers\TeamSpeakAccountController::cancelSubscription
 * @see app/Http/Controllers/TeamSpeakAccountController.php:690
 * @route '/teamspeak-accounts/{team_speak_server_account}/subscription/cancel'
 */
export const cancelSubscription = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancelSubscription.url(args, options),
    method: 'post',
})

cancelSubscription.definition = {
    methods: ["post"],
    url: '/teamspeak-accounts/{team_speak_server_account}/subscription/cancel',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TeamSpeakAccountController::cancelSubscription
 * @see app/Http/Controllers/TeamSpeakAccountController.php:690
 * @route '/teamspeak-accounts/{team_speak_server_account}/subscription/cancel'
 */
cancelSubscription.url = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { team_speak_server_account: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    team_speak_server_account: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        team_speak_server_account: args.team_speak_server_account,
                }

    return cancelSubscription.definition.url
            .replace('{team_speak_server_account}', parsedArgs.team_speak_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TeamSpeakAccountController::cancelSubscription
 * @see app/Http/Controllers/TeamSpeakAccountController.php:690
 * @route '/teamspeak-accounts/{team_speak_server_account}/subscription/cancel'
 */
cancelSubscription.post = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancelSubscription.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TeamSpeakAccountController::cancelSubscription
 * @see app/Http/Controllers/TeamSpeakAccountController.php:690
 * @route '/teamspeak-accounts/{team_speak_server_account}/subscription/cancel'
 */
    const cancelSubscriptionForm = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cancelSubscription.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TeamSpeakAccountController::cancelSubscription
 * @see app/Http/Controllers/TeamSpeakAccountController.php:690
 * @route '/teamspeak-accounts/{team_speak_server_account}/subscription/cancel'
 */
        cancelSubscriptionForm.post = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cancelSubscription.url(args, options),
            method: 'post',
        })
    
    cancelSubscription.form = cancelSubscriptionForm
/**
* @see \App\Http\Controllers\TeamSpeakAccountController::setAutoRenewWithBalance
 * @see app/Http/Controllers/TeamSpeakAccountController.php:730
 * @route '/teamspeak-accounts/{team_speak_server_account}/auto-renew-balance'
 */
export const setAutoRenewWithBalance = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: setAutoRenewWithBalance.url(args, options),
    method: 'post',
})

setAutoRenewWithBalance.definition = {
    methods: ["post"],
    url: '/teamspeak-accounts/{team_speak_server_account}/auto-renew-balance',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TeamSpeakAccountController::setAutoRenewWithBalance
 * @see app/Http/Controllers/TeamSpeakAccountController.php:730
 * @route '/teamspeak-accounts/{team_speak_server_account}/auto-renew-balance'
 */
setAutoRenewWithBalance.url = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { team_speak_server_account: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    team_speak_server_account: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        team_speak_server_account: args.team_speak_server_account,
                }

    return setAutoRenewWithBalance.definition.url
            .replace('{team_speak_server_account}', parsedArgs.team_speak_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TeamSpeakAccountController::setAutoRenewWithBalance
 * @see app/Http/Controllers/TeamSpeakAccountController.php:730
 * @route '/teamspeak-accounts/{team_speak_server_account}/auto-renew-balance'
 */
setAutoRenewWithBalance.post = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: setAutoRenewWithBalance.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TeamSpeakAccountController::setAutoRenewWithBalance
 * @see app/Http/Controllers/TeamSpeakAccountController.php:730
 * @route '/teamspeak-accounts/{team_speak_server_account}/auto-renew-balance'
 */
    const setAutoRenewWithBalanceForm = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: setAutoRenewWithBalance.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TeamSpeakAccountController::setAutoRenewWithBalance
 * @see app/Http/Controllers/TeamSpeakAccountController.php:730
 * @route '/teamspeak-accounts/{team_speak_server_account}/auto-renew-balance'
 */
        setAutoRenewWithBalanceForm.post = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: setAutoRenewWithBalance.url(args, options),
            method: 'post',
        })
    
    setAutoRenewWithBalance.form = setAutoRenewWithBalanceForm
/**
* @see \App\Http\Controllers\TeamSpeakAccountController::createMollieSubscription
 * @see app/Http/Controllers/TeamSpeakAccountController.php:768
 * @route '/teamspeak-accounts/{team_speak_server_account}/auto-renew-mollie-subscription'
 */
export const createMollieSubscription = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createMollieSubscription.url(args, options),
    method: 'post',
})

createMollieSubscription.definition = {
    methods: ["post"],
    url: '/teamspeak-accounts/{team_speak_server_account}/auto-renew-mollie-subscription',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TeamSpeakAccountController::createMollieSubscription
 * @see app/Http/Controllers/TeamSpeakAccountController.php:768
 * @route '/teamspeak-accounts/{team_speak_server_account}/auto-renew-mollie-subscription'
 */
createMollieSubscription.url = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { team_speak_server_account: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    team_speak_server_account: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        team_speak_server_account: args.team_speak_server_account,
                }

    return createMollieSubscription.definition.url
            .replace('{team_speak_server_account}', parsedArgs.team_speak_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TeamSpeakAccountController::createMollieSubscription
 * @see app/Http/Controllers/TeamSpeakAccountController.php:768
 * @route '/teamspeak-accounts/{team_speak_server_account}/auto-renew-mollie-subscription'
 */
createMollieSubscription.post = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createMollieSubscription.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TeamSpeakAccountController::createMollieSubscription
 * @see app/Http/Controllers/TeamSpeakAccountController.php:768
 * @route '/teamspeak-accounts/{team_speak_server_account}/auto-renew-mollie-subscription'
 */
    const createMollieSubscriptionForm = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: createMollieSubscription.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TeamSpeakAccountController::createMollieSubscription
 * @see app/Http/Controllers/TeamSpeakAccountController.php:768
 * @route '/teamspeak-accounts/{team_speak_server_account}/auto-renew-mollie-subscription'
 */
        createMollieSubscriptionForm.post = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: createMollieSubscription.url(args, options),
            method: 'post',
        })
    
    createMollieSubscription.form = createMollieSubscriptionForm
const TeamSpeakAccountController = { index, show, showConnectDomain, storeConnectDomain, overview, power, reinstall, renew, updateName, createToken, deleteToken, createBackup, deployBackup, destroyBackup, cancelSubscription, setAutoRenewWithBalance, createMollieSubscription }

export default TeamSpeakAccountController