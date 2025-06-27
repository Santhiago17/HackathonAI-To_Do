package com.hackathon_AI.services;

import com.hackathon_AI.dto.CreateTaskDTO;
import com.hackathon_AI.dto.TaskDTO;
import com.hackathon_AI.dto.TaskUpdateDTO;
import com.hackathon_AI.model.Task;
import com.hackathon_AI.model.TaskStatus;
import com.hackathon_AI.model.User;
import com.hackathon_AI.repositories.TaskRepository;
import com.hackathon_AI.repositories.UserRepository;
import com.hackathon_AI.utils.Converter;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final Converter converter;

    public TaskDTO createTask(CreateTaskDTO task) {
        User creator = userRepository.findById(task.getCreatorId())
                .orElseThrow(() -> new EntityNotFoundException("Creator not found"));
        User assignee = userRepository.findById(task.getAssigneeId())
                .orElseThrow(() -> new EntityNotFoundException("Assignee not found"));

        Task newTask = new Task();
        BeanUtils.copyProperties(task, newTask);
        newTask.setPriority(task.getPriority().toUpperCase());
        newTask.setCreator(creator);
        newTask.setAssignee(assignee);
        return converter.toTaskResponseDTO(taskRepository.save(newTask));
    }

    public TaskDTO updateTask(Integer taskId, TaskUpdateDTO dto) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found"));

        Optional.ofNullable(dto.getTitle())
                .filter(title -> !title.isBlank())
                .ifPresent(task::setTitle);

        Optional.ofNullable(dto.getDescription())
                .filter(desc -> !desc.isBlank())
                .ifPresent(task::setDescription);

        Optional.ofNullable(dto.getEndDate())
                .ifPresent(task::setEndDate);

        Optional.ofNullable(dto.getTags())
                .filter(tags -> !tags.isEmpty())
                .ifPresent(task::setTags);

        Optional.ofNullable(dto.getPriority())
                .ifPresent(priority -> task.setPriority(priority.toUpperCase()));

        return converter.toTaskResponseDTO(taskRepository.save(task));
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

    public List<TaskDTO> listAllTasks() {
        return converter.convertList(taskRepository.findAll(), TaskDTO.class);
    }
}
