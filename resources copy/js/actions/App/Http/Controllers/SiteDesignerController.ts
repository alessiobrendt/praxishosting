import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
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
* @see \App\Http\Controllers\SiteDesignerController::updateBlock
 * @see app/Http/Controllers/SiteDesignerController.php:120
 * @route '/sites/{site}/designer/blocks/{blockId}'
 */
export const updateBlock = (args: { site: string | { uuid: string }, blockId: string | number } | [site: string | { uuid: string }, blockId: string | number ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateBlock.url(args, options),
    method: 'patch',
})

updateBlock.definition = {
    methods: ["patch"],
    url: '/sites/{site}/designer/blocks/{blockId}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\SiteDesignerController::updateBlock
 * @see app/Http/Controllers/SiteDesignerController.php:120
 * @route '/sites/{site}/designer/blocks/{blockId}'
 */
updateBlock.url = (args: { site: string | { uuid: string }, blockId: string | number } | [site: string | { uuid: string }, blockId: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    site: args[0],
                    blockId: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        site: typeof args.site === 'object'
                ? args.site.uuid
                : args.site,
                                blockId: args.blockId,
                }

    return updateBlock.definition.url
            .replace('{site}', parsedArgs.site.toString())
            .replace('{blockId}', parsedArgs.blockId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SiteDesignerController::updateBlock
 * @see app/Http/Controllers/SiteDesignerController.php:120
 * @route '/sites/{site}/designer/blocks/{blockId}'
 */
updateBlock.patch = (args: { site: string | { uuid: string }, blockId: string | number } | [site: string | { uuid: string }, blockId: string | number ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateBlock.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\SiteDesignerController::updateBlock
 * @see app/Http/Controllers/SiteDesignerController.php:120
 * @route '/sites/{site}/designer/blocks/{blockId}'
 */
    const updateBlockForm = (args: { site: string | { uuid: string }, blockId: string | number } | [site: string | { uuid: string }, blockId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateBlock.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SiteDesignerController::updateBlock
 * @see app/Http/Controllers/SiteDesignerController.php:120
 * @route '/sites/{site}/designer/blocks/{blockId}'
 */
        updateBlockForm.patch = (args: { site: string | { uuid: string }, blockId: string | number } | [site: string | { uuid: string }, blockId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateBlock.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateBlock.form = updateBlockForm
/**
* @see \App\Http\Controllers\SiteDesignerController::storeBlock
 * @see app/Http/Controllers/SiteDesignerController.php:150
 * @route '/sites/{site}/designer/blocks'
 */
export const storeBlock = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeBlock.url(args, options),
    method: 'post',
})

storeBlock.definition = {
    methods: ["post"],
    url: '/sites/{site}/designer/blocks',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SiteDesignerController::storeBlock
 * @see app/Http/Controllers/SiteDesignerController.php:150
 * @route '/sites/{site}/designer/blocks'
 */
storeBlock.url = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return storeBlock.definition.url
            .replace('{site}', parsedArgs.site.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SiteDesignerController::storeBlock
 * @see app/Http/Controllers/SiteDesignerController.php:150
 * @route '/sites/{site}/designer/blocks'
 */
storeBlock.post = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeBlock.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SiteDesignerController::storeBlock
 * @see app/Http/Controllers/SiteDesignerController.php:150
 * @route '/sites/{site}/designer/blocks'
 */
    const storeBlockForm = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeBlock.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SiteDesignerController::storeBlock
 * @see app/Http/Controllers/SiteDesignerController.php:150
 * @route '/sites/{site}/designer/blocks'
 */
        storeBlockForm.post = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeBlock.url(args, options),
            method: 'post',
        })
    
    storeBlock.form = storeBlockForm
/**
* @see \App\Http\Controllers\SiteDesignerController::destroyBlock
 * @see app/Http/Controllers/SiteDesignerController.php:193
 * @route '/sites/{site}/designer/blocks/{blockId}'
 */
export const destroyBlock = (args: { site: string | { uuid: string }, blockId: string | number } | [site: string | { uuid: string }, blockId: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyBlock.url(args, options),
    method: 'delete',
})

destroyBlock.definition = {
    methods: ["delete"],
    url: '/sites/{site}/designer/blocks/{blockId}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\SiteDesignerController::destroyBlock
 * @see app/Http/Controllers/SiteDesignerController.php:193
 * @route '/sites/{site}/designer/blocks/{blockId}'
 */
destroyBlock.url = (args: { site: string | { uuid: string }, blockId: string | number } | [site: string | { uuid: string }, blockId: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    site: args[0],
                    blockId: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        site: typeof args.site === 'object'
                ? args.site.uuid
                : args.site,
                                blockId: args.blockId,
                }

    return destroyBlock.definition.url
            .replace('{site}', parsedArgs.site.toString())
            .replace('{blockId}', parsedArgs.blockId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SiteDesignerController::destroyBlock
 * @see app/Http/Controllers/SiteDesignerController.php:193
 * @route '/sites/{site}/designer/blocks/{blockId}'
 */
destroyBlock.delete = (args: { site: string | { uuid: string }, blockId: string | number } | [site: string | { uuid: string }, blockId: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyBlock.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\SiteDesignerController::destroyBlock
 * @see app/Http/Controllers/SiteDesignerController.php:193
 * @route '/sites/{site}/designer/blocks/{blockId}'
 */
    const destroyBlockForm = (args: { site: string | { uuid: string }, blockId: string | number } | [site: string | { uuid: string }, blockId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroyBlock.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SiteDesignerController::destroyBlock
 * @see app/Http/Controllers/SiteDesignerController.php:193
 * @route '/sites/{site}/designer/blocks/{blockId}'
 */
        destroyBlockForm.delete = (args: { site: string | { uuid: string }, blockId: string | number } | [site: string | { uuid: string }, blockId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroyBlock.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroyBlock.form = destroyBlockForm
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
const SiteDesignerController = { state, draft, publish, updateBlock, storeBlock, destroyBlock, upload }

export default SiteDesignerController