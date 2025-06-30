package com.hackathon_AI.utils;

import com.hackathon_AI.dto.response.TaskDTO;
import com.hackathon_AI.dto.response.UserDTO;
import com.hackathon_AI.model.Task;
import com.hackathon_AI.model.TaskStatus;
import com.hackathon_AI.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ConverterTest {

    @Mock
    private ModelMapper modelMapper;

    @InjectMocks
    private Converter converter;

    private User userCreator;
    private User userAssignee;
    private UserDTO userDTOCreator;
    private UserDTO userDTOAssignee;
    private Task task;
    @SuppressWarnings("unused")
    private TaskDTO taskDTO;

    @BeforeEach
    void setUp() {
        userCreator = new User();
        userCreator.setId(1);
        userCreator.setFirstName("John");
        userCreator.setLastName("Doe");
        userCreator.setBirthDate(LocalDate.of(1990, 1, 1));

        userAssignee = new User();
        userAssignee.setId(2);
        userAssignee.setFirstName("Jane");
        userAssignee.setLastName("Smith");
        userAssignee.setBirthDate(LocalDate.of(1992, 2, 2));

        userDTOCreator = UserDTO.builder()
                .id(1)
                .firstName("John")
                .lastName("Doe")
                .birthDate(LocalDate.of(1990, 1, 1))
                .build();

        userDTOAssignee = UserDTO.builder()
                .id(2)
                .firstName("Jane")
                .lastName("Smith")
                .birthDate(LocalDate.of(1992, 2, 2))
                .build();

        task = new Task();
        task.setId(10);
        task.setTitle("Test Task");
        task.setDescription("Description for test task");
        task.setEndDate(LocalDate.of(2025, 12, 31));
        task.setCreator(userCreator);
        task.setAssignee(userAssignee);
        task.setTags(Arrays.asList("work", "urgent"));
        task.setPriority("HIGH");
        task.setStatus(TaskStatus.PENDING);
        task.setCreatedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());

        taskDTO = TaskDTO.builder()
                .id(10)
                .title("Test Task")
                .description("Description for test task")
                .endDate(LocalDate.of(2025, 12, 31))
                .creator(userDTOCreator)
                .assignee(userDTOAssignee)
                .tags(Arrays.asList("work", "urgent"))
                .priority("HIGH")
                .status(TaskStatus.PENDING)
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }

    @Test
    void convertObjectShouldConvertSourceToTarget() {
        when(modelMapper.map(userCreator, UserDTO.class)).thenReturn(userDTOCreator);

        UserDTO result = converter.convertObject(userCreator, UserDTO.class);

        assertThat(result).isEqualTo(userDTOCreator);
        verify(modelMapper).map(userCreator, UserDTO.class);
    }

    @Test
    void convertListShouldConvertListOfSourcesToListOfTargets() {
        List<User> userList = Arrays.asList(userCreator, userAssignee);
        List<UserDTO> userDTOList = Arrays.asList(userDTOCreator, userDTOAssignee);

        when(modelMapper.map(userCreator, UserDTO.class)).thenReturn(userDTOCreator);
        when(modelMapper.map(userAssignee, UserDTO.class)).thenReturn(userDTOAssignee);

        List<UserDTO> result = converter.convertList(userList, UserDTO.class);

        assertThat(result).hasSize(2);
        assertThat(result).containsExactlyInAnyOrder(userDTOCreator, userDTOAssignee);
        verify(modelMapper, times(2)).map(any(User.class), eq(UserDTO.class));
    }

    @Test
    void convertListShouldReturnEmptyListWhenSourceListIsEmpty() {
        List<UserDTO> result = converter.convertList(Collections.emptyList(), UserDTO.class);

        assertThat(result).isEmpty();
        verify(modelMapper, times(0)).map(any(), any());
    }

    @Test
    void toTaskResponseDTOSuccessfullyConvertsTaskToTaskDTO() {
        TaskDTO result = converter.toTaskResponseDTO(task);

        assertThat(result.getId()).isEqualTo(task.getId());
        assertThat(result.getTitle()).isEqualTo(task.getTitle());
        assertThat(result.getDescription()).isEqualTo(task.getDescription());
        assertThat(result.getEndDate()).isEqualTo(task.getEndDate());
        assertThat(result.getCreator().getId()).isEqualTo(userCreator.getId());
        assertThat(result.getAssignee().getId()).isEqualTo(userAssignee.getId());
        assertThat(result.getTags()).isEqualTo(task.getTags());
        assertThat(result.getPriority()).isEqualTo(task.getPriority());
        assertThat(result.getStatus()).isEqualTo(task.getStatus());
        assertThat(result.getCreatedAt()).isEqualTo(task.getCreatedAt());
        assertThat(result.getUpdatedAt()).isEqualTo(task.getUpdatedAt());
    }

    @Test
    void toTaskResponseDTOShouldHandleNullCreator() {
        task.setCreator(null);
        TaskDTO result = converter.toTaskResponseDTO(task);

        assertThat(result.getCreator()).isNull();
        assertThat(result.getAssignee().getId()).isEqualTo(userAssignee.getId());
    }

    @Test
    void toTaskResponseDTOShouldHandleNullAssignee() {
        task.setAssignee(null);
        TaskDTO result = converter.toTaskResponseDTO(task);

        assertThat(result.getAssignee()).isNull();
        assertThat(result.getCreator().getId()).isEqualTo(userCreator.getId());
    }

    @Test
    void toTaskResponseDTOShouldHandleNullCreatorAndAssignee() {
        task.setCreator(null);
        task.setAssignee(null);
        TaskDTO result = converter.toTaskResponseDTO(task);

        assertThat(result.getCreator()).isNull();
        assertThat(result.getAssignee()).isNull();
    }

    @Test
    void toTaskResponseDTOListConvertsListOfTasksToListOfTaskDTOs() {
        Task task2 = new Task();
        task2.setId(20);
        task2.setTitle("Another Task");
        task2.setDescription("Description for another task");
        task2.setEndDate(LocalDate.of(2025, 11, 30));
        task2.setCreator(userCreator);
        task2.setAssignee(userAssignee);
        task2.setTags(Collections.singletonList("personal"));
        task2.setPriority("LOW");
        task2.setStatus(TaskStatus.COMPLETED);
        task2.setCreatedAt(LocalDateTime.now());
        task2.setUpdatedAt(LocalDateTime.now());

        List<Task> tasks = Arrays.asList(task, task2);
        List<TaskDTO> result = converter.toTaskResponseDTOList(tasks);

        assertThat(result).hasSize(2);
        assertThat(result.get(0).getId()).isEqualTo(task.getId());
        assertThat(result.get(1).getId()).isEqualTo(task2.getId());
    }

    @Test
    void toTaskResponseDTOListReturnsEmptyListForEmptyTaskList() {
        List<TaskDTO> result = converter.toTaskResponseDTOList(Collections.emptyList());

        assertThat(result).isEmpty();
    }
}