import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
import status from './status'
import dunningLetters from './dunning-letters'
/**
* @see \App\Http\Controllers\Admin\InvoiceController::index
 * @see app/Http/Controllers/Admin/InvoiceController.php:28
 * @route '/admin/invoices'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/invoices',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\InvoiceController::index
 * @see app/Http/Controllers/Admin/InvoiceController.php:28
 * @route '/admin/invoices'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\InvoiceController::index
 * @see app/Http/Controllers/Admin/InvoiceController.php:28
 * @route '/admin/invoices'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\InvoiceController::index
 * @see app/Http/Controllers/Admin/InvoiceController.php:28
 * @route '/admin/invoices'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\InvoiceController::index
 * @see app/Http/Controllers/Admin/InvoiceController.php:28
 * @route '/admin/invoices'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\InvoiceController::index
 * @see app/Http/Controllers/Admin/InvoiceController.php:28
 * @route '/admin/invoices'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\InvoiceController::index
 * @see app/Http/Controllers/Admin/InvoiceController.php:28
 * @route '/admin/invoices'
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
* @see \App\Http\Controllers\Admin\InvoiceController::exportMethod
 * @see app/Http/Controllers/Admin/InvoiceController.php:292
 * @route '/admin/invoices/export'
 */
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/admin/invoices/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\InvoiceController::exportMethod
 * @see app/Http/Controllers/Admin/InvoiceController.php:292
 * @route '/admin/invoices/export'
 */
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\InvoiceController::exportMethod
 * @see app/Http/Controllers/Admin/InvoiceController.php:292
 * @route '/admin/invoices/export'
 */
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\InvoiceController::exportMethod
 * @see app/Http/Controllers/Admin/InvoiceController.php:292
 * @route '/admin/invoices/export'
 */
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\InvoiceController::exportMethod
 * @see app/Http/Controllers/Admin/InvoiceController.php:292
 * @route '/admin/invoices/export'
 */
    const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportMethod.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\InvoiceController::exportMethod
 * @see app/Http/Controllers/Admin/InvoiceController.php:292
 * @route '/admin/invoices/export'
 */
        exportMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\InvoiceController::exportMethod
 * @see app/Http/Controllers/Admin/InvoiceController.php:292
 * @route '/admin/invoices/export'
 */
        exportMethodForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportMethod.form = exportMethodForm
/**
* @see \App\Http\Controllers\Admin\InvoiceController::create
 * @see app/Http/Controllers/Admin/InvoiceController.php:49
 * @route '/admin/invoices/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/invoices/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\InvoiceController::create
 * @see app/Http/Controllers/Admin/InvoiceController.php:49
 * @route '/admin/invoices/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\InvoiceController::create
 * @see app/Http/Controllers/Admin/InvoiceController.php:49
 * @route '/admin/invoices/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\InvoiceController::create
 * @see app/Http/Controllers/Admin/InvoiceController.php:49
 * @route '/admin/invoices/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\InvoiceController::create
 * @see app/Http/Controllers/Admin/InvoiceController.php:49
 * @route '/admin/invoices/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\InvoiceController::create
 * @see app/Http/Controllers/Admin/InvoiceController.php:49
 * @route '/admin/invoices/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\InvoiceController::create
 * @see app/Http/Controllers/Admin/InvoiceController.php:49
 * @route '/admin/invoices/create'
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
* @see \App\Http\Controllers\Admin\InvoiceController::store
 * @see app/Http/Controllers/Admin/InvoiceController.php:61
 * @route '/admin/invoices'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/invoices',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\InvoiceController::store
 * @see app/Http/Controllers/Admin/InvoiceController.php:61
 * @route '/admin/invoices'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\InvoiceController::store
 * @see app/Http/Controllers/Admin/InvoiceController.php:61
 * @route '/admin/invoices'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\InvoiceController::store
 * @see app/Http/Controllers/Admin/InvoiceController.php:61
 * @route '/admin/invoices'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\InvoiceController::store
 * @see app/Http/Controllers/Admin/InvoiceController.php:61
 * @route '/admin/invoices'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\InvoiceController::show
 * @see app/Http/Controllers/Admin/InvoiceController.php:116
 * @route '/admin/invoices/{invoice}'
 */
