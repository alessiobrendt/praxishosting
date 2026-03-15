import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ProductShareController::storeInvitationDomain
 * @see app/Http/Controllers/ProductShareController.php:139
 * @route '/domains/{reseller_domain}/shares/invitations'
 */
export const storeInvitationDomain = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeInvitationDomain.url(args, options),
    method: 'post',
})

storeInvitationDomain.definition = {
    methods: ["post"],
    url: '/domains/{reseller_domain}/shares/invitations',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProductShareController::storeInvitationDomain
 * @see app/Http/Controllers/ProductShareController.php:139
 * @route '/domains/{reseller_domain}/shares/invitations'
 */
storeInvitationDomain.url = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return storeInvitationDomain.definition.url
            .replace('{reseller_domain}', parsedArgs.reseller_domain.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductShareController::storeInvitationDomain
 * @see app/Http/Controllers/ProductShareController.php:139
 * @route '/domains/{reseller_domain}/shares/invitations'
 */
storeInvitationDomain.post = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeInvitationDomain.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ProductShareController::storeInvitationDomain
 * @see app/Http/Controllers/ProductShareController.php:139
 * @route '/domains/{reseller_domain}/shares/invitations'
 */
    const storeInvitationDomainForm = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeInvitationDomain.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProductShareController::storeInvitationDomain
 * @see app/Http/Controllers/ProductShareController.php:139
 * @route '/domains/{reseller_domain}/shares/invitations'
 */
        storeInvitationDomainForm.post = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeInvitationDomain.url(args, options),
            method: 'post',
        })
    
    storeInvitationDomain.form = storeInvitationDomainForm
/**
* @see \App\Http\Controllers\ProductShareController::updateShareDomain
 * @see app/Http/Controllers/ProductShareController.php:199
 * @route '/domains/{reseller_domain}/shares/{share}'
 */
export const updateShareDomain = (args: { reseller_domain: string | { uuid: string }, share: number | { id: number } } | [reseller_domain: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateShareDomain.url(args, options),
    method: 'patch',
})

