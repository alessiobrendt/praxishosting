<?php

use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\DiscountCodeController;
use App\Http\Controllers\Admin\DunningLetterController;
use App\Http\Controllers\Admin\EmailController;
use App\Http\Controllers\Admin\GameServerAccountController;
use App\Http\Controllers\Admin\HostingPlanController;
use App\Http\Controllers\Admin\HostingServerController;
use App\Http\Controllers\Admin\InvoiceController;
use App\Http\Controllers\Admin\LegacyMigrationController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\ResellerDomainController;
use App\Http\Controllers\Admin\SearchController;
use App\Http\Controllers\Admin\SiteController as AdminSiteController;
use App\Http\Controllers\Admin\SubscriptionController;
use App\Http\Controllers\Admin\SystemSettingsController;
use App\Http\Controllers\Admin\TemplateController;
use App\Http\Controllers\Admin\TemplatePageController;
use App\Http\Controllers\Admin\TicketCategoryController;
use App\Http\Controllers\Admin\TicketController;
use App\Http\Controllers\Admin\TicketPriorityController;
use App\Http\Controllers\Admin\VoucherController;
use App\Http\Controllers\AiTokenController;
use App\Http\Controllers\Auth\SocialAuthController;
use App\Http\Controllers\BillingController;
use App\Http\Controllers\BillingPortalController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\GamingAccountController;
use App\Http\Controllers\GamingController;
use App\Http\Controllers\InvoiceController as CustomerInvoiceController;
use App\Http\Controllers\ModuleController;
use App\Http\Controllers\SiteCollaboratorController;
use App\Http\Controllers\SiteController;
use App\Http\Controllers\SiteRenderController;
use App\Http\Controllers\SiteSubscriptionController;
use App\Http\Controllers\SupportController;
use App\Http\Controllers\WebspaceAccountController;
use App\Http\Controllers\WebspaceController;
use App\Http\Controllers\WorkflowController;
use App\Http\Middleware\DisableCacheForSiteRender;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/auth/{provider}/redirect', [SocialAuthController::class, 'redirect'])
    ->name('auth.social.redirect');
Route::get('/auth/{provider}/callback', [SocialAuthController::class, 'callback'])
    ->name('auth.social.callback');

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('components', function () {
    return Inertia::render('components/Demo');
})->middleware(['auth', 'verified'])->name('components.demo');

Route::get('gallery', [GalleryController::class, 'index'])->name('gallery.index');
Route::get('gallery/preview/{template}', [GalleryController::class, 'preview'])->name('gallery.preview');

Route::get('site/{site:slug}/sitemap.xml', [\App\Http\Controllers\SiteSeoController::class, 'sitemap'])
    ->name('site-render.sitemap');
Route::get('site/{site:slug}/robots.txt', [\App\Http\Controllers\SiteSeoController::class, 'robotsTxt'])
    ->name('site-render.robots');
Route::get('site/{site:slug}/{pageSlug?}', [SiteRenderController::class, 'show'])
    ->where('pageSlug', '[a-z0-9\-]+')
    ->middleware(DisableCacheForSiteRender::class)
    ->name('site-render.show');

