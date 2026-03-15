import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\GameserverCloudPlanController::index
 * @see app/Http/Controllers/Api/V1/GameserverCloudPlanController.php:14
 * @route '/api/v1/gameserver-cloud-plans'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/gameserver-cloud-plans',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\GameserverCloudPlanController::index
 * @see app/Http/Controllers/Api/V1/GameserverCloudPlanController.php:14
 * @route '/api/v1/gameserver-cloud-plans'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\GameserverCloudPlanController::index
 * @see app/Http/Controllers/Api/V1/GameserverCloudPlanController.php:14
 * @route '/api/v1/gameserver-cloud-plans'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\GameserverCloudPlanController::index
 * @see app/Http/Controllers/Api/V1/GameserverCloudPlanController.php:14
 * @route '/api/v1/gameserver-cloud-plans'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\GameserverCloudPlanController::index
 * @see app/Http/Controllers/Api/V1/GameserverCloudPlanController.php:14
 * @route '/api/v1/gameserver-cloud-plans'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\GameserverCloudPlanController::index
 * @see app/Http/Controllers/Api/V1/GameserverCloudPlanController.php:14
 * @route '/api/v1/gameserver-cloud-plans'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\GameserverCloudPlanController::index
 * @see app/Http/Controllers/Api/V1/GameserverCloudPlanController.php:14
 * @route '/api/v1/gameserver-cloud-plans'
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
const GameserverCloudPlanController = { index }

export default GameserverCloudPlanController