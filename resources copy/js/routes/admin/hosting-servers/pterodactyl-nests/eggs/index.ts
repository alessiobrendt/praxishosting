import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
import config from './config'
/**
* @see \App\Http\Controllers\Admin\PterodactylEggController::index
 * @see app/Http/Controllers/Admin/PterodactylEggController.php:75
 * @route '/admin/hosting-servers/{hostingServer}/pterodactyl-nests/{nest}/eggs'
 */
export const index = (args: { hostingServer: number | { id: number }, nest: string | number } | [hostingServer: number | { id: number }, nest: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/hosting-servers/{hostingServer}/pterodactyl-nests/{nest}/eggs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PterodactylEggController::index
 * @see app/Http/Controllers/Admin/PterodactylEggController.php:75
 * @route '/admin/hosting-servers/{hostingServer}/pterodactyl-nests/{nest}/eggs'
 */
index.url = (args: { hostingServer: number | { id: number }, nest: string | number } | [hostingServer: number | { id: number }, nest: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    hostingServer: args[0],
                    nest: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        hostingServer: typeof args.hostingServer === 'object'
                ? args.hostingServer.id
                : args.hostingServer,
                                nest: args.nest,
                }

    return index.definition.url
            .replace('{hostingServer}', parsedArgs.hostingServer.toString())
            .replace('{nest}', parsedArgs.nest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PterodactylEggController::index
 * @see app/Http/Controllers/Admin/PterodactylEggController.php:75
 * @route '/admin/hosting-servers/{hostingServer}/pterodactyl-nests/{nest}/eggs'
 */
index.get = (args: { hostingServer: number | { id: number }, nest: string | number } | [hostingServer: number | { id: number }, nest: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\PterodactylEggController::index
 * @see app/Http/Controllers/Admin/PterodactylEggController.php:75
 * @route '/admin/hosting-servers/{hostingServer}/pterodactyl-nests/{nest}/eggs'
 */
index.head = (args: { hostingServer: number | { id: number }, nest: string | number } | [hostingServer: number | { id: number }, nest: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\PterodactylEggController::index
 * @see app/Http/Controllers/Admin/PterodactylEggController.php:75
 * @route '/admin/hosting-servers/{hostingServer}/pterodactyl-nests/{nest}/eggs'
 */
    const indexForm = (args: { hostingServer: number | { id: number }, nest: string | number } | [hostingServer: number | { id: number }, nest: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\PterodactylEggController::index
 * @see app/Http/Controllers/Admin/PterodactylEggController.php:75
 * @route '/admin/hosting-servers/{hostingServer}/pterodactyl-nests/{nest}/eggs'
 */
        indexForm.get = (args: { hostingServer: number | { id: number }, nest: string | number } | [hostingServer: number | { id: number }, nest: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\PterodactylEggController::index
 * @see app/Http/Controllers/Admin/PterodactylEggController.php:75
 * @route '/admin/hosting-servers/{hostingServer}/pterodactyl-nests/{nest}/eggs'
 */
        indexForm.head = (args: { hostingServer: number | { id: number }, nest: string | number } | [hostingServer: number | { id: number }, nest: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\Admin\PterodactylEggController::show
 * @see app/Http/Controllers/Admin/PterodactylEggController.php:125
 * @route '/admin/hosting-servers/{hostingServer}/pterodactyl-nests/{nest}/eggs/{egg}'
 */
export const show = (args: { hostingServer: number | { id: number }, nest: string | number, egg: string | number } | [hostingServer: number | { id: number }, nest: string | number, egg: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/hosting-servers/{hostingServer}/pterodactyl-nests/{nest}/eggs/{egg}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PterodactylEggController::show
 * @see app/Http/Controllers/Admin/PterodactylEggController.php:125
 * @route '/admin/hosting-servers/{hostingServer}/pterodactyl-nests/{nest}/eggs/{egg}'
 */
show.url = (args: { hostingServer: number | { id: number }, nest: string | number, egg: string | number } | [hostingServer: number | { id: number }, nest: string | number, egg: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    hostingServer: args[0],
                    nest: args[1],
                    egg: args[2],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        hostingServer: typeof args.hostingServer === 'object'
                ? args.hostingServer.id
                : args.hostingServer,
                                nest: args.nest,
                                egg: args.egg,
                }

    return show.definition.url
            .replace('{hostingServer}', parsedArgs.hostingServer.toString())
            .replace('{nest}', parsedArgs.nest.toString())
            .replace('{egg}', parsedArgs.egg.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PterodactylEggController::show
 * @see app/Http/Controllers/Admin/PterodactylEggController.php:125
 * @route '/admin/hosting-servers/{hostingServer}/pterodactyl-nests/{nest}/eggs/{egg}'
 */
show.get = (args: { hostingServer: number | { id: number }, nest: string | number, egg: string | number } | [hostingServer: number | { id: number }, nest: string | number, egg: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\PterodactylEggController::show
 * @see app/Http/Controllers/Admin/PterodactylEggController.php:125
 * @route '/admin/hosting-servers/{hostingServer}/pterodactyl-nests/{nest}/eggs/{egg}'
 */
show.head = (args: { hostingServer: number | { id: number }, nest: string | number, egg: string | number } | [hostingServer: number | { id: number }, nest: string | number, egg: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\PterodactylEggController::show
 * @see app/Http/Controllers/Admin/PterodactylEggController.php:125
 * @route '/admin/hosting-servers/{hostingServer}/pterodactyl-nests/{nest}/eggs/{egg}'
 */
    const showForm = (args: { hostingServer: number | { id: number }, nest: string | number, egg: string | number } | [hostingServer: number | { id: number }, nest: string | number, egg: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\PterodactylEggController::show
 * @see app/Http/Controllers/Admin/PterodactylEggController.php:125
 * @route '/admin/hosting-servers/{hostingServer}/pterodactyl-nests/{nest}/eggs/{egg}'
 */
        showForm.get = (args: { hostingServer: number | { id: number }, nest: string | number, egg: string | number } | [hostingServer: number | { id: number }, nest: string | number, egg: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\PterodactylEggController::show
 * @see app/Http/Controllers/Admin/PterodactylEggController.php:125
 * @route '/admin/hosting-servers/{hostingServer}/pterodactyl-nests/{nest}/eggs/{egg}'
 */
        showForm.head = (args: { hostingServer: number | { id: number }, nest: string | number, egg: string | number } | [hostingServer: number | { id: number }, nest: string | number, egg: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const eggs = {
    index: Object.assign(index, index),
show: Object.assign(show, show),
config: Object.assign(config, config),
}

export default eggs