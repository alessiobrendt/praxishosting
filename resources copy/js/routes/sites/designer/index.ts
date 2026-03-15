import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
import blocks from './blocks'
/**
* @see \App\Http\Controllers\SiteDesignerController::state
 * @see app/Http/Controllers/SiteDesignerController.php:19
 * @route '/sites/{site}/designer/state'
 */
export const state = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: state.url(args, options),
    method: 'get',
})

state.definition = {
    methods: ["get","head"],
    url: '/sites/{site}/designer/state',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SiteDesignerController::state
 * @see app/Http/Controllers/SiteDesignerController.php:19
 * @route '/sites/{site}/designer/state'
 */
state.url = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return state.definition.url
            .replace('{site}', parsedArgs.site.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SiteDesignerController::state
 * @see app/Http/Controllers/SiteDesignerController.php:19
 * @route '/sites/{site}/designer/state'
 */
state.get = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: state.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SiteDesignerController::state
 * @see app/Http/Controllers/SiteDesignerController.php:19
 * @route '/sites/{site}/designer/state'
 */
state.head = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: state.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SiteDesignerController::state
 * @see app/Http/Controllers/SiteDesignerController.php:19
 * @route '/sites/{site}/designer/state'
 */
    const stateForm = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: state.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SiteDesignerController::state
 * @see app/Http/Controllers/SiteDesignerController.php:19
 * @route '/sites/{site}/designer/state'
 */
        stateForm.get = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: state.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SiteDesignerController::state
 * @see app/Http/Controllers/SiteDesignerController.php:19
 * @route '/sites/{site}/designer/state'
 */
        stateForm.head = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: state.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    state.form = stateForm
/**
* @see \App\Http\Controllers\SiteDesignerController::draft
 * @see app/Http/Controllers/SiteDesignerController.php:41
 * @route '/sites/{site}/designer/draft'
 */
export const draft = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: draft.url(args, options),
    method: 'post',
})

draft.definition = {
    methods: ["post"],
    url: '/sites/{site}/designer/draft',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SiteDesignerController::draft
 * @see app/Http/Controllers/SiteDesignerController.php:41
 * @route '/sites/{site}/designer/draft'
 */
draft.url = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return draft.definition.url
            .replace('{site}', parsedArgs.site.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SiteDesignerController::draft
 * @see app/Http/Controllers/SiteDesignerController.php:41
 * @route '/sites/{site}/designer/draft'
 */
draft.post = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: draft.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SiteDesignerController::draft
 * @see app/Http/Controllers/SiteDesignerController.php:41
 * @route '/sites/{site}/designer/draft'
 */
    const draftForm = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: draft.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SiteDesignerController::draft
 * @see app/Http/Controllers/SiteDesignerController.php:41
 * @route '/sites/{site}/designer/draft'
 */
        draftForm.post = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: draft.url(args, options),
            method: 'post',
        })
    
    draft.form = draftForm
/**
* @see \App\Http\Controllers\SiteDesignerController::publish
 * @see app/Http/Controllers/SiteDesignerController.php:59
 * @route '/sites/{site}/designer/publish'
 */
export const publish = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: publish.url(args, options),
    method: 'post',
})

publish.definition = {
    methods: ["post"],
    url: '/sites/{site}/designer/publish',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SiteDesignerController::publish
 * @see app/Http/Controllers/SiteDesignerController.php:59
 * @route '/sites/{site}/designer/publish'
 */
publish.url = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return publish.definition.url
            .replace('{site}', parsedArgs.site.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SiteDesignerController::publish
 * @see app/Http/Controllers/SiteDesignerController.php:59
 * @route '/sites/{site}/designer/publish'
 */
publish.post = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: publish.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SiteDesignerController::publish
 * @see app/Http/Controllers/SiteDesignerController.php:59
 * @route '/sites/{site}/designer/publish'
 */
    const publishForm = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: publish.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SiteDesignerController::publish
 * @see app/Http/Controllers/SiteDesignerController.php:59
 * @route '/sites/{site}/designer/publish'
 */
        publishForm.post = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: publish.url(args, options),
            method: 'post',
        })
    
    publish.form = publishForm
/**
* @see \App\Http\Controllers\SiteDesignerController::upload
 * @see app/Http/Controllers/SiteDesignerController.php:217
 * @route '/sites/{site}/designer/upload'
 */
export const upload = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: upload.url(args, options),
    method: 'post',
})

upload.definition = {
    methods: ["post"],
    url: '/sites/{site}/designer/upload',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SiteDesignerController::upload
 * @see app/Http/Controllers/SiteDesignerController.php:217
 * @route '/sites/{site}/designer/upload'
 */
upload.url = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return upload.definition.url
            .replace('{site}', parsedArgs.site.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SiteDesignerController::upload
 * @see app/Http/Controllers/SiteDesignerController.php:217
 * @route '/sites/{site}/designer/upload'
 */
upload.post = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: upload.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SiteDesignerController::upload
 * @see app/Http/Controllers/SiteDesignerController.php:217
 * @route '/sites/{site}/designer/upload'
 */
    const uploadForm = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: upload.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SiteDesignerController::upload
 * @see app/Http/Controllers/SiteDesignerController.php:217
 * @route '/sites/{site}/designer/upload'
 */
        uploadForm.post = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: upload.url(args, options),
            method: 'post',
        })
    
    upload.form = uploadForm
const designer = {
    state: Object.assign(state, state),
draft: Object.assign(draft, draft),
publish: Object.assign(publish, publish),
blocks: Object.assign(blocks, blocks),
upload: Object.assign(upload, upload),
}

export default designer