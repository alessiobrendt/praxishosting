import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\SiteInvitationAcceptController::__invoke
 * @see app/Http/Controllers/SiteInvitationAcceptController.php:15
 * @route '/invitations/accept-site'
 */
const SiteInvitationAcceptController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: SiteInvitationAcceptController.url(options),
    method: 'get',
})

SiteInvitationAcceptController.definition = {
    methods: ["get","head"],
    url: '/invitations/accept-site',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SiteInvitationAcceptController::__invoke
 * @see app/Http/Controllers/SiteInvitationAcceptController.php:15
 * @route '/invitations/accept-site'
 */
SiteInvitationAcceptController.url = (options?: RouteQueryOptions) => {
    return SiteInvitationAcceptController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SiteInvitationAcceptController::__invoke
 * @see app/Http/Controllers/SiteInvitationAcceptController.php:15
 * @route '/invitations/accept-site'
 */
SiteInvitationAcceptController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: SiteInvitationAcceptController.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SiteInvitationAcceptController::__invoke
 * @see app/Http/Controllers/SiteInvitationAcceptController.php:15
 * @route '/invitations/accept-site'
 */
SiteInvitationAcceptController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: SiteInvitationAcceptController.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SiteInvitationAcceptController::__invoke
 * @see app/Http/Controllers/SiteInvitationAcceptController.php:15
 * @route '/invitations/accept-site'
 */
    const SiteInvitationAcceptControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: SiteInvitationAcceptController.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SiteInvitationAcceptController::__invoke
 * @see app/Http/Controllers/SiteInvitationAcceptController.php:15
 * @route '/invitations/accept-site'
 */
        SiteInvitationAcceptControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: SiteInvitationAcceptController.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SiteInvitationAcceptController::__invoke
 * @see app/Http/Controllers/SiteInvitationAcceptController.php:15
 * @route '/invitations/accept-site'
 */
        SiteInvitationAcceptControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: SiteInvitationAcceptController.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    SiteInvitationAcceptController.form = SiteInvitationAcceptControllerForm
export default SiteInvitationAcceptController