import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\PterodactylController::nests
 * @see app/Http/Controllers/Api/V1/PterodactylController.php:16
 * @route '/api/v1/pterodactyl/nests'
 */
export const nests = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: nests.url(options),
    method: 'get',
})

nests.definition = {
    methods: ["get","head"],
    url: '/api/v1/pterodactyl/nests',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\PterodactylController::nests
 * @see app/Http/Controllers/Api/V1/PterodactylController.php:16
 * @route '/api/v1/pterodactyl/nests'
 */
nests.url = (options?: RouteQueryOptions) => {
    return nests.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\PterodactylController::nests
 * @see app/Http/Controllers/Api/V1/PterodactylController.php:16
 * @route '/api/v1/pterodactyl/nests'
 */
nests.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: nests.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\PterodactylController::nests
 * @see app/Http/Controllers/Api/V1/PterodactylController.php:16
 * @route '/api/v1/pterodactyl/nests'
 */
nests.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: nests.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\PterodactylController::nests
 * @see app/Http/Controllers/Api/V1/PterodactylController.php:16
 * @route '/api/v1/pterodactyl/nests'
 */
    const nestsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: nests.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\PterodactylController::nests
 * @see app/Http/Controllers/Api/V1/PterodactylController.php:16
 * @route '/api/v1/pterodactyl/nests'
 */
        nestsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: nests.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\PterodactylController::nests
 * @see app/Http/Controllers/Api/V1/PterodactylController.php:16
 * @route '/api/v1/pterodactyl/nests'
 */
        nestsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: nests.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    nests.form = nestsForm
/**
* @see \App\Http\Controllers\Api\V1\PterodactylController::eggs
 * @see app/Http/Controllers/Api/V1/PterodactylController.php:63
 * @route '/api/v1/pterodactyl/eggs'
 */
export const eggs = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: eggs.url(options),
    method: 'get',
})

eggs.definition = {
    methods: ["get","head"],
    url: '/api/v1/pterodactyl/eggs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\PterodactylController::eggs
 * @see app/Http/Controllers/Api/V1/PterodactylController.php:63
 * @route '/api/v1/pterodactyl/eggs'
 */
eggs.url = (options?: RouteQueryOptions) => {
    return eggs.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\PterodactylController::eggs
 * @see app/Http/Controllers/Api/V1/PterodactylController.php:63
 * @route '/api/v1/pterodactyl/eggs'
 */
eggs.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: eggs.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\PterodactylController::eggs
 * @see app/Http/Controllers/Api/V1/PterodactylController.php:63
 * @route '/api/v1/pterodactyl/eggs'
 */
eggs.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: eggs.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\PterodactylController::eggs
 * @see app/Http/Controllers/Api/V1/PterodactylController.php:63
 * @route '/api/v1/pterodactyl/eggs'
 */
    const eggsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: eggs.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\PterodactylController::eggs
 * @see app/Http/Controllers/Api/V1/PterodactylController.php:63
 * @route '/api/v1/pterodactyl/eggs'
 */
        eggsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: eggs.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\PterodactylController::eggs
 * @see app/Http/Controllers/Api/V1/PterodactylController.php:63
 * @route '/api/v1/pterodactyl/eggs'
 */
        eggsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: eggs.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    eggs.form = eggsForm
const pterodactyl = {
    nests: Object.assign(nests, nests),
eggs: Object.assign(eggs, eggs),
}

export default pterodactyl