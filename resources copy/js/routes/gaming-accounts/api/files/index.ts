import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\GamingAccountController::list
 * @see app/Http/Controllers/GamingAccountController.php:715
 * @route '/gaming-accounts/{game_server_account}/api/files/list'
 */
export const list = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: list.url(args, options),
    method: 'get',
})

list.definition = {
    methods: ["get","head"],
    url: '/gaming-accounts/{game_server_account}/api/files/list',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GamingAccountController::list
 * @see app/Http/Controllers/GamingAccountController.php:715
 * @route '/gaming-accounts/{game_server_account}/api/files/list'
 */
list.url = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { game_server_account: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    game_server_account: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        game_server_account: args.game_server_account,
                }

    return list.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::list
 * @see app/Http/Controllers/GamingAccountController.php:715
 * @route '/gaming-accounts/{game_server_account}/api/files/list'
 */
list.get = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: list.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GamingAccountController::list
 * @see app/Http/Controllers/GamingAccountController.php:715
 * @route '/gaming-accounts/{game_server_account}/api/files/list'
 */
list.head = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: list.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::list
 * @see app/Http/Controllers/GamingAccountController.php:715
 * @route '/gaming-accounts/{game_server_account}/api/files/list'
 */
    const listForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: list.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::list
 * @see app/Http/Controllers/GamingAccountController.php:715
 * @route '/gaming-accounts/{game_server_account}/api/files/list'
 */
        listForm.get = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: list.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\GamingAccountController::list
 * @see app/Http/Controllers/GamingAccountController.php:715
 * @route '/gaming-accounts/{game_server_account}/api/files/list'
 */
        listForm.head = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: list.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    list.form = listForm
/**
* @see \App\Http\Controllers\GamingAccountController::contents
 * @see app/Http/Controllers/GamingAccountController.php:738
 * @route '/gaming-accounts/{game_server_account}/api/files/contents'
 */
export const contents = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: contents.url(args, options),
    method: 'get',
})

contents.definition = {
    methods: ["get","head"],
    url: '/gaming-accounts/{game_server_account}/api/files/contents',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GamingAccountController::contents
 * @see app/Http/Controllers/GamingAccountController.php:738
 * @route '/gaming-accounts/{game_server_account}/api/files/contents'
 */
contents.url = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { game_server_account: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    game_server_account: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        game_server_account: args.game_server_account,
                }

    return contents.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::contents
 * @see app/Http/Controllers/GamingAccountController.php:738
 * @route '/gaming-accounts/{game_server_account}/api/files/contents'
 */
contents.get = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: contents.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GamingAccountController::contents
 * @see app/Http/Controllers/GamingAccountController.php:738
 * @route '/gaming-accounts/{game_server_account}/api/files/contents'
 */
contents.head = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: contents.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::contents
 * @see app/Http/Controllers/GamingAccountController.php:738
 * @route '/gaming-accounts/{game_server_account}/api/files/contents'
 */
    const contentsForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: contents.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::contents
 * @see app/Http/Controllers/GamingAccountController.php:738
 * @route '/gaming-accounts/{game_server_account}/api/files/contents'
 */
        contentsForm.get = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: contents.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\GamingAccountController::contents
 * @see app/Http/Controllers/GamingAccountController.php:738
 * @route '/gaming-accounts/{game_server_account}/api/files/contents'
 */
        contentsForm.head = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: contents.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    contents.form = contentsForm
/**
* @see \App\Http\Controllers\GamingAccountController::write
 * @see app/Http/Controllers/GamingAccountController.php:761
 * @route '/gaming-accounts/{game_server_account}/api/files/write'
 */
export const write = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: write.url(args, options),
    method: 'post',
})

write.definition = {
    methods: ["post"],
    url: '/gaming-accounts/{game_server_account}/api/files/write',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GamingAccountController::write
 * @see app/Http/Controllers/GamingAccountController.php:761
 * @route '/gaming-accounts/{game_server_account}/api/files/write'
 */
write.url = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { game_server_account: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    game_server_account: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        game_server_account: args.game_server_account,
                }

    return write.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::write
 * @see app/Http/Controllers/GamingAccountController.php:761
 * @route '/gaming-accounts/{game_server_account}/api/files/write'
 */
write.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: write.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::write
 * @see app/Http/Controllers/GamingAccountController.php:761
 * @route '/gaming-accounts/{game_server_account}/api/files/write'
 */
    const writeForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: write.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::write
 * @see app/Http/Controllers/GamingAccountController.php:761
 * @route '/gaming-accounts/{game_server_account}/api/files/write'
 */
        writeForm.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: write.url(args, options),
            method: 'post',
        })
    
    write.form = writeForm
/**
* @see \App\Http\Controllers\GamingAccountController::download
 * @see app/Http/Controllers/GamingAccountController.php:788
 * @route '/gaming-accounts/{game_server_account}/api/files/download'
 */
export const download = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/gaming-accounts/{game_server_account}/api/files/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GamingAccountController::download
 * @see app/Http/Controllers/GamingAccountController.php:788
 * @route '/gaming-accounts/{game_server_account}/api/files/download'
 */
