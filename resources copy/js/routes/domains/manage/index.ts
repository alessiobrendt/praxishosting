import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
import contact50a660 from './contact'
import whois17998b from './whois'
import nameserver from './nameserver'
import dns5a3279 from './dns'
import dnssecBadb13 from './dnssec'
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
* @see \App\Http\Controllers\DomainManageController::contact
 * @see app/Http/Controllers/DomainManageController.php:261
 * @route '/domains/{reseller_domain}/contact'
 */
export const contact = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: contact.url(args, options),
    method: 'get',
})

contact.definition = {
    methods: ["get","head"],
    url: '/domains/{reseller_domain}/contact',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DomainManageController::contact
 * @see app/Http/Controllers/DomainManageController.php:261
 * @route '/domains/{reseller_domain}/contact'
 */
contact.url = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return contact.definition.url
            .replace('{reseller_domain}', parsedArgs.reseller_domain.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DomainManageController::contact
 * @see app/Http/Controllers/DomainManageController.php:261
 * @route '/domains/{reseller_domain}/contact'
 */
contact.get = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: contact.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DomainManageController::contact
 * @see app/Http/Controllers/DomainManageController.php:261
 * @route '/domains/{reseller_domain}/contact'
 */
contact.head = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: contact.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DomainManageController::contact
 * @see app/Http/Controllers/DomainManageController.php:261
 * @route '/domains/{reseller_domain}/contact'
 */
    const contactForm = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: contact.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DomainManageController::contact
 * @see app/Http/Controllers/DomainManageController.php:261
 * @route '/domains/{reseller_domain}/contact'
 */
        contactForm.get = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: contact.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DomainManageController::contact
 * @see app/Http/Controllers/DomainManageController.php:261
 * @route '/domains/{reseller_domain}/contact'
 */
        contactForm.head = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: contact.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    contact.form = contactForm
/**
* @see \App\Http\Controllers\DomainManageController::whois
 * @see app/Http/Controllers/DomainManageController.php:330
 * @route '/domains/{reseller_domain}/whois'
 */
export const whois = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: whois.url(args, options),
    method: 'get',
})

whois.definition = {
    methods: ["get","head"],
    url: '/domains/{reseller_domain}/whois',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DomainManageController::whois
 * @see app/Http/Controllers/DomainManageController.php:330
 * @route '/domains/{reseller_domain}/whois'
 */
whois.url = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return whois.definition.url
            .replace('{reseller_domain}', parsedArgs.reseller_domain.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DomainManageController::whois
 * @see app/Http/Controllers/DomainManageController.php:330
 * @route '/domains/{reseller_domain}/whois'
 */
whois.get = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: whois.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DomainManageController::whois
 * @see app/Http/Controllers/DomainManageController.php:330
 * @route '/domains/{reseller_domain}/whois'
 */
whois.head = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: whois.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DomainManageController::whois
 * @see app/Http/Controllers/DomainManageController.php:330
 * @route '/domains/{reseller_domain}/whois'
 */
    const whoisForm = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: whois.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DomainManageController::whois
 * @see app/Http/Controllers/DomainManageController.php:330
 * @route '/domains/{reseller_domain}/whois'
 */
        whoisForm.get = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: whois.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DomainManageController::whois
 * @see app/Http/Controllers/DomainManageController.php:330
 * @route '/domains/{reseller_domain}/whois'
 */
        whoisForm.head = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: whois.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    whois.form = whoisForm
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
* @see \App\Http\Controllers\DomainManageController::dnssec
 * @see app/Http/Controllers/DomainManageController.php:161
 * @route '/domains/{reseller_domain}/dnssec'
 */
export const dnssec = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dnssec.url(args, options),
    method: 'get',
})

dnssec.definition = {
    methods: ["get","head"],
    url: '/domains/{reseller_domain}/dnssec',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DomainManageController::dnssec
 * @see app/Http/Controllers/DomainManageController.php:161
 * @route '/domains/{reseller_domain}/dnssec'
 */
dnssec.url = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return dnssec.definition.url
            .replace('{reseller_domain}', parsedArgs.reseller_domain.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DomainManageController::dnssec
 * @see app/Http/Controllers/DomainManageController.php:161
 * @route '/domains/{reseller_domain}/dnssec'
 */
dnssec.get = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dnssec.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DomainManageController::dnssec
 * @see app/Http/Controllers/DomainManageController.php:161
 * @route '/domains/{reseller_domain}/dnssec'
 */
dnssec.head = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dnssec.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DomainManageController::dnssec
 * @see app/Http/Controllers/DomainManageController.php:161
 * @route '/domains/{reseller_domain}/dnssec'
 */
    const dnssecForm = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dnssec.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DomainManageController::dnssec
 * @see app/Http/Controllers/DomainManageController.php:161
 * @route '/domains/{reseller_domain}/dnssec'
 */
        dnssecForm.get = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dnssec.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DomainManageController::dnssec
 * @see app/Http/Controllers/DomainManageController.php:161
 * @route '/domains/{reseller_domain}/dnssec'
 */
        dnssecForm.head = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dnssec.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dnssec.form = dnssecForm
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
* @see \App\Http\Controllers\DomainManageController::autorenew
 * @see app/Http/Controllers/DomainManageController.php:237
 * @route '/domains/{reseller_domain}/autorenew'
 */
export const autorenew = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: autorenew.url(args, options),
    method: 'post',
})

autorenew.definition = {
    methods: ["post"],
    url: '/domains/{reseller_domain}/autorenew',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DomainManageController::autorenew
 * @see app/Http/Controllers/DomainManageController.php:237
 * @route '/domains/{reseller_domain}/autorenew'
 */
autorenew.url = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return autorenew.definition.url
            .replace('{reseller_domain}', parsedArgs.reseller_domain.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DomainManageController::autorenew
 * @see app/Http/Controllers/DomainManageController.php:237
 * @route '/domains/{reseller_domain}/autorenew'
 */
autorenew.post = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: autorenew.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DomainManageController::autorenew
 * @see app/Http/Controllers/DomainManageController.php:237
 * @route '/domains/{reseller_domain}/autorenew'
 */
    const autorenewForm = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: autorenew.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DomainManageController::autorenew
 * @see app/Http/Controllers/DomainManageController.php:237
 * @route '/domains/{reseller_domain}/autorenew'
 */
        autorenewForm.post = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: autorenew.url(args, options),
            method: 'post',
        })
    
    autorenew.form = autorenewForm
const manage = {
    show: Object.assign(show, show),
authcode: Object.assign(authcode, authcode),
contact: Object.assign(contact, contact50a660),
whois: Object.assign(whois, whois17998b),
nameserver: Object.assign(nameserver, nameserver),
dns: Object.assign(dns, dns5a3279),
dnssec: Object.assign(dnssec, dnssecBadb13),
renew: Object.assign(renew, renew),
autorenew: Object.assign(autorenew, autorenew),
}

export default manage