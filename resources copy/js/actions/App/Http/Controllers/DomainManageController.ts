import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\DomainManageController::show
 * @see app/Http/Controllers/DomainManageController.php:17
 * @route '/domains/{reseller_domain}'
 */
export const show = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/domains/{reseller_domain}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DomainManageController::show
 * @see app/Http/Controllers/DomainManageController.php:17
 * @route '/domains/{reseller_domain}'
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
* @see \App\Http\Controllers\DomainManageController::show
 * @see app/Http/Controllers/DomainManageController.php:17
 * @route '/domains/{reseller_domain}'
 */
show.get = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DomainManageController::show
 * @see app/Http/Controllers/DomainManageController.php:17
 * @route '/domains/{reseller_domain}'
 */
show.head = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DomainManageController::show
 * @see app/Http/Controllers/DomainManageController.php:17
 * @route '/domains/{reseller_domain}'
 */
    const showForm = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DomainManageController::show
 * @see app/Http/Controllers/DomainManageController.php:17
 * @route '/domains/{reseller_domain}'
 */
        showForm.get = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DomainManageController::show
 * @see app/Http/Controllers/DomainManageController.php:17
 * @route '/domains/{reseller_domain}'
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
* @see \App\Http\Controllers\DomainManageController::authcode
 * @see app/Http/Controllers/DomainManageController.php:91
 * @route '/domains/{reseller_domain}/authcode'
 */
export const authcode = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: authcode.url(args, options),
    method: 'get',
})

authcode.definition = {
    methods: ["get","head"],
    url: '/domains/{reseller_domain}/authcode',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DomainManageController::authcode
 * @see app/Http/Controllers/DomainManageController.php:91
 * @route '/domains/{reseller_domain}/authcode'
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
* @see \App\Http\Controllers\DomainManageController::authcode
 * @see app/Http/Controllers/DomainManageController.php:91
 * @route '/domains/{reseller_domain}/authcode'
 */
authcode.get = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: authcode.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DomainManageController::authcode
 * @see app/Http/Controllers/DomainManageController.php:91
 * @route '/domains/{reseller_domain}/authcode'
 */
authcode.head = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: authcode.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DomainManageController::authcode
 * @see app/Http/Controllers/DomainManageController.php:91
 * @route '/domains/{reseller_domain}/authcode'
 */
    const authcodeForm = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: authcode.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DomainManageController::authcode
 * @see app/Http/Controllers/DomainManageController.php:91
 * @route '/domains/{reseller_domain}/authcode'
 */
        authcodeForm.get = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: authcode.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DomainManageController::authcode
 * @see app/Http/Controllers/DomainManageController.php:91
 * @route '/domains/{reseller_domain}/authcode'
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
* @see \App\Http\Controllers\DomainManageController::getContact
 * @see app/Http/Controllers/DomainManageController.php:261
 * @route '/domains/{reseller_domain}/contact'
 */
export const getContact = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getContact.url(args, options),
    method: 'get',
})

getContact.definition = {
    methods: ["get","head"],
    url: '/domains/{reseller_domain}/contact',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DomainManageController::getContact
 * @see app/Http/Controllers/DomainManageController.php:261
 * @route '/domains/{reseller_domain}/contact'
 */
getContact.url = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return getContact.definition.url
            .replace('{reseller_domain}', parsedArgs.reseller_domain.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DomainManageController::getContact
 * @see app/Http/Controllers/DomainManageController.php:261
 * @route '/domains/{reseller_domain}/contact'
 */
getContact.get = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getContact.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DomainManageController::getContact
 * @see app/Http/Controllers/DomainManageController.php:261
 * @route '/domains/{reseller_domain}/contact'
 */
getContact.head = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getContact.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DomainManageController::getContact
 * @see app/Http/Controllers/DomainManageController.php:261
 * @route '/domains/{reseller_domain}/contact'
 */
    const getContactForm = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getContact.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DomainManageController::getContact
 * @see app/Http/Controllers/DomainManageController.php:261
 * @route '/domains/{reseller_domain}/contact'
 */
        getContactForm.get = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getContact.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DomainManageController::getContact
 * @see app/Http/Controllers/DomainManageController.php:261
 * @route '/domains/{reseller_domain}/contact'
 */
        getContactForm.head = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getContact.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getContact.form = getContactForm
/**
* @see \App\Http\Controllers\DomainManageController::updateContact
 * @see app/Http/Controllers/DomainManageController.php:274
 * @route '/domains/{reseller_domain}/contact'
 */
export const updateContact = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateContact.url(args, options),
    method: 'put',
})

