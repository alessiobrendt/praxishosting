import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \Laravel\Cashier\Http\Controllers\AftercareWebhookController::handleWebhook
 * @see vendor/mollie/laravel-cashier-mollie/src/Http/Controllers/AftercareWebhookController.php:27
 * @route '/webhooks/mollie/aftercare'
 */
export const handleWebhook = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: handleWebhook.url(options),
    method: 'post',
})

handleWebhook.definition = {
    methods: ["post"],
    url: '/webhooks/mollie/aftercare',
} satisfies RouteDefinition<["post"]>

/**
* @see \Laravel\Cashier\Http\Controllers\AftercareWebhookController::handleWebhook
 * @see vendor/mollie/laravel-cashier-mollie/src/Http/Controllers/AftercareWebhookController.php:27
 * @route '/webhooks/mollie/aftercare'
 */
handleWebhook.url = (options?: RouteQueryOptions) => {
    return handleWebhook.definition.url + queryParams(options)
}

/**
* @see \Laravel\Cashier\Http\Controllers\AftercareWebhookController::handleWebhook
 * @see vendor/mollie/laravel-cashier-mollie/src/Http/Controllers/AftercareWebhookController.php:27
 * @route '/webhooks/mollie/aftercare'
 */
handleWebhook.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: handleWebhook.url(options),
    method: 'post',
})

    /**
* @see \Laravel\Cashier\Http\Controllers\AftercareWebhookController::handleWebhook
 * @see vendor/mollie/laravel-cashier-mollie/src/Http/Controllers/AftercareWebhookController.php:27
 * @route '/webhooks/mollie/aftercare'
 */
    const handleWebhookForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: handleWebhook.url(options),
        method: 'post',
    })

            /**
* @see \Laravel\Cashier\Http\Controllers\AftercareWebhookController::handleWebhook
 * @see vendor/mollie/laravel-cashier-mollie/src/Http/Controllers/AftercareWebhookController.php:27
 * @route '/webhooks/mollie/aftercare'
 */
        handleWebhookForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: handleWebhook.url(options),
            method: 'post',
        })
    
    handleWebhook.form = handleWebhookForm
const AftercareWebhookController = { handleWebhook }

export default AftercareWebhookController