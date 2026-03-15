import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\BillingPortalController::redirect
 * @see app/Http/Controllers/BillingPortalController.php:14
 * @route '/billing/portal'
 */
export const redirect = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: redirect.url(options),
    method: 'get',
})

redirect.definition = {
    methods: ["get","head"],
    url: '/billing/portal',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BillingPortalController::redirect
 * @see app/Http/Controllers/BillingPortalController.php:14
 * @route '/billing/portal'
 */
redirect.url = (options?: RouteQueryOptions) => {
    return redirect.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BillingPortalController::redirect
 * @see app/Http/Controllers/BillingPortalController.php:14
 * @route '/billing/portal'
 */
redirect.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: redirect.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BillingPortalController::redirect
 * @see app/Http/Controllers/BillingPortalController.php:14
 * @route '/billing/portal'
 */
redirect.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: redirect.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\BillingPortalController::redirect
 * @see app/Http/Controllers/BillingPortalController.php:14
 * @route '/billing/portal'
 */
    const redirectForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: redirect.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\BillingPortalController::redirect
 * @see app/Http/Controllers/BillingPortalController.php:14
 * @route '/billing/portal'
 */
        redirectForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: redirect.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\BillingPortalController::redirect
 * @see app/Http/Controllers/BillingPortalController.php:14
 * @route '/billing/portal'
 */
        redirectForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: redirect.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    redirect.form = redirectForm
const BillingPortalController = { redirect }

export default BillingPortalController