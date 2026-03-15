import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\SiteSeoController::sitemap
 * @see app/Http/Controllers/SiteSeoController.php:16
 * @route '/site/{site}/sitemap.xml'
 */
export const sitemap = (args: { site: string | { slug: string } } | [site: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sitemap.url(args, options),
    method: 'get',
})

sitemap.definition = {
    methods: ["get","head"],
    url: '/site/{site}/sitemap.xml',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SiteSeoController::sitemap
 * @see app/Http/Controllers/SiteSeoController.php:16
 * @route '/site/{site}/sitemap.xml'
 */
sitemap.url = (args: { site: string | { slug: string } } | [site: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { site: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
            args = { site: args.slug }
        }
    
    if (Array.isArray(args)) {
        args = {
                    site: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        site: typeof args.site === 'object'
                ? args.site.slug
                : args.site,
                }

    return sitemap.definition.url
            .replace('{site}', parsedArgs.site.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SiteSeoController::sitemap
 * @see app/Http/Controllers/SiteSeoController.php:16
 * @route '/site/{site}/sitemap.xml'
 */
sitemap.get = (args: { site: string | { slug: string } } | [site: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sitemap.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SiteSeoController::sitemap
 * @see app/Http/Controllers/SiteSeoController.php:16
 * @route '/site/{site}/sitemap.xml'
 */
sitemap.head = (args: { site: string | { slug: string } } | [site: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: sitemap.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SiteSeoController::sitemap
 * @see app/Http/Controllers/SiteSeoController.php:16
 * @route '/site/{site}/sitemap.xml'
 */
    const sitemapForm = (args: { site: string | { slug: string } } | [site: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: sitemap.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SiteSeoController::sitemap
 * @see app/Http/Controllers/SiteSeoController.php:16
 * @route '/site/{site}/sitemap.xml'
 */
        sitemapForm.get = (args: { site: string | { slug: string } } | [site: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: sitemap.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SiteSeoController::sitemap
 * @see app/Http/Controllers/SiteSeoController.php:16
 * @route '/site/{site}/sitemap.xml'
 */
        sitemapForm.head = (args: { site: string | { slug: string } } | [site: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: sitemap.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    sitemap.form = sitemapForm
/**
* @see \App\Http\Controllers\SiteSeoController::robotsTxt
 * @see app/Http/Controllers/SiteSeoController.php:51
 * @route '/site/{site}/robots.txt'
 */
export const robotsTxt = (args: { site: string | { slug: string } } | [site: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: robotsTxt.url(args, options),
    method: 'get',
})

robotsTxt.definition = {
    methods: ["get","head"],
    url: '/site/{site}/robots.txt',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SiteSeoController::robotsTxt
 * @see app/Http/Controllers/SiteSeoController.php:51
 * @route '/site/{site}/robots.txt'
 */
robotsTxt.url = (args: { site: string | { slug: string } } | [site: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { site: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
            args = { site: args.slug }
        }
    
    if (Array.isArray(args)) {
        args = {
                    site: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        site: typeof args.site === 'object'
                ? args.site.slug
                : args.site,
                }

    return robotsTxt.definition.url
            .replace('{site}', parsedArgs.site.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SiteSeoController::robotsTxt
 * @see app/Http/Controllers/SiteSeoController.php:51
 * @route '/site/{site}/robots.txt'
 */
robotsTxt.get = (args: { site: string | { slug: string } } | [site: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: robotsTxt.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SiteSeoController::robotsTxt
 * @see app/Http/Controllers/SiteSeoController.php:51
 * @route '/site/{site}/robots.txt'
 */
robotsTxt.head = (args: { site: string | { slug: string } } | [site: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: robotsTxt.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SiteSeoController::robotsTxt
 * @see app/Http/Controllers/SiteSeoController.php:51
 * @route '/site/{site}/robots.txt'
 */
    const robotsTxtForm = (args: { site: string | { slug: string } } | [site: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: robotsTxt.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SiteSeoController::robotsTxt
 * @see app/Http/Controllers/SiteSeoController.php:51
 * @route '/site/{site}/robots.txt'
 */
        robotsTxtForm.get = (args: { site: string | { slug: string } } | [site: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: robotsTxt.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SiteSeoController::robotsTxt
 * @see app/Http/Controllers/SiteSeoController.php:51
 * @route '/site/{site}/robots.txt'
 */
        robotsTxtForm.head = (args: { site: string | { slug: string } } | [site: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: robotsTxt.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    robotsTxt.form = robotsTxtForm
const SiteSeoController = { sitemap, robotsTxt }

export default SiteSeoController