import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\GamingController::store
 * @see app/Http/Controllers/GamingController.php:445
 * @route '/gaming/cloud/checkout'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/gaming/cloud/checkout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GamingController::store
 * @see app/Http/Controllers/GamingController.php:445
 * @route '/gaming/cloud/checkout'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingController::store
 * @see app/Http/Controllers/GamingController.php:445
 * @route '/gaming/cloud/checkout'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\GamingController::store
 * @see app/Http/Controllers/GamingController.php:445
 * @route '/gaming/cloud/checkout'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GamingController::store
 * @see app/Http/Controllers/GamingController.php:445
 * @route '/gaming/cloud/checkout'
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