export const show = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/invoices/{invoice}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\InvoiceController::show
 * @see app/Http/Controllers/Admin/InvoiceController.php:116
 * @route '/admin/invoices/{invoice}'
 */
show.url = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { invoice: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { invoice: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    invoice: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        invoice: typeof args.invoice === 'object'
                ? args.invoice.uuid
                : args.invoice,
                }

    return show.definition.url
            .replace('{invoice}', parsedArgs.invoice.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\InvoiceController::show
 * @see app/Http/Controllers/Admin/InvoiceController.php:116
 * @route '/admin/invoices/{invoice}'
 */
show.get = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\InvoiceController::show
 * @see app/Http/Controllers/Admin/InvoiceController.php:116
 * @route '/admin/invoices/{invoice}'
 */
show.head = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\InvoiceController::show
 * @see app/Http/Controllers/Admin/InvoiceController.php:116
 * @route '/admin/invoices/{invoice}'
 */
    const showForm = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\InvoiceController::show
 * @see app/Http/Controllers/Admin/InvoiceController.php:116
 * @route '/admin/invoices/{invoice}'
 */
        showForm.get = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\InvoiceController::show
 * @see app/Http/Controllers/Admin/InvoiceController.php:116
 * @route '/admin/invoices/{invoice}'
 */
        showForm.head = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\InvoiceController::edit
 * @see app/Http/Controllers/Admin/InvoiceController.php:169
 * @route '/admin/invoices/{invoice}/edit'
 */
export const edit = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/invoices/{invoice}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\InvoiceController::edit
 * @see app/Http/Controllers/Admin/InvoiceController.php:169
 * @route '/admin/invoices/{invoice}/edit'
 */
edit.url = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { invoice: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { invoice: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    invoice: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        invoice: typeof args.invoice === 'object'
                ? args.invoice.uuid
                : args.invoice,
                }

    return edit.definition.url
            .replace('{invoice}', parsedArgs.invoice.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\InvoiceController::edit
 * @see app/Http/Controllers/Admin/InvoiceController.php:169
 * @route '/admin/invoices/{invoice}/edit'
 */
edit.get = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\InvoiceController::edit
 * @see app/Http/Controllers/Admin/InvoiceController.php:169
 * @route '/admin/invoices/{invoice}/edit'
 */
edit.head = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\InvoiceController::edit
 * @see app/Http/Controllers/Admin/InvoiceController.php:169
 * @route '/admin/invoices/{invoice}/edit'
 */
    const editForm = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\InvoiceController::edit
 * @see app/Http/Controllers/Admin/InvoiceController.php:169
 * @route '/admin/invoices/{invoice}/edit'
 */
        editForm.get = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\InvoiceController::edit
 * @see app/Http/Controllers/Admin/InvoiceController.php:169
 * @route '/admin/invoices/{invoice}/edit'
 */
        editForm.head = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\InvoiceController::update
 * @see app/Http/Controllers/Admin/InvoiceController.php:190
 * @route '/admin/invoices/{invoice}'
 */
export const update = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/invoices/{invoice}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\InvoiceController::update
 * @see app/Http/Controllers/Admin/InvoiceController.php:190
 * @route '/admin/invoices/{invoice}'
 */
update.url = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { invoice: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { invoice: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    invoice: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        invoice: typeof args.invoice === 'object'
                ? args.invoice.uuid
                : args.invoice,
                }

    return update.definition.url
            .replace('{invoice}', parsedArgs.invoice.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\InvoiceController::update
 * @see app/Http/Controllers/Admin/InvoiceController.php:190
 * @route '/admin/invoices/{invoice}'
 */
update.put = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\InvoiceController::update
 * @see app/Http/Controllers/Admin/InvoiceController.php:190
 * @route '/admin/invoices/{invoice}'
 */
    const updateForm = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\InvoiceController::update
 * @see app/Http/Controllers/Admin/InvoiceController.php:190
 * @route '/admin/invoices/{invoice}'
 */
        updateForm.put = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
const invoices = {
    index: Object.assign(index, index),
export: Object.assign(exportMethod, exportMethod),
create: Object.assign(create, create),
store: Object.assign(store, store),
show: Object.assign(show, show),
status: Object.assign(status, status),
dunningLetters: Object.assign(dunningLetters, dunningLetters),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
}

export default invoices