import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\DiscordWebhookController::interactions
 * @see app/Http/Controllers/DiscordWebhookController.php:15
 * @route '/webhooks/discord/interactions'
 */
export const interactions = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: interactions.url(options),
    method: 'post',
})

interactions.definition = {
    methods: ["post"],
    url: '/webhooks/discord/interactions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DiscordWebhookController::interactions
 * @see app/Http/Controllers/DiscordWebhookController.php:15
 * @route '/webhooks/discord/interactions'
 */
interactions.url = (options?: RouteQueryOptions) => {
    return interactions.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DiscordWebhookController::interactions
 * @see app/Http/Controllers/DiscordWebhookController.php:15
 * @route '/webhooks/discord/interactions'
 */
interactions.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: interactions.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DiscordWebhookController::interactions
 * @see app/Http/Controllers/DiscordWebhookController.php:15
 * @route '/webhooks/discord/interactions'
 */
    const interactionsForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: interactions.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DiscordWebhookController::interactions
 * @see app/Http/Controllers/DiscordWebhookController.php:15
 * @route '/webhooks/discord/interactions'
 */
        interactionsForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: interactions.url(options),
            method: 'post',
        })
    
    interactions.form = interactionsForm
const DiscordWebhookController = { interactions }

export default DiscordWebhookController