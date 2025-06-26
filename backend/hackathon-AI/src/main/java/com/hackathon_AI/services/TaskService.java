package com.hackathon_AI.services;

import com.hackathon_AI.model.Task;
import com.hackathon_AI.model.TaskStatus;
import com.hackathon_AI.model.User;
import com.hackathon_AI.repositories.TaskRepository;
import com.hackathon_AI.repositories.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    public Task createTask(Task task) {
        validateTaskInput(task);

        User creator = userRepository.findById(task.getCreator().getId())
                .orElseThrow(() -> new IllegalArgumentException("Creator not found"));
        User assignee = userRepository.findById(task.getAssignee().getId())
                .orElseThrow(() -> new IllegalArgumentException("Assignee not found"));

        task.setCreator(creator);
        task.setAssignee(assignee);
        task.setCreatedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());

        return taskRepository.save(task);
    }

    public Task updateTask(Integer taskId, Task updatedData) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found"));

        if (updatedData.getTitle() != null && !updatedData.getTitle().isBlank()) {
            task.setTitle(updatedData.getTitle());
        }

        if (updatedData.getDescription() != null && !updatedData.getDescription().isBlank()) {
            task.setDescription(updatedData.getDescription());
        }

        if (updatedData.getEndDate() != null) {
            task.setEndDate(updatedData.getEndDate());
        }

        if (updatedData.getTags() != null && !updatedData.getTags().isEmpty()) {
            task.setTags(updatedData.getTags());
        }

        if (updatedData.getPriority() != null) {
            task.setPriority(updatedData.getPriority());
        }

        task.setUpdatedAt(LocalDateTime.now());

        return taskRepository.save(task);
    }

    public Task updateTaskStatus(Integer taskId, String newStatus) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found"));

        try {
            TaskStatus statusEnum = TaskStatus.valueOf(newStatus.toUpperCase());
            task.setStatus(statusEnum);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status value. Allowed values: " +
                    String.join(", ", getAllStatusValues()));
        }

        task.setUpdatedAt(LocalDateTime.now());
        return taskRepository.save(task);
    }

    private List<String> getAllStatusValues() {
        return List.of(TaskStatus.values()).stream()
                .map(Enum::name)
                .toList();
    }

    public void deleteTask(Integer taskId) {
        if (!taskRepository.existsById(taskId)) {
            throw new EntityNotFoundException("Task not found");
        }
        taskRepository.deleteById(taskId);
    }

    public List<Task> listTasksByUser(Integer userId) {
        return taskRepository.findByAssigneeId(userId);
    }

    public List<Task> searchTasksByTag(String tag) {
        return taskRepository.findTasksByTagsContaining(tag);
    }

    public List<Task> listAllTasks() {
        return taskRepository.findAll();
    }

    private void validateTaskInput(Task task) {
        if (task.getTitle() != null && task.getTitle().length() > 100) {
            throw new IllegalArgumentException("Title too long");
        }

        if (task.getDescription() != null && task.getDescription().length() > 1000) {
            throw new IllegalArgumentException("Description too long");
        }

        if (task.getEndDate() != null && task.getEndDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("End date cannot be in the past");
        }

        if (task.getTags() != null && String.join(",", task.getTags()).length() > 100) {
            throw new IllegalArgumentException("Tags too long");
        }

        if (task.getPriority() != null) {
            try {
                int p = Integer.parseInt(task.getPriority());
                if (p < 1 || p > 3) {
                    throw new IllegalArgumentException("Invalid priority value");
                }
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException("Priority must be numeric (1-3)");
            }
        }

        if (task.getAssignee() == null || task.getAssignee().getId() == null) {
            throw new IllegalArgumentException("Assignee is required");
        }
    }
}
