import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AiTokenController::checkout
 * @see app/Http/Controllers/AiTokenController.php:17
 * @route '/billing/ai-tokens/checkout'
 */
export const checkout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkout.url(options),
    method: 'post',
})

checkout.definition = {
    methods: ["post"],
    url: '/billing/ai-tokens/checkout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AiTokenController::checkout
 * @see app/Http/Controllers/AiTokenController.php:17
 * @route '/billing/ai-tokens/checkout'
 */
checkout.url = (options?: RouteQueryOptions) => {
    return checkout.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AiTokenController::checkout
 * @see app/Http/Controllers/AiTokenController.php:17
 * @route '/billing/ai-tokens/checkout'
 */
checkout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkout.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AiTokenController::checkout
 * @see app/Http/Controllers/AiTokenController.php:17
 * @route '/billing/ai-tokens/checkout'
 */
    const checkoutForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: checkout.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AiTokenController::checkout
 * @see app/Http/Controllers/AiTokenController.php:17
 * @route '/billing/ai-tokens/checkout'
 */
        checkoutForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: checkout.url(options),
            method: 'post',
        })
    
    checkout.form = checkoutForm
const AiTokenController = { checkout }

export default AiTokenController