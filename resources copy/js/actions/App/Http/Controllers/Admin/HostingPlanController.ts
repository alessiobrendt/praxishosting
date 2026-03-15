import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\HostingPlanController::pterodactylOptions
 * @see app/Http/Controllers/Admin/HostingPlanController.php:95
 * @route '/admin/hosting-plans/pterodactyl-options'
 */
export const pterodactylOptions = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pterodactylOptions.url(options),
    method: 'get',
})

pterodactylOptions.definition = {
    methods: ["get","head"],
    url: '/admin/hosting-plans/pterodactyl-options',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\HostingPlanController::pterodactylOptions
 * @see app/Http/Controllers/Admin/HostingPlanController.php:95
 * @route '/admin/hosting-plans/pterodactyl-options'
 */
pterodactylOptions.url = (options?: RouteQueryOptions) => {
    return pterodactylOptions.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\HostingPlanController::pterodactylOptions
 * @see app/Http/Controllers/Admin/HostingPlanController.php:95
 * @route '/admin/hosting-plans/pterodactyl-options'
 */
pterodactylOptions.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pterodactylOptions.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\HostingPlanController::pterodactylOptions
 * @see app/Http/Controllers/Admin/HostingPlanController.php:95
 * @route '/admin/hosting-plans/pterodactyl-options'
 */
pterodactylOptions.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pterodactylOptions.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\HostingPlanController::pterodactylOptions
 * @see app/Http/Controllers/Admin/HostingPlanController.php:95
 * @route '/admin/hosting-plans/pterodactyl-options'
 */
    const pterodactylOptionsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: pterodactylOptions.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\HostingPlanController::pterodactylOptions
 * @see app/Http/Controllers/Admin/HostingPlanController.php:95
 * @route '/admin/hosting-plans/pterodactyl-options'
 */
        pterodactylOptionsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pterodactylOptions.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\HostingPlanController::pterodactylOptions
 * @see app/Http/Controllers/Admin/HostingPlanController.php:95
 * @route '/admin/hosting-plans/pterodactyl-options'
 */
        pterodactylOptionsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pterodactylOptions.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    pterodactylOptions.form = pterodactylOptionsForm
/**
* @see \App\Http\Controllers\Admin\HostingPlanController::index
 * @see app/Http/Controllers/Admin/HostingPlanController.php:156
 * @route '/admin/hosting-plans'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/hosting-plans',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\HostingPlanController::index
 * @see app/Http/Controllers/Admin/HostingPlanController.php:156
 * @route '/admin/hosting-plans'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\HostingPlanController::index
 * @see app/Http/Controllers/Admin/HostingPlanController.php:156
 * @route '/admin/hosting-plans'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\HostingPlanController::index
 * @see app/Http/Controllers/Admin/HostingPlanController.php:156
 * @route '/admin/hosting-plans'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\HostingPlanController::index
 * @see app/Http/Controllers/Admin/HostingPlanController.php:156
 * @route '/admin/hosting-plans'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\HostingPlanController::index
 * @see app/Http/Controllers/Admin/HostingPlanController.php:156
 * @route '/admin/hosting-plans'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\HostingPlanController::index
 * @see app/Http/Controllers/Admin/HostingPlanController.php:156
 * @route '/admin/hosting-plans'
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
* @see \App\Http\Controllers\Admin\HostingPlanController::create
 * @see app/Http/Controllers/Admin/HostingPlanController.php:212
 * @route '/admin/hosting-plans/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/hosting-plans/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\HostingPlanController::create
 * @see app/Http/Controllers/Admin/HostingPlanController.php:212
 * @route '/admin/hosting-plans/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\HostingPlanController::create
 * @see app/Http/Controllers/Admin/HostingPlanController.php:212
 * @route '/admin/hosting-plans/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\HostingPlanController::create
 * @see app/Http/Controllers/Admin/HostingPlanController.php:212
 * @route '/admin/hosting-plans/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\HostingPlanController::create
 * @see app/Http/Controllers/Admin/HostingPlanController.php:212
 * @route '/admin/hosting-plans/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\HostingPlanController::create
 * @see app/Http/Controllers/Admin/HostingPlanController.php:212
 * @route '/admin/hosting-plans/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\HostingPlanController::create
 * @see app/Http/Controllers/Admin/HostingPlanController.php:212
 * @route '/admin/hosting-plans/create'
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
* @see \App\Http\Controllers\Admin\HostingPlanController::store
 * @see app/Http/Controllers/Admin/HostingPlanController.php:258
 * @route '/admin/hosting-plans'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/hosting-plans',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\HostingPlanController::store
 * @see app/Http/Controllers/Admin/HostingPlanController.php:258
 * @route '/admin/hosting-plans'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\HostingPlanController::store
 * @see app/Http/Controllers/Admin/HostingPlanController.php:258
 * @route '/admin/hosting-plans'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\HostingPlanController::store
 * @see app/Http/Controllers/Admin/HostingPlanController.php:258
 * @route '/admin/hosting-plans'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\HostingPlanController::store
 * @see app/Http/Controllers/Admin/HostingPlanController.php:258
 * @route '/admin/hosting-plans'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\HostingPlanController::show
 * @see app/Http/Controllers/Admin/HostingPlanController.php:302
 * @route '/admin/hosting-plans/{hosting_plan}'
 */
export const show = (args: { hosting_plan: string | number } | [hosting_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/hosting-plans/{hosting_plan}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\HostingPlanController::show
 * @see app/Http/Controllers/Admin/HostingPlanController.php:302
 * @route '/admin/hosting-plans/{hosting_plan}'
 */
show.url = (args: { hosting_plan: string | number } | [hosting_plan: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { hosting_plan: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    hosting_plan: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        hosting_plan: args.hosting_plan,
                }

    return show.definition.url
            .replace('{hosting_plan}', parsedArgs.hosting_plan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\HostingPlanController::show
 * @see app/Http/Controllers/Admin/HostingPlanController.php:302
 * @route '/admin/hosting-plans/{hosting_plan}'
 */
show.get = (args: { hosting_plan: string | number } | [hosting_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\HostingPlanController::show
 * @see app/Http/Controllers/Admin/HostingPlanController.php:302
 * @route '/admin/hosting-plans/{hosting_plan}'
 */
show.head = (args: { hosting_plan: string | number } | [hosting_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\HostingPlanController::show
 * @see app/Http/Controllers/Admin/HostingPlanController.php:302
 * @route '/admin/hosting-plans/{hosting_plan}'
 */
    const showForm = (args: { hosting_plan: string | number } | [hosting_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\HostingPlanController::show
 * @see app/Http/Controllers/Admin/HostingPlanController.php:302
 * @route '/admin/hosting-plans/{hosting_plan}'
 */
        showForm.get = (args: { hosting_plan: string | number } | [hosting_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\HostingPlanController::show
 * @see app/Http/Controllers/Admin/HostingPlanController.php:302
 * @route '/admin/hosting-plans/{hosting_plan}'
 */
        showForm.head = (args: { hosting_plan: string | number } | [hosting_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\HostingPlanController::edit
 * @see app/Http/Controllers/Admin/HostingPlanController.php:314
 * @route '/admin/hosting-plans/{hosting_plan}/edit'
 */
export const edit = (args: { hosting_plan: string | number } | [hosting_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/hosting-plans/{hosting_plan}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\HostingPlanController::edit
 * @see app/Http/Controllers/Admin/HostingPlanController.php:314
 * @route '/admin/hosting-plans/{hosting_plan}/edit'
 */
edit.url = (args: { hosting_plan: string | number } | [hosting_plan: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { hosting_plan: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    hosting_plan: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        hosting_plan: args.hosting_plan,
                }

    return edit.definition.url
            .replace('{hosting_plan}', parsedArgs.hosting_plan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\HostingPlanController::edit
 * @see app/Http/Controllers/Admin/HostingPlanController.php:314
 * @route '/admin/hosting-plans/{hosting_plan}/edit'
 */
edit.get = (args: { hosting_plan: string | number } | [hosting_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\HostingPlanController::edit
 * @see app/Http/Controllers/Admin/HostingPlanController.php:314
 * @route '/admin/hosting-plans/{hosting_plan}/edit'
 */
edit.head = (args: { hosting_plan: string | number } | [hosting_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\HostingPlanController::edit
 * @see app/Http/Controllers/Admin/HostingPlanController.php:314
 * @route '/admin/hosting-plans/{hosting_plan}/edit'
 */
    const editForm = (args: { hosting_plan: string | number } | [hosting_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\HostingPlanController::edit
 * @see app/Http/Controllers/Admin/HostingPlanController.php:314
 * @route '/admin/hosting-plans/{hosting_plan}/edit'
 */
        editForm.get = (args: { hosting_plan: string | number } | [hosting_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\HostingPlanController::edit
 * @see app/Http/Controllers/Admin/HostingPlanController.php:314
 * @route '/admin/hosting-plans/{hosting_plan}/edit'
 */
        editForm.head = (args: { hosting_plan: string | number } | [hosting_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\HostingPlanController::update
 * @see app/Http/Controllers/Admin/HostingPlanController.php:362
 * @route '/admin/hosting-plans/{hosting_plan}'
 */
export const update = (args: { hosting_plan: string | number } | [hosting_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin/hosting-plans/{hosting_plan}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\HostingPlanController::update
 * @see app/Http/Controllers/Admin/HostingPlanController.php:362
 * @route '/admin/hosting-plans/{hosting_plan}'
 */
update.url = (args: { hosting_plan: string | number } | [hosting_plan: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { hosting_plan: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    hosting_plan: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        hosting_plan: args.hosting_plan,
                }

    return update.definition.url
            .replace('{hosting_plan}', parsedArgs.hosting_plan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\HostingPlanController::update
 * @see app/Http/Controllers/Admin/HostingPlanController.php:362
 * @route '/admin/hosting-plans/{hosting_plan}'
 */
update.put = (args: { hosting_plan: string | number } | [hosting_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Admin\HostingPlanController::update
 * @see app/Http/Controllers/Admin/HostingPlanController.php:362
 * @route '/admin/hosting-plans/{hosting_plan}'
 */
update.patch = (args: { hosting_plan: string | number } | [hosting_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\HostingPlanController::update
 * @see app/Http/Controllers/Admin/HostingPlanController.php:362
 * @route '/admin/hosting-plans/{hosting_plan}'
 */
    const updateForm = (args: { hosting_plan: string | number } | [hosting_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\HostingPlanController::update
 * @see app/Http/Controllers/Admin/HostingPlanController.php:362
 * @route '/admin/hosting-plans/{hosting_plan}'
 */
        updateForm.put = (args: { hosting_plan: string | number } | [hosting_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Admin\HostingPlanController::update
 * @see app/Http/Controllers/Admin/HostingPlanController.php:362
 * @route '/admin/hosting-plans/{hosting_plan}'
 */
        updateForm.patch = (args: { hosting_plan: string | number } | [hosting_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\HostingPlanController::destroy
 * @see app/Http/Controllers/Admin/HostingPlanController.php:401
 * @route '/admin/hosting-plans/{hosting_plan}'
 */
export const destroy = (args: { hosting_plan: string | number } | [hosting_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/hosting-plans/{hosting_plan}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\HostingPlanController::destroy
 * @see app/Http/Controllers/Admin/HostingPlanController.php:401
 * @route '/admin/hosting-plans/{hosting_plan}'
 */
destroy.url = (args: { hosting_plan: string | number } | [hosting_plan: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { hosting_plan: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    hosting_plan: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        hosting_plan: args.hosting_plan,
                }

    return destroy.definition.url
            .replace('{hosting_plan}', parsedArgs.hosting_plan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\HostingPlanController::destroy
 * @see app/Http/Controllers/Admin/HostingPlanController.php:401
 * @route '/admin/hosting-plans/{hosting_plan}'
 */
destroy.delete = (args: { hosting_plan: string | number } | [hosting_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\HostingPlanController::destroy
 * @see app/Http/Controllers/Admin/HostingPlanController.php:401
 * @route '/admin/hosting-plans/{hosting_plan}'
 */
    const destroyForm = (args: { hosting_plan: string | number } | [hosting_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\HostingPlanController::destroy
 * @see app/Http/Controllers/Admin/HostingPlanController.php:401
 * @route '/admin/hosting-plans/{hosting_plan}'
 */
        destroyForm.delete = (args: { hosting_plan: string | number } | [hosting_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const HostingPlanController = { pterodactylOptions, index, create, store, show, edit, update, destroy }

export default HostingPlanController