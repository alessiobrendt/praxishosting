import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ResellerDomainController::index
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:84
 * @route '/admin/domains'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/domains',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ResellerDomainController::index
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:84
 * @route '/admin/domains'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ResellerDomainController::index
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:84
 * @route '/admin/domains'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ResellerDomainController::index
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:84
 * @route '/admin/domains'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\ResellerDomainController::index
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:84
 * @route '/admin/domains'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\ResellerDomainController::index
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:84
 * @route '/admin/domains'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\ResellerDomainController::index
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:84
 * @route '/admin/domains'
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
* @see \App\Http\Controllers\Admin\ResellerDomainController::syncFromSkrime
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:74
 * @route '/admin/domains/sync'
 */
export const syncFromSkrime = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: syncFromSkrime.url(options),
    method: 'post',
})

syncFromSkrime.definition = {
    methods: ["post"],
    url: '/admin/domains/sync',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ResellerDomainController::syncFromSkrime
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:74
 * @route '/admin/domains/sync'
 */
syncFromSkrime.url = (options?: RouteQueryOptions) => {
    return syncFromSkrime.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ResellerDomainController::syncFromSkrime
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:74
 * @route '/admin/domains/sync'
 */
syncFromSkrime.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: syncFromSkrime.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\ResellerDomainController::syncFromSkrime
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:74
 * @route '/admin/domains/sync'
 */
    const syncFromSkrimeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: syncFromSkrime.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ResellerDomainController::syncFromSkrime
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:74
 * @route '/admin/domains/sync'
 */
        syncFromSkrimeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: syncFromSkrime.url(options),
            method: 'post',
        })
    
    syncFromSkrime.form = syncFromSkrimeForm
/**
* @see \App\Http\Controllers\Admin\ResellerDomainController::importMethod
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:21
 * @route '/admin/domains/import'
 */
export const importMethod = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importMethod.url(options),
    method: 'post',
})

importMethod.definition = {
    methods: ["post"],
    url: '/admin/domains/import',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ResellerDomainController::importMethod
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:21
 * @route '/admin/domains/import'
 */
importMethod.url = (options?: RouteQueryOptions) => {
    return importMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ResellerDomainController::importMethod
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:21
 * @route '/admin/domains/import'
 */
importMethod.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importMethod.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\ResellerDomainController::importMethod
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:21
 * @route '/admin/domains/import'
 */
    const importMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: importMethod.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ResellerDomainController::importMethod
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:21
 * @route '/admin/domains/import'
 */
        importMethodForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: importMethod.url(options),
            method: 'post',
        })
    
    importMethod.form = importMethodForm
/**
* @see \App\Http\Controllers\Admin\ResellerDomainController::show
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:137
 * @route '/admin/domains/{reseller_domain}'
 */
export const show = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/domains/{reseller_domain}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ResellerDomainController::show
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:137
 * @route '/admin/domains/{reseller_domain}'
 */
show.url = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { reseller_domain: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { reseller_domain: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    reseller_domain: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reseller_domain: typeof args.reseller_domain === 'object'
                ? args.reseller_domain.uuid
                : args.reseller_domain,
                }

    return show.definition.url
            .replace('{reseller_domain}', parsedArgs.reseller_domain.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ResellerDomainController::show
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:137
 * @route '/admin/domains/{reseller_domain}'
 */
show.get = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ResellerDomainController::show
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:137
 * @route '/admin/domains/{reseller_domain}'
 */
show.head = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\ResellerDomainController::show
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:137
 * @route '/admin/domains/{reseller_domain}'
 */
    const showForm = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\ResellerDomainController::show
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:137
 * @route '/admin/domains/{reseller_domain}'
 */
        showForm.get = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\ResellerDomainController::show
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:137
 * @route '/admin/domains/{reseller_domain}'
 */
        showForm.head = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\ResellerDomainController::updateCustomer
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:173
 * @route '/admin/domains/{reseller_domain}/customer'
 */
export const updateCustomer = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateCustomer.url(args, options),
    method: 'put',
})

