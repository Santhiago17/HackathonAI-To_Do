package com.hackathon_AI.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.hackathon_AI.dto.request.CreateTaskDTO;
import com.hackathon_AI.dto.request.UpdateTaskDTO;
import com.hackathon_AI.dto.request.UpdateTaskStatusDTO;
import com.hackathon_AI.dto.response.TaskDTO;
import com.hackathon_AI.dto.response.UserDTO;
import com.hackathon_AI.model.TaskStatus;
import com.hackathon_AI.services.TaskService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
@AutoConfigureWebMvc
@ComponentScan("com.hackathon_AI") // Alterado para o pacote base da aplicação
public class TaskControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private TaskService taskService;

    @Autowired
    private RequestMappingHandlerMapping handlerMapping;

    private ObjectMapper objectMapper;

    private UserDTO creatorUserDTO;
    private UserDTO assigneeUserDTO;
    private TaskDTO taskDTO;

    @Configuration
    static class TestConfig {
        @Bean
        @Primary
        public TaskService mockTaskService() {
            return mock(TaskService.class);
        }
    }

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        creatorUserDTO = UserDTO.builder()
                .id(1)
                .firstName("Creator")
                .lastName("User")
                .birthDate(LocalDate.of(1990, 1, 1))
                .build();

        assigneeUserDTO = UserDTO.builder()
                .id(2)
                .firstName("Assignee")
                .lastName("User")
                .birthDate(LocalDate.of(1985, 5, 15))
                .build();

        taskDTO = TaskDTO.builder()
                .id(1)
                .title("Test Task")
                .description("Description for test task")
                .endDate(LocalDate.now().plusDays(7))
                .creator(creatorUserDTO)
                .assignee(assigneeUserDTO)
                .tags(Arrays.asList("tag1", "tag2"))
                .priority("HIGH")
                .status(TaskStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Test
    void shouldCreateTaskAndReturn201Created() throws Exception {
        CreateTaskDTO createTaskDTO = new CreateTaskDTO();
        createTaskDTO.setTitle("New Task Title");
        createTaskDTO.setDescription("New Task Description");
        createTaskDTO.setEndDate(LocalDate.now().plusDays(10));
        createTaskDTO.setCreatorId(creatorUserDTO.getId());
        createTaskDTO.setAssigneeId(assigneeUserDTO.getId());
        createTaskDTO.setTags(Collections.singletonList("new_tag"));
        createTaskDTO.setPriority("MEDIUM");
        createTaskDTO.setStatus(TaskStatus.IN_PROGRESS);

        when(taskService.createTask(any(CreateTaskDTO.class))).thenReturn(taskDTO);

        mockMvc.perform(post("/api/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createTaskDTO)))
                .andDo(print())
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(taskDTO.getId()))
                .andExpect(jsonPath("$.title").value(taskDTO.getTitle()))
                .andExpect(jsonPath("$.creator.id").value(creatorUserDTO.getId()))
                .andExpect(jsonPath("$.assignee.id").value(assigneeUserDTO.getId()));
    }

    @Test
    void shouldReturnBadRequestWhenCreateTaskWithInvalidData() throws Exception {
        CreateTaskDTO invalidTaskDTO = new CreateTaskDTO();
        invalidTaskDTO.setTitle("");
        invalidTaskDTO.setDescription("Description");
        invalidTaskDTO.setEndDate(LocalDate.now().plusDays(5));
        invalidTaskDTO.setCreatorId(1);
        invalidTaskDTO.setAssigneeId(2);
        invalidTaskDTO.setTags(Collections.singletonList("tag"));
        invalidTaskDTO.setPriority("HIGH");
        invalidTaskDTO.setStatus(TaskStatus.PENDING);

        mockMvc.perform(post("/api/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidTaskDTO)))
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.title").exists());
    }

    @Test
    void shouldGetAllTasksAndReturn200Ok() throws Exception {
        List<TaskDTO> tasks = Arrays.asList(taskDTO, TaskDTO.builder().id(2).title("Another Task").creator(creatorUserDTO).assignee(assigneeUserDTO).status(TaskStatus.COMPLETED).build());
        when(taskService.listAllTasks()).thenReturn(tasks);

        mockMvc.perform(get("/api/tasks")
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].title").value(taskDTO.getTitle()))
                .andExpect(jsonPath("$[1].title").value("Another Task"));
    }

    @Test
    void shouldGetTasksByUserAndReturn200Ok() throws Exception {
        List<TaskDTO> userTasks = Collections.singletonList(taskDTO);
        Integer userId = assigneeUserDTO.getId();
        when(taskService.listTasksByUser(userId)).thenReturn(userTasks);

        mockMvc.perform(get("/api/tasks/user/{userId}", userId)
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].id").value(taskDTO.getId()));
    }

    @Test
    void shouldSearchTasksByTagAndReturn200Ok() throws Exception {
        List<TaskDTO> taggedTasks = Collections.singletonList(taskDTO);
        String tag = "tag1";
        when(taskService.searchTasksByTag(tag)).thenReturn(taggedTasks);

        mockMvc.perform(get("/api/tasks/search")
                .param("tag", tag)
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].id").value(taskDTO.getId()));
    }

    @Test
    void shouldUpdateTaskAndReturn200Ok() throws Exception {
        UpdateTaskDTO updateTaskDTO = new UpdateTaskDTO();
        updateTaskDTO.setTitle("Updated Task Title");
        updateTaskDTO.setDescription("Updated Task Description");
        updateTaskDTO.setPriority("HIGH");

        TaskDTO updatedTaskDTO = TaskDTO.builder()
                .id(taskDTO.getId())
                .title("Updated Task Title")
                .description("Updated Task Description")
                .endDate(taskDTO.getEndDate())
                .creator(taskDTO.getCreator())
                .assignee(taskDTO.getAssignee())
                .tags(taskDTO.getTags())
                .priority(taskDTO.getPriority())
                .status(TaskStatus.PENDING)
                .createdAt(taskDTO.getCreatedAt())
                .updatedAt(LocalDateTime.now())
                .build();

        when(taskService.updateTask(eq(taskDTO.getId()), any(UpdateTaskDTO.class))).thenReturn(updatedTaskDTO);

        mockMvc.perform(put("/api/tasks/{id}", taskDTO.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateTaskDTO)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Task Title"))
                .andExpect(jsonPath("$.description").value("Updated Task Description"));
    }

    @Test
    void shouldReturnBadRequestWhenUpdateTaskWithInvalidData() throws Exception {
        UpdateTaskDTO invalidUpdateTaskDTO = new UpdateTaskDTO();
        invalidUpdateTaskDTO.setTitle("Title too long...............................................................................................................");

        mockMvc.perform(put("/api/tasks/{id}", taskDTO.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidUpdateTaskDTO)))
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.title").exists());
    }

    @Test
    void shouldUpdateTaskStatusAndReturn200Ok() throws Exception {
        UpdateTaskStatusDTO updateStatusDTO = new UpdateTaskStatusDTO();
        updateStatusDTO.setStatus(TaskStatus.COMPLETED);

        TaskDTO updatedTaskDTO = TaskDTO.builder()
                .id(taskDTO.getId())
                .title(taskDTO.getTitle())
                .description(taskDTO.getDescription())
                .endDate(taskDTO.getEndDate())
                .creator(taskDTO.getCreator())
                .assignee(taskDTO.getAssignee())
                .tags(taskDTO.getTags())
                .priority(taskDTO.getPriority())
                .status(TaskStatus.COMPLETED)
                .createdAt(taskDTO.getCreatedAt())
                .updatedAt(LocalDateTime.now())
                .build();

        when(taskService.updateTaskStatus(eq(taskDTO.getId()), any(UpdateTaskStatusDTO.class))).thenReturn(updatedTaskDTO);

        mockMvc.perform(put("/api/tasks/{id}/status", taskDTO.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateStatusDTO)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("COMPLETED"));
    }

    @Test
    void shouldDeleteTaskAndReturn204NoContent() throws Exception {
        doNothing().when(taskService).deleteTask(taskDTO.getId());

        mockMvc.perform(delete("/api/tasks/{id}", taskDTO.getId()))
                .andDo(print())
                .andExpect(status().isNoContent());

        verify(taskService, times(1)).deleteTask(taskDTO.getId());
    }

    @Test
    void shouldDiscoverAllEndpoints() {
        System.out.println("\n--- DISCOVERING SPRING MVC ENDPOINTS (TaskController) ---");
        handlerMapping.getHandlerMethods().forEach((mapping, method) -> {
            System.out.println("  " + mapping.getPatternsCondition() + " " + method.getMethod().getName() + " (" + method.getBeanType().getSimpleName() + ")");
        });
        System.out.println("-----------------------------------------------------------\n");
    }
}