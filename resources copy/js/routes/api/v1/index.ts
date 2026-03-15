import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
import domains from './domains'
import hostingPlans from './hosting-plans'
import gameserverCloudPlans from './gameserver-cloud-plans'
import hostingServers from './hosting-servers'
import pterodactyl from './pterodactyl'
import brand from './brand'
import partners from './partners'
/**
* @see \App\Http\Controllers\Api\V1\StatsController::__invoke
 * @see app/Http/Controllers/Api/V1/StatsController.php:17
 * @route '/api/v1/stats'
 */
export const stats = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stats.url(options),
    method: 'get',
})

stats.definition = {
    methods: ["get","head"],
    url: '/api/v1/stats',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\StatsController::__invoke
 * @see app/Http/Controllers/Api/V1/StatsController.php:17
 * @route '/api/v1/stats'
 */
stats.url = (options?: RouteQueryOptions) => {
    return stats.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\StatsController::__invoke
 * @see app/Http/Controllers/Api/V1/StatsController.php:17
 * @route '/api/v1/stats'
 */
stats.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stats.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\StatsController::__invoke
 * @see app/Http/Controllers/Api/V1/StatsController.php:17
 * @route '/api/v1/stats'
 */
stats.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: stats.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\StatsController::__invoke
 * @see app/Http/Controllers/Api/V1/StatsController.php:17
 * @route '/api/v1/stats'
 */
    const statsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: stats.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\StatsController::__invoke
 * @see app/Http/Controllers/Api/V1/StatsController.php:17
 * @route '/api/v1/stats'
 */
        statsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stats.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\StatsController::__invoke
 * @see app/Http/Controllers/Api/V1/StatsController.php:17
 * @route '/api/v1/stats'
 */
        statsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stats.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    stats.form = statsForm
const v1 = {
    stats: Object.assign(stats, stats),
domains: Object.assign(domains, domains),
hostingPlans: Object.assign(hostingPlans, hostingPlans),
gameserverCloudPlans: Object.assign(gameserverCloudPlans, gameserverCloudPlans),
hostingServers: Object.assign(hostingServers, hostingServers),
pterodactyl: Object.assign(pterodactyl, pterodactyl),
brand: Object.assign(brand, brand),
partners: Object.assign(partners, partners),
}

export default v1