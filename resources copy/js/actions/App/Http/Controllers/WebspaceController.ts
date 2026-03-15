import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\WebspaceController::index
 * @see app/Http/Controllers/WebspaceController.php:22
 * @route '/webspace'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/webspace',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WebspaceController::index
 * @see app/Http/Controllers/WebspaceController.php:22
 * @route '/webspace'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WebspaceController::index
 * @see app/Http/Controllers/WebspaceController.php:22
 * @route '/webspace'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\WebspaceController::index
 * @see app/Http/Controllers/WebspaceController.php:22
 * @route '/webspace'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\WebspaceController::index
 * @see app/Http/Controllers/WebspaceController.php:22
 * @route '/webspace'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\WebspaceController::index
 * @see app/Http/Controllers/WebspaceController.php:22
 * @route '/webspace'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\WebspaceController::index
 * @see app/Http/Controllers/WebspaceController.php:22
 * @route '/webspace'
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
* @see \App\Http\Controllers\WebspaceController::checkout
 * @see app/Http/Controllers/WebspaceController.php:41
 * @route '/webspace/checkout'
 */
export const checkout = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkout.url(options),
    method: 'get',
})

checkout.definition = {
    methods: ["get","head"],
    url: '/webspace/checkout',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WebspaceController::checkout
 * @see app/Http/Controllers/WebspaceController.php:41
 * @route '/webspace/checkout'
 */
checkout.url = (options?: RouteQueryOptions) => {
    return checkout.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WebspaceController::checkout
 * @see app/Http/Controllers/WebspaceController.php:41
 * @route '/webspace/checkout'
 */
checkout.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkout.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\WebspaceController::checkout
 * @see app/Http/Controllers/WebspaceController.php:41
 * @route '/webspace/checkout'
 */
checkout.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: checkout.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\WebspaceController::checkout
 * @see app/Http/Controllers/WebspaceController.php:41
 * @route '/webspace/checkout'
 */
    const checkoutForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: checkout.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\WebspaceController::checkout
 * @see app/Http/Controllers/WebspaceController.php:41
 * @route '/webspace/checkout'
 */
        checkoutForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: checkout.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\WebspaceController::checkout
 * @see app/Http/Controllers/WebspaceController.php:41
 * @route '/webspace/checkout'
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
/**
* @see \App\Http\Controllers\WebspaceController::storeCheckout
 * @see app/Http/Controllers/WebspaceController.php:83
 * @route '/webspace/checkout'
 */
export const storeCheckout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeCheckout.url(options),
    method: 'post',
})

storeCheckout.definition = {
    methods: ["post"],
    url: '/webspace/checkout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WebspaceController::storeCheckout
 * @see app/Http/Controllers/WebspaceController.php:83
 * @route '/webspace/checkout'
 */
storeCheckout.url = (options?: RouteQueryOptions) => {
    return storeCheckout.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WebspaceController::storeCheckout
 * @see app/Http/Controllers/WebspaceController.php:83
 * @route '/webspace/checkout'
 */
storeCheckout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeCheckout.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\WebspaceController::storeCheckout
 * @see app/Http/Controllers/WebspaceController.php:83
 * @route '/webspace/checkout'
 */
    const storeCheckoutForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeCheckout.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\WebspaceController::storeCheckout
 * @see app/Http/Controllers/WebspaceController.php:83
 * @route '/webspace/checkout'
 */
        storeCheckoutForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeCheckout.url(options),
            method: 'post',
        })
    
    storeCheckout.form = storeCheckoutForm
const WebspaceController = { index, checkout, storeCheckout }

export default WebspaceController