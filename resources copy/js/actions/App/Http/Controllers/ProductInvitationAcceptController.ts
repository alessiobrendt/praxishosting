import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ProductInvitationAcceptController::__invoke
 * @see app/Http/Controllers/ProductInvitationAcceptController.php:16
 * @route '/invitations/accept-product'
 */
const ProductInvitationAcceptController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ProductInvitationAcceptController.url(options),
    method: 'get',
})

ProductInvitationAcceptController.definition = {
    methods: ["get","head"],
    url: '/invitations/accept-product',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductInvitationAcceptController::__invoke
 * @see app/Http/Controllers/ProductInvitationAcceptController.php:16
 * @route '/invitations/accept-product'
 */
ProductInvitationAcceptController.url = (options?: RouteQueryOptions) => {
    return ProductInvitationAcceptController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductInvitationAcceptController::__invoke
 * @see app/Http/Controllers/ProductInvitationAcceptController.php:16
 * @route '/invitations/accept-product'
 */
ProductInvitationAcceptController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ProductInvitationAcceptController.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProductInvitationAcceptController::__invoke
 * @see app/Http/Controllers/ProductInvitationAcceptController.php:16
 * @route '/invitations/accept-product'
 */
ProductInvitationAcceptController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ProductInvitationAcceptController.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProductInvitationAcceptController::__invoke
 * @see app/Http/Controllers/ProductInvitationAcceptController.php:16
 * @route '/invitations/accept-product'
 */
    const ProductInvitationAcceptControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: ProductInvitationAcceptController.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProductInvitationAcceptController::__invoke
 * @see app/Http/Controllers/ProductInvitationAcceptController.php:16
 * @route '/invitations/accept-product'
 */
        ProductInvitationAcceptControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ProductInvitationAcceptController.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProductInvitationAcceptController::__invoke
 * @see app/Http/Controllers/ProductInvitationAcceptController.php:16
 * @route '/invitations/accept-product'
 */
        ProductInvitationAcceptControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ProductInvitationAcceptController.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    ProductInvitationAcceptController.form = ProductInvitationAcceptControllerForm
export default ProductInvitationAcceptController