updateContact.definition = {
    methods: ["put"],
    url: '/domains/{reseller_domain}/contact',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\DomainManageController::updateContact
 * @see app/Http/Controllers/DomainManageController.php:274
 * @route '/domains/{reseller_domain}/contact'
 */
updateContact.url = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return updateContact.definition.url
            .replace('{reseller_domain}', parsedArgs.reseller_domain.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DomainManageController::updateContact
 * @see app/Http/Controllers/DomainManageController.php:274
 * @route '/domains/{reseller_domain}/contact'
 */
updateContact.put = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateContact.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\DomainManageController::updateContact
 * @see app/Http/Controllers/DomainManageController.php:274
 * @route '/domains/{reseller_domain}/contact'
 */
    const updateContactForm = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateContact.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DomainManageController::updateContact
 * @see app/Http/Controllers/DomainManageController.php:274
 * @route '/domains/{reseller_domain}/contact'
 */
        updateContactForm.put = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateContact.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateContact.form = updateContactForm
/**
* @see \App\Http\Controllers\DomainManageController::getWhoisLookup
 * @see app/Http/Controllers/DomainManageController.php:330
 * @route '/domains/{reseller_domain}/whois'
 */
export const getWhoisLookup = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getWhoisLookup.url(args, options),
    method: 'get',
})

getWhoisLookup.definition = {
    methods: ["get","head"],
    url: '/domains/{reseller_domain}/whois',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DomainManageController::getWhoisLookup
 * @see app/Http/Controllers/DomainManageController.php:330
 * @route '/domains/{reseller_domain}/whois'
 */
getWhoisLookup.url = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return getWhoisLookup.definition.url
            .replace('{reseller_domain}', parsedArgs.reseller_domain.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DomainManageController::getWhoisLookup
 * @see app/Http/Controllers/DomainManageController.php:330
 * @route '/domains/{reseller_domain}/whois'
 */
getWhoisLookup.get = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getWhoisLookup.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DomainManageController::getWhoisLookup
 * @see app/Http/Controllers/DomainManageController.php:330
 * @route '/domains/{reseller_domain}/whois'
 */
getWhoisLookup.head = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getWhoisLookup.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DomainManageController::getWhoisLookup
 * @see app/Http/Controllers/DomainManageController.php:330
 * @route '/domains/{reseller_domain}/whois'
 */
    const getWhoisLookupForm = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getWhoisLookup.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DomainManageController::getWhoisLookup
 * @see app/Http/Controllers/DomainManageController.php:330
 * @route '/domains/{reseller_domain}/whois'
 */
        getWhoisLookupForm.get = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getWhoisLookup.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DomainManageController::getWhoisLookup
 * @see app/Http/Controllers/DomainManageController.php:330
 * @route '/domains/{reseller_domain}/whois'
 */
        getWhoisLookupForm.head = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getWhoisLookup.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getWhoisLookup.form = getWhoisLookupForm
/**
* @see \App\Http\Controllers\DomainManageController::updateWhoisPrivacy
 * @see app/Http/Controllers/DomainManageController.php:307
 * @route '/domains/{reseller_domain}/whois'
 */
export const updateWhoisPrivacy = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateWhoisPrivacy.url(args, options),
    method: 'put',
})

