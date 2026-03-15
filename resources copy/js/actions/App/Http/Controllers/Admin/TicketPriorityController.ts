import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\TicketPriorityController::index
 * @see app/Http/Controllers/Admin/TicketPriorityController.php:16
 * @route '/admin/ticket-priorities'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/ticket-priorities',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\TicketPriorityController::index
 * @see app/Http/Controllers/Admin/TicketPriorityController.php:16
 * @route '/admin/ticket-priorities'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TicketPriorityController::index
 * @see app/Http/Controllers/Admin/TicketPriorityController.php:16
 * @route '/admin/ticket-priorities'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\TicketPriorityController::index
 * @see app/Http/Controllers/Admin/TicketPriorityController.php:16
 * @route '/admin/ticket-priorities'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\TicketPriorityController::index
 * @see app/Http/Controllers/Admin/TicketPriorityController.php:16
 * @route '/admin/ticket-priorities'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\TicketPriorityController::index
 * @see app/Http/Controllers/Admin/TicketPriorityController.php:16
 * @route '/admin/ticket-priorities'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\TicketPriorityController::index
 * @see app/Http/Controllers/Admin/TicketPriorityController.php:16
 * @route '/admin/ticket-priorities'
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
* @see \App\Http\Controllers\Admin\TicketPriorityController::create
 * @see app/Http/Controllers/Admin/TicketPriorityController.php:21
 * @route '/admin/ticket-priorities/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/ticket-priorities/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\TicketPriorityController::create
 * @see app/Http/Controllers/Admin/TicketPriorityController.php:21
 * @route '/admin/ticket-priorities/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TicketPriorityController::create
 * @see app/Http/Controllers/Admin/TicketPriorityController.php:21
 * @route '/admin/ticket-priorities/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\TicketPriorityController::create
 * @see app/Http/Controllers/Admin/TicketPriorityController.php:21
 * @route '/admin/ticket-priorities/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\TicketPriorityController::create
 * @see app/Http/Controllers/Admin/TicketPriorityController.php:21
 * @route '/admin/ticket-priorities/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\TicketPriorityController::create
 * @see app/Http/Controllers/Admin/TicketPriorityController.php:21
 * @route '/admin/ticket-priorities/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\TicketPriorityController::create
 * @see app/Http/Controllers/Admin/TicketPriorityController.php:21
 * @route '/admin/ticket-priorities/create'
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
* @see \App\Http\Controllers\Admin\TicketPriorityController::store
 * @see app/Http/Controllers/Admin/TicketPriorityController.php:26
 * @route '/admin/ticket-priorities'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/ticket-priorities',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\TicketPriorityController::store
 * @see app/Http/Controllers/Admin/TicketPriorityController.php:26
 * @route '/admin/ticket-priorities'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TicketPriorityController::store
 * @see app/Http/Controllers/Admin/TicketPriorityController.php:26
 * @route '/admin/ticket-priorities'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\TicketPriorityController::store
 * @see app/Http/Controllers/Admin/TicketPriorityController.php:26
 * @route '/admin/ticket-priorities'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\TicketPriorityController::store
 * @see app/Http/Controllers/Admin/TicketPriorityController.php:26
 * @route '/admin/ticket-priorities'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\TicketPriorityController::edit
 * @see app/Http/Controllers/Admin/TicketPriorityController.php:39
 * @route '/admin/ticket-priorities/{ticket_priority}/edit'
 */
