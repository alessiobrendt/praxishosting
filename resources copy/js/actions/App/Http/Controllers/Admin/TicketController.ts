import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\TicketController::index
 * @see app/Http/Controllers/Admin/TicketController.php:31
 * @route '/admin/tickets'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/tickets',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\TicketController::index
 * @see app/Http/Controllers/Admin/TicketController.php:31
 * @route '/admin/tickets'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TicketController::index
 * @see app/Http/Controllers/Admin/TicketController.php:31
 * @route '/admin/tickets'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\TicketController::index
 * @see app/Http/Controllers/Admin/TicketController.php:31
 * @route '/admin/tickets'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\TicketController::index
 * @see app/Http/Controllers/Admin/TicketController.php:31
 * @route '/admin/tickets'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\TicketController::index
 * @see app/Http/Controllers/Admin/TicketController.php:31
 * @route '/admin/tickets'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\TicketController::index
 * @see app/Http/Controllers/Admin/TicketController.php:31
 * @route '/admin/tickets'
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
* @see \App\Http\Controllers\Admin\TicketController::show
 * @see app/Http/Controllers/Admin/TicketController.php:69
 * @route '/admin/tickets/{ticket}'
 */
export const show = (args: { ticket: string | { uuid: string } } | [ticket: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/tickets/{ticket}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\TicketController::show
 * @see app/Http/Controllers/Admin/TicketController.php:69
 * @route '/admin/tickets/{ticket}'
 */
show.url = (args: { ticket: string | { uuid: string } } | [ticket: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{ticket}', parsedArgs.ticket.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TicketController::show
 * @see app/Http/Controllers/Admin/TicketController.php:69
 * @route '/admin/tickets/{ticket}'
 */
show.get = (args: { ticket: string | { uuid: string } } | [ticket: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\TicketController::show
 * @see app/Http/Controllers/Admin/TicketController.php:69
 * @route '/admin/tickets/{ticket}'
 */
show.head = (args: { ticket: string | { uuid: string } } | [ticket: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\TicketController::show
 * @see app/Http/Controllers/Admin/TicketController.php:69
 * @route '/admin/tickets/{ticket}'
 */
    const showForm = (args: { ticket: string | { uuid: string } } | [ticket: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\TicketController::show
 * @see app/Http/Controllers/Admin/TicketController.php:69
 * @route '/admin/tickets/{ticket}'
 */
        showForm.get = (args: { ticket: string | { uuid: string } } | [ticket: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\TicketController::show
 * @see app/Http/Controllers/Admin/TicketController.php:69
 * @route '/admin/tickets/{ticket}'
 */
        showForm.head = (args: { ticket: string | { uuid: string } } | [ticket: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\TicketController::update
 * @see app/Http/Controllers/Admin/TicketController.php:274
 * @route '/admin/tickets/{ticket}'
 */
export const update = (args: { ticket: string | { uuid: string } } | [ticket: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/tickets/{ticket}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\TicketController::update
 * @see app/Http/Controllers/Admin/TicketController.php:274
 * @route '/admin/tickets/{ticket}'
 */
update.url = (args: { ticket: string | { uuid: string } } | [ticket: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{ticket}', parsedArgs.ticket.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TicketController::update
 * @see app/Http/Controllers/Admin/TicketController.php:274
 * @route '/admin/tickets/{ticket}'
 */
update.put = (args: { ticket: string | { uuid: string } } | [ticket: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\TicketController::update
 * @see app/Http/Controllers/Admin/TicketController.php:274
 * @route '/admin/tickets/{ticket}'
 */
    const updateForm = (args: { ticket: string | { uuid: string } } | [ticket: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\TicketController::update
 * @see app/Http/Controllers/Admin/TicketController.php:274
 * @route '/admin/tickets/{ticket}'
 */
        updateForm.put = (args: { ticket: string | { uuid: string } } | [ticket: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\TicketController::storeMessage
 * @see app/Http/Controllers/Admin/TicketController.php:300
 * @route '/admin/tickets/{ticket}/messages'
 */
export const storeMessage = (args: { ticket: string | { uuid: string } } | [ticket: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeMessage.url(args, options),
    method: 'post',
})

storeMessage.definition = {
    methods: ["post"],
    url: '/admin/tickets/{ticket}/messages',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\TicketController::storeMessage
 * @see app/Http/Controllers/Admin/TicketController.php:300
 * @route '/admin/tickets/{ticket}/messages'
 */
storeMessage.url = (args: { ticket: string | { uuid: string } } | [ticket: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return storeMessage.definition.url
            .replace('{ticket}', parsedArgs.ticket.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TicketController::storeMessage
 * @see app/Http/Controllers/Admin/TicketController.php:300
 * @route '/admin/tickets/{ticket}/messages'
 */
storeMessage.post = (args: { ticket: string | { uuid: string } } | [ticket: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeMessage.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\TicketController::storeMessage
 * @see app/Http/Controllers/Admin/TicketController.php:300
 * @route '/admin/tickets/{ticket}/messages'
 */
    const storeMessageForm = (args: { ticket: string | { uuid: string } } | [ticket: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeMessage.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\TicketController::storeMessage
 * @see app/Http/Controllers/Admin/TicketController.php:300
 * @route '/admin/tickets/{ticket}/messages'
 */
        storeMessageForm.post = (args: { ticket: string | { uuid: string } } | [ticket: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeMessage.url(args, options),
            method: 'post',
        })
    
    storeMessage.form = storeMessageForm
/**
* @see \App\Http\Controllers\Admin\TicketController::storeTimeLog
 * @see app/Http/Controllers/Admin/TicketController.php:327
 * @route '/admin/tickets/{ticket}/time-logs'
 */
export const storeTimeLog = (args: { ticket: string | { uuid: string } } | [ticket: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeTimeLog.url(args, options),
    method: 'post',
})

storeTimeLog.definition = {
    methods: ["post"],
    url: '/admin/tickets/{ticket}/time-logs',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\TicketController::storeTimeLog
 * @see app/Http/Controllers/Admin/TicketController.php:327
 * @route '/admin/tickets/{ticket}/time-logs'
 */
storeTimeLog.url = (args: { ticket: string | { uuid: string } } | [ticket: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return storeTimeLog.definition.url
            .replace('{ticket}', parsedArgs.ticket.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TicketController::storeTimeLog
 * @see app/Http/Controllers/Admin/TicketController.php:327
 * @route '/admin/tickets/{ticket}/time-logs'
 */
storeTimeLog.post = (args: { ticket: string | { uuid: string } } | [ticket: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeTimeLog.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\TicketController::storeTimeLog
 * @see app/Http/Controllers/Admin/TicketController.php:327
 * @route '/admin/tickets/{ticket}/time-logs'
 */
    const storeTimeLogForm = (args: { ticket: string | { uuid: string } } | [ticket: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeTimeLog.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\TicketController::storeTimeLog
 * @see app/Http/Controllers/Admin/TicketController.php:327
 * @route '/admin/tickets/{ticket}/time-logs'
 */
        storeTimeLogForm.post = (args: { ticket: string | { uuid: string } } | [ticket: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeTimeLog.url(args, options),
            method: 'post',
        })
    
    storeTimeLog.form = storeTimeLogForm
/**
* @see \App\Http\Controllers\Admin\TicketController::storeTodo
 * @see app/Http/Controllers/Admin/TicketController.php:343
 * @route '/admin/tickets/{ticket}/todos'
 */
export const storeTodo = (args: { ticket: string | { uuid: string } } | [ticket: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeTodo.url(args, options),
    method: 'post',
})

storeTodo.definition = {
    methods: ["post"],
    url: '/admin/tickets/{ticket}/todos',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\TicketController::storeTodo
 * @see app/Http/Controllers/Admin/TicketController.php:343
 * @route '/admin/tickets/{ticket}/todos'
 */
storeTodo.url = (args: { ticket: string | { uuid: string } } | [ticket: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return storeTodo.definition.url
            .replace('{ticket}', parsedArgs.ticket.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TicketController::storeTodo
 * @see app/Http/Controllers/Admin/TicketController.php:343
 * @route '/admin/tickets/{ticket}/todos'
 */
storeTodo.post = (args: { ticket: string | { uuid: string } } | [ticket: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeTodo.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\TicketController::storeTodo
 * @see app/Http/Controllers/Admin/TicketController.php:343
 * @route '/admin/tickets/{ticket}/todos'
 */
    const storeTodoForm = (args: { ticket: string | { uuid: string } } | [ticket: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeTodo.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\TicketController::storeTodo
 * @see app/Http/Controllers/Admin/TicketController.php:343
 * @route '/admin/tickets/{ticket}/todos'
 */
        storeTodoForm.post = (args: { ticket: string | { uuid: string } } | [ticket: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeTodo.url(args, options),
            method: 'post',
        })
    
    storeTodo.form = storeTodoForm
/**
* @see \App\Http\Controllers\Admin\TicketController::updateTodo
 * @see app/Http/Controllers/Admin/TicketController.php:358
 * @route '/admin/tickets/{ticket}/todos/{todo}'
 */
export const updateTodo = (args: { ticket: string | { uuid: string }, todo: number | { id: number } } | [ticket: string | { uuid: string }, todo: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateTodo.url(args, options),
    method: 'patch',
})

updateTodo.definition = {
    methods: ["patch"],
    url: '/admin/tickets/{ticket}/todos/{todo}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\TicketController::updateTodo
 * @see app/Http/Controllers/Admin/TicketController.php:358
 * @route '/admin/tickets/{ticket}/todos/{todo}'
 */
updateTodo.url = (args: { ticket: string | { uuid: string }, todo: number | { id: number } } | [ticket: string | { uuid: string }, todo: number | { id: number } ], options?: RouteQueryOptions) => {
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

    return updateTodo.definition.url
            .replace('{ticket}', parsedArgs.ticket.toString())
            .replace('{todo}', parsedArgs.todo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TicketController::updateTodo
 * @see app/Http/Controllers/Admin/TicketController.php:358
 * @route '/admin/tickets/{ticket}/todos/{todo}'
 */
updateTodo.patch = (args: { ticket: string | { uuid: string }, todo: number | { id: number } } | [ticket: string | { uuid: string }, todo: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateTodo.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\TicketController::updateTodo
 * @see app/Http/Controllers/Admin/TicketController.php:358
 * @route '/admin/tickets/{ticket}/todos/{todo}'
 */
    const updateTodoForm = (args: { ticket: string | { uuid: string }, todo: number | { id: number } } | [ticket: string | { uuid: string }, todo: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateTodo.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\TicketController::updateTodo
 * @see app/Http/Controllers/Admin/TicketController.php:358
 * @route '/admin/tickets/{ticket}/todos/{todo}'
 */
        updateTodoForm.patch = (args: { ticket: string | { uuid: string }, todo: number | { id: number } } | [ticket: string | { uuid: string }, todo: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateTodo.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateTodo.form = updateTodoForm
/**
* @see \App\Http\Controllers\Admin\TicketController::destroyTodo
 * @see app/Http/Controllers/Admin/TicketController.php:372
 * @route '/admin/tickets/{ticket}/todos/{todo}'
 */
export const destroyTodo = (args: { ticket: string | { uuid: string }, todo: number | { id: number } } | [ticket: string | { uuid: string }, todo: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyTodo.url(args, options),
    method: 'delete',
})

destroyTodo.definition = {
    methods: ["delete"],
    url: '/admin/tickets/{ticket}/todos/{todo}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\TicketController::destroyTodo
 * @see app/Http/Controllers/Admin/TicketController.php:372
 * @route '/admin/tickets/{ticket}/todos/{todo}'
 */
destroyTodo.url = (args: { ticket: string | { uuid: string }, todo: number | { id: number } } | [ticket: string | { uuid: string }, todo: number | { id: number } ], options?: RouteQueryOptions) => {
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

    return destroyTodo.definition.url
            .replace('{ticket}', parsedArgs.ticket.toString())
            .replace('{todo}', parsedArgs.todo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TicketController::destroyTodo
 * @see app/Http/Controllers/Admin/TicketController.php:372
 * @route '/admin/tickets/{ticket}/todos/{todo}'
 */
destroyTodo.delete = (args: { ticket: string | { uuid: string }, todo: number | { id: number } } | [ticket: string | { uuid: string }, todo: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyTodo.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\TicketController::destroyTodo
 * @see app/Http/Controllers/Admin/TicketController.php:372
 * @route '/admin/tickets/{ticket}/todos/{todo}'
 */
    const destroyTodoForm = (args: { ticket: string | { uuid: string }, todo: number | { id: number } } | [ticket: string | { uuid: string }, todo: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroyTodo.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\TicketController::destroyTodo
 * @see app/Http/Controllers/Admin/TicketController.php:372
 * @route '/admin/tickets/{ticket}/todos/{todo}'
 */
        destroyTodoForm.delete = (args: { ticket: string | { uuid: string }, todo: number | { id: number } } | [ticket: string | { uuid: string }, todo: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroyTodo.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroyTodo.form = destroyTodoForm
/**
* @see \App\Http\Controllers\Admin\TicketController::merge
 * @see app/Http/Controllers/Admin/TicketController.php:385
 * @route '/admin/tickets/{ticket}/merge'
 */
export const merge = (args: { ticket: string | { uuid: string } } | [ticket: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: merge.url(args, options),
    method: 'post',
})

merge.definition = {
    methods: ["post"],
    url: '/admin/tickets/{ticket}/merge',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\TicketController::merge
 * @see app/Http/Controllers/Admin/TicketController.php:385
 * @route '/admin/tickets/{ticket}/merge'
 */
merge.url = (args: { ticket: string | { uuid: string } } | [ticket: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return merge.definition.url
            .replace('{ticket}', parsedArgs.ticket.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TicketController::merge
 * @see app/Http/Controllers/Admin/TicketController.php:385
 * @route '/admin/tickets/{ticket}/merge'
 */
merge.post = (args: { ticket: string | { uuid: string } } | [ticket: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: merge.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\TicketController::merge
 * @see app/Http/Controllers/Admin/TicketController.php:385
 * @route '/admin/tickets/{ticket}/merge'
 */
    const mergeForm = (args: { ticket: string | { uuid: string } } | [ticket: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: merge.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\TicketController::merge
 * @see app/Http/Controllers/Admin/TicketController.php:385
 * @route '/admin/tickets/{ticket}/merge'
 */
        mergeForm.post = (args: { ticket: string | { uuid: string } } | [ticket: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: merge.url(args, options),
            method: 'post',
        })
    
    merge.form = mergeForm
/**
* @see \App\Http\Controllers\Admin\TicketController::downloadAttachment
 * @see app/Http/Controllers/Admin/TicketController.php:261
 * @route '/admin/tickets/{ticket}/attachments/{attachment}'
 */
export const downloadAttachment = (args: { ticket: string | { uuid: string }, attachment: number | { id: number } } | [ticket: string | { uuid: string }, attachment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadAttachment.url(args, options),
    method: 'get',
})

downloadAttachment.definition = {
    methods: ["get","head"],
    url: '/admin/tickets/{ticket}/attachments/{attachment}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\TicketController::downloadAttachment
 * @see app/Http/Controllers/Admin/TicketController.php:261
 * @route '/admin/tickets/{ticket}/attachments/{attachment}'
 */
downloadAttachment.url = (args: { ticket: string | { uuid: string }, attachment: number | { id: number } } | [ticket: string | { uuid: string }, attachment: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    ticket: args[0],
                    attachment: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ticket: typeof args.ticket === 'object'
                ? args.ticket.uuid
                : args.ticket,
                                attachment: typeof args.attachment === 'object'
                ? args.attachment.id
                : args.attachment,
                }

    return downloadAttachment.definition.url
            .replace('{ticket}', parsedArgs.ticket.toString())
            .replace('{attachment}', parsedArgs.attachment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TicketController::downloadAttachment
 * @see app/Http/Controllers/Admin/TicketController.php:261
 * @route '/admin/tickets/{ticket}/attachments/{attachment}'
 */
downloadAttachment.get = (args: { ticket: string | { uuid: string }, attachment: number | { id: number } } | [ticket: string | { uuid: string }, attachment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadAttachment.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\TicketController::downloadAttachment
 * @see app/Http/Controllers/Admin/TicketController.php:261
 * @route '/admin/tickets/{ticket}/attachments/{attachment}'
 */
downloadAttachment.head = (args: { ticket: string | { uuid: string }, attachment: number | { id: number } } | [ticket: string | { uuid: string }, attachment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadAttachment.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\TicketController::downloadAttachment
 * @see app/Http/Controllers/Admin/TicketController.php:261
 * @route '/admin/tickets/{ticket}/attachments/{attachment}'
 */
    const downloadAttachmentForm = (args: { ticket: string | { uuid: string }, attachment: number | { id: number } } | [ticket: string | { uuid: string }, attachment: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: downloadAttachment.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\TicketController::downloadAttachment
 * @see app/Http/Controllers/Admin/TicketController.php:261
 * @route '/admin/tickets/{ticket}/attachments/{attachment}'
 */
        downloadAttachmentForm.get = (args: { ticket: string | { uuid: string }, attachment: number | { id: number } } | [ticket: string | { uuid: string }, attachment: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadAttachment.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\TicketController::downloadAttachment
 * @see app/Http/Controllers/Admin/TicketController.php:261
 * @route '/admin/tickets/{ticket}/attachments/{attachment}'
 */
        downloadAttachmentForm.head = (args: { ticket: string | { uuid: string }, attachment: number | { id: number } } | [ticket: string | { uuid: string }, attachment: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadAttachment.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    downloadAttachment.form = downloadAttachmentForm
const TicketController = { index, show, update, storeMessage, storeTimeLog, storeTodo, updateTodo, destroyTodo, merge, downloadAttachment }

export default TicketController