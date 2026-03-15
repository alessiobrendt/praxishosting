import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\DiscountCodeController::index
 * @see app/Http/Controllers/Admin/DiscountCodeController.php:17
 * @route '/admin/discount-codes'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/discount-codes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\DiscountCodeController::index
 * @see app/Http/Controllers/Admin/DiscountCodeController.php:17
 * @route '/admin/discount-codes'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DiscountCodeController::index
 * @see app/Http/Controllers/Admin/DiscountCodeController.php:17
 * @route '/admin/discount-codes'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\DiscountCodeController::index
 * @see app/Http/Controllers/Admin/DiscountCodeController.php:17
 * @route '/admin/discount-codes'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\DiscountCodeController::index
 * @see app/Http/Controllers/Admin/DiscountCodeController.php:17
 * @route '/admin/discount-codes'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\DiscountCodeController::index
 * @see app/Http/Controllers/Admin/DiscountCodeController.php:17
 * @route '/admin/discount-codes'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\DiscountCodeController::index
 * @see app/Http/Controllers/Admin/DiscountCodeController.php:17
 * @route '/admin/discount-codes'
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
* @see \App\Http\Controllers\Admin\DiscountCodeController::create
 * @see app/Http/Controllers/Admin/DiscountCodeController.php:29
 * @route '/admin/discount-codes/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/discount-codes/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\DiscountCodeController::create
 * @see app/Http/Controllers/Admin/DiscountCodeController.php:29
 * @route '/admin/discount-codes/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DiscountCodeController::create
 * @see app/Http/Controllers/Admin/DiscountCodeController.php:29
 * @route '/admin/discount-codes/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\DiscountCodeController::create
 * @see app/Http/Controllers/Admin/DiscountCodeController.php:29
 * @route '/admin/discount-codes/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\DiscountCodeController::create
 * @see app/Http/Controllers/Admin/DiscountCodeController.php:29
 * @route '/admin/discount-codes/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\DiscountCodeController::create
 * @see app/Http/Controllers/Admin/DiscountCodeController.php:29
 * @route '/admin/discount-codes/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\DiscountCodeController::create
 * @see app/Http/Controllers/Admin/DiscountCodeController.php:29
 * @route '/admin/discount-codes/create'
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
* @see \App\Http\Controllers\Admin\DiscountCodeController::store
 * @see app/Http/Controllers/Admin/DiscountCodeController.php:34
 * @route '/admin/discount-codes'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/discount-codes',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\DiscountCodeController::store
 * @see app/Http/Controllers/Admin/DiscountCodeController.php:34
 * @route '/admin/discount-codes'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DiscountCodeController::store
 * @see app/Http/Controllers/Admin/DiscountCodeController.php:34
 * @route '/admin/discount-codes'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\DiscountCodeController::store
 * @see app/Http/Controllers/Admin/DiscountCodeController.php:34
 * @route '/admin/discount-codes'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\DiscountCodeController::store
 * @see app/Http/Controllers/Admin/DiscountCodeController.php:34
 * @route '/admin/discount-codes'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\DiscountCodeController::edit
 * @see app/Http/Controllers/Admin/DiscountCodeController.php:49
 * @route '/admin/discount-codes/{discount_code}/edit'
 */
