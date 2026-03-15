import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\SupportController::index
 * @see app/Http/Controllers/SupportController.php:27
 * @route '/support'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/support',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SupportController::index
 * @see app/Http/Controllers/SupportController.php:27
 * @route '/support'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SupportController::index
 * @see app/Http/Controllers/SupportController.php:27
 * @route '/support'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SupportController::index
 * @see app/Http/Controllers/SupportController.php:27
 * @route '/support'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SupportController::index
 * @see app/Http/Controllers/SupportController.php:27
 * @route '/support'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SupportController::index
 * @see app/Http/Controllers/SupportController.php:27
 * @route '/support'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SupportController::index
 * @see app/Http/Controllers/SupportController.php:27
 * @route '/support'
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
* @see \App\Http\Controllers\SupportController::create
 * @see app/Http/Controllers/SupportController.php:44
 * @route '/support/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/support/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SupportController::create
 * @see app/Http/Controllers/SupportController.php:44
 * @route '/support/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SupportController::create
 * @see app/Http/Controllers/SupportController.php:44
 * @route '/support/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SupportController::create
 * @see app/Http/Controllers/SupportController.php:44
 * @route '/support/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SupportController::create
 * @see app/Http/Controllers/SupportController.php:44
 * @route '/support/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SupportController::create
 * @see app/Http/Controllers/SupportController.php:44
 * @route '/support/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SupportController::create
 * @see app/Http/Controllers/SupportController.php:44
 * @route '/support/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\SupportController::store
 * @see app/Http/Controllers/SupportController.php:111
 * @route '/support'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/support',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SupportController::store
 * @see app/Http/Controllers/SupportController.php:111
 * @route '/support'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SupportController::store
 * @see app/Http/Controllers/SupportController.php:111
 * @route '/support'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SupportController::store
 * @see app/Http/Controllers/SupportController.php:111
 * @route '/support'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SupportController::store
 * @see app/Http/Controllers/SupportController.php:111
 * @route '/support'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\SupportController::show
 * @see app/Http/Controllers/SupportController.php:159
 * @route '/support/{ticket}'
 */
