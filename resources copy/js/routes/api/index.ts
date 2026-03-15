import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import v1 from './v1'
import ai from './ai'
import sites from './sites'
/**
 * @see routes/api.php:49
 * @route '/api/verify-domain'
 */
export const verifyDomain = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: verifyDomain.url(options),
    method: 'get',
})

verifyDomain.definition = {
    methods: ["get","head"],
    url: '/api/verify-domain',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/api.php:49
 * @route '/api/verify-domain'
 */
verifyDomain.url = (options?: RouteQueryOptions) => {
    return verifyDomain.definition.url + queryParams(options)
}

/**
 * @see routes/api.php:49
 * @route '/api/verify-domain'
 */
verifyDomain.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: verifyDomain.url(options),
    method: 'get',
})
/**
 * @see routes/api.php:49
 * @route '/api/verify-domain'
 */
verifyDomain.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: verifyDomain.url(options),
    method: 'head',
})

    /**
 * @see routes/api.php:49
 * @route '/api/verify-domain'
 */
    const verifyDomainForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: verifyDomain.url(options),
        method: 'get',
    })

            /**
 * @see routes/api.php:49
 * @route '/api/verify-domain'
 */
        verifyDomainForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: verifyDomain.url(options),
            method: 'get',
        })
            /**
 * @see routes/api.php:49
 * @route '/api/verify-domain'
 */
        verifyDomainForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: verifyDomain.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    verifyDomain.form = verifyDomainForm
const api = {
    v1: Object.assign(v1, v1),
ai: Object.assign(ai, ai),
sites: Object.assign(sites, sites),
verifyDomain: Object.assign(verifyDomain, verifyDomain),
}

export default api