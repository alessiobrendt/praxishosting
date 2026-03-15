import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PinVerificationController::store
 * @see app/Http/Controllers/PinVerificationController.php:17
 * @route '/pin/verify'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/pin/verify',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PinVerificationController::store
 * @see app/Http/Controllers/PinVerificationController.php:17
 * @route '/pin/verify'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PinVerificationController::store
 * @see app/Http/Controllers/PinVerificationController.php:17
 * @route '/pin/verify'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PinVerificationController::store
 * @see app/Http/Controllers/PinVerificationController.php:17
 * @route '/pin/verify'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PinVerificationController::store
 * @see app/Http/Controllers/PinVerificationController.php:17
 * @route '/pin/verify'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const PinVerificationController = { store }

export default PinVerificationController