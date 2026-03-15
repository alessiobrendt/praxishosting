import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ProductInvitationAcceptController::__invoke
 * @see app/Http/Controllers/ProductInvitationAcceptController.php:16
 * @route '/invitations/accept-product'
 */
export const accept = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: accept.url(options),
    method: 'get',
})

accept.definition = {
    methods: ["get","head"],
    url: '/invitations/accept-product',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductInvitationAcceptController::__invoke
 * @see app/Http/Controllers/ProductInvitationAcceptController.php:16
 * @route '/invitations/accept-product'
 */
accept.url = (options?: RouteQueryOptions) => {
    return accept.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductInvitationAcceptController::__invoke
 * @see app/Http/Controllers/ProductInvitationAcceptController.php:16
 * @route '/invitations/accept-product'
 */
accept.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: accept.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProductInvitationAcceptController::__invoke
 * @see app/Http/Controllers/ProductInvitationAcceptController.php:16
 * @route '/invitations/accept-product'
 */
accept.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: accept.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProductInvitationAcceptController::__invoke
 * @see app/Http/Controllers/ProductInvitationAcceptController.php:16
 * @route '/invitations/accept-product'
 */
    const acceptForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: accept.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProductInvitationAcceptController::__invoke
 * @see app/Http/Controllers/ProductInvitationAcceptController.php:16
 * @route '/invitations/accept-product'
 */
        acceptForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: accept.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProductInvitationAcceptController::__invoke
 * @see app/Http/Controllers/ProductInvitationAcceptController.php:16
 * @route '/invitations/accept-product'
 */
        acceptForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: accept.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    accept.form = acceptForm
const productInvitations = {
    accept: Object.assign(accept, accept),
}

export default productInvitations