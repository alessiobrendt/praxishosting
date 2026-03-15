import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import connectDomain from './connect-domain'
import shares from './shares'
import invitations from './invitations'
import tokens from './tokens'
import backups from './backups'
import subscription from './subscription'
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
* @see \App\Http\Controllers\TeamSpeakAccountController::name
 * @see app/Http/Controllers/TeamSpeakAccountController.php:501
 * @route '/teamspeak-accounts/{team_speak_server_account}/name'
 */
export const name = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: name.url(args, options),
    method: 'post',
})

name.definition = {
    methods: ["post"],
    url: '/teamspeak-accounts/{team_speak_server_account}/name',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TeamSpeakAccountController::name
 * @see app/Http/Controllers/TeamSpeakAccountController.php:501
 * @route '/teamspeak-accounts/{team_speak_server_account}/name'
 */
name.url = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return name.definition.url
            .replace('{team_speak_server_account}', parsedArgs.team_speak_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TeamSpeakAccountController::name
 * @see app/Http/Controllers/TeamSpeakAccountController.php:501
 * @route '/teamspeak-accounts/{team_speak_server_account}/name'
 */
name.post = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: name.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TeamSpeakAccountController::name
 * @see app/Http/Controllers/TeamSpeakAccountController.php:501
 * @route '/teamspeak-accounts/{team_speak_server_account}/name'
 */
    const nameForm = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: name.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TeamSpeakAccountController::name
 * @see app/Http/Controllers/TeamSpeakAccountController.php:501
 * @route '/teamspeak-accounts/{team_speak_server_account}/name'
 */
        nameForm.post = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: name.url(args, options),
            method: 'post',
        })
    
    name.form = nameForm
/**
* @see \App\Http\Controllers\TeamSpeakAccountController::autoRenewBalance
 * @see app/Http/Controllers/TeamSpeakAccountController.php:730
 * @route '/teamspeak-accounts/{team_speak_server_account}/auto-renew-balance'
 */
export const autoRenewBalance = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: autoRenewBalance.url(args, options),
    method: 'post',
})

autoRenewBalance.definition = {
    methods: ["post"],
    url: '/teamspeak-accounts/{team_speak_server_account}/auto-renew-balance',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TeamSpeakAccountController::autoRenewBalance
 * @see app/Http/Controllers/TeamSpeakAccountController.php:730
 * @route '/teamspeak-accounts/{team_speak_server_account}/auto-renew-balance'
 */
autoRenewBalance.url = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return autoRenewBalance.definition.url
            .replace('{team_speak_server_account}', parsedArgs.team_speak_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TeamSpeakAccountController::autoRenewBalance
 * @see app/Http/Controllers/TeamSpeakAccountController.php:730
 * @route '/teamspeak-accounts/{team_speak_server_account}/auto-renew-balance'
 */
autoRenewBalance.post = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: autoRenewBalance.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TeamSpeakAccountController::autoRenewBalance
 * @see app/Http/Controllers/TeamSpeakAccountController.php:730
 * @route '/teamspeak-accounts/{team_speak_server_account}/auto-renew-balance'
 */
    const autoRenewBalanceForm = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: autoRenewBalance.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TeamSpeakAccountController::autoRenewBalance
 * @see app/Http/Controllers/TeamSpeakAccountController.php:730
 * @route '/teamspeak-accounts/{team_speak_server_account}/auto-renew-balance'
 */
        autoRenewBalanceForm.post = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: autoRenewBalance.url(args, options),
            method: 'post',
        })
    
    autoRenewBalance.form = autoRenewBalanceForm
/**
* @see \App\Http\Controllers\TeamSpeakAccountController::autoRenewMollieSubscription
 * @see app/Http/Controllers/TeamSpeakAccountController.php:768
 * @route '/teamspeak-accounts/{team_speak_server_account}/auto-renew-mollie-subscription'
 */
export const autoRenewMollieSubscription = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: autoRenewMollieSubscription.url(args, options),
    method: 'post',
})

autoRenewMollieSubscription.definition = {
    methods: ["post"],
    url: '/teamspeak-accounts/{team_speak_server_account}/auto-renew-mollie-subscription',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TeamSpeakAccountController::autoRenewMollieSubscription
 * @see app/Http/Controllers/TeamSpeakAccountController.php:768
 * @route '/teamspeak-accounts/{team_speak_server_account}/auto-renew-mollie-subscription'
 */
autoRenewMollieSubscription.url = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return autoRenewMollieSubscription.definition.url
            .replace('{team_speak_server_account}', parsedArgs.team_speak_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TeamSpeakAccountController::autoRenewMollieSubscription
 * @see app/Http/Controllers/TeamSpeakAccountController.php:768
 * @route '/teamspeak-accounts/{team_speak_server_account}/auto-renew-mollie-subscription'
 */
autoRenewMollieSubscription.post = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: autoRenewMollieSubscription.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TeamSpeakAccountController::autoRenewMollieSubscription
 * @see app/Http/Controllers/TeamSpeakAccountController.php:768
 * @route '/teamspeak-accounts/{team_speak_server_account}/auto-renew-mollie-subscription'
 */
    const autoRenewMollieSubscriptionForm = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: autoRenewMollieSubscription.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TeamSpeakAccountController::autoRenewMollieSubscription
 * @see app/Http/Controllers/TeamSpeakAccountController.php:768
 * @route '/teamspeak-accounts/{team_speak_server_account}/auto-renew-mollie-subscription'
 */
        autoRenewMollieSubscriptionForm.post = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: autoRenewMollieSubscription.url(args, options),
            method: 'post',
        })
    
    autoRenewMollieSubscription.form = autoRenewMollieSubscriptionForm
const teamspeakAccounts = {
    index: Object.assign(index, index),
show: Object.assign(show, show),
connectDomain: Object.assign(connectDomain, connectDomain),
shares: Object.assign(shares, shares),
invitations: Object.assign(invitations, invitations),
overview: Object.assign(overview, overview),
power: Object.assign(power, power),
reinstall: Object.assign(reinstall, reinstall),
renew: Object.assign(renew, renew),
name: Object.assign(name, name),
tokens: Object.assign(tokens, tokens),
backups: Object.assign(backups, backups),
subscription: Object.assign(subscription, subscription),
autoRenewBalance: Object.assign(autoRenewBalance, autoRenewBalance),
autoRenewMollieSubscription: Object.assign(autoRenewMollieSubscription, autoRenewMollieSubscription),
}

export default teamspeakAccounts