import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\BrandController::index
 * @see app/Http/Controllers/Admin/BrandController.php:14
 * @route '/admin/brands'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/brands',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\BrandController::index
 * @see app/Http/Controllers/Admin/BrandController.php:14
 * @route '/admin/brands'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BrandController::index
 * @see app/Http/Controllers/Admin/BrandController.php:14
 * @route '/admin/brands'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\BrandController::index
 * @see app/Http/Controllers/Admin/BrandController.php:14
 * @route '/admin/brands'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\BrandController::index
 * @see app/Http/Controllers/Admin/BrandController.php:14
 * @route '/admin/brands'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\BrandController::index
 * @see app/Http/Controllers/Admin/BrandController.php:14
 * @route '/admin/brands'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\BrandController::index
 * @see app/Http/Controllers/Admin/BrandController.php:14
 * @route '/admin/brands'
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
* @see \App\Http\Controllers\Admin\BrandController::edit
 * @see app/Http/Controllers/Admin/BrandController.php:19
 * @route '/admin/brands/{brand}/edit'
 */
export const edit = (args: { brand: number | { id: number } } | [brand: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/brands/{brand}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\BrandController::edit
 * @see app/Http/Controllers/Admin/BrandController.php:19
 * @route '/admin/brands/{brand}/edit'
 */
edit.url = (args: { brand: number | { id: number } } | [brand: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { brand: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { brand: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    brand: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        brand: typeof args.brand === 'object'
                ? args.brand.id
                : args.brand,
                }

    return edit.definition.url
            .replace('{brand}', parsedArgs.brand.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BrandController::edit
 * @see app/Http/Controllers/Admin/BrandController.php:19
 * @route '/admin/brands/{brand}/edit'
 */
edit.get = (args: { brand: number | { id: number } } | [brand: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\BrandController::edit
 * @see app/Http/Controllers/Admin/BrandController.php:19
 * @route '/admin/brands/{brand}/edit'
 */
edit.head = (args: { brand: number | { id: number } } | [brand: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\BrandController::edit
 * @see app/Http/Controllers/Admin/BrandController.php:19
 * @route '/admin/brands/{brand}/edit'
 */
    const editForm = (args: { brand: number | { id: number } } | [brand: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\BrandController::edit
 * @see app/Http/Controllers/Admin/BrandController.php:19
 * @route '/admin/brands/{brand}/edit'
 */
        editForm.get = (args: { brand: number | { id: number } } | [brand: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\BrandController::edit
 * @see app/Http/Controllers/Admin/BrandController.php:19
 * @route '/admin/brands/{brand}/edit'
 */
        editForm.head = (args: { brand: number | { id: number } } | [brand: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\BrandController::update
 * @see app/Http/Controllers/Admin/BrandController.php:26
 * @route '/admin/brands/{brand}'
 */
export const update = (args: { brand: number | { id: number } } | [brand: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/brands/{brand}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\BrandController::update
 * @see app/Http/Controllers/Admin/BrandController.php:26
 * @route '/admin/brands/{brand}'
 */
update.url = (args: { brand: number | { id: number } } | [brand: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { brand: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { brand: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    brand: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        brand: typeof args.brand === 'object'
                ? args.brand.id
                : args.brand,
                }

    return update.definition.url
            .replace('{brand}', parsedArgs.brand.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BrandController::update
 * @see app/Http/Controllers/Admin/BrandController.php:26
 * @route '/admin/brands/{brand}'
 */
update.put = (args: { brand: number | { id: number } } | [brand: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\BrandController::update
 * @see app/Http/Controllers/Admin/BrandController.php:26
 * @route '/admin/brands/{brand}'
 */
    const updateForm = (args: { brand: number | { id: number } } | [brand: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\BrandController::update
 * @see app/Http/Controllers/Admin/BrandController.php:26
 * @route '/admin/brands/{brand}'
 */
        updateForm.put = (args: { brand: number | { id: number } } | [brand: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
const brands = {
    index: Object.assign(index, index),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
}

export default brands