Route::middleware(['auth', 'verified', 'brand.domain'])->group(function () {
    Route::get('domains', [\App\Http\Controllers\DomainShopController::class, 'index'])->name('domains.index');
    Route::get('domains/search', [\App\Http\Controllers\DomainShopController::class, 'search'])->name('domains.search');
    Route::post('domains/check-availability', [\App\Http\Controllers\DomainShopController::class, 'checkAvailability'])->name('domains.check-availability');
    Route::get('domains/checkout', [\App\Http\Controllers\DomainShopController::class, 'checkout'])->name('domains.checkout');
    Route::post('domains/checkout', [\App\Http\Controllers\DomainShopController::class, 'storeCheckout'])->name('domains.checkout.store');
    Route::get('domains/checkout/redirect', [\App\Http\Controllers\DomainShopController::class, 'redirectToStripe'])->name('domains.checkout.redirect');
    Route::get('domains/checkout/dev-complete', [\App\Http\Controllers\DomainShopController::class, 'devCompleteCheckout'])->name('domains.checkout.dev-complete');
    Route::get('domains/checkout/success', [\App\Http\Controllers\DomainShopController::class, 'checkoutSuccess'])->name('domains.checkout.success');

    Route::get('domains/{reseller_domain}', [\App\Http\Controllers\DomainManageController::class, 'show'])->name('domains.manage.show');
    Route::get('domains/{reseller_domain}/authcode', [\App\Http\Controllers\DomainManageController::class, 'authcode'])->name('domains.manage.authcode');
    Route::get('domains/{reseller_domain}/contact', [\App\Http\Controllers\DomainManageController::class, 'getContact'])->name('domains.manage.contact');
    Route::put('domains/{reseller_domain}/contact', [\App\Http\Controllers\DomainManageController::class, 'updateContact'])->name('domains.manage.contact.update');
    Route::get('domains/{reseller_domain}/whois', [\App\Http\Controllers\DomainManageController::class, 'getWhoisLookup'])->name('domains.manage.whois');
    Route::put('domains/{reseller_domain}/whois', [\App\Http\Controllers\DomainManageController::class, 'updateWhoisPrivacy'])->name('domains.manage.whois.update');
    Route::put('domains/{reseller_domain}/nameserver', [\App\Http\Controllers\DomainManageController::class, 'updateNameserver'])->name('domains.manage.nameserver.update');
    Route::get('domains/{reseller_domain}/dns', [\App\Http\Controllers\DomainManageController::class, 'dns'])->name('domains.manage.dns');
    Route::put('domains/{reseller_domain}/dns', [\App\Http\Controllers\DomainManageController::class, 'updateDns'])->name('domains.manage.dns.update');
    Route::get('domains/{reseller_domain}/dnssec', [\App\Http\Controllers\DomainManageController::class, 'getDnssec'])->name('domains.manage.dnssec');
    Route::post('domains/{reseller_domain}/dnssec', [\App\Http\Controllers\DomainManageController::class, 'setDnssec'])->name('domains.manage.dnssec.store');
    Route::delete('domains/{reseller_domain}/dnssec', [\App\Http\Controllers\DomainManageController::class, 'deleteDnssec'])->name('domains.manage.dnssec.destroy');
    Route::post('domains/{reseller_domain}/renew', [\App\Http\Controllers\DomainManageController::class, 'renew'])->name('domains.manage.renew');
    Route::post('domains/{reseller_domain}/autorenew', [\App\Http\Controllers\DomainManageController::class, 'setAutoRenew'])->name('domains.manage.autorenew');

    Route::post('checkout', [CheckoutController::class, 'store'])->middleware('billing.profile')->name('checkout.store');
    Route::get('checkout/redirect', [CheckoutController::class, 'redirect'])->middleware('billing.profile')->name('checkout.redirect');
    Route::get('checkout/redirect-to-stripe', [CheckoutController::class, 'redirectToStripe'])->middleware('billing.profile')->name('checkout.redirect-to-stripe');
    Route::get('checkout/success', [CheckoutController::class, 'success'])->name('checkout.success');

    Route::get('webspace', [WebspaceController::class, 'index'])->name('webspace.index');
    Route::get('webspace/checkout', [WebspaceController::class, 'checkout'])->name('webspace.checkout');
    Route::post('webspace/checkout', [WebspaceController::class, 'storeCheckout'])->middleware('billing.profile')->name('webspace.checkout.store');
    Route::get('webspace-accounts', [WebspaceAccountController::class, 'index'])->name('webspace-accounts.index');
    Route::get('webspace-accounts/{webspace_account}/plesk-login', [WebspaceAccountController::class, 'pleskLogin'])->name('webspace-accounts.plesk-login');
    Route::get('webspace-accounts/{webspace_account}', [WebspaceAccountController::class, 'show'])->name('webspace-accounts.show');

    Route::get('gaming', [GamingController::class, 'index'])->name('gaming.index');
    Route::get('gaming/checkout/pterodactyl-nests', [GamingController::class, 'pterodactylNests'])->name('gaming.checkout.pterodactyl-nests');
    Route::get('gaming/checkout/pterodactyl-eggs', [GamingController::class, 'pterodactylEggs'])->name('gaming.checkout.pterodactyl-eggs');
    Route::get('gaming/checkout', [GamingController::class, 'checkout'])->name('gaming.checkout');
    Route::post('gaming/checkout', [GamingController::class, 'storeCheckout'])->middleware('billing.profile')->name('gaming.checkout.store');
    Route::get('gaming-accounts', [GamingAccountController::class, 'index'])->name('gaming-accounts.index');
    Route::get('gaming-accounts/{game_server_account}', [GamingAccountController::class, 'show'])->name('gaming-accounts.show');
    Route::get('gaming-accounts/{game_server_account}/overview', [GamingAccountController::class, 'overview'])->name('gaming-accounts.overview');
    Route::post('gaming-accounts/{game_server_account}/power', [GamingAccountController::class, 'power'])->name('gaming-accounts.power');
    Route::post('gaming-accounts/{game_server_account}/renew', [GamingAccountController::class, 'renew'])
        ->middleware('billing.profile')
        ->name('gaming-accounts.renew');

    Route::get('invoices/{invoice}/pdf', [CustomerInvoiceController::class, 'downloadPdf'])->name('invoices.pdf');
    Route::get('invoices/{invoice}/xml', [CustomerInvoiceController::class, 'downloadXml'])->name('invoices.xml');
    Route::get('billing', [BillingController::class, 'index'])->name('billing.index');
    Route::get('billing/portal', [BillingPortalController::class, 'redirect'])->name('billing.portal');
    Route::post('billing/ai-tokens/checkout', [AiTokenController::class, 'checkout'])
        ->middleware('billing.profile')
        ->name('billing.ai-tokens.checkout');
    Route::post('billing/balance/checkout', [BillingController::class, 'balanceCheckout'])
        ->middleware('billing.profile')
        ->name('billing.balance.checkout');

    Route::middleware('brand.feature.sites')->group(function () {
        Route::get('sites/{site}/design', [SiteController::class, 'design'])->name('sites.design');
        Route::get('sites/{site}/preview/{pageSlug?}', [SiteRenderController::class, 'preview'])
            ->name('sites.preview')
            ->where('pageSlug', '[a-z0-9\-]+');
        Route::resource('sites', SiteController::class);
        Route::post('sites/{site}/subscription/cancel', [SiteSubscriptionController::class, 'cancel'])->name('sites.subscription.cancel');
        Route::post('sites/{site}/preview', [SiteRenderController::class, 'storePreviewDraft'])->name('sites.preview.store');
        Route::get('sites/{site}/designer/state', [\App\Http\Controllers\SiteDesignerController::class, 'state'])->name('sites.designer.state');
        Route::post('sites/{site}/designer/draft', [\App\Http\Controllers\SiteDesignerController::class, 'draft'])->name('sites.designer.draft');
        Route::post('sites/{site}/designer/publish', [\App\Http\Controllers\SiteDesignerController::class, 'publish'])->name('sites.designer.publish');
        Route::patch('sites/{site}/designer/blocks/{blockId}', [\App\Http\Controllers\SiteDesignerController::class, 'updateBlock'])->name('sites.designer.blocks.update')->where('blockId', '[a-zA-Z0-9_\-]+');
        Route::post('sites/{site}/designer/blocks', [\App\Http\Controllers\SiteDesignerController::class, 'storeBlock'])->name('sites.designer.blocks.store');
        Route::delete('sites/{site}/designer/blocks/{blockId}', [\App\Http\Controllers\SiteDesignerController::class, 'destroyBlock'])->name('sites.designer.blocks.destroy')->where('blockId', '[a-zA-Z0-9_\-]+');
        Route::post('sites/{site}/designer/upload', [\App\Http\Controllers\SiteDesignerController::class, 'upload'])->name('sites.designer.upload');
        Route::get('sites/{site}/images', [SiteController::class, 'indexImages'])->name('sites.images.index');
        Route::post('sites/{site}/images', [SiteController::class, 'uploadImage'])->name('sites.images.store');
        Route::delete('sites/{site}/images', [SiteController::class, 'destroyImage'])->name('sites.images.destroy');
        Route::get('sites/{site}/collaborators', [SiteCollaboratorController::class, 'index'])->name('sites.collaborators.index');
        Route::post('sites/{site}/collaborators', [SiteCollaboratorController::class, 'store'])->name('sites.collaborators.store');
        Route::delete('sites/{site}/collaborators/{user}', [SiteCollaboratorController::class, 'destroy'])->name('sites.collaborators.destroy');
        Route::delete('sites/{site}/invitations/{invitation}', [SiteCollaboratorController::class, 'destroyInvitation'])->name('sites.invitations.destroy');
        Route::get('sites/{site}/versions', [\App\Http\Controllers\SiteVersionController::class, 'index'])->name('sites.versions.index');
        Route::post('sites/{site}/versions/{version}/publish', [\App\Http\Controllers\SiteVersionController::class, 'publish'])->name('sites.versions.publish');
        Route::post('sites/{site}/versions/{version}/rollback', [\App\Http\Controllers\SiteVersionController::class, 'rollback'])->name('sites.versions.rollback');
        Route::get('sites/{site}/domains', [\App\Http\Controllers\SiteDomainController::class, 'index'])->name('sites.domains.index');
        Route::post('sites/{site}/domains', [\App\Http\Controllers\SiteDomainController::class, 'store'])->name('sites.domains.store');
        Route::post('sites/{site}/domains/{domain}/verify', [\App\Http\Controllers\SiteDomainController::class, 'verify'])->name('sites.domains.verify');
        Route::post('sites/{site}/domains/{domain}/set-primary', [\App\Http\Controllers\SiteDomainController::class, 'setPrimary'])->name('sites.domains.set-primary');
        Route::delete('sites/{site}/domains/{domain}', [\App\Http\Controllers\SiteDomainController::class, 'destroy'])->name('sites.domains.destroy');

        Route::get('modules/newsletter/sites/{site}', [ModuleController::class, 'newsletterSite'])->name('modules.newsletter.site');
        Route::post('modules/newsletter/sites/{site}/posts', [ModuleController::class, 'storePost'])->name('modules.newsletter.posts.store');
        Route::get('modules/contact/sites/{site}', [ModuleController::class, 'contactSubmissions'])->name('modules.contact.submissions');
    });

    Route::get('modules/newsletter', [ModuleController::class, 'newsletter'])->name('modules.newsletter.index');
    Route::get('modules/contact', [ModuleController::class, 'contact'])->name('modules.contact.index');

    Route::get('workflow-builder', [WorkflowController::class, 'index'])->name('workflow-builder.index');
    Route::get('workflow-builder/api/list', [WorkflowController::class, 'list'])->name('workflow-builder.list');
    Route::post('workflow-builder/api/save', [WorkflowController::class, 'store'])->name('workflow-builder.store');
    Route::get('workflow-builder/api/load/{id}', [WorkflowController::class, 'show'])->name('workflow-builder.show');

    Route::get('support', [SupportController::class, 'index'])->name('support.index');
    Route::get('support/create', [SupportController::class, 'create'])->name('support.create');
    Route::post('support', [SupportController::class, 'store'])->name('support.store');
    Route::get('support/{ticket}', [SupportController::class, 'show'])->name('support.show');
    Route::post('support/{ticket}/messages', [SupportController::class, 'storeMessage'])->name('support.messages.store');
});

Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('search', [SearchController::class, 'index'])->name('search');
    Route::get('activity-log', [ActivityLogController::class, 'index'])->name('activity-log.index');
    Route::get('invoices', [InvoiceController::class, 'index'])->name('invoices.index');
    Route::get('invoices/export', [InvoiceController::class, 'export'])->name('invoices.export');
    Route::get('invoices/create', [InvoiceController::class, 'create'])->name('invoices.create');
    Route::post('invoices', [InvoiceController::class, 'store'])->name('invoices.store');
    Route::get('invoices/{invoice}', [InvoiceController::class, 'show'])->name('invoices.show');
    Route::post('invoices/{invoice}/dunning-letters', [InvoiceController::class, 'storeDunningLetter'])->name('invoices.dunning-letters.store');
    Route::get('invoices/{invoice}/dunning/{dunning_letter}/pdf', [InvoiceController::class, 'dunningPdf'])->name('invoices.dunning-letters.pdf');
    Route::get('invoices/{invoice}/edit', [InvoiceController::class, 'edit'])->name('invoices.edit');
    Route::put('invoices/{invoice}', [InvoiceController::class, 'update'])->name('invoices.update');

    Route::get('dunning-letters', [DunningLetterController::class, 'index'])->name('dunning-letters.index');

    Route::get('subscriptions', [SubscriptionController::class, 'index'])->name('subscriptions.index');
    Route::get('sites', [AdminSiteController::class, 'index'])->name('sites.index');
    Route::get('sites/{site}', [AdminSiteController::class, 'show'])->name('sites.show');
    Route::put('sites/{site}/status', [AdminSiteController::class, 'updateStatus'])->name('sites.status.update');
    Route::put('sites/{site}/subscription', [AdminSiteController::class, 'updateSubscription'])->name('sites.subscription.update');
    Route::post('sites/{site}/subscription/cancel', [AdminSiteController::class, 'cancelSubscription'])->name('sites.subscription.cancel');
    Route::post('sites/{site}/subscription/reactivate', [AdminSiteController::class, 'reactivateSubscription'])->name('sites.subscription.reactivate');
    Route::post('sites/{site}/subscription/sync', [AdminSiteController::class, 'syncSubscription'])->name('sites.subscription.sync');
    Route::get('legacy-migration', [LegacyMigrationController::class, 'index'])->name('legacy-migration.index');
    Route::get('emails', [EmailController::class, 'index'])->name('emails.index');
    Route::get('emails/{emailTemplate:key}/edit', [EmailController::class, 'edit'])->name('emails.edit');
    Route::put('emails/{emailTemplate:key}', [EmailController::class, 'update'])->name('emails.update');
    Route::post('emails/{emailTemplate:key}/preview', [EmailController::class, 'preview'])->name('emails.preview');
    Route::post('emails/{emailTemplate:key}/send-test', [EmailController::class, 'sendTest'])->name('emails.send-test');
    Route::get('settings', [SystemSettingsController::class, 'index'])->name('settings.index');
    Route::put('settings', [SystemSettingsController::class, 'update'])->name('settings.update');
    Route::get('brands', [BrandController::class, 'index'])->name('brands.index');
    Route::get('brands/{brand}/edit', [BrandController::class, 'edit'])->name('brands.edit');
    Route::put('brands/{brand}', [BrandController::class, 'update'])->name('brands.update');
    Route::resource('discount-codes', DiscountCodeController::class)->except(['show']);
    Route::resource('vouchers', VoucherController::class)->except(['show', 'destroy']);

    Route::get('products', [ProductController::class, 'index'])->name('products.index');
    Route::get('hosting-servers/{hosting_server}/check', [HostingServerController::class, 'check'])->name('hosting-servers.check');
    Route::resource('hosting-servers', HostingServerController::class);
    Route::get('hosting-plans/pterodactyl-options', [HostingPlanController::class, 'pterodactylOptions'])->name('hosting-plans.pterodactyl-options');
    Route::resource('hosting-plans', HostingPlanController::class);
    Route::get('webspace-accounts', [\App\Http\Controllers\Admin\WebspaceAccountController::class, 'index'])->name('webspace-accounts.index');
    Route::post('webspace-accounts/{webspace_account}/retry-plesk', [\App\Http\Controllers\Admin\WebspaceAccountController::class, 'retryPlesk'])->name('webspace-accounts.retry-plesk');
    Route::get('webspace-accounts/{webspace_account}', [\App\Http\Controllers\Admin\WebspaceAccountController::class, 'show'])->name('webspace-accounts.show');
    Route::get('gaming-accounts', [GameServerAccountController::class, 'index'])->name('gaming-accounts.index');
    Route::post('gaming-accounts/{game_server_account}/retry-provisioning', [GameServerAccountController::class, 'retryProvisioning'])->name('gaming-accounts.retry-provisioning');
    Route::get('gaming-accounts/{game_server_account}', [GameServerAccountController::class, 'show'])->name('gaming-accounts.show');
    Route::resource('templates', TemplateController::class);
    Route::get('templates/{template}/design', [\App\Http\Controllers\Admin\TemplateDesignController::class, 'design'])->name('templates.design');
    Route::put('templates/{template}/design', [\App\Http\Controllers\Admin\TemplateDesignController::class, 'update'])->name('templates.design.update');
    Route::resource('templates.pages', TemplatePageController::class)->except(['index']);
    Route::get('templates/{template}/pages', [TemplatePageController::class, 'index'])->name('templates.pages.index');
    Route::get('templates/{template}/pages/{page}/data', [\App\Http\Controllers\Admin\TemplatePageDataController::class, 'edit'])->name('templates.pages.data.edit');
    Route::put('templates/{template}/pages/{page}/data', [\App\Http\Controllers\Admin\TemplatePageDataController::class, 'update'])->name('templates.pages.data.update');
    Route::get('domains', [ResellerDomainController::class, 'index'])->name('domains.index');
    Route::post('domains/sync', [ResellerDomainController::class, 'syncFromSkrime'])->name('domains.sync');
    Route::post('domains/import', [ResellerDomainController::class, 'import'])->name('domains.import');
    Route::get('domains/tld-pricelist', [\App\Http\Controllers\Admin\TldPricelistController::class, 'index'])->name('domains.tld-pricelist.index');
    Route::post('domains/tld-pricelist/sync', [\App\Http\Controllers\Admin\TldPricelistController::class, 'sync'])->name('domains.tld-pricelist.sync');
    Route::put('domains/tld-pricelist/bulk', [\App\Http\Controllers\Admin\TldPricelistController::class, 'bulk'])->name('domains.tld-pricelist.bulk');
    Route::get('domains/{reseller_domain}', [ResellerDomainController::class, 'show'])->name('domains.show');
    Route::put('domains/{reseller_domain}/customer', [ResellerDomainController::class, 'updateCustomer'])->name('domains.customer.update');
    Route::post('domains/{reseller_domain}/renew', [ResellerDomainController::class, 'renew'])->name('domains.renew');
    Route::post('domains/{reseller_domain}/autorenew', [ResellerDomainController::class, 'setAutoRenew'])->name('domains.autorenew');
    Route::get('domains/{reseller_domain}/authcode', [ResellerDomainController::class, 'authcode'])->name('domains.authcode');
    Route::post('domains/{reseller_domain}/cancel', [ResellerDomainController::class, 'cancel'])->name('domains.cancel');
    Route::put('domains/{reseller_domain}/nameserver', [ResellerDomainController::class, 'updateNameserver'])->name('domains.nameserver.update');
    Route::get('domains/{reseller_domain}/dns', [ResellerDomainController::class, 'dns'])->name('domains.dns');
    Route::put('domains/{reseller_domain}/dns', [ResellerDomainController::class, 'updateDns'])->name('domains.dns.update');

    Route::get('customers', [CustomerController::class, 'index'])->name('customers.index');
    Route::get('customers/{customer}', [CustomerController::class, 'show'])->name('customers.show');
    Route::get('customers/{customer}/edit', [CustomerController::class, 'edit'])->name('customers.edit');
    Route::put('customers/{customer}', [CustomerController::class, 'update'])->name('customers.update');
    Route::post('customers/{customer}/notes', [CustomerController::class, 'storeNote'])->name('customers.notes.store');
    Route::post('customers/{customer}/balance', [CustomerController::class, 'storeBalance'])->name('customers.balance.store');
    Route::post('customers/{customer}/ai-tokens', [CustomerController::class, 'storeAiTokens'])->name('customers.ai-tokens.store');

    Route::get('tickets', [TicketController::class, 'index'])->name('tickets.index');
    Route::get('tickets/{ticket}', [TicketController::class, 'show'])->name('tickets.show');
    Route::put('tickets/{ticket}', [TicketController::class, 'update'])->name('tickets.update');
    Route::post('tickets/{ticket}/messages', [TicketController::class, 'storeMessage'])->name('tickets.messages.store');
    Route::post('tickets/{ticket}/time-logs', [TicketController::class, 'storeTimeLog'])->name('tickets.time-logs.store');
    Route::post('tickets/{ticket}/todos', [TicketController::class, 'storeTodo'])->name('tickets.todos.store');
    Route::patch('tickets/{ticket}/todos/{todo}', [TicketController::class, 'updateTodo'])->name('tickets.todos.update');
    Route::delete('tickets/{ticket}/todos/{todo}', [TicketController::class, 'destroyTodo'])->name('tickets.todos.destroy');
    Route::post('tickets/{ticket}/merge', [TicketController::class, 'merge'])->name('tickets.merge');
    Route::resource('ticket-categories', TicketCategoryController::class)->except(['show']);
    Route::resource('ticket-priorities', TicketPriorityController::class)->except(['show']);
});

require __DIR__.'/settings.php';
