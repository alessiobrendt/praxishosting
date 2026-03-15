import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::index
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:35
 * @route '/admin/gaming-accounts'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/gaming-accounts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::index
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:35
 * @route '/admin/gaming-accounts'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::index
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:35
 * @route '/admin/gaming-accounts'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::index
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:35
 * @route '/admin/gaming-accounts'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\GameServerAccountController::index
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:35
 * @route '/admin/gaming-accounts'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\GameServerAccountController::index
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:35
 * @route '/admin/gaming-accounts'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\GameServerAccountController::index
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:35
 * @route '/admin/gaming-accounts'
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
* @see \App\Http\Controllers\Admin\GameServerAccountController::cloudIndex
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:64
 * @route '/admin/gameserver-cloud-accounts'
 */
export const cloudIndex = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cloudIndex.url(options),
    method: 'get',
})

cloudIndex.definition = {
    methods: ["get","head"],
    url: '/admin/gameserver-cloud-accounts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::cloudIndex
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:64
 * @route '/admin/gameserver-cloud-accounts'
 */
cloudIndex.url = (options?: RouteQueryOptions) => {
    return cloudIndex.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::cloudIndex
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:64
 * @route '/admin/gameserver-cloud-accounts'
 */
cloudIndex.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cloudIndex.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::cloudIndex
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:64
 * @route '/admin/gameserver-cloud-accounts'
 */
cloudIndex.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: cloudIndex.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\GameServerAccountController::cloudIndex
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:64
 * @route '/admin/gameserver-cloud-accounts'
 */
    const cloudIndexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: cloudIndex.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\GameServerAccountController::cloudIndex
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:64
 * @route '/admin/gameserver-cloud-accounts'
 */
        cloudIndexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: cloudIndex.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\GameServerAccountController::cloudIndex
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:64
 * @route '/admin/gameserver-cloud-accounts'
 */
        cloudIndexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: cloudIndex.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    cloudIndex.form = cloudIndexForm
/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::cloudShow
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:122
 * @route '/admin/gameserver-cloud-accounts/{subscription}'
 */
export const cloudShow = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cloudShow.url(args, options),
    method: 'get',
})

cloudShow.definition = {
    methods: ["get","head"],
    url: '/admin/gameserver-cloud-accounts/{subscription}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::cloudShow
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:122
 * @route '/admin/gameserver-cloud-accounts/{subscription}'
 */
cloudShow.url = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return cloudShow.definition.url
            .replace('{subscription}', parsedArgs.subscription.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::cloudShow
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:122
 * @route '/admin/gameserver-cloud-accounts/{subscription}'
 */
cloudShow.get = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cloudShow.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::cloudShow
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:122
 * @route '/admin/gameserver-cloud-accounts/{subscription}'
 */
cloudShow.head = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: cloudShow.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\GameServerAccountController::cloudShow
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:122
 * @route '/admin/gameserver-cloud-accounts/{subscription}'
 */
    const cloudShowForm = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: cloudShow.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\GameServerAccountController::cloudShow
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:122
 * @route '/admin/gameserver-cloud-accounts/{subscription}'
 */
        cloudShowForm.get = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: cloudShow.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\GameServerAccountController::cloudShow
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:122
 * @route '/admin/gameserver-cloud-accounts/{subscription}'
 */
        cloudShowForm.head = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: cloudShow.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    cloudShow.form = cloudShowForm
/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::cloudUpdate
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:206
 * @route '/admin/gameserver-cloud-accounts/{subscription}'
 */
export const cloudUpdate = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: cloudUpdate.url(args, options),
    method: 'put',
})

cloudUpdate.definition = {
    methods: ["put"],
    url: '/admin/gameserver-cloud-accounts/{subscription}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::cloudUpdate
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:206
 * @route '/admin/gameserver-cloud-accounts/{subscription}'
 */
cloudUpdate.url = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return cloudUpdate.definition.url
            .replace('{subscription}', parsedArgs.subscription.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::cloudUpdate
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:206
 * @route '/admin/gameserver-cloud-accounts/{subscription}'
 */
cloudUpdate.put = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: cloudUpdate.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\GameServerAccountController::cloudUpdate
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:206
 * @route '/admin/gameserver-cloud-accounts/{subscription}'
 */
    const cloudUpdateForm = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cloudUpdate.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\GameServerAccountController::cloudUpdate
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:206
 * @route '/admin/gameserver-cloud-accounts/{subscription}'
 */
        cloudUpdateForm.put = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cloudUpdate.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    cloudUpdate.form = cloudUpdateForm
/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::cloudUpdatePeriodAndStatus
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:247
 * @route '/admin/gameserver-cloud-accounts/{subscription}/period-and-status'
 */
export const cloudUpdatePeriodAndStatus = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: cloudUpdatePeriodAndStatus.url(args, options),
    method: 'put',
})

