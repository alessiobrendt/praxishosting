import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\CustomerController::index
 * @see app/Http/Controllers/Admin/CustomerController.php:85
 * @route '/admin/customers'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/customers',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\CustomerController::index
 * @see app/Http/Controllers/Admin/CustomerController.php:85
 * @route '/admin/customers'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CustomerController::index
 * @see app/Http/Controllers/Admin/CustomerController.php:85
 * @route '/admin/customers'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\CustomerController::index
 * @see app/Http/Controllers/Admin/CustomerController.php:85
 * @route '/admin/customers'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\CustomerController::index
 * @see app/Http/Controllers/Admin/CustomerController.php:85
 * @route '/admin/customers'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\CustomerController::index
 * @see app/Http/Controllers/Admin/CustomerController.php:85
 * @route '/admin/customers'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\CustomerController::index
 * @see app/Http/Controllers/Admin/CustomerController.php:85
 * @route '/admin/customers'
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
* @see \App\Http\Controllers\Admin\CustomerController::show
 * @see app/Http/Controllers/Admin/CustomerController.php:99
 * @route '/admin/customers/{customer}'
 */
export const show = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/customers/{customer}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\CustomerController::show
 * @see app/Http/Controllers/Admin/CustomerController.php:99
 * @route '/admin/customers/{customer}'
 */
