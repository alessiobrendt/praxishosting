import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
import pterodactylNests from './pterodactyl-nests'
/**
* @see \App\Http\Controllers\Admin\HostingServerController::check
 * @see app/Http/Controllers/Admin/HostingServerController.php:216
 * @route '/admin/hosting-servers/{hosting_server}/check'
 */
export const check = (args: { hosting_server: string | number } | [hosting_server: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: check.url(args, options),
    method: 'get',
})

check.definition = {
    methods: ["get","head"],
    url: '/admin/hosting-servers/{hosting_server}/check',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\HostingServerController::check
 * @see app/Http/Controllers/Admin/HostingServerController.php:216
 * @route '/admin/hosting-servers/{hosting_server}/check'
 */
check.url = (args: { hosting_server: string | number } | [hosting_server: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { hosting_server: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    hosting_server: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        hosting_server: args.hosting_server,
                }

    return check.definition.url
            .replace('{hosting_server}', parsedArgs.hosting_server.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\HostingServerController::check
 * @see app/Http/Controllers/Admin/HostingServerController.php:216
 * @route '/admin/hosting-servers/{hosting_server}/check'
 */
check.get = (args: { hosting_server: string | number } | [hosting_server: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: check.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\HostingServerController::check
 * @see app/Http/Controllers/Admin/HostingServerController.php:216
 * @route '/admin/hosting-servers/{hosting_server}/check'
 */
check.head = (args: { hosting_server: string | number } | [hosting_server: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: check.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\HostingServerController::check
 * @see app/Http/Controllers/Admin/HostingServerController.php:216
 * @route '/admin/hosting-servers/{hosting_server}/check'
 */
    const checkForm = (args: { hosting_server: string | number } | [hosting_server: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: check.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\HostingServerController::check
 * @see app/Http/Controllers/Admin/HostingServerController.php:216
 * @route '/admin/hosting-servers/{hosting_server}/check'
 */
        checkForm.get = (args: { hosting_server: string | number } | [hosting_server: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: check.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\HostingServerController::check
 * @see app/Http/Controllers/Admin/HostingServerController.php:216
 * @route '/admin/hosting-servers/{hosting_server}/check'
 */
        checkForm.head = (args: { hosting_server: string | number } | [hosting_server: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: check.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    check.form = checkForm
/**
* @see \App\Http\Controllers\Admin\HostingServerController::index
 * @see app/Http/Controllers/Admin/HostingServerController.php:28
 * @route '/admin/hosting-servers'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/hosting-servers',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\HostingServerController::index
 * @see app/Http/Controllers/Admin/HostingServerController.php:28
 * @route '/admin/hosting-servers'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\HostingServerController::index
 * @see app/Http/Controllers/Admin/HostingServerController.php:28
 * @route '/admin/hosting-servers'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\HostingServerController::index
 * @see app/Http/Controllers/Admin/HostingServerController.php:28
 * @route '/admin/hosting-servers'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\HostingServerController::index
 * @see app/Http/Controllers/Admin/HostingServerController.php:28
 * @route '/admin/hosting-servers'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\HostingServerController::index
 * @see app/Http/Controllers/Admin/HostingServerController.php:28
 * @route '/admin/hosting-servers'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\HostingServerController::index
 * @see app/Http/Controllers/Admin/HostingServerController.php:28
 * @route '/admin/hosting-servers'
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
* @see \App\Http\Controllers\Admin\HostingServerController::create
 * @see app/Http/Controllers/Admin/HostingServerController.php:45
 * @route '/admin/hosting-servers/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/hosting-servers/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\HostingServerController::create
 * @see app/Http/Controllers/Admin/HostingServerController.php:45
 * @route '/admin/hosting-servers/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\HostingServerController::create
 * @see app/Http/Controllers/Admin/HostingServerController.php:45
 * @route '/admin/hosting-servers/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\HostingServerController::create
 * @see app/Http/Controllers/Admin/HostingServerController.php:45
 * @route '/admin/hosting-servers/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\HostingServerController::create
 * @see app/Http/Controllers/Admin/HostingServerController.php:45
 * @route '/admin/hosting-servers/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\HostingServerController::create
 * @see app/Http/Controllers/Admin/HostingServerController.php:45
 * @route '/admin/hosting-servers/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\HostingServerController::create
 * @see app/Http/Controllers/Admin/HostingServerController.php:45
 * @route '/admin/hosting-servers/create'
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
* @see \App\Http\Controllers\Admin\HostingServerController::store
 * @see app/Http/Controllers/Admin/HostingServerController.php:72
 * @route '/admin/hosting-servers'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/hosting-servers',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\HostingServerController::store
 * @see app/Http/Controllers/Admin/HostingServerController.php:72
 * @route '/admin/hosting-servers'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\HostingServerController::store
 * @see app/Http/Controllers/Admin/HostingServerController.php:72
 * @route '/admin/hosting-servers'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\HostingServerController::store
 * @see app/Http/Controllers/Admin/HostingServerController.php:72
 * @route '/admin/hosting-servers'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\HostingServerController::store
 * @see app/Http/Controllers/Admin/HostingServerController.php:72
 * @route '/admin/hosting-servers'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\HostingServerController::show
 * @see app/Http/Controllers/Admin/HostingServerController.php:90
 * @route '/admin/hosting-servers/{hosting_server}'
 */
export const show = (args: { hosting_server: string | number } | [hosting_server: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/hosting-servers/{hosting_server}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\HostingServerController::show
 * @see app/Http/Controllers/Admin/HostingServerController.php:90
 * @route '/admin/hosting-servers/{hosting_server}'
 */
show.url = (args: { hosting_server: string | number } | [hosting_server: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { hosting_server: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    hosting_server: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        hosting_server: args.hosting_server,
                }

    return show.definition.url
            .replace('{hosting_server}', parsedArgs.hosting_server.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\HostingServerController::show
 * @see app/Http/Controllers/Admin/HostingServerController.php:90
 * @route '/admin/hosting-servers/{hosting_server}'
 */
show.get = (args: { hosting_server: string | number } | [hosting_server: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\HostingServerController::show
 * @see app/Http/Controllers/Admin/HostingServerController.php:90
 * @route '/admin/hosting-servers/{hosting_server}'
 */
show.head = (args: { hosting_server: string | number } | [hosting_server: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\HostingServerController::show
 * @see app/Http/Controllers/Admin/HostingServerController.php:90
 * @route '/admin/hosting-servers/{hosting_server}'
 */
    const showForm = (args: { hosting_server: string | number } | [hosting_server: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\HostingServerController::show
 * @see app/Http/Controllers/Admin/HostingServerController.php:90
 * @route '/admin/hosting-servers/{hosting_server}'
 */
        showForm.get = (args: { hosting_server: string | number } | [hosting_server: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\HostingServerController::show
 * @see app/Http/Controllers/Admin/HostingServerController.php:90
 * @route '/admin/hosting-servers/{hosting_server}'
 */
        showForm.head = (args: { hosting_server: string | number } | [hosting_server: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\HostingServerController::edit
 * @see app/Http/Controllers/Admin/HostingServerController.php:159
 * @route '/admin/hosting-servers/{hosting_server}/edit'
 */
export const edit = (args: { hosting_server: string | number } | [hosting_server: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/hosting-servers/{hosting_server}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\HostingServerController::edit
 * @see app/Http/Controllers/Admin/HostingServerController.php:159
 * @route '/admin/hosting-servers/{hosting_server}/edit'
 */
edit.url = (args: { hosting_server: string | number } | [hosting_server: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { hosting_server: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    hosting_server: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        hosting_server: args.hosting_server,
                }

    return edit.definition.url
            .replace('{hosting_server}', parsedArgs.hosting_server.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\HostingServerController::edit
 * @see app/Http/Controllers/Admin/HostingServerController.php:159
 * @route '/admin/hosting-servers/{hosting_server}/edit'
 */
edit.get = (args: { hosting_server: string | number } | [hosting_server: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\HostingServerController::edit
 * @see app/Http/Controllers/Admin/HostingServerController.php:159
 * @route '/admin/hosting-servers/{hosting_server}/edit'
 */
edit.head = (args: { hosting_server: string | number } | [hosting_server: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\HostingServerController::edit
 * @see app/Http/Controllers/Admin/HostingServerController.php:159
 * @route '/admin/hosting-servers/{hosting_server}/edit'
 */
    const editForm = (args: { hosting_server: string | number } | [hosting_server: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\HostingServerController::edit
 * @see app/Http/Controllers/Admin/HostingServerController.php:159
 * @route '/admin/hosting-servers/{hosting_server}/edit'
 */
        editForm.get = (args: { hosting_server: string | number } | [hosting_server: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\HostingServerController::edit
 * @see app/Http/Controllers/Admin/HostingServerController.php:159
 * @route '/admin/hosting-servers/{hosting_server}/edit'
 */
        editForm.head = (args: { hosting_server: string | number } | [hosting_server: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\HostingServerController::update
 * @see app/Http/Controllers/Admin/HostingServerController.php:191
 * @route '/admin/hosting-servers/{hosting_server}'
 */
export const update = (args: { hosting_server: string | number } | [hosting_server: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin/hosting-servers/{hosting_server}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\HostingServerController::update
 * @see app/Http/Controllers/Admin/HostingServerController.php:191
 * @route '/admin/hosting-servers/{hosting_server}'
 */
update.url = (args: { hosting_server: string | number } | [hosting_server: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { hosting_server: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    hosting_server: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        hosting_server: args.hosting_server,
                }

    return update.definition.url
            .replace('{hosting_server}', parsedArgs.hosting_server.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\HostingServerController::update
 * @see app/Http/Controllers/Admin/HostingServerController.php:191
 * @route '/admin/hosting-servers/{hosting_server}'
 */
update.put = (args: { hosting_server: string | number } | [hosting_server: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Admin\HostingServerController::update
 * @see app/Http/Controllers/Admin/HostingServerController.php:191
 * @route '/admin/hosting-servers/{hosting_server}'
 */
update.patch = (args: { hosting_server: string | number } | [hosting_server: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\HostingServerController::update
 * @see app/Http/Controllers/Admin/HostingServerController.php:191
 * @route '/admin/hosting-servers/{hosting_server}'
 */
    const updateForm = (args: { hosting_server: string | number } | [hosting_server: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\HostingServerController::update
 * @see app/Http/Controllers/Admin/HostingServerController.php:191
 * @route '/admin/hosting-servers/{hosting_server}'
 */
        updateForm.put = (args: { hosting_server: string | number } | [hosting_server: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Admin\HostingServerController::update
 * @see app/Http/Controllers/Admin/HostingServerController.php:191
 * @route '/admin/hosting-servers/{hosting_server}'
 */
        updateForm.patch = (args: { hosting_server: string | number } | [hosting_server: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Admin\HostingServerController::destroy
 * @see app/Http/Controllers/Admin/HostingServerController.php:207
 * @route '/admin/hosting-servers/{hosting_server}'
 */
export const destroy = (args: { hosting_server: string | number } | [hosting_server: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/hosting-servers/{hosting_server}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\HostingServerController::destroy
 * @see app/Http/Controllers/Admin/HostingServerController.php:207
 * @route '/admin/hosting-servers/{hosting_server}'
 */
destroy.url = (args: { hosting_server: string | number } | [hosting_server: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { hosting_server: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    hosting_server: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        hosting_server: args.hosting_server,
                }

    return destroy.definition.url
            .replace('{hosting_server}', parsedArgs.hosting_server.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\HostingServerController::destroy
 * @see app/Http/Controllers/Admin/HostingServerController.php:207
 * @route '/admin/hosting-servers/{hosting_server}'
 */
destroy.delete = (args: { hosting_server: string | number } | [hosting_server: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\HostingServerController::destroy
 * @see app/Http/Controllers/Admin/HostingServerController.php:207
 * @route '/admin/hosting-servers/{hosting_server}'
 */
    const destroyForm = (args: { hosting_server: string | number } | [hosting_server: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\HostingServerController::destroy
 * @see app/Http/Controllers/Admin/HostingServerController.php:207
 * @route '/admin/hosting-servers/{hosting_server}'
 */
        destroyForm.delete = (args: { hosting_server: string | number } | [hosting_server: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const hostingServers = {
    check: Object.assign(check, check),
index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
show: Object.assign(show, show),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
pterodactylNests: Object.assign(pterodactylNests, pterodactylNests),
}

export default hostingServers