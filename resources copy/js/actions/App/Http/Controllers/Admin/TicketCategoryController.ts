import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\TicketCategoryController::index
 * @see app/Http/Controllers/Admin/TicketCategoryController.php:16
 * @route '/admin/ticket-categories'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/ticket-categories',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\TicketCategoryController::index
 * @see app/Http/Controllers/Admin/TicketCategoryController.php:16
 * @route '/admin/ticket-categories'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TicketCategoryController::index
 * @see app/Http/Controllers/Admin/TicketCategoryController.php:16
 * @route '/admin/ticket-categories'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\TicketCategoryController::index
 * @see app/Http/Controllers/Admin/TicketCategoryController.php:16
 * @route '/admin/ticket-categories'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\TicketCategoryController::index
 * @see app/Http/Controllers/Admin/TicketCategoryController.php:16
 * @route '/admin/ticket-categories'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\TicketCategoryController::index
 * @see app/Http/Controllers/Admin/TicketCategoryController.php:16
 * @route '/admin/ticket-categories'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\TicketCategoryController::index
 * @see app/Http/Controllers/Admin/TicketCategoryController.php:16
 * @route '/admin/ticket-categories'
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
* @see \App\Http\Controllers\Admin\TicketCategoryController::create
 * @see app/Http/Controllers/Admin/TicketCategoryController.php:21
 * @route '/admin/ticket-categories/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/ticket-categories/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\TicketCategoryController::create
 * @see app/Http/Controllers/Admin/TicketCategoryController.php:21
 * @route '/admin/ticket-categories/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TicketCategoryController::create
 * @see app/Http/Controllers/Admin/TicketCategoryController.php:21
 * @route '/admin/ticket-categories/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\TicketCategoryController::create
 * @see app/Http/Controllers/Admin/TicketCategoryController.php:21
 * @route '/admin/ticket-categories/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\TicketCategoryController::create
 * @see app/Http/Controllers/Admin/TicketCategoryController.php:21
 * @route '/admin/ticket-categories/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\TicketCategoryController::create
 * @see app/Http/Controllers/Admin/TicketCategoryController.php:21
 * @route '/admin/ticket-categories/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\TicketCategoryController::create
 * @see app/Http/Controllers/Admin/TicketCategoryController.php:21
 * @route '/admin/ticket-categories/create'
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
* @see \App\Http\Controllers\Admin\TicketCategoryController::store
 * @see app/Http/Controllers/Admin/TicketCategoryController.php:26
 * @route '/admin/ticket-categories'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/ticket-categories',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\TicketCategoryController::store
 * @see app/Http/Controllers/Admin/TicketCategoryController.php:26
 * @route '/admin/ticket-categories'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TicketCategoryController::store
 * @see app/Http/Controllers/Admin/TicketCategoryController.php:26
 * @route '/admin/ticket-categories'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\TicketCategoryController::store
 * @see app/Http/Controllers/Admin/TicketCategoryController.php:26
 * @route '/admin/ticket-categories'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\TicketCategoryController::store
 * @see app/Http/Controllers/Admin/TicketCategoryController.php:26
 * @route '/admin/ticket-categories'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\TicketCategoryController::edit
 * @see app/Http/Controllers/Admin/TicketCategoryController.php:39
 * @route '/admin/ticket-categories/{ticket_category}/edit'
 */
