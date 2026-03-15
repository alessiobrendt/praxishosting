import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\CronStatisticsController::index
 * @see app/Http/Controllers/Admin/CronStatisticsController.php:20
 * @route '/admin/cron-statistics'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/cron-statistics',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\CronStatisticsController::index
 * @see app/Http/Controllers/Admin/CronStatisticsController.php:20
 * @route '/admin/cron-statistics'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CronStatisticsController::index
 * @see app/Http/Controllers/Admin/CronStatisticsController.php:20
 * @route '/admin/cron-statistics'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\CronStatisticsController::index
 * @see app/Http/Controllers/Admin/CronStatisticsController.php:20
 * @route '/admin/cron-statistics'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\CronStatisticsController::index
 * @see app/Http/Controllers/Admin/CronStatisticsController.php:20
 * @route '/admin/cron-statistics'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\CronStatisticsController::index
 * @see app/Http/Controllers/Admin/CronStatisticsController.php:20
 * @route '/admin/cron-statistics'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\CronStatisticsController::index
 * @see app/Http/Controllers/Admin/CronStatisticsController.php:20
 * @route '/admin/cron-statistics'
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
const CronStatisticsController = { index }

export default CronStatisticsController