import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\DomainController::tlds
 * @see app/Http/Controllers/Api/V1/DomainController.php:29
 * @route '/api/v1/domains/tlds'
 */
export const tlds = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: tlds.url(options),
    method: 'get',
})

tlds.definition = {
    methods: ["get","head"],
    url: '/api/v1/domains/tlds',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\DomainController::tlds
 * @see app/Http/Controllers/Api/V1/DomainController.php:29
 * @route '/api/v1/domains/tlds'
 */
tlds.url = (options?: RouteQueryOptions) => {
    return tlds.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\DomainController::tlds
 * @see app/Http/Controllers/Api/V1/DomainController.php:29
 * @route '/api/v1/domains/tlds'
 */
tlds.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: tlds.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\DomainController::tlds
 * @see app/Http/Controllers/Api/V1/DomainController.php:29
 * @route '/api/v1/domains/tlds'
 */
tlds.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: tlds.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\DomainController::tlds
 * @see app/Http/Controllers/Api/V1/DomainController.php:29
 * @route '/api/v1/domains/tlds'
 */
    const tldsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: tlds.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\DomainController::tlds
 * @see app/Http/Controllers/Api/V1/DomainController.php:29
 * @route '/api/v1/domains/tlds'
 */
        tldsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: tlds.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\DomainController::tlds
 * @see app/Http/Controllers/Api/V1/DomainController.php:29
 * @route '/api/v1/domains/tlds'
 */
        tldsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: tlds.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    tlds.form = tldsForm
/**
* @see \App\Http\Controllers\Api\V1\DomainController::checkAvailability
 * @see app/Http/Controllers/Api/V1/DomainController.php:80
 * @route '/api/v1/domains/check-availability'
 */
export const checkAvailability = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkAvailability.url(options),
    method: 'post',
})

checkAvailability.definition = {
    methods: ["post"],
    url: '/api/v1/domains/check-availability',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\DomainController::checkAvailability
 * @see app/Http/Controllers/Api/V1/DomainController.php:80
 * @route '/api/v1/domains/check-availability'
 */
checkAvailability.url = (options?: RouteQueryOptions) => {
    return checkAvailability.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\DomainController::checkAvailability
 * @see app/Http/Controllers/Api/V1/DomainController.php:80
 * @route '/api/v1/domains/check-availability'
 */
checkAvailability.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkAvailability.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\DomainController::checkAvailability
 * @see app/Http/Controllers/Api/V1/DomainController.php:80
 * @route '/api/v1/domains/check-availability'
 */
    const checkAvailabilityForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: checkAvailability.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\DomainController::checkAvailability
 * @see app/Http/Controllers/Api/V1/DomainController.php:80
 * @route '/api/v1/domains/check-availability'
 */
        checkAvailabilityForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: checkAvailability.url(options),
            method: 'post',
        })
    
    checkAvailability.form = checkAvailabilityForm
const DomainController = { tlds, checkAvailability }

export default DomainController