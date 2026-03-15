import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\InvoiceController::store
 * @see app/Http/Controllers/Admin/InvoiceController.php:241
 * @route '/admin/invoices/{invoice}/dunning-letters'
 */
export const store = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/invoices/{invoice}/dunning-letters',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\InvoiceController::store
 * @see app/Http/Controllers/Admin/InvoiceController.php:241
 * @route '/admin/invoices/{invoice}/dunning-letters'
 */
store.url = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return store.definition.url
            .replace('{invoice}', parsedArgs.invoice.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\InvoiceController::store
 * @see app/Http/Controllers/Admin/InvoiceController.php:241
 * @route '/admin/invoices/{invoice}/dunning-letters'
 */
store.post = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\InvoiceController::store
 * @see app/Http/Controllers/Admin/InvoiceController.php:241
 * @route '/admin/invoices/{invoice}/dunning-letters'
 */
    const storeForm = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\InvoiceController::store
 * @see app/Http/Controllers/Admin/InvoiceController.php:241
 * @route '/admin/invoices/{invoice}/dunning-letters'
 */
        storeForm.post = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\InvoiceController::pdf
 * @see app/Http/Controllers/Admin/InvoiceController.php:274
 * @route '/admin/invoices/{invoice}/dunning/{dunning_letter}/pdf'
 */
export const pdf = (args: { invoice: string | { uuid: string }, dunning_letter: string | number } | [invoice: string | { uuid: string }, dunning_letter: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pdf.url(args, options),
    method: 'get',
})

pdf.definition = {
    methods: ["get","head"],
    url: '/admin/invoices/{invoice}/dunning/{dunning_letter}/pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\InvoiceController::pdf
 * @see app/Http/Controllers/Admin/InvoiceController.php:274
 * @route '/admin/invoices/{invoice}/dunning/{dunning_letter}/pdf'
 */
pdf.url = (args: { invoice: string | { uuid: string }, dunning_letter: string | number } | [invoice: string | { uuid: string }, dunning_letter: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    invoice: args[0],
                    dunning_letter: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        invoice: typeof args.invoice === 'object'
                ? args.invoice.uuid
                : args.invoice,
                                dunning_letter: args.dunning_letter,
                }

    return pdf.definition.url
            .replace('{invoice}', parsedArgs.invoice.toString())
            .replace('{dunning_letter}', parsedArgs.dunning_letter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\InvoiceController::pdf
 * @see app/Http/Controllers/Admin/InvoiceController.php:274
 * @route '/admin/invoices/{invoice}/dunning/{dunning_letter}/pdf'
 */
pdf.get = (args: { invoice: string | { uuid: string }, dunning_letter: string | number } | [invoice: string | { uuid: string }, dunning_letter: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pdf.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\InvoiceController::pdf
 * @see app/Http/Controllers/Admin/InvoiceController.php:274
 * @route '/admin/invoices/{invoice}/dunning/{dunning_letter}/pdf'
 */
pdf.head = (args: { invoice: string | { uuid: string }, dunning_letter: string | number } | [invoice: string | { uuid: string }, dunning_letter: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pdf.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\InvoiceController::pdf
 * @see app/Http/Controllers/Admin/InvoiceController.php:274
 * @route '/admin/invoices/{invoice}/dunning/{dunning_letter}/pdf'
 */
    const pdfForm = (args: { invoice: string | { uuid: string }, dunning_letter: string | number } | [invoice: string | { uuid: string }, dunning_letter: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: pdf.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\InvoiceController::pdf
 * @see app/Http/Controllers/Admin/InvoiceController.php:274
 * @route '/admin/invoices/{invoice}/dunning/{dunning_letter}/pdf'
 */
        pdfForm.get = (args: { invoice: string | { uuid: string }, dunning_letter: string | number } | [invoice: string | { uuid: string }, dunning_letter: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pdf.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\InvoiceController::pdf
 * @see app/Http/Controllers/Admin/InvoiceController.php:274
 * @route '/admin/invoices/{invoice}/dunning/{dunning_letter}/pdf'
 */
        pdfForm.head = (args: { invoice: string | { uuid: string }, dunning_letter: string | number } | [invoice: string | { uuid: string }, dunning_letter: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pdf.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    pdf.form = pdfForm
const dunningLetters = {
    store: Object.assign(store, store),
pdf: Object.assign(pdf, pdf),
}

export default dunningLetters