<?php

namespace App\OpenApi;

use OpenApi\Attributes as OA;

#[OA\Info(
    version: '1.0.0',
    title: 'Task API',
    description: 'API documentation for Task API'
)]
#[OA\Server(
    url: '/api',
    description: 'API Server'
)]
class OpenApiSpec
{
}