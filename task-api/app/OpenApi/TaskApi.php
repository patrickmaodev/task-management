<?php

namespace App\OpenApi;

use OpenApi\Attributes as OA;

class TaskApi
{
    #[OA\Get(
        path: '/tasks',
        summary: 'Get all tasks for authenticated user',
        security: [['sanctum' => []]],
        tags: ['Tasks'],
        responses: [
            new OA\Response(response: 200, description: 'Tasks retrieved successfully')
        ]
    )]
    public function index() {}

    #[OA\Post(
        path: '/tasks',
        summary: 'Create a new task',
        security: [['sanctum' => []]],
        tags: ['Tasks'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['title'],
                properties: [
                    new OA\Property(property: 'title', type: 'string'),
                    new OA\Property(property: 'description', type: 'string', nullable: true),
                    new OA\Property(property: 'status', type: 'string', enum: ['pending', 'in_progress', 'completed']),
                    new OA\Property(property: 'due_date', type: 'string', format: 'date-time', nullable: true)
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: 'Task created successfully')
        ]
    )]
    public function store() {}

    #[OA\Get(
        path: '/tasks/{task}',
        summary: 'Get a specific task',
        security: [['sanctum' => []]],
        tags: ['Tasks'],
        parameters: [
            new OA\Parameter(name: 'task', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))
        ],
        responses: [
            new OA\Response(response: 200, description: 'Task retrieved successfully')
        ]
    )]
    public function show() {}

    #[OA\Put(
        path: '/tasks/{task}',
        summary: 'Update a specific task',
        security: [['sanctum' => []]],
        tags: ['Tasks'],
        parameters: [
            new OA\Parameter(name: 'task', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'title', type: 'string'),
                    new OA\Property(property: 'description', type: 'string', nullable: true),
                    new OA\Property(property: 'status', type: 'string', enum: ['pending', 'in_progress', 'completed']),
                    new OA\Property(property: 'due_date', type: 'string', format: 'date-time', nullable: true)
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Task updated successfully')
        ]
    )]
    public function update() {}

    #[OA\Delete(
        path: '/tasks/{task}',
        summary: 'Delete a specific task',
        security: [['sanctum' => []]],
        tags: ['Tasks'],
        parameters: [
            new OA\Parameter(name: 'task', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))
        ],
        responses: [
            new OA\Response(response: 200, description: 'Task deleted successfully')
        ]
    )]
    public function destroy() {}
}
