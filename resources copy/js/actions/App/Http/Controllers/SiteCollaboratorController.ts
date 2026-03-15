import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\SiteCollaboratorController::index
 * @see app/Http/Controllers/SiteCollaboratorController.php:17
 * @route '/sites/{site}/collaborators'
 */
export const index = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/sites/{site}/collaborators',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SiteCollaboratorController::index
 * @see app/Http/Controllers/SiteCollaboratorController.php:17
 * @route '/sites/{site}/collaborators'
 */
index.url = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { site: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { site: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    site: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        site: typeof args.site === 'object'
                ? args.site.uuid
                : args.site,
                }

    return index.definition.url
            .replace('{site}', parsedArgs.site.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SiteCollaboratorController::index
 * @see app/Http/Controllers/SiteCollaboratorController.php:17
 * @route '/sites/{site}/collaborators'
 */
index.get = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SiteCollaboratorController::index
 * @see app/Http/Controllers/SiteCollaboratorController.php:17
 * @route '/sites/{site}/collaborators'
 */
index.head = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SiteCollaboratorController::index
 * @see app/Http/Controllers/SiteCollaboratorController.php:17
 * @route '/sites/{site}/collaborators'
 */
    const indexForm = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SiteCollaboratorController::index
 * @see app/Http/Controllers/SiteCollaboratorController.php:17
 * @route '/sites/{site}/collaborators'
 */
        indexForm.get = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SiteCollaboratorController::index
 * @see app/Http/Controllers/SiteCollaboratorController.php:17
 * @route '/sites/{site}/collaborators'
 */
        indexForm.head = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\SiteCollaboratorController::store
 * @see app/Http/Controllers/SiteCollaboratorController.php:28
 * @route '/sites/{site}/collaborators'
 */
export const store = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/sites/{site}/collaborators',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SiteCollaboratorController::store
 * @see app/Http/Controllers/SiteCollaboratorController.php:28
 * @route '/sites/{site}/collaborators'
 */
store.url = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { site: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { site: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    site: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        site: typeof args.site === 'object'
                ? args.site.uuid
                : args.site,
                }

    return store.definition.url
            .replace('{site}', parsedArgs.site.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SiteCollaboratorController::store
 * @see app/Http/Controllers/SiteCollaboratorController.php:28
 * @route '/sites/{site}/collaborators'
 */
store.post = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SiteCollaboratorController::store
 * @see app/Http/Controllers/SiteCollaboratorController.php:28
 * @route '/sites/{site}/collaborators'
 */
    const storeForm = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SiteCollaboratorController::store
 * @see app/Http/Controllers/SiteCollaboratorController.php:28
 * @route '/sites/{site}/collaborators'
 */
        storeForm.post = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\SiteCollaboratorController::destroy
 * @see app/Http/Controllers/SiteCollaboratorController.php:69
 * @route '/sites/{site}/collaborators/{user}'
 */
export const destroy = (args: { site: string | { uuid: string }, user: number | { id: number } } | [site: string | { uuid: string }, user: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/sites/{site}/collaborators/{user}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\SiteCollaboratorController::destroy
 * @see app/Http/Controllers/SiteCollaboratorController.php:69
 * @route '/sites/{site}/collaborators/{user}'
 */
destroy.url = (args: { site: string | { uuid: string }, user: number | { id: number } } | [site: string | { uuid: string }, user: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    site: args[0],
                    user: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        site: typeof args.site === 'object'
                ? args.site.uuid
                : args.site,
                                user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return destroy.definition.url
            .replace('{site}', parsedArgs.site.toString())
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SiteCollaboratorController::destroy
 * @see app/Http/Controllers/SiteCollaboratorController.php:69
 * @route '/sites/{site}/collaborators/{user}'
 */
destroy.delete = (args: { site: string | { uuid: string }, user: number | { id: number } } | [site: string | { uuid: string }, user: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\SiteCollaboratorController::destroy
 * @see app/Http/Controllers/SiteCollaboratorController.php:69
 * @route '/sites/{site}/collaborators/{user}'
 */
    const destroyForm = (args: { site: string | { uuid: string }, user: number | { id: number } } | [site: string | { uuid: string }, user: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SiteCollaboratorController::destroy
 * @see app/Http/Controllers/SiteCollaboratorController.php:69
 * @route '/sites/{site}/collaborators/{user}'
 */
        destroyForm.delete = (args: { site: string | { uuid: string }, user: number | { id: number } } | [site: string | { uuid: string }, user: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
/**
* @see \App\Http\Controllers\SiteCollaboratorController::destroyInvitation
 * @see app/Http/Controllers/SiteCollaboratorController.php:78
 * @route '/sites/{site}/invitations/{invitation}'
 */
export const destroyInvitation = (args: { site: string | { uuid: string }, invitation: number | { id: number } } | [site: string | { uuid: string }, invitation: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyInvitation.url(args, options),
    method: 'delete',
})

destroyInvitation.definition = {
    methods: ["delete"],
    url: '/sites/{site}/invitations/{invitation}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\SiteCollaboratorController::destroyInvitation
 * @see app/Http/Controllers/SiteCollaboratorController.php:78
 * @route '/sites/{site}/invitations/{invitation}'
 */
destroyInvitation.url = (args: { site: string | { uuid: string }, invitation: number | { id: number } } | [site: string | { uuid: string }, invitation: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    site: args[0],
                    invitation: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        site: typeof args.site === 'object'
                ? args.site.uuid
                : args.site,
                                invitation: typeof args.invitation === 'object'
                ? args.invitation.id
                : args.invitation,
                }

    return destroyInvitation.definition.url
            .replace('{site}', parsedArgs.site.toString())
            .replace('{invitation}', parsedArgs.invitation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SiteCollaboratorController::destroyInvitation
 * @see app/Http/Controllers/SiteCollaboratorController.php:78
 * @route '/sites/{site}/invitations/{invitation}'
 */
destroyInvitation.delete = (args: { site: string | { uuid: string }, invitation: number | { id: number } } | [site: string | { uuid: string }, invitation: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyInvitation.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\SiteCollaboratorController::destroyInvitation
 * @see app/Http/Controllers/SiteCollaboratorController.php:78
 * @route '/sites/{site}/invitations/{invitation}'
 */
    const destroyInvitationForm = (args: { site: string | { uuid: string }, invitation: number | { id: number } } | [site: string | { uuid: string }, invitation: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroyInvitation.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SiteCollaboratorController::destroyInvitation
 * @see app/Http/Controllers/SiteCollaboratorController.php:78
 * @route '/sites/{site}/invitations/{invitation}'
 */
        destroyInvitationForm.delete = (args: { site: string | { uuid: string }, invitation: number | { id: number } } | [site: string | { uuid: string }, invitation: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroyInvitation.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroyInvitation.form = destroyInvitationForm
const SiteCollaboratorController = { index, store, destroy, destroyInvitation }

export default SiteCollaboratorController