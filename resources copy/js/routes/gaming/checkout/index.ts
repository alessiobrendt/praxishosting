import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\GamingController::pterodactylNests
 * @see app/Http/Controllers/GamingController.php:136
 * @route '/gaming/checkout/pterodactyl-nests'
 */
export const pterodactylNests = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pterodactylNests.url(options),
    method: 'get',
})

pterodactylNests.definition = {
    methods: ["get","head"],
    url: '/gaming/checkout/pterodactyl-nests',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GamingController::pterodactylNests
 * @see app/Http/Controllers/GamingController.php:136
 * @route '/gaming/checkout/pterodactyl-nests'
 */
pterodactylNests.url = (options?: RouteQueryOptions) => {
    return pterodactylNests.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingController::pterodactylNests
 * @see app/Http/Controllers/GamingController.php:136
 * @route '/gaming/checkout/pterodactyl-nests'
 */
pterodactylNests.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pterodactylNests.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GamingController::pterodactylNests
 * @see app/Http/Controllers/GamingController.php:136
 * @route '/gaming/checkout/pterodactyl-nests'
 */
pterodactylNests.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pterodactylNests.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\GamingController::pterodactylNests
 * @see app/Http/Controllers/GamingController.php:136
 * @route '/gaming/checkout/pterodactyl-nests'
 */
    const pterodactylNestsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: pterodactylNests.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\GamingController::pterodactylNests
 * @see app/Http/Controllers/GamingController.php:136
 * @route '/gaming/checkout/pterodactyl-nests'
 */
        pterodactylNestsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pterodactylNests.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\GamingController::pterodactylNests
 * @see app/Http/Controllers/GamingController.php:136
 * @route '/gaming/checkout/pterodactyl-nests'
 */
        pterodactylNestsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pterodactylNests.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    pterodactylNests.form = pterodactylNestsForm
/**
* @see \App\Http\Controllers\GamingController::pterodactylEggs
 * @see app/Http/Controllers/GamingController.php:188
 * @route '/gaming/checkout/pterodactyl-eggs'
 */
export const pterodactylEggs = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pterodactylEggs.url(options),
    method: 'get',
})

pterodactylEggs.definition = {
    methods: ["get","head"],
    url: '/gaming/checkout/pterodactyl-eggs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GamingController::pterodactylEggs
 * @see app/Http/Controllers/GamingController.php:188
 * @route '/gaming/checkout/pterodactyl-eggs'
 */
pterodactylEggs.url = (options?: RouteQueryOptions) => {
    return pterodactylEggs.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingController::pterodactylEggs
 * @see app/Http/Controllers/GamingController.php:188
 * @route '/gaming/checkout/pterodactyl-eggs'
 */
pterodactylEggs.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pterodactylEggs.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GamingController::pterodactylEggs
 * @see app/Http/Controllers/GamingController.php:188
 * @route '/gaming/checkout/pterodactyl-eggs'
 */
pterodactylEggs.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pterodactylEggs.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\GamingController::pterodactylEggs
 * @see app/Http/Controllers/GamingController.php:188
 * @route '/gaming/checkout/pterodactyl-eggs'
 */
    const pterodactylEggsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: pterodactylEggs.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\GamingController::pterodactylEggs
 * @see app/Http/Controllers/GamingController.php:188
 * @route '/gaming/checkout/pterodactyl-eggs'
 */
        pterodactylEggsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pterodactylEggs.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\GamingController::pterodactylEggs
 * @see app/Http/Controllers/GamingController.php:188
 * @route '/gaming/checkout/pterodactyl-eggs'
 */
        pterodactylEggsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pterodactylEggs.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    pterodactylEggs.form = pterodactylEggsForm
/**
* @see \App\Http\Controllers\GamingController::store
 * @see app/Http/Controllers/GamingController.php:241
 * @route '/gaming/checkout'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/gaming/checkout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GamingController::store
 * @see app/Http/Controllers/GamingController.php:241
 * @route '/gaming/checkout'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingController::store
 * @see app/Http/Controllers/GamingController.php:241
 * @route '/gaming/checkout'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\GamingController::store
 * @see app/Http/Controllers/GamingController.php:241
 * @route '/gaming/checkout'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GamingController::store
 * @see app/Http/Controllers/GamingController.php:241
 * @route '/gaming/checkout'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const checkout = {
    store: Object.assign(store, store),
}

export default checkout