show.url = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { customer: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { customer: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    customer: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        customer: typeof args.customer === 'object'
                ? args.customer.id
                : args.customer,
                }

    return show.definition.url
            .replace('{customer}', parsedArgs.customer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CustomerController::show
 * @see app/Http/Controllers/Admin/CustomerController.php:99
 * @route '/admin/customers/{customer}'
 */
show.get = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\CustomerController::show
 * @see app/Http/Controllers/Admin/CustomerController.php:99
 * @route '/admin/customers/{customer}'
 */
show.head = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\CustomerController::show
 * @see app/Http/Controllers/Admin/CustomerController.php:99
 * @route '/admin/customers/{customer}'
 */
    const showForm = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\CustomerController::show
 * @see app/Http/Controllers/Admin/CustomerController.php:99
 * @route '/admin/customers/{customer}'
 */
        showForm.get = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\CustomerController::show
 * @see app/Http/Controllers/Admin/CustomerController.php:99
 * @route '/admin/customers/{customer}'
 */
        showForm.head = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\CustomerController::edit
 * @see app/Http/Controllers/Admin/CustomerController.php:27
 * @route '/admin/customers/{customer}/edit'
 */
export const edit = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/customers/{customer}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\CustomerController::edit
 * @see app/Http/Controllers/Admin/CustomerController.php:27
 * @route '/admin/customers/{customer}/edit'
 */
edit.url = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { customer: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { customer: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    customer: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        customer: typeof args.customer === 'object'
                ? args.customer.id
                : args.customer,
                }

    return edit.definition.url
            .replace('{customer}', parsedArgs.customer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CustomerController::edit
 * @see app/Http/Controllers/Admin/CustomerController.php:27
 * @route '/admin/customers/{customer}/edit'
 */
edit.get = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\CustomerController::edit
 * @see app/Http/Controllers/Admin/CustomerController.php:27
 * @route '/admin/customers/{customer}/edit'
 */
edit.head = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\CustomerController::edit
 * @see app/Http/Controllers/Admin/CustomerController.php:27
 * @route '/admin/customers/{customer}/edit'
 */
    const editForm = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\CustomerController::edit
 * @see app/Http/Controllers/Admin/CustomerController.php:27
 * @route '/admin/customers/{customer}/edit'
 */
        editForm.get = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\CustomerController::edit
 * @see app/Http/Controllers/Admin/CustomerController.php:27
 * @route '/admin/customers/{customer}/edit'
 */
        editForm.head = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\CustomerController::update
 * @see app/Http/Controllers/Admin/CustomerController.php:45
 * @route '/admin/customers/{customer}'
 */
export const update = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/customers/{customer}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\CustomerController::update
 * @see app/Http/Controllers/Admin/CustomerController.php:45
 * @route '/admin/customers/{customer}'
 */
update.url = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { customer: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { customer: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    customer: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        customer: typeof args.customer === 'object'
                ? args.customer.id
                : args.customer,
                }

    return update.definition.url
            .replace('{customer}', parsedArgs.customer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CustomerController::update
 * @see app/Http/Controllers/Admin/CustomerController.php:45
 * @route '/admin/customers/{customer}'
 */
update.put = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\CustomerController::update
 * @see app/Http/Controllers/Admin/CustomerController.php:45
 * @route '/admin/customers/{customer}'
 */
    const updateForm = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\CustomerController::update
 * @see app/Http/Controllers/Admin/CustomerController.php:45
 * @route '/admin/customers/{customer}'
 */
        updateForm.put = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\CustomerController::storeNote
 * @see app/Http/Controllers/Admin/CustomerController.php:72
 * @route '/admin/customers/{customer}/notes'
 */
export const storeNote = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeNote.url(args, options),
    method: 'post',
})

storeNote.definition = {
    methods: ["post"],
    url: '/admin/customers/{customer}/notes',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\CustomerController::storeNote
 * @see app/Http/Controllers/Admin/CustomerController.php:72
 * @route '/admin/customers/{customer}/notes'
 */
storeNote.url = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { customer: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { customer: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    customer: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        customer: typeof args.customer === 'object'
                ? args.customer.id
                : args.customer,
                }

    return storeNote.definition.url
            .replace('{customer}', parsedArgs.customer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CustomerController::storeNote
 * @see app/Http/Controllers/Admin/CustomerController.php:72
 * @route '/admin/customers/{customer}/notes'
 */
storeNote.post = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeNote.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\CustomerController::storeNote
 * @see app/Http/Controllers/Admin/CustomerController.php:72
 * @route '/admin/customers/{customer}/notes'
 */
    const storeNoteForm = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeNote.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\CustomerController::storeNote
 * @see app/Http/Controllers/Admin/CustomerController.php:72
 * @route '/admin/customers/{customer}/notes'
 */
        storeNoteForm.post = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeNote.url(args, options),
            method: 'post',
        })
    
    storeNote.form = storeNoteForm
/**
* @see \App\Http\Controllers\Admin\CustomerController::storeBalance
 * @see app/Http/Controllers/Admin/CustomerController.php:200
 * @route '/admin/customers/{customer}/balance'
 */
export const storeBalance = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeBalance.url(args, options),
    method: 'post',
})

storeBalance.definition = {
    methods: ["post"],
    url: '/admin/customers/{customer}/balance',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\CustomerController::storeBalance
 * @see app/Http/Controllers/Admin/CustomerController.php:200
 * @route '/admin/customers/{customer}/balance'
 */
storeBalance.url = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { customer: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { customer: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    customer: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        customer: typeof args.customer === 'object'
                ? args.customer.id
                : args.customer,
                }

    return storeBalance.definition.url
            .replace('{customer}', parsedArgs.customer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CustomerController::storeBalance
 * @see app/Http/Controllers/Admin/CustomerController.php:200
 * @route '/admin/customers/{customer}/balance'
 */
storeBalance.post = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeBalance.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\CustomerController::storeBalance
 * @see app/Http/Controllers/Admin/CustomerController.php:200
 * @route '/admin/customers/{customer}/balance'
 */
    const storeBalanceForm = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeBalance.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\CustomerController::storeBalance
 * @see app/Http/Controllers/Admin/CustomerController.php:200
 * @route '/admin/customers/{customer}/balance'
 */
        storeBalanceForm.post = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeBalance.url(args, options),
            method: 'post',
        })
    
    storeBalance.form = storeBalanceForm
/**
* @see \App\Http\Controllers\Admin\CustomerController::storeAiTokens
 * @see app/Http/Controllers/Admin/CustomerController.php:225
 * @route '/admin/customers/{customer}/ai-tokens'
 */
export const storeAiTokens = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeAiTokens.url(args, options),
    method: 'post',
})

storeAiTokens.definition = {
    methods: ["post"],
    url: '/admin/customers/{customer}/ai-tokens',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\CustomerController::storeAiTokens
 * @see app/Http/Controllers/Admin/CustomerController.php:225
 * @route '/admin/customers/{customer}/ai-tokens'
 */
storeAiTokens.url = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { customer: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { customer: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    customer: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        customer: typeof args.customer === 'object'
                ? args.customer.id
                : args.customer,
                }

    return storeAiTokens.definition.url
            .replace('{customer}', parsedArgs.customer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CustomerController::storeAiTokens
 * @see app/Http/Controllers/Admin/CustomerController.php:225
 * @route '/admin/customers/{customer}/ai-tokens'
 */
storeAiTokens.post = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeAiTokens.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\CustomerController::storeAiTokens
 * @see app/Http/Controllers/Admin/CustomerController.php:225
 * @route '/admin/customers/{customer}/ai-tokens'
 */
    const storeAiTokensForm = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeAiTokens.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\CustomerController::storeAiTokens
 * @see app/Http/Controllers/Admin/CustomerController.php:225
 * @route '/admin/customers/{customer}/ai-tokens'
 */
        storeAiTokensForm.post = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeAiTokens.url(args, options),
            method: 'post',
        })
    
    storeAiTokens.form = storeAiTokensForm
const CustomerController = { index, show, edit, update, storeNote, storeBalance, storeAiTokens }

export default CustomerController