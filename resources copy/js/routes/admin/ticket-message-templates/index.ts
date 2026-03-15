import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\TicketMessageTemplateController::create
 * @see app/Http/Controllers/Admin/TicketMessageTemplateController.php:16
 * @route '/admin/ticket-message-templates/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/ticket-message-templates/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\TicketMessageTemplateController::create
 * @see app/Http/Controllers/Admin/TicketMessageTemplateController.php:16
 * @route '/admin/ticket-message-templates/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TicketMessageTemplateController::create
 * @see app/Http/Controllers/Admin/TicketMessageTemplateController.php:16
 * @route '/admin/ticket-message-templates/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\TicketMessageTemplateController::create
 * @see app/Http/Controllers/Admin/TicketMessageTemplateController.php:16
 * @route '/admin/ticket-message-templates/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\TicketMessageTemplateController::create
 * @see app/Http/Controllers/Admin/TicketMessageTemplateController.php:16
 * @route '/admin/ticket-message-templates/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\TicketMessageTemplateController::create
 * @see app/Http/Controllers/Admin/TicketMessageTemplateController.php:16
 * @route '/admin/ticket-message-templates/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\TicketMessageTemplateController::create
 * @see app/Http/Controllers/Admin/TicketMessageTemplateController.php:16
 * @route '/admin/ticket-message-templates/create'
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
* @see \App\Http\Controllers\Admin\TicketMessageTemplateController::store
 * @see app/Http/Controllers/Admin/TicketMessageTemplateController.php:21
 * @route '/admin/ticket-message-templates'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/ticket-message-templates',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\TicketMessageTemplateController::store
 * @see app/Http/Controllers/Admin/TicketMessageTemplateController.php:21
 * @route '/admin/ticket-message-templates'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TicketMessageTemplateController::store
 * @see app/Http/Controllers/Admin/TicketMessageTemplateController.php:21
 * @route '/admin/ticket-message-templates'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\TicketMessageTemplateController::store
 * @see app/Http/Controllers/Admin/TicketMessageTemplateController.php:21
 * @route '/admin/ticket-message-templates'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\TicketMessageTemplateController::store
 * @see app/Http/Controllers/Admin/TicketMessageTemplateController.php:21
 * @route '/admin/ticket-message-templates'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\TicketMessageTemplateController::edit
 * @see app/Http/Controllers/Admin/TicketMessageTemplateController.php:33
 * @route '/admin/ticket-message-templates/{ticket_message_template}/edit'
 */
