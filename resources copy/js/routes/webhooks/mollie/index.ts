import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\MollieWebhookController::defaultMethod
 * @see app/Http/Controllers/MollieWebhookController.php:39
 * @route '/webhooks/mollie'
 */
export const defaultMethod = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: defaultMethod.url(options),
    method: 'post',
})

defaultMethod.definition = {
    methods: ["post"],
    url: '/webhooks/mollie',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MollieWebhookController::defaultMethod
 * @see app/Http/Controllers/MollieWebhookController.php:39
 * @route '/webhooks/mollie'
 */
defaultMethod.url = (options?: RouteQueryOptions) => {
    return defaultMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MollieWebhookController::defaultMethod
 * @see app/Http/Controllers/MollieWebhookController.php:39
 * @route '/webhooks/mollie'
 */
defaultMethod.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: defaultMethod.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\MollieWebhookController::defaultMethod
 * @see app/Http/Controllers/MollieWebhookController.php:39
 * @route '/webhooks/mollie'
 */
    const defaultMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: defaultMethod.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MollieWebhookController::defaultMethod
 * @see app/Http/Controllers/MollieWebhookController.php:39
 * @route '/webhooks/mollie'
 */
        defaultMethodForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: defaultMethod.url(options),
            method: 'post',
        })
    
    defaultMethod.form = defaultMethodForm
/**
* @see \Laravel\Cashier\Http\Controllers\AftercareWebhookController::aftercare
 * @see vendor/mollie/laravel-cashier-mollie/src/Http/Controllers/AftercareWebhookController.php:27
 * @route '/webhooks/mollie/aftercare'
 */
export const aftercare = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: aftercare.url(options),
    method: 'post',
})

aftercare.definition = {
    methods: ["post"],
    url: '/webhooks/mollie/aftercare',
} satisfies RouteDefinition<["post"]>

/**
* @see \Laravel\Cashier\Http\Controllers\AftercareWebhookController::aftercare
 * @see vendor/mollie/laravel-cashier-mollie/src/Http/Controllers/AftercareWebhookController.php:27
 * @route '/webhooks/mollie/aftercare'
 */
aftercare.url = (options?: RouteQueryOptions) => {
    return aftercare.definition.url + queryParams(options)
}

/**
* @see \Laravel\Cashier\Http\Controllers\AftercareWebhookController::aftercare
 * @see vendor/mollie/laravel-cashier-mollie/src/Http/Controllers/AftercareWebhookController.php:27
 * @route '/webhooks/mollie/aftercare'
 */
aftercare.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: aftercare.url(options),
    method: 'post',
})

    /**
* @see \Laravel\Cashier\Http\Controllers\AftercareWebhookController::aftercare
 * @see vendor/mollie/laravel-cashier-mollie/src/Http/Controllers/AftercareWebhookController.php:27
 * @route '/webhooks/mollie/aftercare'
 */
    const aftercareForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: aftercare.url(options),
        method: 'post',
    })

            /**
* @see \Laravel\Cashier\Http\Controllers\AftercareWebhookController::aftercare
 * @see vendor/mollie/laravel-cashier-mollie/src/Http/Controllers/AftercareWebhookController.php:27
 * @route '/webhooks/mollie/aftercare'
 */
        aftercareForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: aftercare.url(options),
            method: 'post',
        })
    
    aftercare.form = aftercareForm
/**
* @see \Laravel\Cashier\Http\Controllers\FirstPaymentWebhookController::first_payment
 * @see vendor/mollie/laravel-cashier-mollie/src/Http/Controllers/FirstPaymentWebhookController.php:21
 * @route '/webhooks/mollie/first-payment'
 */
export const first_payment = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: first_payment.url(options),
    method: 'post',
})

first_payment.definition = {
    methods: ["post"],
    url: '/webhooks/mollie/first-payment',
} satisfies RouteDefinition<["post"]>

/**
* @see \Laravel\Cashier\Http\Controllers\FirstPaymentWebhookController::first_payment
 * @see vendor/mollie/laravel-cashier-mollie/src/Http/Controllers/FirstPaymentWebhookController.php:21
 * @route '/webhooks/mollie/first-payment'
 */
first_payment.url = (options?: RouteQueryOptions) => {
    return first_payment.definition.url + queryParams(options)
}

/**
* @see \Laravel\Cashier\Http\Controllers\FirstPaymentWebhookController::first_payment
 * @see vendor/mollie/laravel-cashier-mollie/src/Http/Controllers/FirstPaymentWebhookController.php:21
 * @route '/webhooks/mollie/first-payment'
 */
first_payment.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: first_payment.url(options),
    method: 'post',
})

    /**
* @see \Laravel\Cashier\Http\Controllers\FirstPaymentWebhookController::first_payment
 * @see vendor/mollie/laravel-cashier-mollie/src/Http/Controllers/FirstPaymentWebhookController.php:21
 * @route '/webhooks/mollie/first-payment'
 */
    const first_paymentForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: first_payment.url(options),
        method: 'post',
    })

            /**
* @see \Laravel\Cashier\Http\Controllers\FirstPaymentWebhookController::first_payment
 * @see vendor/mollie/laravel-cashier-mollie/src/Http/Controllers/FirstPaymentWebhookController.php:21
 * @route '/webhooks/mollie/first-payment'
 */
        first_paymentForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: first_payment.url(options),
            method: 'post',
        })
    
    first_payment.form = first_paymentForm
const mollie = {
    default: Object.assign(defaultMethod, defaultMethod),
aftercare: Object.assign(aftercare, aftercare),
first_payment: Object.assign(first_payment, first_payment),
}

export default mollie