import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\BillingController::index
 * @see app/Http/Controllers/BillingController.php:23
 * @route '/billing'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/billing',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BillingController::index
 * @see app/Http/Controllers/BillingController.php:23
 * @route '/billing'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BillingController::index
 * @see app/Http/Controllers/BillingController.php:23
 * @route '/billing'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BillingController::index
 * @see app/Http/Controllers/BillingController.php:23
 * @route '/billing'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\BillingController::index
 * @see app/Http/Controllers/BillingController.php:23
 * @route '/billing'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\BillingController::index
 * @see app/Http/Controllers/BillingController.php:23
 * @route '/billing'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\BillingController::index
 * @see app/Http/Controllers/BillingController.php:23
 * @route '/billing'
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
* @see \App\Http\Controllers\BillingController::subscriptions
 * @see app/Http/Controllers/BillingController.php:105
 * @route '/billing/subscriptions'
 */
export const subscriptions = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: subscriptions.url(options),
    method: 'get',
})

subscriptions.definition = {
    methods: ["get","head"],
    url: '/billing/subscriptions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BillingController::subscriptions
 * @see app/Http/Controllers/BillingController.php:105
 * @route '/billing/subscriptions'
 */
subscriptions.url = (options?: RouteQueryOptions) => {
    return subscriptions.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BillingController::subscriptions
 * @see app/Http/Controllers/BillingController.php:105
 * @route '/billing/subscriptions'
 */
subscriptions.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: subscriptions.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BillingController::subscriptions
 * @see app/Http/Controllers/BillingController.php:105
 * @route '/billing/subscriptions'
 */
subscriptions.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: subscriptions.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\BillingController::subscriptions
 * @see app/Http/Controllers/BillingController.php:105
 * @route '/billing/subscriptions'
 */
    const subscriptionsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: subscriptions.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\BillingController::subscriptions
 * @see app/Http/Controllers/BillingController.php:105
 * @route '/billing/subscriptions'
 */
        subscriptionsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: subscriptions.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\BillingController::subscriptions
 * @see app/Http/Controllers/BillingController.php:105
 * @route '/billing/subscriptions'
 */
        subscriptionsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: subscriptions.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    subscriptions.form = subscriptionsForm
/**
* @see \App\Http\Controllers\BillingController::balanceCheckout
 * @see app/Http/Controllers/BillingController.php:167
 * @route '/billing/balance/checkout'
 */
export const balanceCheckout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: balanceCheckout.url(options),
    method: 'post',
})

balanceCheckout.definition = {
    methods: ["post"],
    url: '/billing/balance/checkout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BillingController::balanceCheckout
 * @see app/Http/Controllers/BillingController.php:167
 * @route '/billing/balance/checkout'
 */
balanceCheckout.url = (options?: RouteQueryOptions) => {
    return balanceCheckout.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BillingController::balanceCheckout
 * @see app/Http/Controllers/BillingController.php:167
 * @route '/billing/balance/checkout'
 */
balanceCheckout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: balanceCheckout.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\BillingController::balanceCheckout
 * @see app/Http/Controllers/BillingController.php:167
 * @route '/billing/balance/checkout'
 */
    const balanceCheckoutForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: balanceCheckout.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\BillingController::balanceCheckout
 * @see app/Http/Controllers/BillingController.php:167
 * @route '/billing/balance/checkout'
 */
        balanceCheckoutForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: balanceCheckout.url(options),
            method: 'post',
        })
    
    balanceCheckout.form = balanceCheckoutForm
const BillingController = { index, subscriptions, balanceCheckout }

export default BillingController