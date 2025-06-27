package com.hackathon_AI.services;

import com.hackathon_AI.dto.request.CreateTaskDTO;
import com.hackathon_AI.dto.request.UpdateTaskDTO;
import com.hackathon_AI.dto.request.UpdateTaskStatusDTO;
import com.hackathon_AI.dto.response.TaskDTO;
import com.hackathon_AI.dto.response.UserDTO;
import com.hackathon_AI.model.Task;
import com.hackathon_AI.model.TaskStatus;
import com.hackathon_AI.model.User;
import com.hackathon_AI.repositories.TaskRepository;
import com.hackathon_AI.repositories.UserRepository;
import com.hackathon_AI.utils.Converter;
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
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private Converter converter;

    @InjectMocks
    private TaskService taskService;

    private User creatorUser;
    private User assigneeUser;
    private Task task;
    private CreateTaskDTO createTaskDTO;
    private TaskDTO taskDTO;

    @BeforeEach
    void setUp() {
        creatorUser = new User();
        creatorUser.setId(1);
        creatorUser.setFirstName("Creator");
        creatorUser.setLastName("User");
        creatorUser.setBirthDate(LocalDate.of(1990, 1, 1));

        assigneeUser = new User();
        assigneeUser.setId(2);
        assigneeUser.setFirstName("Assignee");
        assigneeUser.setLastName("User");
        assigneeUser.setBirthDate(LocalDate.of(1985, 5, 15));

        task = new Task();
        task.setId(1);
        task.setTitle("Original Task Title");
        task.setDescription("Original Task Description");
        task.setCreator(creatorUser);
        task.setAssignee(assigneeUser);
        task.setEndDate(LocalDate.now().plusDays(7));
        task.setPriority("HIGH");
        task.setStatus(TaskStatus.PENDING);
        task.setTags(Arrays.asList("tag1", "tag2"));
        task.setCreatedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());

        createTaskDTO = new CreateTaskDTO();
        createTaskDTO.setTitle("New Create Task Title");
        createTaskDTO.setDescription("New Create Task Description");
        createTaskDTO.setCreatorId(creatorUser.getId());
        createTaskDTO.setAssigneeId(assigneeUser.getId());
        createTaskDTO.setEndDate(LocalDate.now().plusDays(10));
        createTaskDTO.setPriority("MEDIUM");
        createTaskDTO.setStatus(TaskStatus.IN_PROGRESS);
        createTaskDTO.setTags(Arrays.asList("newTag1", "newTag2"));

        UserDTO creatorUserDTO = UserDTO.builder()
                .id(creatorUser.getId())
                .firstName(creatorUser.getFirstName())
                .lastName(creatorUser.getLastName())
                .birthDate(creatorUser.getBirthDate())
                .build();

        UserDTO assigneeUserDTO = UserDTO.builder()
                .id(assigneeUser.getId())
                .firstName(assigneeUser.getFirstName())
                .lastName(assigneeUser.getLastName())
                .birthDate(assigneeUser.getBirthDate())
                .build();

        taskDTO = TaskDTO.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .endDate(task.getEndDate())
                .creator(creatorUserDTO)
                .assignee(assigneeUserDTO)
                .tags(task.getTags())
                .priority(task.getPriority())
                .status(task.getStatus())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }

    @Test
    void shouldCreateTaskSuccessfully() {
        when(userRepository.findById(creatorUser.getId())).thenReturn(Optional.of(creatorUser));
        when(userRepository.findById(assigneeUser.getId())).thenReturn(Optional.of(assigneeUser));
        when(taskRepository.save(any(Task.class))).thenReturn(task);
        when(converter.toTaskResponseDTO(any(Task.class))).thenReturn(taskDTO);

        TaskDTO result = taskService.createTask(createTaskDTO);

        assertNotNull(result);
        assertEquals(taskDTO.getTitle(), result.getTitle());
        assertEquals(taskDTO.getCreator().getId(), result.getCreator().getId());
        assertEquals(taskDTO.getAssignee().getId(), result.getAssignee().getId());
        assertEquals(taskDTO.getPriority(), result.getPriority());

        verify(userRepository, times(1)).findById(creatorUser.getId());
        verify(userRepository, times(1)).findById(assigneeUser.getId());
        verify(taskRepository, times(1)).save(any(Task.class));
        verify(converter, times(1)).toTaskResponseDTO(any(Task.class));
    }

    @Test
    void shouldThrowEntityNotFoundExceptionWhenCreatorNotFoundOnCreate() {
        when(userRepository.findById(creatorUser.getId())).thenReturn(Optional.empty());

        EntityNotFoundException thrown = assertThrows(EntityNotFoundException.class, () -> {
            taskService.createTask(createTaskDTO);
        });

        assertEquals("Creator not found", thrown.getMessage());
        verify(userRepository, times(1)).findById(creatorUser.getId());
        verify(userRepository, never()).findById(assigneeUser.getId());
        verify(taskRepository, never()).save(any(Task.class));
        verify(converter, never()).toTaskResponseDTO(any(Task.class));
    }

    @Test
    void shouldThrowEntityNotFoundExceptionWhenAssigneeNotFoundOnCreate() {
        when(userRepository.findById(creatorUser.getId())).thenReturn(Optional.of(creatorUser));
        when(userRepository.findById(assigneeUser.getId())).thenReturn(Optional.empty());

        EntityNotFoundException thrown = assertThrows(EntityNotFoundException.class, () -> {
            taskService.createTask(createTaskDTO);
        });

        assertEquals("Assignee not found", thrown.getMessage());
        verify(userRepository, times(1)).findById(creatorUser.getId());
        verify(userRepository, times(1)).findById(assigneeUser.getId());
        verify(taskRepository, never()).save(any(Task.class));
        verify(converter, never()).toTaskResponseDTO(any(Task.class));
    }

    @Test
    void shouldUpdateTaskSuccessfully() {
        UpdateTaskDTO updateDto = new UpdateTaskDTO();
        updateDto.setTitle("Updated Title");
        updateDto.setDescription("Updated Description");
        updateDto.setEndDate(LocalDate.now().plusDays(15));
        updateDto.setTags(Collections.singletonList("updatedTag"));
        updateDto.setPriority("LOW");

        TaskDTO expectedTaskDTO = TaskDTO.builder()
                .id(task.getId())
                .title("Updated Title")
                .description("Updated Description")
                .endDate(LocalDate.now().plusDays(15))
                .creator(taskDTO.getCreator())
                .assignee(taskDTO.getAssignee())
                .tags(Collections.singletonList("updatedTag"))
                .priority("LOW")
                .status(task.getStatus())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();

        when(taskRepository.findById(task.getId())).thenReturn(Optional.of(task));
        when(taskRepository.save(any(Task.class))).thenReturn(task);
        when(converter.toTaskResponseDTO(any(Task.class))).thenReturn(expectedTaskDTO);

        TaskDTO result = taskService.updateTask(task.getId(), updateDto);

        assertNotNull(result);
        assertEquals(expectedTaskDTO.getTitle(), result.getTitle());
        assertEquals(expectedTaskDTO.getDescription(), result.getDescription());
        assertEquals(expectedTaskDTO.getEndDate(), result.getEndDate());
        assertEquals(expectedTaskDTO.getTags(), result.getTags());
        assertEquals(expectedTaskDTO.getPriority(), result.getPriority());

        verify(taskRepository, times(1)).findById(task.getId());
        verify(taskRepository, times(1)).save(task);
        verify(converter, times(1)).toTaskResponseDTO(task);
    }

    @Test
    void shouldUpdateTaskPartially() {
        UpdateTaskDTO updateDto = new UpdateTaskDTO();
        updateDto.setTitle("Partial Update Title");

        TaskDTO expectedTaskDTO = TaskDTO.builder()
                .id(task.getId())
                .title("Partial Update Title")
                .description(task.getDescription())
                .endDate(task.getEndDate())
                .creator(taskDTO.getCreator())
                .assignee(taskDTO.getAssignee())
                .tags(task.getTags())
                .priority(task.getPriority())
                .status(task.getStatus())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();


        when(taskRepository.findById(task.getId())).thenReturn(Optional.of(task));
        when(taskRepository.save(any(Task.class))).thenReturn(task);
        when(converter.toTaskResponseDTO(any(Task.class))).thenReturn(expectedTaskDTO);

        TaskDTO result = taskService.updateTask(task.getId(), updateDto);

        assertNotNull(result);
        assertEquals(expectedTaskDTO.getTitle(), result.getTitle());
        assertEquals(expectedTaskDTO.getDescription(), result.getDescription());
        assertEquals(expectedTaskDTO.getEndDate(), result.getEndDate());
        assertEquals(expectedTaskDTO.getTags(), result.getTags());
        assertEquals(expectedTaskDTO.getPriority(), result.getPriority());

        verify(taskRepository, times(1)).findById(task.getId());
        verify(taskRepository, times(1)).save(task);
        verify(converter, times(1)).toTaskResponseDTO(task);
    }

    @Test
    void shouldThrowEntityNotFoundExceptionWhenTaskNotFoundOnUpdate() {
        UpdateTaskDTO updateDto = new UpdateTaskDTO();
        when(taskRepository.findById(anyInt())).thenReturn(Optional.empty());

        EntityNotFoundException thrown = assertThrows(EntityNotFoundException.class, () -> {
            taskService.updateTask(999, updateDto);
        });

        assertEquals("Task not found", thrown.getMessage());
        verify(taskRepository, times(1)).findById(999);
        verify(taskRepository, never()).save(any(Task.class));
        verify(converter, never()).toTaskResponseDTO(any(Task.class));
    }

    @Test
    void shouldUpdateTaskStatusSuccessfully() {
        UpdateTaskStatusDTO updateStatusDto = new UpdateTaskStatusDTO();
        updateStatusDto.setStatus(TaskStatus.COMPLETED);

        TaskDTO expectedTaskDTO = TaskDTO.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .endDate(task.getEndDate())
                .creator(taskDTO.getCreator())
                .assignee(taskDTO.getAssignee())
                .tags(task.getTags())
                .priority(task.getPriority())
                .status(TaskStatus.COMPLETED)
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();

        when(taskRepository.findById(task.getId())).thenReturn(Optional.of(task));
        when(taskRepository.save(any(Task.class))).thenReturn(task);
        when(converter.toTaskResponseDTO(any(Task.class))).thenReturn(expectedTaskDTO);

        TaskDTO result = taskService.updateTaskStatus(task.getId(), updateStatusDto);

        assertNotNull(result);
        assertEquals(TaskStatus.COMPLETED, result.getStatus());
        verify(taskRepository, times(1)).findById(task.getId());
        verify(taskRepository, times(1)).save(task);
        verify(converter, times(1)).toTaskResponseDTO(task);
    }

    @Test
    void shouldThrowEntityNotFoundExceptionWhenTaskNotFoundOnUpdateStatus() {
        UpdateTaskStatusDTO updateStatusDto = new UpdateTaskStatusDTO();
        updateStatusDto.setStatus(TaskStatus.COMPLETED);

        when(taskRepository.findById(anyInt())).thenReturn(Optional.empty());

        EntityNotFoundException thrown = assertThrows(EntityNotFoundException.class, () -> {
            taskService.updateTaskStatus(999, updateStatusDto);
        });

        assertEquals("Task not found", thrown.getMessage());
        verify(taskRepository, times(1)).findById(999);
        verify(taskRepository, never()).save(any(Task.class));
        verify(converter, never()).toTaskResponseDTO(any(Task.class));
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
    void shouldThrowEntityNotFoundExceptionWhenTaskNotFoundOnDelete() {
        when(taskRepository.existsById(anyInt())).thenReturn(false);

        EntityNotFoundException thrown = assertThrows(EntityNotFoundException.class, () -> {
            taskService.deleteTask(999);
        });

        assertEquals("Task not found", thrown.getMessage());
        verify(taskRepository, times(1)).existsById(999);
        verify(taskRepository, never()).deleteById(any(Integer.class));
    }

    @Test
    void shouldListTasksByUserSuccessfully() {
        List<Task> userTasks = Arrays.asList(task);
        List<TaskDTO> userTaskDTOs = Arrays.asList(taskDTO);

        when(taskRepository.findByAssigneeId(assigneeUser.getId())).thenReturn(userTasks);
        when(converter.toTaskResponseDTOList(userTasks)).thenReturn(userTaskDTOs);

        List<TaskDTO> result = taskService.listTasksByUser(assigneeUser.getId());

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(userTaskDTOs, result);
        verify(taskRepository, times(1)).findByAssigneeId(assigneeUser.getId());
        verify(converter, times(1)).toTaskResponseDTOList(userTasks);
    }

    @Test
    void shouldReturnEmptyListWhenNoTasksForUser() {
        List<Task> emptyTaskList = Collections.emptyList();
        List<TaskDTO> emptyTaskDTOList = Collections.emptyList();

        when(taskRepository.findByAssigneeId(assigneeUser.getId())).thenReturn(emptyTaskList);
        when(converter.toTaskResponseDTOList(emptyTaskList)).thenReturn(emptyTaskDTOList);

        List<TaskDTO> result = taskService.listTasksByUser(assigneeUser.getId());

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(taskRepository, times(1)).findByAssigneeId(assigneeUser.getId());
        verify(converter, times(1)).toTaskResponseDTOList(emptyTaskList);
    }

    @Test
    void shouldSearchTasksByTagSuccessfully() {
        List<Task> taggedTasks = Collections.singletonList(task);
        List<TaskDTO> taggedTaskDTOs = Collections.singletonList(taskDTO);
        String tag = "tag1";

        when(taskRepository.findTasksByTagsContaining(tag)).thenReturn(taggedTasks);
        when(converter.toTaskResponseDTOList(taggedTasks)).thenReturn(taggedTaskDTOs);

        List<TaskDTO> result = taskService.searchTasksByTag(tag);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(taggedTaskDTOs, result);
        verify(taskRepository, times(1)).findTasksByTagsContaining(tag);
        verify(converter, times(1)).toTaskResponseDTOList(taggedTasks);
    }

    @Test
    void shouldReturnEmptyListWhenNoTasksFoundForTag() {
        List<Task> emptyTaskList = Collections.emptyList();
        List<TaskDTO> emptyTaskDTOList = Collections.emptyList();
        String tag = "nonexistentTag";

        when(taskRepository.findTasksByTagsContaining(tag)).thenReturn(emptyTaskList);
        when(converter.toTaskResponseDTOList(emptyTaskList)).thenReturn(emptyTaskDTOList);

        List<TaskDTO> result = taskService.searchTasksByTag(tag);

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(taskRepository, times(1)).findTasksByTagsContaining(tag);
        verify(converter, times(1)).toTaskResponseDTOList(emptyTaskList);
    }

    @Test
    void shouldListAllTasksSuccessfully() {
        User anotherCreator = new User();
        anotherCreator.setId(3);
        anotherCreator.setFirstName("Another");
        anotherCreator.setLastName("Creator");
        anotherCreator.setBirthDate(LocalDate.of(1995, 7, 20));

        User anotherAssignee = new User();
        anotherAssignee.setId(4);
        anotherAssignee.setFirstName("Another");
        anotherAssignee.setLastName("Assignee");
        anotherAssignee.setBirthDate(LocalDate.of(1992, 11, 5));

        Task anotherTask = new Task();
        anotherTask.setId(2);
        anotherTask.setTitle("Another Task");
        anotherTask.setCreator(anotherCreator);
        anotherTask.setAssignee(anotherAssignee);
        anotherTask.setStatus(TaskStatus.IN_PROGRESS);
        anotherTask.setPriority("MEDIUM");
        anotherTask.setCreatedAt(LocalDateTime.now());
        anotherTask.setUpdatedAt(LocalDateTime.now());
        anotherTask.setEndDate(LocalDate.now().plusDays(30));
        anotherTask.setDescription("Another task description");
        anotherTask.setTags(Arrays.asList("project", "feature"));

        List<Task> allTasks = Arrays.asList(task, anotherTask);

        UserDTO anotherCreatorDTO = UserDTO.builder()
                .id(anotherCreator.getId())
                .firstName(anotherCreator.getFirstName())
                .lastName(anotherCreator.getLastName())
                .birthDate(anotherCreator.getBirthDate())
                .build();

        UserDTO anotherAssigneeDTO = UserDTO.builder()
                .id(anotherAssignee.getId())
                .firstName(anotherAssignee.getFirstName())
                .lastName(anotherAssignee.getLastName())
                .birthDate(anotherAssignee.getBirthDate())
                .build();

        TaskDTO anotherTaskDTO = TaskDTO.builder()
                .id(anotherTask.getId())
                .title(anotherTask.getTitle())
                .description(anotherTask.getDescription())
                .endDate(anotherTask.getEndDate())
                .creator(anotherCreatorDTO)
                .assignee(anotherAssigneeDTO)
                .tags(anotherTask.getTags())
                .priority(anotherTask.getPriority())
                .status(anotherTask.getStatus())
                .createdAt(anotherTask.getCreatedAt())
                .updatedAt(anotherTask.getUpdatedAt())
                .build();

        List<TaskDTO> allTaskDTOs = Arrays.asList(taskDTO, anotherTaskDTO);

        when(taskRepository.findAll()).thenReturn(allTasks);
        when(converter.toTaskResponseDTOList(allTasks)).thenReturn(allTaskDTOs);

        List<TaskDTO> result = taskService.listAllTasks();

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(allTaskDTOs, result);
        verify(taskRepository, times(1)).findAll();
        verify(converter, times(1)).toTaskResponseDTOList(allTasks);
    }

    @Test
    void shouldReturnEmptyListWhenNoTasksExist() {
        List<Task> emptyTaskList = Collections.emptyList();
        List<TaskDTO> emptyTaskDTOList = Collections.emptyList();

        when(taskRepository.findAll()).thenReturn(emptyTaskList);
        when(converter.toTaskResponseDTOList(emptyTaskList)).thenReturn(emptyTaskDTOList);

        List<TaskDTO> result = taskService.listAllTasks();

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(taskRepository, times(1)).findAll();
        verify(converter, times(1)).toTaskResponseDTOList(emptyTaskList);
    }
}