updateWhoisPrivacy.definition = {
    methods: ["put"],
    url: '/domains/{reseller_domain}/whois',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\DomainManageController::updateWhoisPrivacy
 * @see app/Http/Controllers/DomainManageController.php:307
 * @route '/domains/{reseller_domain}/whois'
 */
updateWhoisPrivacy.url = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return updateWhoisPrivacy.definition.url
            .replace('{reseller_domain}', parsedArgs.reseller_domain.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DomainManageController::updateWhoisPrivacy
 * @see app/Http/Controllers/DomainManageController.php:307
 * @route '/domains/{reseller_domain}/whois'
 */
updateWhoisPrivacy.put = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateWhoisPrivacy.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\DomainManageController::updateWhoisPrivacy
 * @see app/Http/Controllers/DomainManageController.php:307
 * @route '/domains/{reseller_domain}/whois'
 */
    const updateWhoisPrivacyForm = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateWhoisPrivacy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DomainManageController::updateWhoisPrivacy
 * @see app/Http/Controllers/DomainManageController.php:307
 * @route '/domains/{reseller_domain}/whois'
 */
        updateWhoisPrivacyForm.put = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateWhoisPrivacy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateWhoisPrivacy.form = updateWhoisPrivacyForm
/**
* @see \App\Http\Controllers\DomainManageController::updateNameserver
 * @see app/Http/Controllers/DomainManageController.php:104
 * @route '/domains/{reseller_domain}/nameserver'
 */
export const updateNameserver = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateNameserver.url(args, options),
    method: 'put',
})

updateNameserver.definition = {
    methods: ["put"],
    url: '/domains/{reseller_domain}/nameserver',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\DomainManageController::updateNameserver
 * @see app/Http/Controllers/DomainManageController.php:104
 * @route '/domains/{reseller_domain}/nameserver'
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
* @see \App\Http\Controllers\DomainManageController::updateNameserver
 * @see app/Http/Controllers/DomainManageController.php:104
 * @route '/domains/{reseller_domain}/nameserver'
 */
updateNameserver.put = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateNameserver.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\DomainManageController::updateNameserver
 * @see app/Http/Controllers/DomainManageController.php:104
 * @route '/domains/{reseller_domain}/nameserver'
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
* @see \App\Http\Controllers\DomainManageController::updateNameserver
 * @see app/Http/Controllers/DomainManageController.php:104
 * @route '/domains/{reseller_domain}/nameserver'
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
* @see \App\Http\Controllers\DomainManageController::dns
 * @see app/Http/Controllers/DomainManageController.php:120
 * @route '/domains/{reseller_domain}/dns'
 */
export const dns = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dns.url(args, options),
    method: 'get',
})

dns.definition = {
    methods: ["get","head"],
    url: '/domains/{reseller_domain}/dns',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DomainManageController::dns
 * @see app/Http/Controllers/DomainManageController.php:120
 * @route '/domains/{reseller_domain}/dns'
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
* @see \App\Http\Controllers\DomainManageController::dns
 * @see app/Http/Controllers/DomainManageController.php:120
 * @route '/domains/{reseller_domain}/dns'
 */
dns.get = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dns.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DomainManageController::dns
 * @see app/Http/Controllers/DomainManageController.php:120
 * @route '/domains/{reseller_domain}/dns'
 */
dns.head = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dns.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DomainManageController::dns
 * @see app/Http/Controllers/DomainManageController.php:120
 * @route '/domains/{reseller_domain}/dns'
 */
    const dnsForm = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dns.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DomainManageController::dns
 * @see app/Http/Controllers/DomainManageController.php:120
 * @route '/domains/{reseller_domain}/dns'
 */
        dnsForm.get = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dns.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DomainManageController::dns
 * @see app/Http/Controllers/DomainManageController.php:120
 * @route '/domains/{reseller_domain}/dns'
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
* @see \App\Http\Controllers\DomainManageController::updateDns
 * @see app/Http/Controllers/DomainManageController.php:133
 * @route '/domains/{reseller_domain}/dns'
 */
export const updateDns = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateDns.url(args, options),
    method: 'put',
})

