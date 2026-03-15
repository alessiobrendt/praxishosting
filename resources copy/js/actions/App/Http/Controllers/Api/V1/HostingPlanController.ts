import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\HostingPlanController::index
 * @see app/Http/Controllers/Api/V1/HostingPlanController.php:15
 * @route '/api/v1/hosting-plans'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/hosting-plans',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\HostingPlanController::index
 * @see app/Http/Controllers/Api/V1/HostingPlanController.php:15
 * @route '/api/v1/hosting-plans'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\HostingPlanController::index
 * @see app/Http/Controllers/Api/V1/HostingPlanController.php:15
 * @route '/api/v1/hosting-plans'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\HostingPlanController::index
 * @see app/Http/Controllers/Api/V1/HostingPlanController.php:15
 * @route '/api/v1/hosting-plans'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\HostingPlanController::index
 * @see app/Http/Controllers/Api/V1/HostingPlanController.php:15
 * @route '/api/v1/hosting-plans'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\HostingPlanController::index
 * @see app/Http/Controllers/Api/V1/HostingPlanController.php:15
 * @route '/api/v1/hosting-plans'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\HostingPlanController::index
 * @see app/Http/Controllers/Api/V1/HostingPlanController.php:15
 * @route '/api/v1/hosting-plans'
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
const HostingPlanController = { index }

export default HostingPlanController