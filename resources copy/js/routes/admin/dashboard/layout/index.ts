import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\DashboardController::update
 * @see app/Http/Controllers/Admin/DashboardController.php:153
 * @route '/admin/dashboard/layout'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/dashboard/layout',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\DashboardController::update
 * @see app/Http/Controllers/Admin/DashboardController.php:153
 * @route '/admin/dashboard/layout'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DashboardController::update
 * @see app/Http/Controllers/Admin/DashboardController.php:153
 * @route '/admin/dashboard/layout'
 */
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\DashboardController::update
 * @see app/Http/Controllers/Admin/DashboardController.php:153
 * @route '/admin/dashboard/layout'
 */
    const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\DashboardController::update
 * @see app/Http/Controllers/Admin/DashboardController.php:153
 * @route '/admin/dashboard/layout'
 */
        updateForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
const layout = {
    update: Object.assign(update, update),
}

export default layout