export const edit = (args: { ticket_category: string | number } | [ticket_category: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/ticket-categories/{ticket_category}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\TicketCategoryController::edit
 * @see app/Http/Controllers/Admin/TicketCategoryController.php:39
 * @route '/admin/ticket-categories/{ticket_category}/edit'
 */
edit.url = (args: { ticket_category: string | number } | [ticket_category: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ticket_category: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    ticket_category: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ticket_category: args.ticket_category,
                }

    return edit.definition.url
            .replace('{ticket_category}', parsedArgs.ticket_category.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TicketCategoryController::edit
 * @see app/Http/Controllers/Admin/TicketCategoryController.php:39
 * @route '/admin/ticket-categories/{ticket_category}/edit'
 */
edit.get = (args: { ticket_category: string | number } | [ticket_category: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\TicketCategoryController::edit
 * @see app/Http/Controllers/Admin/TicketCategoryController.php:39
 * @route '/admin/ticket-categories/{ticket_category}/edit'
 */
edit.head = (args: { ticket_category: string | number } | [ticket_category: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\TicketCategoryController::edit
 * @see app/Http/Controllers/Admin/TicketCategoryController.php:39
 * @route '/admin/ticket-categories/{ticket_category}/edit'
 */
    const editForm = (args: { ticket_category: string | number } | [ticket_category: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\TicketCategoryController::edit
 * @see app/Http/Controllers/Admin/TicketCategoryController.php:39
 * @route '/admin/ticket-categories/{ticket_category}/edit'
 */
        editForm.get = (args: { ticket_category: string | number } | [ticket_category: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\TicketCategoryController::edit
 * @see app/Http/Controllers/Admin/TicketCategoryController.php:39
 * @route '/admin/ticket-categories/{ticket_category}/edit'
 */
        editForm.head = (args: { ticket_category: string | number } | [ticket_category: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\TicketCategoryController::update
 * @see app/Http/Controllers/Admin/TicketCategoryController.php:46
 * @route '/admin/ticket-categories/{ticket_category}'
 */
export const update = (args: { ticket_category: string | number } | [ticket_category: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin/ticket-categories/{ticket_category}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\TicketCategoryController::update
 * @see app/Http/Controllers/Admin/TicketCategoryController.php:46
 * @route '/admin/ticket-categories/{ticket_category}'
 */
update.url = (args: { ticket_category: string | number } | [ticket_category: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ticket_category: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    ticket_category: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ticket_category: args.ticket_category,
                }

    return update.definition.url
            .replace('{ticket_category}', parsedArgs.ticket_category.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TicketCategoryController::update
 * @see app/Http/Controllers/Admin/TicketCategoryController.php:46
 * @route '/admin/ticket-categories/{ticket_category}'
 */
update.put = (args: { ticket_category: string | number } | [ticket_category: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Admin\TicketCategoryController::update
 * @see app/Http/Controllers/Admin/TicketCategoryController.php:46
 * @route '/admin/ticket-categories/{ticket_category}'
 */
update.patch = (args: { ticket_category: string | number } | [ticket_category: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\TicketCategoryController::update
 * @see app/Http/Controllers/Admin/TicketCategoryController.php:46
 * @route '/admin/ticket-categories/{ticket_category}'
 */
    const updateForm = (args: { ticket_category: string | number } | [ticket_category: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\TicketCategoryController::update
 * @see app/Http/Controllers/Admin/TicketCategoryController.php:46
 * @route '/admin/ticket-categories/{ticket_category}'
 */
        updateForm.put = (args: { ticket_category: string | number } | [ticket_category: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Admin\TicketCategoryController::update
 * @see app/Http/Controllers/Admin/TicketCategoryController.php:46
 * @route '/admin/ticket-categories/{ticket_category}'
 */
        updateForm.patch = (args: { ticket_category: string | number } | [ticket_category: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\TicketCategoryController::destroy
 * @see app/Http/Controllers/Admin/TicketCategoryController.php:60
 * @route '/admin/ticket-categories/{ticket_category}'
 */
export const destroy = (args: { ticket_category: string | number } | [ticket_category: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/ticket-categories/{ticket_category}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\TicketCategoryController::destroy
 * @see app/Http/Controllers/Admin/TicketCategoryController.php:60
 * @route '/admin/ticket-categories/{ticket_category}'
 */
destroy.url = (args: { ticket_category: string | number } | [ticket_category: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ticket_category: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    ticket_category: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ticket_category: args.ticket_category,
                }

    return destroy.definition.url
            .replace('{ticket_category}', parsedArgs.ticket_category.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TicketCategoryController::destroy
 * @see app/Http/Controllers/Admin/TicketCategoryController.php:60
 * @route '/admin/ticket-categories/{ticket_category}'
 */
destroy.delete = (args: { ticket_category: string | number } | [ticket_category: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\TicketCategoryController::destroy
 * @see app/Http/Controllers/Admin/TicketCategoryController.php:60
 * @route '/admin/ticket-categories/{ticket_category}'
 */
    const destroyForm = (args: { ticket_category: string | number } | [ticket_category: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\TicketCategoryController::destroy
 * @see app/Http/Controllers/Admin/TicketCategoryController.php:60
 * @route '/admin/ticket-categories/{ticket_category}'
 */
        destroyForm.delete = (args: { ticket_category: string | number } | [ticket_category: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const TicketCategoryController = { index, create, store, edit, update, destroy }

export default TicketCategoryController