package com.hackathon_AI.services;

import com.hackathon_AI.model.Task;
import com.hackathon_AI.model.TaskStatus;
import com.hackathon_AI.model.User;
import com.hackathon_AI.repositories.TaskRepository;
import com.hackathon_AI.repositories.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private TaskService taskService;

    private User creatorUser;
    private User assigneeUser;
    private Task task;

    @BeforeEach
    void setUp() {
        creatorUser = new User();
        creatorUser.setId(1);
        creatorUser.setFirstName("Creator");
        creatorUser.setLastName("User");

        assigneeUser = new User();
        assigneeUser.setId(2);
        assigneeUser.setFirstName("Assignee");
        assigneeUser.setLastName("User");

        task = new Task();
        task.setId(1);
        task.setTitle("Test Task");
        task.setDescription("This is a test task.");
        task.setCreator(creatorUser);
        task.setAssignee(assigneeUser);
        task.setEndDate(LocalDate.now().plusDays(7));
        task.setPriority("2");
        task.setStatus(TaskStatus.PENDING); // Corrigido para PENDING
        task.setTags(Arrays.asList("tag1", "tag2"));
    }

    @Test
    void shouldCreateTaskSuccessfully() {
        when(userRepository.findById(creatorUser.getId())).thenReturn(Optional.of(creatorUser));
        when(userRepository.findById(assigneeUser.getId())).thenReturn(Optional.of(assigneeUser));
        when(taskRepository.save(any(Task.class))).thenReturn(task);

        Task createdTask = taskService.createTask(task);

        assertNotNull(createdTask);
        assertEquals(task.getTitle(), createdTask.getTitle());
        assertEquals(creatorUser, createdTask.getCreator());
        assertEquals(assigneeUser, createdTask.getAssignee());
        assertNotNull(createdTask.getCreatedAt());
        assertNotNull(createdTask.getUpdatedAt());
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    void shouldThrowExceptionWhenCreatorNotFoundOnCreate() {
        when(userRepository.findById(creatorUser.getId())).thenReturn(Optional.empty());

        IllegalArgumentException thrown = assertThrows(IllegalArgumentException.class, () -> {
            taskService.createTask(task);
        });

        assertEquals("Creator not found", thrown.getMessage());
        verify(taskRepository, never()).save(any(Task.class));
    }

    @Test
    void shouldThrowExceptionWhenAssigneeNotFoundOnCreate() {
        when(userRepository.findById(creatorUser.getId())).thenReturn(Optional.of(creatorUser));
        when(userRepository.findById(assigneeUser.getId())).thenReturn(Optional.empty());

        IllegalArgumentException thrown = assertThrows(IllegalArgumentException.class, () -> {
            taskService.createTask(task);
        });

        assertEquals("Assignee not found", thrown.getMessage());
        verify(taskRepository, never()).save(any(Task.class));
    }

    @Test
    void shouldThrowExceptionWhenTitleIsTooLongOnCreate() {
        task.setTitle("a".repeat(101));

        IllegalArgumentException thrown = assertThrows(IllegalArgumentException.class, () -> {
            taskService.createTask(task);
        });

        assertEquals("Title too long", thrown.getMessage());
        verify(taskRepository, never()).save(any(Task.class));
    }

    @Test
    void shouldThrowExceptionWhenDescriptionIsTooLongOnCreate() {
        task.setDescription("a".repeat(1001));

        IllegalArgumentException thrown = assertThrows(IllegalArgumentException.class, () -> {
            taskService.createTask(task);
        });

        assertEquals("Description too long", thrown.getMessage());
        verify(taskRepository, never()).save(any(Task.class));
    }

    @Test
    void shouldThrowExceptionWhenEndDateIsInThePastOnCreate() {
        task.setEndDate(LocalDate.now().minusDays(1));

        IllegalArgumentException thrown = assertThrows(IllegalArgumentException.class, () -> {
            taskService.createTask(task);
        });

        assertEquals("End date cannot be in the past", thrown.getMessage());
        verify(taskRepository, never()).save(any(Task.class));
    }

    @Test
    void shouldThrowExceptionWhenTagsAreTooLongOnCreate() {
        task.setTags(Collections.singletonList("a".repeat(101)));

        IllegalArgumentException thrown = assertThrows(IllegalArgumentException.class, () -> {
            taskService.createTask(task);
        });

        assertEquals("Tags too long", thrown.getMessage());
        verify(taskRepository, never()).save(any(Task.class));
    }

    @Test
    void shouldThrowExceptionWhenPriorityIsInvalidNumericOnCreate() {
        task.setPriority("0");

        IllegalArgumentException thrown = assertThrows(IllegalArgumentException.class, () -> {
            taskService.createTask(task);
        });

        assertEquals("Invalid priority value", thrown.getMessage());
        verify(taskRepository, never()).save(any(Task.class));

        task.setPriority("4");
        IllegalArgumentException thrown2 = assertThrows(IllegalArgumentException.class, () -> {
            taskService.createTask(task);
        });
        assertEquals("Invalid priority value", thrown2.getMessage());
    }

    @Test
    void shouldThrowExceptionWhenPriorityIsNotNumericOnCreate() {
        task.setPriority("high");

        IllegalArgumentException thrown = assertThrows(IllegalArgumentException.class, () -> {
            taskService.createTask(task);
        });

        assertEquals("Priority must be numeric (1-3)", thrown.getMessage());
        verify(taskRepository, never()).save(any(Task.class));
    }

    @Test
    void shouldThrowExceptionWhenAssigneeIsNullOnCreate() {
        task.setAssignee(null);

        IllegalArgumentException thrown = assertThrows(IllegalArgumentException.class, () -> {
            taskService.createTask(task);
        });

        assertEquals("Assignee is required", thrown.getMessage());
        verify(taskRepository, never()).save(any(Task.class));
    }

    @Test
    void shouldThrowExceptionWhenAssigneeIdIsNullOnCreate() {
        assigneeUser.setId(null);
        task.setAssignee(assigneeUser);

        IllegalArgumentException thrown = assertThrows(IllegalArgumentException.class, () -> {
            taskService.createTask(task);
        });

        assertEquals("Assignee is required", thrown.getMessage());
        verify(taskRepository, never()).save(any(Task.class));
    }

    @Test
    void shouldUpdateTaskSuccessfully() {
        Task updatedData = new Task();
        updatedData.setTitle("Updated Title");
        updatedData.setDescription("Updated Description");
        updatedData.setEndDate(LocalDate.now().plusDays(10));
        updatedData.setTags(Collections.singletonList("newTag"));
        updatedData.setPriority("1");

        when(taskRepository.findById(task.getId())).thenReturn(Optional.of(task));
        when(taskRepository.save(any(Task.class))).thenReturn(task);

        Task result = taskService.updateTask(task.getId(), updatedData);

        assertNotNull(result);
        assertEquals("Updated Title", result.getTitle());
        assertEquals("Updated Description", result.getDescription());
        assertEquals(LocalDate.now().plusDays(10), result.getEndDate());
        assertTrue(result.getTags().contains("newTag"));
        assertEquals("1", result.getPriority());
        assertNotNull(result.getUpdatedAt());
        verify(taskRepository, times(1)).save(task);
    }

    @Test
    void shouldUpdateTaskPartially() {
        Task updatedData = new Task();
        updatedData.setTitle("Only Title Updated");

        when(taskRepository.findById(task.getId())).thenReturn(Optional.of(task));
        when(taskRepository.save(any(Task.class))).thenReturn(task);

        Task result = taskService.updateTask(task.getId(), updatedData);

        assertNotNull(result);
        assertEquals("Only Title Updated", result.getTitle());
        assertEquals("This is a test task.", result.getDescription());
        assertNotNull(result.getUpdatedAt());
        verify(taskRepository, times(1)).save(task);
    }

    @Test
    void shouldThrowExceptionWhenTaskNotFoundOnUpdate() {
        when(taskRepository.findById(task.getId())).thenReturn(Optional.empty());

        EntityNotFoundException thrown = assertThrows(EntityNotFoundException.class, () -> {
            taskService.updateTask(task.getId(), new Task());
        });

        assertEquals("Task not found", thrown.getMessage());
        verify(taskRepository, never()).save(any(Task.class));
    }

    @Test
    void shouldUpdateTaskStatusSuccessfully() {
        when(taskRepository.findById(task.getId())).thenReturn(Optional.of(task));
        when(taskRepository.save(any(Task.class))).thenReturn(task);

        Task updatedTask = taskService.updateTaskStatus(task.getId(), "COMPLETED");

        assertNotNull(updatedTask);
        assertEquals(TaskStatus.COMPLETED, updatedTask.getStatus());
        assertNotNull(updatedTask.getUpdatedAt());
        verify(taskRepository, times(1)).save(task);
    }

    @Test
    void shouldThrowExceptionWhenTaskNotFoundOnUpdateStatus() {
        when(taskRepository.findById(task.getId())).thenReturn(Optional.empty());

        EntityNotFoundException thrown = assertThrows(EntityNotFoundException.class, () -> {
            taskService.updateTaskStatus(task.getId(), "COMPLETED");
        });

        assertEquals("Task not found", thrown.getMessage());
        verify(taskRepository, never()).save(any(Task.class));
    }

    @Test
    void shouldThrowExceptionWhenInvalidStatusOnUpdateStatus() {
        when(taskRepository.findById(task.getId())).thenReturn(Optional.of(task));

        IllegalArgumentException thrown = assertThrows(IllegalArgumentException.class, () -> {
            taskService.updateTaskStatus(task.getId(), "INVALID_STATUS");
        });

        assertTrue(thrown.getMessage().contains("Invalid status value"));
        verify(taskRepository, never()).save(any(Task.class));
    }

    @Test
    void shouldDeleteTaskSuccessfully() {
        when(taskRepository.existsById(task.getId())).thenReturn(true);
        doNothing().when(taskRepository).deleteById(task.getId());

        assertDoesNotThrow(() -> taskService.deleteTask(task.getId()));
        verify(taskRepository, times(1)).existsById(task.getId());
        verify(taskRepository, times(1)).deleteById(task.getId());
    }

    @Test
    void shouldThrowExceptionWhenTaskNotFoundOnDelete() {
        when(taskRepository.existsById(task.getId())).thenReturn(false);

        EntityNotFoundException thrown = assertThrows(EntityNotFoundException.class, () -> {
            taskService.deleteTask(task.getId());
        });

        assertEquals("Task not found", thrown.getMessage());
        verify(taskRepository, times(1)).existsById(task.getId());
        verify(taskRepository, never()).deleteById(any(Integer.class));
    }

    @Test
    void shouldListTasksByUserSuccessfully() {
        List<Task> userTasks = Arrays.asList(task, new Task());
        when(taskRepository.findByAssigneeId(assigneeUser.getId())).thenReturn(userTasks);

        List<Task> result = taskService.listTasksByUser(assigneeUser.getId());

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(userTasks, result);
        verify(taskRepository, times(1)).findByAssigneeId(assigneeUser.getId());
    }

    @Test
    void shouldReturnEmptyListWhenNoTasksForUser() {
        when(taskRepository.findByAssigneeId(assigneeUser.getId())).thenReturn(Collections.emptyList());

        List<Task> result = taskService.listTasksByUser(assigneeUser.getId());

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(taskRepository, times(1)).findByAssigneeId(assigneeUser.getId());
    }

    @Test
    void shouldSearchTasksByTagSuccessfully() {
        List<Task> taggedTasks = Collections.singletonList(task);
        String tag = "tag1";
        when(taskRepository.findTasksByTagsContaining(tag)).thenReturn(taggedTasks);

        List<Task> result = taskService.searchTasksByTag(tag);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(taggedTasks, result);
        verify(taskRepository, times(1)).findTasksByTagsContaining(tag);
    }

    @Test
    void shouldReturnEmptyListWhenNoTasksFoundForTag() {
        String tag = "nonexistentTag";
        when(taskRepository.findTasksByTagsContaining(tag)).thenReturn(Collections.emptyList());

        List<Task> result = taskService.searchTasksByTag(tag);

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(taskRepository, times(1)).findTasksByTagsContaining(tag);
    }
}