import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import discord from './discord'
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
const integration = {
    show: Object.assign(show, show),
discord: Object.assign(discord, discord),
}

export default integration