export const edit = (args: { ticket_message_template: number | { id: number } } | [ticket_message_template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/ticket-message-templates/{ticket_message_template}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\TicketMessageTemplateController::edit
 * @see app/Http/Controllers/Admin/TicketMessageTemplateController.php:33
 * @route '/admin/ticket-message-templates/{ticket_message_template}/edit'
 */
edit.url = (args: { ticket_message_template: number | { id: number } } | [ticket_message_template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ticket_message_template: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { ticket_message_template: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    ticket_message_template: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ticket_message_template: typeof args.ticket_message_template === 'object'
                ? args.ticket_message_template.id
                : args.ticket_message_template,
                }

    return edit.definition.url
            .replace('{ticket_message_template}', parsedArgs.ticket_message_template.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TicketMessageTemplateController::edit
 * @see app/Http/Controllers/Admin/TicketMessageTemplateController.php:33
 * @route '/admin/ticket-message-templates/{ticket_message_template}/edit'
 */
edit.get = (args: { ticket_message_template: number | { id: number } } | [ticket_message_template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\TicketMessageTemplateController::edit
 * @see app/Http/Controllers/Admin/TicketMessageTemplateController.php:33
 * @route '/admin/ticket-message-templates/{ticket_message_template}/edit'
 */
edit.head = (args: { ticket_message_template: number | { id: number } } | [ticket_message_template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\TicketMessageTemplateController::edit
 * @see app/Http/Controllers/Admin/TicketMessageTemplateController.php:33
 * @route '/admin/ticket-message-templates/{ticket_message_template}/edit'
 */
    const editForm = (args: { ticket_message_template: number | { id: number } } | [ticket_message_template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\TicketMessageTemplateController::edit
 * @see app/Http/Controllers/Admin/TicketMessageTemplateController.php:33
 * @route '/admin/ticket-message-templates/{ticket_message_template}/edit'
 */
        editForm.get = (args: { ticket_message_template: number | { id: number } } | [ticket_message_template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\TicketMessageTemplateController::edit
 * @see app/Http/Controllers/Admin/TicketMessageTemplateController.php:33
 * @route '/admin/ticket-message-templates/{ticket_message_template}/edit'
 */
        editForm.head = (args: { ticket_message_template: number | { id: number } } | [ticket_message_template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\TicketMessageTemplateController::update
 * @see app/Http/Controllers/Admin/TicketMessageTemplateController.php:40
 * @route '/admin/ticket-message-templates/{ticket_message_template}'
 */
export const update = (args: { ticket_message_template: number | { id: number } } | [ticket_message_template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin/ticket-message-templates/{ticket_message_template}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\TicketMessageTemplateController::update
 * @see app/Http/Controllers/Admin/TicketMessageTemplateController.php:40
 * @route '/admin/ticket-message-templates/{ticket_message_template}'
 */
update.url = (args: { ticket_message_template: number | { id: number } } | [ticket_message_template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ticket_message_template: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { ticket_message_template: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    ticket_message_template: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ticket_message_template: typeof args.ticket_message_template === 'object'
                ? args.ticket_message_template.id
                : args.ticket_message_template,
                }

    return update.definition.url
            .replace('{ticket_message_template}', parsedArgs.ticket_message_template.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TicketMessageTemplateController::update
 * @see app/Http/Controllers/Admin/TicketMessageTemplateController.php:40
 * @route '/admin/ticket-message-templates/{ticket_message_template}'
 */
update.put = (args: { ticket_message_template: number | { id: number } } | [ticket_message_template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Admin\TicketMessageTemplateController::update
 * @see app/Http/Controllers/Admin/TicketMessageTemplateController.php:40
 * @route '/admin/ticket-message-templates/{ticket_message_template}'
 */
update.patch = (args: { ticket_message_template: number | { id: number } } | [ticket_message_template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\TicketMessageTemplateController::update
 * @see app/Http/Controllers/Admin/TicketMessageTemplateController.php:40
 * @route '/admin/ticket-message-templates/{ticket_message_template}'
 */
    const updateForm = (args: { ticket_message_template: number | { id: number } } | [ticket_message_template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\TicketMessageTemplateController::update
 * @see app/Http/Controllers/Admin/TicketMessageTemplateController.php:40
 * @route '/admin/ticket-message-templates/{ticket_message_template}'
 */
        updateForm.put = (args: { ticket_message_template: number | { id: number } } | [ticket_message_template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Admin\TicketMessageTemplateController::update
 * @see app/Http/Controllers/Admin/TicketMessageTemplateController.php:40
 * @route '/admin/ticket-message-templates/{ticket_message_template}'
 */
        updateForm.patch = (args: { ticket_message_template: number | { id: number } } | [ticket_message_template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\TicketMessageTemplateController::destroy
 * @see app/Http/Controllers/Admin/TicketMessageTemplateController.php:53
 * @route '/admin/ticket-message-templates/{ticket_message_template}'
 */
export const destroy = (args: { ticket_message_template: number | { id: number } } | [ticket_message_template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/ticket-message-templates/{ticket_message_template}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\TicketMessageTemplateController::destroy
 * @see app/Http/Controllers/Admin/TicketMessageTemplateController.php:53
 * @route '/admin/ticket-message-templates/{ticket_message_template}'
 */
destroy.url = (args: { ticket_message_template: number | { id: number } } | [ticket_message_template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ticket_message_template: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { ticket_message_template: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    ticket_message_template: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ticket_message_template: typeof args.ticket_message_template === 'object'
                ? args.ticket_message_template.id
                : args.ticket_message_template,
                }

    return destroy.definition.url
            .replace('{ticket_message_template}', parsedArgs.ticket_message_template.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TicketMessageTemplateController::destroy
 * @see app/Http/Controllers/Admin/TicketMessageTemplateController.php:53
 * @route '/admin/ticket-message-templates/{ticket_message_template}'
 */
destroy.delete = (args: { ticket_message_template: number | { id: number } } | [ticket_message_template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\TicketMessageTemplateController::destroy
 * @see app/Http/Controllers/Admin/TicketMessageTemplateController.php:53
 * @route '/admin/ticket-message-templates/{ticket_message_template}'
 */
    const destroyForm = (args: { ticket_message_template: number | { id: number } } | [ticket_message_template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\TicketMessageTemplateController::destroy
 * @see app/Http/Controllers/Admin/TicketMessageTemplateController.php:53
 * @route '/admin/ticket-message-templates/{ticket_message_template}'
 */
        destroyForm.delete = (args: { ticket_message_template: number | { id: number } } | [ticket_message_template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const ticketMessageTemplates = {
    create: Object.assign(create, create),
store: Object.assign(store, store),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default ticketMessageTemplates