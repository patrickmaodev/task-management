<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/users', function () {
    return response()->json([
        'data' => [
            [
                'id' => 1,
                'name' => 'Patrick',
                'email' => 'patrick@example.com',
            ],
        ],
    ]);
});