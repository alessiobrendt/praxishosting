import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\EmailController::index
 * @see app/Http/Controllers/Admin/EmailController.php:20
 * @route '/admin/emails'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/emails',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\EmailController::index
 * @see app/Http/Controllers/Admin/EmailController.php:20
 * @route '/admin/emails'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\EmailController::index
 * @see app/Http/Controllers/Admin/EmailController.php:20
 * @route '/admin/emails'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\EmailController::index
 * @see app/Http/Controllers/Admin/EmailController.php:20
 * @route '/admin/emails'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\EmailController::index
 * @see app/Http/Controllers/Admin/EmailController.php:20
 * @route '/admin/emails'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\EmailController::index
 * @see app/Http/Controllers/Admin/EmailController.php:20
 * @route '/admin/emails'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\EmailController::index
 * @see app/Http/Controllers/Admin/EmailController.php:20
 * @route '/admin/emails'
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
* @see \App\Http\Controllers\Admin\EmailController::edit
 * @see app/Http/Controllers/Admin/EmailController.php:29
 * @route '/admin/emails/{emailTemplate}/edit'
 */
export const edit = (args: { emailTemplate: string | { key: string } } | [emailTemplate: string | { key: string } ] | string | { key: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/emails/{emailTemplate}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\EmailController::edit
 * @see app/Http/Controllers/Admin/EmailController.php:29
 * @route '/admin/emails/{emailTemplate}/edit'
 */
edit.url = (args: { emailTemplate: string | { key: string } } | [emailTemplate: string | { key: string } ] | string | { key: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { emailTemplate: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'key' in args) {
            args = { emailTemplate: args.key }
        }
    
    if (Array.isArray(args)) {
        args = {
                    emailTemplate: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        emailTemplate: typeof args.emailTemplate === 'object'
                ? args.emailTemplate.key
                : args.emailTemplate,
                }

    return edit.definition.url
            .replace('{emailTemplate}', parsedArgs.emailTemplate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\EmailController::edit
 * @see app/Http/Controllers/Admin/EmailController.php:29
 * @route '/admin/emails/{emailTemplate}/edit'
 */
edit.get = (args: { emailTemplate: string | { key: string } } | [emailTemplate: string | { key: string } ] | string | { key: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\EmailController::edit
 * @see app/Http/Controllers/Admin/EmailController.php:29
 * @route '/admin/emails/{emailTemplate}/edit'
 */
edit.head = (args: { emailTemplate: string | { key: string } } | [emailTemplate: string | { key: string } ] | string | { key: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\EmailController::edit
 * @see app/Http/Controllers/Admin/EmailController.php:29
 * @route '/admin/emails/{emailTemplate}/edit'
 */
    const editForm = (args: { emailTemplate: string | { key: string } } | [emailTemplate: string | { key: string } ] | string | { key: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\EmailController::edit
 * @see app/Http/Controllers/Admin/EmailController.php:29
 * @route '/admin/emails/{emailTemplate}/edit'
 */
        editForm.get = (args: { emailTemplate: string | { key: string } } | [emailTemplate: string | { key: string } ] | string | { key: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\EmailController::edit
 * @see app/Http/Controllers/Admin/EmailController.php:29
 * @route '/admin/emails/{emailTemplate}/edit'
 */
        editForm.head = (args: { emailTemplate: string | { key: string } } | [emailTemplate: string | { key: string } ] | string | { key: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\Admin\EmailController::update
 * @see app/Http/Controllers/Admin/EmailController.php:39
 * @route '/admin/emails/{emailTemplate}'
 */
export const update = (args: { emailTemplate: string | { key: string } } | [emailTemplate: string | { key: string } ] | string | { key: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/emails/{emailTemplate}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\EmailController::update
 * @see app/Http/Controllers/Admin/EmailController.php:39
 * @route '/admin/emails/{emailTemplate}'
 */
update.url = (args: { emailTemplate: string | { key: string } } | [emailTemplate: string | { key: string } ] | string | { key: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { emailTemplate: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'key' in args) {
            args = { emailTemplate: args.key }
        }
    
    if (Array.isArray(args)) {
        args = {
                    emailTemplate: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        emailTemplate: typeof args.emailTemplate === 'object'
                ? args.emailTemplate.key
                : args.emailTemplate,
                }

    return update.definition.url
            .replace('{emailTemplate}', parsedArgs.emailTemplate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\EmailController::update
 * @see app/Http/Controllers/Admin/EmailController.php:39
 * @route '/admin/emails/{emailTemplate}'
 */
update.put = (args: { emailTemplate: string | { key: string } } | [emailTemplate: string | { key: string } ] | string | { key: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\EmailController::update
 * @see app/Http/Controllers/Admin/EmailController.php:39
 * @route '/admin/emails/{emailTemplate}'
 */
    const updateForm = (args: { emailTemplate: string | { key: string } } | [emailTemplate: string | { key: string } ] | string | { key: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\EmailController::update
 * @see app/Http/Controllers/Admin/EmailController.php:39
 * @route '/admin/emails/{emailTemplate}'
 */
        updateForm.put = (args: { emailTemplate: string | { key: string } } | [emailTemplate: string | { key: string } ] | string | { key: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Admin\EmailController::preview
 * @see app/Http/Controllers/Admin/EmailController.php:53
 * @route '/admin/emails/{emailTemplate}/preview'
 */
export const preview = (args: { emailTemplate: string | { key: string } } | [emailTemplate: string | { key: string } ] | string | { key: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: preview.url(args, options),
    method: 'post',
})

preview.definition = {
    methods: ["post"],
    url: '/admin/emails/{emailTemplate}/preview',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\EmailController::preview
 * @see app/Http/Controllers/Admin/EmailController.php:53
 * @route '/admin/emails/{emailTemplate}/preview'
 */
preview.url = (args: { emailTemplate: string | { key: string } } | [emailTemplate: string | { key: string } ] | string | { key: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { emailTemplate: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'key' in args) {
            args = { emailTemplate: args.key }
        }
    
    if (Array.isArray(args)) {
        args = {
                    emailTemplate: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        emailTemplate: typeof args.emailTemplate === 'object'
                ? args.emailTemplate.key
                : args.emailTemplate,
                }

    return preview.definition.url
            .replace('{emailTemplate}', parsedArgs.emailTemplate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\EmailController::preview
 * @see app/Http/Controllers/Admin/EmailController.php:53
 * @route '/admin/emails/{emailTemplate}/preview'
 */
preview.post = (args: { emailTemplate: string | { key: string } } | [emailTemplate: string | { key: string } ] | string | { key: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: preview.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\EmailController::preview
 * @see app/Http/Controllers/Admin/EmailController.php:53
 * @route '/admin/emails/{emailTemplate}/preview'
 */
    const previewForm = (args: { emailTemplate: string | { key: string } } | [emailTemplate: string | { key: string } ] | string | { key: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: preview.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\EmailController::preview
 * @see app/Http/Controllers/Admin/EmailController.php:53
 * @route '/admin/emails/{emailTemplate}/preview'
 */
        previewForm.post = (args: { emailTemplate: string | { key: string } } | [emailTemplate: string | { key: string } ] | string | { key: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: preview.url(args, options),
            method: 'post',
        })
    
    preview.form = previewForm
/**
* @see \App\Http\Controllers\Admin\EmailController::sendTest
 * @see app/Http/Controllers/Admin/EmailController.php:86
 * @route '/admin/emails/{emailTemplate}/send-test'
 */
export const sendTest = (args: { emailTemplate: string | { key: string } } | [emailTemplate: string | { key: string } ] | string | { key: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendTest.url(args, options),
    method: 'post',
})

sendTest.definition = {
    methods: ["post"],
    url: '/admin/emails/{emailTemplate}/send-test',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\EmailController::sendTest
 * @see app/Http/Controllers/Admin/EmailController.php:86
 * @route '/admin/emails/{emailTemplate}/send-test'
 */
sendTest.url = (args: { emailTemplate: string | { key: string } } | [emailTemplate: string | { key: string } ] | string | { key: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { emailTemplate: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'key' in args) {
            args = { emailTemplate: args.key }
        }
    
    if (Array.isArray(args)) {
        args = {
                    emailTemplate: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        emailTemplate: typeof args.emailTemplate === 'object'
                ? args.emailTemplate.key
                : args.emailTemplate,
                }

    return sendTest.definition.url
            .replace('{emailTemplate}', parsedArgs.emailTemplate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\EmailController::sendTest
 * @see app/Http/Controllers/Admin/EmailController.php:86
 * @route '/admin/emails/{emailTemplate}/send-test'
 */
sendTest.post = (args: { emailTemplate: string | { key: string } } | [emailTemplate: string | { key: string } ] | string | { key: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendTest.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\EmailController::sendTest
 * @see app/Http/Controllers/Admin/EmailController.php:86
 * @route '/admin/emails/{emailTemplate}/send-test'
 */
    const sendTestForm = (args: { emailTemplate: string | { key: string } } | [emailTemplate: string | { key: string } ] | string | { key: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: sendTest.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\EmailController::sendTest
 * @see app/Http/Controllers/Admin/EmailController.php:86
 * @route '/admin/emails/{emailTemplate}/send-test'
 */
        sendTestForm.post = (args: { emailTemplate: string | { key: string } } | [emailTemplate: string | { key: string } ] | string | { key: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: sendTest.url(args, options),
            method: 'post',
        })
    
    sendTest.form = sendTestForm
const emails = {
    index: Object.assign(index, index),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
preview: Object.assign(preview, preview),
sendTest: Object.assign(sendTest, sendTest),
}

export default emails