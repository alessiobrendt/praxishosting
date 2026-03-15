import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\LegacyMigrationController::index
 * @see app/Http/Controllers/Admin/LegacyMigrationController.php:13
 * @route '/admin/legacy-migration'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/legacy-migration',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\LegacyMigrationController::index
 * @see app/Http/Controllers/Admin/LegacyMigrationController.php:13
 * @route '/admin/legacy-migration'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\LegacyMigrationController::index
 * @see app/Http/Controllers/Admin/LegacyMigrationController.php:13
 * @route '/admin/legacy-migration'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\LegacyMigrationController::index
 * @see app/Http/Controllers/Admin/LegacyMigrationController.php:13
 * @route '/admin/legacy-migration'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\LegacyMigrationController::index
 * @see app/Http/Controllers/Admin/LegacyMigrationController.php:13
 * @route '/admin/legacy-migration'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\LegacyMigrationController::index
 * @see app/Http/Controllers/Admin/LegacyMigrationController.php:13
 * @route '/admin/legacy-migration'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\LegacyMigrationController::index
 * @see app/Http/Controllers/Admin/LegacyMigrationController.php:13
 * @route '/admin/legacy-migration'
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
const legacyMigration = {
    index: Object.assign(index, index),
}

export default legacyMigration