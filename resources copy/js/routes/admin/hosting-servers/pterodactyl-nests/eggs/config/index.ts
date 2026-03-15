import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\PterodactylEggController::update
 * @see app/Http/Controllers/Admin/PterodactylEggController.php:209
 * @route '/admin/hosting-servers/{hostingServer}/pterodactyl-nests/{nest}/eggs/{egg}/config'
 */
export const update = (args: { hostingServer: number | { id: number }, nest: string | number, egg: string | number } | [hostingServer: number | { id: number }, nest: string | number, egg: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/hosting-servers/{hostingServer}/pterodactyl-nests/{nest}/eggs/{egg}/config',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\PterodactylEggController::update
 * @see app/Http/Controllers/Admin/PterodactylEggController.php:209
 * @route '/admin/hosting-servers/{hostingServer}/pterodactyl-nests/{nest}/eggs/{egg}/config'
 */
update.url = (args: { hostingServer: number | { id: number }, nest: string | number, egg: string | number } | [hostingServer: number | { id: number }, nest: string | number, egg: string | number ], options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{hostingServer}', parsedArgs.hostingServer.toString())
            .replace('{nest}', parsedArgs.nest.toString())
            .replace('{egg}', parsedArgs.egg.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PterodactylEggController::update
 * @see app/Http/Controllers/Admin/PterodactylEggController.php:209
 * @route '/admin/hosting-servers/{hostingServer}/pterodactyl-nests/{nest}/eggs/{egg}/config'
 */
update.put = (args: { hostingServer: number | { id: number }, nest: string | number, egg: string | number } | [hostingServer: number | { id: number }, nest: string | number, egg: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\PterodactylEggController::update
 * @see app/Http/Controllers/Admin/PterodactylEggController.php:209
 * @route '/admin/hosting-servers/{hostingServer}/pterodactyl-nests/{nest}/eggs/{egg}/config'
 */
    const updateForm = (args: { hostingServer: number | { id: number }, nest: string | number, egg: string | number } | [hostingServer: number | { id: number }, nest: string | number, egg: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\PterodactylEggController::update
 * @see app/Http/Controllers/Admin/PterodactylEggController.php:209
 * @route '/admin/hosting-servers/{hostingServer}/pterodactyl-nests/{nest}/eggs/{egg}/config'
 */
        updateForm.put = (args: { hostingServer: number | { id: number }, nest: string | number, egg: string | number } | [hostingServer: number | { id: number }, nest: string | number, egg: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
const config = {
    update: Object.assign(update, update),
}

export default config