cloudUpdatePeriodAndStatus.definition = {
    methods: ["put"],
    url: '/admin/gameserver-cloud-accounts/{subscription}/period-and-status',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::cloudUpdatePeriodAndStatus
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:247
 * @route '/admin/gameserver-cloud-accounts/{subscription}/period-and-status'
 */
cloudUpdatePeriodAndStatus.url = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return cloudUpdatePeriodAndStatus.definition.url
            .replace('{subscription}', parsedArgs.subscription.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::cloudUpdatePeriodAndStatus
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:247
 * @route '/admin/gameserver-cloud-accounts/{subscription}/period-and-status'
 */
cloudUpdatePeriodAndStatus.put = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: cloudUpdatePeriodAndStatus.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\GameServerAccountController::cloudUpdatePeriodAndStatus
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:247
 * @route '/admin/gameserver-cloud-accounts/{subscription}/period-and-status'
 */
    const cloudUpdatePeriodAndStatusForm = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cloudUpdatePeriodAndStatus.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\GameServerAccountController::cloudUpdatePeriodAndStatus
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:247
 * @route '/admin/gameserver-cloud-accounts/{subscription}/period-and-status'
 */
        cloudUpdatePeriodAndStatusForm.put = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cloudUpdatePeriodAndStatus.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    cloudUpdatePeriodAndStatus.form = cloudUpdatePeriodAndStatusForm
/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::cloudUpdateServerResources
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:275
 * @route '/admin/gameserver-cloud-accounts/{subscription}/servers/{game_server_account}/resources'
 */
export const cloudUpdateServerResources = (args: { subscription: string | { uuid: string }, game_server_account: string | number } | [subscription: string | { uuid: string }, game_server_account: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: cloudUpdateServerResources.url(args, options),
    method: 'put',
})

cloudUpdateServerResources.definition = {
    methods: ["put"],
    url: '/admin/gameserver-cloud-accounts/{subscription}/servers/{game_server_account}/resources',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::cloudUpdateServerResources
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:275
 * @route '/admin/gameserver-cloud-accounts/{subscription}/servers/{game_server_account}/resources'
 */
cloudUpdateServerResources.url = (args: { subscription: string | { uuid: string }, game_server_account: string | number } | [subscription: string | { uuid: string }, game_server_account: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    subscription: args[0],
                    game_server_account: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        subscription: typeof args.subscription === 'object'
                ? args.subscription.uuid
                : args.subscription,
                                game_server_account: args.game_server_account,
                }

    return cloudUpdateServerResources.definition.url
            .replace('{subscription}', parsedArgs.subscription.toString())
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::cloudUpdateServerResources
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:275
 * @route '/admin/gameserver-cloud-accounts/{subscription}/servers/{game_server_account}/resources'
 */
cloudUpdateServerResources.put = (args: { subscription: string | { uuid: string }, game_server_account: string | number } | [subscription: string | { uuid: string }, game_server_account: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: cloudUpdateServerResources.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\GameServerAccountController::cloudUpdateServerResources
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:275
 * @route '/admin/gameserver-cloud-accounts/{subscription}/servers/{game_server_account}/resources'
 */
    const cloudUpdateServerResourcesForm = (args: { subscription: string | { uuid: string }, game_server_account: string | number } | [subscription: string | { uuid: string }, game_server_account: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cloudUpdateServerResources.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\GameServerAccountController::cloudUpdateServerResources
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:275
 * @route '/admin/gameserver-cloud-accounts/{subscription}/servers/{game_server_account}/resources'
 */
        cloudUpdateServerResourcesForm.put = (args: { subscription: string | { uuid: string }, game_server_account: string | number } | [subscription: string | { uuid: string }, game_server_account: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cloudUpdateServerResources.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    cloudUpdateServerResources.form = cloudUpdateServerResourcesForm
/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::cancelSubscription
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:375
 * @route '/admin/gaming-accounts/{game_server_account}/subscription/cancel'
 */
export const cancelSubscription = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancelSubscription.url(args, options),
    method: 'post',
})

cancelSubscription.definition = {
    methods: ["post"],
    url: '/admin/gaming-accounts/{game_server_account}/subscription/cancel',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::cancelSubscription
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:375
 * @route '/admin/gaming-accounts/{game_server_account}/subscription/cancel'
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
* @see \App\Http\Controllers\Admin\GameServerAccountController::cancelSubscription
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:375
 * @route '/admin/gaming-accounts/{game_server_account}/subscription/cancel'
 */
cancelSubscription.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancelSubscription.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\GameServerAccountController::cancelSubscription
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:375
 * @route '/admin/gaming-accounts/{game_server_account}/subscription/cancel'
 */
    const cancelSubscriptionForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cancelSubscription.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\GameServerAccountController::cancelSubscription
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:375
 * @route '/admin/gaming-accounts/{game_server_account}/subscription/cancel'
 */
        cancelSubscriptionForm.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cancelSubscription.url(args, options),
            method: 'post',
        })
    
    cancelSubscription.form = cancelSubscriptionForm
/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::edit
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:416
 * @route '/admin/gaming-accounts/{game_server_account}/edit'
 */
export const edit = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/gaming-accounts/{game_server_account}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::edit
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:416
 * @route '/admin/gaming-accounts/{game_server_account}/edit'
 */
edit.url = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::edit
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:416
 * @route '/admin/gaming-accounts/{game_server_account}/edit'
 */
edit.get = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::edit
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:416
 * @route '/admin/gaming-accounts/{game_server_account}/edit'
 */
edit.head = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\GameServerAccountController::edit
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:416
 * @route '/admin/gaming-accounts/{game_server_account}/edit'
 */
    const editForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\GameServerAccountController::edit
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:416
 * @route '/admin/gaming-accounts/{game_server_account}/edit'
 */
        editForm.get = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\GameServerAccountController::edit
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:416
 * @route '/admin/gaming-accounts/{game_server_account}/edit'
 */
        editForm.head = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::update
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:475
 * @route '/admin/gaming-accounts/{game_server_account}'
 */
export const update = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/gaming-accounts/{game_server_account}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::update
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:475
 * @route '/admin/gaming-accounts/{game_server_account}'
 */
update.url = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::update
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:475
 * @route '/admin/gaming-accounts/{game_server_account}'
 */
update.put = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\GameServerAccountController::update
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:475
 * @route '/admin/gaming-accounts/{game_server_account}'
 */
    const updateForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\GameServerAccountController::update
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:475
 * @route '/admin/gaming-accounts/{game_server_account}'
 */
        updateForm.put = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::retryProvisioning
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:589
 * @route '/admin/gaming-accounts/{game_server_account}/retry-provisioning'
 */
export const retryProvisioning = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retryProvisioning.url(args, options),
    method: 'post',
})

retryProvisioning.definition = {
    methods: ["post"],
    url: '/admin/gaming-accounts/{game_server_account}/retry-provisioning',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::retryProvisioning
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:589
 * @route '/admin/gaming-accounts/{game_server_account}/retry-provisioning'
 */
retryProvisioning.url = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return retryProvisioning.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::retryProvisioning
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:589
 * @route '/admin/gaming-accounts/{game_server_account}/retry-provisioning'
 */
retryProvisioning.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retryProvisioning.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\GameServerAccountController::retryProvisioning
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:589
 * @route '/admin/gaming-accounts/{game_server_account}/retry-provisioning'
 */
    const retryProvisioningForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: retryProvisioning.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\GameServerAccountController::retryProvisioning
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:589
 * @route '/admin/gaming-accounts/{game_server_account}/retry-provisioning'
 */
        retryProvisioningForm.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: retryProvisioning.url(args, options),
            method: 'post',
        })
    
    retryProvisioning.form = retryProvisioningForm
/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::show
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:337
 * @route '/admin/gaming-accounts/{game_server_account}'
 */
export const show = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/gaming-accounts/{game_server_account}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::show
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:337
 * @route '/admin/gaming-accounts/{game_server_account}'
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
* @see \App\Http\Controllers\Admin\GameServerAccountController::show
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:337
 * @route '/admin/gaming-accounts/{game_server_account}'
 */
show.get = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::show
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:337
 * @route '/admin/gaming-accounts/{game_server_account}'
 */
show.head = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\GameServerAccountController::show
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:337
 * @route '/admin/gaming-accounts/{game_server_account}'
 */
    const showForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\GameServerAccountController::show
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:337
 * @route '/admin/gaming-accounts/{game_server_account}'
 */
        showForm.get = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\GameServerAccountController::show
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:337
 * @route '/admin/gaming-accounts/{game_server_account}'
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
const GameServerAccountController = { index, cloudIndex, cloudShow, cloudUpdate, cloudUpdatePeriodAndStatus, cloudUpdateServerResources, cancelSubscription, edit, update, retryProvisioning, show }

export default GameServerAccountController