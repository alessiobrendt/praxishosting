<?php

use App\Services\SiteRenderService;

beforeEach(function () {
    $this->service = new SiteRenderService;
});

test('isPageActive returns true for index', function () {
    expect($this->service->isPageActive(null, 'index'))->toBeTrue();
    expect($this->service->isPageActive([], 'index'))->toBeTrue();
    expect($this->service->isPageActive(['pages_meta' => []], 'index'))->toBeTrue();
});

test('isPageActive returns false for non-index when customPageData is null', function () {
    expect($this->service->isPageActive(null, 'notfallinformationen'))->toBeFalse();
});

test('isPageActive returns false for non-index when pages_meta has no entry', function () {
    expect($this->service->isPageActive(['pages_meta' => []], 'notfallinformationen'))->toBeFalse();
    expect($this->service->isPageActive(['pages_meta' => ['other' => ['active' => true]]], 'notfallinformationen'))->toBeFalse();
});

test('isPageActive returns false when pages_meta entry has active false', function () {
    $data = [
        'pages_meta' => [
            'notfallinformationen' => ['active' => false],
        ],
    ];
    expect($this->service->isPageActive($data, 'notfallinformationen'))->toBeFalse();
});

test('isPageActive returns true when pages_meta entry has active true', function () {
    $data = [
        'pages_meta' => [
            'notfallinformationen' => ['active' => true],
        ],
    ];
    expect($this->service->isPageActive($data, 'notfallinformationen'))->toBeTrue();
});
