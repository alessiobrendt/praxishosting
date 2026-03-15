import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\GameserverCloudPlanController::index
 * @see app/Http/Controllers/Admin/GameserverCloudPlanController.php:37
 * @route '/admin/gameserver-cloud-plans'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/gameserver-cloud-plans',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\GameserverCloudPlanController::index
 * @see app/Http/Controllers/Admin/GameserverCloudPlanController.php:37
 * @route '/admin/gameserver-cloud-plans'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\GameserverCloudPlanController::index
 * @see app/Http/Controllers/Admin/GameserverCloudPlanController.php:37
 * @route '/admin/gameserver-cloud-plans'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\GameserverCloudPlanController::index
 * @see app/Http/Controllers/Admin/GameserverCloudPlanController.php:37
 * @route '/admin/gameserver-cloud-plans'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\GameserverCloudPlanController::index
 * @see app/Http/Controllers/Admin/GameserverCloudPlanController.php:37
 * @route '/admin/gameserver-cloud-plans'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\GameserverCloudPlanController::index
 * @see app/Http/Controllers/Admin/GameserverCloudPlanController.php:37
 * @route '/admin/gameserver-cloud-plans'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\GameserverCloudPlanController::index
 * @see app/Http/Controllers/Admin/GameserverCloudPlanController.php:37
 * @route '/admin/gameserver-cloud-plans'
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
* @see \App\Http\Controllers\Admin\GameserverCloudPlanController::create
 * @see app/Http/Controllers/Admin/GameserverCloudPlanController.php:48
 * @route '/admin/gameserver-cloud-plans/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/gameserver-cloud-plans/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\GameserverCloudPlanController::create
 * @see app/Http/Controllers/Admin/GameserverCloudPlanController.php:48
 * @route '/admin/gameserver-cloud-plans/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\GameserverCloudPlanController::create
 * @see app/Http/Controllers/Admin/GameserverCloudPlanController.php:48
 * @route '/admin/gameserver-cloud-plans/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\GameserverCloudPlanController::create
 * @see app/Http/Controllers/Admin/GameserverCloudPlanController.php:48
 * @route '/admin/gameserver-cloud-plans/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\GameserverCloudPlanController::create
 * @see app/Http/Controllers/Admin/GameserverCloudPlanController.php:48
 * @route '/admin/gameserver-cloud-plans/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\GameserverCloudPlanController::create
 * @see app/Http/Controllers/Admin/GameserverCloudPlanController.php:48
 * @route '/admin/gameserver-cloud-plans/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\GameserverCloudPlanController::create
 * @see app/Http/Controllers/Admin/GameserverCloudPlanController.php:48
 * @route '/admin/gameserver-cloud-plans/create'
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
* @see \App\Http\Controllers\Admin\GameserverCloudPlanController::store
 * @see app/Http/Controllers/Admin/GameserverCloudPlanController.php:74
 * @route '/admin/gameserver-cloud-plans'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/gameserver-cloud-plans',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\GameserverCloudPlanController::store
 * @see app/Http/Controllers/Admin/GameserverCloudPlanController.php:74
 * @route '/admin/gameserver-cloud-plans'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\GameserverCloudPlanController::store
 * @see app/Http/Controllers/Admin/GameserverCloudPlanController.php:74
 * @route '/admin/gameserver-cloud-plans'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\GameserverCloudPlanController::store
 * @see app/Http/Controllers/Admin/GameserverCloudPlanController.php:74
 * @route '/admin/gameserver-cloud-plans'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\GameserverCloudPlanController::store
 * @see app/Http/Controllers/Admin/GameserverCloudPlanController.php:74
 * @route '/admin/gameserver-cloud-plans'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\GameserverCloudPlanController::edit
 * @see app/Http/Controllers/Admin/GameserverCloudPlanController.php:90
 * @route '/admin/gameserver-cloud-plans/{gameserver_cloud_plan}/edit'
 */
