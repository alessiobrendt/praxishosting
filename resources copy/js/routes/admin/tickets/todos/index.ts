import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\TicketController::store
 * @see app/Http/Controllers/Admin/TicketController.php:343
 * @route '/admin/tickets/{ticket}/todos'
 */
export const store = (args: { ticket: string | { uuid: string } } | [ticket: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/tickets/{ticket}/todos',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\TicketController::store
 * @see app/Http/Controllers/Admin/TicketController.php:343
 * @route '/admin/tickets/{ticket}/todos'
 */
store.url = (args: { ticket: string | { uuid: string } } | [ticket: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ticket: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { ticket: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    ticket: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ticket: typeof args.ticket === 'object'
                ? args.ticket.uuid
                : args.ticket,
                }

    return store.definition.url
            .replace('{ticket}', parsedArgs.ticket.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TicketController::store
 * @see app/Http/Controllers/Admin/TicketController.php:343
 * @route '/admin/tickets/{ticket}/todos'
 */
store.post = (args: { ticket: string | { uuid: string } } | [ticket: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\TicketController::store
 * @see app/Http/Controllers/Admin/TicketController.php:343
 * @route '/admin/tickets/{ticket}/todos'
 */
    const storeForm = (args: { ticket: string | { uuid: string } } | [ticket: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\TicketController::store
 * @see app/Http/Controllers/Admin/TicketController.php:343
 * @route '/admin/tickets/{ticket}/todos'
 */
        storeForm.post = (args: { ticket: string | { uuid: string } } | [ticket: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\TicketController::update
 * @see app/Http/Controllers/Admin/TicketController.php:358
 * @route '/admin/tickets/{ticket}/todos/{todo}'
 */
export const update = (args: { ticket: string | { uuid: string }, todo: number | { id: number } } | [ticket: string | { uuid: string }, todo: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/admin/tickets/{ticket}/todos/{todo}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\TicketController::update
 * @see app/Http/Controllers/Admin/TicketController.php:358
 * @route '/admin/tickets/{ticket}/todos/{todo}'
 */
update.url = (args: { ticket: string | { uuid: string }, todo: number | { id: number } } | [ticket: string | { uuid: string }, todo: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    ticket: args[0],
                    todo: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ticket: typeof args.ticket === 'object'
                ? args.ticket.uuid
                : args.ticket,
                                todo: typeof args.todo === 'object'
                ? args.todo.id
                : args.todo,
                }

    return update.definition.url
            .replace('{ticket}', parsedArgs.ticket.toString())
            .replace('{todo}', parsedArgs.todo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TicketController::update
 * @see app/Http/Controllers/Admin/TicketController.php:358
 * @route '/admin/tickets/{ticket}/todos/{todo}'
 */
update.patch = (args: { ticket: string | { uuid: string }, todo: number | { id: number } } | [ticket: string | { uuid: string }, todo: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\TicketController::update
 * @see app/Http/Controllers/Admin/TicketController.php:358
 * @route '/admin/tickets/{ticket}/todos/{todo}'
 */
    const updateForm = (args: { ticket: string | { uuid: string }, todo: number | { id: number } } | [ticket: string | { uuid: string }, todo: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\TicketController::update
 * @see app/Http/Controllers/Admin/TicketController.php:358
 * @route '/admin/tickets/{ticket}/todos/{todo}'
 */
        updateForm.patch = (args: { ticket: string | { uuid: string }, todo: number | { id: number } } | [ticket: string | { uuid: string }, todo: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\TicketController::destroy
 * @see app/Http/Controllers/Admin/TicketController.php:372
 * @route '/admin/tickets/{ticket}/todos/{todo}'
 */
export const destroy = (args: { ticket: string | { uuid: string }, todo: number | { id: number } } | [ticket: string | { uuid: string }, todo: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/tickets/{ticket}/todos/{todo}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\TicketController::destroy
 * @see app/Http/Controllers/Admin/TicketController.php:372
 * @route '/admin/tickets/{ticket}/todos/{todo}'
 */
destroy.url = (args: { ticket: string | { uuid: string }, todo: number | { id: number } } | [ticket: string | { uuid: string }, todo: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    ticket: args[0],
                    todo: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ticket: typeof args.ticket === 'object'
                ? args.ticket.uuid
                : args.ticket,
                                todo: typeof args.todo === 'object'
                ? args.todo.id
                : args.todo,
                }

    return destroy.definition.url
            .replace('{ticket}', parsedArgs.ticket.toString())
            .replace('{todo}', parsedArgs.todo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TicketController::destroy
 * @see app/Http/Controllers/Admin/TicketController.php:372
 * @route '/admin/tickets/{ticket}/todos/{todo}'
 */
destroy.delete = (args: { ticket: string | { uuid: string }, todo: number | { id: number } } | [ticket: string | { uuid: string }, todo: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\TicketController::destroy
 * @see app/Http/Controllers/Admin/TicketController.php:372
 * @route '/admin/tickets/{ticket}/todos/{todo}'
 */
    const destroyForm = (args: { ticket: string | { uuid: string }, todo: number | { id: number } } | [ticket: string | { uuid: string }, todo: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\TicketController::destroy
 * @see app/Http/Controllers/Admin/TicketController.php:372
 * @route '/admin/tickets/{ticket}/todos/{todo}'
 */
        destroyForm.delete = (args: { ticket: string | { uuid: string }, todo: number | { id: number } } | [ticket: string | { uuid: string }, todo: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const todos = {
    store: Object.assign(store, store),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default todos