download.url = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { game_server_account: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    game_server_account: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        game_server_account: args.game_server_account,
                }

    return download.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::download
 * @see app/Http/Controllers/GamingAccountController.php:788
 * @route '/gaming-accounts/{game_server_account}/api/files/download'
 */
download.get = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GamingAccountController::download
 * @see app/Http/Controllers/GamingAccountController.php:788
 * @route '/gaming-accounts/{game_server_account}/api/files/download'
 */
download.head = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::download
 * @see app/Http/Controllers/GamingAccountController.php:788
 * @route '/gaming-accounts/{game_server_account}/api/files/download'
 */
    const downloadForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: download.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::download
 * @see app/Http/Controllers/GamingAccountController.php:788
 * @route '/gaming-accounts/{game_server_account}/api/files/download'
 */
        downloadForm.get = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\GamingAccountController::download
 * @see app/Http/Controllers/GamingAccountController.php:788
 * @route '/gaming-accounts/{game_server_account}/api/files/download'
 */
        downloadForm.head = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    download.form = downloadForm
/**
* @see \App\Http\Controllers\GamingAccountController::createFolder
 * @see app/Http/Controllers/GamingAccountController.php:826
 * @route '/gaming-accounts/{game_server_account}/api/files/create-folder'
 */
export const createFolder = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createFolder.url(args, options),
    method: 'post',
})

createFolder.definition = {
    methods: ["post"],
    url: '/gaming-accounts/{game_server_account}/api/files/create-folder',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GamingAccountController::createFolder
 * @see app/Http/Controllers/GamingAccountController.php:826
 * @route '/gaming-accounts/{game_server_account}/api/files/create-folder'
 */
createFolder.url = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { game_server_account: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    game_server_account: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        game_server_account: args.game_server_account,
                }

    return createFolder.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::createFolder
 * @see app/Http/Controllers/GamingAccountController.php:826
 * @route '/gaming-accounts/{game_server_account}/api/files/create-folder'
 */
createFolder.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createFolder.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::createFolder
 * @see app/Http/Controllers/GamingAccountController.php:826
 * @route '/gaming-accounts/{game_server_account}/api/files/create-folder'
 */
    const createFolderForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: createFolder.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::createFolder
 * @see app/Http/Controllers/GamingAccountController.php:826
 * @route '/gaming-accounts/{game_server_account}/api/files/create-folder'
 */
        createFolderForm.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: createFolder.url(args, options),
            method: 'post',
        })
    
    createFolder.form = createFolderForm
/**
* @see \App\Http\Controllers\GamingAccountController::deleteMethod
 * @see app/Http/Controllers/GamingAccountController.php:853
 * @route '/gaming-accounts/{game_server_account}/api/files/delete'
 */
export const deleteMethod = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: deleteMethod.url(args, options),
    method: 'post',
})

deleteMethod.definition = {
    methods: ["post"],
    url: '/gaming-accounts/{game_server_account}/api/files/delete',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GamingAccountController::deleteMethod
 * @see app/Http/Controllers/GamingAccountController.php:853
 * @route '/gaming-accounts/{game_server_account}/api/files/delete'
 */
deleteMethod.url = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { game_server_account: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    game_server_account: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        game_server_account: args.game_server_account,
                }

    return deleteMethod.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::deleteMethod
 * @see app/Http/Controllers/GamingAccountController.php:853
 * @route '/gaming-accounts/{game_server_account}/api/files/delete'
 */
deleteMethod.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: deleteMethod.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::deleteMethod
 * @see app/Http/Controllers/GamingAccountController.php:853
 * @route '/gaming-accounts/{game_server_account}/api/files/delete'
 */
    const deleteMethodForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: deleteMethod.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::deleteMethod
 * @see app/Http/Controllers/GamingAccountController.php:853
 * @route '/gaming-accounts/{game_server_account}/api/files/delete'
 */
        deleteMethodForm.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: deleteMethod.url(args, options),
            method: 'post',
        })
    
    deleteMethod.form = deleteMethodForm
/**
* @see \App\Http\Controllers\GamingAccountController::rename
 * @see app/Http/Controllers/GamingAccountController.php:884
 * @route '/gaming-accounts/{game_server_account}/api/files/rename'
 */
export const rename = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: rename.url(args, options),
    method: 'put',
})

rename.definition = {
    methods: ["put"],
    url: '/gaming-accounts/{game_server_account}/api/files/rename',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\GamingAccountController::rename
 * @see app/Http/Controllers/GamingAccountController.php:884
 * @route '/gaming-accounts/{game_server_account}/api/files/rename'
 */
rename.url = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { game_server_account: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    game_server_account: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        game_server_account: args.game_server_account,
                }

    return rename.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::rename
 * @see app/Http/Controllers/GamingAccountController.php:884
 * @route '/gaming-accounts/{game_server_account}/api/files/rename'
 */
rename.put = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: rename.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::rename
 * @see app/Http/Controllers/GamingAccountController.php:884
 * @route '/gaming-accounts/{game_server_account}/api/files/rename'
 */
    const renameForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: rename.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::rename
 * @see app/Http/Controllers/GamingAccountController.php:884
 * @route '/gaming-accounts/{game_server_account}/api/files/rename'
 */
        renameForm.put = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: rename.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    rename.form = renameForm
/**
* @see \App\Http\Controllers\GamingAccountController::upload
 * @see app/Http/Controllers/GamingAccountController.php:920
 * @route '/gaming-accounts/{game_server_account}/api/files/upload'
 */
export const upload = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: upload.url(args, options),
    method: 'post',
})