export const show = (args: { ticket: string | { uuid: string } } | [ticket: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/support/{ticket}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SupportController::show
 * @see app/Http/Controllers/SupportController.php:159
 * @route '/support/{ticket}'
 */
show.url = (args: { ticket: string | { uuid: string } } | [ticket: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ticket: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { ticket: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    ticket: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ticket: typeof args.ticket === 'object'
                ? args.ticket.uuid
                : args.ticket,
                }

    return show.definition.url
            .replace('{ticket}', parsedArgs.ticket.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SupportController::show
 * @see app/Http/Controllers/SupportController.php:159
 * @route '/support/{ticket}'
 */
show.get = (args: { ticket: string | { uuid: string } } | [ticket: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SupportController::show
 * @see app/Http/Controllers/SupportController.php:159
 * @route '/support/{ticket}'
 */
show.head = (args: { ticket: string | { uuid: string } } | [ticket: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SupportController::show
 * @see app/Http/Controllers/SupportController.php:159
 * @route '/support/{ticket}'
 */
    const showForm = (args: { ticket: string | { uuid: string } } | [ticket: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SupportController::show
 * @see app/Http/Controllers/SupportController.php:159
 * @route '/support/{ticket}'
 */
        showForm.get = (args: { ticket: string | { uuid: string } } | [ticket: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SupportController::show
 * @see app/Http/Controllers/SupportController.php:159
 * @route '/support/{ticket}'
 */
        showForm.head = (args: { ticket: string | { uuid: string } } | [ticket: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\SupportController::storeMessage
 * @see app/Http/Controllers/SupportController.php:240
 * @route '/support/{ticket}/messages'
 */
export const storeMessage = (args: { ticket: string | { uuid: string } } | [ticket: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeMessage.url(args, options),
    method: 'post',
})

storeMessage.definition = {
    methods: ["post"],
    url: '/support/{ticket}/messages',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SupportController::storeMessage
 * @see app/Http/Controllers/SupportController.php:240
 * @route '/support/{ticket}/messages'
 */
storeMessage.url = (args: { ticket: string | { uuid: string } } | [ticket: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ticket: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { ticket: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    ticket: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ticket: typeof args.ticket === 'object'
                ? args.ticket.uuid
                : args.ticket,
                }

    return storeMessage.definition.url
            .replace('{ticket}', parsedArgs.ticket.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SupportController::storeMessage
 * @see app/Http/Controllers/SupportController.php:240
 * @route '/support/{ticket}/messages'
 */
storeMessage.post = (args: { ticket: string | { uuid: string } } | [ticket: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeMessage.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SupportController::storeMessage
 * @see app/Http/Controllers/SupportController.php:240
 * @route '/support/{ticket}/messages'
 */
    const storeMessageForm = (args: { ticket: string | { uuid: string } } | [ticket: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeMessage.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SupportController::storeMessage
 * @see app/Http/Controllers/SupportController.php:240
 * @route '/support/{ticket}/messages'
 */
        storeMessageForm.post = (args: { ticket: string | { uuid: string } } | [ticket: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeMessage.url(args, options),
            method: 'post',
        })
    
    storeMessage.form = storeMessageForm
/**
* @see \App\Http\Controllers\SupportController::downloadAttachment
 * @see app/Http/Controllers/SupportController.php:275
 * @route '/support/{ticket}/attachments/{attachment}'
 */
export const downloadAttachment = (args: { ticket: string | { uuid: string }, attachment: number | { id: number } } | [ticket: string | { uuid: string }, attachment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadAttachment.url(args, options),
    method: 'get',
})

downloadAttachment.definition = {
    methods: ["get","head"],
    url: '/support/{ticket}/attachments/{attachment}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SupportController::downloadAttachment
 * @see app/Http/Controllers/SupportController.php:275
 * @route '/support/{ticket}/attachments/{attachment}'
 */
downloadAttachment.url = (args: { ticket: string | { uuid: string }, attachment: number | { id: number } } | [ticket: string | { uuid: string }, attachment: number | { id: number } ], options?: RouteQueryOptions) => {
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

    return downloadAttachment.definition.url
            .replace('{ticket}', parsedArgs.ticket.toString())
            .replace('{attachment}', parsedArgs.attachment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SupportController::downloadAttachment
 * @see app/Http/Controllers/SupportController.php:275
 * @route '/support/{ticket}/attachments/{attachment}'
 */
downloadAttachment.get = (args: { ticket: string | { uuid: string }, attachment: number | { id: number } } | [ticket: string | { uuid: string }, attachment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadAttachment.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SupportController::downloadAttachment
 * @see app/Http/Controllers/SupportController.php:275
 * @route '/support/{ticket}/attachments/{attachment}'
 */
downloadAttachment.head = (args: { ticket: string | { uuid: string }, attachment: number | { id: number } } | [ticket: string | { uuid: string }, attachment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadAttachment.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SupportController::downloadAttachment
 * @see app/Http/Controllers/SupportController.php:275
 * @route '/support/{ticket}/attachments/{attachment}'
 */
    const downloadAttachmentForm = (args: { ticket: string | { uuid: string }, attachment: number | { id: number } } | [ticket: string | { uuid: string }, attachment: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: downloadAttachment.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SupportController::downloadAttachment
 * @see app/Http/Controllers/SupportController.php:275
 * @route '/support/{ticket}/attachments/{attachment}'
 */
        downloadAttachmentForm.get = (args: { ticket: string | { uuid: string }, attachment: number | { id: number } } | [ticket: string | { uuid: string }, attachment: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadAttachment.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SupportController::downloadAttachment
 * @see app/Http/Controllers/SupportController.php:275
 * @route '/support/{ticket}/attachments/{attachment}'
 */
        downloadAttachmentForm.head = (args: { ticket: string | { uuid: string }, attachment: number | { id: number } } | [ticket: string | { uuid: string }, attachment: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadAttachment.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    downloadAttachment.form = downloadAttachmentForm
const SupportController = { index, create, store, show, storeMessage, downloadAttachment }

export default SupportController