export const edit = (args: { gameserver_cloud_plan: string | number } | [gameserver_cloud_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/gameserver-cloud-plans/{gameserver_cloud_plan}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\GameserverCloudPlanController::edit
 * @see app/Http/Controllers/Admin/GameserverCloudPlanController.php:90
 * @route '/admin/gameserver-cloud-plans/{gameserver_cloud_plan}/edit'
 */
edit.url = (args: { gameserver_cloud_plan: string | number } | [gameserver_cloud_plan: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { gameserver_cloud_plan: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    gameserver_cloud_plan: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        gameserver_cloud_plan: args.gameserver_cloud_plan,
                }

    return edit.definition.url
            .replace('{gameserver_cloud_plan}', parsedArgs.gameserver_cloud_plan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\GameserverCloudPlanController::edit
 * @see app/Http/Controllers/Admin/GameserverCloudPlanController.php:90
 * @route '/admin/gameserver-cloud-plans/{gameserver_cloud_plan}/edit'
 */
edit.get = (args: { gameserver_cloud_plan: string | number } | [gameserver_cloud_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\GameserverCloudPlanController::edit
 * @see app/Http/Controllers/Admin/GameserverCloudPlanController.php:90
 * @route '/admin/gameserver-cloud-plans/{gameserver_cloud_plan}/edit'
 */
edit.head = (args: { gameserver_cloud_plan: string | number } | [gameserver_cloud_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\GameserverCloudPlanController::edit
 * @see app/Http/Controllers/Admin/GameserverCloudPlanController.php:90
 * @route '/admin/gameserver-cloud-plans/{gameserver_cloud_plan}/edit'
 */
    const editForm = (args: { gameserver_cloud_plan: string | number } | [gameserver_cloud_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\GameserverCloudPlanController::edit
 * @see app/Http/Controllers/Admin/GameserverCloudPlanController.php:90
 * @route '/admin/gameserver-cloud-plans/{gameserver_cloud_plan}/edit'
 */
        editForm.get = (args: { gameserver_cloud_plan: string | number } | [gameserver_cloud_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\GameserverCloudPlanController::edit
 * @see app/Http/Controllers/Admin/GameserverCloudPlanController.php:90
 * @route '/admin/gameserver-cloud-plans/{gameserver_cloud_plan}/edit'
 */
        editForm.head = (args: { gameserver_cloud_plan: string | number } | [gameserver_cloud_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\GameserverCloudPlanController::update
 * @see app/Http/Controllers/Admin/GameserverCloudPlanController.php:118
 * @route '/admin/gameserver-cloud-plans/{gameserver_cloud_plan}'
 */
export const update = (args: { gameserver_cloud_plan: string | number } | [gameserver_cloud_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin/gameserver-cloud-plans/{gameserver_cloud_plan}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\GameserverCloudPlanController::update
 * @see app/Http/Controllers/Admin/GameserverCloudPlanController.php:118
 * @route '/admin/gameserver-cloud-plans/{gameserver_cloud_plan}'
 */
update.url = (args: { gameserver_cloud_plan: string | number } | [gameserver_cloud_plan: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { gameserver_cloud_plan: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    gameserver_cloud_plan: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        gameserver_cloud_plan: args.gameserver_cloud_plan,
                }

    return update.definition.url
            .replace('{gameserver_cloud_plan}', parsedArgs.gameserver_cloud_plan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\GameserverCloudPlanController::update
 * @see app/Http/Controllers/Admin/GameserverCloudPlanController.php:118
 * @route '/admin/gameserver-cloud-plans/{gameserver_cloud_plan}'
 */
update.put = (args: { gameserver_cloud_plan: string | number } | [gameserver_cloud_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Admin\GameserverCloudPlanController::update
 * @see app/Http/Controllers/Admin/GameserverCloudPlanController.php:118
 * @route '/admin/gameserver-cloud-plans/{gameserver_cloud_plan}'
 */
update.patch = (args: { gameserver_cloud_plan: string | number } | [gameserver_cloud_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\GameserverCloudPlanController::update
 * @see app/Http/Controllers/Admin/GameserverCloudPlanController.php:118
 * @route '/admin/gameserver-cloud-plans/{gameserver_cloud_plan}'
 */
    const updateForm = (args: { gameserver_cloud_plan: string | number } | [gameserver_cloud_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\GameserverCloudPlanController::update
 * @see app/Http/Controllers/Admin/GameserverCloudPlanController.php:118
 * @route '/admin/gameserver-cloud-plans/{gameserver_cloud_plan}'
 */
        updateForm.put = (args: { gameserver_cloud_plan: string | number } | [gameserver_cloud_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Admin\GameserverCloudPlanController::update
 * @see app/Http/Controllers/Admin/GameserverCloudPlanController.php:118
 * @route '/admin/gameserver-cloud-plans/{gameserver_cloud_plan}'
 */
        updateForm.patch = (args: { gameserver_cloud_plan: string | number } | [gameserver_cloud_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\GameserverCloudPlanController::destroy
 * @see app/Http/Controllers/Admin/GameserverCloudPlanController.php:131
 * @route '/admin/gameserver-cloud-plans/{gameserver_cloud_plan}'
 */
export const destroy = (args: { gameserver_cloud_plan: string | number } | [gameserver_cloud_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/gameserver-cloud-plans/{gameserver_cloud_plan}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\GameserverCloudPlanController::destroy
 * @see app/Http/Controllers/Admin/GameserverCloudPlanController.php:131
 * @route '/admin/gameserver-cloud-plans/{gameserver_cloud_plan}'
 */
destroy.url = (args: { gameserver_cloud_plan: string | number } | [gameserver_cloud_plan: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { gameserver_cloud_plan: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    gameserver_cloud_plan: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        gameserver_cloud_plan: args.gameserver_cloud_plan,
                }

    return destroy.definition.url
            .replace('{gameserver_cloud_plan}', parsedArgs.gameserver_cloud_plan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\GameserverCloudPlanController::destroy
 * @see app/Http/Controllers/Admin/GameserverCloudPlanController.php:131
 * @route '/admin/gameserver-cloud-plans/{gameserver_cloud_plan}'
 */
destroy.delete = (args: { gameserver_cloud_plan: string | number } | [gameserver_cloud_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\GameserverCloudPlanController::destroy
 * @see app/Http/Controllers/Admin/GameserverCloudPlanController.php:131
 * @route '/admin/gameserver-cloud-plans/{gameserver_cloud_plan}'
 */
    const destroyForm = (args: { gameserver_cloud_plan: string | number } | [gameserver_cloud_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\GameserverCloudPlanController::destroy
 * @see app/Http/Controllers/Admin/GameserverCloudPlanController.php:131
 * @route '/admin/gameserver-cloud-plans/{gameserver_cloud_plan}'
 */
        destroyForm.delete = (args: { gameserver_cloud_plan: string | number } | [gameserver_cloud_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const GameserverCloudPlanController = { index, create, store, edit, update, destroy }

export default GameserverCloudPlanController