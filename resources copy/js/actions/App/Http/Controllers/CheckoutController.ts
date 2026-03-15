import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\CheckoutController::store
 * @see app/Http/Controllers/CheckoutController.php:140
 * @route '/checkout'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/checkout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CheckoutController::store
 * @see app/Http/Controllers/CheckoutController.php:140
 * @route '/checkout'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CheckoutController::store
 * @see app/Http/Controllers/CheckoutController.php:140
 * @route '/checkout'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CheckoutController::store
 * @see app/Http/Controllers/CheckoutController.php:140
 * @route '/checkout'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CheckoutController::store
 * @see app/Http/Controllers/CheckoutController.php:140
 * @route '/checkout'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\CheckoutController::redirect
 * @see app/Http/Controllers/CheckoutController.php:41
 * @route '/checkout/redirect'
 */
export const redirect = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: redirect.url(options),
    method: 'get',
})

redirect.definition = {
    methods: ["get","head"],
    url: '/checkout/redirect',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CheckoutController::redirect
 * @see app/Http/Controllers/CheckoutController.php:41
 * @route '/checkout/redirect'
 */
redirect.url = (options?: RouteQueryOptions) => {
    return redirect.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CheckoutController::redirect
 * @see app/Http/Controllers/CheckoutController.php:41
 * @route '/checkout/redirect'
 */
redirect.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: redirect.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CheckoutController::redirect
 * @see app/Http/Controllers/CheckoutController.php:41
 * @route '/checkout/redirect'
 */
redirect.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: redirect.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CheckoutController::redirect
 * @see app/Http/Controllers/CheckoutController.php:41
 * @route '/checkout/redirect'
 */
    const redirectForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: redirect.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CheckoutController::redirect
 * @see app/Http/Controllers/CheckoutController.php:41
 * @route '/checkout/redirect'
 */
        redirectForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: redirect.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CheckoutController::redirect
 * @see app/Http/Controllers/CheckoutController.php:41
 * @route '/checkout/redirect'
 */
        redirectForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: redirect.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    redirect.form = redirectForm
/**
* @see \App\Http\Controllers\CheckoutController::redirectToStripe
 * @see app/Http/Controllers/CheckoutController.php:160
 * @route '/checkout/redirect-to-mollie'
 */
export const redirectToStripe = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: redirectToStripe.url(options),
    method: 'get',
})

redirectToStripe.definition = {
    methods: ["get","head"],
    url: '/checkout/redirect-to-mollie',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CheckoutController::redirectToStripe
 * @see app/Http/Controllers/CheckoutController.php:160
 * @route '/checkout/redirect-to-mollie'
 */
redirectToStripe.url = (options?: RouteQueryOptions) => {
    return redirectToStripe.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CheckoutController::redirectToStripe
 * @see app/Http/Controllers/CheckoutController.php:160
 * @route '/checkout/redirect-to-mollie'
 */
redirectToStripe.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: redirectToStripe.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CheckoutController::redirectToStripe
 * @see app/Http/Controllers/CheckoutController.php:160
 * @route '/checkout/redirect-to-mollie'
 */
redirectToStripe.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: redirectToStripe.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CheckoutController::redirectToStripe
 * @see app/Http/Controllers/CheckoutController.php:160
 * @route '/checkout/redirect-to-mollie'
 */
    const redirectToStripeForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: redirectToStripe.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CheckoutController::redirectToStripe
 * @see app/Http/Controllers/CheckoutController.php:160
 * @route '/checkout/redirect-to-mollie'
 */
        redirectToStripeForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: redirectToStripe.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CheckoutController::redirectToStripe
 * @see app/Http/Controllers/CheckoutController.php:160
 * @route '/checkout/redirect-to-mollie'
 */
        redirectToStripeForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: redirectToStripe.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    redirectToStripe.form = redirectToStripeForm
/**
* @see \App\Http\Controllers\CheckoutController::success
 * @see app/Http/Controllers/CheckoutController.php:178
 * @route '/checkout/success'
 */
export const success = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: success.url(options),
    method: 'get',
})

success.definition = {
    methods: ["get","head"],
    url: '/checkout/success',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CheckoutController::success
 * @see app/Http/Controllers/CheckoutController.php:178
 * @route '/checkout/success'
 */
success.url = (options?: RouteQueryOptions) => {
    return success.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CheckoutController::success
 * @see app/Http/Controllers/CheckoutController.php:178
 * @route '/checkout/success'
 */
success.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: success.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CheckoutController::success
 * @see app/Http/Controllers/CheckoutController.php:178
 * @route '/checkout/success'
 */
success.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: success.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CheckoutController::success
 * @see app/Http/Controllers/CheckoutController.php:178
 * @route '/checkout/success'
 */
    const successForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: success.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CheckoutController::success
 * @see app/Http/Controllers/CheckoutController.php:178
 * @route '/checkout/success'
 */
        successForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: success.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CheckoutController::success
 * @see app/Http/Controllers/CheckoutController.php:178
 * @route '/checkout/success'
 */
        successForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: success.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    success.form = successForm
const CheckoutController = { store, redirect, redirectToStripe, success }

export default CheckoutController