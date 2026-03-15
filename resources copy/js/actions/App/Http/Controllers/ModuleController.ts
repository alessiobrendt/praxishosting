import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ModuleController::newsletterSite
 * @see app/Http/Controllers/ModuleController.php:70
 * @route '/modules/newsletter/sites/{site}'
 */
export const newsletterSite = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: newsletterSite.url(args, options),
    method: 'get',
})

newsletterSite.definition = {
    methods: ["get","head"],
    url: '/modules/newsletter/sites/{site}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ModuleController::newsletterSite
 * @see app/Http/Controllers/ModuleController.php:70
 * @route '/modules/newsletter/sites/{site}'
 */
newsletterSite.url = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { site: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { site: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    site: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        site: typeof args.site === 'object'
                ? args.site.uuid
                : args.site,
                }

    return newsletterSite.definition.url
            .replace('{site}', parsedArgs.site.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuleController::newsletterSite
 * @see app/Http/Controllers/ModuleController.php:70
 * @route '/modules/newsletter/sites/{site}'
 */
newsletterSite.get = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: newsletterSite.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ModuleController::newsletterSite
 * @see app/Http/Controllers/ModuleController.php:70
 * @route '/modules/newsletter/sites/{site}'
 */
newsletterSite.head = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: newsletterSite.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ModuleController::newsletterSite
 * @see app/Http/Controllers/ModuleController.php:70
 * @route '/modules/newsletter/sites/{site}'
 */
    const newsletterSiteForm = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: newsletterSite.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ModuleController::newsletterSite
 * @see app/Http/Controllers/ModuleController.php:70
 * @route '/modules/newsletter/sites/{site}'
 */
        newsletterSiteForm.get = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: newsletterSite.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ModuleController::newsletterSite
 * @see app/Http/Controllers/ModuleController.php:70
 * @route '/modules/newsletter/sites/{site}'
 */
        newsletterSiteForm.head = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: newsletterSite.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    newsletterSite.form = newsletterSiteForm
/**
* @see \App\Http\Controllers\ModuleController::storePost
 * @see app/Http/Controllers/ModuleController.php:92
 * @route '/modules/newsletter/sites/{site}/posts'
 */
export const storePost = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storePost.url(args, options),
    method: 'post',
})

storePost.definition = {
    methods: ["post"],
    url: '/modules/newsletter/sites/{site}/posts',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ModuleController::storePost
 * @see app/Http/Controllers/ModuleController.php:92
 * @route '/modules/newsletter/sites/{site}/posts'
 */
storePost.url = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { site: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { site: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    site: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        site: typeof args.site === 'object'
                ? args.site.uuid
                : args.site,
                }

    return storePost.definition.url
            .replace('{site}', parsedArgs.site.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuleController::storePost
 * @see app/Http/Controllers/ModuleController.php:92
 * @route '/modules/newsletter/sites/{site}/posts'
 */
storePost.post = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storePost.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ModuleController::storePost
 * @see app/Http/Controllers/ModuleController.php:92
 * @route '/modules/newsletter/sites/{site}/posts'
 */
    const storePostForm = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storePost.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ModuleController::storePost
 * @see app/Http/Controllers/ModuleController.php:92
 * @route '/modules/newsletter/sites/{site}/posts'
 */
        storePostForm.post = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storePost.url(args, options),
            method: 'post',
        })
    
    storePost.form = storePostForm
/**
* @see \App\Http\Controllers\ModuleController::contactSubmissions
 * @see app/Http/Controllers/ModuleController.php:119
 * @route '/modules/contact/sites/{site}'
 */
export const contactSubmissions = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: contactSubmissions.url(args, options),
    method: 'get',
})

