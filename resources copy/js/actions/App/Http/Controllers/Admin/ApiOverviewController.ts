import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ApiOverviewController::index
 * @see app/Http/Controllers/Admin/ApiOverviewController.php:11
 * @route '/admin/api'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/api',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ApiOverviewController::index
 * @see app/Http/Controllers/Admin/ApiOverviewController.php:11
 * @route '/admin/api'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ApiOverviewController::index
 * @see app/Http/Controllers/Admin/ApiOverviewController.php:11
 * @route '/admin/api'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ApiOverviewController::index
 * @see app/Http/Controllers/Admin/ApiOverviewController.php:11
 * @route '/admin/api'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\ApiOverviewController::index
 * @see app/Http/Controllers/Admin/ApiOverviewController.php:11
 * @route '/admin/api'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\ApiOverviewController::index
 * @see app/Http/Controllers/Admin/ApiOverviewController.php:11
 * @route '/admin/api'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\ApiOverviewController::index
 * @see app/Http/Controllers/Admin/ApiOverviewController.php:11
 * @route '/admin/api'
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
* @see \App\Http\Controllers\Admin\ApiOverviewController::docs
 * @see app/Http/Controllers/Admin/ApiOverviewController.php:18
 * @route '/admin/api/docs'
 */
export const docs = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: docs.url(options),
    method: 'get',
})

docs.definition = {
    methods: ["get","head"],
    url: '/admin/api/docs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ApiOverviewController::docs
 * @see app/Http/Controllers/Admin/ApiOverviewController.php:18
 * @route '/admin/api/docs'
 */
docs.url = (options?: RouteQueryOptions) => {
    return docs.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ApiOverviewController::docs
 * @see app/Http/Controllers/Admin/ApiOverviewController.php:18
 * @route '/admin/api/docs'
 */
docs.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: docs.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ApiOverviewController::docs
 * @see app/Http/Controllers/Admin/ApiOverviewController.php:18
 * @route '/admin/api/docs'
 */
docs.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: docs.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\ApiOverviewController::docs
 * @see app/Http/Controllers/Admin/ApiOverviewController.php:18
 * @route '/admin/api/docs'
 */
    const docsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: docs.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\ApiOverviewController::docs
 * @see app/Http/Controllers/Admin/ApiOverviewController.php:18
 * @route '/admin/api/docs'
 */
        docsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: docs.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\ApiOverviewController::docs
 * @see app/Http/Controllers/Admin/ApiOverviewController.php:18
 * @route '/admin/api/docs'
 */
        docsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: docs.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    docs.form = docsForm
const ApiOverviewController = { index, docs }

export default ApiOverviewController