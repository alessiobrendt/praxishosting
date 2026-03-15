import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
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
const redeemVoucher = {
    store: Object.assign(store, store),
}

export default redeemVoucher