contactSubmissions.definition = {
    methods: ["get","head"],
    url: '/modules/contact/sites/{site}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ModuleController::contactSubmissions
 * @see app/Http/Controllers/ModuleController.php:119
 * @route '/modules/contact/sites/{site}'
 */
contactSubmissions.url = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { site: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { site: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    site: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        site: typeof args.site === 'object'
                ? args.site.uuid
                : args.site,
                }

    return contactSubmissions.definition.url
            .replace('{site}', parsedArgs.site.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuleController::contactSubmissions
 * @see app/Http/Controllers/ModuleController.php:119
 * @route '/modules/contact/sites/{site}'
 */
contactSubmissions.get = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: contactSubmissions.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ModuleController::contactSubmissions
 * @see app/Http/Controllers/ModuleController.php:119
 * @route '/modules/contact/sites/{site}'
 */
contactSubmissions.head = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: contactSubmissions.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ModuleController::contactSubmissions
 * @see app/Http/Controllers/ModuleController.php:119
 * @route '/modules/contact/sites/{site}'
 */
    const contactSubmissionsForm = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: contactSubmissions.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ModuleController::contactSubmissions
 * @see app/Http/Controllers/ModuleController.php:119
 * @route '/modules/contact/sites/{site}'
 */
        contactSubmissionsForm.get = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: contactSubmissions.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ModuleController::contactSubmissions
 * @see app/Http/Controllers/ModuleController.php:119
 * @route '/modules/contact/sites/{site}'
 */
        contactSubmissionsForm.head = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: contactSubmissions.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    contactSubmissions.form = contactSubmissionsForm
/**
* @see \App\Http\Controllers\ModuleController::newsletter
 * @see app/Http/Controllers/ModuleController.php:23
 * @route '/modules/newsletter'
 */
export const newsletter = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: newsletter.url(options),
    method: 'get',
})

newsletter.definition = {
    methods: ["get","head"],
    url: '/modules/newsletter',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ModuleController::newsletter
 * @see app/Http/Controllers/ModuleController.php:23
 * @route '/modules/newsletter'
 */
newsletter.url = (options?: RouteQueryOptions) => {
    return newsletter.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuleController::newsletter
 * @see app/Http/Controllers/ModuleController.php:23
 * @route '/modules/newsletter'
 */
newsletter.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: newsletter.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ModuleController::newsletter
 * @see app/Http/Controllers/ModuleController.php:23
 * @route '/modules/newsletter'
 */
newsletter.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: newsletter.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ModuleController::newsletter
 * @see app/Http/Controllers/ModuleController.php:23
 * @route '/modules/newsletter'
 */
    const newsletterForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: newsletter.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ModuleController::newsletter
 * @see app/Http/Controllers/ModuleController.php:23
 * @route '/modules/newsletter'
 */
        newsletterForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: newsletter.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ModuleController::newsletter
 * @see app/Http/Controllers/ModuleController.php:23
 * @route '/modules/newsletter'
 */
        newsletterForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: newsletter.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    newsletter.form = newsletterForm
/**
* @see \App\Http\Controllers\ModuleController::contact
 * @see app/Http/Controllers/ModuleController.php:45
 * @route '/modules/contact'
 */
export const contact = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: contact.url(options),
    method: 'get',
})

contact.definition = {
    methods: ["get","head"],
    url: '/modules/contact',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ModuleController::contact
 * @see app/Http/Controllers/ModuleController.php:45
 * @route '/modules/contact'
 */
contact.url = (options?: RouteQueryOptions) => {
    return contact.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuleController::contact
 * @see app/Http/Controllers/ModuleController.php:45
 * @route '/modules/contact'
 */
contact.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: contact.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ModuleController::contact
 * @see app/Http/Controllers/ModuleController.php:45
 * @route '/modules/contact'
 */
contact.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: contact.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ModuleController::contact
 * @see app/Http/Controllers/ModuleController.php:45
 * @route '/modules/contact'
 */
    const contactForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: contact.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ModuleController::contact
 * @see app/Http/Controllers/ModuleController.php:45
 * @route '/modules/contact'
 */
        contactForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: contact.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ModuleController::contact
 * @see app/Http/Controllers/ModuleController.php:45
 * @route '/modules/contact'
 */
        contactForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: contact.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    contact.form = contactForm
const ModuleController = { newsletterSite, storePost, contactSubmissions, newsletter, contact }

export default ModuleController