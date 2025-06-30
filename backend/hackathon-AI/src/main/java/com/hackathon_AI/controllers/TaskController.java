package com.hackathon_AI.controllers;

import com.hackathon_AI.dto.request.CreateTaskDTO;
import com.hackathon_AI.dto.request.UpdateTaskStatusDTO;
import com.hackathon_AI.dto.response.TaskDTO;
import com.hackathon_AI.dto.request.UpdateTaskDTO;
import com.hackathon_AI.services.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {
    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<TaskDTO> createTask(@Valid @RequestBody CreateTaskDTO task) {
        TaskDTO createdTask = taskService.createTask(task);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
    }

    @GetMapping
    public ResponseEntity<List<TaskDTO>> getAllTasks() {
        List<TaskDTO> tasks = taskService.listAllTasks();
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TaskDTO>> getTasksByUser(@PathVariable Integer userId) {
        List<TaskDTO> tasks = taskService.listTasksByUser(userId);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/search")
    public ResponseEntity<List<TaskDTO>> searchTasksByTag(@RequestParam String tag) {
        List<TaskDTO> tasks = taskService.searchTasksByTag(tag);
        return ResponseEntity.ok(tasks);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskDTO> updateTask(@PathVariable Integer id, @Valid @RequestBody UpdateTaskDTO task) {
        TaskDTO updatedTask = taskService.updateTask(id, task);
        return ResponseEntity.ok(updatedTask);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<TaskDTO> updateTaskStatus(@PathVariable Integer id, @RequestBody UpdateTaskStatusDTO newStatus) {
        TaskDTO updatedTask = taskService.updateTaskStatus(id, newStatus);
        return ResponseEntity.ok(updatedTask);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Integer id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
}
