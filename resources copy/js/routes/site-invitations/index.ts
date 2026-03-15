import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\SiteInvitationAcceptController::__invoke
 * @see app/Http/Controllers/SiteInvitationAcceptController.php:15
 * @route '/invitations/accept-site'
 */
export const accept = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: accept.url(options),
    method: 'get',
})

accept.definition = {
    methods: ["get","head"],
    url: '/invitations/accept-site',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SiteInvitationAcceptController::__invoke
 * @see app/Http/Controllers/SiteInvitationAcceptController.php:15
 * @route '/invitations/accept-site'
 */
accept.url = (options?: RouteQueryOptions) => {
    return accept.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SiteInvitationAcceptController::__invoke
 * @see app/Http/Controllers/SiteInvitationAcceptController.php:15
 * @route '/invitations/accept-site'
 */
accept.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: accept.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SiteInvitationAcceptController::__invoke
 * @see app/Http/Controllers/SiteInvitationAcceptController.php:15
 * @route '/invitations/accept-site'
 */
accept.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: accept.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SiteInvitationAcceptController::__invoke
 * @see app/Http/Controllers/SiteInvitationAcceptController.php:15
 * @route '/invitations/accept-site'
 */
    const acceptForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: accept.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SiteInvitationAcceptController::__invoke
 * @see app/Http/Controllers/SiteInvitationAcceptController.php:15
 * @route '/invitations/accept-site'
 */
        acceptForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: accept.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SiteInvitationAcceptController::__invoke
 * @see app/Http/Controllers/SiteInvitationAcceptController.php:15
 * @route '/invitations/accept-site'
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
const siteInvitations = {
    accept: Object.assign(accept, accept),
}

export default siteInvitations