updateCustomer.definition = {
    methods: ["put"],
    url: '/admin/domains/{reseller_domain}/customer',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\ResellerDomainController::updateCustomer
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:173
 * @route '/admin/domains/{reseller_domain}/customer'
 */
updateCustomer.url = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { reseller_domain: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { reseller_domain: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    reseller_domain: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reseller_domain: typeof args.reseller_domain === 'object'
                ? args.reseller_domain.uuid
                : args.reseller_domain,
                }

    return updateCustomer.definition.url
            .replace('{reseller_domain}', parsedArgs.reseller_domain.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ResellerDomainController::updateCustomer
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:173
 * @route '/admin/domains/{reseller_domain}/customer'
 */
updateCustomer.put = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateCustomer.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\ResellerDomainController::updateCustomer
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:173
 * @route '/admin/domains/{reseller_domain}/customer'
 */
    const updateCustomerForm = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateCustomer.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ResellerDomainController::updateCustomer
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:173
 * @route '/admin/domains/{reseller_domain}/customer'
 */
        updateCustomerForm.put = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateCustomer.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateCustomer.form = updateCustomerForm
/**
* @see \App\Http\Controllers\Admin\ResellerDomainController::renew
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:180
 * @route '/admin/domains/{reseller_domain}/renew'
 */
export const renew = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: renew.url(args, options),
    method: 'post',
})

renew.definition = {
    methods: ["post"],
    url: '/admin/domains/{reseller_domain}/renew',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ResellerDomainController::renew
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:180
 * @route '/admin/domains/{reseller_domain}/renew'
 */
renew.url = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { reseller_domain: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { reseller_domain: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    reseller_domain: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reseller_domain: typeof args.reseller_domain === 'object'
                ? args.reseller_domain.uuid
                : args.reseller_domain,
                }

    return renew.definition.url
            .replace('{reseller_domain}', parsedArgs.reseller_domain.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ResellerDomainController::renew
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:180
 * @route '/admin/domains/{reseller_domain}/renew'
 */
renew.post = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: renew.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\ResellerDomainController::renew
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:180
 * @route '/admin/domains/{reseller_domain}/renew'
 */
    const renewForm = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: renew.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ResellerDomainController::renew
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:180
 * @route '/admin/domains/{reseller_domain}/renew'
 */
        renewForm.post = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: renew.url(args, options),
            method: 'post',
        })
    
    renew.form = renewForm
/**
* @see \App\Http\Controllers\Admin\ResellerDomainController::setAutoRenew
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:198
 * @route '/admin/domains/{reseller_domain}/autorenew'
 */
export const setAutoRenew = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: setAutoRenew.url(args, options),
    method: 'post',
})

setAutoRenew.definition = {
    methods: ["post"],
    url: '/admin/domains/{reseller_domain}/autorenew',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ResellerDomainController::setAutoRenew
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:198
 * @route '/admin/domains/{reseller_domain}/autorenew'
 */
setAutoRenew.url = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { reseller_domain: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { reseller_domain: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    reseller_domain: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reseller_domain: typeof args.reseller_domain === 'object'
                ? args.reseller_domain.uuid
                : args.reseller_domain,
                }

    return setAutoRenew.definition.url
            .replace('{reseller_domain}', parsedArgs.reseller_domain.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ResellerDomainController::setAutoRenew
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:198
 * @route '/admin/domains/{reseller_domain}/autorenew'
 */
setAutoRenew.post = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: setAutoRenew.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\ResellerDomainController::setAutoRenew
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:198
 * @route '/admin/domains/{reseller_domain}/autorenew'
 */
    const setAutoRenewForm = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: setAutoRenew.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ResellerDomainController::setAutoRenew
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:198
 * @route '/admin/domains/{reseller_domain}/autorenew'
 */
        setAutoRenewForm.post = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: setAutoRenew.url(args, options),
            method: 'post',
        })
    
    setAutoRenew.form = setAutoRenewForm
/**
* @see \App\Http\Controllers\Admin\ResellerDomainController::authcode
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:217
 * @route '/admin/domains/{reseller_domain}/authcode'
 */
export const authcode = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: authcode.url(args, options),
    method: 'get',
})

