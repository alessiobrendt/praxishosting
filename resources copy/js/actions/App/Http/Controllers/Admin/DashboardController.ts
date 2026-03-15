import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\DashboardController::index
 * @see app/Http/Controllers/Admin/DashboardController.php:22
 * @route '/admin'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\DashboardController::index
 * @see app/Http/Controllers/Admin/DashboardController.php:22
 * @route '/admin'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DashboardController::index
 * @see app/Http/Controllers/Admin/DashboardController.php:22
 * @route '/admin'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\DashboardController::index
 * @see app/Http/Controllers/Admin/DashboardController.php:22
 * @route '/admin'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\DashboardController::index
 * @see app/Http/Controllers/Admin/DashboardController.php:22
 * @route '/admin'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\DashboardController::index
 * @see app/Http/Controllers/Admin/DashboardController.php:22
 * @route '/admin'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\DashboardController::index
 * @see app/Http/Controllers/Admin/DashboardController.php:22
 * @route '/admin'
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
* @see \App\Http\Controllers\Admin\DashboardController::updateLayout
 * @see app/Http/Controllers/Admin/DashboardController.php:153
 * @route '/admin/dashboard/layout'
 */
export const updateLayout = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateLayout.url(options),
    method: 'put',
})

updateLayout.definition = {
    methods: ["put"],
    url: '/admin/dashboard/layout',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\DashboardController::updateLayout
 * @see app/Http/Controllers/Admin/DashboardController.php:153
 * @route '/admin/dashboard/layout'
 */
updateLayout.url = (options?: RouteQueryOptions) => {
    return updateLayout.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DashboardController::updateLayout
 * @see app/Http/Controllers/Admin/DashboardController.php:153
 * @route '/admin/dashboard/layout'
 */
updateLayout.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateLayout.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\DashboardController::updateLayout
 * @see app/Http/Controllers/Admin/DashboardController.php:153
 * @route '/admin/dashboard/layout'
 */
    const updateLayoutForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateLayout.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\DashboardController::updateLayout
 * @see app/Http/Controllers/Admin/DashboardController.php:153
 * @route '/admin/dashboard/layout'
 */
        updateLayoutForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateLayout.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateLayout.form = updateLayoutForm
/**
* @see \App\Http\Controllers\Admin\DashboardController::widgetData
 * @see app/Http/Controllers/Admin/DashboardController.php:163
 * @route '/admin/dashboard/widgets/{widgetKey}'
 */
export const widgetData = (args: { widgetKey: string | number } | [widgetKey: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: widgetData.url(args, options),
    method: 'get',
})

widgetData.definition = {
    methods: ["get","head"],
    url: '/admin/dashboard/widgets/{widgetKey}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\DashboardController::widgetData
 * @see app/Http/Controllers/Admin/DashboardController.php:163
 * @route '/admin/dashboard/widgets/{widgetKey}'
 */
widgetData.url = (args: { widgetKey: string | number } | [widgetKey: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { widgetKey: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    widgetKey: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        widgetKey: args.widgetKey,
                }

    return widgetData.definition.url
            .replace('{widgetKey}', parsedArgs.widgetKey.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DashboardController::widgetData
 * @see app/Http/Controllers/Admin/DashboardController.php:163
 * @route '/admin/dashboard/widgets/{widgetKey}'
 */
widgetData.get = (args: { widgetKey: string | number } | [widgetKey: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: widgetData.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\DashboardController::widgetData
 * @see app/Http/Controllers/Admin/DashboardController.php:163
 * @route '/admin/dashboard/widgets/{widgetKey}'
 */
widgetData.head = (args: { widgetKey: string | number } | [widgetKey: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: widgetData.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\DashboardController::widgetData
 * @see app/Http/Controllers/Admin/DashboardController.php:163
 * @route '/admin/dashboard/widgets/{widgetKey}'
 */
    const widgetDataForm = (args: { widgetKey: string | number } | [widgetKey: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: widgetData.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\DashboardController::widgetData
 * @see app/Http/Controllers/Admin/DashboardController.php:163
 * @route '/admin/dashboard/widgets/{widgetKey}'
 */
        widgetDataForm.get = (args: { widgetKey: string | number } | [widgetKey: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: widgetData.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\DashboardController::widgetData
 * @see app/Http/Controllers/Admin/DashboardController.php:163
 * @route '/admin/dashboard/widgets/{widgetKey}'
 */
        widgetDataForm.head = (args: { widgetKey: string | number } | [widgetKey: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: widgetData.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    widgetData.form = widgetDataForm
const DashboardController = { index, updateLayout, widgetData }

export default DashboardController