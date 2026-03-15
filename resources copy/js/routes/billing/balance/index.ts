import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\BillingController::checkout
 * @see app/Http/Controllers/BillingController.php:167
 * @route '/billing/balance/checkout'
 */
export const checkout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkout.url(options),
    method: 'post',
})

checkout.definition = {
    methods: ["post"],
    url: '/billing/balance/checkout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BillingController::checkout
 * @see app/Http/Controllers/BillingController.php:167
 * @route '/billing/balance/checkout'
 */
checkout.url = (options?: RouteQueryOptions) => {
    return checkout.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BillingController::checkout
 * @see app/Http/Controllers/BillingController.php:167
 * @route '/billing/balance/checkout'
 */
checkout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkout.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\BillingController::checkout
 * @see app/Http/Controllers/BillingController.php:167
 * @route '/billing/balance/checkout'
 */
    const checkoutForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: checkout.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\BillingController::checkout
 * @see app/Http/Controllers/BillingController.php:167
 * @route '/billing/balance/checkout'
 */
        checkoutForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: checkout.url(options),
            method: 'post',
        })
    
    checkout.form = checkoutForm
const balance = {
    checkout: Object.assign(checkout, checkout),
}

export default balance