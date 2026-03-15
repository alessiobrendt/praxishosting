import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\DashboardController::show
 * @see app/Http/Controllers/Admin/DashboardController.php:163
 * @route '/admin/dashboard/widgets/{widgetKey}'
 */
export const show = (args: { widgetKey: string | number } | [widgetKey: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/dashboard/widgets/{widgetKey}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\DashboardController::show
 * @see app/Http/Controllers/Admin/DashboardController.php:163
 * @route '/admin/dashboard/widgets/{widgetKey}'
 */
show.url = (args: { widgetKey: string | number } | [widgetKey: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{widgetKey}', parsedArgs.widgetKey.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DashboardController::show
 * @see app/Http/Controllers/Admin/DashboardController.php:163
 * @route '/admin/dashboard/widgets/{widgetKey}'
 */
show.get = (args: { widgetKey: string | number } | [widgetKey: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\DashboardController::show
 * @see app/Http/Controllers/Admin/DashboardController.php:163
 * @route '/admin/dashboard/widgets/{widgetKey}'
 */
show.head = (args: { widgetKey: string | number } | [widgetKey: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\DashboardController::show
 * @see app/Http/Controllers/Admin/DashboardController.php:163
 * @route '/admin/dashboard/widgets/{widgetKey}'
 */
    const showForm = (args: { widgetKey: string | number } | [widgetKey: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\DashboardController::show
 * @see app/Http/Controllers/Admin/DashboardController.php:163
 * @route '/admin/dashboard/widgets/{widgetKey}'
 */
        showForm.get = (args: { widgetKey: string | number } | [widgetKey: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\DashboardController::show
 * @see app/Http/Controllers/Admin/DashboardController.php:163
 * @route '/admin/dashboard/widgets/{widgetKey}'
 */
        showForm.head = (args: { widgetKey: string | number } | [widgetKey: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const widgets = {
    show: Object.assign(show, show),
}

export default widgets