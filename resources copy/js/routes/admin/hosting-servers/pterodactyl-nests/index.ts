import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
import eggs from './eggs'
/**
* @see \App\Http\Controllers\Admin\PterodactylEggController::index
 * @see app/Http/Controllers/Admin/PterodactylEggController.php:35
 * @route '/admin/hosting-servers/{hostingServer}/pterodactyl-nests'
 */
export const index = (args: { hostingServer: number | { id: number } } | [hostingServer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/hosting-servers/{hostingServer}/pterodactyl-nests',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PterodactylEggController::index
 * @see app/Http/Controllers/Admin/PterodactylEggController.php:35
 * @route '/admin/hosting-servers/{hostingServer}/pterodactyl-nests'
 */
index.url = (args: { hostingServer: number | { id: number } } | [hostingServer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return index.definition.url
            .replace('{hostingServer}', parsedArgs.hostingServer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PterodactylEggController::index
 * @see app/Http/Controllers/Admin/PterodactylEggController.php:35
 * @route '/admin/hosting-servers/{hostingServer}/pterodactyl-nests'
 */
index.get = (args: { hostingServer: number | { id: number } } | [hostingServer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\PterodactylEggController::index
 * @see app/Http/Controllers/Admin/PterodactylEggController.php:35
 * @route '/admin/hosting-servers/{hostingServer}/pterodactyl-nests'
 */
index.head = (args: { hostingServer: number | { id: number } } | [hostingServer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\PterodactylEggController::index
 * @see app/Http/Controllers/Admin/PterodactylEggController.php:35
 * @route '/admin/hosting-servers/{hostingServer}/pterodactyl-nests'
 */
    const indexForm = (args: { hostingServer: number | { id: number } } | [hostingServer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\PterodactylEggController::index
 * @see app/Http/Controllers/Admin/PterodactylEggController.php:35
 * @route '/admin/hosting-servers/{hostingServer}/pterodactyl-nests'
 */
        indexForm.get = (args: { hostingServer: number | { id: number } } | [hostingServer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\PterodactylEggController::index
 * @see app/Http/Controllers/Admin/PterodactylEggController.php:35
 * @route '/admin/hosting-servers/{hostingServer}/pterodactyl-nests'
 */
        indexForm.head = (args: { hostingServer: number | { id: number } } | [hostingServer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
const pterodactylNests = {
    index: Object.assign(index, index),
eggs: Object.assign(eggs, eggs),
}

export default pterodactylNests