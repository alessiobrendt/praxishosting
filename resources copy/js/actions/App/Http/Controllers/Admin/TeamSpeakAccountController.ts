import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\TeamSpeakAccountController::index
 * @see app/Http/Controllers/Admin/TeamSpeakAccountController.php:27
 * @route '/admin/teamspeak-accounts'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/teamspeak-accounts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\TeamSpeakAccountController::index
 * @see app/Http/Controllers/Admin/TeamSpeakAccountController.php:27
 * @route '/admin/teamspeak-accounts'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TeamSpeakAccountController::index
 * @see app/Http/Controllers/Admin/TeamSpeakAccountController.php:27
 * @route '/admin/teamspeak-accounts'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\TeamSpeakAccountController::index
 * @see app/Http/Controllers/Admin/TeamSpeakAccountController.php:27
 * @route '/admin/teamspeak-accounts'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\TeamSpeakAccountController::index
 * @see app/Http/Controllers/Admin/TeamSpeakAccountController.php:27
 * @route '/admin/teamspeak-accounts'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\TeamSpeakAccountController::index
 * @see app/Http/Controllers/Admin/TeamSpeakAccountController.php:27
 * @route '/admin/teamspeak-accounts'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\TeamSpeakAccountController::index
 * @see app/Http/Controllers/Admin/TeamSpeakAccountController.php:27
 * @route '/admin/teamspeak-accounts'
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
* @see \App\Http\Controllers\Admin\TeamSpeakAccountController::cancelSubscription
 * @see app/Http/Controllers/Admin/TeamSpeakAccountController.php:78
 * @route '/admin/teamspeak-accounts/{team_speak_server_account}/subscription/cancel'
 */
export const cancelSubscription = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancelSubscription.url(args, options),
    method: 'post',
})

cancelSubscription.definition = {
    methods: ["post"],
    url: '/admin/teamspeak-accounts/{team_speak_server_account}/subscription/cancel',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\TeamSpeakAccountController::cancelSubscription
 * @see app/Http/Controllers/Admin/TeamSpeakAccountController.php:78
 * @route '/admin/teamspeak-accounts/{team_speak_server_account}/subscription/cancel'
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
* @see \App\Http\Controllers\Admin\TeamSpeakAccountController::cancelSubscription
 * @see app/Http/Controllers/Admin/TeamSpeakAccountController.php:78
 * @route '/admin/teamspeak-accounts/{team_speak_server_account}/subscription/cancel'
 */
cancelSubscription.post = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancelSubscription.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\TeamSpeakAccountController::cancelSubscription
 * @see app/Http/Controllers/Admin/TeamSpeakAccountController.php:78
 * @route '/admin/teamspeak-accounts/{team_speak_server_account}/subscription/cancel'
 */
    const cancelSubscriptionForm = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cancelSubscription.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\TeamSpeakAccountController::cancelSubscription
 * @see app/Http/Controllers/Admin/TeamSpeakAccountController.php:78
 * @route '/admin/teamspeak-accounts/{team_speak_server_account}/subscription/cancel'
 */
        cancelSubscriptionForm.post = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cancelSubscription.url(args, options),
            method: 'post',
        })
    
    cancelSubscription.form = cancelSubscriptionForm
/**
* @see \App\Http\Controllers\Admin\TeamSpeakAccountController::edit
 * @see app/Http/Controllers/Admin/TeamSpeakAccountController.php:115
 * @route '/admin/teamspeak-accounts/{team_speak_server_account}/edit'
 */
export const edit = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/teamspeak-accounts/{team_speak_server_account}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\TeamSpeakAccountController::edit
 * @see app/Http/Controllers/Admin/TeamSpeakAccountController.php:115
 * @route '/admin/teamspeak-accounts/{team_speak_server_account}/edit'
 */
edit.url = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{team_speak_server_account}', parsedArgs.team_speak_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TeamSpeakAccountController::edit
 * @see app/Http/Controllers/Admin/TeamSpeakAccountController.php:115
 * @route '/admin/teamspeak-accounts/{team_speak_server_account}/edit'
 */
