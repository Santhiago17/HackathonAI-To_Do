package com.hackathon_AI.repositories;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.hackathon_AI.model.Task;
import com.hackathon_AI.model.TaskStatus;
import com.hackathon_AI.model.User;

@ExtendWith(MockitoExtension.class)
public class TaskRepositoryTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private UserRepository userRepository;

    @Test
    public void shouldSaveTask() {
        User user = new User();
        user.setId(1);
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setBirthDate(LocalDate.of(1990, 1, 1));

        Task task = new Task();
        task.setCreator(user);
        task.setAssignee(user);
        task.setTitle("Test Task");
        task.setDescription("Test Description");
        task.setEndDate(LocalDate.now().plusDays(1));
        task.setStatus(TaskStatus.COMPLETED);

        when(taskRepository.save(any(Task.class))).thenReturn(task);

        Task savedTask = taskRepository.save(task);

        assertThat(savedTask).isNotNull();
        assertThat(savedTask.getTitle()).isEqualTo(task.getTitle());
        verify(taskRepository).save(task);
    }

    @Test
    public void shouldFindTaskById() {
        User user = new User();
        user.setId(1);
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setBirthDate(LocalDate.of(1990, 1, 1));

        Task task = new Task();
        task.setId(1);
        task.setCreator(user);
        task.setAssignee(user);
        task.setTitle("Test Task");
        task.setDescription("Test Description");
        task.setEndDate(LocalDate.now().plusDays(1));
        task.setStatus(TaskStatus.COMPLETED);
        
        when(taskRepository.findById(anyInt())).thenReturn(Optional.of(task));

        Optional<Task> found = taskRepository.findById(1);

        assertThat(found).isPresent();
        assertThat(found.get().getTitle()).isEqualTo(task.getTitle());
        verify(taskRepository).findById(1);
    }

    @Test
    public void shouldFindAllTasks() {
        User user = new User();
        user.setId(1);
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setBirthDate(LocalDate.of(1990, 1, 1));

        Task task1 = new Task();
        task1.setId(1);
        task1.setCreator(user);
        task1.setAssignee(user);
        task1.setTitle("Task 1");
        task1.setDescription("Description 1");
        task1.setEndDate(LocalDate.now().plusDays(1));
        task1.setStatus(TaskStatus.PENDING);
        
        Task task2 = new Task();
        task2.setId(2);
        task2.setCreator(user);
        task2.setAssignee(user);
        task2.setTitle("Task 2");
        task2.setDescription("Description 2");
        task2.setEndDate(LocalDate.now().plusDays(2));
        task2.setStatus(TaskStatus.IN_PROGRESS);
        
        when(taskRepository.findAll()).thenReturn(Arrays.asList(task1, task2));

        List<Task> tasks = taskRepository.findAll();

        assertThat(tasks).hasSize(2);
        assertThat(tasks).extracting(Task::getTitle).containsExactlyInAnyOrder("Task 1", "Task 2");
        verify(taskRepository).findAll();
    }

    @Test
    public void shouldFindTasksByAssigneeId() {
        User user1 = new User();
        user1.setId(1);
        user1.setFirstName("John");
        user1.setLastName("Doe");
        user1.setBirthDate(LocalDate.of(1990, 1, 1));

        User user2 = new User();
        user2.setId(2);
        user2.setFirstName("Jane");
        user2.setLastName("Smith");
        user2.setBirthDate(LocalDate.of(1985, 5, 15));

        Task task1 = new Task();
        task1.setId(1);
        task1.setCreator(user1);
        task1.setAssignee(user1);
        task1.setTitle("Task for User 1");
        task1.setEndDate(LocalDate.now().plusDays(1));
        task1.setDescription("Description 1");
        task1.setStatus(TaskStatus.PENDING);
        
        Task task2 = new Task();
        task2.setId(2);
        task2.setCreator(user1);
        task2.setAssignee(user2);
        task2.setTitle("Task for User 2");
        task2.setEndDate(LocalDate.now().plusDays(1));
        task2.setDescription("Description 2");
        task2.setStatus(TaskStatus.IN_PROGRESS);
        
        when(taskRepository.findByAssigneeId(user1.getId())).thenReturn(Arrays.asList(task1));
        when(taskRepository.findByAssigneeId(user2.getId())).thenReturn(Arrays.asList(task2));

        List<Task> tasksForUser1 = taskRepository.findByAssigneeId(user1.getId());
        List<Task> tasksForUser2 = taskRepository.findByAssigneeId(user2.getId());

        assertThat(tasksForUser1).hasSize(1);
        assertThat(tasksForUser1.get(0).getTitle()).isEqualTo("Task for User 1");
        
        assertThat(tasksForUser2).hasSize(1);
        assertThat(tasksForUser2.get(0).getTitle()).isEqualTo("Task for User 2");
        verify(taskRepository).findByAssigneeId(user1.getId());
        verify(taskRepository).findByAssigneeId(user2.getId());
    }

    @Test
    public void shouldFindTasksByAssignee() {
        User assignee = new User();
        assignee.setId(1);
        assignee.setFirstName("Assignee");
        assignee.setLastName("User");
        assignee.setBirthDate(LocalDate.of(1990, 1, 1));

        Task task1 = new Task();
        task1.setId(1);
        task1.setCreator(assignee);
        task1.setAssignee(assignee);
        task1.setTitle("Task for Assignee");
        task1.setDescription("Description");
        task1.setEndDate(LocalDate.now().plusDays(1));
        task1.setStatus(TaskStatus.PENDING);

        when(taskRepository.findByAssignee(any(User.class))).thenReturn(Arrays.asList(task1));

        List<Task> foundTasks = taskRepository.findByAssignee(assignee);

        assertThat(foundTasks).hasSize(1);
        assertThat(foundTasks.get(0).getTitle()).isEqualTo("Task for Assignee");
        verify(taskRepository).findByAssignee(assignee);
    }

    @Test
    public void shouldFindTasksByTagsContaining() {
        User user = new User();
        user.setId(1);
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setBirthDate(LocalDate.of(1990, 1, 1));

        Task task1 = new Task();
        task1.setId(1);
        task1.setCreator(user);
        task1.setAssignee(user);
        task1.setTitle("Task with Work Tag");
        task1.setDescription("Work related task");
        task1.setEndDate(LocalDate.now().plusDays(1));
        task1.setStatus(TaskStatus.PENDING);
        task1.setTags(Arrays.asList("work", "project"));

        Task task2 = new Task();
        task2.setId(2);
        task2.setCreator(user);
        task2.setAssignee(user);
        task2.setTitle("Task with Personal Tag");
        task2.setDescription("Personal task");
        task2.setEndDate(LocalDate.now().plusDays(2));
        task2.setStatus(TaskStatus.IN_PROGRESS);
        task2.setTags(Arrays.asList("personal", "home"));

        when(taskRepository.findTasksByTagsContaining(anyString())).thenReturn(Arrays.asList(task1));

        List<Task> foundTasks = taskRepository.findTasksByTagsContaining("work");

        assertThat(foundTasks).hasSize(1);
        assertThat(foundTasks.get(0).getTitle()).isEqualTo("Task with Work Tag");
        verify(taskRepository).findTasksByTagsContaining("work");
    }

    @Test
    public void shouldFindTasksByExactTag() {
        User user = new User();
        user.setId(1);
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setBirthDate(LocalDate.of(1990, 1, 1));

        Task task1 = new Task();
        task1.setId(1);
        task1.setCreator(user);
        task1.setAssignee(user);
        task1.setTitle("Task Tagged Project");
        task1.setDescription("Project related task");
        task1.setEndDate(LocalDate.now().plusDays(1));
        task1.setStatus(TaskStatus.PENDING);
        task1.setTags(Arrays.asList("work", "project"));

        Task task2 = new Task();
        task2.setId(2);
        task2.setCreator(user);
        task2.setAssignee(user);
        task2.setTitle("Task Tagged Personal");
        task2.setDescription("Personal item");
        task2.setEndDate(LocalDate.now().plusDays(2));
        task2.setStatus(TaskStatus.IN_PROGRESS);
        task2.setTags(Arrays.asList("personal", "family"));

        when(taskRepository.findTasksByExactTag("project")).thenReturn(Arrays.asList(task1));

        List<Task> foundTasks = taskRepository.findTasksByExactTag("project");

        assertThat(foundTasks).hasSize(1);
        assertThat(foundTasks.get(0).getTitle()).isEqualTo("Task Tagged Project");
        verify(taskRepository).findTasksByExactTag("project");
    }
}