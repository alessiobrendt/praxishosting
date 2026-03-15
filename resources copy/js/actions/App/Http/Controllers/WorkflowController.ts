import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\WorkflowController::index
 * @see app/Http/Controllers/WorkflowController.php:25
 * @route '/workflow-builder'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/workflow-builder',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WorkflowController::index
 * @see app/Http/Controllers/WorkflowController.php:25
 * @route '/workflow-builder'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkflowController::index
 * @see app/Http/Controllers/WorkflowController.php:25
 * @route '/workflow-builder'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\WorkflowController::index
 * @see app/Http/Controllers/WorkflowController.php:25
 * @route '/workflow-builder'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\WorkflowController::index
 * @see app/Http/Controllers/WorkflowController.php:25
 * @route '/workflow-builder'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\WorkflowController::index
 * @see app/Http/Controllers/WorkflowController.php:25
 * @route '/workflow-builder'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\WorkflowController::index
 * @see app/Http/Controllers/WorkflowController.php:25
 * @route '/workflow-builder'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\WorkflowController::list
 * @see app/Http/Controllers/WorkflowController.php:34
 * @route '/workflow-builder/api/list'
 */
export const list = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: list.url(options),
    method: 'get',
})

list.definition = {
    methods: ["get","head"],
    url: '/workflow-builder/api/list',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WorkflowController::list
 * @see app/Http/Controllers/WorkflowController.php:34
 * @route '/workflow-builder/api/list'
 */
list.url = (options?: RouteQueryOptions) => {
    return list.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkflowController::list
 * @see app/Http/Controllers/WorkflowController.php:34
 * @route '/workflow-builder/api/list'
 */
list.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: list.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\WorkflowController::list
 * @see app/Http/Controllers/WorkflowController.php:34
 * @route '/workflow-builder/api/list'
 */
list.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: list.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\WorkflowController::list
 * @see app/Http/Controllers/WorkflowController.php:34
 * @route '/workflow-builder/api/list'
 */
    const listForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: list.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\WorkflowController::list
 * @see app/Http/Controllers/WorkflowController.php:34
 * @route '/workflow-builder/api/list'
 */
        listForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: list.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\WorkflowController::list
 * @see app/Http/Controllers/WorkflowController.php:34
 * @route '/workflow-builder/api/list'
 */
        listForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: list.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    list.form = listForm
/**
* @see \App\Http\Controllers\WorkflowController::store
 * @see app/Http/Controllers/WorkflowController.php:41
 * @route '/workflow-builder/api/save'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/workflow-builder/api/save',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WorkflowController::store
 * @see app/Http/Controllers/WorkflowController.php:41
 * @route '/workflow-builder/api/save'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkflowController::store
 * @see app/Http/Controllers/WorkflowController.php:41
 * @route '/workflow-builder/api/save'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\WorkflowController::store
 * @see app/Http/Controllers/WorkflowController.php:41
 * @route '/workflow-builder/api/save'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\WorkflowController::store
 * @see app/Http/Controllers/WorkflowController.php:41
 * @route '/workflow-builder/api/save'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\WorkflowController::show
 * @see app/Http/Controllers/WorkflowController.php:63
 * @route '/workflow-builder/api/load/{id}'
 */
export const show = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/workflow-builder/api/load/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WorkflowController::show
 * @see app/Http/Controllers/WorkflowController.php:63
 * @route '/workflow-builder/api/load/{id}'
 */
show.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return show.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkflowController::show
 * @see app/Http/Controllers/WorkflowController.php:63
 * @route '/workflow-builder/api/load/{id}'
 */
show.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\WorkflowController::show
 * @see app/Http/Controllers/WorkflowController.php:63
 * @route '/workflow-builder/api/load/{id}'
 */
show.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\WorkflowController::show
 * @see app/Http/Controllers/WorkflowController.php:63
 * @route '/workflow-builder/api/load/{id}'
 */
    const showForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\WorkflowController::show
 * @see app/Http/Controllers/WorkflowController.php:63
 * @route '/workflow-builder/api/load/{id}'
 */
        showForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\WorkflowController::show
 * @see app/Http/Controllers/WorkflowController.php:63
 * @route '/workflow-builder/api/load/{id}'
 */
        showForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const WorkflowController = { index, list, store, show }

export default WorkflowController