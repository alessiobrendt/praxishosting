import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\DiscountCodeValidationController::validate
 * @see app/Http/Controllers/DiscountCodeValidationController.php:11
 * @route '/discount-code/validate'
 */
export const validate = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: validate.url(options),
    method: 'post',
})

validate.definition = {
    methods: ["post"],
    url: '/discount-code/validate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DiscountCodeValidationController::validate
 * @see app/Http/Controllers/DiscountCodeValidationController.php:11
 * @route '/discount-code/validate'
 */
validate.url = (options?: RouteQueryOptions) => {
    return validate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DiscountCodeValidationController::validate
 * @see app/Http/Controllers/DiscountCodeValidationController.php:11
 * @route '/discount-code/validate'
 */
validate.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: validate.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DiscountCodeValidationController::validate
 * @see app/Http/Controllers/DiscountCodeValidationController.php:11
 * @route '/discount-code/validate'
 */
    const validateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: validate.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DiscountCodeValidationController::validate
 * @see app/Http/Controllers/DiscountCodeValidationController.php:11
 * @route '/discount-code/validate'
 */
        validateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: validate.url(options),
            method: 'post',
        })
    
    validate.form = validateForm
const discountCode = {
    validate: Object.assign(validate, validate),
}

export default discountCode