import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\PartnerController::index
 * @see app/Http/Controllers/Admin/PartnerController.php:20
 * @route '/admin/partners'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/partners',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PartnerController::index
 * @see app/Http/Controllers/Admin/PartnerController.php:20
 * @route '/admin/partners'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PartnerController::index
 * @see app/Http/Controllers/Admin/PartnerController.php:20
 * @route '/admin/partners'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\PartnerController::index
 * @see app/Http/Controllers/Admin/PartnerController.php:20
 * @route '/admin/partners'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\PartnerController::index
 * @see app/Http/Controllers/Admin/PartnerController.php:20
 * @route '/admin/partners'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\PartnerController::index
 * @see app/Http/Controllers/Admin/PartnerController.php:20
 * @route '/admin/partners'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\PartnerController::index
 * @see app/Http/Controllers/Admin/PartnerController.php:20
 * @route '/admin/partners'
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
* @see \App\Http\Controllers\Admin\PartnerController::create
 * @see app/Http/Controllers/Admin/PartnerController.php:37
 * @route '/admin/partners/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/partners/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PartnerController::create
 * @see app/Http/Controllers/Admin/PartnerController.php:37
 * @route '/admin/partners/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PartnerController::create
 * @see app/Http/Controllers/Admin/PartnerController.php:37
 * @route '/admin/partners/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\PartnerController::create
 * @see app/Http/Controllers/Admin/PartnerController.php:37
 * @route '/admin/partners/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\PartnerController::create
 * @see app/Http/Controllers/Admin/PartnerController.php:37
 * @route '/admin/partners/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\PartnerController::create
 * @see app/Http/Controllers/Admin/PartnerController.php:37
 * @route '/admin/partners/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\PartnerController::create
 * @see app/Http/Controllers/Admin/PartnerController.php:37
 * @route '/admin/partners/create'
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
* @see \App\Http\Controllers\Admin\PartnerController::store
 * @see app/Http/Controllers/Admin/PartnerController.php:48
 * @route '/admin/partners'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/partners',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PartnerController::store
 * @see app/Http/Controllers/Admin/PartnerController.php:48
 * @route '/admin/partners'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PartnerController::store
 * @see app/Http/Controllers/Admin/PartnerController.php:48
 * @route '/admin/partners'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\PartnerController::store
 * @see app/Http/Controllers/Admin/PartnerController.php:48
 * @route '/admin/partners'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\PartnerController::store
 * @see app/Http/Controllers/Admin/PartnerController.php:48
 * @route '/admin/partners'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\PartnerController::edit
 * @see app/Http/Controllers/Admin/PartnerController.php:68
 * @route '/admin/partners/{partner}/edit'
 */
export const edit = (args: { partner: number | { id: number } } | [partner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/partners/{partner}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PartnerController::edit
 * @see app/Http/Controllers/Admin/PartnerController.php:68
 * @route '/admin/partners/{partner}/edit'
 */
edit.url = (args: { partner: number | { id: number } } | [partner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { partner: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { partner: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    partner: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        partner: typeof args.partner === 'object'
                ? args.partner.id
                : args.partner,
                }

    return edit.definition.url
            .replace('{partner}', parsedArgs.partner.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PartnerController::edit
 * @see app/Http/Controllers/Admin/PartnerController.php:68
 * @route '/admin/partners/{partner}/edit'
 */
edit.get = (args: { partner: number | { id: number } } | [partner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\PartnerController::edit
 * @see app/Http/Controllers/Admin/PartnerController.php:68
 * @route '/admin/partners/{partner}/edit'
 */
edit.head = (args: { partner: number | { id: number } } | [partner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\PartnerController::edit
 * @see app/Http/Controllers/Admin/PartnerController.php:68
 * @route '/admin/partners/{partner}/edit'
 */
    const editForm = (args: { partner: number | { id: number } } | [partner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\PartnerController::edit
 * @see app/Http/Controllers/Admin/PartnerController.php:68
 * @route '/admin/partners/{partner}/edit'
 */
        editForm.get = (args: { partner: number | { id: number } } | [partner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\PartnerController::edit
 * @see app/Http/Controllers/Admin/PartnerController.php:68
 * @route '/admin/partners/{partner}/edit'
 */
        editForm.head = (args: { partner: number | { id: number } } | [partner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\PartnerController::update
 * @see app/Http/Controllers/Admin/PartnerController.php:81
 * @route '/admin/partners/{partner}'
 */
export const update = (args: { partner: number | { id: number } } | [partner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin/partners/{partner}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\PartnerController::update
 * @see app/Http/Controllers/Admin/PartnerController.php:81
 * @route '/admin/partners/{partner}'
 */
update.url = (args: { partner: number | { id: number } } | [partner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { partner: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { partner: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    partner: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        partner: typeof args.partner === 'object'
                ? args.partner.id
                : args.partner,
                }

    return update.definition.url
            .replace('{partner}', parsedArgs.partner.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PartnerController::update
 * @see app/Http/Controllers/Admin/PartnerController.php:81
 * @route '/admin/partners/{partner}'
 */
update.put = (args: { partner: number | { id: number } } | [partner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Admin\PartnerController::update
 * @see app/Http/Controllers/Admin/PartnerController.php:81
 * @route '/admin/partners/{partner}'
 */
update.patch = (args: { partner: number | { id: number } } | [partner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\PartnerController::update
 * @see app/Http/Controllers/Admin/PartnerController.php:81
 * @route '/admin/partners/{partner}'
 */
    const updateForm = (args: { partner: number | { id: number } } | [partner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\PartnerController::update
 * @see app/Http/Controllers/Admin/PartnerController.php:81
 * @route '/admin/partners/{partner}'
 */
        updateForm.put = (args: { partner: number | { id: number } } | [partner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Admin\PartnerController::update
 * @see app/Http/Controllers/Admin/PartnerController.php:81
 * @route '/admin/partners/{partner}'
 */
        updateForm.patch = (args: { partner: number | { id: number } } | [partner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\PartnerController::destroy
 * @see app/Http/Controllers/Admin/PartnerController.php:105
 * @route '/admin/partners/{partner}'
 */
export const destroy = (args: { partner: number | { id: number } } | [partner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/partners/{partner}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\PartnerController::destroy
 * @see app/Http/Controllers/Admin/PartnerController.php:105
 * @route '/admin/partners/{partner}'
 */
destroy.url = (args: { partner: number | { id: number } } | [partner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { partner: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { partner: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    partner: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        partner: typeof args.partner === 'object'
                ? args.partner.id
                : args.partner,
                }

    return destroy.definition.url
            .replace('{partner}', parsedArgs.partner.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PartnerController::destroy
 * @see app/Http/Controllers/Admin/PartnerController.php:105
 * @route '/admin/partners/{partner}'
 */
destroy.delete = (args: { partner: number | { id: number } } | [partner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\PartnerController::destroy
 * @see app/Http/Controllers/Admin/PartnerController.php:105
 * @route '/admin/partners/{partner}'
 */
    const destroyForm = (args: { partner: number | { id: number } } | [partner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\PartnerController::destroy
 * @see app/Http/Controllers/Admin/PartnerController.php:105
 * @route '/admin/partners/{partner}'
 */
        destroyForm.delete = (args: { partner: number | { id: number } } | [partner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const PartnerController = { index, create, store, edit, update, destroy }

export default PartnerController