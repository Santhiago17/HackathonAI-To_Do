package com.hackathon_AI.services;

import com.hackathon_AI.dto.request.CreateTaskDTO;
import com.hackathon_AI.dto.request.UpdateTaskStatusDTO;
import com.hackathon_AI.dto.response.TaskDTO;
import com.hackathon_AI.dto.request.UpdateTaskDTO;
import com.hackathon_AI.model.Task;
import com.hackathon_AI.model.User;
import com.hackathon_AI.repositories.TaskRepository;
import com.hackathon_AI.repositories.UserRepository;
import com.hackathon_AI.utils.Converter;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

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

    public TaskDTO updateTask(Integer taskId, UpdateTaskDTO dto) {
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

        Optional.ofNullable(dto.getStatus())
                .ifPresent(task::setStatus);

        Optional.ofNullable(dto.getAssigneeId())
                .ifPresent(assigneeId -> {
                    User assignee = userRepository.findById(assigneeId)
                            .orElseThrow(() -> new EntityNotFoundException("Assignee not found"));
                    task.setAssignee(assignee);
                });

        return converter.toTaskResponseDTO(taskRepository.save(task));
    }

    public TaskDTO updateTaskStatus(Integer taskId, UpdateTaskStatusDTO newStatus) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found"));

        task.setStatus(newStatus.getStatus());

        return converter.toTaskResponseDTO(taskRepository.save(task));
    }

    public void deleteTask(Integer taskId) {
        if (!taskRepository.existsById(taskId)) {
            throw new EntityNotFoundException("Task not found");
        }
        taskRepository.deleteById(taskId);
    }

    public List<TaskDTO> listTasksByUser(Integer userId) {
        return converter.toTaskResponseDTOList(taskRepository.findByAssigneeId(userId));
    }

    public List<TaskDTO> searchTasksByTag(String tag) {
        return converter.toTaskResponseDTOList(taskRepository.findTasksByTagsContaining(tag));
    }

    public List<TaskDTO> listAllTasks() {
        return converter.toTaskResponseDTOList(taskRepository.findAll());
    }
}
