import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\PanelUpdateController::index
 * @see app/Http/Controllers/Admin/PanelUpdateController.php:15
 * @route '/admin/update'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/update',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PanelUpdateController::index
 * @see app/Http/Controllers/Admin/PanelUpdateController.php:15
 * @route '/admin/update'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PanelUpdateController::index
 * @see app/Http/Controllers/Admin/PanelUpdateController.php:15
 * @route '/admin/update'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\PanelUpdateController::index
 * @see app/Http/Controllers/Admin/PanelUpdateController.php:15
 * @route '/admin/update'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\PanelUpdateController::index
 * @see app/Http/Controllers/Admin/PanelUpdateController.php:15
 * @route '/admin/update'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\PanelUpdateController::index
 * @see app/Http/Controllers/Admin/PanelUpdateController.php:15
 * @route '/admin/update'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\PanelUpdateController::index
 * @see app/Http/Controllers/Admin/PanelUpdateController.php:15
 * @route '/admin/update'
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
* @see \App\Http\Controllers\Admin\PanelUpdateController::run
 * @see app/Http/Controllers/Admin/PanelUpdateController.php:59
 * @route '/admin/update/run'
 */
export const run = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: run.url(options),
    method: 'post',
})

run.definition = {
    methods: ["post"],
    url: '/admin/update/run',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PanelUpdateController::run
 * @see app/Http/Controllers/Admin/PanelUpdateController.php:59
 * @route '/admin/update/run'
 */
run.url = (options?: RouteQueryOptions) => {
    return run.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PanelUpdateController::run
 * @see app/Http/Controllers/Admin/PanelUpdateController.php:59
 * @route '/admin/update/run'
 */
run.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: run.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\PanelUpdateController::run
 * @see app/Http/Controllers/Admin/PanelUpdateController.php:59
 * @route '/admin/update/run'
 */
    const runForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: run.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\PanelUpdateController::run
 * @see app/Http/Controllers/Admin/PanelUpdateController.php:59
 * @route '/admin/update/run'
 */
        runForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: run.url(options),
            method: 'post',
        })
    
    run.form = runForm
const update = {
    index: Object.assign(index, index),
run: Object.assign(run, run),
}

export default update