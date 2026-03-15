import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\MollieWebhookController::handleWebhook
 * @see app/Http/Controllers/MollieWebhookController.php:39
 * @route '/webhooks/mollie'
 */
export const handleWebhook = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: handleWebhook.url(options),
    method: 'post',
})

handleWebhook.definition = {
    methods: ["post"],
    url: '/webhooks/mollie',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MollieWebhookController::handleWebhook
 * @see app/Http/Controllers/MollieWebhookController.php:39
 * @route '/webhooks/mollie'
 */
handleWebhook.url = (options?: RouteQueryOptions) => {
    return handleWebhook.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MollieWebhookController::handleWebhook
 * @see app/Http/Controllers/MollieWebhookController.php:39
 * @route '/webhooks/mollie'
 */
handleWebhook.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: handleWebhook.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\MollieWebhookController::handleWebhook
 * @see app/Http/Controllers/MollieWebhookController.php:39
 * @route '/webhooks/mollie'
 */
    const handleWebhookForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: handleWebhook.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MollieWebhookController::handleWebhook
 * @see app/Http/Controllers/MollieWebhookController.php:39
 * @route '/webhooks/mollie'
 */
        handleWebhookForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: handleWebhook.url(options),
            method: 'post',
        })
    
    handleWebhook.form = handleWebhookForm
const MollieWebhookController = { handleWebhook }

export default MollieWebhookController