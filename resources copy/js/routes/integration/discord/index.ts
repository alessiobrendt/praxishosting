import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\IntegrationController::disconnect
 * @see app/Http/Controllers/Settings/IntegrationController.php:29
 * @route '/settings/integration/discord'
 */
export const disconnect = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: disconnect.url(options),
    method: 'delete',
})

disconnect.definition = {
    methods: ["delete"],
    url: '/settings/integration/discord',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Settings\IntegrationController::disconnect
 * @see app/Http/Controllers/Settings/IntegrationController.php:29
 * @route '/settings/integration/discord'
 */
disconnect.url = (options?: RouteQueryOptions) => {
    return disconnect.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\IntegrationController::disconnect
 * @see app/Http/Controllers/Settings/IntegrationController.php:29
 * @route '/settings/integration/discord'
 */
disconnect.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: disconnect.url(options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Settings\IntegrationController::disconnect
 * @see app/Http/Controllers/Settings/IntegrationController.php:29
 * @route '/settings/integration/discord'
 */
    const disconnectForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: disconnect.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\IntegrationController::disconnect
 * @see app/Http/Controllers/Settings/IntegrationController.php:29
 * @route '/settings/integration/discord'
 */
        disconnectForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: disconnect.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    disconnect.form = disconnectForm
const discord = {
    disconnect: Object.assign(disconnect, disconnect),
}

export default discord