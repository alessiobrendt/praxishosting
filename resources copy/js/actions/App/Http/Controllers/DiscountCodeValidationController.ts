import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\DiscountCodeValidationController::__invoke
 * @see app/Http/Controllers/DiscountCodeValidationController.php:11
 * @route '/discount-code/validate'
 */
export const __invoke = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: __invoke.url(options),
    method: 'post',
})

__invoke.definition = {
    methods: ["post"],
    url: '/discount-code/validate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DiscountCodeValidationController::__invoke
 * @see app/Http/Controllers/DiscountCodeValidationController.php:11
 * @route '/discount-code/validate'
 */
__invoke.url = (options?: RouteQueryOptions) => {
    return __invoke.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DiscountCodeValidationController::__invoke
 * @see app/Http/Controllers/DiscountCodeValidationController.php:11
 * @route '/discount-code/validate'
 */
__invoke.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: __invoke.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DiscountCodeValidationController::__invoke
 * @see app/Http/Controllers/DiscountCodeValidationController.php:11
 * @route '/discount-code/validate'
 */
    const __invokeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: __invoke.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DiscountCodeValidationController::__invoke
 * @see app/Http/Controllers/DiscountCodeValidationController.php:11
 * @route '/discount-code/validate'
 */
        __invokeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: __invoke.url(options),
            method: 'post',
        })
    
    __invoke.form = __invokeForm
const DiscountCodeValidationController = { __invoke }

export default DiscountCodeValidationController