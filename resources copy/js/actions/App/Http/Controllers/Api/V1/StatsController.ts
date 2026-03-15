import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\StatsController::__invoke
 * @see app/Http/Controllers/Api/V1/StatsController.php:17
 * @route '/api/v1/stats'
 */
const StatsController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: StatsController.url(options),
    method: 'get',
})

StatsController.definition = {
    methods: ["get","head"],
    url: '/api/v1/stats',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\StatsController::__invoke
 * @see app/Http/Controllers/Api/V1/StatsController.php:17
 * @route '/api/v1/stats'
 */
StatsController.url = (options?: RouteQueryOptions) => {
    return StatsController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\StatsController::__invoke
 * @see app/Http/Controllers/Api/V1/StatsController.php:17
 * @route '/api/v1/stats'
 */
StatsController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: StatsController.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\StatsController::__invoke
 * @see app/Http/Controllers/Api/V1/StatsController.php:17
 * @route '/api/v1/stats'
 */
StatsController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: StatsController.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\StatsController::__invoke
 * @see app/Http/Controllers/Api/V1/StatsController.php:17
 * @route '/api/v1/stats'
 */
    const StatsControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: StatsController.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\StatsController::__invoke
 * @see app/Http/Controllers/Api/V1/StatsController.php:17
 * @route '/api/v1/stats'
 */
        StatsControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: StatsController.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\StatsController::__invoke
 * @see app/Http/Controllers/Api/V1/StatsController.php:17
 * @route '/api/v1/stats'
 */
        StatsControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: StatsController.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    StatsController.form = StatsControllerForm
export default StatsController