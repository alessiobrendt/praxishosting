import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\HostingServerController::index
 * @see app/Http/Controllers/Api/V1/HostingServerController.php:15
 * @route '/api/v1/hosting-servers'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/hosting-servers',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\HostingServerController::index
 * @see app/Http/Controllers/Api/V1/HostingServerController.php:15
 * @route '/api/v1/hosting-servers'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\HostingServerController::index
 * @see app/Http/Controllers/Api/V1/HostingServerController.php:15
 * @route '/api/v1/hosting-servers'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\HostingServerController::index
 * @see app/Http/Controllers/Api/V1/HostingServerController.php:15
 * @route '/api/v1/hosting-servers'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\HostingServerController::index
 * @see app/Http/Controllers/Api/V1/HostingServerController.php:15
 * @route '/api/v1/hosting-servers'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\HostingServerController::index
 * @see app/Http/Controllers/Api/V1/HostingServerController.php:15
 * @route '/api/v1/hosting-servers'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\HostingServerController::index
 * @see app/Http/Controllers/Api/V1/HostingServerController.php:15
 * @route '/api/v1/hosting-servers'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\Api\V1\HostingServerController::show
 * @see app/Http/Controllers/Api/V1/HostingServerController.php:34
 * @route '/api/v1/hosting-servers/{hostingServer}'
 */
export const show = (args: { hostingServer: number | { id: number } } | [hostingServer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/hosting-servers/{hostingServer}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\HostingServerController::show
 * @see app/Http/Controllers/Api/V1/HostingServerController.php:34
 * @route '/api/v1/hosting-servers/{hostingServer}'
 */
show.url = (args: { hostingServer: number | { id: number } } | [hostingServer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { hostingServer: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { hostingServer: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    hostingServer: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        hostingServer: typeof args.hostingServer === 'object'
                ? args.hostingServer.id
                : args.hostingServer,
                }

    return show.definition.url
            .replace('{hostingServer}', parsedArgs.hostingServer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\HostingServerController::show
 * @see app/Http/Controllers/Api/V1/HostingServerController.php:34
 * @route '/api/v1/hosting-servers/{hostingServer}'
 */
show.get = (args: { hostingServer: number | { id: number } } | [hostingServer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\HostingServerController::show
 * @see app/Http/Controllers/Api/V1/HostingServerController.php:34
 * @route '/api/v1/hosting-servers/{hostingServer}'
 */
show.head = (args: { hostingServer: number | { id: number } } | [hostingServer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\HostingServerController::show
 * @see app/Http/Controllers/Api/V1/HostingServerController.php:34
 * @route '/api/v1/hosting-servers/{hostingServer}'
 */
    const showForm = (args: { hostingServer: number | { id: number } } | [hostingServer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\HostingServerController::show
 * @see app/Http/Controllers/Api/V1/HostingServerController.php:34
 * @route '/api/v1/hosting-servers/{hostingServer}'
 */
        showForm.get = (args: { hostingServer: number | { id: number } } | [hostingServer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\HostingServerController::show
 * @see app/Http/Controllers/Api/V1/HostingServerController.php:34
 * @route '/api/v1/hosting-servers/{hostingServer}'
 */
        showForm.head = (args: { hostingServer: number | { id: number } } | [hostingServer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const hostingServers = {
    index: Object.assign(index, index),
show: Object.assign(show, show),
}

export default hostingServers