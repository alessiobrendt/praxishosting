import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\SupportController::download
 * @see app/Http/Controllers/SupportController.php:275
 * @route '/support/{ticket}/attachments/{attachment}'
 */
export const download = (args: { ticket: string | { uuid: string }, attachment: number | { id: number } } | [ticket: string | { uuid: string }, attachment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/support/{ticket}/attachments/{attachment}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SupportController::download
 * @see app/Http/Controllers/SupportController.php:275
 * @route '/support/{ticket}/attachments/{attachment}'
 */
download.url = (args: { ticket: string | { uuid: string }, attachment: number | { id: number } } | [ticket: string | { uuid: string }, attachment: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    ticket: args[0],
                    attachment: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ticket: typeof args.ticket === 'object'
                ? args.ticket.uuid
                : args.ticket,
                                attachment: typeof args.attachment === 'object'
                ? args.attachment.id
                : args.attachment,
                }

    return download.definition.url
            .replace('{ticket}', parsedArgs.ticket.toString())
            .replace('{attachment}', parsedArgs.attachment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SupportController::download
 * @see app/Http/Controllers/SupportController.php:275
 * @route '/support/{ticket}/attachments/{attachment}'
 */
download.get = (args: { ticket: string | { uuid: string }, attachment: number | { id: number } } | [ticket: string | { uuid: string }, attachment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SupportController::download
 * @see app/Http/Controllers/SupportController.php:275
 * @route '/support/{ticket}/attachments/{attachment}'
 */
download.head = (args: { ticket: string | { uuid: string }, attachment: number | { id: number } } | [ticket: string | { uuid: string }, attachment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SupportController::download
 * @see app/Http/Controllers/SupportController.php:275
 * @route '/support/{ticket}/attachments/{attachment}'
 */
    const downloadForm = (args: { ticket: string | { uuid: string }, attachment: number | { id: number } } | [ticket: string | { uuid: string }, attachment: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: download.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SupportController::download
 * @see app/Http/Controllers/SupportController.php:275
 * @route '/support/{ticket}/attachments/{attachment}'
 */
        downloadForm.get = (args: { ticket: string | { uuid: string }, attachment: number | { id: number } } | [ticket: string | { uuid: string }, attachment: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SupportController::download
 * @see app/Http/Controllers/SupportController.php:275
 * @route '/support/{ticket}/attachments/{attachment}'
 */
        downloadForm.head = (args: { ticket: string | { uuid: string }, attachment: number | { id: number } } | [ticket: string | { uuid: string }, attachment: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    download.form = downloadForm
const attachments = {
    download: Object.assign(download, download),
}

export default attachments