export const edit = (args: { discount_code: string | number } | [discount_code: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/discount-codes/{discount_code}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\DiscountCodeController::edit
 * @see app/Http/Controllers/Admin/DiscountCodeController.php:49
 * @route '/admin/discount-codes/{discount_code}/edit'
 */
edit.url = (args: { discount_code: string | number } | [discount_code: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { discount_code: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    discount_code: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        discount_code: args.discount_code,
                }

    return edit.definition.url
            .replace('{discount_code}', parsedArgs.discount_code.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DiscountCodeController::edit
 * @see app/Http/Controllers/Admin/DiscountCodeController.php:49
 * @route '/admin/discount-codes/{discount_code}/edit'
 */
edit.get = (args: { discount_code: string | number } | [discount_code: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\DiscountCodeController::edit
 * @see app/Http/Controllers/Admin/DiscountCodeController.php:49
 * @route '/admin/discount-codes/{discount_code}/edit'
 */
edit.head = (args: { discount_code: string | number } | [discount_code: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\DiscountCodeController::edit
 * @see app/Http/Controllers/Admin/DiscountCodeController.php:49
 * @route '/admin/discount-codes/{discount_code}/edit'
 */
    const editForm = (args: { discount_code: string | number } | [discount_code: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\DiscountCodeController::edit
 * @see app/Http/Controllers/Admin/DiscountCodeController.php:49
 * @route '/admin/discount-codes/{discount_code}/edit'
 */
        editForm.get = (args: { discount_code: string | number } | [discount_code: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\DiscountCodeController::edit
 * @see app/Http/Controllers/Admin/DiscountCodeController.php:49
 * @route '/admin/discount-codes/{discount_code}/edit'
 */
        editForm.head = (args: { discount_code: string | number } | [discount_code: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\DiscountCodeController::update
 * @see app/Http/Controllers/Admin/DiscountCodeController.php:56
 * @route '/admin/discount-codes/{discount_code}'
 */
export const update = (args: { discount_code: string | number } | [discount_code: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin/discount-codes/{discount_code}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\DiscountCodeController::update
 * @see app/Http/Controllers/Admin/DiscountCodeController.php:56
 * @route '/admin/discount-codes/{discount_code}'
 */
update.url = (args: { discount_code: string | number } | [discount_code: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { discount_code: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    discount_code: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        discount_code: args.discount_code,
                }

    return update.definition.url
            .replace('{discount_code}', parsedArgs.discount_code.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DiscountCodeController::update
 * @see app/Http/Controllers/Admin/DiscountCodeController.php:56
 * @route '/admin/discount-codes/{discount_code}'
 */
update.put = (args: { discount_code: string | number } | [discount_code: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Admin\DiscountCodeController::update
 * @see app/Http/Controllers/Admin/DiscountCodeController.php:56
 * @route '/admin/discount-codes/{discount_code}'
 */
update.patch = (args: { discount_code: string | number } | [discount_code: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\DiscountCodeController::update
 * @see app/Http/Controllers/Admin/DiscountCodeController.php:56
 * @route '/admin/discount-codes/{discount_code}'
 */
    const updateForm = (args: { discount_code: string | number } | [discount_code: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\DiscountCodeController::update
 * @see app/Http/Controllers/Admin/DiscountCodeController.php:56
 * @route '/admin/discount-codes/{discount_code}'
 */
        updateForm.put = (args: { discount_code: string | number } | [discount_code: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Admin\DiscountCodeController::update
 * @see app/Http/Controllers/Admin/DiscountCodeController.php:56
 * @route '/admin/discount-codes/{discount_code}'
 */
        updateForm.patch = (args: { discount_code: string | number } | [discount_code: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\DiscountCodeController::destroy
 * @see app/Http/Controllers/Admin/DiscountCodeController.php:72
 * @route '/admin/discount-codes/{discount_code}'
 */
export const destroy = (args: { discount_code: string | number } | [discount_code: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/discount-codes/{discount_code}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\DiscountCodeController::destroy
 * @see app/Http/Controllers/Admin/DiscountCodeController.php:72
 * @route '/admin/discount-codes/{discount_code}'
 */
destroy.url = (args: { discount_code: string | number } | [discount_code: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { discount_code: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    discount_code: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        discount_code: args.discount_code,
                }

    return destroy.definition.url
            .replace('{discount_code}', parsedArgs.discount_code.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DiscountCodeController::destroy
 * @see app/Http/Controllers/Admin/DiscountCodeController.php:72
 * @route '/admin/discount-codes/{discount_code}'
 */
destroy.delete = (args: { discount_code: string | number } | [discount_code: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\DiscountCodeController::destroy
 * @see app/Http/Controllers/Admin/DiscountCodeController.php:72
 * @route '/admin/discount-codes/{discount_code}'
 */
    const destroyForm = (args: { discount_code: string | number } | [discount_code: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\DiscountCodeController::destroy
 * @see app/Http/Controllers/Admin/DiscountCodeController.php:72
 * @route '/admin/discount-codes/{discount_code}'
 */
        destroyForm.delete = (args: { discount_code: string | number } | [discount_code: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const discountCodes = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default discountCodes