<?php

use App\Http\Controllers\Api\TaskController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return response()->json([
            'success' => true,
            'message' => 'User retrieved successfully',
            'data' => collect($request->user())->except('password', 'remember_token', 'two_factor_secret', 'two_factor_recovery_codes'),
        ]);
    });

    Route::apiResource('tasks', TaskController::class);
});