import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults, validateParameters } from './../../wayfinder'
import preview16e44b from './preview'
import subscription from './subscription'
import designer from './designer'
import images from './images'
import collaborators from './collaborators'
import invitations from './invitations'
import versions from './versions'
import domains from './domains'
/**
* @see \App\Http\Controllers\SiteController::design
 * @see app/Http/Controllers/SiteController.php:130
 * @route '/sites/{site}/design'
 */
export const design = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: design.url(args, options),
    method: 'get',
})

design.definition = {
    methods: ["get","head"],
    url: '/sites/{site}/design',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SiteController::design
 * @see app/Http/Controllers/SiteController.php:130
 * @route '/sites/{site}/design'
 */
design.url = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return design.definition.url
            .replace('{site}', parsedArgs.site.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SiteController::design
 * @see app/Http/Controllers/SiteController.php:130
 * @route '/sites/{site}/design'
 */
design.get = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: design.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SiteController::design
 * @see app/Http/Controllers/SiteController.php:130
 * @route '/sites/{site}/design'
 */
design.head = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: design.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SiteController::design
 * @see app/Http/Controllers/SiteController.php:130
 * @route '/sites/{site}/design'
 */
    const designForm = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: design.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SiteController::design
 * @see app/Http/Controllers/SiteController.php:130
 * @route '/sites/{site}/design'
 */
        designForm.get = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: design.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SiteController::design
 * @see app/Http/Controllers/SiteController.php:130
 * @route '/sites/{site}/design'
 */
        designForm.head = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: design.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    design.form = designForm
/**
* @see \App\Http\Controllers\SiteRenderController::preview
 * @see app/Http/Controllers/SiteRenderController.php:59
 * @route '/sites/{site}/preview/{pageSlug?}'
 */
export const preview = (args: { site: string | { uuid: string }, pageSlug?: string | number } | [site: string | { uuid: string }, pageSlug: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(args, options),
    method: 'get',
})

preview.definition = {
    methods: ["get","head"],
    url: '/sites/{site}/preview/{pageSlug?}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SiteRenderController::preview
 * @see app/Http/Controllers/SiteRenderController.php:59
 * @route '/sites/{site}/preview/{pageSlug?}'
 */
preview.url = (args: { site: string | { uuid: string }, pageSlug?: string | number } | [site: string | { uuid: string }, pageSlug: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    site: args[0],
                    pageSlug: args[1],
                }
    }

    args = applyUrlDefaults(args)

    validateParameters(args, [
            "pageSlug",
        ])

    const parsedArgs = {
                        site: typeof args.site === 'object'
                ? args.site.uuid
                : args.site,
                                pageSlug: args.pageSlug,
                }

    return preview.definition.url
            .replace('{site}', parsedArgs.site.toString())
            .replace('{pageSlug?}', parsedArgs.pageSlug?.toString() ?? '')
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SiteRenderController::preview
 * @see app/Http/Controllers/SiteRenderController.php:59
 * @route '/sites/{site}/preview/{pageSlug?}'
 */
preview.get = (args: { site: string | { uuid: string }, pageSlug?: string | number } | [site: string | { uuid: string }, pageSlug: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SiteRenderController::preview
 * @see app/Http/Controllers/SiteRenderController.php:59
 * @route '/sites/{site}/preview/{pageSlug?}'
 */
preview.head = (args: { site: string | { uuid: string }, pageSlug?: string | number } | [site: string | { uuid: string }, pageSlug: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: preview.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SiteRenderController::preview
 * @see app/Http/Controllers/SiteRenderController.php:59
 * @route '/sites/{site}/preview/{pageSlug?}'
 */
    const previewForm = (args: { site: string | { uuid: string }, pageSlug?: string | number } | [site: string | { uuid: string }, pageSlug: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: preview.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SiteRenderController::preview
 * @see app/Http/Controllers/SiteRenderController.php:59
 * @route '/sites/{site}/preview/{pageSlug?}'
 */
        previewForm.get = (args: { site: string | { uuid: string }, pageSlug?: string | number } | [site: string | { uuid: string }, pageSlug: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: preview.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SiteRenderController::preview
 * @see app/Http/Controllers/SiteRenderController.php:59
 * @route '/sites/{site}/preview/{pageSlug?}'
 */
        previewForm.head = (args: { site: string | { uuid: string }, pageSlug?: string | number } | [site: string | { uuid: string }, pageSlug: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: preview.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    preview.form = previewForm
/**
* @see \App\Http\Controllers\SiteController::index
 * @see app/Http/Controllers/SiteController.php:17
 * @route '/sites'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/sites',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SiteController::index
 * @see app/Http/Controllers/SiteController.php:17
 * @route '/sites'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SiteController::index
 * @see app/Http/Controllers/SiteController.php:17
 * @route '/sites'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SiteController::index
 * @see app/Http/Controllers/SiteController.php:17
 * @route '/sites'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SiteController::index
 * @see app/Http/Controllers/SiteController.php:17
 * @route '/sites'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SiteController::index
 * @see app/Http/Controllers/SiteController.php:17
 * @route '/sites'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SiteController::index
 * @see app/Http/Controllers/SiteController.php:17
 * @route '/sites'
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
* @see \App\Http\Controllers\SiteController::create
 * @see app/Http/Controllers/SiteController.php:39
 * @route '/sites/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/sites/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SiteController::create
 * @see app/Http/Controllers/SiteController.php:39
 * @route '/sites/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SiteController::create
 * @see app/Http/Controllers/SiteController.php:39
 * @route '/sites/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SiteController::create
 * @see app/Http/Controllers/SiteController.php:39
 * @route '/sites/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SiteController::create
 * @see app/Http/Controllers/SiteController.php:39
 * @route '/sites/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SiteController::create
 * @see app/Http/Controllers/SiteController.php:39
 * @route '/sites/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SiteController::create
 * @see app/Http/Controllers/SiteController.php:39
 * @route '/sites/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\SiteController::store
 * @see app/Http/Controllers/SiteController.php:53
 * @route '/sites'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/sites',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SiteController::store
 * @see app/Http/Controllers/SiteController.php:53
 * @route '/sites'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SiteController::store
 * @see app/Http/Controllers/SiteController.php:53
 * @route '/sites'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SiteController::store
 * @see app/Http/Controllers/SiteController.php:53
 * @route '/sites'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SiteController::store
 * @see app/Http/Controllers/SiteController.php:53
 * @route '/sites'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\SiteController::show
 * @see app/Http/Controllers/SiteController.php:74
 * @route '/sites/{site}'
 */
export const show = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/sites/{site}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SiteController::show
 * @see app/Http/Controllers/SiteController.php:74
 * @route '/sites/{site}'
 */
show.url = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{site}', parsedArgs.site.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SiteController::show
 * @see app/Http/Controllers/SiteController.php:74
 * @route '/sites/{site}'
 */
show.get = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SiteController::show
 * @see app/Http/Controllers/SiteController.php:74
 * @route '/sites/{site}'
 */
show.head = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SiteController::show
 * @see app/Http/Controllers/SiteController.php:74
 * @route '/sites/{site}'
 */
    const showForm = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SiteController::show
 * @see app/Http/Controllers/SiteController.php:74
 * @route '/sites/{site}'
 */
        showForm.get = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SiteController::show
 * @see app/Http/Controllers/SiteController.php:74
 * @route '/sites/{site}'
 */
        showForm.head = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\SiteController::edit
 * @see app/Http/Controllers/SiteController.php:116
 * @route '/sites/{site}/edit'
 */
export const edit = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/sites/{site}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SiteController::edit
 * @see app/Http/Controllers/SiteController.php:116
 * @route '/sites/{site}/edit'
 */
edit.url = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{site}', parsedArgs.site.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SiteController::edit
 * @see app/Http/Controllers/SiteController.php:116
 * @route '/sites/{site}/edit'
 */
edit.get = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SiteController::edit
 * @see app/Http/Controllers/SiteController.php:116
 * @route '/sites/{site}/edit'
 */
edit.head = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SiteController::edit
 * @see app/Http/Controllers/SiteController.php:116
 * @route '/sites/{site}/edit'
 */
    const editForm = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SiteController::edit
 * @see app/Http/Controllers/SiteController.php:116
 * @route '/sites/{site}/edit'
 */
        editForm.get = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SiteController::edit
 * @see app/Http/Controllers/SiteController.php:116
 * @route '/sites/{site}/edit'
 */
        editForm.head = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\SiteController::update
 * @see app/Http/Controllers/SiteController.php:153
 * @route '/sites/{site}'
 */
export const update = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/sites/{site}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\SiteController::update
 * @see app/Http/Controllers/SiteController.php:153
 * @route '/sites/{site}'
 */
update.url = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{site}', parsedArgs.site.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SiteController::update
 * @see app/Http/Controllers/SiteController.php:153
 * @route '/sites/{site}'
 */
update.put = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\SiteController::update
 * @see app/Http/Controllers/SiteController.php:153
 * @route '/sites/{site}'
 */
update.patch = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\SiteController::update
 * @see app/Http/Controllers/SiteController.php:153
 * @route '/sites/{site}'
 */
    const updateForm = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SiteController::update
 * @see app/Http/Controllers/SiteController.php:153
 * @route '/sites/{site}'
 */
        updateForm.put = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\SiteController::update
 * @see app/Http/Controllers/SiteController.php:153
 * @route '/sites/{site}'
 */
        updateForm.patch = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\SiteController::destroy
 * @see app/Http/Controllers/SiteController.php:189
 * @route '/sites/{site}'
 */
export const destroy = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/sites/{site}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\SiteController::destroy
 * @see app/Http/Controllers/SiteController.php:189
 * @route '/sites/{site}'
 */
destroy.url = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{site}', parsedArgs.site.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SiteController::destroy
 * @see app/Http/Controllers/SiteController.php:189
 * @route '/sites/{site}'
 */
destroy.delete = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\SiteController::destroy
 * @see app/Http/Controllers/SiteController.php:189
 * @route '/sites/{site}'
 */
    const destroyForm = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SiteController::destroy
 * @see app/Http/Controllers/SiteController.php:189
 * @route '/sites/{site}'
 */
        destroyForm.delete = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const sites = {
    design: Object.assign(design, design),
preview: Object.assign(preview, preview16e44b),
index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
show: Object.assign(show, show),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
subscription: Object.assign(subscription, subscription),
designer: Object.assign(designer, designer),
images: Object.assign(images, images),
collaborators: Object.assign(collaborators, collaborators),
invitations: Object.assign(invitations, invitations),
versions: Object.assign(versions, versions),
domains: Object.assign(domains, domains),
}

export default sites