edit.get = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\TeamSpeakAccountController::edit
 * @see app/Http/Controllers/Admin/TeamSpeakAccountController.php:115
 * @route '/admin/teamspeak-accounts/{team_speak_server_account}/edit'
 */
edit.head = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\TeamSpeakAccountController::edit
 * @see app/Http/Controllers/Admin/TeamSpeakAccountController.php:115
 * @route '/admin/teamspeak-accounts/{team_speak_server_account}/edit'
 */
    const editForm = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\TeamSpeakAccountController::edit
 * @see app/Http/Controllers/Admin/TeamSpeakAccountController.php:115
 * @route '/admin/teamspeak-accounts/{team_speak_server_account}/edit'
 */
        editForm.get = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\TeamSpeakAccountController::edit
 * @see app/Http/Controllers/Admin/TeamSpeakAccountController.php:115
 * @route '/admin/teamspeak-accounts/{team_speak_server_account}/edit'
 */
        editForm.head = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\TeamSpeakAccountController::update
 * @see app/Http/Controllers/Admin/TeamSpeakAccountController.php:131
 * @route '/admin/teamspeak-accounts/{team_speak_server_account}'
 */
export const update = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/teamspeak-accounts/{team_speak_server_account}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\TeamSpeakAccountController::update
 * @see app/Http/Controllers/Admin/TeamSpeakAccountController.php:131
 * @route '/admin/teamspeak-accounts/{team_speak_server_account}'
 */
update.url = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{team_speak_server_account}', parsedArgs.team_speak_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TeamSpeakAccountController::update
 * @see app/Http/Controllers/Admin/TeamSpeakAccountController.php:131
 * @route '/admin/teamspeak-accounts/{team_speak_server_account}'
 */
update.put = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\TeamSpeakAccountController::update
 * @see app/Http/Controllers/Admin/TeamSpeakAccountController.php:131
 * @route '/admin/teamspeak-accounts/{team_speak_server_account}'
 */
    const updateForm = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\TeamSpeakAccountController::update
 * @see app/Http/Controllers/Admin/TeamSpeakAccountController.php:131
 * @route '/admin/teamspeak-accounts/{team_speak_server_account}'
 */
        updateForm.put = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\TeamSpeakAccountController::show
 * @see app/Http/Controllers/Admin/TeamSpeakAccountController.php:56
 * @route '/admin/teamspeak-accounts/{team_speak_server_account}'
 */
export const show = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/teamspeak-accounts/{team_speak_server_account}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\TeamSpeakAccountController::show
 * @see app/Http/Controllers/Admin/TeamSpeakAccountController.php:56
 * @route '/admin/teamspeak-accounts/{team_speak_server_account}'
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
* @see \App\Http\Controllers\Admin\TeamSpeakAccountController::show
 * @see app/Http/Controllers/Admin/TeamSpeakAccountController.php:56
 * @route '/admin/teamspeak-accounts/{team_speak_server_account}'
 */
show.get = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\TeamSpeakAccountController::show
 * @see app/Http/Controllers/Admin/TeamSpeakAccountController.php:56
 * @route '/admin/teamspeak-accounts/{team_speak_server_account}'
 */
show.head = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\TeamSpeakAccountController::show
 * @see app/Http/Controllers/Admin/TeamSpeakAccountController.php:56
 * @route '/admin/teamspeak-accounts/{team_speak_server_account}'
 */
    const showForm = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\TeamSpeakAccountController::show
 * @see app/Http/Controllers/Admin/TeamSpeakAccountController.php:56
 * @route '/admin/teamspeak-accounts/{team_speak_server_account}'
 */
        showForm.get = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\TeamSpeakAccountController::show
 * @see app/Http/Controllers/Admin/TeamSpeakAccountController.php:56
 * @route '/admin/teamspeak-accounts/{team_speak_server_account}'
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
const TeamSpeakAccountController = { index, cancelSubscription, edit, update, show }

export default TeamSpeakAccountController