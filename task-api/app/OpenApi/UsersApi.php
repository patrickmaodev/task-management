<?php

namespace App\OpenApi;

use OpenApi\Attributes as OA;

#[OA\Get(
    path: '/users',
    summary: 'Get users',
    tags: ['Users'],
    responses: [
        new OA\Response(
            response: 200,
            description: 'Successful response'
        )
    ]
)]
class UsersApi
{
}