updateDns.definition = {
    methods: ["put"],
    url: '/domains/{reseller_domain}/dns',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\DomainManageController::updateDns
 * @see app/Http/Controllers/DomainManageController.php:133
 * @route '/domains/{reseller_domain}/dns'
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
* @see \App\Http\Controllers\DomainManageController::updateDns
 * @see app/Http/Controllers/DomainManageController.php:133
 * @route '/domains/{reseller_domain}/dns'
 */
updateDns.put = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateDns.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\DomainManageController::updateDns
 * @see app/Http/Controllers/DomainManageController.php:133
 * @route '/domains/{reseller_domain}/dns'
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
* @see \App\Http\Controllers\DomainManageController::updateDns
 * @see app/Http/Controllers/DomainManageController.php:133
 * @route '/domains/{reseller_domain}/dns'
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
/**
* @see \App\Http\Controllers\DomainManageController::getDnssec
 * @see app/Http/Controllers/DomainManageController.php:161
 * @route '/domains/{reseller_domain}/dnssec'
 */
export const getDnssec = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getDnssec.url(args, options),
    method: 'get',
})

getDnssec.definition = {
    methods: ["get","head"],
    url: '/domains/{reseller_domain}/dnssec',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DomainManageController::getDnssec
 * @see app/Http/Controllers/DomainManageController.php:161
 * @route '/domains/{reseller_domain}/dnssec'
 */
getDnssec.url = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return getDnssec.definition.url
            .replace('{reseller_domain}', parsedArgs.reseller_domain.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DomainManageController::getDnssec
 * @see app/Http/Controllers/DomainManageController.php:161
 * @route '/domains/{reseller_domain}/dnssec'
 */
getDnssec.get = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getDnssec.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DomainManageController::getDnssec
 * @see app/Http/Controllers/DomainManageController.php:161
 * @route '/domains/{reseller_domain}/dnssec'
 */
getDnssec.head = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getDnssec.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DomainManageController::getDnssec
 * @see app/Http/Controllers/DomainManageController.php:161
 * @route '/domains/{reseller_domain}/dnssec'
 */
    const getDnssecForm = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getDnssec.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DomainManageController::getDnssec
 * @see app/Http/Controllers/DomainManageController.php:161
 * @route '/domains/{reseller_domain}/dnssec'
 */
        getDnssecForm.get = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getDnssec.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DomainManageController::getDnssec
 * @see app/Http/Controllers/DomainManageController.php:161
 * @route '/domains/{reseller_domain}/dnssec'
 */
        getDnssecForm.head = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getDnssec.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getDnssec.form = getDnssecForm
/**
* @see \App\Http\Controllers\DomainManageController::setDnssec
 * @see app/Http/Controllers/DomainManageController.php:174
 * @route '/domains/{reseller_domain}/dnssec'
 */
export const setDnssec = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: setDnssec.url(args, options),
    method: 'post',
})

setDnssec.definition = {
    methods: ["post"],
    url: '/domains/{reseller_domain}/dnssec',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DomainManageController::setDnssec
 * @see app/Http/Controllers/DomainManageController.php:174
 * @route '/domains/{reseller_domain}/dnssec'
 */
setDnssec.url = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return setDnssec.definition.url
            .replace('{reseller_domain}', parsedArgs.reseller_domain.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DomainManageController::setDnssec
 * @see app/Http/Controllers/DomainManageController.php:174
 * @route '/domains/{reseller_domain}/dnssec'
 */
setDnssec.post = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: setDnssec.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DomainManageController::setDnssec
 * @see app/Http/Controllers/DomainManageController.php:174
 * @route '/domains/{reseller_domain}/dnssec'
 */
    const setDnssecForm = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: setDnssec.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DomainManageController::setDnssec
 * @see app/Http/Controllers/DomainManageController.php:174
 * @route '/domains/{reseller_domain}/dnssec'
 */
        setDnssecForm.post = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: setDnssec.url(args, options),
            method: 'post',
        })
    
    setDnssec.form = setDnssecForm
/**
* @see \App\Http\Controllers\DomainManageController::deleteDnssec
 * @see app/Http/Controllers/DomainManageController.php:199
 * @route '/domains/{reseller_domain}/dnssec'
 */
