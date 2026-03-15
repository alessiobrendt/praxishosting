import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\IntegrationController::show
 * @see app/Http/Controllers/Settings/IntegrationController.php:16
 * @route '/settings/integration'
 */
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/settings/integration',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\IntegrationController::show
 * @see app/Http/Controllers/Settings/IntegrationController.php:16
 * @route '/settings/integration'
 */
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\IntegrationController::show
 * @see app/Http/Controllers/Settings/IntegrationController.php:16
 * @route '/settings/integration'
 */
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Settings\IntegrationController::show
 * @see app/Http/Controllers/Settings/IntegrationController.php:16
 * @route '/settings/integration'
 */
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Settings\IntegrationController::show
 * @see app/Http/Controllers/Settings/IntegrationController.php:16
 * @route '/settings/integration'
 */
    const showForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Settings\IntegrationController::show
 * @see app/Http/Controllers/Settings/IntegrationController.php:16
 * @route '/settings/integration'
 */
        showForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Settings\IntegrationController::show
 * @see app/Http/Controllers/Settings/IntegrationController.php:16
 * @route '/settings/integration'
 */
        showForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\Settings\IntegrationController::disconnectDiscord
 * @see app/Http/Controllers/Settings/IntegrationController.php:29
 * @route '/settings/integration/discord'
 */
export const disconnectDiscord = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: disconnectDiscord.url(options),
    method: 'delete',
})

disconnectDiscord.definition = {
    methods: ["delete"],
    url: '/settings/integration/discord',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Settings\IntegrationController::disconnectDiscord
 * @see app/Http/Controllers/Settings/IntegrationController.php:29
 * @route '/settings/integration/discord'
 */
disconnectDiscord.url = (options?: RouteQueryOptions) => {
    return disconnectDiscord.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\IntegrationController::disconnectDiscord
 * @see app/Http/Controllers/Settings/IntegrationController.php:29
 * @route '/settings/integration/discord'
 */
disconnectDiscord.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: disconnectDiscord.url(options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Settings\IntegrationController::disconnectDiscord
 * @see app/Http/Controllers/Settings/IntegrationController.php:29
 * @route '/settings/integration/discord'
 */
    const disconnectDiscordForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: disconnectDiscord.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\IntegrationController::disconnectDiscord
 * @see app/Http/Controllers/Settings/IntegrationController.php:29
 * @route '/settings/integration/discord'
 */
        disconnectDiscordForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: disconnectDiscord.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    disconnectDiscord.form = disconnectDiscordForm
const IntegrationController = { show, disconnectDiscord }

export default IntegrationController