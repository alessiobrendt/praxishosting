{!! $iconAssets ?? '' !!}
<div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-6">
    <div class="flex items-center gap-3 mb-4">
        <i class="ri-error-warning-line text-2xl text-red-600 dark:text-red-400"></i>
        <h3 class="text-lg font-semibold text-red-800 dark:text-red-200">{{ $title ?? 'Error' }}</h3>
    </div>
    <p class="text-red-700 dark:text-red-300">{{ $message ?? 'An error occurred' }}</p>
</div>
