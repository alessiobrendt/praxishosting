import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
import data from './data'
/**
* @see \App\Http\Controllers\Admin\TemplatePageController::create
 * @see app/Http/Controllers/Admin/TemplatePageController.php:30
 * @route '/admin/templates/{template}/pages/create'
 */
export const create = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/templates/{template}/pages/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\TemplatePageController::create
 * @see app/Http/Controllers/Admin/TemplatePageController.php:30
 * @route '/admin/templates/{template}/pages/create'
 */
create.url = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { template: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { template: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    template: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        template: typeof args.template === 'object'
                ? args.template.id
                : args.template,
                }

    return create.definition.url
            .replace('{template}', parsedArgs.template.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TemplatePageController::create
 * @see app/Http/Controllers/Admin/TemplatePageController.php:30
 * @route '/admin/templates/{template}/pages/create'
 */
create.get = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\TemplatePageController::create
 * @see app/Http/Controllers/Admin/TemplatePageController.php:30
 * @route '/admin/templates/{template}/pages/create'
 */
create.head = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\TemplatePageController::create
 * @see app/Http/Controllers/Admin/TemplatePageController.php:30
 * @route '/admin/templates/{template}/pages/create'
 */
    const createForm = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\TemplatePageController::create
 * @see app/Http/Controllers/Admin/TemplatePageController.php:30
 * @route '/admin/templates/{template}/pages/create'
 */
        createForm.get = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\TemplatePageController::create
 * @see app/Http/Controllers/Admin/TemplatePageController.php:30
 * @route '/admin/templates/{template}/pages/create'
 */
        createForm.head = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\Admin\TemplatePageController::store
 * @see app/Http/Controllers/Admin/TemplatePageController.php:39
 * @route '/admin/templates/{template}/pages'
 */
export const store = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/templates/{template}/pages',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\TemplatePageController::store
 * @see app/Http/Controllers/Admin/TemplatePageController.php:39
 * @route '/admin/templates/{template}/pages'
 */
store.url = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { template: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { template: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    template: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        template: typeof args.template === 'object'
                ? args.template.id
                : args.template,
                }

    return store.definition.url
            .replace('{template}', parsedArgs.template.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TemplatePageController::store
 * @see app/Http/Controllers/Admin/TemplatePageController.php:39
 * @route '/admin/templates/{template}/pages'
 */
store.post = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\TemplatePageController::store
 * @see app/Http/Controllers/Admin/TemplatePageController.php:39
 * @route '/admin/templates/{template}/pages'
 */
    const storeForm = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\TemplatePageController::store
 * @see app/Http/Controllers/Admin/TemplatePageController.php:39
 * @route '/admin/templates/{template}/pages'
 */
        storeForm.post = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\TemplatePageController::show
 * @see app/Http/Controllers/Admin/TemplatePageController.php:48
 * @route '/admin/templates/{template}/pages/{page}'
 */
export const show = (args: { template: number | { id: number }, page: number | { id: number } } | [template: number | { id: number }, page: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/templates/{template}/pages/{page}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\TemplatePageController::show
 * @see app/Http/Controllers/Admin/TemplatePageController.php:48
 * @route '/admin/templates/{template}/pages/{page}'
 */
show.url = (args: { template: number | { id: number }, page: number | { id: number } } | [template: number | { id: number }, page: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    template: args[0],
                    page: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        template: typeof args.template === 'object'
                ? args.template.id
                : args.template,
                                page: typeof args.page === 'object'
                ? args.page.id
                : args.page,
                }

    return show.definition.url
            .replace('{template}', parsedArgs.template.toString())
            .replace('{page}', parsedArgs.page.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TemplatePageController::show
 * @see app/Http/Controllers/Admin/TemplatePageController.php:48
 * @route '/admin/templates/{template}/pages/{page}'
 */
show.get = (args: { template: number | { id: number }, page: number | { id: number } } | [template: number | { id: number }, page: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\TemplatePageController::show
 * @see app/Http/Controllers/Admin/TemplatePageController.php:48
 * @route '/admin/templates/{template}/pages/{page}'
 */
show.head = (args: { template: number | { id: number }, page: number | { id: number } } | [template: number | { id: number }, page: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\TemplatePageController::show
 * @see app/Http/Controllers/Admin/TemplatePageController.php:48
 * @route '/admin/templates/{template}/pages/{page}'
 */
    const showForm = (args: { template: number | { id: number }, page: number | { id: number } } | [template: number | { id: number }, page: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\TemplatePageController::show
 * @see app/Http/Controllers/Admin/TemplatePageController.php:48
 * @route '/admin/templates/{template}/pages/{page}'
 */
        showForm.get = (args: { template: number | { id: number }, page: number | { id: number } } | [template: number | { id: number }, page: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\TemplatePageController::show
 * @see app/Http/Controllers/Admin/TemplatePageController.php:48
 * @route '/admin/templates/{template}/pages/{page}'
 */
        showForm.head = (args: { template: number | { id: number }, page: number | { id: number } } | [template: number | { id: number }, page: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\TemplatePageController::edit
 * @see app/Http/Controllers/Admin/TemplatePageController.php:58
 * @route '/admin/templates/{template}/pages/{page}/edit'
 */
export const edit = (args: { template: number | { id: number }, page: number | { id: number } } | [template: number | { id: number }, page: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/templates/{template}/pages/{page}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\TemplatePageController::edit
 * @see app/Http/Controllers/Admin/TemplatePageController.php:58
 * @route '/admin/templates/{template}/pages/{page}/edit'
 */
edit.url = (args: { template: number | { id: number }, page: number | { id: number } } | [template: number | { id: number }, page: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    template: args[0],
                    page: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        template: typeof args.template === 'object'
                ? args.template.id
                : args.template,
                                page: typeof args.page === 'object'
                ? args.page.id
                : args.page,
                }

    return edit.definition.url
            .replace('{template}', parsedArgs.template.toString())
            .replace('{page}', parsedArgs.page.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TemplatePageController::edit
 * @see app/Http/Controllers/Admin/TemplatePageController.php:58
 * @route '/admin/templates/{template}/pages/{page}/edit'
 */
edit.get = (args: { template: number | { id: number }, page: number | { id: number } } | [template: number | { id: number }, page: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\TemplatePageController::edit
 * @see app/Http/Controllers/Admin/TemplatePageController.php:58
 * @route '/admin/templates/{template}/pages/{page}/edit'
 */
edit.head = (args: { template: number | { id: number }, page: number | { id: number } } | [template: number | { id: number }, page: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\TemplatePageController::edit
 * @see app/Http/Controllers/Admin/TemplatePageController.php:58
 * @route '/admin/templates/{template}/pages/{page}/edit'
 */
    const editForm = (args: { template: number | { id: number }, page: number | { id: number } } | [template: number | { id: number }, page: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\TemplatePageController::edit
 * @see app/Http/Controllers/Admin/TemplatePageController.php:58
 * @route '/admin/templates/{template}/pages/{page}/edit'
 */
        editForm.get = (args: { template: number | { id: number }, page: number | { id: number } } | [template: number | { id: number }, page: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\TemplatePageController::edit
 * @see app/Http/Controllers/Admin/TemplatePageController.php:58
 * @route '/admin/templates/{template}/pages/{page}/edit'
 */
        editForm.head = (args: { template: number | { id: number }, page: number | { id: number } } | [template: number | { id: number }, page: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\TemplatePageController::update
 * @see app/Http/Controllers/Admin/TemplatePageController.php:68
 * @route '/admin/templates/{template}/pages/{page}'
 */
export const update = (args: { template: number | { id: number }, page: number | { id: number } } | [template: number | { id: number }, page: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin/templates/{template}/pages/{page}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\TemplatePageController::update
 * @see app/Http/Controllers/Admin/TemplatePageController.php:68
 * @route '/admin/templates/{template}/pages/{page}'
 */
update.url = (args: { template: number | { id: number }, page: number | { id: number } } | [template: number | { id: number }, page: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    template: args[0],
                    page: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        template: typeof args.template === 'object'
                ? args.template.id
                : args.template,
                                page: typeof args.page === 'object'
                ? args.page.id
                : args.page,
                }

    return update.definition.url
            .replace('{template}', parsedArgs.template.toString())
            .replace('{page}', parsedArgs.page.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TemplatePageController::update
 * @see app/Http/Controllers/Admin/TemplatePageController.php:68
 * @route '/admin/templates/{template}/pages/{page}'
 */
update.put = (args: { template: number | { id: number }, page: number | { id: number } } | [template: number | { id: number }, page: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Admin\TemplatePageController::update
 * @see app/Http/Controllers/Admin/TemplatePageController.php:68
 * @route '/admin/templates/{template}/pages/{page}'
 */
update.patch = (args: { template: number | { id: number }, page: number | { id: number } } | [template: number | { id: number }, page: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\TemplatePageController::update
 * @see app/Http/Controllers/Admin/TemplatePageController.php:68
 * @route '/admin/templates/{template}/pages/{page}'
 */
    const updateForm = (args: { template: number | { id: number }, page: number | { id: number } } | [template: number | { id: number }, page: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\TemplatePageController::update
 * @see app/Http/Controllers/Admin/TemplatePageController.php:68
 * @route '/admin/templates/{template}/pages/{page}'
 */
        updateForm.put = (args: { template: number | { id: number }, page: number | { id: number } } | [template: number | { id: number }, page: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Admin\TemplatePageController::update
 * @see app/Http/Controllers/Admin/TemplatePageController.php:68
 * @route '/admin/templates/{template}/pages/{page}'
 */
        updateForm.patch = (args: { template: number | { id: number }, page: number | { id: number } } | [template: number | { id: number }, page: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\TemplatePageController::destroy
 * @see app/Http/Controllers/Admin/TemplatePageController.php:83
 * @route '/admin/templates/{template}/pages/{page}'
 */
export const destroy = (args: { template: number | { id: number }, page: number | { id: number } } | [template: number | { id: number }, page: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/templates/{template}/pages/{page}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\TemplatePageController::destroy
 * @see app/Http/Controllers/Admin/TemplatePageController.php:83
 * @route '/admin/templates/{template}/pages/{page}'
 */
destroy.url = (args: { template: number | { id: number }, page: number | { id: number } } | [template: number | { id: number }, page: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    template: args[0],
                    page: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        template: typeof args.template === 'object'
                ? args.template.id
                : args.template,
                                page: typeof args.page === 'object'
                ? args.page.id
                : args.page,
                }

    return destroy.definition.url
            .replace('{template}', parsedArgs.template.toString())
            .replace('{page}', parsedArgs.page.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TemplatePageController::destroy
 * @see app/Http/Controllers/Admin/TemplatePageController.php:83
 * @route '/admin/templates/{template}/pages/{page}'
 */
destroy.delete = (args: { template: number | { id: number }, page: number | { id: number } } | [template: number | { id: number }, page: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\TemplatePageController::destroy
 * @see app/Http/Controllers/Admin/TemplatePageController.php:83
 * @route '/admin/templates/{template}/pages/{page}'
 */
    const destroyForm = (args: { template: number | { id: number }, page: number | { id: number } } | [template: number | { id: number }, page: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\TemplatePageController::destroy
 * @see app/Http/Controllers/Admin/TemplatePageController.php:83
 * @route '/admin/templates/{template}/pages/{page}'
 */
        destroyForm.delete = (args: { template: number | { id: number }, page: number | { id: number } } | [template: number | { id: number }, page: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\TemplatePageController::index
 * @see app/Http/Controllers/Admin/TemplatePageController.php:18
 * @route '/admin/templates/{template}/pages'
 */
export const index = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/templates/{template}/pages',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\TemplatePageController::index
 * @see app/Http/Controllers/Admin/TemplatePageController.php:18
 * @route '/admin/templates/{template}/pages'
 */
index.url = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { template: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { template: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    template: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        template: typeof args.template === 'object'
                ? args.template.id
                : args.template,
                }

    return index.definition.url
            .replace('{template}', parsedArgs.template.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TemplatePageController::index
 * @see app/Http/Controllers/Admin/TemplatePageController.php:18
 * @route '/admin/templates/{template}/pages'
 */
index.get = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\TemplatePageController::index
 * @see app/Http/Controllers/Admin/TemplatePageController.php:18
 * @route '/admin/templates/{template}/pages'
 */
index.head = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\TemplatePageController::index
 * @see app/Http/Controllers/Admin/TemplatePageController.php:18
 * @route '/admin/templates/{template}/pages'
 */
    const indexForm = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\TemplatePageController::index
 * @see app/Http/Controllers/Admin/TemplatePageController.php:18
 * @route '/admin/templates/{template}/pages'
 */
        indexForm.get = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\TemplatePageController::index
 * @see app/Http/Controllers/Admin/TemplatePageController.php:18
 * @route '/admin/templates/{template}/pages'
 */
        indexForm.head = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
const pages = {
    create: Object.assign(create, create),
store: Object.assign(store, store),
show: Object.assign(show, show),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
index: Object.assign(index, index),
data: Object.assign(data, data),
}

export default pages