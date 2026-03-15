import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\PinVerificationController::verify
 * @see app/Http/Controllers/PinVerificationController.php:17
 * @route '/pin/verify'
 */
export const verify = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verify.url(options),
    method: 'post',
})

verify.definition = {
    methods: ["post"],
    url: '/pin/verify',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PinVerificationController::verify
 * @see app/Http/Controllers/PinVerificationController.php:17
 * @route '/pin/verify'
 */
verify.url = (options?: RouteQueryOptions) => {
    return verify.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PinVerificationController::verify
 * @see app/Http/Controllers/PinVerificationController.php:17
 * @route '/pin/verify'
 */
verify.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verify.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PinVerificationController::verify
 * @see app/Http/Controllers/PinVerificationController.php:17
 * @route '/pin/verify'
 */
    const verifyForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: verify.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PinVerificationController::verify
 * @see app/Http/Controllers/PinVerificationController.php:17
 * @route '/pin/verify'
 */
        verifyForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: verify.url(options),
            method: 'post',
        })
    
    verify.form = verifyForm
const pin = {
    verify: Object.assign(verify, verify),
}

export default pin