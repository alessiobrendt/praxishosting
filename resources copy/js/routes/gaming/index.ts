import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import checkoutFb28ab from './checkout'
import cloud from './cloud'
/**
* @see \App\Http\Controllers\GamingController::index
 * @see app/Http/Controllers/GamingController.php:62
 * @route '/gaming'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/gaming',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GamingController::index
 * @see app/Http/Controllers/GamingController.php:62
 * @route '/gaming'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingController::index
 * @see app/Http/Controllers/GamingController.php:62
 * @route '/gaming'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GamingController::index
 * @see app/Http/Controllers/GamingController.php:62
 * @route '/gaming'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\GamingController::index
 * @see app/Http/Controllers/GamingController.php:62
 * @route '/gaming'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\GamingController::index
 * @see app/Http/Controllers/GamingController.php:62
 * @route '/gaming'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\GamingController::index
 * @see app/Http/Controllers/GamingController.php:62
 * @route '/gaming'
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
* @see \App\Http\Controllers\GamingController::checkout
 * @see app/Http/Controllers/GamingController.php:88
 * @route '/gaming/checkout'
 */
export const checkout = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkout.url(options),
    method: 'get',
})

checkout.definition = {
    methods: ["get","head"],
    url: '/gaming/checkout',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GamingController::checkout
 * @see app/Http/Controllers/GamingController.php:88
 * @route '/gaming/checkout'
 */
checkout.url = (options?: RouteQueryOptions) => {
    return checkout.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingController::checkout
 * @see app/Http/Controllers/GamingController.php:88
 * @route '/gaming/checkout'
 */
checkout.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkout.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GamingController::checkout
 * @see app/Http/Controllers/GamingController.php:88
 * @route '/gaming/checkout'
 */
checkout.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: checkout.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\GamingController::checkout
 * @see app/Http/Controllers/GamingController.php:88
 * @route '/gaming/checkout'
 */
    const checkoutForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: checkout.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\GamingController::checkout
 * @see app/Http/Controllers/GamingController.php:88
 * @route '/gaming/checkout'
 */
        checkoutForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: checkout.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\GamingController::checkout
 * @see app/Http/Controllers/GamingController.php:88
 * @route '/gaming/checkout'
 */
        checkoutForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: checkout.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    checkout.form = checkoutForm
const gaming = {
    index: Object.assign(index, index),
checkout: Object.assign(checkout, checkoutFb28ab),
cloud: Object.assign(cloud, cloud),
}

export default gaming