upload.definition = {
    methods: ["post"],
    url: '/gaming-accounts/{game_server_account}/api/files/upload',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GamingAccountController::upload
 * @see app/Http/Controllers/GamingAccountController.php:920
 * @route '/gaming-accounts/{game_server_account}/api/files/upload'
 */
upload.url = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { game_server_account: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    game_server_account: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        game_server_account: args.game_server_account,
                }

    return upload.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::upload
 * @see app/Http/Controllers/GamingAccountController.php:920
 * @route '/gaming-accounts/{game_server_account}/api/files/upload'
 */
upload.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: upload.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::upload
 * @see app/Http/Controllers/GamingAccountController.php:920
 * @route '/gaming-accounts/{game_server_account}/api/files/upload'
 */
    const uploadForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: upload.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::upload
 * @see app/Http/Controllers/GamingAccountController.php:920
 * @route '/gaming-accounts/{game_server_account}/api/files/upload'
 */
        uploadForm.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: upload.url(args, options),
            method: 'post',
        })
    
    upload.form = uploadForm
/**
* @see \App\Http\Controllers\GamingAccountController::compress
 * @see app/Http/Controllers/GamingAccountController.php:960
 * @route '/gaming-accounts/{game_server_account}/api/files/compress'
 */
export const compress = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: compress.url(args, options),
    method: 'post',
})

compress.definition = {
    methods: ["post"],
    url: '/gaming-accounts/{game_server_account}/api/files/compress',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GamingAccountController::compress
 * @see app/Http/Controllers/GamingAccountController.php:960
 * @route '/gaming-accounts/{game_server_account}/api/files/compress'
 */
compress.url = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { game_server_account: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    game_server_account: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        game_server_account: args.game_server_account,
                }

    return compress.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::compress
 * @see app/Http/Controllers/GamingAccountController.php:960
 * @route '/gaming-accounts/{game_server_account}/api/files/compress'
 */
compress.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: compress.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::compress
 * @see app/Http/Controllers/GamingAccountController.php:960
 * @route '/gaming-accounts/{game_server_account}/api/files/compress'
 */
    const compressForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: compress.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::compress
 * @see app/Http/Controllers/GamingAccountController.php:960
 * @route '/gaming-accounts/{game_server_account}/api/files/compress'
 */
        compressForm.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: compress.url(args, options),
            method: 'post',
        })
    
    compress.form = compressForm
/**
* @see \App\Http\Controllers\GamingAccountController::decompress
 * @see app/Http/Controllers/GamingAccountController.php:991
 * @route '/gaming-accounts/{game_server_account}/api/files/decompress'
 */
export const decompress = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: decompress.url(args, options),
    method: 'post',
})

decompress.definition = {
    methods: ["post"],
    url: '/gaming-accounts/{game_server_account}/api/files/decompress',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GamingAccountController::decompress
 * @see app/Http/Controllers/GamingAccountController.php:991
 * @route '/gaming-accounts/{game_server_account}/api/files/decompress'
 */
decompress.url = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { game_server_account: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    game_server_account: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        game_server_account: args.game_server_account,
                }

    return decompress.definition.url
            .replace('{game_server_account}', parsedArgs.game_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingAccountController::decompress
 * @see app/Http/Controllers/GamingAccountController.php:991
 * @route '/gaming-accounts/{game_server_account}/api/files/decompress'
 */
decompress.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: decompress.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\GamingAccountController::decompress
 * @see app/Http/Controllers/GamingAccountController.php:991
 * @route '/gaming-accounts/{game_server_account}/api/files/decompress'
 */
    const decompressForm = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: decompress.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GamingAccountController::decompress
 * @see app/Http/Controllers/GamingAccountController.php:991
 * @route '/gaming-accounts/{game_server_account}/api/files/decompress'
 */
        decompressForm.post = (args: { game_server_account: string | number } | [game_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: decompress.url(args, options),
            method: 'post',
        })
    
    decompress.form = decompressForm
const files = {
    list: Object.assign(list, list),
contents: Object.assign(contents, contents),
write: Object.assign(write, write),
download: Object.assign(download, download),
createFolder: Object.assign(createFolder, createFolder),
delete: Object.assign(deleteMethod, deleteMethod),
rename: Object.assign(rename, rename),
upload: Object.assign(upload, upload),
compress: Object.assign(compress, compress),
decompress: Object.assign(decompress, decompress),
}

export default files