export const deleteDnssec = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteDnssec.url(args, options),
    method: 'delete',
})

deleteDnssec.definition = {
    methods: ["delete"],
    url: '/domains/{reseller_domain}/dnssec',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\DomainManageController::deleteDnssec
 * @see app/Http/Controllers/DomainManageController.php:199
 * @route '/domains/{reseller_domain}/dnssec'
 */
deleteDnssec.url = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return deleteDnssec.definition.url
            .replace('{reseller_domain}', parsedArgs.reseller_domain.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DomainManageController::deleteDnssec
 * @see app/Http/Controllers/DomainManageController.php:199
 * @route '/domains/{reseller_domain}/dnssec'
 */
deleteDnssec.delete = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteDnssec.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\DomainManageController::deleteDnssec
 * @see app/Http/Controllers/DomainManageController.php:199
 * @route '/domains/{reseller_domain}/dnssec'
 */
    const deleteDnssecForm = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: deleteDnssec.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DomainManageController::deleteDnssec
 * @see app/Http/Controllers/DomainManageController.php:199
 * @route '/domains/{reseller_domain}/dnssec'
 */
        deleteDnssecForm.delete = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: deleteDnssec.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    deleteDnssec.form = deleteDnssecForm
/**
* @see \App\Http\Controllers\DomainManageController::renew
 * @see app/Http/Controllers/DomainManageController.php:214
 * @route '/domains/{reseller_domain}/renew'
 */
export const renew = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: renew.url(args, options),
    method: 'post',
})

renew.definition = {
    methods: ["post"],
    url: '/domains/{reseller_domain}/renew',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DomainManageController::renew
 * @see app/Http/Controllers/DomainManageController.php:214
 * @route '/domains/{reseller_domain}/renew'
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
* @see \App\Http\Controllers\DomainManageController::renew
 * @see app/Http/Controllers/DomainManageController.php:214
 * @route '/domains/{reseller_domain}/renew'
 */
renew.post = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: renew.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DomainManageController::renew
 * @see app/Http/Controllers/DomainManageController.php:214
 * @route '/domains/{reseller_domain}/renew'
 */
    const renewForm = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: renew.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DomainManageController::renew
 * @see app/Http/Controllers/DomainManageController.php:214
 * @route '/domains/{reseller_domain}/renew'
 */
        renewForm.post = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: renew.url(args, options),
            method: 'post',
        })
    
    renew.form = renewForm
/**
* @see \App\Http\Controllers\DomainManageController::setAutoRenew
 * @see app/Http/Controllers/DomainManageController.php:237
 * @route '/domains/{reseller_domain}/autorenew'
 */
export const setAutoRenew = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: setAutoRenew.url(args, options),
    method: 'post',
})

setAutoRenew.definition = {
    methods: ["post"],
    url: '/domains/{reseller_domain}/autorenew',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DomainManageController::setAutoRenew
 * @see app/Http/Controllers/DomainManageController.php:237
 * @route '/domains/{reseller_domain}/autorenew'
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
* @see \App\Http\Controllers\DomainManageController::setAutoRenew
 * @see app/Http/Controllers/DomainManageController.php:237
 * @route '/domains/{reseller_domain}/autorenew'
 */
setAutoRenew.post = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: setAutoRenew.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DomainManageController::setAutoRenew
 * @see app/Http/Controllers/DomainManageController.php:237
 * @route '/domains/{reseller_domain}/autorenew'
 */
    const setAutoRenewForm = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: setAutoRenew.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DomainManageController::setAutoRenew
 * @see app/Http/Controllers/DomainManageController.php:237
 * @route '/domains/{reseller_domain}/autorenew'
 */
        setAutoRenewForm.post = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: setAutoRenew.url(args, options),
            method: 'post',
        })
    
    setAutoRenew.form = setAutoRenewForm
const DomainManageController = { show, authcode, getContact, updateContact, getWhoisLookup, updateWhoisPrivacy, updateNameserver, dns, updateDns, getDnssec, setDnssec, deleteDnssec, renew, setAutoRenew }

export default DomainManageController