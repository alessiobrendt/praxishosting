import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\TemplatePageDataController::edit
 * @see app/Http/Controllers/Admin/TemplatePageDataController.php:16
 * @route '/admin/templates/{template}/pages/{page}/data'
 */
export const edit = (args: { template: number | { id: number }, page: number | { id: number } } | [template: number | { id: number }, page: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/templates/{template}/pages/{page}/data',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\TemplatePageDataController::edit
 * @see app/Http/Controllers/Admin/TemplatePageDataController.php:16
 * @route '/admin/templates/{template}/pages/{page}/data'
 */
edit.url = (args: { template: number | { id: number }, page: number | { id: number } } | [template: number | { id: number }, page: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    template: args[0],
                    page: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        template: typeof args.template === 'object'
                ? args.template.id
                : args.template,
                                page: typeof args.page === 'object'
                ? args.page.id
                : args.page,
                }

    return edit.definition.url
            .replace('{template}', parsedArgs.template.toString())
            .replace('{page}', parsedArgs.page.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TemplatePageDataController::edit
 * @see app/Http/Controllers/Admin/TemplatePageDataController.php:16
 * @route '/admin/templates/{template}/pages/{page}/data'
 */
edit.get = (args: { template: number | { id: number }, page: number | { id: number } } | [template: number | { id: number }, page: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\TemplatePageDataController::edit
 * @see app/Http/Controllers/Admin/TemplatePageDataController.php:16
 * @route '/admin/templates/{template}/pages/{page}/data'
 */
edit.head = (args: { template: number | { id: number }, page: number | { id: number } } | [template: number | { id: number }, page: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\TemplatePageDataController::edit
 * @see app/Http/Controllers/Admin/TemplatePageDataController.php:16
 * @route '/admin/templates/{template}/pages/{page}/data'
 */
    const editForm = (args: { template: number | { id: number }, page: number | { id: number } } | [template: number | { id: number }, page: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\TemplatePageDataController::edit
 * @see app/Http/Controllers/Admin/TemplatePageDataController.php:16
 * @route '/admin/templates/{template}/pages/{page}/data'
 */
        editForm.get = (args: { template: number | { id: number }, page: number | { id: number } } | [template: number | { id: number }, page: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\TemplatePageDataController::edit
 * @see app/Http/Controllers/Admin/TemplatePageDataController.php:16
 * @route '/admin/templates/{template}/pages/{page}/data'
 */
        editForm.head = (args: { template: number | { id: number }, page: number | { id: number } } | [template: number | { id: number }, page: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\TemplatePageDataController::update
 * @see app/Http/Controllers/Admin/TemplatePageDataController.php:26
 * @route '/admin/templates/{template}/pages/{page}/data'
 */
export const update = (args: { template: number | { id: number }, page: number | { id: number } } | [template: number | { id: number }, page: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/templates/{template}/pages/{page}/data',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\TemplatePageDataController::update
 * @see app/Http/Controllers/Admin/TemplatePageDataController.php:26
 * @route '/admin/templates/{template}/pages/{page}/data'
 */
update.url = (args: { template: number | { id: number }, page: number | { id: number } } | [template: number | { id: number }, page: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    template: args[0],
                    page: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        template: typeof args.template === 'object'
                ? args.template.id
                : args.template,
                                page: typeof args.page === 'object'
                ? args.page.id
                : args.page,
                }

    return update.definition.url
            .replace('{template}', parsedArgs.template.toString())
            .replace('{page}', parsedArgs.page.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TemplatePageDataController::update
 * @see app/Http/Controllers/Admin/TemplatePageDataController.php:26
 * @route '/admin/templates/{template}/pages/{page}/data'
 */
update.put = (args: { template: number | { id: number }, page: number | { id: number } } | [template: number | { id: number }, page: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\TemplatePageDataController::update
 * @see app/Http/Controllers/Admin/TemplatePageDataController.php:26
 * @route '/admin/templates/{template}/pages/{page}/data'
 */
    const updateForm = (args: { template: number | { id: number }, page: number | { id: number } } | [template: number | { id: number }, page: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\TemplatePageDataController::update
 * @see app/Http/Controllers/Admin/TemplatePageDataController.php:26
 * @route '/admin/templates/{template}/pages/{page}/data'
 */
        updateForm.put = (args: { template: number | { id: number }, page: number | { id: number } } | [template: number | { id: number }, page: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
const TemplatePageDataController = { edit, update }

export default TemplatePageDataController