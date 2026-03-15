import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \Laravel\Cashier\Http\Controllers\FirstPaymentWebhookController::handleWebhook
 * @see vendor/mollie/laravel-cashier-mollie/src/Http/Controllers/FirstPaymentWebhookController.php:21
 * @route '/webhooks/mollie/first-payment'
 */
export const handleWebhook = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: handleWebhook.url(options),
    method: 'post',
})

handleWebhook.definition = {
    methods: ["post"],
    url: '/webhooks/mollie/first-payment',
} satisfies RouteDefinition<["post"]>

/**
* @see \Laravel\Cashier\Http\Controllers\FirstPaymentWebhookController::handleWebhook
 * @see vendor/mollie/laravel-cashier-mollie/src/Http/Controllers/FirstPaymentWebhookController.php:21
 * @route '/webhooks/mollie/first-payment'
 */
handleWebhook.url = (options?: RouteQueryOptions) => {
    return handleWebhook.definition.url + queryParams(options)
}

/**
* @see \Laravel\Cashier\Http\Controllers\FirstPaymentWebhookController::handleWebhook
 * @see vendor/mollie/laravel-cashier-mollie/src/Http/Controllers/FirstPaymentWebhookController.php:21
 * @route '/webhooks/mollie/first-payment'
 */
handleWebhook.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: handleWebhook.url(options),
    method: 'post',
})

    /**
* @see \Laravel\Cashier\Http\Controllers\FirstPaymentWebhookController::handleWebhook
 * @see vendor/mollie/laravel-cashier-mollie/src/Http/Controllers/FirstPaymentWebhookController.php:21
 * @route '/webhooks/mollie/first-payment'
 */
    const handleWebhookForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: handleWebhook.url(options),
        method: 'post',
    })

            /**
* @see \Laravel\Cashier\Http\Controllers\FirstPaymentWebhookController::handleWebhook
 * @see vendor/mollie/laravel-cashier-mollie/src/Http/Controllers/FirstPaymentWebhookController.php:21
 * @route '/webhooks/mollie/first-payment'
 */
        handleWebhookForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: handleWebhook.url(options),
            method: 'post',
        })
    
    handleWebhook.form = handleWebhookForm
const FirstPaymentWebhookController = { handleWebhook }

export default FirstPaymentWebhookController