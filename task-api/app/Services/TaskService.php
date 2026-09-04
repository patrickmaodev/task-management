<?php

namespace App\Services;

use App\Models\Task;
use Illuminate\Database\Eloquent\Collection;

class TaskService
{
    /**
     * Get all tasks for a specific user.
     *
     * @param  int  $userId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getUserTasks(int $userId): Collection
    {
        return Task::where('user_id', $userId)->orderBy('created_at', 'desc')->get();
    }

    /**
     * Create a new task.
     *
     * @param  int  $userId
     * @param  array  $data
     * @return \App\Models\Task
     */
    public function create(int $userId, array $data): Task
    {
        return Task::create([
            'user_id' => $userId,
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'status' => $data['status'] ?? 'pending',
            'due_date' => $data['due_date'] ?? null,
        ]);
    }

    /**
     * Update an existing task.
     *
     * @param  \App\Models\Task  $task
     * @param  array  $data
     * @return \App\Models\Task
     */
    public function update(Task $task, array $data): Task
    {
        $task->update($data);
        return $task;
    }

    /**
     * Delete a task.
     *
     * @param  \App\Models\Task  $task
     * @return void
     */
    public function delete(Task $task): void
    {
        $task->delete();
    }
}
