import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\InvoiceController::showView
 * @see app/Http/Controllers/InvoiceController.php:26
 * @route '/invoices/{invoice}'
 */
export const showView = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showView.url(args, options),
    method: 'get',
})

showView.definition = {
    methods: ["get","head"],
    url: '/invoices/{invoice}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InvoiceController::showView
 * @see app/Http/Controllers/InvoiceController.php:26
 * @route '/invoices/{invoice}'
 */
showView.url = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return showView.definition.url
            .replace('{invoice}', parsedArgs.invoice.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InvoiceController::showView
 * @see app/Http/Controllers/InvoiceController.php:26
 * @route '/invoices/{invoice}'
 */
showView.get = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showView.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InvoiceController::showView
 * @see app/Http/Controllers/InvoiceController.php:26
 * @route '/invoices/{invoice}'
 */
showView.head = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showView.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InvoiceController::showView
 * @see app/Http/Controllers/InvoiceController.php:26
 * @route '/invoices/{invoice}'
 */
    const showViewForm = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: showView.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InvoiceController::showView
 * @see app/Http/Controllers/InvoiceController.php:26
 * @route '/invoices/{invoice}'
 */
        showViewForm.get = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showView.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InvoiceController::showView
 * @see app/Http/Controllers/InvoiceController.php:26
 * @route '/invoices/{invoice}'
 */
        showViewForm.head = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showView.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    showView.form = showViewForm
/**
* @see \App\Http\Controllers\InvoiceController::pay
 * @see app/Http/Controllers/InvoiceController.php:62
 * @route '/invoices/{invoice}/pay'
 */
export const pay = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: pay.url(args, options),
    method: 'post',
})

pay.definition = {
    methods: ["post"],
    url: '/invoices/{invoice}/pay',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InvoiceController::pay
 * @see app/Http/Controllers/InvoiceController.php:62
 * @route '/invoices/{invoice}/pay'
 */
pay.url = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return pay.definition.url
            .replace('{invoice}', parsedArgs.invoice.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InvoiceController::pay
 * @see app/Http/Controllers/InvoiceController.php:62
 * @route '/invoices/{invoice}/pay'
 */
pay.post = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: pay.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\InvoiceController::pay
 * @see app/Http/Controllers/InvoiceController.php:62
 * @route '/invoices/{invoice}/pay'
 */
    const payForm = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: pay.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\InvoiceController::pay
 * @see app/Http/Controllers/InvoiceController.php:62
 * @route '/invoices/{invoice}/pay'
 */
        payForm.post = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: pay.url(args, options),
            method: 'post',
        })
    
    pay.form = payForm
/**
* @see \App\Http\Controllers\InvoiceController::downloadPdf
 * @see app/Http/Controllers/InvoiceController.php:130
 * @route '/invoices/{invoice}/pdf'
 */
export const downloadPdf = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadPdf.url(args, options),
    method: 'get',
})

downloadPdf.definition = {
    methods: ["get","head"],
    url: '/invoices/{invoice}/pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InvoiceController::downloadPdf
 * @see app/Http/Controllers/InvoiceController.php:130
 * @route '/invoices/{invoice}/pdf'
 */
downloadPdf.url = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return downloadPdf.definition.url
            .replace('{invoice}', parsedArgs.invoice.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InvoiceController::downloadPdf
 * @see app/Http/Controllers/InvoiceController.php:130
 * @route '/invoices/{invoice}/pdf'
 */
downloadPdf.get = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadPdf.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InvoiceController::downloadPdf
 * @see app/Http/Controllers/InvoiceController.php:130
 * @route '/invoices/{invoice}/pdf'
 */
downloadPdf.head = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadPdf.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InvoiceController::downloadPdf
 * @see app/Http/Controllers/InvoiceController.php:130
 * @route '/invoices/{invoice}/pdf'
 */
    const downloadPdfForm = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: downloadPdf.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InvoiceController::downloadPdf
 * @see app/Http/Controllers/InvoiceController.php:130
 * @route '/invoices/{invoice}/pdf'
 */
        downloadPdfForm.get = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadPdf.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InvoiceController::downloadPdf
 * @see app/Http/Controllers/InvoiceController.php:130
 * @route '/invoices/{invoice}/pdf'
 */
        downloadPdfForm.head = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadPdf.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    downloadPdf.form = downloadPdfForm
/**
* @see \App\Http\Controllers\InvoiceController::downloadXml
 * @see app/Http/Controllers/InvoiceController.php:152
 * @route '/invoices/{invoice}/xml'
 */
export const downloadXml = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadXml.url(args, options),
    method: 'get',
})

downloadXml.definition = {
    methods: ["get","head"],
    url: '/invoices/{invoice}/xml',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InvoiceController::downloadXml
 * @see app/Http/Controllers/InvoiceController.php:152
 * @route '/invoices/{invoice}/xml'
 */
downloadXml.url = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return downloadXml.definition.url
            .replace('{invoice}', parsedArgs.invoice.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InvoiceController::downloadXml
 * @see app/Http/Controllers/InvoiceController.php:152
 * @route '/invoices/{invoice}/xml'
 */
downloadXml.get = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadXml.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InvoiceController::downloadXml
 * @see app/Http/Controllers/InvoiceController.php:152
 * @route '/invoices/{invoice}/xml'
 */
downloadXml.head = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadXml.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InvoiceController::downloadXml
 * @see app/Http/Controllers/InvoiceController.php:152
 * @route '/invoices/{invoice}/xml'
 */
    const downloadXmlForm = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: downloadXml.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InvoiceController::downloadXml
 * @see app/Http/Controllers/InvoiceController.php:152
 * @route '/invoices/{invoice}/xml'
 */
        downloadXmlForm.get = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadXml.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InvoiceController::downloadXml
 * @see app/Http/Controllers/InvoiceController.php:152
 * @route '/invoices/{invoice}/xml'
 */
        downloadXmlForm.head = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadXml.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    downloadXml.form = downloadXmlForm
const InvoiceController = { showView, pay, downloadPdf, downloadXml }

export default InvoiceController