updateShareDomain.definition = {
    methods: ["patch"],
    url: '/domains/{reseller_domain}/shares/{share}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\ProductShareController::updateShareDomain
 * @see app/Http/Controllers/ProductShareController.php:199
 * @route '/domains/{reseller_domain}/shares/{share}'
 */
updateShareDomain.url = (args: { reseller_domain: string | { uuid: string }, share: number | { id: number } } | [reseller_domain: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    reseller_domain: args[0],
                    share: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reseller_domain: typeof args.reseller_domain === 'object'
                ? args.reseller_domain.uuid
                : args.reseller_domain,
                                share: typeof args.share === 'object'
                ? args.share.id
                : args.share,
                }

    return updateShareDomain.definition.url
            .replace('{reseller_domain}', parsedArgs.reseller_domain.toString())
            .replace('{share}', parsedArgs.share.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductShareController::updateShareDomain
 * @see app/Http/Controllers/ProductShareController.php:199
 * @route '/domains/{reseller_domain}/shares/{share}'
 */
updateShareDomain.patch = (args: { reseller_domain: string | { uuid: string }, share: number | { id: number } } | [reseller_domain: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateShareDomain.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ProductShareController::updateShareDomain
 * @see app/Http/Controllers/ProductShareController.php:199
 * @route '/domains/{reseller_domain}/shares/{share}'
 */
    const updateShareDomainForm = (args: { reseller_domain: string | { uuid: string }, share: number | { id: number } } | [reseller_domain: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateShareDomain.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProductShareController::updateShareDomain
 * @see app/Http/Controllers/ProductShareController.php:199
 * @route '/domains/{reseller_domain}/shares/{share}'
 */
        updateShareDomainForm.patch = (args: { reseller_domain: string | { uuid: string }, share: number | { id: number } } | [reseller_domain: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateShareDomain.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateShareDomain.form = updateShareDomainForm
/**
* @see \App\Http\Controllers\ProductShareController::destroyShareDomain
 * @see app/Http/Controllers/ProductShareController.php:248
 * @route '/domains/{reseller_domain}/shares/{share}'
 */
export const destroyShareDomain = (args: { reseller_domain: string | { uuid: string }, share: number | { id: number } } | [reseller_domain: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyShareDomain.url(args, options),
    method: 'delete',
})

destroyShareDomain.definition = {
    methods: ["delete"],
    url: '/domains/{reseller_domain}/shares/{share}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ProductShareController::destroyShareDomain
 * @see app/Http/Controllers/ProductShareController.php:248
 * @route '/domains/{reseller_domain}/shares/{share}'
 */
destroyShareDomain.url = (args: { reseller_domain: string | { uuid: string }, share: number | { id: number } } | [reseller_domain: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    reseller_domain: args[0],
                    share: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reseller_domain: typeof args.reseller_domain === 'object'
                ? args.reseller_domain.uuid
                : args.reseller_domain,
                                share: typeof args.share === 'object'
                ? args.share.id
                : args.share,
                }

    return destroyShareDomain.definition.url
            .replace('{reseller_domain}', parsedArgs.reseller_domain.toString())
            .replace('{share}', parsedArgs.share.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductShareController::destroyShareDomain
 * @see app/Http/Controllers/ProductShareController.php:248
 * @route '/domains/{reseller_domain}/shares/{share}'
 */
destroyShareDomain.delete = (args: { reseller_domain: string | { uuid: string }, share: number | { id: number } } | [reseller_domain: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyShareDomain.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ProductShareController::destroyShareDomain
 * @see app/Http/Controllers/ProductShareController.php:248
 * @route '/domains/{reseller_domain}/shares/{share}'
 */
    const destroyShareDomainForm = (args: { reseller_domain: string | { uuid: string }, share: number | { id: number } } | [reseller_domain: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroyShareDomain.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProductShareController::destroyShareDomain
 * @see app/Http/Controllers/ProductShareController.php:248
 * @route '/domains/{reseller_domain}/shares/{share}'
 */
        destroyShareDomainForm.delete = (args: { reseller_domain: string | { uuid: string }, share: number | { id: number } } | [reseller_domain: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroyShareDomain.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroyShareDomain.form = destroyShareDomainForm
/**
* @see \App\Http\Controllers\ProductShareController::destroyInvitationDomain
 * @see app/Http/Controllers/ProductShareController.php:297
 * @route '/domains/{reseller_domain}/invitations/{invitation}'
 */
export const destroyInvitationDomain = (args: { reseller_domain: string | { uuid: string }, invitation: number | { id: number } } | [reseller_domain: string | { uuid: string }, invitation: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyInvitationDomain.url(args, options),
    method: 'delete',
})

destroyInvitationDomain.definition = {
    methods: ["delete"],
    url: '/domains/{reseller_domain}/invitations/{invitation}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ProductShareController::destroyInvitationDomain
 * @see app/Http/Controllers/ProductShareController.php:297
 * @route '/domains/{reseller_domain}/invitations/{invitation}'
 */
destroyInvitationDomain.url = (args: { reseller_domain: string | { uuid: string }, invitation: number | { id: number } } | [reseller_domain: string | { uuid: string }, invitation: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    reseller_domain: args[0],
                    invitation: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reseller_domain: typeof args.reseller_domain === 'object'
                ? args.reseller_domain.uuid
                : args.reseller_domain,
                                invitation: typeof args.invitation === 'object'
                ? args.invitation.id
                : args.invitation,
                }

    return destroyInvitationDomain.definition.url
            .replace('{reseller_domain}', parsedArgs.reseller_domain.toString())
            .replace('{invitation}', parsedArgs.invitation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductShareController::destroyInvitationDomain
 * @see app/Http/Controllers/ProductShareController.php:297
 * @route '/domains/{reseller_domain}/invitations/{invitation}'
 */
destroyInvitationDomain.delete = (args: { reseller_domain: string | { uuid: string }, invitation: number | { id: number } } | [reseller_domain: string | { uuid: string }, invitation: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyInvitationDomain.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ProductShareController::destroyInvitationDomain
 * @see app/Http/Controllers/ProductShareController.php:297
 * @route '/domains/{reseller_domain}/invitations/{invitation}'
 */
    const destroyInvitationDomainForm = (args: { reseller_domain: string | { uuid: string }, invitation: number | { id: number } } | [reseller_domain: string | { uuid: string }, invitation: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroyInvitationDomain.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProductShareController::destroyInvitationDomain
 * @see app/Http/Controllers/ProductShareController.php:297
 * @route '/domains/{reseller_domain}/invitations/{invitation}'
 */
        destroyInvitationDomainForm.delete = (args: { reseller_domain: string | { uuid: string }, invitation: number | { id: number } } | [reseller_domain: string | { uuid: string }, invitation: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroyInvitationDomain.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroyInvitationDomain.form = destroyInvitationDomainForm
/**
* @see \App\Http\Controllers\ProductShareController::storeInvitationWebspace
 * @see app/Http/Controllers/ProductShareController.php:119
 * @route '/webspace-accounts/{webspace_account}/shares/invitations'
 */
export const storeInvitationWebspace = (args: { webspace_account: string | { uuid: string } } | [webspace_account: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeInvitationWebspace.url(args, options),
    method: 'post',
})

storeInvitationWebspace.definition = {
    methods: ["post"],
    url: '/webspace-accounts/{webspace_account}/shares/invitations',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProductShareController::storeInvitationWebspace
 * @see app/Http/Controllers/ProductShareController.php:119
 * @route '/webspace-accounts/{webspace_account}/shares/invitations'
 */
storeInvitationWebspace.url = (args: { webspace_account: string | { uuid: string } } | [webspace_account: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { webspace_account: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { webspace_account: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    webspace_account: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        webspace_account: typeof args.webspace_account === 'object'
                ? args.webspace_account.uuid
                : args.webspace_account,
                }

    return storeInvitationWebspace.definition.url
            .replace('{webspace_account}', parsedArgs.webspace_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductShareController::storeInvitationWebspace
 * @see app/Http/Controllers/ProductShareController.php:119
 * @route '/webspace-accounts/{webspace_account}/shares/invitations'
 */
storeInvitationWebspace.post = (args: { webspace_account: string | { uuid: string } } | [webspace_account: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeInvitationWebspace.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ProductShareController::storeInvitationWebspace
 * @see app/Http/Controllers/ProductShareController.php:119
 * @route '/webspace-accounts/{webspace_account}/shares/invitations'
 */
    const storeInvitationWebspaceForm = (args: { webspace_account: string | { uuid: string } } | [webspace_account: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeInvitationWebspace.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProductShareController::storeInvitationWebspace
 * @see app/Http/Controllers/ProductShareController.php:119
 * @route '/webspace-accounts/{webspace_account}/shares/invitations'
 */
        storeInvitationWebspaceForm.post = (args: { webspace_account: string | { uuid: string } } | [webspace_account: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeInvitationWebspace.url(args, options),
            method: 'post',
        })
    
    storeInvitationWebspace.form = storeInvitationWebspaceForm
/**
* @see \App\Http\Controllers\ProductShareController::updateShareWebspace
 * @see app/Http/Controllers/ProductShareController.php:179
 * @route '/webspace-accounts/{webspace_account}/shares/{share}'
 */
export const updateShareWebspace = (args: { webspace_account: string | { uuid: string }, share: number | { id: number } } | [webspace_account: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateShareWebspace.url(args, options),
    method: 'patch',
})

updateShareWebspace.definition = {
    methods: ["patch"],
    url: '/webspace-accounts/{webspace_account}/shares/{share}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\ProductShareController::updateShareWebspace
 * @see app/Http/Controllers/ProductShareController.php:179
 * @route '/webspace-accounts/{webspace_account}/shares/{share}'
 */
updateShareWebspace.url = (args: { webspace_account: string | { uuid: string }, share: number | { id: number } } | [webspace_account: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    webspace_account: args[0],
                    share: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        webspace_account: typeof args.webspace_account === 'object'
                ? args.webspace_account.uuid
                : args.webspace_account,
                                share: typeof args.share === 'object'
                ? args.share.id
                : args.share,
                }

    return updateShareWebspace.definition.url
            .replace('{webspace_account}', parsedArgs.webspace_account.toString())
            .replace('{share}', parsedArgs.share.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductShareController::updateShareWebspace
 * @see app/Http/Controllers/ProductShareController.php:179
 * @route '/webspace-accounts/{webspace_account}/shares/{share}'
 */
updateShareWebspace.patch = (args: { webspace_account: string | { uuid: string }, share: number | { id: number } } | [webspace_account: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateShareWebspace.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ProductShareController::updateShareWebspace
 * @see app/Http/Controllers/ProductShareController.php:179
 * @route '/webspace-accounts/{webspace_account}/shares/{share}'
 */
    const updateShareWebspaceForm = (args: { webspace_account: string | { uuid: string }, share: number | { id: number } } | [webspace_account: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateShareWebspace.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProductShareController::updateShareWebspace
 * @see app/Http/Controllers/ProductShareController.php:179
 * @route '/webspace-accounts/{webspace_account}/shares/{share}'
 */
        updateShareWebspaceForm.patch = (args: { webspace_account: string | { uuid: string }, share: number | { id: number } } | [webspace_account: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateShareWebspace.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateShareWebspace.form = updateShareWebspaceForm
/**
* @see \App\Http\Controllers\ProductShareController::destroyShareWebspace
 * @see app/Http/Controllers/ProductShareController.php:228
 * @route '/webspace-accounts/{webspace_account}/shares/{share}'
 */
export const destroyShareWebspace = (args: { webspace_account: string | { uuid: string }, share: number | { id: number } } | [webspace_account: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyShareWebspace.url(args, options),
    method: 'delete',
})

destroyShareWebspace.definition = {
    methods: ["delete"],
    url: '/webspace-accounts/{webspace_account}/shares/{share}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ProductShareController::destroyShareWebspace
 * @see app/Http/Controllers/ProductShareController.php:228
 * @route '/webspace-accounts/{webspace_account}/shares/{share}'
 */
destroyShareWebspace.url = (args: { webspace_account: string | { uuid: string }, share: number | { id: number } } | [webspace_account: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    webspace_account: args[0],
                    share: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        webspace_account: typeof args.webspace_account === 'object'
                ? args.webspace_account.uuid
                : args.webspace_account,
                                share: typeof args.share === 'object'
                ? args.share.id
                : args.share,
                }

    return destroyShareWebspace.definition.url
            .replace('{webspace_account}', parsedArgs.webspace_account.toString())
            .replace('{share}', parsedArgs.share.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductShareController::destroyShareWebspace
 * @see app/Http/Controllers/ProductShareController.php:228
 * @route '/webspace-accounts/{webspace_account}/shares/{share}'
 */
destroyShareWebspace.delete = (args: { webspace_account: string | { uuid: string }, share: number | { id: number } } | [webspace_account: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyShareWebspace.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ProductShareController::destroyShareWebspace
 * @see app/Http/Controllers/ProductShareController.php:228
 * @route '/webspace-accounts/{webspace_account}/shares/{share}'
 */
    const destroyShareWebspaceForm = (args: { webspace_account: string | { uuid: string }, share: number | { id: number } } | [webspace_account: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroyShareWebspace.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProductShareController::destroyShareWebspace
 * @see app/Http/Controllers/ProductShareController.php:228
 * @route '/webspace-accounts/{webspace_account}/shares/{share}'
 */
        destroyShareWebspaceForm.delete = (args: { webspace_account: string | { uuid: string }, share: number | { id: number } } | [webspace_account: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroyShareWebspace.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroyShareWebspace.form = destroyShareWebspaceForm
/**
* @see \App\Http\Controllers\ProductShareController::destroyInvitationWebspace
 * @see app/Http/Controllers/ProductShareController.php:277
 * @route '/webspace-accounts/{webspace_account}/invitations/{invitation}'
 */
export const destroyInvitationWebspace = (args: { webspace_account: string | { uuid: string }, invitation: number | { id: number } } | [webspace_account: string | { uuid: string }, invitation: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyInvitationWebspace.url(args, options),
    method: 'delete',
})

destroyInvitationWebspace.definition = {
    methods: ["delete"],
    url: '/webspace-accounts/{webspace_account}/invitations/{invitation}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ProductShareController::destroyInvitationWebspace
 * @see app/Http/Controllers/ProductShareController.php:277
 * @route '/webspace-accounts/{webspace_account}/invitations/{invitation}'
 */
destroyInvitationWebspace.url = (args: { webspace_account: string | { uuid: string }, invitation: number | { id: number } } | [webspace_account: string | { uuid: string }, invitation: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    webspace_account: args[0],
                    invitation: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        webspace_account: typeof args.webspace_account === 'object'
                ? args.webspace_account.uuid
                : args.webspace_account,
                                invitation: typeof args.invitation === 'object'
                ? args.invitation.id
                : args.invitation,
                }

    return destroyInvitationWebspace.definition.url
            .replace('{webspace_account}', parsedArgs.webspace_account.toString())
            .replace('{invitation}', parsedArgs.invitation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductShareController::destroyInvitationWebspace
 * @see app/Http/Controllers/ProductShareController.php:277
 * @route '/webspace-accounts/{webspace_account}/invitations/{invitation}'
 */
destroyInvitationWebspace.delete = (args: { webspace_account: string | { uuid: string }, invitation: number | { id: number } } | [webspace_account: string | { uuid: string }, invitation: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyInvitationWebspace.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ProductShareController::destroyInvitationWebspace
 * @see app/Http/Controllers/ProductShareController.php:277
 * @route '/webspace-accounts/{webspace_account}/invitations/{invitation}'
 */
    const destroyInvitationWebspaceForm = (args: { webspace_account: string | { uuid: string }, invitation: number | { id: number } } | [webspace_account: string | { uuid: string }, invitation: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroyInvitationWebspace.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProductShareController::destroyInvitationWebspace
 * @see app/Http/Controllers/ProductShareController.php:277
 * @route '/webspace-accounts/{webspace_account}/invitations/{invitation}'
 */
        destroyInvitationWebspaceForm.delete = (args: { webspace_account: string | { uuid: string }, invitation: number | { id: number } } | [webspace_account: string | { uuid: string }, invitation: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroyInvitationWebspace.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroyInvitationWebspace.form = destroyInvitationWebspaceForm
/**
* @see \App\Http\Controllers\ProductShareController::storeInvitationGameserverCloud
 * @see app/Http/Controllers/ProductShareController.php:134
 * @route '/gaming/cloud/subscriptions/{subscription}/shares/invitations'
 */
export const storeInvitationGameserverCloud = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeInvitationGameserverCloud.url(args, options),
    method: 'post',
})

storeInvitationGameserverCloud.definition = {
    methods: ["post"],
    url: '/gaming/cloud/subscriptions/{subscription}/shares/invitations',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProductShareController::storeInvitationGameserverCloud
 * @see app/Http/Controllers/ProductShareController.php:134
 * @route '/gaming/cloud/subscriptions/{subscription}/shares/invitations'
 */
storeInvitationGameserverCloud.url = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return storeInvitationGameserverCloud.definition.url
            .replace('{subscription}', parsedArgs.subscription.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductShareController::storeInvitationGameserverCloud
 * @see app/Http/Controllers/ProductShareController.php:134
 * @route '/gaming/cloud/subscriptions/{subscription}/shares/invitations'
 */
storeInvitationGameserverCloud.post = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeInvitationGameserverCloud.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ProductShareController::storeInvitationGameserverCloud
 * @see app/Http/Controllers/ProductShareController.php:134
 * @route '/gaming/cloud/subscriptions/{subscription}/shares/invitations'
 */
    const storeInvitationGameserverCloudForm = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeInvitationGameserverCloud.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProductShareController::storeInvitationGameserverCloud
 * @see app/Http/Controllers/ProductShareController.php:134
 * @route '/gaming/cloud/subscriptions/{subscription}/shares/invitations'
 */
        storeInvitationGameserverCloudForm.post = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeInvitationGameserverCloud.url(args, options),
            method: 'post',
        })
    
    storeInvitationGameserverCloud.form = storeInvitationGameserverCloudForm
/**
* @see \App\Http\Controllers\ProductShareController::updateShareGameserverCloud
 * @see app/Http/Controllers/ProductShareController.php:194
 * @route '/gaming/cloud/subscriptions/{subscription}/shares/{share}'
 */
export const updateShareGameserverCloud = (args: { subscription: string | { uuid: string }, share: number | { id: number } } | [subscription: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateShareGameserverCloud.url(args, options),
    method: 'patch',
})

updateShareGameserverCloud.definition = {
    methods: ["patch"],
    url: '/gaming/cloud/subscriptions/{subscription}/shares/{share}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\ProductShareController::updateShareGameserverCloud
 * @see app/Http/Controllers/ProductShareController.php:194
 * @route '/gaming/cloud/subscriptions/{subscription}/shares/{share}'
 */
updateShareGameserverCloud.url = (args: { subscription: string | { uuid: string }, share: number | { id: number } } | [subscription: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    subscription: args[0],
                    share: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        subscription: typeof args.subscription === 'object'
                ? args.subscription.uuid
                : args.subscription,
                                share: typeof args.share === 'object'
                ? args.share.id
                : args.share,
                }

    return updateShareGameserverCloud.definition.url
            .replace('{subscription}', parsedArgs.subscription.toString())
            .replace('{share}', parsedArgs.share.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductShareController::updateShareGameserverCloud
 * @see app/Http/Controllers/ProductShareController.php:194
 * @route '/gaming/cloud/subscriptions/{subscription}/shares/{share}'
 */
updateShareGameserverCloud.patch = (args: { subscription: string | { uuid: string }, share: number | { id: number } } | [subscription: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateShareGameserverCloud.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ProductShareController::updateShareGameserverCloud
 * @see app/Http/Controllers/ProductShareController.php:194
 * @route '/gaming/cloud/subscriptions/{subscription}/shares/{share}'
 */
    const updateShareGameserverCloudForm = (args: { subscription: string | { uuid: string }, share: number | { id: number } } | [subscription: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateShareGameserverCloud.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProductShareController::updateShareGameserverCloud
 * @see app/Http/Controllers/ProductShareController.php:194
 * @route '/gaming/cloud/subscriptions/{subscription}/shares/{share}'
 */
        updateShareGameserverCloudForm.patch = (args: { subscription: string | { uuid: string }, share: number | { id: number } } | [subscription: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateShareGameserverCloud.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateShareGameserverCloud.form = updateShareGameserverCloudForm
/**
* @see \App\Http\Controllers\ProductShareController::destroyShareGameserverCloud
 * @see app/Http/Controllers/ProductShareController.php:243
 * @route '/gaming/cloud/subscriptions/{subscription}/shares/{share}'
 */
export const destroyShareGameserverCloud = (args: { subscription: string | { uuid: string }, share: number | { id: number } } | [subscription: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyShareGameserverCloud.url(args, options),
    method: 'delete',
})

destroyShareGameserverCloud.definition = {
    methods: ["delete"],
    url: '/gaming/cloud/subscriptions/{subscription}/shares/{share}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ProductShareController::destroyShareGameserverCloud
 * @see app/Http/Controllers/ProductShareController.php:243
 * @route '/gaming/cloud/subscriptions/{subscription}/shares/{share}'
 */
destroyShareGameserverCloud.url = (args: { subscription: string | { uuid: string }, share: number | { id: number } } | [subscription: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    subscription: args[0],
                    share: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        subscription: typeof args.subscription === 'object'
                ? args.subscription.uuid
                : args.subscription,
                                share: typeof args.share === 'object'
                ? args.share.id
                : args.share,
                }

    return destroyShareGameserverCloud.definition.url
            .replace('{subscription}', parsedArgs.subscription.toString())
            .replace('{share}', parsedArgs.share.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductShareController::destroyShareGameserverCloud
 * @see app/Http/Controllers/ProductShareController.php:243
 * @route '/gaming/cloud/subscriptions/{subscription}/shares/{share}'
 */
destroyShareGameserverCloud.delete = (args: { subscription: string | { uuid: string }, share: number | { id: number } } | [subscription: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyShareGameserverCloud.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ProductShareController::destroyShareGameserverCloud
 * @see app/Http/Controllers/ProductShareController.php:243
 * @route '/gaming/cloud/subscriptions/{subscription}/shares/{share}'
 */
    const destroyShareGameserverCloudForm = (args: { subscription: string | { uuid: string }, share: number | { id: number } } | [subscription: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroyShareGameserverCloud.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProductShareController::destroyShareGameserverCloud
 * @see app/Http/Controllers/ProductShareController.php:243
 * @route '/gaming/cloud/subscriptions/{subscription}/shares/{share}'
 */
        destroyShareGameserverCloudForm.delete = (args: { subscription: string | { uuid: string }, share: number | { id: number } } | [subscription: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroyShareGameserverCloud.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroyShareGameserverCloud.form = destroyShareGameserverCloudForm
/**
* @see \App\Http\Controllers\ProductShareController::destroyInvitationGameserverCloud
 * @see app/Http/Controllers/ProductShareController.php:292
 * @route '/gaming/cloud/subscriptions/{subscription}/invitations/{invitation}'
 */
export const destroyInvitationGameserverCloud = (args: { subscription: string | { uuid: string }, invitation: number | { id: number } } | [subscription: string | { uuid: string }, invitation: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyInvitationGameserverCloud.url(args, options),
    method: 'delete',
})

destroyInvitationGameserverCloud.definition = {
    methods: ["delete"],
    url: '/gaming/cloud/subscriptions/{subscription}/invitations/{invitation}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ProductShareController::destroyInvitationGameserverCloud
 * @see app/Http/Controllers/ProductShareController.php:292
 * @route '/gaming/cloud/subscriptions/{subscription}/invitations/{invitation}'
 */
destroyInvitationGameserverCloud.url = (args: { subscription: string | { uuid: string }, invitation: number | { id: number } } | [subscription: string | { uuid: string }, invitation: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    subscription: args[0],
                    invitation: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        subscription: typeof args.subscription === 'object'
                ? args.subscription.uuid
                : args.subscription,
                                invitation: typeof args.invitation === 'object'
                ? args.invitation.id
                : args.invitation,
                }

    return destroyInvitationGameserverCloud.definition.url
            .replace('{subscription}', parsedArgs.subscription.toString())
            .replace('{invitation}', parsedArgs.invitation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductShareController::destroyInvitationGameserverCloud
 * @see app/Http/Controllers/ProductShareController.php:292
 * @route '/gaming/cloud/subscriptions/{subscription}/invitations/{invitation}'
 */
destroyInvitationGameserverCloud.delete = (args: { subscription: string | { uuid: string }, invitation: number | { id: number } } | [subscription: string | { uuid: string }, invitation: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyInvitationGameserverCloud.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ProductShareController::destroyInvitationGameserverCloud
 * @see app/Http/Controllers/ProductShareController.php:292
 * @route '/gaming/cloud/subscriptions/{subscription}/invitations/{invitation}'
 */
    const destroyInvitationGameserverCloudForm = (args: { subscription: string | { uuid: string }, invitation: number | { id: number } } | [subscription: string | { uuid: string }, invitation: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroyInvitationGameserverCloud.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProductShareController::destroyInvitationGameserverCloud
 * @see app/Http/Controllers/ProductShareController.php:292
 * @route '/gaming/cloud/subscriptions/{subscription}/invitations/{invitation}'
 */
        destroyInvitationGameserverCloudForm.delete = (args: { subscription: string | { uuid: string }, invitation: number | { id: number } } | [subscription: string | { uuid: string }, invitation: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroyInvitationGameserverCloud.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroyInvitationGameserverCloud.form = destroyInvitationGameserverCloudForm
/**
* @see \App\Http\Controllers\ProductShareController::storeInvitationGameServer
 * @see app/Http/Controllers/ProductShareController.php:124
 * @route '/gaming-accounts/{game_server_account}/shares/invitations'
 */
export const storeInvitationGameServer = (args: { game_server_account: string | { uuid: string } } | [game_server_account: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeInvitationGameServer.url(args, options),
    method: 'post',
})

storeInvitationGameServer.definition = {
    methods: ["post"],
    url: '/gaming-accounts/{game_server_account}/shares/invitations',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProductShareController::storeInvitationGameServer
 * @see app/Http/Controllers/ProductShareController.php:124
 * @route '/gaming-accounts/{game_server_account}/shares/invitations'
 */
storeInvitationGameServer.url = (args: { game_server_account: string | { uuid: string } } | [game_server_account: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { game_server_account: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { game_server_account: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    game_server_account: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        game_server_account: typeof args.game_server_account === 'object'
                ? args.game_server_account.uuid
                : args.game_server_account,
                }

    return storeInvitationGameServer.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductShareController::storeInvitationGameServer
 * @see app/Http/Controllers/ProductShareController.php:124
 * @route '/gaming-accounts/{game_server_account}/shares/invitations'
 */
storeInvitationGameServer.post = (args: { game_server_account: string | { uuid: string } } | [game_server_account: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeInvitationGameServer.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ProductShareController::storeInvitationGameServer
 * @see app/Http/Controllers/ProductShareController.php:124
 * @route '/gaming-accounts/{game_server_account}/shares/invitations'
 */
    const storeInvitationGameServerForm = (args: { game_server_account: string | { uuid: string } } | [game_server_account: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeInvitationGameServer.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProductShareController::storeInvitationGameServer
 * @see app/Http/Controllers/ProductShareController.php:124
 * @route '/gaming-accounts/{game_server_account}/shares/invitations'
 */
        storeInvitationGameServerForm.post = (args: { game_server_account: string | { uuid: string } } | [game_server_account: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeInvitationGameServer.url(args, options),
            method: 'post',
        })
    
    storeInvitationGameServer.form = storeInvitationGameServerForm
/**
* @see \App\Http\Controllers\ProductShareController::updateShareGameServer
 * @see app/Http/Controllers/ProductShareController.php:184
 * @route '/gaming-accounts/{game_server_account}/shares/{share}'
 */
export const updateShareGameServer = (args: { game_server_account: string | { uuid: string }, share: number | { id: number } } | [game_server_account: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateShareGameServer.url(args, options),
    method: 'patch',
})

updateShareGameServer.definition = {
    methods: ["patch"],
    url: '/gaming-accounts/{game_server_account}/shares/{share}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\ProductShareController::updateShareGameServer
 * @see app/Http/Controllers/ProductShareController.php:184
 * @route '/gaming-accounts/{game_server_account}/shares/{share}'
 */
updateShareGameServer.url = (args: { game_server_account: string | { uuid: string }, share: number | { id: number } } | [game_server_account: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    game_server_account: args[0],
                    share: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        game_server_account: typeof args.game_server_account === 'object'
                ? args.game_server_account.uuid
                : args.game_server_account,
                                share: typeof args.share === 'object'
                ? args.share.id
                : args.share,
                }

    return updateShareGameServer.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace('{share}', parsedArgs.share.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductShareController::updateShareGameServer
 * @see app/Http/Controllers/ProductShareController.php:184
 * @route '/gaming-accounts/{game_server_account}/shares/{share}'
 */
updateShareGameServer.patch = (args: { game_server_account: string | { uuid: string }, share: number | { id: number } } | [game_server_account: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateShareGameServer.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ProductShareController::updateShareGameServer
 * @see app/Http/Controllers/ProductShareController.php:184
 * @route '/gaming-accounts/{game_server_account}/shares/{share}'
 */
    const updateShareGameServerForm = (args: { game_server_account: string | { uuid: string }, share: number | { id: number } } | [game_server_account: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateShareGameServer.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProductShareController::updateShareGameServer
 * @see app/Http/Controllers/ProductShareController.php:184
 * @route '/gaming-accounts/{game_server_account}/shares/{share}'
 */
        updateShareGameServerForm.patch = (args: { game_server_account: string | { uuid: string }, share: number | { id: number } } | [game_server_account: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateShareGameServer.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateShareGameServer.form = updateShareGameServerForm
/**
* @see \App\Http\Controllers\ProductShareController::destroyShareGameServer
 * @see app/Http/Controllers/ProductShareController.php:233
 * @route '/gaming-accounts/{game_server_account}/shares/{share}'
 */
export const destroyShareGameServer = (args: { game_server_account: string | { uuid: string }, share: number | { id: number } } | [game_server_account: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyShareGameServer.url(args, options),
    method: 'delete',
})

destroyShareGameServer.definition = {
    methods: ["delete"],
    url: '/gaming-accounts/{game_server_account}/shares/{share}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ProductShareController::destroyShareGameServer
 * @see app/Http/Controllers/ProductShareController.php:233
 * @route '/gaming-accounts/{game_server_account}/shares/{share}'
 */
destroyShareGameServer.url = (args: { game_server_account: string | { uuid: string }, share: number | { id: number } } | [game_server_account: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    game_server_account: args[0],
                    share: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        game_server_account: typeof args.game_server_account === 'object'
                ? args.game_server_account.uuid
                : args.game_server_account,
                                share: typeof args.share === 'object'
                ? args.share.id
                : args.share,
                }

    return destroyShareGameServer.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace('{share}', parsedArgs.share.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductShareController::destroyShareGameServer
 * @see app/Http/Controllers/ProductShareController.php:233
 * @route '/gaming-accounts/{game_server_account}/shares/{share}'
 */
destroyShareGameServer.delete = (args: { game_server_account: string | { uuid: string }, share: number | { id: number } } | [game_server_account: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyShareGameServer.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ProductShareController::destroyShareGameServer
 * @see app/Http/Controllers/ProductShareController.php:233
 * @route '/gaming-accounts/{game_server_account}/shares/{share}'
 */
    const destroyShareGameServerForm = (args: { game_server_account: string | { uuid: string }, share: number | { id: number } } | [game_server_account: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroyShareGameServer.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProductShareController::destroyShareGameServer
 * @see app/Http/Controllers/ProductShareController.php:233
 * @route '/gaming-accounts/{game_server_account}/shares/{share}'
 */
        destroyShareGameServerForm.delete = (args: { game_server_account: string | { uuid: string }, share: number | { id: number } } | [game_server_account: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroyShareGameServer.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroyShareGameServer.form = destroyShareGameServerForm
/**
* @see \App\Http\Controllers\ProductShareController::destroyInvitationGameServer
 * @see app/Http/Controllers/ProductShareController.php:282
 * @route '/gaming-accounts/{game_server_account}/invitations/{invitation}'
 */
export const destroyInvitationGameServer = (args: { game_server_account: string | { uuid: string }, invitation: number | { id: number } } | [game_server_account: string | { uuid: string }, invitation: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyInvitationGameServer.url(args, options),
    method: 'delete',
})

destroyInvitationGameServer.definition = {
    methods: ["delete"],
    url: '/gaming-accounts/{game_server_account}/invitations/{invitation}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ProductShareController::destroyInvitationGameServer
 * @see app/Http/Controllers/ProductShareController.php:282
 * @route '/gaming-accounts/{game_server_account}/invitations/{invitation}'
 */
destroyInvitationGameServer.url = (args: { game_server_account: string | { uuid: string }, invitation: number | { id: number } } | [game_server_account: string | { uuid: string }, invitation: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    game_server_account: args[0],
                    invitation: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        game_server_account: typeof args.game_server_account === 'object'
                ? args.game_server_account.uuid
                : args.game_server_account,
                                invitation: typeof args.invitation === 'object'
                ? args.invitation.id
                : args.invitation,
                }

    return destroyInvitationGameServer.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace('{invitation}', parsedArgs.invitation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductShareController::destroyInvitationGameServer
 * @see app/Http/Controllers/ProductShareController.php:282
 * @route '/gaming-accounts/{game_server_account}/invitations/{invitation}'
 */
destroyInvitationGameServer.delete = (args: { game_server_account: string | { uuid: string }, invitation: number | { id: number } } | [game_server_account: string | { uuid: string }, invitation: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyInvitationGameServer.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ProductShareController::destroyInvitationGameServer
 * @see app/Http/Controllers/ProductShareController.php:282
 * @route '/gaming-accounts/{game_server_account}/invitations/{invitation}'
 */
    const destroyInvitationGameServerForm = (args: { game_server_account: string | { uuid: string }, invitation: number | { id: number } } | [game_server_account: string | { uuid: string }, invitation: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroyInvitationGameServer.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProductShareController::destroyInvitationGameServer
 * @see app/Http/Controllers/ProductShareController.php:282
 * @route '/gaming-accounts/{game_server_account}/invitations/{invitation}'
 */
        destroyInvitationGameServerForm.delete = (args: { game_server_account: string | { uuid: string }, invitation: number | { id: number } } | [game_server_account: string | { uuid: string }, invitation: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroyInvitationGameServer.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroyInvitationGameServer.form = destroyInvitationGameServerForm
/**
* @see \App\Http\Controllers\ProductShareController::storeInvitationTeamSpeak
 * @see app/Http/Controllers/ProductShareController.php:129
 * @route '/teamspeak-accounts/{team_speak_server_account}/shares/invitations'
 */
export const storeInvitationTeamSpeak = (args: { team_speak_server_account: string | { uuid: string } } | [team_speak_server_account: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeInvitationTeamSpeak.url(args, options),
    method: 'post',
})

storeInvitationTeamSpeak.definition = {
    methods: ["post"],
    url: '/teamspeak-accounts/{team_speak_server_account}/shares/invitations',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProductShareController::storeInvitationTeamSpeak
 * @see app/Http/Controllers/ProductShareController.php:129
 * @route '/teamspeak-accounts/{team_speak_server_account}/shares/invitations'
 */
storeInvitationTeamSpeak.url = (args: { team_speak_server_account: string | { uuid: string } } | [team_speak_server_account: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { team_speak_server_account: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { team_speak_server_account: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    team_speak_server_account: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        team_speak_server_account: typeof args.team_speak_server_account === 'object'
                ? args.team_speak_server_account.uuid
                : args.team_speak_server_account,
                }

    return storeInvitationTeamSpeak.definition.url
            .replace('{team_speak_server_account}', parsedArgs.team_speak_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductShareController::storeInvitationTeamSpeak
 * @see app/Http/Controllers/ProductShareController.php:129
 * @route '/teamspeak-accounts/{team_speak_server_account}/shares/invitations'
 */
storeInvitationTeamSpeak.post = (args: { team_speak_server_account: string | { uuid: string } } | [team_speak_server_account: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeInvitationTeamSpeak.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ProductShareController::storeInvitationTeamSpeak
 * @see app/Http/Controllers/ProductShareController.php:129
 * @route '/teamspeak-accounts/{team_speak_server_account}/shares/invitations'
 */
    const storeInvitationTeamSpeakForm = (args: { team_speak_server_account: string | { uuid: string } } | [team_speak_server_account: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeInvitationTeamSpeak.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProductShareController::storeInvitationTeamSpeak
 * @see app/Http/Controllers/ProductShareController.php:129
 * @route '/teamspeak-accounts/{team_speak_server_account}/shares/invitations'
 */
        storeInvitationTeamSpeakForm.post = (args: { team_speak_server_account: string | { uuid: string } } | [team_speak_server_account: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeInvitationTeamSpeak.url(args, options),
            method: 'post',
        })
    
    storeInvitationTeamSpeak.form = storeInvitationTeamSpeakForm
/**
* @see \App\Http\Controllers\ProductShareController::updateShareTeamSpeak
 * @see app/Http/Controllers/ProductShareController.php:189
 * @route '/teamspeak-accounts/{team_speak_server_account}/shares/{share}'
 */
export const updateShareTeamSpeak = (args: { team_speak_server_account: string | { uuid: string }, share: number | { id: number } } | [team_speak_server_account: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateShareTeamSpeak.url(args, options),
    method: 'patch',
})

updateShareTeamSpeak.definition = {
    methods: ["patch"],
    url: '/teamspeak-accounts/{team_speak_server_account}/shares/{share}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\ProductShareController::updateShareTeamSpeak
 * @see app/Http/Controllers/ProductShareController.php:189
 * @route '/teamspeak-accounts/{team_speak_server_account}/shares/{share}'
 */
updateShareTeamSpeak.url = (args: { team_speak_server_account: string | { uuid: string }, share: number | { id: number } } | [team_speak_server_account: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    team_speak_server_account: args[0],
                    share: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        team_speak_server_account: typeof args.team_speak_server_account === 'object'
                ? args.team_speak_server_account.uuid
                : args.team_speak_server_account,
                                share: typeof args.share === 'object'
                ? args.share.id
                : args.share,
                }

    return updateShareTeamSpeak.definition.url
            .replace('{team_speak_server_account}', parsedArgs.team_speak_server_account.toString())
            .replace('{share}', parsedArgs.share.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductShareController::updateShareTeamSpeak
 * @see app/Http/Controllers/ProductShareController.php:189
 * @route '/teamspeak-accounts/{team_speak_server_account}/shares/{share}'
 */
updateShareTeamSpeak.patch = (args: { team_speak_server_account: string | { uuid: string }, share: number | { id: number } } | [team_speak_server_account: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateShareTeamSpeak.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ProductShareController::updateShareTeamSpeak
 * @see app/Http/Controllers/ProductShareController.php:189
 * @route '/teamspeak-accounts/{team_speak_server_account}/shares/{share}'
 */
    const updateShareTeamSpeakForm = (args: { team_speak_server_account: string | { uuid: string }, share: number | { id: number } } | [team_speak_server_account: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateShareTeamSpeak.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProductShareController::updateShareTeamSpeak
 * @see app/Http/Controllers/ProductShareController.php:189
 * @route '/teamspeak-accounts/{team_speak_server_account}/shares/{share}'
 */
        updateShareTeamSpeakForm.patch = (args: { team_speak_server_account: string | { uuid: string }, share: number | { id: number } } | [team_speak_server_account: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateShareTeamSpeak.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateShareTeamSpeak.form = updateShareTeamSpeakForm
/**
* @see \App\Http\Controllers\ProductShareController::destroyShareTeamSpeak
 * @see app/Http/Controllers/ProductShareController.php:238
 * @route '/teamspeak-accounts/{team_speak_server_account}/shares/{share}'
 */
export const destroyShareTeamSpeak = (args: { team_speak_server_account: string | { uuid: string }, share: number | { id: number } } | [team_speak_server_account: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyShareTeamSpeak.url(args, options),
    method: 'delete',
})

destroyShareTeamSpeak.definition = {
    methods: ["delete"],
    url: '/teamspeak-accounts/{team_speak_server_account}/shares/{share}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ProductShareController::destroyShareTeamSpeak
 * @see app/Http/Controllers/ProductShareController.php:238
 * @route '/teamspeak-accounts/{team_speak_server_account}/shares/{share}'
 */
destroyShareTeamSpeak.url = (args: { team_speak_server_account: string | { uuid: string }, share: number | { id: number } } | [team_speak_server_account: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    team_speak_server_account: args[0],
                    share: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        team_speak_server_account: typeof args.team_speak_server_account === 'object'
                ? args.team_speak_server_account.uuid
                : args.team_speak_server_account,
                                share: typeof args.share === 'object'
                ? args.share.id
                : args.share,
                }

    return destroyShareTeamSpeak.definition.url
            .replace('{team_speak_server_account}', parsedArgs.team_speak_server_account.toString())
            .replace('{share}', parsedArgs.share.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductShareController::destroyShareTeamSpeak
 * @see app/Http/Controllers/ProductShareController.php:238
 * @route '/teamspeak-accounts/{team_speak_server_account}/shares/{share}'
 */
destroyShareTeamSpeak.delete = (args: { team_speak_server_account: string | { uuid: string }, share: number | { id: number } } | [team_speak_server_account: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyShareTeamSpeak.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ProductShareController::destroyShareTeamSpeak
 * @see app/Http/Controllers/ProductShareController.php:238
 * @route '/teamspeak-accounts/{team_speak_server_account}/shares/{share}'
 */
    const destroyShareTeamSpeakForm = (args: { team_speak_server_account: string | { uuid: string }, share: number | { id: number } } | [team_speak_server_account: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroyShareTeamSpeak.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProductShareController::destroyShareTeamSpeak
 * @see app/Http/Controllers/ProductShareController.php:238
 * @route '/teamspeak-accounts/{team_speak_server_account}/shares/{share}'
 */
        destroyShareTeamSpeakForm.delete = (args: { team_speak_server_account: string | { uuid: string }, share: number | { id: number } } | [team_speak_server_account: string | { uuid: string }, share: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroyShareTeamSpeak.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroyShareTeamSpeak.form = destroyShareTeamSpeakForm
/**
* @see \App\Http\Controllers\ProductShareController::destroyInvitationTeamSpeak
 * @see app/Http/Controllers/ProductShareController.php:287
 * @route '/teamspeak-accounts/{team_speak_server_account}/invitations/{invitation}'
 */
export const destroyInvitationTeamSpeak = (args: { team_speak_server_account: string | { uuid: string }, invitation: number | { id: number } } | [team_speak_server_account: string | { uuid: string }, invitation: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyInvitationTeamSpeak.url(args, options),
    method: 'delete',
})

destroyInvitationTeamSpeak.definition = {
    methods: ["delete"],
    url: '/teamspeak-accounts/{team_speak_server_account}/invitations/{invitation}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ProductShareController::destroyInvitationTeamSpeak
 * @see app/Http/Controllers/ProductShareController.php:287
 * @route '/teamspeak-accounts/{team_speak_server_account}/invitations/{invitation}'
 */
destroyInvitationTeamSpeak.url = (args: { team_speak_server_account: string | { uuid: string }, invitation: number | { id: number } } | [team_speak_server_account: string | { uuid: string }, invitation: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    team_speak_server_account: args[0],
                    invitation: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        team_speak_server_account: typeof args.team_speak_server_account === 'object'
                ? args.team_speak_server_account.uuid
                : args.team_speak_server_account,
                                invitation: typeof args.invitation === 'object'
                ? args.invitation.id
                : args.invitation,
                }

    return destroyInvitationTeamSpeak.definition.url
            .replace('{team_speak_server_account}', parsedArgs.team_speak_server_account.toString())
            .replace('{invitation}', parsedArgs.invitation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductShareController::destroyInvitationTeamSpeak
 * @see app/Http/Controllers/ProductShareController.php:287
 * @route '/teamspeak-accounts/{team_speak_server_account}/invitations/{invitation}'
 */
destroyInvitationTeamSpeak.delete = (args: { team_speak_server_account: string | { uuid: string }, invitation: number | { id: number } } | [team_speak_server_account: string | { uuid: string }, invitation: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyInvitationTeamSpeak.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ProductShareController::destroyInvitationTeamSpeak
 * @see app/Http/Controllers/ProductShareController.php:287
 * @route '/teamspeak-accounts/{team_speak_server_account}/invitations/{invitation}'
 */
    const destroyInvitationTeamSpeakForm = (args: { team_speak_server_account: string | { uuid: string }, invitation: number | { id: number } } | [team_speak_server_account: string | { uuid: string }, invitation: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroyInvitationTeamSpeak.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProductShareController::destroyInvitationTeamSpeak
 * @see app/Http/Controllers/ProductShareController.php:287
 * @route '/teamspeak-accounts/{team_speak_server_account}/invitations/{invitation}'
 */
        destroyInvitationTeamSpeakForm.delete = (args: { team_speak_server_account: string | { uuid: string }, invitation: number | { id: number } } | [team_speak_server_account: string | { uuid: string }, invitation: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroyInvitationTeamSpeak.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroyInvitationTeamSpeak.form = destroyInvitationTeamSpeakForm
const ProductShareController = { storeInvitationDomain, updateShareDomain, destroyShareDomain, destroyInvitationDomain, storeInvitationWebspace, updateShareWebspace, destroyShareWebspace, destroyInvitationWebspace, storeInvitationGameserverCloud, updateShareGameserverCloud, destroyShareGameserverCloud, destroyInvitationGameserverCloud, storeInvitationGameServer, updateShareGameServer, destroyShareGameServer, destroyInvitationGameServer, storeInvitationTeamSpeak, updateShareTeamSpeak, destroyShareTeamSpeak, destroyInvitationTeamSpeak }

export default ProductShareController