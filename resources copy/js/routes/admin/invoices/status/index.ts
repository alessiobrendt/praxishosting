import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\InvoiceController::update
 * @see app/Http/Controllers/Admin/InvoiceController.php:128
 * @route '/admin/invoices/{invoice}/status'
 */
export const update = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/admin/invoices/{invoice}/status',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\InvoiceController::update
 * @see app/Http/Controllers/Admin/InvoiceController.php:128
 * @route '/admin/invoices/{invoice}/status'
 */
update.url = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { invoice: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { invoice: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    invoice: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        invoice: typeof args.invoice === 'object'
                ? args.invoice.uuid
                : args.invoice,
                }

    return update.definition.url
            .replace('{invoice}', parsedArgs.invoice.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\InvoiceController::update
 * @see app/Http/Controllers/Admin/InvoiceController.php:128
 * @route '/admin/invoices/{invoice}/status'
 */
update.patch = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\InvoiceController::update
 * @see app/Http/Controllers/Admin/InvoiceController.php:128
 * @route '/admin/invoices/{invoice}/status'
 */
    const updateForm = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\InvoiceController::update
 * @see app/Http/Controllers/Admin/InvoiceController.php:128
 * @route '/admin/invoices/{invoice}/status'
 */
        updateForm.patch = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
const status = {
    update: Object.assign(update, update),
}

export default status