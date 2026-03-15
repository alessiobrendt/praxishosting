import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\TldPricelistController::index
 * @see app/Http/Controllers/Admin/TldPricelistController.php:17
 * @route '/admin/domains/tld-pricelist'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/domains/tld-pricelist',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\TldPricelistController::index
 * @see app/Http/Controllers/Admin/TldPricelistController.php:17
 * @route '/admin/domains/tld-pricelist'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TldPricelistController::index
 * @see app/Http/Controllers/Admin/TldPricelistController.php:17
 * @route '/admin/domains/tld-pricelist'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\TldPricelistController::index
 * @see app/Http/Controllers/Admin/TldPricelistController.php:17
 * @route '/admin/domains/tld-pricelist'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\TldPricelistController::index
 * @see app/Http/Controllers/Admin/TldPricelistController.php:17
 * @route '/admin/domains/tld-pricelist'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\TldPricelistController::index
 * @see app/Http/Controllers/Admin/TldPricelistController.php:17
 * @route '/admin/domains/tld-pricelist'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\TldPricelistController::index
 * @see app/Http/Controllers/Admin/TldPricelistController.php:17
 * @route '/admin/domains/tld-pricelist'
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
* @see \App\Http\Controllers\Admin\TldPricelistController::sync
 * @see app/Http/Controllers/Admin/TldPricelistController.php:63
 * @route '/admin/domains/tld-pricelist/sync'
 */
export const sync = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sync.url(options),
    method: 'post',
})

sync.definition = {
    methods: ["post"],
    url: '/admin/domains/tld-pricelist/sync',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\TldPricelistController::sync
 * @see app/Http/Controllers/Admin/TldPricelistController.php:63
 * @route '/admin/domains/tld-pricelist/sync'
 */
sync.url = (options?: RouteQueryOptions) => {
    return sync.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TldPricelistController::sync
 * @see app/Http/Controllers/Admin/TldPricelistController.php:63
 * @route '/admin/domains/tld-pricelist/sync'
 */
sync.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sync.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\TldPricelistController::sync
 * @see app/Http/Controllers/Admin/TldPricelistController.php:63
 * @route '/admin/domains/tld-pricelist/sync'
 */
    const syncForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: sync.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\TldPricelistController::sync
 * @see app/Http/Controllers/Admin/TldPricelistController.php:63
 * @route '/admin/domains/tld-pricelist/sync'
 */
        syncForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: sync.url(options),
            method: 'post',
        })
    
    sync.form = syncForm
/**
* @see \App\Http\Controllers\Admin\TldPricelistController::bulk
 * @see app/Http/Controllers/Admin/TldPricelistController.php:73
 * @route '/admin/domains/tld-pricelist/bulk'
 */
export const bulk = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: bulk.url(options),
    method: 'put',
})

bulk.definition = {
    methods: ["put"],
    url: '/admin/domains/tld-pricelist/bulk',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\TldPricelistController::bulk
 * @see app/Http/Controllers/Admin/TldPricelistController.php:73
 * @route '/admin/domains/tld-pricelist/bulk'
 */
bulk.url = (options?: RouteQueryOptions) => {
    return bulk.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TldPricelistController::bulk
 * @see app/Http/Controllers/Admin/TldPricelistController.php:73
 * @route '/admin/domains/tld-pricelist/bulk'
 */
bulk.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: bulk.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\TldPricelistController::bulk
 * @see app/Http/Controllers/Admin/TldPricelistController.php:73
 * @route '/admin/domains/tld-pricelist/bulk'
 */
    const bulkForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: bulk.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\TldPricelistController::bulk
 * @see app/Http/Controllers/Admin/TldPricelistController.php:73
 * @route '/admin/domains/tld-pricelist/bulk'
 */
        bulkForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: bulk.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    bulk.form = bulkForm
const tldPricelist = {
    index: Object.assign(index, index),
sync: Object.assign(sync, sync),
bulk: Object.assign(bulk, bulk),
}

export default tldPricelist