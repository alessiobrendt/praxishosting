import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import checkoutFb28ab from './checkout'
/**
* @see \App\Http\Controllers\TeamSpeakController::index
 * @see app/Http/Controllers/TeamSpeakController.php:58
 * @route '/teamspeak'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/teamspeak',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TeamSpeakController::index
 * @see app/Http/Controllers/TeamSpeakController.php:58
 * @route '/teamspeak'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TeamSpeakController::index
 * @see app/Http/Controllers/TeamSpeakController.php:58
 * @route '/teamspeak'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TeamSpeakController::index
 * @see app/Http/Controllers/TeamSpeakController.php:58
 * @route '/teamspeak'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TeamSpeakController::index
 * @see app/Http/Controllers/TeamSpeakController.php:58
 * @route '/teamspeak'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TeamSpeakController::index
 * @see app/Http/Controllers/TeamSpeakController.php:58
 * @route '/teamspeak'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TeamSpeakController::index
 * @see app/Http/Controllers/TeamSpeakController.php:58
 * @route '/teamspeak'
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
* @see \App\Http\Controllers\TeamSpeakController::checkout
 * @see app/Http/Controllers/TeamSpeakController.php:84
 * @route '/teamspeak/checkout'
 */
export const checkout = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkout.url(options),
    method: 'get',
})

checkout.definition = {
    methods: ["get","head"],
    url: '/teamspeak/checkout',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TeamSpeakController::checkout
 * @see app/Http/Controllers/TeamSpeakController.php:84
 * @route '/teamspeak/checkout'
 */
checkout.url = (options?: RouteQueryOptions) => {
    return checkout.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TeamSpeakController::checkout
 * @see app/Http/Controllers/TeamSpeakController.php:84
 * @route '/teamspeak/checkout'
 */
checkout.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkout.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TeamSpeakController::checkout
 * @see app/Http/Controllers/TeamSpeakController.php:84
 * @route '/teamspeak/checkout'
 */
checkout.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: checkout.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TeamSpeakController::checkout
 * @see app/Http/Controllers/TeamSpeakController.php:84
 * @route '/teamspeak/checkout'
 */
    const checkoutForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: checkout.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TeamSpeakController::checkout
 * @see app/Http/Controllers/TeamSpeakController.php:84
 * @route '/teamspeak/checkout'
 */
        checkoutForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: checkout.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TeamSpeakController::checkout
 * @see app/Http/Controllers/TeamSpeakController.php:84
 * @route '/teamspeak/checkout'
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
const teamspeak = {
    index: Object.assign(index, index),
checkout: Object.assign(checkout, checkoutFb28ab),
}

export default teamspeak