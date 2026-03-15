import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\PterodactylEggController::nests
 * @see app/Http/Controllers/Admin/PterodactylEggController.php:35
 * @route '/admin/hosting-servers/{hostingServer}/pterodactyl-nests'
 */
export const nests = (args: { hostingServer: number | { id: number } } | [hostingServer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: nests.url(args, options),
    method: 'get',
})

nests.definition = {
    methods: ["get","head"],
    url: '/admin/hosting-servers/{hostingServer}/pterodactyl-nests',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PterodactylEggController::nests
 * @see app/Http/Controllers/Admin/PterodactylEggController.php:35
 * @route '/admin/hosting-servers/{hostingServer}/pterodactyl-nests'
 */
nests.url = (args: { hostingServer: number | { id: number } } | [hostingServer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return nests.definition.url
            .replace('{hostingServer}', parsedArgs.hostingServer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PterodactylEggController::nests
 * @see app/Http/Controllers/Admin/PterodactylEggController.php:35
 * @route '/admin/hosting-servers/{hostingServer}/pterodactyl-nests'
 */
nests.get = (args: { hostingServer: number | { id: number } } | [hostingServer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: nests.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\PterodactylEggController::nests
 * @see app/Http/Controllers/Admin/PterodactylEggController.php:35
 * @route '/admin/hosting-servers/{hostingServer}/pterodactyl-nests'
 */
nests.head = (args: { hostingServer: number | { id: number } } | [hostingServer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: nests.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\PterodactylEggController::nests
 * @see app/Http/Controllers/Admin/PterodactylEggController.php:35
 * @route '/admin/hosting-servers/{hostingServer}/pterodactyl-nests'
 */
    const nestsForm = (args: { hostingServer: number | { id: number } } | [hostingServer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: nests.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\PterodactylEggController::nests
 * @see app/Http/Controllers/Admin/PterodactylEggController.php:35
 * @route '/admin/hosting-servers/{hostingServer}/pterodactyl-nests'
 */
        nestsForm.get = (args: { hostingServer: number | { id: number } } | [hostingServer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: nests.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\PterodactylEggController::nests
 * @see app/Http/Controllers/Admin/PterodactylEggController.php:35
 * @route '/admin/hosting-servers/{hostingServer}/pterodactyl-nests'
 */
        nestsForm.head = (args: { hostingServer: number | { id: number } } | [hostingServer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: nests.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    nests.form = nestsForm
/**
* @see \App\Http\Controllers\Admin\PterodactylEggController::eggs
 * @see app/Http/Controllers/Admin/PterodactylEggController.php:75
 * @route '/admin/hosting-servers/{hostingServer}/pterodactyl-nests/{nest}/eggs'
 */
export const eggs = (args: { hostingServer: number | { id: number }, nest: string | number } | [hostingServer: number | { id: number }, nest: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: eggs.url(args, options),
    method: 'get',
})

eggs.definition = {
    methods: ["get","head"],
    url: '/admin/hosting-servers/{hostingServer}/pterodactyl-nests/{nest}/eggs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PterodactylEggController::eggs
 * @see app/Http/Controllers/Admin/PterodactylEggController.php:75
 * @route '/admin/hosting-servers/{hostingServer}/pterodactyl-nests/{nest}/eggs'
 */
eggs.url = (args: { hostingServer: number | { id: number }, nest: string | number } | [hostingServer: number | { id: number }, nest: string | number ], options?: RouteQueryOptions) => {
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

    return eggs.definition.url
            .replace('{hostingServer}', parsedArgs.hostingServer.toString())
            .replace('{nest}', parsedArgs.nest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PterodactylEggController::eggs
 * @see app/Http/Controllers/Admin/PterodactylEggController.php:75
 * @route '/admin/hosting-servers/{hostingServer}/pterodactyl-nests/{nest}/eggs'
 */
eggs.get = (args: { hostingServer: number | { id: number }, nest: string | number } | [hostingServer: number | { id: number }, nest: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: eggs.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\PterodactylEggController::eggs
 * @see app/Http/Controllers/Admin/PterodactylEggController.php:75
 * @route '/admin/hosting-servers/{hostingServer}/pterodactyl-nests/{nest}/eggs'
 */
eggs.head = (args: { hostingServer: number | { id: number }, nest: string | number } | [hostingServer: number | { id: number }, nest: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: eggs.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\PterodactylEggController::eggs
 * @see app/Http/Controllers/Admin/PterodactylEggController.php:75
 * @route '/admin/hosting-servers/{hostingServer}/pterodactyl-nests/{nest}/eggs'
 */
    const eggsForm = (args: { hostingServer: number | { id: number }, nest: string | number } | [hostingServer: number | { id: number }, nest: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: eggs.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\PterodactylEggController::eggs
 * @see app/Http/Controllers/Admin/PterodactylEggController.php:75
 * @route '/admin/hosting-servers/{hostingServer}/pterodactyl-nests/{nest}/eggs'
 */
        eggsForm.get = (args: { hostingServer: number | { id: number }, nest: string | number } | [hostingServer: number | { id: number }, nest: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: eggs.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\PterodactylEggController::eggs
 * @see app/Http/Controllers/Admin/PterodactylEggController.php:75
 * @route '/admin/hosting-servers/{hostingServer}/pterodactyl-nests/{nest}/eggs'
 */
        eggsForm.head = (args: { hostingServer: number | { id: number }, nest: string | number } | [hostingServer: number | { id: number }, nest: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: eggs.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    eggs.form = eggsForm
/**
* @see \App\Http\Controllers\Admin\PterodactylEggController::showEgg
 * @see app/Http/Controllers/Admin/PterodactylEggController.php:125
 * @route '/admin/hosting-servers/{hostingServer}/pterodactyl-nests/{nest}/eggs/{egg}'
 */
export const showEgg = (args: { hostingServer: number | { id: number }, nest: string | number, egg: string | number } | [hostingServer: number | { id: number }, nest: string | number, egg: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showEgg.url(args, options),
    method: 'get',
})

showEgg.definition = {
    methods: ["get","head"],
    url: '/admin/hosting-servers/{hostingServer}/pterodactyl-nests/{nest}/eggs/{egg}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PterodactylEggController::showEgg
 * @see app/Http/Controllers/Admin/PterodactylEggController.php:125
 * @route '/admin/hosting-servers/{hostingServer}/pterodactyl-nests/{nest}/eggs/{egg}'
 */
showEgg.url = (args: { hostingServer: number | { id: number }, nest: string | number, egg: string | number } | [hostingServer: number | { id: number }, nest: string | number, egg: string | number ], options?: RouteQueryOptions) => {
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

    return showEgg.definition.url
            .replace('{hostingServer}', parsedArgs.hostingServer.toString())
            .replace('{nest}', parsedArgs.nest.toString())
            .replace('{egg}', parsedArgs.egg.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PterodactylEggController::showEgg
 * @see app/Http/Controllers/Admin/PterodactylEggController.php:125
 * @route '/admin/hosting-servers/{hostingServer}/pterodactyl-nests/{nest}/eggs/{egg}'
 */
showEgg.get = (args: { hostingServer: number | { id: number }, nest: string | number, egg: string | number } | [hostingServer: number | { id: number }, nest: string | number, egg: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showEgg.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\PterodactylEggController::showEgg
 * @see app/Http/Controllers/Admin/PterodactylEggController.php:125
 * @route '/admin/hosting-servers/{hostingServer}/pterodactyl-nests/{nest}/eggs/{egg}'
 */
showEgg.head = (args: { hostingServer: number | { id: number }, nest: string | number, egg: string | number } | [hostingServer: number | { id: number }, nest: string | number, egg: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showEgg.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\PterodactylEggController::showEgg
 * @see app/Http/Controllers/Admin/PterodactylEggController.php:125
 * @route '/admin/hosting-servers/{hostingServer}/pterodactyl-nests/{nest}/eggs/{egg}'
 */
    const showEggForm = (args: { hostingServer: number | { id: number }, nest: string | number, egg: string | number } | [hostingServer: number | { id: number }, nest: string | number, egg: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: showEgg.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\PterodactylEggController::showEgg
 * @see app/Http/Controllers/Admin/PterodactylEggController.php:125
 * @route '/admin/hosting-servers/{hostingServer}/pterodactyl-nests/{nest}/eggs/{egg}'
 */
        showEggForm.get = (args: { hostingServer: number | { id: number }, nest: string | number, egg: string | number } | [hostingServer: number | { id: number }, nest: string | number, egg: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showEgg.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\PterodactylEggController::showEgg
 * @see app/Http/Controllers/Admin/PterodactylEggController.php:125
 * @route '/admin/hosting-servers/{hostingServer}/pterodactyl-nests/{nest}/eggs/{egg}'
 */
        showEggForm.head = (args: { hostingServer: number | { id: number }, nest: string | number, egg: string | number } | [hostingServer: number | { id: number }, nest: string | number, egg: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showEgg.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    showEgg.form = showEggForm
/**
* @see \App\Http\Controllers\Admin\PterodactylEggController::updateConfig
 * @see app/Http/Controllers/Admin/PterodactylEggController.php:209
 * @route '/admin/hosting-servers/{hostingServer}/pterodactyl-nests/{nest}/eggs/{egg}/config'
 */
export const updateConfig = (args: { hostingServer: number | { id: number }, nest: string | number, egg: string | number } | [hostingServer: number | { id: number }, nest: string | number, egg: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateConfig.url(args, options),
    method: 'put',
})

updateConfig.definition = {
    methods: ["put"],
    url: '/admin/hosting-servers/{hostingServer}/pterodactyl-nests/{nest}/eggs/{egg}/config',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\PterodactylEggController::updateConfig
 * @see app/Http/Controllers/Admin/PterodactylEggController.php:209
 * @route '/admin/hosting-servers/{hostingServer}/pterodactyl-nests/{nest}/eggs/{egg}/config'
 */
updateConfig.url = (args: { hostingServer: number | { id: number }, nest: string | number, egg: string | number } | [hostingServer: number | { id: number }, nest: string | number, egg: string | number ], options?: RouteQueryOptions) => {
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

    return updateConfig.definition.url
            .replace('{hostingServer}', parsedArgs.hostingServer.toString())
            .replace('{nest}', parsedArgs.nest.toString())
            .replace('{egg}', parsedArgs.egg.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PterodactylEggController::updateConfig
 * @see app/Http/Controllers/Admin/PterodactylEggController.php:209
 * @route '/admin/hosting-servers/{hostingServer}/pterodactyl-nests/{nest}/eggs/{egg}/config'
 */
updateConfig.put = (args: { hostingServer: number | { id: number }, nest: string | number, egg: string | number } | [hostingServer: number | { id: number }, nest: string | number, egg: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateConfig.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\PterodactylEggController::updateConfig
 * @see app/Http/Controllers/Admin/PterodactylEggController.php:209
 * @route '/admin/hosting-servers/{hostingServer}/pterodactyl-nests/{nest}/eggs/{egg}/config'
 */
    const updateConfigForm = (args: { hostingServer: number | { id: number }, nest: string | number, egg: string | number } | [hostingServer: number | { id: number }, nest: string | number, egg: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateConfig.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\PterodactylEggController::updateConfig
 * @see app/Http/Controllers/Admin/PterodactylEggController.php:209
 * @route '/admin/hosting-servers/{hostingServer}/pterodactyl-nests/{nest}/eggs/{egg}/config'
 */
        updateConfigForm.put = (args: { hostingServer: number | { id: number }, nest: string | number, egg: string | number } | [hostingServer: number | { id: number }, nest: string | number, egg: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateConfig.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateConfig.form = updateConfigForm
const PterodactylEggController = { nests, eggs, showEgg, updateConfig }

export default PterodactylEggController