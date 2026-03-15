import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults, validateParameters } from './../../wayfinder'
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
* @see \App\Http\Controllers\SiteSeoController::robots
 * @see app/Http/Controllers/SiteSeoController.php:51
 * @route '/site/{site}/robots.txt'
 */
export const robots = (args: { site: string | { slug: string } } | [site: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: robots.url(args, options),
    method: 'get',
})

robots.definition = {
    methods: ["get","head"],
    url: '/site/{site}/robots.txt',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SiteSeoController::robots
 * @see app/Http/Controllers/SiteSeoController.php:51
 * @route '/site/{site}/robots.txt'
 */
robots.url = (args: { site: string | { slug: string } } | [site: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
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

    return robots.definition.url
            .replace('{site}', parsedArgs.site.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SiteSeoController::robots
 * @see app/Http/Controllers/SiteSeoController.php:51
 * @route '/site/{site}/robots.txt'
 */
robots.get = (args: { site: string | { slug: string } } | [site: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: robots.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SiteSeoController::robots
 * @see app/Http/Controllers/SiteSeoController.php:51
 * @route '/site/{site}/robots.txt'
 */
robots.head = (args: { site: string | { slug: string } } | [site: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: robots.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SiteSeoController::robots
 * @see app/Http/Controllers/SiteSeoController.php:51
 * @route '/site/{site}/robots.txt'
 */
    const robotsForm = (args: { site: string | { slug: string } } | [site: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: robots.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SiteSeoController::robots
 * @see app/Http/Controllers/SiteSeoController.php:51
 * @route '/site/{site}/robots.txt'
 */
        robotsForm.get = (args: { site: string | { slug: string } } | [site: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: robots.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SiteSeoController::robots
 * @see app/Http/Controllers/SiteSeoController.php:51
 * @route '/site/{site}/robots.txt'
 */
        robotsForm.head = (args: { site: string | { slug: string } } | [site: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: robots.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    robots.form = robotsForm
/**
* @see \App\Http\Controllers\SiteRenderController::show
 * @see app/Http/Controllers/SiteRenderController.php:24
 * @route '/site/{site}/{pageSlug?}'
 */
export const show = (args: { site: string | { slug: string }, pageSlug?: string | number } | [site: string | { slug: string }, pageSlug: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/site/{site}/{pageSlug?}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SiteRenderController::show
 * @see app/Http/Controllers/SiteRenderController.php:24
 * @route '/site/{site}/{pageSlug?}'
 */
show.url = (args: { site: string | { slug: string }, pageSlug?: string | number } | [site: string | { slug: string }, pageSlug: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    site: args[0],
                    pageSlug: args[1],
                }
    }

    args = applyUrlDefaults(args)

    validateParameters(args, [
            "pageSlug",
        ])

    const parsedArgs = {
                        site: typeof args.site === 'object'
                ? args.site.slug
                : args.site,
                                pageSlug: args.pageSlug,
                }

    return show.definition.url
            .replace('{site}', parsedArgs.site.toString())
            .replace('{pageSlug?}', parsedArgs.pageSlug?.toString() ?? '')
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SiteRenderController::show
 * @see app/Http/Controllers/SiteRenderController.php:24
 * @route '/site/{site}/{pageSlug?}'
 */
show.get = (args: { site: string | { slug: string }, pageSlug?: string | number } | [site: string | { slug: string }, pageSlug: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SiteRenderController::show
 * @see app/Http/Controllers/SiteRenderController.php:24
 * @route '/site/{site}/{pageSlug?}'
 */
show.head = (args: { site: string | { slug: string }, pageSlug?: string | number } | [site: string | { slug: string }, pageSlug: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SiteRenderController::show
 * @see app/Http/Controllers/SiteRenderController.php:24
 * @route '/site/{site}/{pageSlug?}'
 */
    const showForm = (args: { site: string | { slug: string }, pageSlug?: string | number } | [site: string | { slug: string }, pageSlug: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SiteRenderController::show
 * @see app/Http/Controllers/SiteRenderController.php:24
 * @route '/site/{site}/{pageSlug?}'
 */
        showForm.get = (args: { site: string | { slug: string }, pageSlug?: string | number } | [site: string | { slug: string }, pageSlug: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SiteRenderController::show
 * @see app/Http/Controllers/SiteRenderController.php:24
 * @route '/site/{site}/{pageSlug?}'
 */
        showForm.head = (args: { site: string | { slug: string }, pageSlug?: string | number } | [site: string | { slug: string }, pageSlug: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const siteRender = {
    sitemap: Object.assign(sitemap, sitemap),
robots: Object.assign(robots, robots),
show: Object.assign(show, show),
}

export default siteRender