export const edit = (args: { ticket_priority: string | number } | [ticket_priority: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/ticket-priorities/{ticket_priority}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\TicketPriorityController::edit
 * @see app/Http/Controllers/Admin/TicketPriorityController.php:39
 * @route '/admin/ticket-priorities/{ticket_priority}/edit'
 */
edit.url = (args: { ticket_priority: string | number } | [ticket_priority: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ticket_priority: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    ticket_priority: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ticket_priority: args.ticket_priority,
                }

    return edit.definition.url
            .replace('{ticket_priority}', parsedArgs.ticket_priority.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TicketPriorityController::edit
 * @see app/Http/Controllers/Admin/TicketPriorityController.php:39
 * @route '/admin/ticket-priorities/{ticket_priority}/edit'
 */
edit.get = (args: { ticket_priority: string | number } | [ticket_priority: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\TicketPriorityController::edit
 * @see app/Http/Controllers/Admin/TicketPriorityController.php:39
 * @route '/admin/ticket-priorities/{ticket_priority}/edit'
 */
edit.head = (args: { ticket_priority: string | number } | [ticket_priority: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\TicketPriorityController::edit
 * @see app/Http/Controllers/Admin/TicketPriorityController.php:39
 * @route '/admin/ticket-priorities/{ticket_priority}/edit'
 */
    const editForm = (args: { ticket_priority: string | number } | [ticket_priority: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\TicketPriorityController::edit
 * @see app/Http/Controllers/Admin/TicketPriorityController.php:39
 * @route '/admin/ticket-priorities/{ticket_priority}/edit'
 */
        editForm.get = (args: { ticket_priority: string | number } | [ticket_priority: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\TicketPriorityController::edit
 * @see app/Http/Controllers/Admin/TicketPriorityController.php:39
 * @route '/admin/ticket-priorities/{ticket_priority}/edit'
 */
        editForm.head = (args: { ticket_priority: string | number } | [ticket_priority: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\TicketPriorityController::update
 * @see app/Http/Controllers/Admin/TicketPriorityController.php:46
 * @route '/admin/ticket-priorities/{ticket_priority}'
 */
export const update = (args: { ticket_priority: string | number } | [ticket_priority: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin/ticket-priorities/{ticket_priority}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\TicketPriorityController::update
 * @see app/Http/Controllers/Admin/TicketPriorityController.php:46
 * @route '/admin/ticket-priorities/{ticket_priority}'
 */
update.url = (args: { ticket_priority: string | number } | [ticket_priority: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ticket_priority: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    ticket_priority: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ticket_priority: args.ticket_priority,
                }

    return update.definition.url
            .replace('{ticket_priority}', parsedArgs.ticket_priority.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TicketPriorityController::update
 * @see app/Http/Controllers/Admin/TicketPriorityController.php:46
 * @route '/admin/ticket-priorities/{ticket_priority}'
 */
update.put = (args: { ticket_priority: string | number } | [ticket_priority: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Admin\TicketPriorityController::update
 * @see app/Http/Controllers/Admin/TicketPriorityController.php:46
 * @route '/admin/ticket-priorities/{ticket_priority}'
 */
update.patch = (args: { ticket_priority: string | number } | [ticket_priority: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\TicketPriorityController::update
 * @see app/Http/Controllers/Admin/TicketPriorityController.php:46
 * @route '/admin/ticket-priorities/{ticket_priority}'
 */
    const updateForm = (args: { ticket_priority: string | number } | [ticket_priority: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\TicketPriorityController::update
 * @see app/Http/Controllers/Admin/TicketPriorityController.php:46
 * @route '/admin/ticket-priorities/{ticket_priority}'
 */
        updateForm.put = (args: { ticket_priority: string | number } | [ticket_priority: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Admin\TicketPriorityController::update
 * @see app/Http/Controllers/Admin/TicketPriorityController.php:46
 * @route '/admin/ticket-priorities/{ticket_priority}'
 */
        updateForm.patch = (args: { ticket_priority: string | number } | [ticket_priority: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\TicketPriorityController::destroy
 * @see app/Http/Controllers/Admin/TicketPriorityController.php:60
 * @route '/admin/ticket-priorities/{ticket_priority}'
 */
export const destroy = (args: { ticket_priority: string | number } | [ticket_priority: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/ticket-priorities/{ticket_priority}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\TicketPriorityController::destroy
 * @see app/Http/Controllers/Admin/TicketPriorityController.php:60
 * @route '/admin/ticket-priorities/{ticket_priority}'
 */
destroy.url = (args: { ticket_priority: string | number } | [ticket_priority: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ticket_priority: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    ticket_priority: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ticket_priority: args.ticket_priority,
                }

    return destroy.definition.url
            .replace('{ticket_priority}', parsedArgs.ticket_priority.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TicketPriorityController::destroy
 * @see app/Http/Controllers/Admin/TicketPriorityController.php:60
 * @route '/admin/ticket-priorities/{ticket_priority}'
 */
destroy.delete = (args: { ticket_priority: string | number } | [ticket_priority: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\TicketPriorityController::destroy
 * @see app/Http/Controllers/Admin/TicketPriorityController.php:60
 * @route '/admin/ticket-priorities/{ticket_priority}'
 */
    const destroyForm = (args: { ticket_priority: string | number } | [ticket_priority: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\TicketPriorityController::destroy
 * @see app/Http/Controllers/Admin/TicketPriorityController.php:60
 * @route '/admin/ticket-priorities/{ticket_priority}'
 */
        destroyForm.delete = (args: { ticket_priority: string | number } | [ticket_priority: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const TicketPriorityController = { index, create, store, edit, update, destroy }

export default TicketPriorityController