authcode.definition = {
    methods: ["get","head"],
    url: '/admin/domains/{reseller_domain}/authcode',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ResellerDomainController::authcode
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:217
 * @route '/admin/domains/{reseller_domain}/authcode'
 */
authcode.url = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { reseller_domain: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { reseller_domain: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    reseller_domain: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reseller_domain: typeof args.reseller_domain === 'object'
                ? args.reseller_domain.uuid
                : args.reseller_domain,
                }

    return authcode.definition.url
            .replace('{reseller_domain}', parsedArgs.reseller_domain.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ResellerDomainController::authcode
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:217
 * @route '/admin/domains/{reseller_domain}/authcode'
 */
authcode.get = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: authcode.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ResellerDomainController::authcode
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:217
 * @route '/admin/domains/{reseller_domain}/authcode'
 */
authcode.head = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: authcode.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\ResellerDomainController::authcode
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:217
 * @route '/admin/domains/{reseller_domain}/authcode'
 */
    const authcodeForm = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: authcode.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\ResellerDomainController::authcode
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:217
 * @route '/admin/domains/{reseller_domain}/authcode'
 */
        authcodeForm.get = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: authcode.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\ResellerDomainController::authcode
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:217
 * @route '/admin/domains/{reseller_domain}/authcode'
 */
        authcodeForm.head = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: authcode.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    authcode.form = authcodeForm
/**
* @see \App\Http\Controllers\Admin\ResellerDomainController::cancel
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:228
 * @route '/admin/domains/{reseller_domain}/cancel'
 */
export const cancel = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

cancel.definition = {
    methods: ["post"],
    url: '/admin/domains/{reseller_domain}/cancel',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ResellerDomainController::cancel
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:228
 * @route '/admin/domains/{reseller_domain}/cancel'
 */
cancel.url = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { reseller_domain: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { reseller_domain: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    reseller_domain: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reseller_domain: typeof args.reseller_domain === 'object'
                ? args.reseller_domain.uuid
                : args.reseller_domain,
                }

    return cancel.definition.url
            .replace('{reseller_domain}', parsedArgs.reseller_domain.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ResellerDomainController::cancel
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:228
 * @route '/admin/domains/{reseller_domain}/cancel'
 */
cancel.post = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\ResellerDomainController::cancel
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:228
 * @route '/admin/domains/{reseller_domain}/cancel'
 */
    const cancelForm = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cancel.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ResellerDomainController::cancel
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:228
 * @route '/admin/domains/{reseller_domain}/cancel'
 */
        cancelForm.post = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cancel.url(args, options),
            method: 'post',
        })
    
    cancel.form = cancelForm
/**
* @see \App\Http\Controllers\Admin\ResellerDomainController::updateNameserver
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:235
 * @route '/admin/domains/{reseller_domain}/nameserver'
 */
export const updateNameserver = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateNameserver.url(args, options),
    method: 'put',
})

updateNameserver.definition = {
    methods: ["put"],
    url: '/admin/domains/{reseller_domain}/nameserver',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\ResellerDomainController::updateNameserver
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:235
 * @route '/admin/domains/{reseller_domain}/nameserver'
 */
updateNameserver.url = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { reseller_domain: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { reseller_domain: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    reseller_domain: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reseller_domain: typeof args.reseller_domain === 'object'
                ? args.reseller_domain.uuid
                : args.reseller_domain,
                }

    return updateNameserver.definition.url
            .replace('{reseller_domain}', parsedArgs.reseller_domain.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ResellerDomainController::updateNameserver
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:235
 * @route '/admin/domains/{reseller_domain}/nameserver'
 */
updateNameserver.put = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateNameserver.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\ResellerDomainController::updateNameserver
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:235
 * @route '/admin/domains/{reseller_domain}/nameserver'
 */
    const updateNameserverForm = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateNameserver.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ResellerDomainController::updateNameserver
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:235
 * @route '/admin/domains/{reseller_domain}/nameserver'
 */
        updateNameserverForm.put = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateNameserver.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateNameserver.form = updateNameserverForm
/**
* @see \App\Http\Controllers\Admin\ResellerDomainController::dns
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:246
 * @route '/admin/domains/{reseller_domain}/dns'
 */
export const dns = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dns.url(args, options),
    method: 'get',
})

dns.definition = {
    methods: ["get","head"],
    url: '/admin/domains/{reseller_domain}/dns',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ResellerDomainController::dns
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:246
 * @route '/admin/domains/{reseller_domain}/dns'
 */
dns.url = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { reseller_domain: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { reseller_domain: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    reseller_domain: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reseller_domain: typeof args.reseller_domain === 'object'
                ? args.reseller_domain.uuid
                : args.reseller_domain,
                }

    return dns.definition.url
            .replace('{reseller_domain}', parsedArgs.reseller_domain.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ResellerDomainController::dns
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:246
 * @route '/admin/domains/{reseller_domain}/dns'
 */
dns.get = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dns.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ResellerDomainController::dns
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:246
 * @route '/admin/domains/{reseller_domain}/dns'
 */
dns.head = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dns.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\ResellerDomainController::dns
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:246
 * @route '/admin/domains/{reseller_domain}/dns'
 */
    const dnsForm = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dns.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\ResellerDomainController::dns
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:246
 * @route '/admin/domains/{reseller_domain}/dns'
 */
        dnsForm.get = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dns.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\ResellerDomainController::dns
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:246
 * @route '/admin/domains/{reseller_domain}/dns'
 */
        dnsForm.head = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dns.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dns.form = dnsForm
/**
* @see \App\Http\Controllers\Admin\ResellerDomainController::updateDns
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:260
 * @route '/admin/domains/{reseller_domain}/dns'
 */
export const updateDns = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateDns.url(args, options),
    method: 'put',
})

updateDns.definition = {
    methods: ["put"],
    url: '/admin/domains/{reseller_domain}/dns',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\ResellerDomainController::updateDns
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:260
 * @route '/admin/domains/{reseller_domain}/dns'
 */
updateDns.url = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { reseller_domain: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { reseller_domain: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    reseller_domain: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reseller_domain: typeof args.reseller_domain === 'object'
                ? args.reseller_domain.uuid
                : args.reseller_domain,
                }

    return updateDns.definition.url
            .replace('{reseller_domain}', parsedArgs.reseller_domain.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ResellerDomainController::updateDns
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:260
 * @route '/admin/domains/{reseller_domain}/dns'
 */
updateDns.put = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateDns.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\ResellerDomainController::updateDns
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:260
 * @route '/admin/domains/{reseller_domain}/dns'
 */
    const updateDnsForm = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateDns.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ResellerDomainController::updateDns
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:260
 * @route '/admin/domains/{reseller_domain}/dns'
 */
        updateDnsForm.put = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateDns.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateDns.form = updateDnsForm
const ResellerDomainController = { index, syncFromSkrime, importMethod, show, updateCustomer, renew, setAutoRenew, authcode, cancel, updateNameserver, dns, updateDns, import: importMethod }

export default ResellerDomainController