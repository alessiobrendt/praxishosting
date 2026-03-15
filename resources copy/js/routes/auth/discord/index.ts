import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Auth\SocialAuthController::connect
 * @see app/Http/Controllers/Auth/SocialAuthController.php:32
 * @route '/auth/discord/connect'
 */
export const connect = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: connect.url(options),
    method: 'get',
})

connect.definition = {
    methods: ["get","head"],
    url: '/auth/discord/connect',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Auth\SocialAuthController::connect
 * @see app/Http/Controllers/Auth/SocialAuthController.php:32
 * @route '/auth/discord/connect'
 */
connect.url = (options?: RouteQueryOptions) => {
    return connect.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\SocialAuthController::connect
 * @see app/Http/Controllers/Auth/SocialAuthController.php:32
 * @route '/auth/discord/connect'
 */
connect.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: connect.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Auth\SocialAuthController::connect
 * @see app/Http/Controllers/Auth/SocialAuthController.php:32
 * @route '/auth/discord/connect'
 */
connect.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: connect.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Auth\SocialAuthController::connect
 * @see app/Http/Controllers/Auth/SocialAuthController.php:32
 * @route '/auth/discord/connect'
 */
    const connectForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: connect.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Auth\SocialAuthController::connect
 * @see app/Http/Controllers/Auth/SocialAuthController.php:32
 * @route '/auth/discord/connect'
 */
        connectForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: connect.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Auth\SocialAuthController::connect
 * @see app/Http/Controllers/Auth/SocialAuthController.php:32
 * @route '/auth/discord/connect'
 */
        connectForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: connect.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    connect.form = connectForm
const discord = {
    connect: Object.assign(connect, connect),
}

export default discord