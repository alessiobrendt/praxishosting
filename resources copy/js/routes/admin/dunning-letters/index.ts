import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\DunningLetterController::index
 * @see app/Http/Controllers/Admin/DunningLetterController.php:13
 * @route '/admin/dunning-letters'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/dunning-letters',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\DunningLetterController::index
 * @see app/Http/Controllers/Admin/DunningLetterController.php:13
 * @route '/admin/dunning-letters'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DunningLetterController::index
 * @see app/Http/Controllers/Admin/DunningLetterController.php:13
 * @route '/admin/dunning-letters'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\DunningLetterController::index
 * @see app/Http/Controllers/Admin/DunningLetterController.php:13
 * @route '/admin/dunning-letters'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\DunningLetterController::index
 * @see app/Http/Controllers/Admin/DunningLetterController.php:13
 * @route '/admin/dunning-letters'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\DunningLetterController::index
 * @see app/Http/Controllers/Admin/DunningLetterController.php:13
 * @route '/admin/dunning-letters'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\DunningLetterController::index
 * @see app/Http/Controllers/Admin/DunningLetterController.php:13
 * @route '/admin/dunning-letters'
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
const dunningLetters = {
    index: Object.assign(index, index),
}

export default dunningLetters