import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\TemplateDesignController::design
 * @see app/Http/Controllers/Admin/TemplateDesignController.php:16
 * @route '/admin/templates/{template}/design'
 */
export const design = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: design.url(args, options),
    method: 'get',
})

design.definition = {
    methods: ["get","head"],
    url: '/admin/templates/{template}/design',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\TemplateDesignController::design
 * @see app/Http/Controllers/Admin/TemplateDesignController.php:16
 * @route '/admin/templates/{template}/design'
 */
design.url = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { template: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { template: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    template: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        template: typeof args.template === 'object'
                ? args.template.id
                : args.template,
                }

    return design.definition.url
            .replace('{template}', parsedArgs.template.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TemplateDesignController::design
 * @see app/Http/Controllers/Admin/TemplateDesignController.php:16
 * @route '/admin/templates/{template}/design'
 */
design.get = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: design.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\TemplateDesignController::design
 * @see app/Http/Controllers/Admin/TemplateDesignController.php:16
 * @route '/admin/templates/{template}/design'
 */
design.head = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: design.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\TemplateDesignController::design
 * @see app/Http/Controllers/Admin/TemplateDesignController.php:16
 * @route '/admin/templates/{template}/design'
 */
    const designForm = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: design.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\TemplateDesignController::design
 * @see app/Http/Controllers/Admin/TemplateDesignController.php:16
 * @route '/admin/templates/{template}/design'
 */
        designForm.get = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: design.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\TemplateDesignController::design
 * @see app/Http/Controllers/Admin/TemplateDesignController.php:16
 * @route '/admin/templates/{template}/design'
 */
        designForm.head = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: design.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    design.form = designForm
/**
* @see \App\Http\Controllers\Admin\TemplateDesignController::update
 * @see app/Http/Controllers/Admin/TemplateDesignController.php:40
 * @route '/admin/templates/{template}/design'
 */
export const update = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/templates/{template}/design',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\TemplateDesignController::update
 * @see app/Http/Controllers/Admin/TemplateDesignController.php:40
 * @route '/admin/templates/{template}/design'
 */
update.url = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { template: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { template: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    template: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        template: typeof args.template === 'object'
                ? args.template.id
                : args.template,
                }

    return update.definition.url
            .replace('{template}', parsedArgs.template.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TemplateDesignController::update
 * @see app/Http/Controllers/Admin/TemplateDesignController.php:40
 * @route '/admin/templates/{template}/design'
 */
update.put = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\TemplateDesignController::update
 * @see app/Http/Controllers/Admin/TemplateDesignController.php:40
 * @route '/admin/templates/{template}/design'
 */
    const updateForm = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\TemplateDesignController::update
 * @see app/Http/Controllers/Admin/TemplateDesignController.php:40
 * @route '/admin/templates/{template}/design'
 */
        updateForm.put = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
const TemplateDesignController = { design, update }

export default TemplateDesignController