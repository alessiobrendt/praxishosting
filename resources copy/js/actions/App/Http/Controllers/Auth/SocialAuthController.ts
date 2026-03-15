import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Auth\SocialAuthController::redirect
 * @see app/Http/Controllers/Auth/SocialAuthController.php:22
 * @route '/auth/{provider}/redirect'
 */
export const redirect = (args: { provider: string | number } | [provider: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: redirect.url(args, options),
    method: 'get',
})

redirect.definition = {
    methods: ["get","head"],
    url: '/auth/{provider}/redirect',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Auth\SocialAuthController::redirect
 * @see app/Http/Controllers/Auth/SocialAuthController.php:22
 * @route '/auth/{provider}/redirect'
 */
redirect.url = (args: { provider: string | number } | [provider: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { provider: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    provider: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        provider: args.provider,
                }

    return redirect.definition.url
            .replace('{provider}', parsedArgs.provider.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\SocialAuthController::redirect
 * @see app/Http/Controllers/Auth/SocialAuthController.php:22
 * @route '/auth/{provider}/redirect'
 */
redirect.get = (args: { provider: string | number } | [provider: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: redirect.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Auth\SocialAuthController::redirect
 * @see app/Http/Controllers/Auth/SocialAuthController.php:22
 * @route '/auth/{provider}/redirect'
 */
redirect.head = (args: { provider: string | number } | [provider: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: redirect.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Auth\SocialAuthController::redirect
 * @see app/Http/Controllers/Auth/SocialAuthController.php:22
 * @route '/auth/{provider}/redirect'
 */
    const redirectForm = (args: { provider: string | number } | [provider: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: redirect.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Auth\SocialAuthController::redirect
 * @see app/Http/Controllers/Auth/SocialAuthController.php:22
 * @route '/auth/{provider}/redirect'
 */
        redirectForm.get = (args: { provider: string | number } | [provider: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: redirect.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Auth\SocialAuthController::redirect
 * @see app/Http/Controllers/Auth/SocialAuthController.php:22
 * @route '/auth/{provider}/redirect'
 */
        redirectForm.head = (args: { provider: string | number } | [provider: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: redirect.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    redirect.form = redirectForm
/**
* @see \App\Http\Controllers\Auth\SocialAuthController::callback
 * @see app/Http/Controllers/Auth/SocialAuthController.php:42
 * @route '/auth/{provider}/callback'
 */
export const callback = (args: { provider: string | number } | [provider: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: callback.url(args, options),
    method: 'get',
})

callback.definition = {
    methods: ["get","head"],
    url: '/auth/{provider}/callback',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Auth\SocialAuthController::callback
 * @see app/Http/Controllers/Auth/SocialAuthController.php:42
 * @route '/auth/{provider}/callback'
 */
callback.url = (args: { provider: string | number } | [provider: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { provider: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    provider: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        provider: args.provider,
                }

    return callback.definition.url
            .replace('{provider}', parsedArgs.provider.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\SocialAuthController::callback
 * @see app/Http/Controllers/Auth/SocialAuthController.php:42
 * @route '/auth/{provider}/callback'
 */
callback.get = (args: { provider: string | number } | [provider: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: callback.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Auth\SocialAuthController::callback
 * @see app/Http/Controllers/Auth/SocialAuthController.php:42
 * @route '/auth/{provider}/callback'
 */
callback.head = (args: { provider: string | number } | [provider: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: callback.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Auth\SocialAuthController::callback
 * @see app/Http/Controllers/Auth/SocialAuthController.php:42
 * @route '/auth/{provider}/callback'
 */
    const callbackForm = (args: { provider: string | number } | [provider: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: callback.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Auth\SocialAuthController::callback
 * @see app/Http/Controllers/Auth/SocialAuthController.php:42
 * @route '/auth/{provider}/callback'
 */
        callbackForm.get = (args: { provider: string | number } | [provider: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: callback.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Auth\SocialAuthController::callback
 * @see app/Http/Controllers/Auth/SocialAuthController.php:42
 * @route '/auth/{provider}/callback'
 */
        callbackForm.head = (args: { provider: string | number } | [provider: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: callback.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    callback.form = callbackForm
/**
* @see \App\Http\Controllers\Auth\SocialAuthController::connectDiscord
 * @see app/Http/Controllers/Auth/SocialAuthController.php:32
 * @route '/auth/discord/connect'
 */
export const connectDiscord = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: connectDiscord.url(options),
    method: 'get',
})

connectDiscord.definition = {
    methods: ["get","head"],
    url: '/auth/discord/connect',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Auth\SocialAuthController::connectDiscord
 * @see app/Http/Controllers/Auth/SocialAuthController.php:32
 * @route '/auth/discord/connect'
 */
connectDiscord.url = (options?: RouteQueryOptions) => {
    return connectDiscord.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\SocialAuthController::connectDiscord
 * @see app/Http/Controllers/Auth/SocialAuthController.php:32
 * @route '/auth/discord/connect'
 */
connectDiscord.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: connectDiscord.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Auth\SocialAuthController::connectDiscord
 * @see app/Http/Controllers/Auth/SocialAuthController.php:32
 * @route '/auth/discord/connect'
 */
connectDiscord.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: connectDiscord.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Auth\SocialAuthController::connectDiscord
 * @see app/Http/Controllers/Auth/SocialAuthController.php:32
 * @route '/auth/discord/connect'
 */
    const connectDiscordForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: connectDiscord.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Auth\SocialAuthController::connectDiscord
 * @see app/Http/Controllers/Auth/SocialAuthController.php:32
 * @route '/auth/discord/connect'
 */
        connectDiscordForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: connectDiscord.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Auth\SocialAuthController::connectDiscord
 * @see app/Http/Controllers/Auth/SocialAuthController.php:32
 * @route '/auth/discord/connect'
 */
        connectDiscordForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: connectDiscord.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    connectDiscord.form = connectDiscordForm
const SocialAuthController = { redirect, callback, connectDiscord }

export default SocialAuthController