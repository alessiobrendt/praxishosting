import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\RedeemVoucherController::index
 * @see app/Http/Controllers/RedeemVoucherController.php:16
 * @route '/billing/redeem-voucher'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/billing/redeem-voucher',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RedeemVoucherController::index
 * @see app/Http/Controllers/RedeemVoucherController.php:16
 * @route '/billing/redeem-voucher'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RedeemVoucherController::index
 * @see app/Http/Controllers/RedeemVoucherController.php:16
 * @route '/billing/redeem-voucher'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RedeemVoucherController::index
 * @see app/Http/Controllers/RedeemVoucherController.php:16
 * @route '/billing/redeem-voucher'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RedeemVoucherController::index
 * @see app/Http/Controllers/RedeemVoucherController.php:16
 * @route '/billing/redeem-voucher'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RedeemVoucherController::index
 * @see app/Http/Controllers/RedeemVoucherController.php:16
 * @route '/billing/redeem-voucher'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RedeemVoucherController::index
 * @see app/Http/Controllers/RedeemVoucherController.php:16
 * @route '/billing/redeem-voucher'
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
* @see \App\Http\Controllers\RedeemVoucherController::store
 * @see app/Http/Controllers/RedeemVoucherController.php:21
 * @route '/billing/redeem-voucher'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/billing/redeem-voucher',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RedeemVoucherController::store
 * @see app/Http/Controllers/RedeemVoucherController.php:21
 * @route '/billing/redeem-voucher'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RedeemVoucherController::store
 * @see app/Http/Controllers/RedeemVoucherController.php:21
 * @route '/billing/redeem-voucher'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\RedeemVoucherController::store
 * @see app/Http/Controllers/RedeemVoucherController.php:21
 * @route '/billing/redeem-voucher'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\RedeemVoucherController::store
 * @see app/Http/Controllers/RedeemVoucherController.php:21
 * @route '/billing/redeem-voucher'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const RedeemVoucherController = { index, store }

export default RedeemVoucherController