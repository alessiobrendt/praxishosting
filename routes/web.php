<?php

use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\Admin\CommunicationController;
use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\DiscountCodeController;
use App\Http\Controllers\Admin\DunningLetterController;
use App\Http\Controllers\Admin\EmailController;
use App\Http\Controllers\Admin\InvoiceController;
use App\Http\Controllers\Admin\LegacyMigrationController;
use App\Http\Controllers\Admin\OrderConfirmationController;
use App\Http\Controllers\Admin\QuoteController;
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
use App\Http\Controllers\BillingController;
use App\Http\Controllers\BillingPortalController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\InvoiceController as CustomerInvoiceController;
use App\Http\Controllers\ModuleController;
use App\Http\Controllers\SiteCollaboratorController;
use App\Http\Controllers\SiteController;
use App\Http\Controllers\SiteRenderController;
use App\Http\Controllers\SiteSubscriptionController;
use App\Http\Controllers\SupportController;
use App\Http\Controllers\WorkflowController;
use App\Http\Middleware\DisableCacheForSiteRender;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

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

Route::get('site/{site:slug}/{pageSlug?}', [SiteRenderController::class, 'show'])
    ->where('pageSlug', '[a-z0-9\-]+')
    ->middleware(DisableCacheForSiteRender::class)
    ->name('site-render.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('checkout', [CheckoutController::class, 'store'])->middleware('billing.profile')->name('checkout.store');
    Route::get('checkout/redirect', [CheckoutController::class, 'redirect'])->middleware('billing.profile')->name('checkout.redirect');
    Route::get('checkout/success', [CheckoutController::class, 'success'])->name('checkout.success');

    Route::get('invoices/{invoice}/pdf', [CustomerInvoiceController::class, 'downloadPdf'])->name('invoices.pdf');
    Route::get('invoices/{invoice}/xml', [CustomerInvoiceController::class, 'downloadXml'])->name('invoices.xml');
    Route::get('billing', [BillingController::class, 'index'])->name('billing.index');
    Route::get('billing/portal', [BillingPortalController::class, 'redirect'])->name('billing.portal');

    Route::get('sites/{site}/design', [SiteController::class, 'design'])->name('sites.design');
    Route::get('sites/{site}/preview/{pageSlug?}', [SiteRenderController::class, 'preview'])
        ->name('sites.preview')
        ->where('pageSlug', '[a-z0-9\-]+');
    Route::resource('sites', SiteController::class);
    Route::post('sites/{site}/subscription/cancel', [SiteSubscriptionController::class, 'cancel'])->name('sites.subscription.cancel');
    Route::post('sites/{site}/preview', [SiteRenderController::class, 'storePreviewDraft'])->name('sites.preview.store');
    Route::get('sites/{site}/images', [SiteController::class, 'indexImages'])->name('sites.images.index');
    Route::post('sites/{site}/images', [SiteController::class, 'uploadImage'])->name('sites.images.store');
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

    Route::get('modules/newsletter', [ModuleController::class, 'newsletter'])->name('modules.newsletter.index');
    Route::get('modules/newsletter/sites/{site}', [ModuleController::class, 'newsletterSite'])->name('modules.newsletter.site');
    Route::post('modules/newsletter/sites/{site}/posts', [ModuleController::class, 'storePost'])->name('modules.newsletter.posts.store');
    Route::get('modules/contact', [ModuleController::class, 'contact'])->name('modules.contact.index');
    Route::get('modules/contact/sites/{site}', [ModuleController::class, 'contactSubmissions'])->name('modules.contact.submissions');

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

    Route::get('quotes', [QuoteController::class, 'index'])->name('quotes.index');
    Route::get('quotes/create', [QuoteController::class, 'create'])->name('quotes.create');
    Route::post('quotes', [QuoteController::class, 'store'])->name('quotes.store');
    Route::get('quotes/{quote}', [QuoteController::class, 'show'])->name('quotes.show');
    Route::get('quotes/{quote}/pdf', [QuoteController::class, 'pdf'])->name('quotes.pdf');

    Route::get('order-confirmations', [OrderConfirmationController::class, 'index'])->name('order-confirmations.index');
    Route::get('order-confirmations/create', [OrderConfirmationController::class, 'create'])->name('order-confirmations.create');
    Route::post('order-confirmations', [OrderConfirmationController::class, 'store'])->name('order-confirmations.store');
    Route::get('order-confirmations/{order_confirmation}', [OrderConfirmationController::class, 'show'])->name('order-confirmations.show');
    Route::get('order-confirmations/{order_confirmation}/pdf', [OrderConfirmationController::class, 'pdf'])->name('order-confirmations.pdf');

    Route::get('dunning-letters', [DunningLetterController::class, 'index'])->name('dunning-letters.index');

    Route::get('communications', [CommunicationController::class, 'index'])->name('communications.index');
    Route::get('communications/create', [CommunicationController::class, 'create'])->name('communications.create');
    Route::post('communications', [CommunicationController::class, 'store'])->name('communications.store');

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
    Route::resource('discount-codes', DiscountCodeController::class)->except(['show']);
    Route::resource('vouchers', VoucherController::class)->except(['show', 'destroy']);

    Route::resource('templates', TemplateController::class);
    Route::get('templates/{template}/design', [\App\Http\Controllers\Admin\TemplateDesignController::class, 'design'])->name('templates.design');
    Route::put('templates/{template}/design', [\App\Http\Controllers\Admin\TemplateDesignController::class, 'update'])->name('templates.design.update');
    Route::resource('templates.pages', TemplatePageController::class)->except(['index']);
    Route::get('templates/{template}/pages', [TemplatePageController::class, 'index'])->name('templates.pages.index');
    Route::get('templates/{template}/pages/{page}/data', [\App\Http\Controllers\Admin\TemplatePageDataController::class, 'edit'])->name('templates.pages.data.edit');
    Route::put('templates/{template}/pages/{page}/data', [\App\Http\Controllers\Admin\TemplatePageDataController::class, 'update'])->name('templates.pages.data.update');
    Route::get('customers', [CustomerController::class, 'index'])->name('customers.index');
    Route::get('customers/{customer}', [CustomerController::class, 'show'])->name('customers.show');
    Route::get('customers/{customer}/edit', [CustomerController::class, 'edit'])->name('customers.edit');
    Route::put('customers/{customer}', [CustomerController::class, 'update'])->name('customers.update');
    Route::post('customers/{customer}/notes', [CustomerController::class, 'storeNote'])->name('customers.notes.store');
    Route::post('customers/{customer}/balance', [CustomerController::class, 'storeBalance'])->name('customers.balance.store');

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

require __DIR__.'/api.php';
