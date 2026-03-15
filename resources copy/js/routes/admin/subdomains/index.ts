import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\SubdomainsController::index
 * @see app/Http/Controllers/Admin/SubdomainsController.php:15
 * @route '/admin/subdomains'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/subdomains',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\SubdomainsController::index
 * @see app/Http/Controllers/Admin/SubdomainsController.php:15
 * @route '/admin/subdomains'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SubdomainsController::index
 * @see app/Http/Controllers/Admin/SubdomainsController.php:15
 * @route '/admin/subdomains'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\SubdomainsController::index
 * @see app/Http/Controllers/Admin/SubdomainsController.php:15
 * @route '/admin/subdomains'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\SubdomainsController::index
 * @see app/Http/Controllers/Admin/SubdomainsController.php:15
 * @route '/admin/subdomains'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\SubdomainsController::index
 * @see app/Http/Controllers/Admin/SubdomainsController.php:15
 * @route '/admin/subdomains'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\SubdomainsController::index
 * @see app/Http/Controllers/Admin/SubdomainsController.php:15
 * @route '/admin/subdomains'
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
* @see \App\Http\Controllers\Admin\SubdomainsController::destroy
 * @see app/Http/Controllers/Admin/SubdomainsController.php:55
 * @route '/admin/subdomains/{recordId}'
 */
export const destroy = (args: { recordId: string | number } | [recordId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/subdomains/{recordId}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\SubdomainsController::destroy
 * @see app/Http/Controllers/Admin/SubdomainsController.php:55
 * @route '/admin/subdomains/{recordId}'
 */
destroy.url = (args: { recordId: string | number } | [recordId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { recordId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    recordId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        recordId: args.recordId,
                }

    return destroy.definition.url
            .replace('{recordId}', parsedArgs.recordId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SubdomainsController::destroy
 * @see app/Http/Controllers/Admin/SubdomainsController.php:55
 * @route '/admin/subdomains/{recordId}'
 */
destroy.delete = (args: { recordId: string | number } | [recordId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\SubdomainsController::destroy
 * @see app/Http/Controllers/Admin/SubdomainsController.php:55
 * @route '/admin/subdomains/{recordId}'
 */
    const destroyForm = (args: { recordId: string | number } | [recordId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\SubdomainsController::destroy
 * @see app/Http/Controllers/Admin/SubdomainsController.php:55
 * @route '/admin/subdomains/{recordId}'
 */
        destroyForm.delete = (args: { recordId: string | number } | [recordId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const subdomains = {
    index: Object.assign(index, index),
destroy: Object.assign(destroy, destroy),
}

export default subdomains