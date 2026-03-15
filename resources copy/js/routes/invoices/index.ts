import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\InvoiceController::show
 * @see app/Http/Controllers/InvoiceController.php:26
 * @route '/invoices/{invoice}'
 */
export const show = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/invoices/{invoice}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InvoiceController::show
 * @see app/Http/Controllers/InvoiceController.php:26
 * @route '/invoices/{invoice}'
 */
show.url = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{invoice}', parsedArgs.invoice.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InvoiceController::show
 * @see app/Http/Controllers/InvoiceController.php:26
 * @route '/invoices/{invoice}'
 */
show.get = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InvoiceController::show
 * @see app/Http/Controllers/InvoiceController.php:26
 * @route '/invoices/{invoice}'
 */
show.head = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InvoiceController::show
 * @see app/Http/Controllers/InvoiceController.php:26
 * @route '/invoices/{invoice}'
 */
    const showForm = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InvoiceController::show
 * @see app/Http/Controllers/InvoiceController.php:26
 * @route '/invoices/{invoice}'
 */
        showForm.get = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InvoiceController::show
 * @see app/Http/Controllers/InvoiceController.php:26
 * @route '/invoices/{invoice}'
 */
        showForm.head = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
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
* @see \App\Http\Controllers\InvoiceController::pdf
 * @see app/Http/Controllers/InvoiceController.php:130
 * @route '/invoices/{invoice}/pdf'
 */
export const pdf = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pdf.url(args, options),
    method: 'get',
})

pdf.definition = {
    methods: ["get","head"],
    url: '/invoices/{invoice}/pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InvoiceController::pdf
 * @see app/Http/Controllers/InvoiceController.php:130
 * @route '/invoices/{invoice}/pdf'
 */
pdf.url = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return pdf.definition.url
            .replace('{invoice}', parsedArgs.invoice.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InvoiceController::pdf
 * @see app/Http/Controllers/InvoiceController.php:130
 * @route '/invoices/{invoice}/pdf'
 */
pdf.get = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pdf.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InvoiceController::pdf
 * @see app/Http/Controllers/InvoiceController.php:130
 * @route '/invoices/{invoice}/pdf'
 */
pdf.head = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pdf.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InvoiceController::pdf
 * @see app/Http/Controllers/InvoiceController.php:130
 * @route '/invoices/{invoice}/pdf'
 */
    const pdfForm = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: pdf.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InvoiceController::pdf
 * @see app/Http/Controllers/InvoiceController.php:130
 * @route '/invoices/{invoice}/pdf'
 */
        pdfForm.get = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pdf.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InvoiceController::pdf
 * @see app/Http/Controllers/InvoiceController.php:130
 * @route '/invoices/{invoice}/pdf'
 */
        pdfForm.head = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pdf.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    pdf.form = pdfForm
/**
* @see \App\Http\Controllers\InvoiceController::xml
 * @see app/Http/Controllers/InvoiceController.php:152
 * @route '/invoices/{invoice}/xml'
 */
export const xml = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: xml.url(args, options),
    method: 'get',
})

xml.definition = {
    methods: ["get","head"],
    url: '/invoices/{invoice}/xml',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InvoiceController::xml
 * @see app/Http/Controllers/InvoiceController.php:152
 * @route '/invoices/{invoice}/xml'
 */
xml.url = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return xml.definition.url
            .replace('{invoice}', parsedArgs.invoice.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InvoiceController::xml
 * @see app/Http/Controllers/InvoiceController.php:152
 * @route '/invoices/{invoice}/xml'
 */
xml.get = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: xml.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InvoiceController::xml
 * @see app/Http/Controllers/InvoiceController.php:152
 * @route '/invoices/{invoice}/xml'
 */
xml.head = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: xml.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InvoiceController::xml
 * @see app/Http/Controllers/InvoiceController.php:152
 * @route '/invoices/{invoice}/xml'
 */
    const xmlForm = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: xml.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InvoiceController::xml
 * @see app/Http/Controllers/InvoiceController.php:152
 * @route '/invoices/{invoice}/xml'
 */
        xmlForm.get = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: xml.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InvoiceController::xml
 * @see app/Http/Controllers/InvoiceController.php:152
 * @route '/invoices/{invoice}/xml'
 */
        xmlForm.head = (args: { invoice: string | { uuid: string } } | [invoice: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: xml.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    xml.form = xmlForm
const invoices = {
    show: Object.assign(show, show),
pay: Object.assign(pay, pay),
pdf: Object.assign(pdf, pdf),
xml: Object.assign(xml, xml),
}

export default invoices