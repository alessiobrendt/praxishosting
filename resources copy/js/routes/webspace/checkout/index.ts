import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\WebspaceController::store
 * @see app/Http/Controllers/WebspaceController.php:83
 * @route '/webspace/checkout'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/webspace/checkout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WebspaceController::store
 * @see app/Http/Controllers/WebspaceController.php:83
 * @route '/webspace/checkout'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WebspaceController::store
 * @see app/Http/Controllers/WebspaceController.php:83
 * @route '/webspace/checkout'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\WebspaceController::store
 * @see app/Http/Controllers/WebspaceController.php:83
 * @route '/webspace/checkout'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\WebspaceController::store
 * @see app/Http/Controllers/WebspaceController.php:83
 * @route '/webspace/checkout'
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