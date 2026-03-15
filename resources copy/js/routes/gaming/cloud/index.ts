import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
import checkoutFb28ab from './checkout'
import subscriptions from './subscriptions'
/**
* @see \App\Http\Controllers\GamingController::index
 * @see app/Http/Controllers/GamingController.php:353
 * @route '/gaming/cloud'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/gaming/cloud',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GamingController::index
 * @see app/Http/Controllers/GamingController.php:353
 * @route '/gaming/cloud'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingController::index
 * @see app/Http/Controllers/GamingController.php:353
 * @route '/gaming/cloud'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GamingController::index
 * @see app/Http/Controllers/GamingController.php:353
 * @route '/gaming/cloud'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\GamingController::index
 * @see app/Http/Controllers/GamingController.php:353
 * @route '/gaming/cloud'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\GamingController::index
 * @see app/Http/Controllers/GamingController.php:353
 * @route '/gaming/cloud'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\GamingController::index
 * @see app/Http/Controllers/GamingController.php:353
 * @route '/gaming/cloud'
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
 * @see app/Http/Controllers/GamingController.php:383
 * @route '/gaming/cloud/checkout/{plan}'
 */
export const checkout = (args: { plan: string | number } | [plan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkout.url(args, options),
    method: 'get',
})

checkout.definition = {
    methods: ["get","head"],
    url: '/gaming/cloud/checkout/{plan}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GamingController::checkout
 * @see app/Http/Controllers/GamingController.php:383
 * @route '/gaming/cloud/checkout/{plan}'
 */
checkout.url = (args: { plan: string | number } | [plan: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { plan: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    plan: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        plan: args.plan,
                }

    return checkout.definition.url
            .replace('{plan}', parsedArgs.plan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingController::checkout
 * @see app/Http/Controllers/GamingController.php:383
 * @route '/gaming/cloud/checkout/{plan}'
 */
checkout.get = (args: { plan: string | number } | [plan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkout.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GamingController::checkout
 * @see app/Http/Controllers/GamingController.php:383
 * @route '/gaming/cloud/checkout/{plan}'
 */
checkout.head = (args: { plan: string | number } | [plan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: checkout.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\GamingController::checkout
 * @see app/Http/Controllers/GamingController.php:383
 * @route '/gaming/cloud/checkout/{plan}'
 */
    const checkoutForm = (args: { plan: string | number } | [plan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: checkout.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\GamingController::checkout
 * @see app/Http/Controllers/GamingController.php:383
 * @route '/gaming/cloud/checkout/{plan}'
 */
        checkoutForm.get = (args: { plan: string | number } | [plan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: checkout.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\GamingController::checkout
 * @see app/Http/Controllers/GamingController.php:383
 * @route '/gaming/cloud/checkout/{plan}'
 */
        checkoutForm.head = (args: { plan: string | number } | [plan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: checkout.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    checkout.form = checkoutForm
const cloud = {
    index: Object.assign(index, index),
checkout: Object.assign(checkout, checkoutFb28ab),
subscriptions: Object.assign(subscriptions, subscriptions),
}

export default cloud